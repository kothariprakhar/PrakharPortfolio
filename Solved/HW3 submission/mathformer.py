import argparse
#import os
#import sys
#import shutil
import random
import numpy as np
#import time
import copy
import math
#import pickle

import torch
import torch.nn.functional as F
import torch.nn as nn
from torch.autograd import Variable
import csv
import matplotlib
matplotlib.use('Agg')  # non-interactive backend for saving figures
import matplotlib.pyplot as plt

# Auto-detect best available device: CUDA > MPS > CPU
if torch.cuda.is_available():
    DEVICE = torch.device('cuda:0')
elif torch.backends.mps.is_available():
    DEVICE = torch.device('mps')
else:
    DEVICE = torch.device('cpu')
print('Using device:', DEVICE)

# Global variables to capture attention data for heatmap / CSV output
global_attention_scores = None  # Will hold the 20x20 softmax probabilities
global_attention_output = None  # Will hold the 20xd_k weighted output

# Global variables for Question 3: manual attention adjustment
adjust_attention = False
CURRENT_TRG = None       # holds the current target tensor sequence for dynamic inspection
boost_amount = 2.0       # additive boost to raw scores before softmax


#def OutText(text,opt,screen=True):
#    if screen:
#        print(text)
#    if opt.log_file:
#        outFile = open(opt.log_file,"a+")
#        outFile.write(text+"\n")
        
def read_encode(file_name,vocab,words,corpus,threshold):
    
    wID = len(vocab)
    
    if threshold > -1:
        with open(file_name,'rt') as f:
            for line in f:
                line = line.replace('\n','')
                tokens = line.split(' ')
                for t in tokens:
                    try:
                        elem = words[t]
                    except:
                        elem = [wID,0]
                        vocab.append(t)
                        wID = wID + 1
                    elem[1] = elem[1] + 1
                    words[t] = elem

        temp = words
        words = {}
        vocab = []
        wID = 0
        words['<unk>'] = [wID,100]
        vocab.append('<unk>')
        for t in temp:
            if temp[t][1] >= threshold:
                vocab.append(t)
                wID = wID + 1
                words[t] = [wID,temp[t][1]]
            
                    
    with open(file_name,'rt') as f:
        for line in f:
            line = line.replace('\n','')
            tokens = line.split(' ')
            for t in tokens:
                try:
                    wID = words[t][0]
                except:
                    wID = words['<unk>'][0]
                corpus.append(wID)
                
    return [vocab,words,corpus]

class Embedder(nn.Module):
    def __init__(self, vocab_size, d_model):
        super().__init__()
        self.d_model = d_model
        self.embed = nn.Embedding(vocab_size, d_model)
    def forward(self, x):
        return self.embed(x.int())

class PositionalEncoder(nn.Module):
    def __init__(self, d_model, max_seq_len = 4096, dropout = 0.1):
        super().__init__()
        self.d_model = d_model
        self.dropout = nn.Dropout(dropout)
        # create constant 'pe' matrix with values dependant on 
        # pos and i
        pe = torch.zeros(max_seq_len, d_model)
        for pos in range(max_seq_len):
            for i in range(0, d_model, 2):
                pe[pos, i] = \
                math.sin(pos / (10000 ** ((2 * i)/d_model)))
                pe[pos, i + 1] = \
                math.cos(pos / (10000 ** ((2 * (i + 1))/d_model)))
        pe = pe.unsqueeze(0)
        self.register_buffer('pe', pe)
    
    def forward(self, x):
        # make embeddings relatively larger
        x = x * math.sqrt(self.d_model)
        #add constant to embedding
        seq_len = x.size(1)
        pe = Variable(self.pe[:,:seq_len], requires_grad=False)
        pe = pe.to(x.device)
        x = x + pe
        return self.dropout(x)
    
class Norm(nn.Module):
    def __init__(self, d_model, eps = 1e-6):
        super().__init__()
    
        self.size = d_model
        
        # create two learnable parameters to calibrate normalisation
        self.alpha = nn.Parameter(torch.ones(self.size))
        self.bias = nn.Parameter(torch.zeros(self.size))
        
        self.eps = eps
    
    def forward(self, x):
        norm = self.alpha * (x - x.mean(dim=-1, keepdim=True)) \
        / (x.std(dim=-1, keepdim=True) + self.eps) + self.bias
        return norm

