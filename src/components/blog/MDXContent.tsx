import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";
import rehypePrettyCode from "rehype-pretty-code";
import { Dingbat } from "@/components/ui/Dingbat";

function Sidenote({ children }: { children: React.ReactNode }) {
  return (
    <aside className="my-6 xl:my-0 xl:absolute xl:right-[-220px] xl:w-[200px] xl:float-right border-l xl:border-l-0 xl:border-t border-ink-300 pl-4 xl:pl-0 xl:pt-3 font-prose italic text-[14px] leading-[1.5] text-ink-500">
      {children}
    </aside>
  );
}

function Figure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt?: string;
  caption?: string;
}) {
  return (
    <figure className="my-10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt ?? caption ?? ""}
        className="block w-full h-auto border border-ink-200 bg-ink-100"
      />
      {caption && (
        <figcaption className="mt-3 font-prose italic text-[14px] leading-[1.5] text-ink-500 text-balance">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

const mdxComponents = {
  h1: (props: React.ComponentProps<"h1">) => (
    <h1
      className="font-display font-medium text-[34px] mt-14 mb-5 text-ink-900 tracking-[-0.02em] leading-[1.15]"
      {...props}
    />
  ),
  h2: (props: React.ComponentProps<"h2">) => (
    <h2
      className="font-display font-medium text-[28px] mt-12 mb-4 text-ink-900 tracking-[-0.015em] leading-[1.2]"
      {...props}
    />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3
      className="font-display font-medium text-[22px] mt-10 mb-3 text-ink-900 tracking-[-0.01em] leading-[1.25]"
      {...props}
    />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="font-prose text-[18px] leading-[1.65] text-ink-700 mb-6" {...props} />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="font-prose text-[18px] leading-[1.6] text-ink-700 list-disc pl-6 mb-6 space-y-1.5" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="font-prose text-[18px] leading-[1.6] text-ink-700 list-decimal pl-6 mb-6 space-y-1.5" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => <li {...props} />,
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote
      className="font-prose italic text-[19px] leading-[1.55] text-ink-700 my-8 pl-6 -ml-2 max-w-[60ch]"
      style={{ hangingPunctuation: "first" }}
      {...props}
    />
  ),
  hr: () => <Dingbat />,
  strong: (props: React.ComponentProps<"strong">) => (
    <strong className="font-medium text-ink-900" {...props} />
  ),
  em: (props: React.ComponentProps<"em">) => (
    <em className="italic text-ink-700" {...props} />
  ),
  code: (props: React.ComponentProps<"code">) => {
    const isInline = !props.className;
    if (isInline) {
      return (
        <code
          className="font-mono text-[0.92em] bg-ink-100 px-1.5 py-0.5 text-clay-700"
          {...props}
        />
      );
    }
    return <code {...props} />;
  },
  pre: (props: React.ComponentProps<"pre">) => (
    <pre
      className="bg-ink-100 border border-ink-200 p-4 my-8 overflow-x-auto text-[13px] font-mono leading-relaxed"
      {...props}
    />
  ),
  img: (props: React.ComponentProps<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={props.alt ?? ""}
      className="block w-full h-auto border border-ink-200 my-10 bg-ink-100"
    />
  ),
  table: (props: React.ComponentProps<"table">) => (
    <div className="my-8 overflow-x-auto">
      <table className="w-full text-[15px] border-collapse font-ui" {...props} />
    </div>
  ),
  thead: (props: React.ComponentProps<"thead">) => (
    <thead className="border-b border-ink-300" {...props} />
  ),
  th: (props: React.ComponentProps<"th">) => (
    <th
      className="px-3 py-2 text-left font-mono text-[11px] tracking-[0.04em] text-ink-500 uppercase font-medium"
      {...props}
    />
  ),
  td: (props: React.ComponentProps<"td">) => (
    <td className="px-3 py-2 text-ink-700 border-b border-ink-200" {...props} />
  ),
  tr: (props: React.ComponentProps<"tr">) => <tr {...props} />,
  Sidenote,
  Figure,
};

export async function MDXContent({ source }: { source: string }) {
  const { content } = await compileMDX({
    source,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkSmartypants],
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              theme: "github-light",
              keepBackground: false,
            },
          ],
        ],
      },
    },
    components: mdxComponents,
  });

  return <article className="prose relative">{content}</article>;
}
