import { IUserRepository } from '../../core/repositories/IUserRepository';
import { UserProfile } from '../../types';
import { storageService } from '../../services/storageService';
import { DataAccessError } from '../../core/errors/dataErrors';

/**
 * Implementação local do repositório de usuários que delega as operações ao storageService.
 * Envolve as chamadas síncronas de localStorage em Promises para cumprir a interface IUserRepository.
 */
export class LocalUserRepository implements IUserRepository {
  async getAllUsers(): Promise<UserProfile[]> {
    try {
      return storageService.getAllUsers();
    } catch (error) {
      throw new DataAccessError('Falha ao recuperar usuários do armazenamento local.', 'LOCAL_USER_GET_ALL_ERROR', error);
    }
  }

  async getUserById(id: string): Promise<UserProfile | null> {
    try {
      return storageService.getUserById(id);
    } catch (error) {
      throw new DataAccessError(`Falha ao buscar usuário pelo ID "${id}".`, 'LOCAL_USER_GET_BY_ID_ERROR', error);
    }
  }

  async getUserByEmail(email: string): Promise<UserProfile | null> {
    try {
      return storageService.getUserByEmail(email);
    } catch (error) {
      throw new DataAccessError(`Falha ao buscar usuário pelo e-mail "${email}".`, 'LOCAL_USER_GET_BY_EMAIL_ERROR', error);
    }
  }

  async saveUser(user: UserProfile): Promise<void> {
    try {
      storageService.saveUser(user);
    } catch (error) {
      throw new DataAccessError('Falha ao salvar dados de usuário no armazenamento local.', 'LOCAL_USER_SAVE_ERROR', error);
    }
  }

  async saveSession(userId: string): Promise<void> {
    try {
      storageService.saveSession(userId);
    } catch (error) {
      throw new DataAccessError('Falha ao salvar sessão do usuário no armazenamento local.', 'LOCAL_USER_SAVE_SESSION_ERROR', error);
    }
  }

  async getSession(): Promise<UserProfile | null> {
    try {
      return storageService.getSession();
    } catch (error) {
      throw new DataAccessError('Falha ao recuperar sessão ativa no armazenamento local.', 'LOCAL_USER_GET_SESSION_ERROR', error);
    }
  }

  async getCurrentSession(): Promise<UserProfile | null> {
    return this.getSession();
  }

  async removeSession(): Promise<void> {
    try {
      storageService.removeSession();
    } catch (error) {
      throw new DataAccessError('Falha ao remover sessão ativa.', 'LOCAL_USER_REMOVE_SESSION_ERROR', error);
    }
  }

  async clearSession(): Promise<void> {
    return this.removeSession();
  }

  async clearUserData(userId: string): Promise<void> {
    try {
      storageService.clearUserData(userId);
    } catch (error) {
      throw new DataAccessError(`Falha ao limpar dados do usuário "${userId}".`, 'LOCAL_USER_CLEAR_DATA_ERROR', error);
    }
  }
}
