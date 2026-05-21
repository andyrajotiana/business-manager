import { Card } from "@/components/ui/card";
import { formatAr, projection24Months, type SimInputs } from "@/lib/simulator";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function ProjectionChart({ inputs }: { inputs: SimInputs }) {
  const data = projection24Months(inputs);
  const crossing = data.find((d) => d.cumulative >= inputs.goalAr);
  return (
    <Card className="p-6">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Projection cumulative sur 24 mois</h3>
          <p className="text-xs text-muted-foreground">Bénéfice net cumulé vs objectif financier</p>
        </div>
        <div className="text-right text-xs">
          <div className="text-muted-foreground">Objectif atteint</div>
          <div className="font-mono font-semibold">{crossing ? `Mois ${crossing.month}` : "> 24 mois"}</div>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
            <XAxis dataKey="month" tickFormatter={(m) => `M${m}`} fontSize={11} />
            <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} fontSize={11} />
            <Tooltip
              formatter={(v: number) => formatAr(v)}
              labelFormatter={(m) => `Mois ${m}`}
              contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }}
            />
            <Legend />
            <Line type="monotone" dataKey="cumulative" name="Bénéfice cumulé" stroke="var(--primary)" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="goal" name="Objectif" stroke="var(--accent)" strokeWidth={2} strokeDasharray="6 4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}