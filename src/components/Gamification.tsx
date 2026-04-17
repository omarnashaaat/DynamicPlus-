import React, { useState } from 'react';
import { Icon } from './ui/Icon';
import { motion } from 'motion/react';

interface GamificationProps {
  employees: any[];
}

export default function Gamification({ employees }: GamificationProps) {
  const [leaderboard, setLeaderboard] = useState(
    employees.map(e => ({
      ...e,
      points: Math.floor(Math.random() * 5000),
      level: Math.floor(Math.random() * 10) + 1,
      medals: {
        gold: Math.floor(Math.random() * 5),
        silver: Math.floor(Math.random() * 10),
        bronze: Math.floor(Math.random() * 15)
      }
    })).sort((a, b) => b.points - a.points)
  );

  return (
    <div className="space-y-12 animate-fade-in relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print px-4">
        <div className="flex items-center gap-5">
           <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-[35px] flex items-center justify-center shadow-lg transform -rotate-6 hover:rotate-0 transition-transform duration-500">
              <Icon name="trophy" size={40} />
           </div>
           <div>
              <h2 className="text-4xl font-black text-slate-800 tracking-tighter">منظومة التميز والتحفيز</h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] italic">Gamification Engine & Honor Board</p>
           </div>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 px-4 h-full">
         <div className="lg:col-span-1 space-y-10">
            <div className="bg-slate-900 p-12 rounded-[60px] text-white shadow-3xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-[80px]"></div>
               <div className="relative z-10 space-y-10">
                  <div className="space-y-2">
                     <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.4em] italic">Current Season</p>
                     <h3 className="text-4xl font-black italic tracking-tighter">موسم الربيع 2026</h3>
                  </div>
                  
                  <div className="space-y-6">
                     <div className="flex justify-between items-end border-b border-white/10 pb-4">
                        <span className="text-slate-400 font-bold">المشاركين</span>
                        <span className="text-2xl font-black">{employees.length}</span>
                     </div>
                     <div className="flex justify-between items-end border-b border-white/10 pb-4">
                        <span className="text-slate-400 font-bold">إجمالي النقاط الموزعة</span>
                        <span className="text-2xl font-black">{leaderboard.reduce((acc, l) => acc + l.points, 0).toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-end border-b border-white/10 pb-4">
                        <span className="text-slate-400 font-bold">الأوسمة الذهبية</span>
                        <span className="text-2xl font-black text-orange-400">{leaderboard.reduce((acc, l) => acc + l.medals.gold, 0)}</span>
                     </div>
                  </div>

                  <button className="w-full bg-orange-500 text-white p-6 rounded-[30px] font-black shadow-2xl hover:bg-orange-600 hover:scale-105 transition-all uppercase tracking-widest italic">عرض جوائز الموسم</button>
               </div>
            </div>

            <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-2xl space-y-8">
               <h4 className="text-xl font-black text-slate-800 border-b pb-6 flex items-center gap-3 italic">
                  <Icon name="medal" className="text-orange-500" />
                  أبطال الأسبوع الحالي
               </h4>
               <div className="space-y-6">
                  {leaderboard.slice(0, 3).map((hero, i) => (
                    <div key={hero.id} className="flex items-center gap-5 group">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-xl transition-all group-hover:scale-110 ${i === 0 ? 'bg-amber-100 text-amber-600' : i === 1 ? 'bg-slate-100 text-slate-400' : 'bg-orange-100 text-orange-600'}`}>
                          {i + 1}
                       </div>
                       <div className="flex-1">
                          <p className="font-black text-slate-800 text-lg leading-none mb-1">{hero.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{hero.position}</p>
                       </div>
                       <div className="text-right">
                          <p className="font-black text-slate-900 text-xl">{hero.points.toLocaleString()}</p>
                          <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest italic">Points</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="lg:col-span-2 bg-white rounded-[60px] shadow-3xl border border-slate-100 overflow-hidden flex flex-col h-full">
            <div className="p-12 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
               <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tighter flex items-center gap-3 uppercase italic">
                     <Icon name="list-ordered" className="text-orange-600" /> Global Leaderboard
                  </h3>
                  <p className="text-sm font-bold text-slate-400 italic">تصنيف الكفاءة والإنتاجية بنظام النقاط التراكمي</p>
               </div>
               <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border p-2 rounded-xl">Refresh: 5m ago</span>
               </div>
            </div>
            
            <div className="overflow-auto flex-1">
               <table className="w-full text-center border-collapse">
                  <thead className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest italic sticky top-0 z-20">
                     <tr>
                        <th className="px-10 py-6 text-right">الرتبة والموظف</th>
                        <th className="px-8 py-6">المستوى (LVL)</th>
                        <th className="px-8 py-6">الأوسمة</th>
                        <th className="px-8 py-6 text-orange-400">إجمالي النقاط</th>
                        <th className="px-10 py-6">تطور الأداء</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {leaderboard.map((emp, i) => (
                       <tr key={emp.id} className="hover:bg-orange-50/30 transition-all font-bold group cursor-pointer">
                          <td className="px-10 py-6 text-right flex items-center gap-6">
                             <span className="text-2xl font-black text-slate-200 italic opacity-50 group-hover:opacity-100 group-hover:text-orange-500 transition-all">{i + 1}.</span>
                             <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">{emp.name.charAt(0)}</div>
                             <div>
                                <p className="font-black text-slate-800 text-lg">{emp.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase italic tracking-tighter">{emp.department}</p>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-full shadow-lg transform group-hover:scale-110 transition-transform">
                                <span className="text-[9px] font-black uppercase opacity-60">LVL</span>
                                <span className="text-sm font-black italic">{emp.level}</span>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center justify-center gap-4">
                                <div className="flex items-center gap-1"><Icon name="medal" size={14} className="text-amber-500" /><span className="text-xs">{emp.medals.gold}</span></div>
                                <div className="flex items-center gap-1"><Icon name="medal" size={14} className="text-slate-400" /><span className="text-xs">{emp.medals.silver}</span></div>
                                <div className="flex items-center gap-1"><Icon name="medal" size={14} className="text-orange-400" /><span className="text-xs">{emp.medals.bronze}</span></div>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-2xl font-black text-slate-900 italic">{emp.points.toLocaleString()}</td>
                          <td className="px-10 py-6">
                             <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <motion.div 
                                   initial={{ width: 0 }}
                                   animate={{ width: `${(emp.points % 1000) / 10}%` }}
                                   className="h-full bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.4)]"
                                ></motion.div>
                             </div>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  );
}
