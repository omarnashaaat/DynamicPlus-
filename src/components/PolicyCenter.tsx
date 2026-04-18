import React, { useState } from 'react';
import { Icon } from './ui/Icon';
import { motion, AnimatePresence } from 'motion/react';

export default function PolicyCenter({ categories }: { categories: any[] }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const policies = [
    { id: '1', title: 'سياسة الحضور والانصراف', category: 'administrative', content: 'يجب على جميع الموظفين تسجيل الحضور قبل الساعة 9:00 صباحاً. يسمح بفترة سماح 15 دقيقة...', icon: 'clock', lastUpdated: '2024-01-15' },
    { id: '2', title: 'دليل السلوك المهني', category: 'legal', content: 'تلتزم الشركة بتوفير بيئة عمل آمنة ومحترمة للجميع. يمنع منعاً باتاً أي شكل من أشكال التمييز...', icon: 'shield-check', lastUpdated: '2024-02-10' },
    { id: '3', title: 'سياسة العمل عن بعد', category: 'administrative', content: 'يسمح للموظفين في الأقسام التقنية بالعمل عن بعد لمدة يومين في الأسبوع بعد التنسيق مع المدير المباشر...', icon: 'home', lastUpdated: '2024-03-01' },
    { id: '4', title: 'دليل استخدام الأصول والعهدة', category: 'assets', content: 'الموظف مسئول مسئولية كاملة عن صيانة ونظافة الأجهزة المسلمة إليه كعهدة...', icon: 'package', lastUpdated: '2023-11-20' },
    { id: '5', title: 'سياسة المكافآت والحوافز', category: 'financial', content: 'تصرف المكافآت التشجيعية بناءً على تقييم الأداء الربعي ومؤشرات الكفاءة الأساسية...', icon: 'gift', lastUpdated: '2024-04-05' },
  ];

  const filtered = policies.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-10 animate-fade-in px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-white p-10 rounded-[50px] border border-slate-50 shadow-2xl">
         <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-indigo-600 text-white rounded-[35px] flex items-center justify-center shadow-3xl rotate-3">
               <Icon name="scroll-text" size={40} />
            </div>
            <div>
               <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase">مركز السياسات <span className="text-slate-300 ml-2">Policy Center</span></h2>
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Advanced Corporate Regulations & Guidelines</p>
            </div>
         </div>
         
         <div className="relative w-full md:w-96 group">
            <Icon name="search" size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              placeholder="ابحث في دليل السياسات..." 
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-[30px] py-5 pr-16 pl-8 text-sm font-black text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
         </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
         {categories.map(cat => (
           <button
             key={cat.id}
             onClick={() => setActiveCategory(cat.id)}
             className={`flex items-center gap-3 px-8 py-4 rounded-[25px] font-black text-sm whitespace-nowrap transition-all duration-300 ${activeCategory === cat.id ? 'bg-slate-900 text-white shadow-2xl scale-105' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}
           >
              <Icon name={cat.icon} size={18} />
              {cat.title}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <AnimatePresence mode="popLayout">
            {filtered.map(policy => (
              <motion.div
                layout
                key={policy.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="premium-card p-10 group"
              >
                 <div className="flex justify-between items-start mb-8">
                    <div className="p-5 bg-slate-50 rounded-[28px] text-slate-900 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
                       <Icon name={policy.icon} size={32} />
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100 italic">Updated: {policy.lastUpdated}</span>
                 </div>
                 
                 <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tight group-hover:text-indigo-600 transition-colors underline decoration-slate-100 decoration-4 underline-offset-8 group-hover:decoration-indigo-100">{policy.title}</h3>
                 <p className="text-slate-500 leading-relaxed font-bold text-sm mb-10 line-clamp-3 italic">
                    {policy.content}
                 </p>
                 
                 <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                          <Icon name="check" size={12} className="text-emerald-500" />
                       </div>
                       <span className="text-[10px] font-black text-slate-400 uppercase">سارية المفعول</span>
                    </div>
                    <button className="flex items-center gap-3 text-indigo-600 font-black text-xs hover:gap-5 transition-all">
                       قراءة المزيد
                       <Icon name="arrow-left" size={16} />
                    </button>
                 </div>
              </motion.div>
            ))}
         </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-40 premium-card space-y-8 italic">
           <div className="w-32 h-32 bg-slate-50 rounded-full mx-auto flex items-center justify-center border-4 border-dashed border-slate-200">
              <Icon name="file-search" size={48} className="text-slate-200" />
           </div>
           <div>
              <p className="text-2xl font-black text-slate-400">عذراً، لم نجد سياسات تطابق بحثك</p>
              <p className="text-slate-300 font-bold mt-2">جرب استخدام كلمات بحث مختلفة أو فئة أخرى</p>
           </div>
        </div>
      )}
    </div>
  );
}
