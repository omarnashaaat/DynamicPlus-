import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './ui/Icon';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

interface SmartChatProps {
  employees: any[];
}

export default function SmartChat({ employees }: SmartChatProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `
        You are an HR Analytics Assistant for a company.
        Here is the employee data (JSON): ${JSON.stringify(employees.map(e => ({ name: e.name, dept: e.department, salary: e.salary, code: e.code, job: e.jobTitle, date: e.hireDate })))}.
        
        The user asks: "${input}"
        
        Answer based on this data. Be professional, concise, and provide insights. 
        Format your response in Arabic using Markdown.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const aiMsg = { role: 'assistant', content: response.text || 'عذراً، لم أستطع تحليل البيانات حالياً.' };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'حدث خطأ أثناء الاتصال بالذكاء الاصطناعي. تأكد من إعداد المفتاح الخاص بالخدمة.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-hidden font-['Cairo']">
      <div className="p-8 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/30">
              <Icon name="brain-circuit" size={24} className="text-white" />
           </div>
           <div>
              <h3 className="text-xl font-black text-white italic tracking-tight uppercase">مساعد إدارة الموارد <span className="text-indigo-400">AI</span></h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Powered by Gemini Intelligent Engine</p>
           </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar scroll-smooth">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-40">
             <Icon name="sparkles" size={80} className="text-slate-600 animate-pulse" />
             <div className="space-y-4">
               <p className="text-xl font-black text-slate-500 italic uppercase">كيف يمكنني مساعدتك في تحليل بيانات الموظفين اليوم؟</p>
               <div className="flex flex-wrap justify-center gap-4">
                  {['كم إجمالي الرواتب؟', 'حلل أداء الأقسام', 'أكثر الموظفين إنتاجية'].map(q => (
                    <button key={q} onClick={() => setInput(q)} className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-slate-300 hover:bg-white/10 transition-all">{q}</button>
                  ))}
               </div>
             </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-6 rounded-[35px] text-sm leading-relaxed shadow-2xl ${
                m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-white/5 border border-white/10 text-slate-100 rounded-bl-none'
              }`}>
                <div className="font-bold whitespace-pre-wrap">{m.content}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
             <div className="bg-white/5 border border-white/10 text-indigo-400 p-6 rounded-[35px] rounded-bl-none flex gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
             </div>
           </motion.div>
        )}
      </div>

      <div className="p-10 border-t border-white/10 bg-slate-900/50 backdrop-blur-xl">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="اسألني عن أي شيء يخص الموظفين..." 
            className="w-full bg-white/5 border border-white/10 rounded-[30px] p-6 pr-10 pl-24 text-white font-bold outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex gap-2">
             <button 
               onClick={handleSend}
               className="w-14 h-14 bg-indigo-600 text-white rounded-[22px] flex items-center justify-center shadow-xl hover:bg-indigo-500 active:scale-90 transition-all"
             >
                <Icon name="send" size={24} />
             </button>
          </div>
        </div>
        <p className="text-center mt-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">قد يرتكب الذكاء الاصطناعي بعض الأخطاء في التحليل، يرجى مراجعة التقارير المالية بدقة.</p>
      </div>
    </div>
  );
}
