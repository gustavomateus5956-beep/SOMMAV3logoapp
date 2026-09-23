import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  category?: string;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  onBack?: () => void;
  backLabel?: string;
}

/**
 * Standardized Page Header for SOMMA+ views.
 * Enforces the visual hierarchy:
 * - CATEGORIA (uppercase subtle tracking)
 * - Título principal (text-2xl font-extrabold text-white)
 * - Subtítulo / contexto (text-xs text-[#8c90a1])
 * - Contextual ← Voltar for secondary views
 * - Right-side badges or contextual actions
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  category,
  title,
  subtitle,
  badge,
  action,
  onBack,
  backLabel = 'Voltar'
}) => {
  return (
    <div className="flex flex-col gap-2 pt-1 pb-1">
      {onBack && (
        <div className="flex items-center">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-[#8c90a1] hover:text-white font-bold px-2.5 py-1.5 rounded-xl bg-[#1c2025] hover:bg-[#262a30] border border-[#262a30] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{backLabel}</span>
          </button>
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col min-w-0">
          {category && (
            <span className="text-[11px] font-bold text-[#8c90a1] tracking-wider uppercase">
              {category}
            </span>
          )}
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-[#8c90a1] mt-0.5 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {(badge || action) && (
          <div className="flex items-center gap-2 shrink-0 pt-0.5">
            {badge}
            {action}
          </div>
        )}
      </div>
    </div>
  );
};
