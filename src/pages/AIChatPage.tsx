import React, { useState, useEffect, useRef } from 'react';
import { sendAIPrompt, PRESET_PROMPTS, PromptOption } from '../lib/aiService';
import { subscribeChatMessages, saveChatMessage, clearChatHistory } from '../lib/firestoreService';
import { AIChatMessage } from '../types';

interface AIChatPageProps {
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const AIChatPage: React.FC<AIChatPageProps> = ({ showToast }) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeChatMessages((list) => {
      setMessages(list);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (customPrompt?: string, category?: PromptOption['category']) => {
    const textToSend = customPrompt || inputPrompt;
    if (!textToSend.trim() || loading) return;

    const userMessage: Omit<AIChatMessage, 'id'> = {
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
      category: category || 'general'
    };

    setInputPrompt('');
    setLoading(true);

    try {
      // Save user prompt to Firestore
      await saveChatMessage(userMessage);

      // Call Gemini API via server route
      const aiResponseText = await sendAIPrompt(textToSend, category);

      // Save AI response to Firestore
      const aiMessage: Omit<AIChatMessage, 'id'> = {
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date().toISOString(),
        category: category || 'general'
      };

      await saveChatMessage(aiMessage);
    } catch (err: any) {
      showToast(err.message || 'Failed to generate AI response', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied content to clipboard!', 'success');
  };

  const handleClearHistory = async () => {
    if (confirm('Are you sure you want to clear AI chat history?')) {
      await clearChatHistory();
      showToast('Chat history cleared', 'info');
    }
  };

  return (
    <div className="pt-20 pb-32 px-4 max-w-xl mx-auto min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="font-bold text-2xl text-slate-900 tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600 text-2xl">smart_toy</span>
            BrightStart AI Assistant
          </h2>
          <p className="text-xs text-slate-500">
            Powered by Gemini AI • Lesson Plans, Quizzes, Parent Notices & Teaching Copilot
          </p>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            title="Clear Chat History"
          >
            <span className="material-symbols-outlined text-sm">delete_sweep</span>
          </button>
        )}
      </div>

      {/* Preset Teacher Tool Chips */}
      <div className="mb-4 flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {PRESET_PROMPTS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handleSend(preset.samplePrompt, preset.category)}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-indigo-700 text-xs font-semibold whitespace-nowrap hover:bg-indigo-50 active:scale-95 transition-all shadow-xs flex items-center gap-1.5 flex-shrink-0"
          >
            <span className="material-symbols-outlined text-base text-indigo-600">
              {preset.icon}
            </span>
            {preset.title}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 space-y-3.5 mb-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center my-4 shadow-sm">
            <div className="w-14 h-14 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-3 text-indigo-600">
              <span className="material-symbols-outlined text-2xl">smart_toy</span>
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-1">
              Hello, Teacher! How can I help today?
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Select one of the tools above or type any prompt below to generate lesson plans, quizzes, parent notices, or homework assignments.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-left text-xs">
              {PRESET_PROMPTS.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSend(p.samplePrompt, p.category)}
                  className="p-3 bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-lg cursor-pointer transition-colors"
                >
                  <p className="font-bold text-indigo-600 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">{p.icon}</span>
                    {p.title}
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-1">{p.samplePrompt}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[90%] rounded-xl p-3.5 text-xs shadow-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-100">
                    <span className="font-bold text-indigo-600 text-[11px] flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">auto_awesome</span>
                      BrightStart AI
                    </span>
                    <button
                      onClick={() => handleCopy(msg.content)}
                      className="text-[10px] text-slate-400 hover:text-indigo-600 flex items-center gap-0.5"
                      title="Copy response"
                    >
                      <span className="material-symbols-outlined text-xs">content_copy</span>
                      Copy
                    </button>
                  </div>
                )}

                <div className="whitespace-pre-wrap">{msg.content}</div>

                <div className="mt-1.5 text-[10px] opacity-60 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex items-start gap-2 text-xs text-indigo-700 p-3 rounded-xl bg-indigo-50 border border-indigo-100 max-w-[80%] animate-pulse font-medium">
            <span className="material-symbols-outlined animate-spin text-base">auto_awesome</span>
            <span>Generating response with Gemini AI...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="sticky bottom-20 bg-white p-2 rounded-xl border border-slate-200 shadow-md flex items-center gap-2"
      >
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Ask AI Assistant (e.g. Generate Grade 3 math quiz)..."
          className="flex-1 h-10 px-3 bg-transparent border-none text-xs text-slate-900 outline-none"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || loading}
          className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-all disabled:opacity-40 flex-shrink-0 cursor-pointer active:scale-95"
        >
          <span className="material-symbols-outlined text-base">send</span>
        </button>
      </form>
    </div>
  );
};
