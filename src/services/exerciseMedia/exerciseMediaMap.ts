import { ExerciseMedia } from '../../types';

/**
 * Mapeamento explícito entre identificadores da Biblioteca SOMMA+ e ExerciseDB V1.
 * Novas associações são adicionadas aqui de forma controlada e auditável.
 */
export const SOMMA_EXERCISE_MEDIA_MAP: Record<string, ExerciseMedia> = {
  // Peitoral
  'lib-peito-1': { provider: 'exercisedb', externalId: '0025' }, // Supino Reto com Barra
  'lib-peito-2': { provider: 'exercisedb', externalId: '0314' }, // Supino Inclinado com Halteres
  'lib-peito-3': { provider: 'exercisedb', externalId: '1270' }, // Crucifixo Inclinado no Cabo
  'lib-peito-4': { provider: 'exercisedb', externalId: '0033' }, // Supino Declinado
  'lib-peito-5': { provider: 'exercisedb', externalId: '0251' }, // Paralelas com Peso Corporal

  // Costas
  'lib-costas-1': { provider: 'exercisedb', externalId: '0198' }, // Puxador Alto Frente (Lat Pulldown)
  'lib-costas-2': { provider: 'exercisedb', externalId: '0027' }, // Remada Curvada com Barra
  'lib-costas-3': { provider: 'exercisedb', externalId: '0861' }, // Remada Baixa no Triângulo
  'lib-costas-4': { provider: 'exercisedb', externalId: '0651' }, // Barra Fixa (Pull-up)
  'lib-costas-5': { provider: 'exercisedb', externalId: '0032' }, // Levantamento Terra Clássico

  // Ombros
  'lib-ombro-1': { provider: 'exercisedb', externalId: '0405' }, // Desenvolvimento Militar com Halteres
  'lib-ombro-2': { provider: 'exercisedb', externalId: '0178' }, // Elevação Lateral na Polia Baixa
  'lib-ombro-3': { provider: 'exercisedb', externalId: '0225' }, // Crucifixo Invertido

  // Pernas
  'lib-pernas-1': { provider: 'exercisedb', externalId: '0043' }, // Agachamento Livre com Barra
  'lib-pernas-2': { provider: 'exercisedb', externalId: '1425' }, // Leg Press 45° Articulado
  'lib-pernas-3': { provider: 'exercisedb', externalId: '0585' }, // Cadeira Extensora
  'lib-pernas-4': { provider: 'exercisedb', externalId: '0432' }, // Stiff com Barra / Halteres
  'lib-pernas-5': { provider: 'exercisedb', externalId: '0586' }, // Mesa Flexora Deitada
  'lib-pernas-6': { provider: 'exercisedb', externalId: '1409' }, // Elevação Pélvica com Barra (Hip Thrust)
  'lib-pernas-7': { provider: 'exercisedb', externalId: '0088' }, // Gêmeos Sentado na Máquina

  // Braços
  'lib-bracos-1': { provider: 'exercisedb', externalId: '0447' }, // Rosca Direta Barra W
  'lib-bracos-2': { provider: 'exercisedb', externalId: '0313' }, // Rosca Martelo com Halteres
  'lib-bracos-3': { provider: 'exercisedb', externalId: '0372' }, // Rosca Scott Unilateral com Halter
  'lib-bracos-4': { provider: 'exercisedb', externalId: '0200' }, // Tríceps Corda no Pulley
  'lib-bracos-5': { provider: 'exercisedb', externalId: '1736' }, // Tríceps Francês Unilateral
  'lib-bracos-6': { provider: 'exercisedb', externalId: '0060' }, // Tríceps Testa com Barra W

  // Core
  'lib-core-1': { provider: 'exercisedb', externalId: '0175' }, // Abdominal no Cabo (Cable Crunch)
  'lib-core-2': { provider: 'exercisedb', externalId: '0472' }, // Elevação de Pernas na Barra Fixa
  'lib-core-3': { provider: 'exercisedb', externalId: '0464' }  // Prancha Isométrica
};