def attention(q, k, v, d_k, p, mask=None, dropout=None):
    global global_attention_scores, global_attention_output

    seq_len = 20
    scale = math.sqrt(d_k)

    q_list = q.tolist()
    k_list = k.tolist()
    v_list = v.tolist()

    # Step 1: Compute raw attention scores via dot-product of Q and K^T
    # q, k, v shapes: [1][1][20][d_k]
    raw_scores = np.zeros((1, 1, seq_len, seq_len), np.float32)
    for i in range(seq_len):
        for j in range(seq_len):
            dot = 0.0
            for kk in range(d_k):
                dot += q_list[0][0][i][kk] * k_list[0][0][j][kk]
            raw_scores[0][0][i][j] = dot / scale

    # Step 2: Apply mask (set masked positions to -1e9)
    if mask is not None:
        mask_list = mask.tolist()
        for i in range(seq_len):
            for j in range(seq_len):
                if mask_list[0][i][j] == 0:
                    raw_scores[0][0][i][j] = -1e9

    # Step 2.5: Question 3 — Manual attention boost (before softmax)
    if adjust_attention and CURRENT_TRG is not None:
        lhs_var = CURRENT_TRG[0, 15].item()
        rhs_var = CURRENT_TRG[0, 17].item()
        
        # Dynamically find the value positions of the referenced variables
        for var_idx, val_pos in [(1, 2), (3, 4), (5, 6), (7, 8)]:
            if CURRENT_TRG[0, var_idx].item() == lhs_var or CURRENT_TRG[0, var_idx].item() == rhs_var:
                raw_scores[0][0][18][val_pos] += boost_amount
                
        # Also naturally boost the operator at position 16
        raw_scores[0][0][18][16] += boost_amount

    # Step 3: Apply softmax row-wise using for-loops
    prob_scores = np.zeros((1, 1, seq_len, seq_len), np.float32)
    for i in range(seq_len):
        # Find max for numerical stability
        row_max = -1e30
        for j in range(seq_len):
            if raw_scores[0][0][i][j] > row_max:
                row_max = raw_scores[0][0][i][j]
        # Compute exp and sum
        row_sum = 0.0
        for j in range(seq_len):
            prob_scores[0][0][i][j] = math.exp(raw_scores[0][0][i][j] - row_max)
            row_sum += prob_scores[0][0][i][j]
        # Normalize
        for j in range(seq_len):
            prob_scores[0][0][i][j] /= row_sum

    # Step 4: Compute output as weighted sum of values
    out = np.zeros((1, 1, seq_len, d_k), np.float32)
    for i in range(seq_len):
        for kk in range(d_k):
            val = 0.0
            for j in range(seq_len):
                val += prob_scores[0][0][i][j] * v_list[0][0][j][kk]
            out[0][0][i][kk] = val

    scores = torch.from_numpy(prob_scores).to(q.device)
    output = torch.from_numpy(out).to(q.device)

    # Save the 20x20 probability matrix to the global variable 
    global global_attention_scores
    global_attention_scores = prob_scores[0][0].copy()

    # Store in globals for heatmap / CSV capture
    global_attention_output = out[0][0]           # shape [20][d_k]

    return output

class MultiHeadAttention(nn.Module):
    def __init__(self, heads, d_model, seqlen, norm, opt, dropout = 0.1):
        super().__init__()
        
        self.d_model = d_model
        self.d_k = d_model // heads
        self.h = heads
        
        self.q_linear = nn.Linear(d_model, d_model)
        self.v_linear = nn.Linear(d_model, d_model)
        self.k_linear = nn.Linear(d_model, d_model)
        self.sigma = torch.ones([seqlen,seqlen],dtype=torch.float32)
        self.sigma = self.sigma.to(DEVICE)
        self.norm = norm
        self.opt = opt
        
        self.dropout = nn.Dropout(dropout)
        self.out = nn.Linear(d_model, d_model)
    
    def forward(self, q, k, v, mask=None):
        
        bs = q.size(0)
        
        # perform linear operation and split into N heads
        k = self.k_linear(k).view(bs, -1, self.h, self.d_k)
        q = self.q_linear(q).view(bs, -1, self.h, self.d_k)
        v = self.v_linear(v).view(bs, -1, self.h, self.d_k)
        
        # transpose to get dimensions bs * N * sl * d_model
        k = k.transpose(1,2)
        q = q.transpose(1,2)
        v = v.transpose(1,2)

        scores = attention(q, k, v, self.d_k, self.norm, mask, self.dropout)

        # concatenate heads and put through final linear layer
        concat = scores.transpose(1,2).contiguous().view(bs, -1, self.d_model)
        output = self.out(concat)
    
        return output

