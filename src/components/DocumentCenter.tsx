import React from 'react';
import { Icon } from './ui/Icon';

export default function DocumentCenter({ employees, showToast }: any) {
  const docs = [
    { title: 'شهادة مفردات مرتب', desc: 'Salary Certificate' },
    { title: 'خطاب HR للبنك', desc: 'HR Letter' },
    { title: 'خطاب زيادة راتب', desc: 'Salary Increase' },
    { title: 'خطاب تعيين رسمي', desc: 'Hiring Offer' },
    { title: 'شهادة خبرة', desc: 'Experience Certificate' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {docs.map(doc => (
          <div key={doc.title} className="bg-white p-8 rounded-[40px] border shadow-sm group hover:border-indigo-600 transition-all cursor-pointer">
             <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Icon name="file-text" size={24} />
             </div>
             <h3 className="font-black text-slate-800 text-lg mb-1">{doc.title}</h3>
             <p className="text-slate-400 font-bold text-xs uppercase mb-6 tracking-widest">{doc.desc}</p>
             <button onClick={() => showToast('جاري إنشاء المستند...')} className="w-full py-3 bg-slate-50 text-slate-600 font-black rounded-xl hover:bg-slate-900 hover:text-white transition-all">تحميل PDF</button>
          </div>
        ))}
      </div>
    </div>
  );
}
