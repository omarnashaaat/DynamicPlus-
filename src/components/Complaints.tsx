import React from 'react';
import { Icon } from './ui/Icon';

export default function Complaints({ complaints, setComplaints, showToast }: any) {
  return (
    <div className="bg-white p-10 rounded-[40px] border shadow-sm">
      <h2 className="text-3xl font-black mb-8">نظام الشكاوى والاقتراحات</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { from: 'مصطفى علي', subject: 'اقتراح تحسين الكافتيريا', status: 'pending' },
          { from: 'سارة يوسف', subject: 'شكوى من تأخر المصعد', status: 'closed' },
        ].map(c => (
          <div key={c.subject} className="p-6 bg-slate-50 border rounded-3xl">
             <div className="flex justify-between mb-4">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${c.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                   {c.status === 'pending' ? 'قيد المراجعة' : 'مكتملة'}
                </span>
                <span className="text-xs font-bold text-slate-400">من: {c.from}</span>
             </div>
             <h3 className="font-black text-slate-800">{c.subject}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
