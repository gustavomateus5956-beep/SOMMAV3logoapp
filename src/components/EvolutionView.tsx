import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { 
  LoadProgressionItem, 
  BodyMeasurement, 
  WeightLog 
} from './evolution/types';
import { EvolutionHeader, EvolutionTabType } from './evolution/EvolutionHeader';
import { StrengthEvolutionTab } from './evolution/StrengthEvolutionTab';
import { MeasurementsEvolutionTab } from './evolution/MeasurementsEvolutionTab';
import { EvolutionHistoryTab } from './evolution/EvolutionHistoryTab';
import { LogPRModal } from './evolution/LogPRModal';
import { LogWeightModal } from './evolution/LogWeightModal';

export type { LoadProgressionItem, BodyMeasurement, WeightLog };

interface EvolutionViewProps {
  onBack?: () => void;
}

export const EvolutionView: React.FC<EvolutionViewProps> = ({ onBack }) => {
  // Top Navigation Tabs: Strictly ONE concise word per option as requested
  const [activeTab, setActiveTab] = useState<EvolutionTabType>('cargas');

  // Load progression state
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('supino-reto');
  const [showLogPrModal, setShowLogPrModal] = useState(false);
  const [logExerciseId, setLogExerciseId] = useState('supino-reto');

  // Body measurements state
  const [showLogWeightModal, setShowLogWeightModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Main Load Progression Dataset
  const [progressionList, setProgressionList] = useState<LoadProgressionItem[]>([
    {
      id: 'supino-reto',
      exercise: 'Supino Reto com Barra',
      category: 'peito',
      categoryLabel: 'Peitoral & Tríceps',
      initialWeight: 80,
      currentPr: 100,
      repsAtPr: 3,
      lastPrDate: 'Ontem',
      workingSet: '4x 6-8 @ 90kg',
      workingWeight: 90,
      rpe: 9.0,
      status: 'teste_favoravel',
      statusLabel: 'Teste Favorável (105kg)',
      history: [
        { date: 'Ontem', weight: 100, reps: 3, estimated1RM: 107, rpe: 9.5, diffKg: '+4 kg' },
        { date: '19 Out', weight: 96, reps: 4, estimated1RM: 105, rpe: 9.0, diffKg: '+4 kg' },
        { date: '12 Out', weight: 92, reps: 5, estimated1RM: 103, rpe: 8.5, diffKg: '+2 kg' },
        { date: '05 Out', weight: 90, reps: 6, estimated1RM: 102, rpe: 8.5, diffKg: '+5 kg' },
        { date: '15 Ago', weight: 80, reps: 6, estimated1RM: 91, rpe: 8.0, diffKg: 'Base' }
      ]
    },
    {
      id: 'agachamento-livre',
      exercise: 'Agachamento Livre',
      category: 'pernas',
      categoryLabel: 'Quadríceps & Glúteos',
      initialWeight: 115,
      currentPr: 140,
      repsAtPr: 3,
      lastPrDate: 'Há 5 dias',
      workingSet: '4x 5 @ 125kg',
      workingWeight: 125,
      rpe: 8.5,
      status: 'progressao',
      statusLabel: 'Em Sobrecarga Ativa',
      history: [
        { date: 'Há 5 dias', weight: 140, reps: 3, estimated1RM: 150, rpe: 9.0, diffKg: '+10 kg' },
        { date: '16 Out', weight: 130, reps: 4, estimated1RM: 142, rpe: 8.5, diffKg: '+5 kg' },
        { date: '08 Out', weight: 125, reps: 5, estimated1RM: 140, rpe: 8.0, diffKg: '+5 kg' },
        { date: '15 Ago', weight: 115, reps: 6, estimated1RM: 131, rpe: 8.0, diffKg: 'Base' }
      ]
    },
    {
      id: 'levantamento-terra',
      exercise: 'Levantamento Terra Convencional',
      category: 'costas',
      categoryLabel: 'Cadeia Posterior & Lombar',
      initialWeight: 135,
      currentPr: 160,
      repsAtPr: 2,
      lastPrDate: 'Há 12 dias',
      workingSet: '3x 4 @ 145kg',
      workingWeight: 145,
      rpe: 9.0,
      status: 'consolidando',
      statusLabel: 'Consolidando Carga',
      history: [
        { date: 'Há 12 dias', weight: 160, reps: 2, estimated1RM: 168, rpe: 9.5, diffKg: '+5 kg' },
        { date: '11 Out', weight: 155, reps: 3, estimated1RM: 166, rpe: 9.0, diffKg: '+5 kg' },
        { date: '28 Set', weight: 150, reps: 4, estimated1RM: 165, rpe: 8.5, diffKg: '+5 kg' },
        { date: '15 Ago', weight: 135, reps: 5, estimated1RM: 152, rpe: 8.0, diffKg: 'Base' }
      ]
    },
    {
      id: 'desenvolvimento-militar',
      exercise: 'Desenvolvimento Militar com Barra',
      category: 'ombros',
      categoryLabel: 'Deltóides & Core',
      initialWeight: 45,
      currentPr: 62,
      repsAtPr: 4,
      lastPrDate: 'Há 8 dias',
      workingSet: '4x 6 @ 54kg',
      workingWeight: 54,
      rpe: 8.5,
      status: 'progressao',
      statusLabel: 'Em Sobrecarga Ativa',
      history: [
        { date: 'Há 8 dias', weight: 62, reps: 4, estimated1RM: 68, rpe: 9.0, diffKg: '+4 kg' },
        { date: '14 Out', weight: 58, reps: 5, estimated1RM: 65, rpe: 8.5, diffKg: '+4 kg' },
        { date: '29 Set', weight: 54, reps: 6, estimated1RM: 62, rpe: 8.0, diffKg: '+4 kg' },
        { date: '15 Ago', weight: 45, reps: 6, estimated1RM: 51, rpe: 8.0, diffKg: 'Base' }
      ]
    },
    {
      id: 'barra-fixa-lastro',
      exercise: 'Barra Fixa com Sobrecarga (Pull-up)',
      category: 'costas',
      categoryLabel: 'Dorsais & Bíceps',
      initialWeight: 10,
      currentPr: 22,
      repsAtPr: 4,
      lastPrDate: 'Há 15 dias',
      workingSet: '3x 5 @ +16kg',
      workingWeight: 16,
      rpe: 8.5,
      status: 'progressao',
      statusLabel: 'Em Sobrecarga Ativa',
      history: [
        { date: 'Há 15 dias', weight: 22, reps: 4, estimated1RM: 24, rpe: 9.0, diffKg: '+4 kg' },
        { date: '06 Out', weight: 18, reps: 5, estimated1RM: 20, rpe: 8.5, diffKg: '+3 kg' },
        { date: '20 Set', weight: 15, reps: 6, estimated1RM: 17, rpe: 8.0, diffKg: '+5 kg' },
        { date: '15 Ago', weight: 10, reps: 6, estimated1RM: 11, rpe: 8.0, diffKg: 'Base' }
      ]
    }
  ]);

  // Body measurements dataset
  const [measurements] = useState<BodyMeasurement[]>([
    { id: 'm1', region: 'superior', regionLabel: 'Superiores', name: 'Braço Direito (Contraído)', currentCm: 40.5, previousCm: 39.5, deltaCm: 1.0, lastUpdated: '22 Out' },
    { id: 'm2', region: 'superior', regionLabel: 'Superiores', name: 'Braço Esquerdo (Contraído)', currentCm: 40.2, previousCm: 39.2, deltaCm: 1.0, lastUpdated: '22 Out' },
    { id: 'm3', region: 'superior', regionLabel: 'Superiores', name: 'Tórax / Peitoral', currentCm: 108.0, previousCm: 106.0, deltaCm: 2.0, lastUpdated: '22 Out' },
    { id: 'm4', region: 'superior', regionLabel: 'Superiores', name: 'Ombros (Circunferência)', currentCm: 124.0, previousCm: 122.5, deltaCm: 1.5, lastUpdated: '22 Out' },
    { id: 'm5', region: 'tronco', regionLabel: 'Tronco & Core', name: 'Cintura (Linha Umbilical)', currentCm: 81.0, previousCm: 83.0, deltaCm: -2.0, lastUpdated: '22 Out' },
    { id: 'm6', region: 'tronco', regionLabel: 'Tronco & Core', name: 'Quadril / Glúteos', currentCm: 101.5, previousCm: 100.5, deltaCm: 1.0, lastUpdated: '22 Out' },
    { id: 'm7', region: 'inferior', regionLabel: 'Inferiores', name: 'Coxa Direita', currentCm: 61.5, previousCm: 60.0, deltaCm: 1.5, lastUpdated: '22 Out' },
    { id: 'm8', region: 'inferior', regionLabel: 'Inferiores', name: 'Coxa Esquerda', currentCm: 61.2, previousCm: 59.8, deltaCm: 1.4, lastUpdated: '22 Out' },
    { id: 'm9', region: 'inferior', regionLabel: 'Inferiores', name: 'Panturrilha Direita', currentCm: 38.5, previousCm: 38.0, deltaCm: 0.5, lastUpdated: '22 Out' },
    { id: 'm10', region: 'inferior', regionLabel: 'Inferiores', name: 'Panturrilha Esquerda', currentCm: 38.5, previousCm: 38.0, deltaCm: 0.5, lastUpdated: '22 Out' }
  ]);

  // Weight history timeline
  const [weightHistory, setWeightHistory] = useState<WeightLog[]>([
    { id: 'w1', date: '24 Out (Hoje)', weight: 82.4, bodyFatPercentage: 14.8, note: 'Pós-treino de Peito em jejum' },
    { id: 'w2', date: '17 Out', weight: 82.7, bodyFatPercentage: 15.0, note: 'Manutenção de carboidratos' },
    { id: 'w3', date: '10 Out', weight: 83.1, bodyFatPercentage: 15.2, note: 'Ajuste de macros com a Dra. Camila' },
    { id: 'w4', date: '03 Out', weight: 83.6, bodyFatPercentage: 15.6, note: 'Início da nova periodização' },
    { id: 'w5', date: '26 Set', weight: 84.0, bodyFatPercentage: 16.0, note: 'Avaliação física inicial' }
  ]);

  // Handle logging a new PR / 1RM
  const handleSavePr = (data: { exerciseId: string; weight: number; reps: number; rpe: number }) => {
    const { exerciseId, weight: weightNum, reps: repsNum, rpe: rpeNum } = data;

    // Epley formula for estimated 1RM: Weight * (1 + Reps / 30)
    const estimated1RM = repsNum === 1 ? weightNum : Math.round(weightNum * (1 + repsNum / 30));

    setProgressionList((prev) =>
      prev.map((item) => {
        if (item.id === exerciseId) {
          const diffKg = `+${Math.max(0, weightNum - item.currentPr)} kg`;
          const newHistoryItem = {
            date: 'Hoje',
            weight: weightNum,
            reps: repsNum,
            estimated1RM,
            rpe: rpeNum,
            diffKg: diffKg === '+0 kg' ? 'Recorde Igualado' : diffKg
          };

          return {
            ...item,
            currentPr: Math.max(item.currentPr, weightNum),
            repsAtPr: repsNum,
            lastPrDate: 'Hoje',
            rpe: rpeNum,
            history: [newHistoryItem, ...item.history]
          };
        }
        return item;
      })
    );

    setShowLogPrModal(false);
    showToast(`Novo teste de ${weightNum}kg registrado com sucesso na tabela de progressão!`);
  };

  // Handle logging a new weight & body fat entry
  const handleSaveWeight = (wNum: number, bfNum: number) => {
    const newLog: WeightLog = {
      id: `w-${Date.now()}`,
      date: 'Hoje',
      weight: wNum,
      bodyFatPercentage: bfNum,
      note: 'Pesagem matinal atualizada'
    };

    setWeightHistory([newLog, ...weightHistory]);
    setShowLogWeightModal(false);
    showToast(`Peso de ${wNum} kg e ${bfNum}% BF atualizados no histórico!`);
  };

  return (
    <div className="flex flex-col w-full pb-24 md:pb-12 gap-5">
      {/* Header and Segmented Tabs */}
      <EvolutionHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onBack={onBack}
      />

      {/* TAB 1: CARGAS */}
      {activeTab === 'cargas' && (
        <StrengthEvolutionTab
          progressionList={progressionList}
          selectedExerciseId={selectedExerciseId}
          onSelectExercise={setSelectedExerciseId}
          onOpenLogPr={(id) => {
            setLogExerciseId(id);
            setShowLogPrModal(true);
          }}
        />
      )}

      {/* TAB 2: MEDIDAS */}
      {activeTab === 'medidas' && (
        <MeasurementsEvolutionTab
          measurements={measurements}
          weightHistory={weightHistory}
          onOpenLogWeight={() => setShowLogWeightModal(true)}
        />
      )}

      {/* TAB 3: HISTÓRICO */}
      {activeTab === 'historico' && (
        <EvolutionHistoryTab />
      )}

      {/* MODAL: REGISTRAR TESTE DE CARGA (1RM) */}
      <LogPRModal
        isOpen={showLogPrModal}
        onClose={() => setShowLogPrModal(false)}
        progressionList={progressionList}
        initialExerciseId={logExerciseId}
        onSavePr={handleSavePr}
      />

      {/* MODAL: ATUALIZAR PESO & COMPOSIÇÃO */}
      <LogWeightModal
        isOpen={showLogWeightModal}
        onClose={() => setShowLogWeightModal(false)}
        onSaveWeight={handleSaveWeight}
      />

      {/* Floating Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0066ff] text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#4edea3]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
