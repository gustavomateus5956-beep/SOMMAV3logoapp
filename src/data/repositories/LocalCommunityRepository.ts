import { ICommunityRepository, ToggleLikeResult } from '../../core/repositories/ICommunityRepository';
import { CommunityPost, Comment } from '../../types';
import { storageService } from '../../services/storageService';
import { DataAccessError } from '../../core/errors/dataErrors';

/**
 * Implementação local do repositório da comunidade que delega as operações ao storageService.
 * Envolve as chamadas síncronas de localStorage em Promises para cumprir a interface ICommunityRepository.
 */
export class LocalCommunityRepository implements ICommunityRepository {
  async getPosts(): Promise<CommunityPost[]> {
    try {
      return storageService.getCommunityPosts();
    } catch (error) {
      throw new DataAccessError('Falha ao recuperar posts da comunidade.', 'LOCAL_COMMUNITY_GET_POSTS_ERROR', error);
    }
  }

  async savePost(post: CommunityPost): Promise<void> {
    try {
      storageService.saveCommunityPost(post);
    } catch (error) {
      throw new DataAccessError(`Falha ao salvar post "${post.id}".`, 'LOCAL_COMMUNITY_SAVE_POST_ERROR', error);
    }
  }

  async toggleLikePost(postId: string, userId: string): Promise<ToggleLikeResult> {
    try {
      return storageService.toggleLikePost(postId, userId);
    } catch (error) {
      throw new DataAccessError(`Falha ao curtir/descurtir post "${postId}".`, 'LOCAL_COMMUNITY_TOGGLE_LIKE_ERROR', error);
    }
  }

  async addComment(postId: string, comment: Comment): Promise<Comment[]> {
    try {
      return storageService.addCommentToPost(postId, comment);
    } catch (error) {
      throw new DataAccessError(`Falha ao adicionar comentário ao post "${postId}".`, 'LOCAL_COMMUNITY_ADD_COMMENT_ERROR', error);
    }
  }
}
