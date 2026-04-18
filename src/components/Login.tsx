import React, { useState } from 'react';
import { Icon } from './ui/Icon';
import { motion } from 'motion/react';

interface LoginProps {
  onLogin: (username: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 2) {
      setError('يرجى إدخال اسم المستخدم أولاً');
      return;
    }
    if (password !== '20196269') {
      setError('كلمة السر مش صح، جرب تاني');
      return;
    }
    onLogin(username);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-['Cairo'] relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 opacity-20">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#4f46e5_0%,transparent_50%)]"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full animate-pulse"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full animate-pulse delay-700"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl relative z-10"
      >
        <div className="bg-white rounded-[60px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] p-16 space-y-12 text-center border border-white/20">
          
          <div className="space-y-6">
            <div className="w-28 h-28 bg-slate-900 text-white rounded-[40px] flex items-center justify-center mx-auto shadow-4xl rotate-6 hover:rotate-0 transition-transform duration-500">
              <Icon name="shield-check" size={56} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">عالم الـ HR</h1>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em] italic mt-3">Advanced Intelligence Gateway</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2 text-right">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic pr-6">اسم المستخدم</label>
                <div className="relative group">
                  <input 
                    type="text"
                    required
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(''); }}
                    placeholder="اكتب اسمك هنا..."
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[30px] p-7 pr-16 font-black text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner text-lg"
                  />
                  <div className="absolute right-7 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                    <Icon name="user" size={24} />
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-right">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic pr-6">كلمة السر الإجبارية</label>
                <div className="relative group">
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    className={`w-full bg-slate-50 border-2 border-slate-100 rounded-[30px] p-7 pr-16 pl-16 font-black text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner text-lg ${!showPassword ? 'tracking-[0.5em]' : ''}`}
                  />
                  <div className="absolute right-7 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                    <Icon name="key-round" size={24} />
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-500 transition-colors outline-none"
                  >
                    <Icon name={showPassword ? "eye-off" : "eye"} size={22} />
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center justify-center gap-3"
              >
                <Icon name="circle-alert" size={18} className="text-rose-500" />
                <p className="text-rose-600 text-xs font-black italic">{error}</p>
              </motion.div>
            )}

            <button 
              type="submit"
              className="w-full bg-slate-900 text-white p-7 rounded-[35px] font-black text-xl shadow-4xl hover:bg-indigo-600 hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-5 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span>فتح المنصة</span>
              <Icon name="arrow-left" size={24} className="group-hover:-translate-x-2 transition-transform" />
            </button>
          </form>

          <div className="pt-4 opacity-50">
             <div className="flex justify-center gap-6">
                <div className="flex items-center gap-2">
                   <Icon name="lock" size={12} className="text-emerald-500" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Secure AES-256</span>
                </div>
                <div className="flex items-center gap-2">
                   <Icon name="shield" size={12} className="text-indigo-500" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Cyber Protection</span>
                </div>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
