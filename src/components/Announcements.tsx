import React, { useState } from 'react';
import { Icon } from './ui/Icon';
import { motion, AnimatePresence } from 'motion/react';

export default function Announcements({ announcements, setAnnouncements, showToast, askConfirm }: any) {
  const [showModal, setShowModal] = useState(false);
  const [editingAnn, setEditingAnn] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', content: '', date: new Date().toISOString().split('T')[0], important: false });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const annData = {
      ...formData,
      id: editingAnn ? editingAnn.id : Date.now().toString()
    };

    if (editingAnn) {
      setAnnouncements(announcements.map((a: any) => a.id === editingAnn.id ? annData : a));
      showToast('تم تحديث الإعلان');
    } else {
      setAnnouncements([...announcements, annData]);
      showToast('تم نشر الإعلان بنجاح');
    }

    setShowModal(false);
    setEditingAnn(null);
    setFormData({ title: '', content: '', date: new Date().toISOString().split('T')[0], important: false });
  };

  const handleDelete = (id: string) => {
    askConfirm('حذف الإعلان؟', 'سيتم إزالة هذا الإعلان من لوحة الموظفين بشكل نهائي.', () => {
      setAnnouncements(announcements.filter((a: any) => a.id !== id));
      showToast('تم حذف الإعلان', 'error');
    });
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter">الإعلانات والأخبار <span className="text-indigo-600">Bulletin</span></h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1 italic">نشر الأخبار والتواصل المباشر مع فريق العمل</p>
        </div>
        <button 
           onClick={() => { setEditingAnn(null); setShowModal(true); }}
           className="bg-slate-900 text-white px-10 py-5 rounded-[30px] font-black shadow-2xl hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
        >
           <Icon name="megaphone" size={24} />
           إضافة إعلان جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {announcements.length === 0 ? (
           <div className="col-span-full py-20 bg-slate-50 rounded-[50px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300">
              <Icon name="inbox" size={64} strokeWidth={1} />
              <p className="mt-4 font-black italic">لا توجد إعلانات منشورة حالياً</p>
           </div>
        ) : announcements.slice().reverse().map((a: any) => (
          <motion.div 
            layout
            key={a.id} 
            className="p-10 bg-white border border-slate-100 rounded-[50px] shadow-2xl shadow-slate-200/50 relative overflow-hidden group hover:border-indigo-500/30 transition-all"
          >
             {a.important && (
               <div className="absolute top-0 right-0 bg-rose-500 text-white px-8 py-2 font-black text-[10px] uppercase tracking-widest rotate-6 -mr-4 mt-4 shadow-lg">
                  هـام جـداً
               </div>
             )}
             
             <div className="flex justify-between items-start mb-6">
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] bg-indigo-50 px-4 py-2 rounded-full">{a.date}</p>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => { setEditingAnn(a); setFormData({...a}); setShowModal(true); }} className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all"><Icon name="edit" size={18} /></button>
                   <button onClick={() => handleDelete(a.id)} className="p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all"><Icon name="trash-2" size={18} /></button>
                </div>
             </div>
             
             <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tighter">{a.title}</h3>
             <p className="text-slate-500 font-bold leading-relaxed">{a.content}</p>
             
             <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <Icon name="eye" size={16} className="text-slate-300" />
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">تم المشاهدة 24 مرة</span>
                </div>
                <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline decoration-2">قراءة المزيد</button>
             </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="bg-white w-full max-w-2xl rounded-[50px] shadow-3xl overflow-hidden"
             >
                <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                   <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{editingAnn ? 'تعديل الإعلان' : 'نشر إعلان جديد'}</h3>
                   <button onClick={() => setShowModal(false)} className="w-14 h-14 bg-slate-50 rounded-2xl text-slate-400 hover:text-rose-600 transition-all"><Icon name="x" size={28} /></button>
                </div>

                <form onSubmit={handleSave} className="p-12 space-y-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">عنوان الإعلان</label>
                      <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-[25px] p-6 font-black text-slate-800 outline-none focus:border-indigo-500 transition-all" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">محتوى الخبر / الإعلان</label>
                      <textarea required className="w-full bg-slate-50 border-2 border-slate-100 rounded-[35px] p-8 font-black text-slate-800 outline-none focus:border-indigo-500 transition-all h-48" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
                   </div>

                   <div className="flex items-center gap-3 p-6 bg-slate-50 rounded-[25px] border-2 border-slate-100">
                      <input type="checkbox" id="important" className="w-6 h-6 accent-indigo-600 rounded-lg" checked={formData.important} onChange={e => setFormData({...formData, important: e.target.checked})} />
                      <label htmlFor="important" className="text-sm font-black text-slate-700 cursor-pointer italic">تعليم الإعلان كخبر "هام جداً"</label>
                   </div>

                   <button type="submit" className="w-full bg-slate-900 text-white p-7 rounded-[35px] font-black shadow-3xl hover:bg-indigo-600 hover:scale-[1.02] transition-all flex items-center justify-center gap-4 text-xl tracking-tighter uppercase italic">
                      نشر الخبر الآن <Icon name="send" size={24} />
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