class FeedForward(nn.Module):
    def __init__(self, d_model, d_ff=2048, dropout = 0.1):
        super().__init__() 
    
        # We set d_ff as a default to 2048
        self.linear_1 = nn.Linear(d_model, d_ff)
        self.dropout = nn.Dropout(dropout)
        self.linear_2 = nn.Linear(d_ff, d_model)
    
    def forward(self, x):
        x = self.dropout(F.relu(self.linear_1(x)))
        x = self.linear_2(x)
        return x
    
def get_clones(module, N):
    return nn.ModuleList([copy.deepcopy(module) for i in range(N)])

class CosineWithRestarts(torch.optim.lr_scheduler._LRScheduler):

    def __init__(self,
                 optimizer: torch.optim.Optimizer,
                 T_max: int,
                 eta_min: float = 0.,
                 last_epoch: int = -1,
                 factor: float = 1.) -> None:
        # pylint: disable=invalid-name
        self.T_max = T_max
        self.eta_min = eta_min
        self.factor = factor
        self._last_restart: int = 0
        self._cycle_counter: int = 0
        self._cycle_factor: float = 1.
        self._updated_cycle_len: int = T_max
        self._initialized: bool = False
        super(CosineWithRestarts, self).__init__(optimizer, last_epoch)

    def get_lr(self):
        """Get updated learning rate."""
        # HACK: We need to check if this is the first time get_lr() was called, since
        # we want to start with step = 0, but _LRScheduler calls get_lr with
        # last_epoch + 1 when initialized.
        if not self._initialized:
            self._initialized = True
            return self.base_lrs

        step = self.last_epoch + 1
        self._cycle_counter = step - self._last_restart

        lrs = [
            (
                self.eta_min + ((lr - self.eta_min) / 2) *
                (
                    np.cos(
                        np.pi *
                        ((self._cycle_counter) % self._updated_cycle_len) /
                        self._updated_cycle_len
                    ) + 1
                )
            ) for lr in self.base_lrs
        ]

        if self._cycle_counter % self._updated_cycle_len == 0:
            # Adjust the cycle length.
            self._cycle_factor *= self.factor
            self._cycle_counter = 0
            self._updated_cycle_len = int(self._cycle_factor * self.T_max)
            self._last_restart = step

        return lrs    
    
class DecoderLayerGPT(nn.Module):
    def __init__(self, d_model, heads, seqlen, norm, opt, dropout=0.1):
        super().__init__()
        self.norm_1 = Norm(d_model)
        self.norm_2 = Norm(d_model)
        
        self.dropout_1 = nn.Dropout(dropout)
        self.dropout_2 = nn.Dropout(dropout)
        
        self.attn_1 = MultiHeadAttention(heads, d_model, seqlen, norm, opt, dropout=dropout)
        self.ff = FeedForward(d_model, dropout=dropout)
        
    def forward(self, x, mask):
        x2 = self.norm_1(x)
        x = x + self.dropout_1(self.attn_1(x2, x2, x2, mask))
        x2 = self.norm_2(x)
        x = x + self.dropout_2(self.ff(x2))
        return x

class DecoderGPT(nn.Module):
    def __init__(self, vocab_size, d_model, N, heads, seqlen, norm, opt, dropout):
        super().__init__()
        self.N = N
        self.embed = Embedder(vocab_size, d_model)
        self.pe = PositionalEncoder(d_model, dropout=dropout)
        self.layers = get_clones(DecoderLayerGPT(d_model, heads, seqlen, norm, opt, dropout), N)
        self.norm = Norm(d_model)
    def forward(self, trg, mask):
        x = self.embed(trg)
        x = self.pe(x)
        for i in range(self.N):
            x = self.layers[i](x, mask)
        return self.norm(x)
    
