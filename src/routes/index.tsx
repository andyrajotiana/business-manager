import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Camera } from "lucide-react";
import { ConfigPanel } from "@/components/simulator/ConfigPanel";
import { SummaryCards } from "@/components/simulator/SummaryCards";
import { CogsTable } from "@/components/simulator/CogsTable";
import { MarginTable } from "@/components/simulator/MarginTable";
import { ProjectionChart } from "@/components/simulator/ProjectionChart";
import { BreakEvenAndScenario } from "@/components/simulator/BreakEvenAndScenario";
import { RisksSection } from "@/components/simulator/RisksSection";
import { DEFAULT_BASE_COSTS, DEFAULT_PRICES, type SimInputs } from "@/lib/simulator";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "My First Lab — Simulateur carrière photo Madagascar" },
      { name: "description", content: "Simule ton activité photo à Madagascar : équipement, formats, canaux et projection 24 mois en Ariary." },
    ],
  }),
});

function Index() {
  const [inputs, setInputs] = useState<SimInputs>({
    printerCurrent: 800000,
    printerTarget: 2000000,
    cameraTarget: 2500000,
    amortMonths: 24,
    monthlyVolume: 150,
    exchangeRate: 5000,
    baseCosts: DEFAULT_BASE_COSTS,
    prices: DEFAULT_PRICES,
    volumes: { "10x15": 100, "13x18": 40, A4: 10 },
    goalAr: 4500000,
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground grid place-items-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">My First Lab</h1>
              <p className="text-xs text-muted-foreground">Simulateur carrière photo · Madagascar</p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground hidden sm:block">
            Tous les montants en <span className="font-semibold text-foreground">Ariary (Ar)</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <SummaryCards inputs={inputs} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ConfigPanel inputs={inputs} setInputs={setInputs} />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <CogsTable inputs={inputs} />
            <MarginTable inputs={inputs} />
            <ProjectionChart inputs={inputs} />
          </div>
        </div>

        <BreakEvenAndScenario inputs={inputs} />
        <RisksSection />

        <footer className="text-center text-xs text-muted-foreground py-6">
          My First Lab · Calculs indicatifs basés sur tes paramètres
        </footer>
      </main>
    </div>
  );
}
