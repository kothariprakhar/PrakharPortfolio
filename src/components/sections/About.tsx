import Image from "next/image";
import { SectionTight } from "@/components/layout/SectionWrapper";
import { SectionTitleInline } from "@/components/ui/SectionHeading";
import { STATS, JOURNEY } from "@/lib/constants";

function Stat({
  value,
  suffix,
  label,
  prefix,
}: {
  value: string;
  suffix: string;
  label: string;
  prefix: string;
}) {
  return (
    <div className="border-t border-ink-300 pt-4">
      <div className="font-display font-medium text-[40px] md:text-[48px] leading-none text-ink-900 tabular tracking-[-0.02em]">
        <span className="text-clay-500">{prefix}</span>
        {value}
        <span className="text-clay-500">{suffix}</span>
      </div>
      <p className="mt-3 font-ui text-[13px] leading-[1.45] text-ink-500 max-w-[28ch]">
        {label}
      </p>
    </div>
  );
}

function JourneyEntry({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article className="border-t border-ink-300 pt-5 pb-2">
      <h3 className="font-display font-medium text-[20px] md:text-[22px] tracking-[-0.01em] text-ink-900">
        {title}
      </h3>
      <p className="mt-3 font-prose text-[16px] leading-[1.6] text-ink-700">
        {description}
      </p>
    </article>
  );
}

export function About() {
  return (
    <SectionTight id="about">
      <SectionTitleInline
        title="About."
        lead="Six years of building, in different shapes · engineer, PM, founder, student."
      />

      <div className="grid grid-cols-12 gap-x-6 gap-y-12">
        {/* Left: avatar + stats · single column, no sticky pin */}
        <aside className="col-span-12 md:col-span-4 md:self-start">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-1 ring-ink-300 mb-8">
            <Image
              src="/avatar.png"
              alt="Prakhar Kothari"
              width={96}
              height={96}
              className="w-full h-full object-cover object-top"
              priority
            />
          </div>
          <div className="flex flex-col gap-7">
            {STATS.map((stat) => (
              <Stat key={stat.label} {...stat} />
            ))}
          </div>
        </aside>

        {/* Right: journey */}
        <div className="col-span-12 md:col-span-7 md:col-start-6 flex flex-col gap-6">
          {JOURNEY.map((item) => (
            <JourneyEntry key={item.id} title={item.title} description={item.description} />
          ))}
        </div>
      </div>
    </SectionTight>
  );
}
