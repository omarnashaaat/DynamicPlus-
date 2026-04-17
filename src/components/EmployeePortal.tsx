import React from 'react';
import { Icon } from './ui/Icon';

export default function EmployeePortal({ currentUser, loans, setLoans, resignations, setResignations, showToast }: any) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-slate-900 text-white p-12 rounded-[50px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/20 blur-[100px] -ml-32 -mt-32"></div>
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
           <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center text-4xl">🧑💻</div>
           <div className="text-center md:text-right">
              <h2 className="text-3xl font-black mb-2">أهلاً بك، {currentUser?.name || 'زميلنا العزيز'}</h2>
              <p className="text-indigo-300 font-bold uppercase tracking-widest text-xs">بوابة الخدمة الذاتية للموظف (ESS)</p>
           </div>
           <div className="md:mr-auto flex gap-4">
              <div className="bg-white/10 p-4 rounded-3xl text-center border border-white/10">
                 <p className="text-[10px] text-indigo-300 font-black mb-1 uppercase">نقاطك</p>
                 <p className="text-2xl font-black text-yellow-400">{currentUser?.points || 0}</p>
              </div>
              <div className="bg-white/10 p-4 rounded-3xl text-center border border-white/10">
                 <p className="text-[10px] text-indigo-300 font-black mb-1 uppercase">رصيد إجازات</p>
                 <p className="text-2xl font-black">21</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'سجل الحضور', icon: 'clock', color: 'bg-blue-500' },
          { label: 'كشف الراتب', icon: 'banknote', color: 'bg-emerald-500' },
          { label: 'طلب إجازة', icon: 'plane-takeoff', color: 'bg-orange-500' },
          { label: 'طلب سلفة', icon: 'hand-coins', color: 'bg-amber-500' },
          { label: 'الملف الطبي', icon: 'heart', color: 'bg-rose-500' },
          { label: 'الوثائق', icon: 'file-text', color: 'bg-indigo-500' },
          { label: 'شهادة HR', icon: 'scroll', color: 'bg-violet-500' },
          { label: 'الاستبيانات', icon: 'message-square', color: 'bg-sky-500' },
        ].map(item => (
          <button key={item.label} className="bg-white p-8 rounded-[40px] border shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all flex flex-col items-center gap-4 group">
             <div className={`w-16 h-16 ${item.color} rounded-3xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-all`}>
                <Icon name={item.icon} size={28} />
             </div>
             <span className="font-black text-slate-700">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
