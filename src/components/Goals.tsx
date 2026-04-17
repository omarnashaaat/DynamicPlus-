import React from 'react';
import { Icon } from './ui/Icon';

export default function Goals({ goals, setGoals, employees, showToast }: any) {
  return (
    <div className="bg-white p-10 rounded-[40px] border">
      <h2 className="text-3xl font-black mb-4">إدارة الأهداف و OKRs</h2>
      <p className="text-slate-500 font-bold mb-8">نظام تحديد الأهداف الاستراتيجية ومتابعة تقدم الموظفين</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['تحسين الإنتاجية بنسبة 20%', 'تقليل معدل الدوران الوظيفي', 'إتمام تدريب 100 موظف'].map(g => (
          <div key={g} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
             <h3 className="font-black text-slate-800 mb-2">{g}</h3>
             <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full w-[65%]"></div>
             </div>
             <p className="mt-2 text-xs font-bold text-slate-400">التقدم: 65%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