class TransformerGPT(nn.Module):
    def __init__(self, vocab_size, d_model, N, heads, dropout,opt):
        super().__init__()
        self.decoder = DecoderGPT(vocab_size, d_model, N, heads, opt.seqlen, opt.norm, opt, dropout)
        self.decoder = self.decoder.to(DEVICE)
        self.out = nn.Linear(d_model, vocab_size)
        self.out = self.out.to(DEVICE)
        self.opt = opt
    def forward(self, trg, trg_mask):
        d_output = self.decoder(trg, trg_mask)
        if self.opt.tied == 0:
            output = self.out(d_output)
        else:
            output = torch.matmul(d_output,self.decoder.embed(self.opt.indices).transpose(0,1))
                    
        return [d_output,output]
    
class MyHead(nn.Module):
    def __init__(self,dims):
        super().__init__()
        self.head = nn.Linear(dims,1)
        self.head = self.head.to(DEVICE)
    def forward(self,cls):
        result = self.head(cls)
        return result
    
def get_modelGPT(opt, vocab_size):
    
    assert opt.d_model % opt.heads == 0
    assert opt.dropout < 1
    
    model = TransformerGPT(vocab_size, opt.d_model, opt.n_layers, opt.heads, opt.dropout, opt)
       
    if opt.loadname is not None:
        print("loading pretrained weights...")
        model.load_state_dict(torch.load(opt.loadname, map_location=DEVICE))
    else:
        for p in model.parameters():
            if p.dim() > 1:
                nn.init.xavier_uniform_(p) 
    
    model = model.to(DEVICE)
    
    return model    

def save_attention_csv(scores_2d, output_2d, obs_id, d_k):
    """Save attention scores and output to CSV files."""
    scores_fname = '%d_scores_%d.csv' % (obs_id, d_k)
    output_fname = '%d_output_%d.csv' % (obs_id, d_k)
    with open(scores_fname, 'w') as f:
        for i in range(20):
            row = ','.join(['%.5f' % scores_2d[i][j] for j in range(20)])
            f.write(row + ',\n')
    with open(output_fname, 'w') as f:
        for i in range(20):
            row = ','.join(['%.5f' % output_2d[i][j] for j in range(d_k)])
            f.write(row + ',\n')
    print('  Saved %s and %s' % (scores_fname, output_fname))

def validate_attention_csv(scores_2d, output_2d, obs_id, d_k):
    """Compare attention scores and output against reference CSV files."""
    scores_fname = '%d_scores_%d.csv' % (obs_id, d_k)
    output_fname = '%d_output_%d.csv' % (obs_id, d_k)
    try:
        with open(scores_fname, 'r') as f:
            reader = csv.reader(f)
            max_diff = 0.0
            for i, row in enumerate(reader):
                if i >= 20:
                    break
                for j, val in enumerate(row):
                    if val.strip() == '':
                        continue
                    ref = float(val)
                    diff = abs(ref - scores_2d[i][j])
                    if diff > max_diff:
                        max_diff = diff
        print('  Scores validation (obs %d, d_k=%d): max diff = %.6f %s' %
              (obs_id, d_k, max_diff, 'PASS' if max_diff < 0.001 else 'FAIL'))
    except FileNotFoundError:
        print('  Reference file %s not found, skipping validation.' % scores_fname)
    try:
        with open(output_fname, 'r') as f:
            reader = csv.reader(f)
            max_diff = 0.0
            for i, row in enumerate(reader):
                if i >= 20:
                    break
                for j, val in enumerate(row):
                    if val.strip() == '':
                        continue
                    ref = float(val)
                    diff = abs(ref - output_2d[i][j])
                    if diff > max_diff:
                        max_diff = diff
        print('  Output validation (obs %d, d_k=%d): max diff = %.6f %s' %
              (obs_id, d_k, max_diff, 'PASS' if max_diff < 0.001 else 'FAIL'))
    except FileNotFoundError:
        print('  Reference file %s not found, skipping validation.' % output_fname)

