import React, { useState } from 'react';
import { ShieldCheck, Award, X, CheckCircle2, UserCheck, ExternalLink } from 'lucide-react';
import { RoutineCertificate } from '../types';

interface SommaTrainBadgeProps {
  certificate?: RoutineCertificate;
  size?: 'sm' | 'md' | 'lg';
  showDetailsOnClick?: boolean;
  className?: string;
}

export const SommaTrainBadge: React.FC<SommaTrainBadgeProps> = ({
  certificate,
  size = 'md',
  showDetailsOnClick = true,
  className = ''
}) => {
  const [showModal, setShowModal] = useState(false);

  if (!certificate || !certificate.certified) return null;

  const handleClick = (e: React.MouseEvent) => {
    if (showDetailsOnClick) {
      e.stopPropagation();
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        title="Treino prescrito e validado por profissional certificado SOMMA Train"
        className={`inline-flex items-center gap-1.5 rounded-full font-bold transition-all cursor-pointer select-none ${
          size === 'sm'
            ? 'px-2 py-0.5 text-[9px] bg-gradient-to-r from-[#0066ff]/20 via-[#4edea3]/20 to-[#0066ff]/20 border border-[#0066ff]/40 text-[#b3c5ff]'
            : size === 'lg'
            ? 'px-3.5 py-1.5 text-xs bg-gradient-to-r from-[#0066ff]/25 via-[#4edea3]/20 to-[#0066ff]/25 border border-[#0066ff]/50 text-white shadow-sm'
            : 'px-2.5 py-1 text-[10px] bg-gradient-to-r from-[#0066ff]/20 via-[#4edea3]/15 to-[#0066ff]/20 border border-[#0066ff]/40 text-[#b3c5ff] hover:border-[#0066ff]'
        } ${className}`}
      >
        <span className="relative flex items-center justify-center">
          <ShieldCheck className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-[#4edea3] shrink-0`} />
        </span>
        <span className="tracking-wide uppercase font-extrabold flex items-center gap-1">
          <span className="text-[#4edea3]">SOMMA Train</span>
          <span className="text-[#8c90a1]">•</span>
          <span className="text-white">Certificado</span>
        </span>
      </button>

      {/* Certificate Details Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 text-left"
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(false);
          }}
        >
          <div 
            className="w-full max-w-sm bg-[#14181f] border border-[#262a30] rounded-3xl p-5 flex flex-col gap-4 shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0066ff] to-[#4edea3] flex items-center justify-center text-white shadow-lg shadow-[#0066ff]/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    Certificado SOMMA Train
                  </h3>
                  <span className="text-[11px] font-bold text-[#4edea3]">Prescrição Profissional Autenticada</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-full bg-[#1c2025] hover:bg-[#262a30] text-[#c2c6d8] flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Certificate Details Body */}
            <div className="bg-[#101419] p-4 rounded-2xl border border-[#262a30] flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#262a30]/60">
                <span className="text-[11px] text-[#8c90a1] font-medium">Responsável Técnico</span>
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-[#0066ff]" />
                  {certificate.professionalName}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#262a30]/60">
                <span className="text-[11px] text-[#8c90a1] font-medium">Especialidade</span>
                <span className="text-xs font-medium text-[#c2c6d8]">{certificate.professionalRole}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#262a30]/60">
                <span className="text-[11px] text-[#8c90a1] font-medium">Registro Profissional</span>
                <span className="text-xs font-black text-[#4edea3] bg-[#00a572]/15 px-2 py-0.5 rounded-md border border-[#00a572]/30">
                  {certificate.registrationNumber}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#8c90a1] font-medium">Data de Emissão</span>
                <span className="text-xs text-[#c2c6d8]">{certificate.certifiedDate}</span>
              </div>

              {certificate.notes && (
                <div className="mt-1 pt-2.5 border-t border-[#262a30]/60 text-[11px] text-[#8c90a1] leading-relaxed bg-[#14181f]/60 p-2.5 rounded-xl">
                  <strong className="text-white block mb-0.5">Diretriz Técnica do Coach:</strong>
                  {certificate.notes}
                </div>
              )}
            </div>

            {/* Guarantee note */}
            <div className="flex items-center gap-2 px-1 text-[11px] text-[#4edea3]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Garantia de segurança biomecânica e volume periodizado.</span>
            </div>

            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="w-full h-10 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-xs font-bold transition-all cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
