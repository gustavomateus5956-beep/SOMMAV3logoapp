import React from 'react';

export interface SommaLogoProps {
  className?: string;
  variant?: 'full' | 'full-dark' | 'icon';
}

/**
 * Official SOMMA+ Brand Logo Component
 * - variant="full": /brand/somma-logo-horizontal-white.svg (fundo escuro)
 * - variant="full-dark": /brand/somma-logo-horizontal-dark.svg (fundo claro)
 * - variant="icon": /brand/somma-symbol.svg (símbolo oficial)
 */
export const SommaLogo: React.FC<SommaLogoProps> = ({
  className = 'h-7 w-auto',
  variant = 'full',
}) => {
  const src =
    variant === 'icon'
      ? '/brand/somma-symbol.svg'
      : variant === 'full-dark'
        ? '/brand/somma-logo-horizontal-dark.svg'
        : '/brand/somma-logo-horizontal-white.svg';

  return (
    <img
      src={src}
      alt={variant === 'icon' ? 'Símbolo SOMMA+' : 'Logo SOMMA+'}
      className={`${className} object-contain`}
      draggable={false}
    />
  );
};

