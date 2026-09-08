import React from 'react';
import { UserInputs, SchemeCalculation, SupportedLanguage } from '../types';
import { translations } from '../utils/translations';
import { speakText, stopSpeaking, isSpeaking } from '../utils/speech';
import {
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Bot,
  User,
  ShieldCheck,
  Building,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AdvisorViewProps {
  inputs: UserInputs;
  calculation: SchemeCalculation;
  language: SupportedLanguage;
}

export const AdvisorView: React.FC<AdvisorViewProps> = ({
  inputs,
  calculation,
  language,
}) => {
  const t = translations[language] || translations.en;

  const sampleQuestions = [
    t.advisorPrompt1,
    t.advisorPrompt2,
    t.advisorPrompt3,
    t.advisorPrompt4,
  ];

  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [inputText, setInputText] = React.useState('');
  const [isSending, setIsSending] = React.useState(false);
  const [speakingMsgId, setSpeakingMsgId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const isMicro = calculation.schemeType === 'MICRO_FINANCE';
    const schemeName = isMicro ? t.microFinanceTitle : t.termLoanTitle;
    const welcomeMsg = `${t.advisorGreeting} (${inputs.businessCategory}, ${inputs.village || inputs.district}). ${t.schemeSelected}: ${schemeName} (90%: ₹${calculation.loanEligibility.toLocaleString()}).`;
    setMessages([
      {
        id: 'welcome-1',
        sender: 'assistant',
        text: welcomeMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [language, inputs.businessCategory, inputs.village, calculation.schemeType, calculation.loanEligibility, t]);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);

    try {
      const res = await fetch('/api/advisory/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language,
          context: {
            village: inputs.village,
            block: inputs.block,
            district: inputs.district,
            state: inputs.state,
            businessCategory: inputs.businessCategory,
            availableMargin: inputs.availableMargin,
            projectCost: calculation.calculatedProjectCost,
            schemeName: calculation.schemeName,
            interestRate: calculation.interestRate,
            moratoriumMonths: calculation.moratoriumMonths,
          },
        }),
      });

      const data = await res.json();
      const replyText = data.reply || t.chatThinking;

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'assistant',
        text: t.chatThinking,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSpeakMessage = (msg: ChatMessage) => {
    if (speakingMsgId === msg.id && isSpeaking()) {
      stopSpeaking();
      setSpeakingMsgId(null);
      return;
    }
    stopSpeaking();
    setSpeakingMsgId(msg.id);
    speakText(msg.text, language, () => {
      setSpeakingMsgId(null);
    });
  };

  return (
    <div className="space-y-6" id="module-ai-advisor">
      {/* Newcomer Clarity Guide Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 flex items-start gap-3.5 text-emerald-950 shadow-xs">
        <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm leading-relaxed">
          <p className="font-semibold text-emerald-900 mb-0.5">
            {t.newcomerTipAdvisor}
          </p>
          <p className="text-emerald-800/90 text-xs mt-1">
            {t.advisorSubtitle}
          </p>
        </div>
      </div>

      {/* Top Header Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              {t.tabAdvisor}
            </span>
            <span className="text-xs text-slate-500 font-medium">{inputs.village || inputs.district}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            {t.tabAdvisor}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {t.advisorSubtitle}
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 text-xs bg-emerald-50 text-emerald-900 px-3.5 py-2 rounded-xl border border-emerald-200 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>{t.scaBadge}</span>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[560px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/60">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-700 text-white rounded-br-xs shadow-xs'
                    : 'bg-white text-slate-900 border border-slate-200 shadow-xs rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div
                  className={`mt-2 flex items-center justify-between text-[11px] ${
                    msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'assistant' && (
                    <button
                      type="button"
                      onClick={() => handleSpeakMessage(msg)}
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-emerald-700 font-semibold ml-2 cursor-pointer"
                    >
                      {speakingMsgId === msg.id ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                          <span className="text-rose-500">{t.stopAudio}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{t.listenReport}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isSending && (
            <div className="flex gap-3 items-center text-xs text-slate-500">
              <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-slate-500 ml-1">{t.chatThinking}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt suggestions */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0 ml-1" />
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              id={`advisor-quick-q-${idx}`}
              onClick={() => handleSendMessage(q)}
              className="shrink-0 px-3 py-1.5 rounded-lg text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2.5"
        >
          <input
            type="text"
            id="tab-chat-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.chatPlaceholder}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
          />
          <button
            type="submit"
            id="tab-chat-submit"
            disabled={!inputText.trim() || isSending}
            className="p-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
