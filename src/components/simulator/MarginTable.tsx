import { Card } from "@/components/ui/card";
import { CHANNEL_LABEL, FORMATS, FORMAT_LABEL, cogsPerPrint, formatAr, marginPerPrint, type ChannelKey, type SimInputs } from "@/lib/simulator";

const CHANNELS: ChannelKey[] = ["famille", "marche", "whatsapp", "pro"];

function badgeClass(margin: number, cogs: number) {
  const ratio = margin / Math.max(1, cogs);
  if (margin <= 0) return "bg-destructive/15 text-destructive border-destructive/30";
  if (ratio < 0.5) return "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200";
  return "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200";
}

export function MarginTable({ inputs }: { inputs: SimInputs }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-1">Marge nette par format × canal</h3>
      <p className="text-xs text-muted-foreground mb-4">Prix de vente – coût de revient. Vert = rentable, orange = serré, rouge = perte.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground border-b">
              <th className="py-2 pr-4">Format</th>
              {CHANNELS.map((c) => (
                <th key={c} className="py-2 px-2 text-right">{CHANNEL_LABEL[c]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FORMATS.map((f) => {
              const cogs = cogsPerPrint(inputs, f);
              return (
                <tr key={f} className="border-b last:border-0">
                  <td className="py-3 pr-4 font-medium">{FORMAT_LABEL[f]}</td>
                  {CHANNELS.map((c) => {
                    const m = marginPerPrint(inputs, f, c);
                    return (
                      <td key={c} className="py-3 px-2 text-right">
                        <span className={`inline-block px-2 py-1 rounded border font-mono text-xs ${badgeClass(m, cogs)}`}>
                          {formatAr(m)}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}