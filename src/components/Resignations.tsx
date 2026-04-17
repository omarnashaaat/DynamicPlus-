import React, { useState } from 'react';
import { Icon } from './ui/Icon';
import { motion, AnimatePresence } from 'motion/react';

export default function Resignations({ employees, resignations, setResignations, setEmployees, showToast, askConfirm }: any) {
  const [showModal, setShowModal] = useState(false);
  const [editingRes, setEditingRes] = useState<any>(null);
  const [formData, setFormData] = useState({ 
    empId: '', 
    date: new Date().toISOString().split('T')[0], 
    reason: '', 
    type: 'استقالة',
    status: 'قيد المراجعة',
    noticePeriod: '30 يوم'
  });

  const saveResignations = (updated: any[]) => {
    setResignations(updated);
    localStorage.setItem('hr_resignations', JSON.stringify(updated));
  };

  const handleEdit = (res: any) => {
    setEditingRes(res);
    setFormData(res);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    askConfirm('حذف طلب الاستقالة؟', 'هل أنت متأكد من حذف هذا السجل نهائياً؟', () => {
      const updated = resignations.filter((r: any) => r.id !== id);
      saveResignations(updated);
      showToast('تم حذف السجل بنجاح', 'error');
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === formData.empId);
    if (!emp) return showToast('يرجى اختيار الموظف', 'error');

    if (editingRes) {
      const updated = resignations.map((r: any) => r.id === editingRes.id ? { ...formData, id: editingRes.id, empName: emp.name } : r);
      saveResignations(updated);
      showToast('تم تحديث البيانات بنجاح');
    } else {
      const newRes = { ...formData, id: Date.now().toString(), empName: emp.name };
      saveResignations([...resignations, newRes]);
      showToast('تم تسجيل الطلب بنجاح');
    }
    setShowModal(false);
    setEditingRes(null);
    setFormData({ empId: '', date: new Date().toISOString().split('T')[0], reason: '', type: 'استقالة', status: 'قيد المراجعة', noticePeriod: '30 يوم' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مقبول': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'مرفوض': return 'bg-rose-100 text-rose-600 border-rose-200';
      default: return 'bg-amber-100 text-amber-600 border-amber-200';
    }
  };

  return (
    <div className="space-y-12 animate-fade-in relative px-4 italic">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
           <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-[35px] flex items-center justify-center shadow-lg transform -rotate-6">
              <Icon name="user-minus" size={40} />
           </div>
           <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">إدارة نهاية الخدمة <span className="text-rose-600">Off-boarding</span></h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">متابعة إجراءات الاستقالة والتسوية النهائية</p>
           </div>
        </div>
        <button 
           onClick={() => { setEditingRes(null); setShowModal(true); }}
           className="bg-slate-900 text-white px-10 py-6 rounded-[30px] font-black text-sm hover:bg-rose-600 transition-all shadow-4xl flex items-center gap-4 active:scale-95 group italic"
        >
          <Icon name="plus" size={20} className="group-hover:rotate-90 transition-transform" /> تسجيل طلب جديد
        </button>
      </div>

      <div className="bg-white rounded-[60px] shadow-4xl border border-slate-100 overflow-hidden italic">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse italic">
            <thead className="bg-slate-950 text-white font-black italic">
              <tr>
                <th className="px-10 py-8 text-sm uppercase tracking-[0.2em] italic">الموظف</th>
                <th className="px-10 py-8 text-sm uppercase tracking-[0.2em] italic">النوع</th>
                <th className="px-10 py-8 text-sm uppercase tracking-[0.2em] italic">التاريخ الفعلي</th>
                <th className="px-10 py-8 text-sm uppercase tracking-[0.2em] italic">فترة الإخطار</th>
                <th className="px-10 py-8 text-center text-sm uppercase tracking-[0.2em] italic">الحالة</th>
                <th className="px-10 py-8 text-center text-sm uppercase tracking-[0.2em] italic">العمليات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 italic">
              {resignations.length > 0 ? resignations.map((res: any) => (
                <motion.tr 
                   layout
                   key={res.id} 
                   className="hover:bg-rose-50/30 transition-all group italic"
                >
                  <td className="px-10 py-8 italic">
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center font-black group-hover:bg-rose-600 group-hover:text-white transition-all italic">{res.empName?.charAt(0)}</div>
                        <p className="font-black text-slate-800 text-lg tracking-tighter italic">{res.empName}</p>
                     </div>
                  </td>
                  <td className="px-10 py-8 italic">
                     <span className="bg-slate-50 text-slate-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest italic border border-slate-100">{res.type}</span>
                  </td>
                  <td className="px-10 py-8 italic">
                     <p className="font-black text-slate-600 font-mono italic">{res.date}</p>
                  </td>
                  <td className="px-10 py-8 italic font-bold text-slate-400 italic">
                     {res.noticePeriod}
                  </td>
                  <td className="px-10 py-8 text-center italic">
                    <span className={`px-4 py-2 rounded-2xl text-[10px] font-black italic border ${getStatusColor(res.status)}`}>
                       {res.status}
                    </span>
                  </td>
                  <td className="px-10 py-8 italic">
                     <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 italic">
                        <button onClick={() => handleEdit(res)} className="w-12 h-12 bg-white text-slate-400 rounded-2xl shadow-xl flex items-center justify-center hover:text-indigo-600 hover:scale-110 transition-all italic"><Icon name="edit" size={20} /></button>
                        <button onClick={() => handleDelete(res.id)} className="w-12 h-12 bg-white text-slate-400 rounded-2xl shadow-xl flex items-center justify-center hover:text-rose-600 hover:scale-110 transition-all italic"><Icon name="trash-2" size={20} /></button>
                     </div>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan={6} className="py-32 text-center text-slate-200 italic">
                     <div className="space-y-6">
                        <Icon name="user-check" size={80} strokeWidth={1} className="mx-auto opacity-30" />
                        <div>
                           <p className="text-2xl font-black uppercase tracking-tighter italic">No Off-boarding Records</p>
                           <p className="text-sm font-bold opacity-60 italic">كافة الموظفين على رأس العمل حالياً</p>
                        </div>
                     </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-[200] flex items-center justify-center p-4 italic">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="bg-white w-full max-w-2xl rounded-[60px] shadow-4xl overflow-hidden"
            >
               <form onSubmit={handleSubmit} className="italic">
                  <div className="p-10 border-b flex justify-between items-center bg-slate-50/50 italic">
                     <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-rose-600 text-white rounded-[20px] flex items-center justify-center shadow-lg"><Icon name="user-minus" size={28} /></div>
                        <h3 className="text-2xl font-black text-slate-800 italic">{editingRes ? 'تعديل السجل' : 'تسجيل طلب إنهاء خدمة'}</h3>
                     </div>
                     <button type="button" onClick={() => setShowModal(false)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white shadow-xl hover:text-rose-500 transition-all italic"><Icon name="x" size={24} /></button>
                  </div>
                  
                  <div className="p-10 space-y-8 italic">
                     <div className="grid grid-cols-2 gap-8 italic">
                        <div className="space-y-2 italic">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-4">الموظف المعني</label>
                           <select required value={formData.empId} onChange={e => setFormData({...formData, empId: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-6 rounded-[25px] font-black outline-none focus:border-rose-500 transition-all appearance-none italic cursor-pointer">
                              <option value="">-- اختر من القائمة --</option>
                              {employees.map((emp: any) => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                           </select>
                        </div>
                        <div className="space-y-2 italic">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-4">تاريخ آخر يوم عمل</label>
                           <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-6 rounded-[25px] font-black outline-none focus:border-rose-500 transition-all italic" />
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-8 italic">
                        <div className="space-y-2 italic">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-4">نوع الطلب</label>
                           <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-6 rounded-[25px] font-black outline-none focus:border-rose-500 transition-all italic">
                              <option value="استقالة">استقالة طوعية</option>
                              <option value="إقالة">إقالة / فصل</option>
                              <option value="بلوغ سن">بلوغ سن المعاش</option>
                              <option value="وفاة">وفاة (لا قدر الله)</option>
                           </select>
                        </div>
                        <div className="space-y-2 italic">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-4">حالة الطلب</label>
                           <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-6 rounded-[25px] font-black outline-none focus:border-rose-500 transition-all italic">
                              <option value="قيد المراجعة">قيد المراجعة</option>
                              <option value="مقبول">تم الاعتماد</option>
                              <option value="مرفوض">مرفوض</option>
                           </select>
                        </div>
                     </div>

                     <div className="space-y-2 italic">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-4">سبب إنهاء الخدمة / ملاحظات إضافية</label>
                        <textarea required value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-6 rounded-[25px] font-black outline-none focus:border-rose-500 transition-all h-32 italic" placeholder="اكتب التفاصيل هنا..."></textarea>
                     </div>
                  </div>
                  
                  <div className="p-10 bg-slate-50 flex justify-end italic">
                     <button type="submit" className="bg-slate-900 text-white px-16 py-6 rounded-[30px] font-black uppercase tracking-widest shadow-2xl hover:bg-rose-600 hover:scale-[1.02] active:scale-95 transition-all italic">
                        {editingRes ? 'تحديث السجل' : 'حفظ الطلب واعتماده'}
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
