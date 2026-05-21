export type FormatKey = "10x15" | "13x18" | "A4";
export type ChannelKey = "famille" | "marche" | "whatsapp" | "pro";

export const FORMATS: FormatKey[] = ["10x15", "13x18", "A4"];

export const FORMAT_LABEL: Record<FormatKey, string> = {
  "10x15": "10×15",
  "13x18": "13×18",
  A4: "A4",
};

export const CHANNEL_LABEL: Record<ChannelKey, string> = {
  famille: "Famille / proches",
  marche: "Marché local",
  whatsapp: "Commandes WhatsApp",
  pro: "Commandes pro",
};

export interface BaseCost {
  ink: number;
  paper: number;
  fixed: number;
}

export const DEFAULT_BASE_COSTS: Record<FormatKey, BaseCost> = {
  "10x15": { ink: 300, paper: 600, fixed: 150 },
  "13x18": { ink: 500, paper: 1100, fixed: 200 },
  A4: { ink: 850, paper: 1900, fixed: 250 },
};

export const DEFAULT_PRICES: Record<FormatKey, Record<ChannelKey, number>> = {
  "10x15": { famille: 1750, marche: 3250, whatsapp: 2500, pro: 4000 },
  "13x18": { famille: 3500, marche: 4500, whatsapp: 5750, pro: 7000 },
  A4: { famille: 7000, marche: 9500, whatsapp: 11000, pro: 13750 },
};

export const MONTHLY_FIXED = 30000;

export const formatAr = (n: number): string =>
  `${Math.round(n).toLocaleString("fr-FR").replace(/\u202f/g, " ")} Ar`;

export interface SimInputs {
  printerCurrent: number;
  printerTarget: number;
  cameraTarget: number;
  amortMonths: number;
  monthlyVolume: number;
  exchangeRate: number;
  baseCosts: Record<FormatKey, BaseCost>;
  prices: Record<FormatKey, Record<ChannelKey, number>>;
  volumes: Record<FormatKey, number>;
  goalAr: number;
}

export function amortPerPrint(inputs: SimInputs): number {
  const totalInvest = inputs.printerTarget + inputs.cameraTarget;
  const vol = Math.max(1, inputs.monthlyVolume);
  return totalInvest / (inputs.amortMonths * vol);
}

export function cogsPerPrint(inputs: SimInputs, f: FormatKey): number {
  const bc = inputs.baseCosts[f];
  return bc.ink + bc.paper + bc.fixed + amortPerPrint(inputs);
}

export function marginPerPrint(
  inputs: SimInputs,
  f: FormatKey,
  c: ChannelKey,
): number {
  return inputs.prices[f][c] - cogsPerPrint(inputs, f);
}

export function breakEvenVolume(inputs: SimInputs, f: FormatKey, c: ChannelKey): number {
  // Monthly fixed / margin per print (using format margin on chosen channel)
  const m = marginPerPrint(inputs, f, c);
  if (m <= 0) return Infinity;
  return MONTHLY_FIXED / m;
}

export function monthlyNetProfit(inputs: SimInputs, channel: ChannelKey): number {
  let gross = 0;
  for (const f of FORMATS) {
    gross += marginPerPrint(inputs, f, channel) * inputs.volumes[f];
  }
  return gross - MONTHLY_FIXED;
}

export function bestChannelFor(inputs: SimInputs, f: FormatKey): { channel: ChannelKey; margin: number } {
  let best: ChannelKey = "famille";
  let bestM = -Infinity;
  (Object.keys(inputs.prices[f]) as ChannelKey[]).forEach((c) => {
    const m = marginPerPrint(inputs, f, c);
    if (m > bestM) {
      bestM = m;
      best = c;
    }
  });
  return { channel: best, margin: bestM };
}

export interface Scenario {
  format: FormatKey;
  channel: ChannelKey;
  monthlyCadence: number;
  monthsToGoal: number;
  monthlyProfit: number;
}

export function optimalScenario(inputs: SimInputs): Scenario {
  let best: Scenario | null = null;
  for (const f of FORMATS) {
    const { channel, margin } = bestChannelFor(inputs, f);
    const cadence = inputs.volumes[f] || Math.max(50, inputs.monthlyVolume / 3);
    const monthlyProfit = margin * cadence - MONTHLY_FIXED / 3;
    const monthsToGoal = monthlyProfit > 0 ? inputs.goalAr / monthlyProfit : Infinity;
    if (!best || monthsToGoal < best.monthsToGoal) {
      best = { format: f, channel, monthlyCadence: cadence, monthsToGoal, monthlyProfit };
    }
  }
  return best!;
}

export function projection24Months(inputs: SimInputs): { month: number; cumulative: number; goal: number }[] {
  // Combine all formats with their volumes using best channel per format
  let monthlyTotal = -MONTHLY_FIXED;
  for (const f of FORMATS) {
    const { margin } = bestChannelFor(inputs, f);
    monthlyTotal += margin * inputs.volumes[f];
  }
  const arr = [];
  let cum = 0;
  for (let m = 1; m <= 24; m++) {
    cum += monthlyTotal;
    arr.push({ month: m, cumulative: Math.max(0, cum), goal: inputs.goalAr });
  }
  return arr;
}