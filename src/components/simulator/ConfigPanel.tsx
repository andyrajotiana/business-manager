import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { FORMATS, FORMAT_LABEL, formatAr, type SimInputs } from "@/lib/simulator";

interface Props {
  inputs: SimInputs;
  setInputs: (u: (p: SimInputs) => SimInputs) => void;
}

const NumberField = ({ label, value, onChange, step = 1000 }: { label: string; value: number; onChange: (n: number) => void; step?: number }) => (
  <div className="space-y-1.5">
    <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
    <Input
      type="number"
      value={value}
      step={step}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      className="font-mono"
    />
  </div>
);

export function ConfigPanel({ inputs, setInputs }: Props) {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Configuration</h2>
        <p className="text-sm text-muted-foreground">Ajuste les paramètres — tout se recalcule en direct.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberField label="Imprimante actuelle (Ar)" value={inputs.printerCurrent} onChange={(n) => setInputs((p) => ({ ...p, printerCurrent: n }))} />
        <NumberField label="Imprimante cible 6 encres (Ar)" value={inputs.printerTarget} onChange={(n) => setInputs((p) => ({ ...p, printerTarget: n }))} />
        <NumberField label="Appareil photo cible (Ar)" value={inputs.cameraTarget} onChange={(n) => setInputs((p) => ({ ...p, cameraTarget: n }))} />
        <NumberField label="Objectif financier (Ar)" value={inputs.goalAr} onChange={(n) => setInputs((p) => ({ ...p, goalAr: n }))} step={100000} />
        <NumberField label="Volume mensuel estimé" value={inputs.monthlyVolume} onChange={(n) => setInputs((p) => ({ ...p, monthlyVolume: n }))} step={10} />
        <NumberField label="Taux de change Ar/€" value={inputs.exchangeRate} onChange={(n) => setInputs((p) => ({ ...p, exchangeRate: n }))} step={100} />
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Durée d'amortissement</Label>
        <div className="grid grid-cols-3 gap-2">
          {[12, 24, 36].map((m) => (
            <button
              key={m}
              onClick={() => setInputs((p) => ({ ...p, amortMonths: m }))}
              className={`px-3 py-2 rounded-md border text-sm font-medium transition ${inputs.amortMonths === m ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted"}`}
            >
              {m} mois
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Volume mensuel par format</h3>
        {FORMATS.map((f) => (
          <div key={f} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{FORMAT_LABEL[f]}</span>
              <span className="font-mono text-muted-foreground">{inputs.volumes[f]} tirages</span>
            </div>
            <Slider
              value={[inputs.volumes[f]]}
              max={500}
              step={5}
              onValueChange={([v]) => setInputs((p) => ({ ...p, volumes: { ...p.volumes, [f]: v } }))}
            />
          </div>
        ))}
      </div>

      <div className="pt-2 border-t text-xs text-muted-foreground space-y-1">
        <div className="flex justify-between"><span>Investissement total</span><span className="font-mono">{formatAr(inputs.printerTarget + inputs.cameraTarget)}</span></div>
        <div className="flex justify-between"><span>Équivalent €</span><span className="font-mono">{((inputs.printerTarget + inputs.cameraTarget) / inputs.exchangeRate).toFixed(0)} €</span></div>
      </div>
    </Card>
  );
}