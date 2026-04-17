import React, { useState } from 'react';
import { Icon } from './ui/Icon';
import { motion, AnimatePresence } from 'motion/react';

export default function BranchManagement({ askConfirm, showToast }: any) {
  const [branches, setBranches] = useState(() => {
    const saved = localStorage.getItem('hr_branches');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', name: 'المركز الرئيسي - القاهرة', address: 'التجمع الخامس، شارع التسعين', manager: 'أحمد محمود', employees: 145, status: 'active' },
      { id: '2', name: 'فرع الإسكندرية', address: 'سموحة، الطريق الزراعي', manager: 'سارة عبد الله', employees: 56, status: 'active' },
      { id: '3', name: 'فرع المنطقة الحرة - بورسعيد', address: 'ميناء بورسعيد التجاري', manager: 'مصطفى كمال', employees: 22, status: 'inactive' },
    ];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any>(null);
  const [formData, setFormData] = useState<any>({ name: '', address: '', manager: '', employees: 0, status: 'active' });

  const saveBranches = (newBranches: any) => {
    setBranches(newBranches);
    localStorage.setItem('hr_branches', JSON.stringify(newBranches));
  };

  const handleEdit = (branch: any) => {
    setEditingBranch(branch);
    setFormData(branch);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    askConfirm('حذف موقع التشغيل؟', 'سيتم إيقاف كافة العمليات المرتبطة بهذا الموقع نهائياً.', () => {
      const updated = branches.filter((b: any) => b.id !== id);
      saveBranches(updated);
      showToast('تم حذف الموقع بنجاح', 'error');
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBranch) {
      const updated = branches.map((b: any) => b.id === editingBranch.id ? { ...formData, id: b.id } : b);
      saveBranches(updated);
      showToast('تم تحديث بيانات الموقع');
    } else {
      const newBranch = { ...formData, id: Date.now().toString() };
      saveBranches([...branches, newBranch]);
      showToast('تم إضافة الموقع الجديد بنجاح');
    }
    setIsModalOpen(false);
    setEditingBranch(null);
    setFormData({ name: '', address: '', manager: '', employees: 0, status: 'active' });
  };

  return (
    <div className="space-y-12 animate-fade-in pb-20 px-4 italic">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">إدارة الفروع والمواقع <span className="text-indigo-600">Offices</span></h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2 italic px-1">نظام التنسيق الجغرافي واللوجستي للمنظمة</p>
        </div>
        <button 
           onClick={() => { setEditingBranch(null); setFormData({ name: '', address: '', manager: '', employees: 0, status: 'active' }); setIsModalOpen(true); }}
           className="bg-slate-900 text-white px-10 py-6 rounded-[30px] font-black text-sm hover:bg-indigo-600 transition-all shadow-4xl flex items-center gap-4 active:scale-95 group italic"
        >
          <Icon name="plus" size={20} className="group-hover:rotate-90 transition-transform" /> إضافة موقع جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 italic">
        {branches.map((branch: any) => (
           <motion.div 
             layout
             key={branch.id} 
             whileHover={{ y: -12 }}
             className="bg-white rounded-[60px] border border-slate-100 shadow-3xl overflow-hidden group hover:border-indigo-400 transition-all flex flex-col italic"
           >
              <div className="h-56 bg-slate-950 relative overflow-hidden flex items-center justify-center italic">
                 <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent"></div>
                 </div>
                 <Icon name="building-2" size={90} strokeWidth={1} className="text-white relative z-10 opacity-30 group-hover:scale-125 group-hover:opacity-100 transition-all duration-700" />
                 <div className="absolute top-8 left-8">
                    <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] italic shadow-xl ${branch.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                       {branch.status === 'active' ? 'نشط OPERATIONAL' : 'متوقف SUSPENDED'}
                    </span>
                 </div>
              </div>
              
              <div className="p-10 flex-1 flex flex-col justify-between italic">
                 <div className="space-y-8 italic">
                    <div>
                       <h3 className="text-3xl font-black text-slate-800 mb-2 truncate italic">{branch.name}</h3>
                       <div className="flex items-center gap-3 text-slate-400 font-black text-[11px] uppercase tracking-tighter italic">
                          <Icon name="map-pin" size={14} className="text-indigo-400" /> {branch.address}
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 italic">
                       <div className="bg-slate-50/50 p-6 rounded-[30px] border border-slate-100 italic">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">المدير المسؤول</p>
                          <p className="text-sm font-black text-slate-700 italic">{branch.manager}</p>
                       </div>
                       <div className="bg-slate-50/50 p-6 rounded-[30px] border border-slate-100 italic">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">القوة العاملة</p>
                          <p className="text-sm font-black text-slate-700 font-mono italic">{branch.employees} فرد</p>
                       </div>
                    </div>
                 </div>
                 
                 <div className="mt-10 flex gap-4 italic">
                    <button className="flex-1 py-5 bg-slate-900 text-white rounded-[25px] font-black text-xs hover:bg-indigo-600 transition-all active:scale-95 italic">إحصائيات الأداء</button>
                    <div className="flex gap-2 italic">
                       <button onClick={() => handleEdit(branch)} className="w-16 h-16 border-2 border-slate-100 text-slate-400 rounded-[25px] flex items-center justify-center hover:bg-slate-50 hover:text-indigo-600 transition-all active:scale-95 italic">
                          <Icon name="edit" size={24} />
                       </button>
                       <button onClick={() => handleDelete(branch.id)} className="w-16 h-16 border-2 border-slate-100 text-slate-400 rounded-[25px] flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-95 italic text-rose-300">
                          <Icon name="trash-2" size={24} />
                       </button>
                    </div>
                 </div>
              </div>
           </motion.div>
        ))}
        
        <button 
           onClick={() => { setEditingBranch(null); setFormData({ name: '', address: '', manager: '', employees: 0, status: 'active' }); setIsModalOpen(true); }}
           className="border-4 border-dashed border-slate-100 rounded-[60px] p-20 flex flex-col items-center justify-center gap-8 text-slate-300 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50/10 transition-all duration-700 group italic"
        >
           <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl italic">
              <Icon name="plus" size={40} />
           </div>
           <span className="text-lg font-black uppercase tracking-tighter italic">إضافة موقع تشغيل جديد</span>
        </button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-[200] flex items-center justify-center p-4 italic">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="bg-white w-full max-w-2xl rounded-[50px] shadow-4xl overflow-hidden border border-white/20 italic"
            >
               <form onSubmit={handleSubmit} className="italic">
                  <div className="p-10 border-b flex justify-between items-center bg-slate-50/50 italic">
                     <h3 className="text-2xl font-black text-slate-800 italic">{editingBranch ? 'تعديل بيانات الموقع' : 'إضافة موقع تشغيل جديد'}</h3>
                     <button type="button" onClick={() => setIsModalOpen(false)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white shadow-xl hover:text-rose-500 transition-all italic"><Icon name="x" size={24} /></button>
                  </div>
                  
                  <div className="p-10 space-y-6 italic">
                     <div className="space-y-2 italic">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-4">اسم الفرع / الموقع</label>
                        <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-6 rounded-[25px] font-black outline-none focus:border-indigo-500 transition-all italic" placeholder="مثال: فرع الجيزة الرئيسي" />
                     </div>
                     <div className="grid grid-cols-2 gap-6 italic">
                        <div className="space-y-2 italic">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-4">المدير المسؤول</label>
                           <input required type="text" value={formData.manager} onChange={e => setFormData({...formData, manager: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-6 rounded-[25px] font-black outline-none focus:border-indigo-500 transition-all italic" placeholder="الاسم الكامل" />
                        </div>
                        <div className="space-y-2 italic">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-4">عدد الموظفين</label>
                           <input type="number" value={formData.employees} onChange={e => setFormData({...formData, employees: parseInt(e.target.value) || 0})} className="w-full bg-slate-50 border-2 border-slate-100 p-6 rounded-[25px] font-black outline-none focus:border-indigo-500 transition-all italic" />
                        </div>
                     </div>
                     <div className="space-y-2 italic">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-4">العنوان التفصيلي</label>
                        <input required type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-6 rounded-[25px] font-black outline-none focus:border-indigo-500 transition-all italic" placeholder="المنطقة، الشارع، المبنى" />
                     </div>
                     <div className="space-y-2 italic">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-4">حالة التشغيل</label>
                        <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-6 rounded-[25px] font-black outline-none focus:border-indigo-500 transition-all italic">
                           <option value="active">نشط (Operational)</option>
                           <option value="inactive">متوقف (Suspended)</option>
                        </select>
                     </div>
                  </div>
                  
                  <div className="p-10 bg-slate-50 flex justify-end italic">
                     <button type="submit" className="bg-slate-900 text-white px-12 py-6 rounded-[25px] font-black uppercase tracking-widest shadow-2xl hover:bg-indigo-600 hover:scale-[1.02] active:scale-95 transition-all italic">
                        {editingBranch ? 'تحديث البيانات' : 'إضافة الموقع الآن'}
                     </button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
