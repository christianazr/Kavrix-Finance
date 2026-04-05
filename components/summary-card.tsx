type SummaryCardProps = {
  label: string;
  value: string;
  subtitle?: string;
};

export default function SummaryCard({ label, value, subtitle }: SummaryCardProps) {
  return (
    <div className="glass rounded-3xl p-5 shadow-2xl shadow-black/20">
      <p className="text-sm text-white/60">{label}</p>
      <h3 className="mt-2 text-2xl font-semibold tracking-tight">{value}</h3>
      {subtitle ? <p className="mt-2 text-xs text-white/45">{subtitle}</p> : null}
    </div>
  );
}
