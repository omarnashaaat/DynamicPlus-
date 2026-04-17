import React, { useState } from 'react';
import { Icon } from './ui/Icon';
import { motion, AnimatePresence } from 'motion/react';

export default function Training({ trainingCourses, setTrainingCourses, employees, showToast, askConfirm }: any) {
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', provider: '', date: '', status: 'upcoming', attendeesCount: 0, description: '' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const courseData = {
      ...formData,
      id: editingCourse ? editingCourse.id : Date.now().toString()
    };

    if (editingCourse) {
      setTrainingCourses(trainingCourses.map((c: any) => c.id === editingCourse.id ? courseData : c));
      showToast('تم تحديث بيانات الدورة التدريبية');
    } else {
      setTrainingCourses([...trainingCourses, courseData]);
      showToast('تمت إضافة الدورة التدريبية بنجاح');
    }

    setShowModal(false);
    setEditingCourse(null);
    setFormData({ title: '', provider: '', date: '', status: 'upcoming', attendeesCount: 0, description: '' });
  };

  const handleDelete = (id: string) => {
    askConfirm('حذف الدورة التدريبية؟', 'سيتم إزالة كافة البيانات المرتبطة بهذه الدورة بشكل نهائي.', () => {
      setTrainingCourses(trainingCourses.filter((c: any) => c.id !== id));
      showToast('تم حذف الدورة', 'error');
    });
  };

  return (
    <div className="space-y-12 animate-fade-in px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic">التدريب والتطوير <span className="text-indigo-600">Growth</span></h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1 italic">بناء المهارات وتعزيز القدرات التنافسية للفريق</p>
        </div>
        <button 
           onClick={() => { setEditingCourse(null); setShowModal(true); }}
           className="bg-slate-900 text-white px-10 py-5 rounded-[30px] font-black shadow-2xl hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group"
        >
           <Icon name="plus" size={24} />
           إضافة دورة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trainingCourses.length === 0 ? (
           <div className="col-span-full py-32 bg-slate-50 rounded-[60px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300">
              <Icon name="graduation-cap" size={72} strokeWidth={1} />
              <p className="mt-4 font-black italic">لا توجد دورات مسجلة حالياً.</p>
           </div>
        ) : trainingCourses.map((course: any) => (
          <motion.div 
            layout
            key={course.id} 
            className="p-10 bg-white border border-slate-100 rounded-[50px] shadow-2xl shadow-slate-200/50 relative overflow-hidden group hover:border-indigo-500/30 transition-all flex flex-col italic"
          >
             <div className="flex justify-between items-start mb-6">
                <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${course.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                   {course.status === 'completed' ? 'دورة مكتملة' : 'دورة قادمة'}
                </span>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => { setEditingCourse(course); setFormData({...course}); setShowModal(true); }} className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all"><Icon name="edit" size={18} /></button>
                   <button onClick={() => handleDelete(course.id)} className="p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all"><Icon name="trash-2" size={18} /></button>
                </div>
             </div>
             
             <h3 className="text-2xl font-black text-slate-800 mb-2 truncate group-hover:text-indigo-600 transition-colors uppercase tracking-tighter italic">{course.title}</h3>
             <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6">{course.provider}</p>
             
             <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between text-xs font-black">
                   <span className="text-slate-400 uppercase tracking-wider">التاريخ المستهدف:</span>
                   <span className="text-slate-700">{course.date}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-black">
                   <span className="text-slate-400 uppercase tracking-wider">عدد المتدربين:</span>
                   <span className="text-slate-700">{course.attendeesCount} متدرب</span>
                </div>
             </div>

             <button className="mt-auto w-full py-4 bg-slate-50 text-slate-400 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-900 hover:text-white transition-all">تحميل الخطة التدريبية</button>
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
                   <h3 className="text-3xl font-black text-slate-800 tracking-tighter italic">إدارة البرامج التدريبية</h3>
                   <button onClick={() => setShowModal(false)} className="w-14 h-14 bg-slate-50 rounded-2xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all"><Icon name="x" size={28} /></button>
                </div>

                <form onSubmit={handleSave} className="p-12 space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-4">عنوان الدورة التدريبية</label>
                      <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-[25px] p-6 font-black text-slate-800 outline-none focus:border-indigo-500 transition-all" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="مثال: إدارة الأزمات، القيادة الإبداعية.." />
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-4">جهة التدريب (Provider)</label>
                         <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-[25px] p-6 font-black text-slate-800 outline-none focus:border-indigo-500 transition-all" value={formData.provider} onChange={e => setFormData({...formData, provider: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-4">تاريخ الانعقاد</label>
                         <input type="date" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-[25px] p-6 font-black text-slate-800 outline-none focus:border-indigo-500 transition-all" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-4">عدد المستهدفين</label>
                         <input type="number" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-[25px] p-6 font-black text-slate-800 outline-none focus:border-indigo-500 transition-all" value={formData.attendeesCount} onChange={e => setFormData({...formData, attendeesCount: parseInt(e.target.value)})} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-4">حالة الدورة</label>
                         <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-[25px] p-6 font-black text-slate-800 outline-none focus:border-indigo-500 transition-all" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                            <option value="upcoming">قادمة (Upcoming)</option>
                            <option value="completed">مكتملة (Completed)</option>
                         </select>
                      </div>
                   </div>

                   <button type="submit" className="w-full bg-slate-900 text-white p-7 rounded-[35px] font-black shadow-3xl hover:bg-indigo-600 hover:scale-[1.02] transition-all flex items-center justify-center gap-4 text-xl tracking-tighter uppercase italic mt-6">
                      اعتماد الدورة التدريبية <Icon name="graduation-cap" size={24} />
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
