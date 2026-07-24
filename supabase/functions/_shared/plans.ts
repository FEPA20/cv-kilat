export type PlanCode =
  | "SINGLE_CV"
  | "THREE_CV"
  | "CAREER_ACCESS";

export type PlanDefinition = {
  code: PlanCode;
  name: string;
  amount: number;
  credits: number | null;
  durationDays: number;
};

export const PLANS: Record<PlanCode, PlanDefinition> = {
  SINGLE_CV: {
    code: "SINGLE_CV",
    name: "1 CV Premium",
    amount: 19000,
    credits: 1,
    durationDays: 7,
  },
  THREE_CV: {
    code: "THREE_CV",
    name: "3 Kredit CV",
    amount: 39000,
    credits: 3,
    durationDays: 60,
  },
  CAREER_ACCESS: {
    code: "CAREER_ACCESS",
    name: "Career Access",
    amount: 59000,
    credits: null,
    durationDays: 30,
  },
};

export function getPlan(value: unknown): PlanDefinition | null {
  const code = String(value || "").trim().toUpperCase() as PlanCode;
  return PLANS[code] || null;
}
