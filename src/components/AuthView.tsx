import React, { useState } from 'react';
import { Lock, Mail, User, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { SommaLogo } from './SommaLogo';

export const AuthView: React.FC = () => {
  const { login, register } = useUser();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simple email validator regex
  const isValidEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleSwitchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setErrorMessage(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Por favor, informe seu e-mail.');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Por favor, insira um e-mail válido.');
      return;
    }

    if (!password) {
      setErrorMessage('Por favor, digite sua senha.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(email, password);
      if (!result.success) {
        setErrorMessage(result.message || 'Erro ao realizar login.');
      }
    } catch {
      setErrorMessage('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Por favor, informe seu nome completo.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Por favor, informe seu e-mail.');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Por favor, insira um formato de e-mail válido.');
      return;
    }

    if (!password) {
      setErrorMessage('Por favor, crie uma senha.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('A confirmação de senha não confere com a senha digitada.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await register({
        name,
        email,
        password,
      });
      if (!result.success) {
        setErrorMessage(result.message || 'Erro ao criar conta.');
      }
    } catch {
      setErrorMessage('Ocorreu um erro ao criar sua conta. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('lucas@somma.com');
    setPassword('password123');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#101419] text-[#e0e2ea] flex flex-col justify-center items-center px-4 py-8 font-sans antialiased">
      {/* Brand Header */}
      <div className="w-full max-w-[400px] flex flex-col items-center text-center mb-6">
        <div className="mb-3 flex items-center justify-center">
          <SommaLogo variant="full" className="h-10 w-auto" />
        </div>
        <p className="text-xs text-[#8c90a1] mt-1.5 max-w-[280px]">
          Plataforma de alta performance e acompanhamento atlético profissional
        </p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-[400px] bg-[#1c2025] rounded-2xl border border-[#262a30] shadow-xl p-6 flex flex-col">
        {/* Toggle Mode Segment */}
        <div className="flex bg-[#14181d] p-1 rounded-xl border border-[#262a30] mb-5">
          <button
            type="button"
            onClick={() => handleSwitchMode('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-[#0066ff] text-white shadow-md'
                : 'text-[#8c90a1] hover:text-white'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => handleSwitchMode('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-[#0066ff] text-white shadow-md'
                : 'text-[#8c90a1] hover:text-white'
            }`}
          >
            Criar conta
          </button>
        </div>

        {/* Error notification banner */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Forms */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3.5">
            {/* E-mail */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#8c90a1] uppercase tracking-wider">
                E-mail
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-[#8c90a1] absolute left-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@somma.com"
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-[#14181d] border border-[#262a30] focus:border-[#0066ff] focus:outline-none text-xs text-white placeholder-[#5a5f70] transition-colors"
                />
              </div>
            </div>

            {/* Senha */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#8c90a1] uppercase tracking-wider">
                Senha
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-[#8c90a1] absolute left-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha secreta"
                  className="w-full h-11 pl-10 pr-10 rounded-xl bg-[#14181d] border border-[#262a30] focus:border-[#0066ff] focus:outline-none text-xs text-white placeholder-[#5a5f70] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-[#8c90a1] hover:text-white p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Botão Entrar */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 mt-2 rounded-xl bg-[#0066ff] hover:bg-[#0052cc] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#0066ff]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Verificando...' : 'Entrar'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Demo quick access badge */}
            <div className="mt-4 pt-4 border-t border-[#262a30] flex flex-col items-center">
              <span className="text-[10px] text-[#8c90a1] mb-2">Acesso rápido para testes de protótipo:</span>
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="text-[11px] font-semibold text-[#0066ff] hover:underline flex items-center gap-1 cursor-pointer bg-[#0066ff]/10 px-3 py-1.5 rounded-lg border border-[#0066ff]/20"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Usar conta de demonstração (Lucas)</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3.5">
            {/* Nome */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#8c90a1] uppercase tracking-wider">
                Nome completo
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-[#8c90a1] absolute left-3.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-[#14181d] border border-[#262a30] focus:border-[#0066ff] focus:outline-none text-xs text-white placeholder-[#5a5f70] transition-colors"
                />
              </div>
            </div>

            {/* E-mail */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#8c90a1] uppercase tracking-wider">
                E-mail
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-[#8c90a1] absolute left-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-[#14181d] border border-[#262a30] focus:border-[#0066ff] focus:outline-none text-xs text-white placeholder-[#5a5f70] transition-colors"
                />
              </div>
            </div>

            {/* Senha */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#8c90a1] uppercase tracking-wider">
                Senha
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-[#8c90a1] absolute left-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 dígitos"
                  className="w-full h-11 pl-10 pr-10 rounded-xl bg-[#14181d] border border-[#262a30] focus:border-[#0066ff] focus:outline-none text-xs text-white placeholder-[#5a5f70] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-[#8c90a1] hover:text-white p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirmar Senha */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#8c90a1] uppercase tracking-wider">
                Confirmação de Senha
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-[#8c90a1] absolute left-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita sua senha"
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-[#14181d] border border-[#262a30] focus:border-[#0066ff] focus:outline-none text-xs text-white placeholder-[#5a5f70] transition-colors"
                />
              </div>
            </div>

            {/* Botão Criar Conta */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 mt-2 rounded-xl bg-[#0066ff] hover:bg-[#0052cc] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#0066ff]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Cadastrando...' : 'Criar conta'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* Footer Info */}
      <div className="text-[11px] text-[#5a5f70] mt-6 text-center">
        <span>SOMMA+ &bull; Sessão segura em dispositivo local</span>
      </div>
    </div>
  );
};
