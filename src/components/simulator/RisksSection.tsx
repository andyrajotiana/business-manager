import { Card } from "@/components/ui/card";
import { AlertTriangle, CloudRain, Coins, Zap } from "lucide-react";

const risks = [
  { icon: Coins, title: "Variation du taux Ar/€", desc: "Une dépréciation de l'Ariary augmente le coût des consommables importés (encres, papier photo)." },
  { icon: Zap, title: "Coupures électriques", desc: "Prévoir un onduleur ou un budget carburant pour groupe — les coupures stoppent la production." },
  { icon: CloudRain, title: "Saisonnalité", desc: "Saison des pluies → moins d'événements et déplacements clients réduits. Constituer une trésorerie tampon." },
  { icon: AlertTriangle, title: "Concurrence locale", desc: "Marchés saturés sur 10×15. Se différencier sur qualité 6 encres + retouches + livraison." },
];

export function RisksSection() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-1">Risques à anticiper</h3>
      <p className="text-xs text-muted-foreground mb-4">Contexte Madagascar — à intégrer à ta trésorerie.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {risks.map((r) => (
          <div key={r.title} className="flex gap-3 p-3 rounded-lg bg-muted/40 border">
            <r.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-sm">{r.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{r.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}