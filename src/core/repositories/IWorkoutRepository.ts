import { WorkoutSessionRecord } from '../../types';

export interface PreviousExercisePerformance {
  sets: Array<{
    weight: number;
    reps: number;
  }>;
}

/**
 * Contrato de repositório para o domínio de Treino e Sessões de Treinamento.
 * Focado exclusivamente no acesso, consulta e persistência dos dados de treino.
 */
export interface IWorkoutRepository {
  /**
   * Retorna todo o histórico de sessões de treino concluídas de um determinado usuário.
   */
  getWorkoutHistory(userId: string): Promise<WorkoutSessionRecord[]>;
  getWorkoutSessions(userId: string): Promise<WorkoutSessionRecord[]>;

  /**
   * Salva uma nova sessão de treino concluída no histórico do usuário.
   */
  saveWorkoutSession(userId: string, session: WorkoutSessionRecord): Promise<void>;

  /**
   * Consulta a performance anterior executada para um determinado exercício.
   * Utilizado para pré-carregar séries, cargas e repetições na tela de treino ativo.
   */
  getLastExercisePerformance(
    userId: string,
    exerciseName: string
  ): Promise<PreviousExercisePerformance | null>;
}
