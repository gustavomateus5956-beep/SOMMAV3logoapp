export interface LoadProgressionItem {
  id: string;
  exercise: string;
  category: 'peito' | 'costas' | 'pernas' | 'ombros';
  categoryLabel: string;
  initialWeight: number; // kg
  currentPr: number; // kg (1RM)
  repsAtPr: number;
  lastPrDate: string;
  workingSet: string;
  workingWeight: number;
  rpe: number;
  status: 'progressao' | 'consolidando' | 'teste_favoravel';
  statusLabel: string;
  history: {
    date: string;
    weight: number;
    reps: number;
    estimated1RM: number;
    rpe: number;
    diffKg: string;
  }[];
}

export interface BodyMeasurement {
  id: string;
  region: 'superior' | 'tronco' | 'inferior';
  regionLabel: string;
  name: string;
  currentCm: number;
  previousCm: number;
  deltaCm: number;
  lastUpdated: string;
}

export interface WeightLog {
  id: string;
  date: string;
  weight: number;
  bodyFatPercentage: number;
  note?: string;
}
