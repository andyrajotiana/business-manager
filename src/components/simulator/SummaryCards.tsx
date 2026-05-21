import { Card } from "@/components/ui/card";
import { FORMATS, amortPerPrint, bestChannelFor, formatAr, marginPerPrint, type SimInputs } from "@/lib/simulator";

export function SummaryCards({ inputs }: { inputs: SimInputs }) {
  const totalInvest = inputs.printerTarget + inputs.cameraTarget;
  let monthlyGross = 0;
  let totalPrints = 0;
  for (const f of FORMATS) {
    const { channel } = bestChannelFor(inputs, f);
    monthlyGross += marginPerPrint(inputs, f, channel) * inputs.volumes[f];
    totalPrints += inputs.volumes[f];
  }
  const monthlyNet = monthlyGross - 30000;
  const monthsToGoal = monthlyNet > 0 ? Math.ceil(inputs.goalAr / monthlyNet) : null;

  const items = [
    { label: "Investissement total", value: formatAr(totalInvest), sub: `${(totalInvest / inputs.exchangeRate).toFixed(0)} €` },
    { label: "Amort. / tirage", value: formatAr(amortPerPrint(inputs)), sub: `${inputs.amortMonths} mois` },
    { label: "Bénéfice net mensuel", value: formatAr(monthlyNet), sub: `${totalPrints} tirages / mois`, accent: monthlyNet > 0 },
    { label: "Mois pour objectif", value: monthsToGoal ? `${monthsToGoal} mois` : "—", sub: formatAr(inputs.goalAr) },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((it) => (
        <Card key={it.label} className="p-4">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{it.label}</div>
          <div className={`mt-1 text-xl font-bold font-mono ${it.accent === false ? "text-destructive" : it.accent === true ? "text-emerald-700 dark:text-emerald-400" : ""}`}>
            {it.value}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">{it.sub}</div>
        </Card>
      ))}
    </div>
  );
}