def generate_heatmap(scores_2d, token_labels, title, filename):
    """Generate and save an attention heatmap."""
    fig, ax = plt.subplots(figsize=(12, 10))
    im = ax.imshow(scores_2d, cmap='viridis', aspect='auto')
    ax.set_xticks(range(20))
    ax.set_yticks(range(20))
    ax.set_xticklabels(token_labels, rotation=90, fontsize=7)
    ax.set_yticklabels(token_labels, fontsize=7)
    ax.set_xlabel('Key (attended to)')
    ax.set_ylabel('Query (attending from)')
    ax.set_title(title)
    plt.colorbar(im, ax=ax)
    plt.tight_layout()
    plt.savefig(filename, dpi=150)
    plt.close()
    print('  Saved heatmap: %s' % filename)

def get_token_labels(opt, trg):
    """Extract human-readable token labels for heatmap axes."""
    labels = []
    for j in range(20):
        token_id = trg[0, j].item()
        labels.append('%d:%s' % (j, opt.vocab[token_id]))
    return labels

# Semantic labels for average heatmaps
semantic_labels = [
    '0:[START]', '1:a', '2:a_val', '3:b', '4:b_val', 
    '5:c', '6:c_val', '7:d', '8:d_val', '9:[VARS]', 
    '10:var1', '11:var2', '12:[EQ]', '13:ans', '14:=', 
    '15:lhs', '16:op', '17:rhs', '18:[ANS]', '19:answer'
]

