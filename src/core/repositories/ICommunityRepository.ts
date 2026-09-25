import { CommunityPost, Comment } from '../../types';

export interface ToggleLikeResult {
  likesCount: number;
  isLiked: boolean;
}

/**
 * Contrato de repositório para o domínio Social / Comunidade / Feed de Atletas.
 */
export interface ICommunityRepository {
  /**
   * Retorna a lista de postagens do feed comunitário.
   */
  getPosts(): Promise<CommunityPost[]>;

  /**
   * Cria ou atualiza uma postagem no feed comunitário.
   */
  savePost(post: CommunityPost): Promise<void>;

  /**
   * Alterna a curtida (dar força) em uma postagem específica.
   */
  toggleLikePost(postId: string, userId: string): Promise<ToggleLikeResult>;

  /**
   * Adiciona um comentário a uma postagem do feed.
   */
  addComment(postId: string, comment: Comment): Promise<Comment[]>;
}
