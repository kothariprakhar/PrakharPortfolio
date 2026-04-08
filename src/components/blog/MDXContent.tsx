import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";

const mdxComponents = {
  h1: (props: React.ComponentProps<"h1">) => (
    <h1 className="font-display font-bold text-3xl mt-12 mb-4 text-text-primary" {...props} />
  ),
  h2: (props: React.ComponentProps<"h2">) => (
    <h2 className="font-display font-bold text-2xl mt-10 mb-3 text-text-primary" {...props} />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3 className="font-display font-bold text-xl mt-8 mb-2 text-text-primary" {...props} />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="text-text-secondary leading-relaxed mb-5" {...props} />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a
      className="text-accent-blue hover:underline underline-offset-4"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="list-disc list-inside mb-5 space-y-1 text-text-secondary" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="list-decimal list-inside mb-5 space-y-1 text-text-secondary" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => (
    <li className="leading-relaxed" {...props} />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote
      className="border-l-2 border-accent-blue/50 pl-4 my-6 text-text-muted italic"
      {...props}
    />
  ),
  hr: (props: React.ComponentProps<"hr">) => (
    <hr className="border-border-subtle my-10" {...props} />
  ),
  strong: (props: React.ComponentProps<"strong">) => (
    <strong className="font-semibold text-text-primary" {...props} />
  ),
  em: (props: React.ComponentProps<"em">) => (
    <em className="text-text-secondary" {...props} />
  ),
  code: (props: React.ComponentProps<"code">) => {
    const isInline = !props.className;
    if (isInline) {
      return (
        <code
          className="font-mono text-sm bg-bg-tertiary px-1.5 py-0.5 rounded text-accent-blue"
          {...props}
        />
      );
    }
    return <code {...props} />;
  },
  pre: (props: React.ComponentProps<"pre">) => (
    <pre
      className="bg-bg-secondary border border-border-subtle rounded-xl p-4 my-6 overflow-x-auto text-sm font-mono"
      {...props}
    />
  ),
};

export async function MDXContent({ source }: { source: string }) {
  const { content } = await compileMDX({
    source,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              theme: "one-dark-pro",
              keepBackground: false,
            },
          ],
        ],
      },
    },
    components: mdxComponents,
  });

  return <article className="max-w-none">{content}</article>;
}
