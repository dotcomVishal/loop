type SectionLabelProps = {
  children: string;
};

export function SectionLabel({ children }: SectionLabelProps) {
  return <div className="text-xs uppercase tracking-[0.4em] text-[#ae8de6]">{children}</div>;
}