import type { PropsWithChildren } from "react";

type RetroPanelProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
}>;

export function RetroPanel({ title, subtitle, children }: RetroPanelProps) {
  return (
    <section className="rounded-3xl border border-[#6d52a8]/35 bg-[#14101f] p-5 shadow-[0_0_0_1px_rgba(0,0,0,0.75),0_0_30px_rgba(173,122,255,0.1)] md:p-6">
      {title ? (
        <div className="mb-4">
          <h2 className="font-['Press_Start_2P',monospace] text-sm text-white md:text-base">{title}</h2>
          {subtitle ? <p className="mt-3 text-sm leading-6 text-[#cfbfeb]">{subtitle}</p> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}