import React, { useState } from 'react';
import { Icon } from './ui/Icon';
import { motion } from 'motion/react';

interface LoginProps {
  onLogin: (username: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 3) {
      setError('يرجى إدخال اسم صحيح (3 أحرف على الأقل)');
      return;
    }
    onLogin(username);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-['Cairo']">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-[50px] shadow-3xl p-12 border border-slate-100 space-y-10 text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>

          <div className="space-y-4 relative">
            <div className="w-24 h-24 bg-slate-900 text-white rounded-[35px] flex items-center justify-center mx-auto shadow-2xl rotate-3">
              <Icon name="shield-check" size={48} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter">بوابة الوصول الآمن</h1>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic mt-2">HR World Management System</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative">
            <div className="space-y-2 text-right">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic pr-4">اسم المستخدم للدخول</label>
              <div className="relative group">
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  placeholder="أدخل اسمك هنا..."
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-[25px] p-6 pr-14 font-black text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                  <Icon name="user" size={20} />
                </div>
              </div>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-rose-500 text-xs font-bold mr-4 mt-2"
                >
                  {error}
                </motion.p>
              )}
            </div>

            <button 
              type="submit"
              className="w-full bg-slate-900 text-white p-6 rounded-[30px] font-black shadow-2xl hover:bg-indigo-600 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group"
            >
              دخول النظام
              <Icon name="arrow-left" size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="pt-4 relative">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">جميع الحقوق محفوظة © 2026</p>
            <div className="flex justify-center gap-2 mt-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest">System Secure & Encrypted</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
