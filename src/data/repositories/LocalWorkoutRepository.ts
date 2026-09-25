import { IWorkoutRepository, PreviousExercisePerformance } from '../../core/repositories/IWorkoutRepository';
import { WorkoutSessionRecord } from '../../types';
import { storageService } from '../../services/storageService';
import { DataAccessError } from '../../core/errors/dataErrors';

/**
 * Implementação local do repositório de treinos que delega as operações ao storageService.
 * Envolve as chamadas síncronas de localStorage em Promises para cumprir a interface IWorkoutRepository.
 */
export class LocalWorkoutRepository implements IWorkoutRepository {
  async getWorkoutHistory(userId: string): Promise<WorkoutSessionRecord[]> {
    try {
      return storageService.getWorkoutSessions(userId);
    } catch (error) {
      throw new DataAccessError(
        `Falha ao recuperar histórico de treinos do usuário "${userId}".`,
        'LOCAL_WORKOUT_GET_HISTORY_ERROR',
        error
      );
    }
  }

  async getWorkoutSessions(userId: string): Promise<WorkoutSessionRecord[]> {
    return this.getWorkoutHistory(userId);
  }

  async saveWorkoutSession(userId: string, session: WorkoutSessionRecord): Promise<void> {
    try {
      storageService.saveWorkoutSession(userId, session);
    } catch (error) {
      throw new DataAccessError(
        `Falha ao salvar sessão de treino para o usuário "${userId}".`,
        'LOCAL_WORKOUT_SAVE_SESSION_ERROR',
        error
      );
    }
  }

  async getLastExercisePerformance(
    userId: string,
    exerciseName: string
  ): Promise<PreviousExercisePerformance | null> {
    try {
      return storageService.getLastExercisePerformance(userId, exerciseName);
    } catch (error) {
      throw new DataAccessError(
        `Falha ao consultar performance anterior do exercício "${exerciseName}".`,
        'LOCAL_WORKOUT_GET_LAST_PERF_ERROR',
        error
      );
    }
  }
}
