import React from 'react';
import { 
  X, 
  Camera, 
  Check, 
  UploadCloud, 
  Plus 
} from 'lucide-react';
import { useScrollLock } from '../../hooks/useScrollLock';

interface CommunityCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  postType?: 'feed' | 'routine';
  onPostTypeChange?: (type: 'feed' | 'routine') => void;
  newMuscleGroup: string;
  onMuscleGroupChange: (val: string) => void;
  newHighlightBadge: string;
  onHighlightBadgeChange: (val: string) => void;
  newCaption: string;
  onCaptionChange: (val: string) => void;
  newPostImage: string | null;
  onRemoveImage: () => void;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onSetPresetImage: (url: string) => void;
  onPublish: () => void;
}

export const CommunityCreateModal: React.FC<CommunityCreateModalProps> = ({
  isOpen,
  onClose,
  newMuscleGroup,
  onMuscleGroupChange,
  newHighlightBadge,
  onHighlightBadgeChange,
  newCaption,
  onCaptionChange,
  newPostImage,
  onRemoveImage,
  onImageSelect,
  fileInputRef,
  onSetPresetImage,
  onPublish
}) => {
  useScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto overscroll-contain">
      <div className="w-full max-w-md bg-[#181c21] border border-[#262a30] rounded-3xl p-5 flex flex-col gap-4 shadow-2xl animate-in zoom-in-95 max-h-[92vh] overflow-y-auto overscroll-contain my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#262a30]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#0066ff]/20 text-[#0066ff] flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Compartilhar Evolução</h3>
              <p className="text-[11px] text-[#8c90a1]">Publique seu treino ou shape no feed da comunidade</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar modal"
            className="w-8 h-8 rounded-full bg-[#1c2025] hover:bg-[#262a30] text-[#c2c6d8] flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title / Muscle Target */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#c2c6d8]">Grupo Muscular</label>
            <input
              type="text"
              value={newMuscleGroup}
              onChange={(e) => onMuscleGroupChange(e.target.value)}
              placeholder="Ex: Peitoral e Ombros"
              className="h-10 px-3 rounded-xl bg-[#101419] border border-[#262a30] text-white text-xs outline-none focus:border-[#0066ff]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#c2c6d8]">Destaque / PR</label>
            <input
              type="text"
              value={newHighlightBadge}
              onChange={(e) => onHighlightBadgeChange(e.target.value)}
              placeholder="Ex: PR 96kg Supino"
              className="h-10 px-3 rounded-xl bg-[#101419] border border-[#262a30] text-white text-xs outline-none focus:border-[#0066ff]"
            />
          </div>
        </div>

        {/* Caption */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#c2c6d8]">
            Legenda da Publicação
          </label>
          <textarea
            placeholder="Compartilhe suas percepções de carga, intensidade ou conquista..."
            value={newCaption}
            onChange={(e) => onCaptionChange(e.target.value)}
            className="w-full h-20 p-3 rounded-xl bg-[#101419] border border-[#262a30] text-white text-xs placeholder:text-[#8c90a1] focus:border-[#0066ff] outline-none resize-none"
          />
        </div>

        {/* Photo Upload Box */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#c2c6d8] flex items-center justify-between">
            <span>Foto da Evolução ou Aparelho</span>
            {newPostImage && (
              <button
                type="button"
                onClick={onRemoveImage}
                className="text-[11px] text-[#ffb59d] hover:underline cursor-pointer"
              >
                Remover foto
              </button>
            )}
          </label>

          {newPostImage ? (
            <div className="relative rounded-xl overflow-hidden border border-[#262a30] h-40 bg-black">
              <img
                src={newPostImage}
                alt="Preview da foto selecionada"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-black/70 text-[10px] font-bold text-[#4edea3] flex items-center gap-1">
                <Check className="w-3 h-3" /> Foto Pronta
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="h-24 rounded-2xl border-2 border-dashed border-[#262a30] hover:border-[#0066ff]/60 bg-[#101419] flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <UploadCloud className="w-5 h-5 text-[#0066ff]" />
              <span className="text-xs font-bold text-white">Toque para selecionar foto</span>
              <span className="text-[10px] text-[#8c90a1]">Foto do shape ou aparelho</span>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={onImageSelect}
            className="hidden"
          />
        </div>

        {/* Presets */}
        {!newPostImage && (
          <div className="flex items-center gap-1.5 text-[11px] text-[#8c90a1]">
            <span>Ou use um exemplo:</span>
            <button
              type="button"
              onClick={() =>
                onSetPresetImage(
                  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop'
                )
              }
              className="px-2 py-0.5 rounded-md bg-[#262a30] hover:bg-[#31353b] text-[#b3c5ff] cursor-pointer"
            >
              Academia
            </button>
            <button
              type="button"
              onClick={() =>
                onSetPresetImage(
                  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop'
                )
              }
              className="px-2 py-0.5 rounded-md bg-[#262a30] hover:bg-[#31353b] text-[#b3c5ff] cursor-pointer"
            >
              Halteres
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t border-[#262a30]">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-xl bg-[#262a30] hover:bg-[#31353b] text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onPublish}
            className="flex-1 h-11 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-xs font-bold text-white shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Publicar no Feed</span>
          </button>
        </div>

      </div>
    </div>
  );
};
