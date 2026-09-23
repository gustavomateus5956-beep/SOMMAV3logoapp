import React, { useState } from 'react';
import { Volume2, Smartphone, Cloud, Download, LogOut, FileText, ChevronDown, ChevronUp } from 'lucide-react';

interface ProfileSettingsSectionProps {
  unit: 'kg' | 'lbs';
  onUnitChange: (u: 'kg' | 'lbs') => void;
  soundEnabled: boolean;
  onSoundChange: (val: boolean) => void;
  vibrateEnabled: boolean;
  onVibrateChange: (val: boolean) => void;
  onExportCsv: () => void;
  onLogout: () => void;
}

export const ProfileSettingsSection: React.FC<ProfileSettingsSectionProps> = ({
  unit,
  onUnitChange,
  soundEnabled,
  onSoundChange,
  vibrateEnabled,
  onVibrateChange,
  onExportCsv,
  onLogout
}) => {
  const [showLicenses, setShowLicenses] = useState(false);

  return (
    <>
      {/* Configurações do Aplicativo */}
      <section className="bg-[#1c2025] rounded-3xl p-5 border border-[#262a30] flex flex-col gap-3 shadow-sm">
        <h2 className="text-xs font-extrabold text-white uppercase tracking-wider">
          Configurações do Aplicativo
        </h2>

        {/* Unit Toggle */}
        <div className="flex items-center justify-between py-2 border-b border-[#262a30]/50">
          <div className="flex flex-col">
            <span className="text-xs text-[#c2c6d8] font-semibold">Unidade de Carga</span>
            <span className="text-[11px] text-[#8c90a1]">Padrão para registro de peso nos exercícios</span>
          </div>
          <div className="flex bg-[#181c21] p-0.5 rounded-lg border border-[#262a30]">
            <button
              type="button"
              onClick={() => onUnitChange('kg')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                unit === 'kg' ? 'bg-[#0066ff] text-white' : 'text-[#8c90a1]'
              }`}
            >
              KG
            </button>
            <button
              type="button"
              onClick={() => onUnitChange('lbs')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                unit === 'lbs' ? 'bg-[#0066ff] text-white' : 'text-[#8c90a1]'
              }`}
            >
              LBS
            </button>
          </div>
        </div>

        {/* Sound toggle */}
        <div className="flex items-center justify-between py-2 border-b border-[#262a30]/50">
          <div className="flex items-center gap-2.5">
            <Volume2 className="w-4 h-4 text-[#8c90a1]" />
            <span className="text-xs text-[#c2c6d8] font-semibold">Som ao término do descanso</span>
          </div>
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(e) => onSoundChange(e.target.checked)}
            className="w-4 h-4 accent-[#0066ff] cursor-pointer"
          />
        </div>

        {/* Vibration toggle */}
        <div className="flex items-center justify-between py-2 border-b border-[#262a30]/50">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-4 h-4 text-[#8c90a1]" />
            <span className="text-xs text-[#c2c6d8] font-semibold">Vibração ao registrar série</span>
          </div>
          <input
            type="checkbox"
            checked={vibrateEnabled}
            onChange={(e) => onVibrateChange(e.target.checked)}
            className="w-4 h-4 accent-[#0066ff] cursor-pointer"
          />
        </div>

        {/* Cloud sync indicator */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2.5">
            <Cloud className="w-4 h-4 text-[#0066ff]" />
            <span className="text-xs text-[#c2c6d8] font-semibold">Persistência local segura</span>
          </div>
          <span className="text-xs font-bold text-[#4edea3]">Sincronizado</span>
        </div>
      </section>

      {/* Sobre → Licenças e Créditos */}
      <section className="bg-[#1c2025] rounded-3xl p-5 border border-[#262a30] flex flex-col gap-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0066ff]" />
            <h2 className="text-xs font-extrabold text-white uppercase tracking-wider">
              Sobre → Licenças e Créditos
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowLicenses(!showLicenses)}
            className="text-xs text-[#8c90a1] hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>{showLicenses ? 'Recolher' : 'Ver licenças'}</span>
            {showLicenses ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <p className="text-xs text-[#8c90a1] leading-relaxed">
          O SOMMA+ utiliza bibliotecas de código aberto e demonstrações visuais biomecânicas devidamente licenciadas para orientar sua execução de treino.
        </p>

        {showLicenses && (
          <div className="mt-2 p-3.5 rounded-2xl bg-[#14181f] border border-[#262a30] flex flex-col gap-3 text-xs text-[#c2c6d8] animate-in fade-in duration-200">
            {/* ExerciseDB Attribution */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Catálogo de Demonstração Biomecânica</span>
                <span className="text-[10px] text-[#8c90a1] bg-[#1c2025] px-2 py-0.5 rounded font-mono">
                  API V1
                </span>
              </div>
              <p className="text-[11px] text-[#8c90a1] leading-relaxed">
                Demonstrações de execução técnica e catálogo integrado sob termos de conformidade visual do aplicativo.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Export and Logout Actions */}
      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={onExportCsv}
          className="w-full h-11 rounded-2xl bg-[#1c2025] hover:bg-[#262a30] text-white text-xs font-bold border border-[#262a30] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
        >
          <Download className="w-4 h-4 text-[#0066ff]" />
          <span>Exportar Histórico de Cargas (CSV)</span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="w-full h-11 rounded-2xl text-xs font-bold text-[#ffb59d] hover:text-red-400 bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair da conta no dispositivo</span>
        </button>
      </div>
    </>
  );
};
