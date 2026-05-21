import { Card } from "@/components/ui/card";
import { CHANNEL_LABEL, FORMATS, FORMAT_LABEL, bestChannelFor, breakEvenVolume, formatAr, optimalScenario, type SimInputs } from "@/lib/simulator";

export function BreakEvenAndScenario({ inputs }: { inputs: SimInputs }) {
  const scenario = optimalScenario(inputs);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-1">Seuil de rentabilité</h3>
        <p className="text-xs text-muted-foreground mb-4">Tirages/mois à vendre pour couvrir les frais fixes (30 000 Ar), sur le meilleur canal du format.</p>
        <ul className="space-y-3">
          {FORMATS.map((f) => {
            const { channel } = bestChannelFor(inputs, f);
            const be = breakEvenVolume(inputs, f, channel);
            return (
              <li key={f} className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0">
                <div>
                  <div className="font-medium">{FORMAT_LABEL[f]}</div>
                  <div className="text-xs text-muted-foreground">via {CHANNEL_LABEL[channel]}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-lg font-semibold">{isFinite(be) ? Math.ceil(be) : "∞"}</div>
                  <div className="text-xs text-muted-foreground">tirages/mois</div>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/10 border-primary/20">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded bg-primary text-primary-foreground">Recommandé</span>
          <h3 className="text-lg font-semibold">Scénario optimal</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Mise à jour en temps réel selon tes inputs.</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs uppercase text-muted-foreground">Format prioritaire</div>
            <div className="text-2xl font-bold">{FORMAT_LABEL[scenario.format]}</div>
          </div>
          <div>
            <div className="text-xs uppercase text-muted-foreground">Canal</div>
            <div className="text-lg font-semibold">{CHANNEL_LABEL[scenario.channel]}</div>
          </div>
          <div>
            <div className="text-xs uppercase text-muted-foreground">Cadence mensuelle</div>
            <div className="text-lg font-semibold font-mono">{Math.round(scenario.monthlyCadence)} tirages</div>
          </div>
          <div>
            <div className="text-xs uppercase text-muted-foreground">Mois → objectif</div>
            <div className="text-lg font-semibold font-mono">
              {isFinite(scenario.monthsToGoal) ? `${Math.ceil(scenario.monthsToGoal)} mois` : "non atteint"}
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t text-sm">
          <span className="text-muted-foreground">Bénéfice estimé / mois : </span>
          <span className="font-mono font-semibold">{formatAr(scenario.monthlyProfit)}</span>
        </div>
      </Card>
    </div>
  );
}