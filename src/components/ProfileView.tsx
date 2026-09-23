import React, { useState, useRef } from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { USER_PROFILE, MOCK_PROFESSIONALS } from '../data/mockData';
import { useUser } from '../context/UserContext';
import { Professional } from '../types';
import { PageHeader } from './PageHeader';

import { ProfileIdentityCard } from './profile/ProfileIdentityCard';
import { ProfilePlanSection } from './profile/ProfilePlanSection';
import { ProfileTeamSection } from './profile/ProfileTeamSection';
import { ProfileSettingsSection } from './profile/ProfileSettingsSection';
import { ProfileEditModal } from './profile/ProfileEditModal';

interface ProfileViewProps {
  onOpenPlans: () => void;
  onNavigateToProfessionals: () => void;
  onSelectProfessional?: (professional: Professional) => void;
  onNavigateToEvolution?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onOpenPlans,
  onNavigateToProfessionals,
  onSelectProfessional,
  onNavigateToEvolution
}) => {
  const { user, logout, updateUser } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // App settings state
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrateEnabled, setVibrateEnabled] = useState(true);

  // Edit profile modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Form state for editing personal data
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAge, setEditAge] = useState<string>('');
  const [editHeight, setEditHeight] = useState<string>('');
  const [editWeight, setEditWeight] = useState<string>('');
  const [editGoal, setEditGoal] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3200);
  };

  // Derive display values from user or mock
  const displayName = user?.name || USER_PROFILE.name;
  const displayUsername = user?.username || (user?.name ? user.name.toLowerCase().replace(/[^a-z0-9_.]/g, '') : 'lucasandrade');
  const displayEmail = user?.email || 'lucas@somma.com';
  const displayAvatar = user?.avatar || USER_PROFILE.avatar;
  const displayRole = user?.role || USER_PROFILE.role;
  const displayAge = user?.age ?? 26;
  const displayWeight = user?.weight ?? USER_PROFILE.weight;
  const displayHeight = user?.height ?? USER_PROFILE.height;
  const displayGoal = user?.goal || 'Hipertrofia e Força';
  const displayPlan = user?.plan || 'SOMMA Black Anual';
  const displayWorkouts = user?.totalWorkouts ?? USER_PROFILE.totalWorkouts;

  // Resolve linked professionals
  const linkedProfessionals = React.useMemo(() => {
    if (user && user.linkedProfessionalIds !== undefined) {
      if (user.linkedProfessionalIds.length === 0) {
        return [];
      }
      return MOCK_PROFESSIONALS.filter((p) => user.linkedProfessionalIds?.includes(p.id));
    }
    return MOCK_PROFESSIONALS.filter((p) => p.isLinkedToUserPlan);
  }, [user]);

  // Open Edit Modal and prefill with current data
  const handleOpenEditModal = () => {
    setEditName(displayName);
    setEditUsername(displayUsername);
    setEditEmail(displayEmail);
    setEditAge(displayAge ? String(displayAge) : '');
    setEditHeight(displayHeight ? String(displayHeight) : '');
    setEditWeight(displayWeight ? String(displayWeight) : '');
    setEditGoal(displayGoal);
    setFormError(null);
    setIsEditModalOpen(true);
  };

  // Validate and save edited personal data
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = editName.trim();
    if (!cleanName) {
      setFormError('O nome completo não pode ficar vazio.');
      return;
    }

    const cleanUsername = editUsername
      .toLowerCase()
      .trim()
      .replace(/^@+/, '')
      .replace(/[^a-z0-9_.]/g, '');

    if (!cleanUsername) {
      setFormError('O nome de usuário não pode ficar vazio.');
      return;
    }

    if (cleanUsername.length < 3) {
      setFormError('O nome de usuário deve ter no mínimo 3 caracteres.');
      return;
    }

    const parsedAge = editAge ? parseInt(editAge, 10) : undefined;
    const parsedHeight = editHeight ? parseFloat(editHeight.replace(',', '.')) : undefined;
    const parsedWeight = editWeight ? parseFloat(editWeight.replace(',', '.')) : undefined;

    updateUser({
      name: cleanName,
      username: cleanUsername,
      email: editEmail.trim() || displayEmail,
      age: parsedAge && !isNaN(parsedAge) ? parsedAge : displayAge,
      height: parsedHeight && !isNaN(parsedHeight) ? parsedHeight : displayHeight,
      weight: parsedWeight && !isNaN(parsedWeight) ? parsedWeight : displayWeight,
      goal: editGoal.trim() || displayGoal,
    });

    setIsEditModalOpen(false);
    showToast('Dados pessoais e usuário atualizados com sucesso!');
  };

  // Handle local avatar photo selection with canvas compression to JPEG Base64
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Por favor, selecione um arquivo de imagem válido (JPG, PNG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          updateUser({ avatar: compressedDataUrl });
          showToast('Foto de perfil alterada e salva com sucesso!');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);

    e.target.value = '';
  };

  return (
    <div className="flex flex-col w-full pb-24 md:pb-12 gap-5 max-w-[480px] md:max-w-none mx-auto">
      
      {/* Visual Feedback Toast */}
      {feedbackToast && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-[#0066ff] text-white text-xs font-bold shadow-xl border border-white/20 flex items-center gap-2 animate-in fade-in slide-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-[#4edea3]" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Hidden File Input for Avatar Selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        aria-label="Upload da foto de perfil"
        className="hidden"
        onChange={handlePhotoSelect}
      />

      {/* Top Standardized Page Header */}
      <PageHeader
        category="CONTA DO ATLETA"
        title="Perfil"
        subtitle="Dados corporais, biometria e preferências da conta"
        badge={
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1c2025] border border-[#262a30]">
            <ShieldCheck className="w-4 h-4 text-[#4edea3]" />
            <span className="text-xs font-bold text-white">Ativo</span>
          </div>
        }
      />

      {/* 1. Profile Identity & Central Card */}
      <ProfileIdentityCard
        displayName={displayName}
        displayUsername={displayUsername}
        displayRole={displayRole}
        displayEmail={displayEmail}
        displayAvatar={displayAvatar}
        displayAge={displayAge}
        displayWeight={displayWeight}
        displayHeight={displayHeight}
        displayWorkouts={displayWorkouts}
        displayGoal={displayGoal}
        onChangePhotoClick={() => fileInputRef.current?.click()}
        onEditProfileClick={handleOpenEditModal}
        onNavigateToEvolution={onNavigateToEvolution}
      />

      {/* 2. Meu plano Section */}
      <ProfilePlanSection
        displayPlan={displayPlan}
        linkedProfessionalsCount={linkedProfessionals.length}
        onOpenPlans={onOpenPlans}
      />

      {/* 3. Minha equipe / Profissionais vinculados Section */}
      <ProfileTeamSection
        linkedProfessionals={linkedProfessionals}
        onSelectProfessional={onSelectProfessional}
        onNavigateToProfessionals={onNavigateToProfessionals}
      />

      {/* 4. Configurações do Aplicativo & Ações */}
      <ProfileSettingsSection
        unit={unit}
        onUnitChange={setUnit}
        soundEnabled={soundEnabled}
        onSoundChange={setSoundEnabled}
        vibrateEnabled={vibrateEnabled}
        onVibrateChange={setVibrateEnabled}
        onExportCsv={() => showToast('Histórico CSV de treinos e cargas gerado com sucesso!')}
        onLogout={logout}
      />

      {/* ================= EDIT PROFILE MODAL ================= */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        formError={formError}
        editName={editName}
        onEditNameChange={setEditName}
        editUsername={editUsername}
        onEditUsernameChange={setEditUsername}
        editEmail={editEmail}
        onEditEmailChange={setEditEmail}
        editAge={editAge}
        onEditAgeChange={setEditAge}
        editWeight={editWeight}
        onEditWeightChange={setEditWeight}
        editHeight={editHeight}
        onEditHeightChange={setEditHeight}
        editGoal={editGoal}
        onEditGoalChange={setEditGoal}
        onSubmit={handleSaveProfile}
      />
    </div>
  );
};
