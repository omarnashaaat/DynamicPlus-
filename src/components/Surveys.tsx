import React, { useState } from 'react';
import { Icon } from './ui/Icon';
import { motion, AnimatePresence } from 'motion/react';

export default function Surveys({ surveys, setSurveys, showToast, askConfirm }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<any>(null);
  const [formData, setFormData] = useState<any>({ title: '', participants: 0, type: 'General', status: 'active' });

  const saveSurveys = (newSurveys: any) => {
    setSurveys(newSurveys);
    localStorage.setItem('hr_surveys', JSON.stringify(newSurveys));
  };

  const handleEdit = (survey: any) => {
    setEditingSurvey(survey);
    setFormData(survey);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    askConfirm('حذف الاستطلاع؟', 'سيتم حذف كافة النتائج والبيانات المرتبطة بهذا الاستطلاع نهائياً.', () => {
      const updated = surveys.filter((s: any) => s.id !== id);
      saveSurveys(updated);
      showToast('تم حذف الاستطلاع بنجاح', 'error');
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSurvey) {
      const updated = surveys.map((s: any) => s.id === editingSurvey.id ? { ...formData, id: s.id } : s);
      saveSurveys(updated);
      showToast('تم تحديث بيانات الاستطلاع');
    } else {
      const newSurvey = { ...formData, id: Date.now().toString() };
      saveSurveys([...surveys, newSurvey]);
      showToast('تم إطلاق الاستطلاع الجديد بنجاح');
    }
    setIsModalOpen(false);
    setEditingSurvey(null);
    setFormData({ title: '', participants: 0, type: 'General', status: 'active' });
  };

  return (
    <div className="space-y-12 animate-fade-in px-4 pb-20 italic">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print">
        <div className="flex items-center gap-5">
           <div className="w-20 h-20 bg-violet-100 text-violet-600 rounded-[35px] flex items-center justify-center shadow-lg transform rotate-3 italic border border-white">
              <Icon name="message-square" size={40} />
           </div>
           <div>
              <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic uppercase">منظومة الاستطلاعات الذكية <span className="text-violet-600">Surveys</span></h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] italic">قياس نبض المؤسسة وتعزيز الشفافية الرقمية</p>
           </div>
        </div>
        <button 
           onClick={() => { setEditingSurvey(null); setFormData({ title: '', participants: 0, type: 'General', status: 'active' }); setIsModalOpen(true); }}
           className="bg-slate-900 text-white px-10 py-6 rounded-[30px] font-black shadow-4xl hover:bg-violet-600 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 italic"
        >
           <Icon name="plus" size={24} /> إنشاء استطلاع جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 italic">
        {surveys.length > 0 ? surveys.map((s: any) => (
          <motion.div 
             layout
             key={s.id}
             whileHover={{ y: -12 }}
             className="bg-white p-12 rounded-[60px] border border-slate-100 shadow-3xl group relative overflow-hidden italic"
          >
             <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/5 rounded-full -mr-20 -mt-20 group-hover:bg-violet-500/10 transition-all"></div>
             
             <div className="space-y-8 relative z-10 italic">
                <div className="flex justify-between items-start italic">
                   <div className="p-4 bg-slate-50 rounded-[22px] text-slate-400 font-black text-[10px] uppercase tracking-widest italic">{s.type}</div>
                   <div className="flex items-center gap-3 italic">
                      <div className={`w-3 h-3 rounded-full animate-pulse ${s.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                      <span className="text-[10px] font-black uppercase tracking-widest italic">{s.status === 'active' ? 'Active' : 'Closed'}</span>
                   </div>
                </div>

                <div className="space-y-4 italic">
                   <h3 className="text-3xl font-black text-slate-800 group-hover:text-violet-600 transition-colors tracking-tighter italic leading-tight">{s.title}</h3>
                   <div className="flex items-center gap-5 italic">
                      <div className="flex -space-x-4 rtl:space-x-reverse italic">
                         {[1,2,3].map(j => <div key={j} className="w-10 h-10 rounded-2xl border-4 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black italic text-slate-400 shadow-sm">{j}</div>)}
                         <div className="w-10 h-10 rounded-2xl border-4 border-white bg-violet-600 text-white flex items-center justify-center text-[10px] font-black italic shadow-md">+{Math.max(0, (s.participants || 0) - 3)}</div>
                      </div>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-tighter italic">{(s.participants || 0).toLocaleString()} <br/> Participated</span>
                   </div>
                </div>

                <div className="pt-8 border-t border-slate-50 flex gap-4 italic text-center justify-center">
                   <button className="flex-1 bg-slate-50 text-slate-900 py-5 rounded-[25px] font-black text-xs hover:bg-slate-900 hover:text-white transition-all shadow-sm italic">تحليل البيانات</button>
                   <div className="flex gap-2 italic">
                      <button onClick={() => handleEdit(s)} className="w-16 h-16 bg-white border-2 border-slate-50 text-slate-400 rounded-[25px] flex items-center justify-center hover:bg-violet-100 hover:text-violet-600 transition-all rotate-0 hover:rotate-6 italic"><Icon name="edit" size={24} /></button>
                      <button onClick={() => handleDelete(s.id)} className="w-16 h-16 bg-white border-2 border-slate-50 text-slate-400 rounded-[25px] flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all italic text-rose-300"><Icon name="trash-2" size={24} /></button>
                   </div>
                </div>
             </div>
          </motion.div>
        )) : (
          <div className="col-span-full py-40 text-center italic">
             <div className="w-32 h-32 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-6">
                <Icon name="message-square-off" size={64} className="text-slate-200" />
             </div>
             <p className="text-2xl font-black text-slate-300 uppercase tracking-tighter italic">No Active Surveys</p>
             <p className="text-sm font-bold text-slate-400 opacity-60">ابدأ بإنشاء استبيان جديد لقياس رضا الموظفين</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-[200] flex items-center justify-center p-4 italic">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="bg-white w-full max-w-2xl rounded-[60px] shadow-4xl overflow-hidden border border-white/20 italic"
            >
               <form onSubmit={handleSubmit} className="italic">
                  <div className="p-10 border-b flex justify-between items-center bg-slate-50/50 italic">
                     <h3 className="text-2xl font-black text-slate-800 italic">{editingSurvey ? 'تعديل بيانات الاستطلاع' : 'إطلاق استبيان جديد'}</h3>
                     <button type="button" onClick={() => setIsModalOpen(false)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white shadow-xl hover:text-rose-500 transition-all italic"><Icon name="x" size={24} /></button>
                  </div>
                  
                  <div className="p-10 space-y-8 italic">
                     <div className="space-y-2 italic">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-4">عنوان الاستطلاع</label>
                        <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-6 rounded-[25px] font-black outline-none focus:border-violet-500 transition-all italic" placeholder="مثال: استقصاء رضا الموظفين للربع السنوي" />
                     </div>
                     <div className="grid grid-cols-2 gap-8 italic">
                        <div className="space-y-2 italic">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-4">التصنيف الوظيفي</label>
                           <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-6 rounded-[25px] font-black outline-none focus:border-violet-500 transition-all italic">
                              <option value="General">عام - General</option>
                              <option value="Health">تأمين طبي - Medical</option>
                              <option value="Environment">بيئة العمل - Work Culture</option>
                              <option value="Compensation">الرواتب والمزايا - Compensation</option>
                           </select>
                        </div>
                        <div className="space-y-2 italic">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-4">الحالة</label>
                           <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-6 rounded-[25px] font-black outline-none focus:border-violet-500 transition-all italic">
                              <option value="active">متاح (Active)</option>
                              <option value="closed">مغلق (Closed)</option>
                           </select>
                        </div>
                     </div>
                  </div>
                  
                  <div className="p-10 bg-slate-50 flex justify-end italic">
                     <button type="submit" className="bg-slate-900 text-white px-12 py-6 rounded-[30px] font-black uppercase tracking-widest shadow-2xl hover:bg-violet-600 hover:scale-[1.02] active:scale-95 transition-all italic">
                        {editingSurvey ? 'تحديث الاستطلاع' : 'إطلاق الاستبيان الآن'}
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
