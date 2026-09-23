import React from 'react';
import { 
  Flame, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles, 
  Check, 
  Copy, 
  Send 
} from 'lucide-react';
import { FeedPost } from '../../types';

interface CommunityFeedPostCardProps {
  post: FeedPost;
  onToggleCheer: (id: string) => void;
  onCopyRoutine: (id: string) => void;
  isCopied: boolean;
  isCommentsOpen: boolean;
  onToggleComments: () => void;
  commentInput: string;
  onCommentInputChange: (val: string) => void;
  onSendComment: () => void;
}

export const CommunityFeedPostCard: React.FC<CommunityFeedPostCardProps> = ({
  post,
  onToggleCheer,
  onCopyRoutine,
  isCopied,
  isCommentsOpen,
  onToggleComments,
  commentInput,
  onCommentInputChange,
  onSendComment
}) => {
  return (
    <article className="bg-[#1c2025] rounded-2xl p-4 md:p-5 border border-[#262a30] flex flex-col gap-3.5 shadow-sm">
      {/* Post Header: Avatar, Name, Badges, Time & Instagram Export Button */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={post.authorAvatar}
            alt={`Foto de ${post.authorName}`}
            className="w-10 h-10 rounded-full object-cover ring-1 ring-[#31353b] bg-[#262a30]"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-bold text-white leading-none">{post.authorName}</span>
              {post.authorVerified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0066ff] fill-[#0066ff]" />
              )}
              {post.isInfluencer || post.authorBadge === 'INFLUENCER SOMMA' ? (
                <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-[#ffd700]/25 via-[#ff9900]/20 to-[#0066ff]/25 text-[#ffd700] border border-[#ffd700]/40 shadow-sm shadow-[#ffd700]/10 tracking-wider">
                  <Sparkles className="w-2.5 h-2.5 text-[#ffd700]" />
                  <span>SELO SOMMA INFLUENCER</span>
                </span>
              ) : post.authorBadge ? (
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#0066ff]/20 text-[#b3c5ff]">
                  {post.authorBadge}
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#8c90a1] mt-1">
              {post.authorHandle && (
                <>
                  <span className="text-[#0066ff] font-semibold">{post.authorHandle}</span>
                  <span>•</span>
                </>
              )}
              <span>{post.timeAgo} {post.location && `• ${post.location}`}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Post Tags & Title */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          {post.tag1 && (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#ffb59d]/15 text-[#ffb59d] uppercase">
              {post.tag1}
            </span>
          )}
          {post.tag2 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#262a30] text-[#c2c6d8] uppercase">
              {post.tag2}
            </span>
          )}
        </div>
        <h3 className="text-base font-bold text-white">{post.title}</h3>
        {post.caption && (
          <p className="text-xs text-[#c2c6d8] leading-relaxed">{post.caption}</p>
        )}
      </div>

      {/* Post Photo (if present) */}
      {post.imageUrl && (
        <div className="relative rounded-xl overflow-hidden border border-[#262a30] max-h-96 bg-black">
          <img
            src={post.imageUrl}
            alt={`Foto da postagem de ${post.authorName}`}
            className="w-full h-auto object-cover max-h-96"
          />
        </div>
      )}

      {/* Workout Performance Strip */}
      <div className="grid grid-cols-4 gap-2 bg-[#181c21] p-3 rounded-xl border border-[#262a30]/70 text-center">
        <div>
          <span className="text-[10px] font-bold text-[#8c90a1] uppercase block">Duração</span>
          <span className="text-xs font-extrabold text-white">{post.duration}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-[#8c90a1] uppercase block">Volume</span>
          <span className="text-xs font-extrabold text-[#b3c5ff]">{post.volume}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-[#8c90a1] uppercase block">Exercícios</span>
          <span className="text-xs font-extrabold text-white">{post.exercisesCount}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-[#ffb59d] uppercase block">PRs</span>
          <span className="text-xs font-extrabold text-[#ffb59d]">
            {(post.prsCount && post.prsCount > 0) ? `+${post.prsCount}` : '0'}
          </span>
        </div>
      </div>

      {/* Exercises Preview List */}
      {post.exercisesPreview && post.exercisesPreview.length > 0 && (
        <div className="space-y-1.5 pt-1">
          {post.exercisesPreview.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-[#181c21]/60"
            >
              <span className="text-[#c2c6d8] font-medium truncate max-w-[200px]">
                {item.name}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-white font-bold">{item.detail}</span>
                {item.isPr && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-[#ffb59d]/20 text-[#ffb59d]">
                    PR
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions Bar: Dar Força, Comentários, Copiar Rotina, Instagram */}
      <div className="flex items-center justify-between pt-2 border-t border-[#262a30]/60">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => onToggleCheer(post.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all text-xs font-bold cursor-pointer ${
              post.userCheered
                ? 'bg-[#ffb59d]/20 text-[#ffb59d] border border-[#ffb59d]/40'
                : 'bg-[#181c21] text-[#c2c6d8] hover:text-white border border-[#262a30]'
            }`}
          >
            <Flame className={`w-4 h-4 ${post.userCheered ? 'fill-[#ffb59d]' : ''}`} />
            <span>Dar Força ({post.cheerCount})</span>
          </button>

          <button
            type="button"
            onClick={onToggleComments}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181c21] hover:bg-[#262a30] text-[#c2c6d8] hover:text-white border border-[#262a30] text-xs font-medium transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{post.commentsCount}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onCopyRoutine(post.id)}
            className="flex items-center gap-1.5 text-xs text-[#b3c5ff] hover:text-white font-semibold transition-colors cursor-pointer"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#4edea3]" />
                <span className="text-[#4edea3]">Salvo!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copiar Rotina</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Comments Drawer */}
      {isCommentsOpen && (
        <div className="mt-2 pt-3 border-t border-[#262a30] flex flex-col gap-2.5 animate-in slide-in-from-top-2 duration-150">
          {post.comments && post.comments.length > 0 ? (
            <div className="flex flex-col gap-2">
              {post.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-start gap-2.5 p-2 rounded-xl bg-[#181c21] text-xs"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white">{comment.author}</span>
                      {comment.role && (
                        <span className="text-[9px] px-1 rounded bg-[#262a30] text-[#8c90a1]">
                          {comment.role}
                        </span>
                      )}
                    </div>
                    <p className="text-[#c2c6d8] mt-0.5">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#8c90a1] italic">Nenhum comentário ainda. Seja o primeiro!</p>
          )}

          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => onCommentInputChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSendComment()}
              placeholder="Escreva um comentário de incentivo..."
              className="flex-1 h-9 px-3 rounded-xl bg-[#181c21] border border-[#262a30] text-xs text-white placeholder:text-[#8c90a1] focus:border-[#0066ff] outline-none"
            />
            <button
              type="button"
              onClick={onSendComment}
              className="h-9 px-3 bg-[#0066ff] hover:bg-[#0054d6] text-white rounded-xl text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </article>
  );
};
