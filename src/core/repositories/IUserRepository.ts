import { UserProfile } from '../../types';

/**
 * Contrato de repositório para o domínio de Usuário e Sessão.
 * Todos os métodos são obrigatoriamente assíncronos (retornam Promise) para
 * permitir substituição transparente por clientes de API HTTP no futuro.
 */
export interface IUserRepository {
  /**
   * Retorna todos os usuários registrados.
   */
  getAllUsers(): Promise<UserProfile[]>;

  /**
   * Busca um usuário pelo seu ID único.
   */
  getUserById(id: string): Promise<UserProfile | null>;

  /**
   * Busca um usuário pelo seu endereço de e-mail.
   */
  getUserByEmail(email: string): Promise<UserProfile | null>;

  /**
   * Salva ou atualiza os dados cadastrais de um usuário.
   */
  saveUser(user: UserProfile): Promise<void>;

  /**
   * Armazena o identificador da sessão ativa.
   */
  saveSession(userId: string): Promise<void>;

  /**
   * Recupera o perfil do usuário atualmente autenticado na sessão.
   */
  getSession(): Promise<UserProfile | null>;
  getCurrentSession?(): Promise<UserProfile | null>;

  /**
   * Encerra a sessão ativa do usuário.
   */
  removeSession(): Promise<void>;
  clearSession?(): Promise<void>;

  /**
   * Limpa os dados de usuário e histórico associados.
   */
  clearUserData(userId: string): Promise<void>;
}
