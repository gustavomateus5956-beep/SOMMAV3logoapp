import React from 'react';
import { Edit3, X, AlertCircle, Check } from 'lucide-react';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  formError: string | null;
  editName: string;
  onEditNameChange: (v: string) => void;
  editUsername: string;
  onEditUsernameChange: (v: string) => void;
  editEmail: string;
  onEditEmailChange: (v: string) => void;
  editAge: string;
  onEditAgeChange: (v: string) => void;
  editWeight: string;
  onEditWeightChange: (v: string) => void;
  editHeight: string;
  onEditHeightChange: (v: string) => void;
  editGoal: string;
  onEditGoalChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  formError,
  editName,
  onEditNameChange,
  editUsername,
  onEditUsernameChange,
  editEmail,
  onEditEmailChange,
  editAge,
  onEditAgeChange,
  editWeight,
  onEditWeightChange,
  editHeight,
  onEditHeightChange,
  editGoal,
  onEditGoalChange,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#1c2025] border border-[#262a30] rounded-t-3xl sm:rounded-3xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-250">
        
        {/* Modal Header */}
        <div className="px-5 py-4 bg-[#181c21] border-b border-[#262a30] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[#0066ff]" />
            <h3 className="text-sm font-bold text-white">Editar Dados Pessoais</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#262a30] hover:bg-[#31353b] flex items-center justify-center text-[#c2c6d8] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={onSubmit} className="p-5 flex-1 overflow-y-auto space-y-4 no-scrollbar">
          
          {formError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Nome Completo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#c2c6d8]">
              Nome Completo <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => onEditNameChange(e.target.value)}
              placeholder="Seu nome"
              className="w-full h-11 px-3.5 rounded-xl bg-[#181c21] border border-[#262a30] text-white text-xs focus:outline-none focus:border-[#0066ff] transition-colors"
            />
          </div>

          {/* Nome de Usuário (@username) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#c2c6d8]">
                Nome de Usuário (@username) <span className="text-red-400">*</span>
              </label>
              <span className="text-[10px] text-[#8c90a1]">letras, números, ponto e underline</span>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-xs font-bold text-[#0066ff]">@</span>
              <input
                type="text"
                value={editUsername}
                onChange={(e) => {
                  const clean = e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, '');
                  onEditUsernameChange(clean);
                }}
                placeholder="seunome"
                className="w-full h-11 pl-8 pr-3.5 rounded-xl bg-[#181c21] border border-[#262a30] text-white text-xs focus:outline-none focus:border-[#0066ff] transition-colors"
              />
            </div>
          </div>

          {/* E-mail */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#c2c6d8]">E-mail</label>
            <input
              type="email"
              value={editEmail}
              onChange={(e) => onEditEmailChange(e.target.value)}
              placeholder="exemplo@email.com"
              className="w-full h-11 px-3.5 rounded-xl bg-[#181c21] border border-[#262a30] text-white text-xs focus:outline-none focus:border-[#0066ff] transition-colors"
            />
          </div>

          {/* Idade, Altura, Peso in 3 columns */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#c2c6d8]">Idade (anos)</label>
              <input
                type="number"
                min="10"
                max="110"
                value={editAge}
                onChange={(e) => onEditAgeChange(e.target.value)}
                placeholder="26"
                className="w-full h-11 px-3 rounded-xl bg-[#181c21] border border-[#262a30] text-white text-xs focus:outline-none focus:border-[#0066ff] transition-colors text-center"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#c2c6d8]">Peso (kg)</label>
              <input
                type="number"
                step="0.1"
                min="30"
                max="250"
                value={editWeight}
                onChange={(e) => onEditWeightChange(e.target.value)}
                placeholder="82.4"
                className="w-full h-11 px-3 rounded-xl bg-[#181c21] border border-[#262a30] text-white text-xs focus:outline-none focus:border-[#0066ff] transition-colors text-center"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#c2c6d8]">Altura (m)</label>
              <input
                type="number"
                step="0.01"
                min="1.0"
                max="2.5"
                value={editHeight}
                onChange={(e) => onEditHeightChange(e.target.value)}
                placeholder="1.78"
                className="w-full h-11 px-3 rounded-xl bg-[#181c21] border border-[#262a30] text-white text-xs focus:outline-none focus:border-[#0066ff] transition-colors text-center"
              />
            </div>
          </div>

          {/* Objetivo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#c2c6d8]">Objetivo Principal</label>
            <input
              type="text"
              value={editGoal}
              onChange={(e) => onEditGoalChange(e.target.value)}
              placeholder="Ex: Hipertrofia e Força"
              className="w-full h-11 px-3.5 rounded-xl bg-[#181c21] border border-[#262a30] text-white text-xs focus:outline-none focus:border-[#0066ff] transition-colors"
            />
            {/* Quick Goal Pills */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {[
                'Hipertrofia e Força',
                'Definição Muscular',
                'Condicionamento Geral',
                'Perda de Gordura',
                'Longevidade & Saúde'
              ].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onEditGoalChange(preset)}
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                    editGoal === preset
                      ? 'bg-[#0066ff] text-white border-[#0066ff]'
                      : 'bg-[#181c21] text-[#8c90a1] border-[#262a30] hover:text-white'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center gap-2 pt-4 border-t border-[#262a30]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl bg-[#181c21] hover:bg-[#262a30] text-[#c2c6d8] text-xs font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 h-11 rounded-xl bg-[#0066ff] hover:bg-[#0052cc] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#0066ff]/25"
            >
              <Check className="w-4 h-4" />
              <span>Salvar alterações</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
