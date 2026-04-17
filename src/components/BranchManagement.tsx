import React, { useState } from 'react';
import { Icon } from './ui/Icon';
import { motion } from 'motion/react';

export default function BranchManagement() {
  const [branches, setBranches] = useState([
    { id: 1, name: 'المركز الرئيسي - القاهرة', address: 'التجمع الخامس، شارع التسعين', manager: 'أحمد محمود', employees: 145, status: 'active' },
    { id: 2, name: 'فرع الإسكندرية', address: 'سموحة، الطريق الزراعي', manager: 'سارة عبد الله', employees: 56, status: 'active' },
    { id: 3, name: 'فرع المنطقة الحرة - بورسعيد', address: 'ميناء بورسعيد التجاري', manager: 'مصطفى كمال', employees: 22, status: 'inactive' },
  ]);

  return (
    <div className="space-y-10 animate-fade-in pb-20 font-['Cairo']">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">إدارة الفروع والمواقع <span className="text-sky-600">Offices</span></h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">متابعة الأداء الجغرافي للمنشأة</p>
        </div>
        <button className="bg-slate-900 text-white px-10 py-5 rounded-[22px] font-black text-sm hover:bg-indigo-600 transition-all shadow-2xl flex items-center gap-3 active:scale-95 group">
          <Icon name="plus" size={18} className="group-hover:rotate-90 transition-transform" /> إضافة موقع جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {branches.map(branch => (
           <motion.div 
             key={branch.id} 
             whileHover={{ y: -10 }}
             className="bg-white rounded-[50px] border border-slate-100 shadow-2xl overflow-hidden group hover:border-sky-400 transition-all flex flex-col"
           >
              <div className="h-48 bg-slate-900 relative overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-500 via-transparent to-transparent"></div>
                 </div>
                 <Icon name="building-2" size={80} className="text-white relative z-10 opacity-60 group-hover:scale-125 group-hover:opacity-100 transition-all duration-700" />
                 <div className="absolute top-6 left-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${branch.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                       {branch.status === 'active' ? 'نشط' : 'متوقف'}
                    </span>
                 </div>
              </div>
              
              <div className="p-10 flex-1 flex flex-col justify-between">
                 <div className="space-y-6">
                    <div>
                       <h3 className="text-2xl font-black text-slate-800 mb-2">{branch.name}</h3>
                       <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-tight">
                          <Icon name="map-pin" size={12} /> {branch.address}
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">المدير</p>
                          <p className="text-xs font-black text-slate-700">{branch.manager}</p>
                       </div>
                       <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">الموظفين</p>
                          <p className="text-xs font-black text-slate-700 font-mono italic">{branch.employees}</p>
                       </div>
                    </div>
                 </div>
                 
                 <div className="mt-10 flex gap-4">
                    <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-sky-600 transition-all active:scale-95">التحكم الكامل</button>
                    <button className="w-14 h-14 border-2 border-slate-100 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95">
                       <Icon name="edit-3" size={20} />
                    </button>
                 </div>
              </div>
           </motion.div>
        ))}
        
        <button className="border-4 border-dashed border-slate-100 rounded-[50px] p-10 flex flex-col items-center justify-center gap-6 text-slate-300 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50/10 transition-all duration-500 group">
           <div className="w-20 h-20 bg-slate-50 rounded-[30px] flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <Icon name="plus" size={32} />
           </div>
           <span className="text-sm font-black uppercase tracking-widest italic">إضافة موقع تشغيل جديد</span>
        </button>
      </div>
    </div>
  );
}
