import React, { useState, useEffect, useRef } from 'react';
import { X, Send, ShieldCheck, CheckCheck, Paperclip, Dumbbell, Sparkles } from 'lucide-react';
import { Professional } from '../types';
import { useScrollLock } from '../hooks/useScrollLock';

interface ChatMessage {
  id: string;
  sender: 'user' | 'professional';
  text: string;
  time: string;
  attachment?: {
    type: 'workout' | 'video' | 'metric';
    label: string;
  };
}

interface ProfessionalChatModalProps {
  professional: Professional;
  onClose: () => void;
  onNavigateToPrescription?: () => void;
}

export const ProfessionalChatModal: React.FC<ProfessionalChatModalProps> = ({
  professional,
  onClose,
  onNavigateToPrescription
}) => {
  useScrollLock(true);
  const initialMessages: Record<string, ChatMessage[]> = {
    'dr-rodrigo': [
      {
        id: 'm1',
        sender: 'professional',
        text: 'Fala Lucas! Analisei o vídeo do seu Supino Inclinado com halteres de 34kg. O alinhamento dos cotovelos a 75° ficou perfeito, protegeu muito o ombro.',
        time: 'Ontem às 18:20',
        attachment: {
          type: 'workout',
          label: 'Treino A • Supino Inclinado (34kg PR)'
        }
      },
      {
        id: 'm2',
        sender: 'user',
        text: 'Valeu Rodrigo! Senti que a pausa de 1s embaixo me deu muito mais controle da carga.',
        time: 'Ontem às 18:35'
      },
      {
        id: 'm3',
        sender: 'professional',
        text: 'Exato! Vamos manter essa carga por mais 1 semana consolidando 10 repetições com RPE 8.5. Na próxima sessão avaliamos a subida para 36kg.',
        time: 'Hoje às 09:15'
      }
    ],
    'dra-camila': [
      {
        id: 'm1',
        sender: 'professional',
        text: 'Oi Lucas! Como você se sentiu com o ajuste de 50g de aveia e a pasta de amendoim na refeição pré-treino?',
        time: 'Ontem às 14:10'
      },
      {
        id: 'm2',
        sender: 'user',
        text: 'A energia no treino de pernas foi excelente Camila! Zero queimação e disposição do início ao fim.',
        time: 'Ontem às 16:45'
      },
      {
        id: 'm3',
        sender: 'professional',
        text: 'Ótima notícia! Seus 185g de proteína diária estão bem distribuídos. Na segunda-feira faremos o check-in de peso e dobras cutâneas.',
        time: 'Hoje às 08:30'
      }
    ],
    'dr-lucas-fisio': [
      {
        id: 'm1',
        sender: 'professional',
        text: 'Olá Lucas! Fisioterapia ativada no seu plano SOMMA. Vi que sua carga no supino subiu para 100kg. Vamos rodar um protocolo focado em mobilidade escapular e manguito rotador.',
        time: 'Hoje às 10:00'
      }
    ]
  };

  const [messages, setMessages] = useState<ChatMessage[]>(
    initialMessages[professional.id] || [
      {
        id: 'default-1',
        sender: 'professional',
        text: `Olá Lucas! Sou o(a) ${professional.name}. Acompanhamento técnico ativo no seu plano SOMMA. Como posso te apoiar hoje?`,
        time: 'Hoje'
      }
    ]
  );
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: 'Agora'
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Simulate specialist professional feedback
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let reply = 'Recebido Lucas! Vou analisar sua evolução técnica e já te dou o feedback no app.';
      if (professional.category === 'personal') {
        reply = 'Anotado Lucas! Verifiquei sua execução. Mantenha o foco na cadência e nos intervalos de 2 minutos nas séries de sobrecarga.';
      } else if (professional.category === 'nutri') {
        reply = 'Perfeito Lucas! Mantenha a hidratação em 3.5L diários e bata os 185g de proteína hoje. Próximo check-in registrado!';
      } else if (professional.category === 'fisio') {
        reply = 'Excelente Lucas! Aplique o aquecimento de rotação externa com elástico antes do supino. Teus ombros vão agradecer!';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `pro-${Date.now()}`,
          sender: 'professional',
          text: reply,
          time: 'Agora'
        }
      ]);
    }, 1200);
  };

  const quickPrompts = professional.category === 'personal'
    ? ['Enviei novo vídeo de supino', 'Posso subir 2kg na próxima série?', 'Dúvida sobre tempo de descanso']
    : professional.category === 'nutri'
    ? ['Bati os 185g de proteína hoje', 'Posso trocar o lanche da tarde?', 'Dúvida sobre creatina']
    : ['Aquecimento de ombro feito', 'Senti leve estalo no ombro direito', 'Agendar avaliação'];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4 overscroll-contain">
      <div className="w-full max-w-[500px] h-[94vh] md:h-[85vh] bg-[#101419] border border-[#262a30] rounded-t-3xl md:rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200 overscroll-contain">
        
        {/* Chat Header */}
        <div className="px-4 py-3 bg-[#181c21] border-b border-[#262a30] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                src={professional.avatar}
                alt={professional.name}
                className="w-10 h-10 rounded-full object-cover ring-1 ring-[#0066ff] bg-[#262a30]"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3] ring-2 ring-[#181c21] absolute bottom-0 right-0"></span>
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white truncate">{professional.name}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#0066ff] shrink-0" />
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#8c90a1]">
                <span className="text-[#0066ff] font-semibold">{professional.registration}</span>
                <span>•</span>
                <span className="text-[#4edea3] font-medium">Online na SOMMA+</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar chat"
            className="w-8 h-8 rounded-full bg-[#262a30] hover:bg-[#31353b] flex items-center justify-center text-[#c2c6d8] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Integration Banner */}
        <div className="bg-[#14181f] px-4 py-2 border-b border-[#262a30]/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
            <span className="text-[#8c90a1] truncate">
              {professional.prescriptionSummary || 'Acompanhamento integrado no seu plano'}
            </span>
          </div>
          {onNavigateToPrescription && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigateToPrescription();
              }}
              className="text-[#0066ff] hover:underline font-bold text-[11px] shrink-0 ml-2 cursor-pointer"
            >
              Ver no App →
            </button>
          )}
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar bg-gradient-to-b from-[#101419] to-[#0c0f13]">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#0066ff] text-white rounded-tr-xs shadow-sm'
                      : 'bg-[#1c2025] text-[#e0e2ea] border border-[#262a30] rounded-tl-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {msg.attachment && (
                    <div className="mt-2 p-2 rounded-xl bg-black/20 border border-white/10 flex items-center gap-2 text-[11px] text-white/90">
                      <Dumbbell className="w-3.5 h-3.5 text-[#4edea3] shrink-0" />
                      <span className="font-semibold">{msg.attachment.label}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 mt-1 px-1">
                  <span className="text-[10px] text-[#636779]">{msg.time}</span>
                  {isUser && <CheckCheck className="w-3 h-3 text-[#0066ff]" />}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-[11px] text-[#8c90a1] italic px-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0066ff] animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#0066ff] animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#0066ff] animate-bounce [animation-delay:0.4s]"></span>
              <span>{professional.name} está digitando...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-[#14181f] border-t border-[#262a30]/50 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <Sparkles className="w-3 h-3 text-[#0066ff] shrink-0" />
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-[#1c2025] hover:bg-[#262a30] text-[#c2c6d8] hover:text-white border border-[#262a30] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 bg-[#181c21] border-t border-[#262a30] flex items-center gap-2">
          <input
            type="text"
            placeholder={`Mensagem para ${professional.name.split(' ')[0]}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            className="flex-1 h-10 px-3.5 rounded-xl bg-[#101419] border border-[#262a30] text-white text-xs placeholder:text-[#8c90a1] focus:border-[#0066ff] outline-none"
          />

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
