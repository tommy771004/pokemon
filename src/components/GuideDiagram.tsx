/**
 * GuideDiagram — original, self-made schematic figures for the tactical guides.
 *
 * Replaces the previously hotlinked Pokémon artwork sprites with figures we draw
 * ourselves from the guide's own structured data, so every section is "圖文並茂"
 * (text + illustration) without embedding any third-party copyrighted images.
 *
 * Figure type is chosen from the section's existing data:
 *   - steps  -> "flow"    : a numbered process flow (node → node → node)
 *   - list   -> "factors" : a labelled blueprint of key factors
 *   - else   -> "plate"   : a minimal concept plate
 */
import type { ReactNode } from "react";

type Step = {
  id?: string;
  icon?: string;
  nodeTitleEn?: string;
  nodeTitleZh?: string;
};

type Section = {
  id: string;
  roman?: string;
  titleEn: string;
  titleZh: string;
  listEn?: string[];
  listZh?: string[];
  steps?: Step[];
};

type Props = {
  section: Section;
  index: number;
  en: boolean;
};

/** Split "Name：description" / "Name: description" into [label, rest]. */
function splitLabel(item: string): [string, string] {
  const m = item.match(/^(.*?)(?:：|:\s)(.*)$/);
  return m ? [m[1].trim(), m[3].trim()] : [item.trim(), ""];
}

function FigureFrame({
  index,
  kicker,
  children,
}: {
  index: number;
  kicker: string;
  children: ReactNode;
}) {
  return (
    <figure className="bg-bone border border-line-soft p-5 my-8 relative ambient-shadow rounded-sm w-full max-w-[520px] mx-auto">
      <div className="absolute top-2 right-2 font-mono-metadata text-mono-metadata text-ink-mute bg-paper/80 px-2 py-0.5 rounded-sm backdrop-blur-sm z-10">
        FIG. {index + 1}
      </div>
      <div className="font-label-caps text-label-caps text-ink-mute uppercase tracking-widest mb-4 mt-2">
        {kicker}
      </div>
      {children}
    </figure>
  );
}

function FlowFigure({ steps, en, index }: { steps: Step[]; en: boolean; index: number }) {
  return (
    <FigureFrame index={index} kicker={en ? "Process Flow" : "流程圖解"}>
      <ol className="flex flex-wrap items-stretch gap-y-4">
        {steps.map((step, i) => (
          <li key={step.id || i} className="flex items-center">
            <div className="flex flex-col items-center text-center w-[88px]">
              <div className="relative w-11 h-11 rounded-full bg-paper-warm border-2 border-primary/60 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">{step.icon || "adjust"}</span>
                <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-primary text-on-primary font-mono-metadata text-[10px] font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <span className="font-mono-metadata text-mono-metadata text-ink-soft mt-2 leading-tight break-words">
                {en ? step.nodeTitleEn : step.nodeTitleZh}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span className="material-symbols-outlined text-ink-faint text-[18px] mx-0.5 self-start mt-3">
                chevron_right
              </span>
            )}
          </li>
        ))}
      </ol>
    </FigureFrame>
  );
}

function FactorsFigure({
  items,
  title,
  en,
  index,
}: {
  items: string[];
  title: string;
  en: boolean;
  index: number;
}) {
  return (
    <FigureFrame index={index} kicker={en ? "Key Factors" : "重點拆解"}>
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-line-soft">
        <span className="material-symbols-outlined text-primary text-[22px]">account_tree</span>
        <span className="font-headline-sm text-[15px] text-ink-soft">{title}</span>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {items.map((item, i) => {
          const [label, rest] = splitLabel(item);
          return (
            <li
              key={i}
              className="bg-paper-warm border border-line-soft rounded-sm px-3 py-2 flex flex-col gap-0.5"
            >
              <span className="font-mono-metadata text-mono-metadata text-primary uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                {label}
              </span>
              {rest && (
                <span className="font-body-base text-xs text-ink-soft leading-snug">{rest}</span>
              )}
            </li>
          );
        })}
      </ul>
    </FigureFrame>
  );
}



export default function GuideDiagram({ section, index, en }: Props) {
  const title = en ? section.titleEn : section.titleZh;

  if (section.steps && section.steps.length > 0) {
    return <FlowFigure steps={section.steps} en={en} index={index} />;
  }

  const list = en ? section.listEn : section.listZh;
  if (list && list.length > 0) {
    return <FactorsFigure items={list} title={title} en={en} index={index} />;
  }

  return null;
}
