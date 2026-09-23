import { Home, Dumbbell, Utensils, QrCode, User, LucideIcon } from 'lucide-react';
import { MainTabType, TabType } from '../types';

export interface NavItemConfig {
  id: MainTabType;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  ariaLabel: string;
}

/**
 * Configuração centralizada da navegação principal do SOMMA.
 * Exatamente cinco áreas principais tanto no Desktop quanto no Mobile:
 * [ Início ] [ Treino ] [ Dieta ] [ Pass ] [ Perfil ]
 */
export const MAIN_NAV_ITEMS: NavItemConfig[] = [
  {
    id: 'inicio',
    label: 'Início',
    shortLabel: 'Início',
    icon: Home,
    ariaLabel: 'Ir para a tela inicial',
  },
  {
    id: 'treino',
    label: 'Treino',
    shortLabel: 'Treino',
    icon: Dumbbell,
    ariaLabel: 'Ir para rotinas e treinos',
  },
  {
    id: 'dieta',
    label: 'Dieta',
    shortLabel: 'Dieta',
    icon: Utensils,
    ariaLabel: 'Ir para plano nutricional e macros',
  },
  {
    id: 'pass',
    label: 'Pass',
    shortLabel: 'Pass',
    icon: QrCode,
    ariaLabel: 'Ir para o SOMMA Pass',
  },
  {
    id: 'perfil',
    label: 'Perfil',
    shortLabel: 'Perfil',
    icon: User,
    ariaLabel: 'Ir para perfil e configurações',
  },
];

/**
 * Títulos legíveis exibidos no cabeçalho para todas as áreas e views secundárias
 */
export const TAB_TITLES: Record<TabType, string> = {
  inicio: 'Início',
  treino: 'Treino',
  dieta: 'Dieta & Macros',
  pass: 'SOMMA Pass',
  perfil: 'Perfil',
  evolucao: 'Evolução',
  comunidade: 'Comunidade SOMMA',
  profissionais: 'Equipe & Especialistas',
};
