import { Card } from "@/components/ui/card";
import { FORMATS, FORMAT_LABEL, amortPerPrint, cogsPerPrint, formatAr, type SimInputs } from "@/lib/simulator";

export function CogsTable({ inputs }: { inputs: SimInputs }) {
  const amort = amortPerPrint(inputs);
  return (
    <Card className="p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-lg font-semibold">Coût de revient par tirage</h3>
        <span className="text-xs text-muted-foreground">Amortissement: {formatAr(amort)}/tirage</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground border-b">
              <th className="py-2 pr-4">Format</th>
              <th className="py-2 px-2 text-right">Encre</th>
              <th className="py-2 px-2 text-right">Papier</th>
              <th className="py-2 px-2 text-right">Fixes</th>
              <th className="py-2 px-2 text-right">Amort.</th>
              <th className="py-2 pl-2 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {FORMATS.map((f) => {
              const bc = inputs.baseCosts[f];
              const total = cogsPerPrint(inputs, f);
              return (
                <tr key={f} className="border-b last:border-0">
                  <td className="py-3 pr-4 font-medium">{FORMAT_LABEL[f]}</td>
                  <td className="py-3 px-2 text-right font-mono">{formatAr(bc.ink)}</td>
                  <td className="py-3 px-2 text-right font-mono">{formatAr(bc.paper)}</td>
                  <td className="py-3 px-2 text-right font-mono">{formatAr(bc.fixed)}</td>
                  <td className="py-3 px-2 text-right font-mono text-muted-foreground">{formatAr(amort)}</td>
                  <td className="py-3 pl-2 text-right font-mono font-semibold text-primary">{formatAr(total)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}