import React from 'react';
import { Icon } from './ui/Icon';

export default function Announcements({ announcements, setAnnouncements, showToast }: any) {
  return (
    <div className="bg-white p-10 rounded-[40px] border">
      <h2 className="text-3xl font-black mb-8">إعلانات وأخبار الشركة</h2>
      <div className="space-y-6">
        {[
          { title: 'أجازة عيد الفطر المبارك', date: '2026-04-10', content: 'تبدأ الإجازة من يوم الأربعاء وحتى يوم السبت..' },
          { title: 'موعد الحفل السنوي', date: '2026-05-20', content: 'يسر الإدارة دعوتكم لحضور الحفل السنوي في فندق..' },
        ].map(a => (
          <div key={a.title} className="p-8 bg-slate-50 border border-slate-100 rounded-[35px] relative group overflow-hidden">
             <div className="absolute top-0 right-0 w-2 h-full bg-indigo-500"></div>
             <p className="text-[10px] font-black text-indigo-500 mb-2 uppercase tracking-widest">{a.date}</p>
             <h3 className="text-xl font-black text-slate-800 mb-3">{a.title}</h3>
             <p className="text-slate-600 font-bold leading-relaxed">{a.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
