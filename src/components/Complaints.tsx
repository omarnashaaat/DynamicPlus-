import React, { useState } from 'react';
import { Icon } from './ui/Icon';
import { motion, AnimatePresence } from 'motion/react';

export default function Complaints({ complaints, setComplaints, showToast, askConfirm, employees }: any) {
  const [showModal, setShowModal] = useState(false);
  const [editingComp, setEditingComp] = useState<any>(null);
  const [formData, setFormData] = useState({ empId: '', subject: '', content: '', status: 'pending', priority: 'normal' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((x: any) => x.id === formData.empId);
    const compData = {
      ...formData,
      id: editingComp ? editingComp.id : Date.now().toString(),
      from: emp?.name || 'مجهول',
      date: new Date().toISOString().split('T')[0]
    };

    if (editingComp) {
      setComplaints(complaints.map((c: any) => c.id === editingComp.id ? compData : c));
      showToast('تم تحديث حالة الشكوى');
    } else {
      setComplaints([...complaints, compData]);
      showToast('تم إرسال الشكوى/الاقتراح بنجاح');
    }

    setShowModal(false);
    setEditingComp(null);
    setFormData({ empId: '', subject: '', content: '', status: 'pending', priority: 'normal' });
  };

  const handleDelete = (id: string) => {
    askConfirm('حذف السجل؟', 'سيتم إزالة هذا السجل تماماً من النظام.', () => {
      setComplaints(complaints.filter((c: any) => c.id !== id));
      showToast('تم الحذف', 'error');
    });
  };

  const resolveComplaint = (id: string) => {
    setComplaints(complaints.map((c: any) => c.id === id ? { ...c, status: 'resolved' } : c));
    showToast('تم وضع علامة "مكتملة" على الشكوى', 'success');
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic">نظام الشكاوى والاقتراحات <span className="text-indigo-600">Feedback</span></h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1 italic">قناة تواصل مباشرة لتعزيز بيئة العمل</p>
        </div>
        <button 
           onClick={() => { setEditingComp(null); setShowModal(true); }}
           className="bg-slate-900 text-white px-10 py-5 rounded-[30px] font-black shadow-2xl hover:bg-rose-600 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group"
        >
           <Icon name="message-square-plus" size={24} />
           إرسال شكوى جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {complaints.length === 0 ? (
           <div className="col-span-full py-32 bg-slate-50 rounded-[60px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300">
              <Icon name="mail-open" size={72} strokeWidth={1} />
              <p className="mt-4 font-black italic">صندوق الوارد فارغ. لا توجد شكاوى أو اقتراحات حالياً.</p>
           </div>
        ) : complaints.slice().reverse().map((c: any) => (
          <motion.div 
            layout
            key={c.id} 
            className="p-10 bg-white border border-slate-100 rounded-[50px] shadow-2xl shadow-slate-200/50 relative overflow-hidden group hover:border-amber-500/30 transition-all border-b-8 border-b-slate-100 italic"
          >
             <div className="flex justify-between items-start mb-6">
                <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${c.status === 'resolved' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                   {c.status === 'resolved' ? 'مكتملة' : 'تحت المراجعة'}
                </span>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   {c.status !== 'resolved' && (
                      <button onClick={() => resolveComplaint(c.id)} className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all" title="اعتماد كـ مكتملة"><Icon name="check" size={18} /></button>
                   )}
                   <button onClick={() => { setEditingComp(c); setFormData({...c}); setShowModal(true); }} className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all"><Icon name="edit" size={18} /></button>
                   <button onClick={() => handleDelete(c.id)} className="p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all"><Icon name="trash-2" size={18} /></button>
                </div>
             </div>
             
             <h3 className="text-xl font-black text-slate-800 mb-2">{c.subject}</h3>
             <p className="text-slate-500 font-bold line-clamp-3 text-sm leading-relaxed mb-6">{c.content}</p>
             
             <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-50">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-black">{c.from.charAt(0)}</div>
                <div>
                   <p className="text-xs font-black text-slate-700">{c.from}</p>
                   <p className="text-[10px] text-slate-400 italic">{c.date}</p>
                </div>
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
                   <h3 className="text-3xl font-black text-slate-800 tracking-tighter italic">نموذج التواصل الداخلي</h3>
                   <button onClick={() => setShowModal(false)} className="w-14 h-14 bg-slate-50 rounded-2xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all"><Icon name="x" size={28} /></button>
                </div>

                <form onSubmit={handleSave} className="p-12 space-y-6">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-4">الموظف صاحب الشكوى</label>
                         <select required className="w-full bg-slate-50 border-2 border-slate-100 rounded-[25px] p-5 font-black text-slate-800 outline-none focus:border-indigo-500 transition-all" value={formData.empId} onChange={e => setFormData({...formData, empId: e.target.value})}>
                           <option value="">اختر الموظف</option>
                           {employees.map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-4">الموضوع / التصنيف</label>
                         <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-[25px] p-5 font-black text-slate-800 outline-none focus:border-indigo-500 transition-all" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="مثال: بيئة العمل، الرواتب.." />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-4">التفاصيل الكاملة</label>
                      <textarea required className="w-full bg-slate-50 border-2 border-slate-100 rounded-[35px] p-8 font-black text-slate-800 outline-none focus:border-indigo-500 transition-all h-40" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="اشرح تفاصيل طلبك أو شكواك هنا..." />
                   </div>

                   <div className="grid grid-cols-2 gap-6 pt-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-4">الأولوية</label>
                         <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-[25px] p-5 font-black text-slate-800 outline-none focus:border-indigo-500 transition-all" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                            <option value="normal">عادية (Normal)</option>
                            <option value="high">عالية (High)</option>
                            <option value="urgent">عاجل (Urgent)</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-4">الحالة</label>
                         <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-[25px] p-5 font-black text-slate-800 outline-none focus:border-indigo-500 transition-all" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                            <option value="pending">قيد المراجعة</option>
                            <option value="resolved">مكتملة وحُلت</option>
                         </select>
                      </div>
                   </div>

                   <button type="submit" className="w-full bg-slate-900 text-white p-7 rounded-[35px] font-black shadow-3xl hover:bg-emerald-600 hover:scale-[1.02] transition-all flex items-center justify-center gap-4 text-xl tracking-tighter uppercase italic mt-6">
                      إرسال الطلب الآن <Icon name="send-horizontal" size={24} />
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