@torch.no_grad()
def example(model, opt):
    global global_attention_scores, global_attention_output
    global adjust_attention, CURRENT_TRG
    
    model.eval()
    
    good = [1067,701,1979,1005,2041,658,1740,606,1707,42]
    bad = [946,1322,2487,314,1445,127,1959,2344,1947,2105,1441,885]  
       
    aa = opt.seqlen
    bb = 1
    opt.bb = bb
    offsets = []
    stride = int(len(opt.test)/bb)
    while (stride % 20) > 0:
        stride = stride - 1
    for i in range(0,len(opt.test),stride):
        offsets.append(i)
        
    nopeak_mask = np.triu(np.ones((bb,aa,aa),dtype=np.int32),k=1)
    mask = Variable(torch.from_numpy(nopeak_mask) == 0)
    mask = mask.to(DEVICE)
    
    d_k = opt.d_model  # since heads=1, d_k = d_model
    
    # --- Validation for observation 701 ---
    print('\n=== Validation: Observation 701 (d_k=%d) ===' % d_k)
    i = 701
    trg = torch.zeros((bb,aa),dtype=torch.long)
    for j in range(aa):
        trg[0,j] = opt.test[i*aa+j]
    trg = trg.to(DEVICE)
    [d_output,preds] = model(trg, mask)
    validate_attention_csv(global_attention_scores, global_attention_output, 701, d_k)
    
    # --- Generate and save for observation 1979 ---
    print('\n=== Generating: Observation 1979 (d_k=%d) ===' % d_k)
    i = 1979
    trg = torch.zeros((bb,aa),dtype=torch.long)
    for j in range(aa):
        trg[0,j] = opt.test[i*aa+j]
    trg = trg.to(DEVICE)
    [d_output,preds] = model(trg, mask)
    save_attention_csv(global_attention_scores, global_attention_output, 1979, d_k)
    
    print('\nGOOD Examples:')
    avg = 0.0
    good_scores_list = []   # collect attention scores for heatmaps
    good_probs_list = []    # track probabilities to find best example
    good_labels_list = []   # track individual labels
    for i in good:
        trg = torch.zeros((bb,aa),dtype=torch.long)
        ans = torch.zeros((bb,opt.vocab_size),dtype=torch.float)
        for j in range(aa):
            trg[0,j] = opt.test[i*aa+j]
            if j == 19:
                ans[0,trg[0,j]] = 1.0
            text = decode_formula(opt,trg)
            
        good_labels_list.append(get_token_labels(opt, trg))
        trg = trg.to(DEVICE)
        ans = ans.to(DEVICE)

        [d_output,preds] = model(trg, mask)
        logits = torch.exp(preds[:,18,:])
        numer = logits * ans
        numer = torch.sum(numer,dim=1)
        denom = torch.sum(logits,dim=1)
        probs = numer / denom
        print('%s %7.3f%%' % (text,100.0*probs[0].item()))
        avg = avg + probs[0].item()
        good_scores_list.append(global_attention_scores.copy())
        good_probs_list.append(probs[0].item())
    print('                                                                       Average: %7.3f%%' % (100.0*avg/float(len(good))))
    print(' ')
    
    # Question 2: Generate attention heatmaps for GOOD examples
    avg_good_scores = np.mean(np.array(good_scores_list), axis=0)
    generate_heatmap(avg_good_scores, semantic_labels,
                     'Average Attention Heatmap — GOOD a*a Examples (n=%d)' % len(good),
                     'heatmap_good_avg.png')
                     
    # Find best example
    best_good_idx = np.argmax(good_probs_list)
    generate_heatmap(good_scores_list[best_good_idx], good_labels_list[best_good_idx],
                     'Attention Heatmap — BEST GOOD Example (obs %d, %.1f%%)' % (good[best_good_idx], 100.0*good_probs_list[best_good_idx]),
                     'heatmap_good_best.png')
               
    print('BAD Examples:')
    avg = 0.0
    bad_scores_list = []    # collect attention scores for heatmaps
    bad_probs_before = []   # track probabilities to find worst and for Question 3 comparison
    bad_labels_list = []    # track individual labels
    for i in bad:
        trg = torch.zeros((bb,aa),dtype=torch.long)
        ans = torch.zeros((bb,opt.vocab_size),dtype=torch.float)
        for j in range(aa):
            trg[0,j] = opt.test[i*aa+j]
            if j == 19:
                ans[0,trg[0,j]] = 1.0
            text = decode_formula(opt,trg)
            
        bad_labels_list.append(get_token_labels(opt, trg))
        trg = trg.to(DEVICE)
        ans = ans.to(DEVICE)

        [d_output,preds] = model(trg, mask)
        logits = torch.exp(preds[:,18,:])
        numer = logits * ans
        numer = torch.sum(numer,dim=1)
        denom = torch.sum(logits,dim=1)
        probs = numer / denom
        top3_values, top3 = torch.topk(logits, k=3)
        print('%s %7.3f%% %5s %5s %5s' % (text,100.0*probs[0].item(),
                                         opt.vocab[top3[0,0]],
                                         opt.vocab[top3[0,1]],
                                         opt.vocab[top3[0,2]]))
        avg = avg + probs[0].item()
        bad_probs_before.append(probs[0].item())
        bad_scores_list.append(global_attention_scores.copy())
    print('                                                                       Average: %7.3f%%' % (100.0*avg/float(len(bad))))
    print(' ')           
    
    # Question 2: Generate attention heatmaps for BAD examples
    avg_bad_scores = np.mean(np.array(bad_scores_list), axis=0)
    generate_heatmap(avg_bad_scores, semantic_labels,
                     'Average Attention Heatmap — BAD a*a Examples (n=%d)' % len(bad),
                     'heatmap_bad_avg.png')
                     
    # Find worst example
    worst_bad_idx = np.argmin(bad_probs_before)
    generate_heatmap(bad_scores_list[worst_bad_idx], bad_labels_list[worst_bad_idx],
                     'Attention Heatmap — WORST BAD Example (obs %d, %.1f%%)' % (bad[worst_bad_idx], 100.0*bad_probs_before[worst_bad_idx]),
                     'heatmap_bad_worst.png')
    
    # Question 3: Re-run BAD examples with manual attention adjustment
    print('IMPROVED BAD Examples (with dynamic attention boost using .item()):')
    adjust_attention = True
    avg_improved = 0.0
    improved_scores_list = []
    for idx, i in enumerate(bad):
        trg = torch.zeros((bb,aa),dtype=torch.long)
        ans = torch.zeros((bb,opt.vocab_size),dtype=torch.float)
        for j in range(aa):
            trg[0,j] = opt.test[i*aa+j]
            if j == 19:
                ans[0,trg[0,j]] = 1.0
            text = decode_formula(opt,trg)
        trg = trg.to(DEVICE)
        ans = ans.to(DEVICE)

        CURRENT_TRG = trg
        [d_output,preds] = model(trg, mask)
        CURRENT_TRG = None
        
        logits = torch.exp(preds[:,18,:])
        numer = logits * ans
        numer = torch.sum(numer,dim=1)
        denom = torch.sum(logits,dim=1)
        probs = numer / denom
        before_pct = 100.0 * bad_probs_before[idx]
        after_pct = 100.0 * probs[0].item()
        print('%s  Before: %7.3f%%  After: %7.3f%%  Change: %+7.3f%%' %
              (text, before_pct, after_pct, after_pct - before_pct))
        avg_improved = avg_improved + probs[0].item()
        improved_scores_list.append(global_attention_scores.copy())
    avg_before = 100.0 * sum(bad_probs_before) / len(bad_probs_before)
    avg_after = 100.0 * avg_improved / float(len(bad))
    print('                                                                       Before Average: %7.3f%%' % avg_before)
    print('                                                                       After Average:  %7.3f%%' % avg_after)
    print('                                                                       Improvement:    %+7.3f%%' % (avg_after - avg_before))
    print(' ')
    adjust_attention = False  # reset
    
    # Generate improved heatmap
    avg_improved_scores = np.mean(np.array(improved_scores_list), axis=0)
    generate_heatmap(avg_improved_scores, semantic_labels,
                     'Average Attention Heatmap — IMPROVED BAD a*a Examples',
                     'heatmap_improved_avg.png')
    
