import type { PropsWithChildren } from "react";

type RetroPanelProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
}>;

export function RetroPanel({ title, subtitle, children }: RetroPanelProps) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 md:p-6">
      {title ? (
        <div className="mb-5">
          <h2 className="text-lg font-bold text-white md:text-xl">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-zinc-400">{subtitle}</p> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}