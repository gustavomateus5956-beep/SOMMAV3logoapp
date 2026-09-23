import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { TabType, Routine, Professional } from './types';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomeView } from './components/HomeView';
import { WorkoutView } from './components/WorkoutView';
import { DietView } from './components/DietView';
import { EvolutionView } from './components/EvolutionView';
import { CommunityView } from './components/CommunityView';
import { ProfessionalsView } from './components/ProfessionalsView';
import { ProfileView } from './components/ProfileView';
import { PassView } from './components/PassView';
import { ActiveWorkoutModal } from './components/ActiveWorkoutModal';
import { RoutineDetailModal } from './components/RoutineDetailModal';
import { ProfessionalDetailModal } from './components/ProfessionalDetailModal';
import { ProfessionalChatModal } from './components/ProfessionalChatModal';
import { PlansModal } from './components/PlansModal';
import { NotificationsModal } from './components/NotificationsModal';
import { MOCK_PROFESSIONALS } from './data/mockData';
import { UserProvider, useUser } from './context/UserContext';
import { WorkoutProvider, useWorkout } from './context/WorkoutContext';
import { MinimizedWorkoutWidget } from './components/MinimizedWorkoutWidget';
import { AuthView } from './components/AuthView';

function MainApp() {
  const { user, isLoading, updateUser } = useUser();
  const {
    workoutStatus,
    startWorkout,
    minimizeWorkout,
    maximizeWorkout,
    discardWorkout
  } = useWorkout();
  const [currentTab, setCurrentTab] = useState<TabType>('inicio');
  const [previousTab, setPreviousTab] = useState<TabType>('inicio');
  const mainContentRef = useRef<HTMLElement | null>(null);

  // Centralized scroll-to-top function for page/tab transitions
  const resetScrollToTop = () => {
    const performScroll = () => {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
      if (typeof document !== 'undefined') {
        if (document.documentElement) {
          document.documentElement.scrollTop = 0;
        }
        if (document.body) {
          document.body.scrollTop = 0;
        }
      }
      if (mainContentRef.current) {
        mainContentRef.current.scrollTop = 0;
      }
    };

    performScroll();
    // Guarantee top position after React layout/paint cycle
    requestAnimationFrame(performScroll);
  };

  // Automatically reset scroll whenever the main tab changes
  useLayoutEffect(() => {
    resetScrollToTop();
  }, [currentTab]);

  const handleNavigate = (tab: TabType) => {
    if (tab !== currentTab) {
      setPreviousTab(currentTab);
      setCurrentTab(tab);
    } else {
      // Tapping the currently active tab returns to top
      resetScrollToTop();
    }
  };

  const handleBack = () => {
    const targetTab = previousTab || 'inicio';
    if (targetTab !== currentTab) {
      setCurrentTab(targetTab);
    } else {
      resetScrollToTop();
    }
  };

  // Modals state
  const [activeWorkoutRoutine, setActiveWorkoutRoutine] = useState<Routine | null | 'empty'>(null);
  const [selectedRoutineDetail, setSelectedRoutineDetail] = useState<Routine | null>(null);
  const [professionals, setProfessionals] = useState<Professional[]>(MOCK_PROFESSIONALS);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [activeChatProfessional, setActiveChatProfessional] = useState<Professional | null>(null);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Synchronize professionals linked status with user.linkedProfessionalIds
  useEffect(() => {
    if (user && user.linkedProfessionalIds !== undefined) {
      setProfessionals((prev) =>
        prev.map((p) => ({
          ...p,
          isLinkedToUserPlan: user.linkedProfessionalIds?.includes(p.id) || false
        }))
      );
    }
  }, [user?.linkedProfessionalIds]);

  const triggerToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3500);
  };

  const handleStartRoutine = (routine: Routine | null) => {
    startWorkout(routine);
    setActiveWorkoutRoutine(routine || 'empty');
  };

  const handleFinishWorkout = (summary: {
    name: string;
    durationMinutes: number;
    totalVolume: number;
    setsCompleted: number;
  }) => {
    triggerToast(
      `Treino finalizado! ${summary.setsCompleted} séries concluídas com ${summary.totalVolume.toLocaleString()} kg de volume total.`
    );
  };

  // Rule: exactly 1 professional per technical category (personal, nutri, fisio)
  const handleAssignToSlot = (prof: Professional) => {
    const updated = professionals.map((p) => {
      if (p.id === prof.id) {
        return {
          ...p,
          isLinkedToUserPlan: true,
          prescriptionSummary:
            p.category === 'fisio'
              ? 'Protocolo de Mobilidade e Recovery Articular Ativo'
              : p.prescriptionSummary || 'Acompanhamento integrado na SOMMA+'
        };
      }
      if (p.category === prof.category) {
        return {
          ...p,
          isLinkedToUserPlan: false
        };
      }
      return p;
    });

    setProfessionals(updated);
    const activeIds = updated.filter((p) => p.isLinkedToUserPlan).map((p) => p.id);
    updateUser({ linkedProfessionalIds: activeIds });

    setSelectedProfessional((prev) =>
      prev && prev.id === prof.id ? { ...prev, isLinkedToUserPlan: true } : prev
    );

    triggerToast(
      `${prof.name} agora é seu especialista ativo de ${prof.categoryLabel} no Plano SOMMA Pro!`
    );
  };

  // Show loading indicator during session restoration
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#101419] flex flex-col items-center justify-center gap-3 text-white">
        <div className="w-10 h-10 border-2 border-[#0066ff] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-[#8c90a1] font-semibold tracking-wide">Carregando SOMMA+...</span>
      </div>
    );
  }

  // If user is not authenticated, render AuthView
  if (!user) {
    return <AuthView />;
  }

  return (
    <div className="min-h-screen bg-[#101419] text-[#e0e2ea] flex font-sans antialiased">
      {/* Desktop Sidebar & Mobile Bottom Navigation */}
      <Navigation currentTab={currentTab} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          onNavigate={handleNavigate}
          onOpenNotifications={() => setShowNotificationsModal(true)}
          onBack={handleBack}
        />

        {/* View Body */}
        <main
          ref={mainContentRef}
          className={`flex-1 max-w-[480px] md:max-w-3xl w-full mx-auto px-4 pt-16 md:pt-20 ${
            workoutStatus === 'minimized' ? 'pb-36 md:pb-24' : 'pb-24 md:pb-8'
          }`}
        >
          {currentTab === 'inicio' && (
            <HomeView
              onNavigate={handleNavigate}
              onStartRoutine={(routine) => handleStartRoutine(routine)}
            />
          )}

          {currentTab === 'treino' && (
            <WorkoutView
              onStartRoutine={(routine) => handleStartRoutine(routine)}
              onViewRoutineDetail={(routine) => setSelectedRoutineDetail(routine)}
              onNavigate={handleNavigate}
            />
          )}

          {currentTab === 'dieta' && <DietView />}

          {currentTab === 'pass' && <PassView />}

          {currentTab === 'evolucao' && <EvolutionView onBack={handleBack} />}

          {currentTab === 'comunidade' && <CommunityView onBack={handleBack} />}

          {currentTab === 'profissionais' && (
            <ProfessionalsView
              professionals={professionals}
              onSelectProfessional={(prof) => setSelectedProfessional(prof)}
              onOpenChat={(prof) => setActiveChatProfessional(prof)}
              onNavigateTab={(tab) => handleNavigate(tab)}
              onOpenPlans={() => setShowPlansModal(true)}
              onAssignToSlot={handleAssignToSlot}
              onBack={handleBack}
            />
          )}

          {currentTab === 'perfil' && (
            <ProfileView
              onOpenPlans={() => setShowPlansModal(true)}
              onNavigateToProfessionals={() => handleNavigate('profissionais')}
              onNavigateToEvolution={() => handleNavigate('evolucao')}
              onSelectProfessional={(prof) => {
                setSelectedProfessional(prof);
                handleNavigate('profissionais');
              }}
            />
          )}
        </main>
      </div>

      {/* Floating Minimized Workout Widget (always active across all tabs) */}
      <MinimizedWorkoutWidget onWorkoutFinished={handleFinishWorkout} />

      {/* Interactive Active Workout Tracker */}
      {workoutStatus !== 'idle' && (
        <div className={workoutStatus === 'minimized' ? 'hidden' : 'block'}>
          <ActiveWorkoutModal
            routine={activeWorkoutRoutine === 'empty' ? null : activeWorkoutRoutine}
            onClose={() => {
              setActiveWorkoutRoutine(null);
              discardWorkout();
            }}
            onMinimize={() => {
              minimizeWorkout();
            }}
            onFinishWorkout={(summary) => {
              setActiveWorkoutRoutine(null);
              handleFinishWorkout(summary);
            }}
          />
        </div>
      )}

      {/* Routine Detail Modal */}
      {selectedRoutineDetail && (
        <RoutineDetailModal
          routine={selectedRoutineDetail}
          onClose={() => setSelectedRoutineDetail(null)}
          onStartRoutine={(r) => handleStartRoutine(r)}
        />
      )}

      {/* Professional Detail Modal */}
      {selectedProfessional && (
        <ProfessionalDetailModal
          professional={professionals.find((p) => p.id === selectedProfessional.id) || selectedProfessional}
          onClose={() => setSelectedProfessional(null)}
          onOpenChat={(prof) => {
            setSelectedProfessional(null);
            setActiveChatProfessional(prof);
          }}
          onNavigateToTab={(tab) => {
            setSelectedProfessional(null);
            setCurrentTab(tab);
          }}
          onAssignToSlot={handleAssignToSlot}
          currentPersonalName={professionals.find((p) => p.category === 'personal' && p.isLinkedToUserPlan)?.name}
          currentNutriName={professionals.find((p) => p.category === 'nutri' && p.isLinkedToUserPlan)?.name}
          currentFisioName={professionals.find((p) => p.category === 'fisio' && p.isLinkedToUserPlan)?.name}
        />
      )}

      {/* Interactive Direct Chat with Coach & Specialists */}
      {activeChatProfessional && (
        <ProfessionalChatModal
          professional={activeChatProfessional}
          onClose={() => setActiveChatProfessional(null)}
          onNavigateToPrescription={() => {
            setActiveChatProfessional(null);
            if (activeChatProfessional.category === 'personal') {
              setCurrentTab('treino');
            } else if (activeChatProfessional.category === 'nutri') {
              setCurrentTab('dieta');
            }
          }}
        />
      )}

      {/* Plans & Subscriptions Modal */}
      {showPlansModal && (
        <PlansModal onClose={() => setShowPlansModal(false)} />
      )}

      {/* Notifications Drawer */}
      {showNotificationsModal && (
        <NotificationsModal onClose={() => setShowNotificationsModal(false)} />
      )}

      {/* Toast Feedback Notification */}
      {feedbackToast && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0066ff] text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span>{feedbackToast}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <WorkoutProvider>
        <MainApp />
      </WorkoutProvider>
    </UserProvider>
  );
}