def decode_formula(opt,trg):
    vocab = opt.vocab
    text = '[START] a %5s b %5s c %5s d %5s ' % (vocab[trg[0,2]],
                                                 vocab[trg[0,4]],
                                                 vocab[trg[0,6]],
                                                 vocab[trg[0,8]])
    text = text + '[VARS] %s %s [EQ] ans = %s %s %s [ANS] %5s' % (vocab[trg[0,10]],
                                                                  vocab[trg[0,11]],
                                                                  vocab[trg[0,15]],
                                                                  vocab[trg[0,16]],
                                                                  vocab[trg[0,17]],
                                                                  vocab[trg[0,19]])    
    return(text)
    
def main():
    
    random.seed(42)
    
    parser = argparse.ArgumentParser()
    parser.add_argument('-no_cuda', action='store_true')
    parser.add_argument('-SGDR', action='store_true')
    parser.add_argument('-epochs', type=int, default=20)
    parser.add_argument('-d_model', type=int, default=512)
    parser.add_argument('-n_layers', type=int, default=6)
    parser.add_argument('-heads', type=int, default=8)
    parser.add_argument('-dropout', type=int, default=0.1)
    parser.add_argument('-batchsize', type=int, default=1)
    parser.add_argument('-printevery', type=int, default=100)
    parser.add_argument('-lr', type=float, default=0.00001)
    parser.add_argument('-seqlen', type=int, default=512)
    parser.add_argument('-threshold', type=int, default=0)
    parser.add_argument('-savename', type=str)    
    parser.add_argument('-loadname', type=str)    
    parser.add_argument('-tied', type=int, default=1)
    parser.add_argument('-dir_name', type=str,default='model')
    parser.add_argument('-norm', type=float, default=0.0)
                
    opt = parser.parse_args()
    opt.verbose = False    
    
    opt.device = DEVICE
        
    [opt.vocab,opt.words,opt.train] = read_encode('train.txt',[],{},[],0)
    print('vocab: %d train: %d' % (len(opt.vocab),len(opt.train)))
    [opt.vocab,opt.words,opt.test] = read_encode('test.txt',opt.vocab,opt.words,[],-1)
    print('vocab: %d test: %d' % (len(opt.vocab),len(opt.test)))
    [opt.vocab,opt.words,opt.valid] = read_encode('valid.txt',opt.vocab,opt.words,[],-1)
    print('vocab: %d test: %d' % (len(opt.vocab),len(opt.test)))
        
    obs = len(opt.train)
    opt.vocab_size = len(opt.vocab)
    temp = []
    for i in range(opt.vocab_size):
        temp.append(i)
    opt.indices = torch.tensor(temp)
    opt.indices = opt.indices.to(DEVICE)
    
    model = get_modelGPT(opt,opt.vocab_size)
        
    model_parameters = filter(lambda p: p.requires_grad, model.parameters())
    params = sum([np.prod(p.size()) for p in model_parameters])        
    text = 'total params: %d' % (params)
    print(text)
            
    example(model,opt)
        
if __name__ == "__main__":
    main()     
