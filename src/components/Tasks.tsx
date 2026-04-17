import React, { useState } from 'react';
import { Icon } from './ui/Icon';
import { motion, AnimatePresence } from 'motion/react';

export default function Tasks({ tasks, setTasks, employees, showToast, askConfirm }: any) {
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', empId: '', deadline: '', priority: 'Medium', status: 'Pending', description: '' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((x: any) => x.id === formData.empId);
    const taskData = {
      ...formData,
      id: editingTask ? editingTask.id : Date.now().toString(),
      empName: emp?.name || 'غير محدد',
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (editingTask) {
      setTasks(tasks.map((t: any) => t.id === editingTask.id ? taskData : t));
      showToast('تم تحديث المهمة');
    } else {
      setTasks([...tasks, taskData]);
      showToast('تم إسناد المهمة بنجاح');
    }

    setShowModal(false);
    setEditingTask(null);
    setFormData({ title: '', empId: '', deadline: '', priority: 'Medium', status: 'Pending', description: '' });
  };

  const deleteTask = (id: string) => {
    askConfirm('حذف المهمة؟', 'هل أنت متأكد من حذف هذه المهمة نهائياً؟', () => {
      setTasks(tasks.filter((t: any) => t.id !== id));
      showToast('تم الحذف', 'error');
    });
  };

  const toggleStatus = (id: string) => {
    setTasks(tasks.map((t: any) => t.id === id ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' } : t));
    showToast('تم تغيير حالة المهمة');
  };

  return (
    <div className="space-y-10 animate-fade-in px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic">مركز إدارة المهام <span className="text-indigo-600">Tasks</span></h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1 italic">متابعة الأداء وإسناد المسؤوليات للفريق</p>
        </div>
        <button 
           onClick={() => { setEditingTask(null); setShowModal(true); }}
           className="bg-slate-900 text-white px-10 py-5 rounded-[30px] font-black shadow-2xl hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group"
        >
           <Icon name="list-plus" size={24} />
           إسناد مهمة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tasks.length === 0 ? (
           <div className="col-span-full py-32 bg-slate-50 rounded-[60px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300">
              <Icon name="clipboard-list" size={72} strokeWidth={1} />
              <p className="mt-4 font-black italic">لا توجد مهام حالية. ابدأ بإسناد مهام لفريقك.</p>
           </div>
        ) : (
          tasks.slice().reverse().map((task: any) => (
            <motion.div 
              layout
              key={task.id} 
              className={`p-10 rounded-[50px] border shadow-2xl shadow-slate-200/50 relative overflow-hidden group transition-all transform hover:-translate-y-2 ${task.status === 'Completed' ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-white border-slate-100 italic'}`}
            >
               <div className="flex justify-between items-start mb-6">
                  <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${task.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                     {task.status === 'Completed' ? 'تم الإنجاز' : 'قيد التنفيذ'}
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                     <button onClick={() => toggleStatus(task.id)} className={`p-3 rounded-2xl transition-all ${task.status === 'Completed' ? 'bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'}`} title={task.status === 'Completed' ? 'إعادة المهمة' : 'تم الإنجاز'}><Icon name={task.status === 'Completed' ? 'rotate-ccw' : 'check'} size={18} /></button>
                     <button onClick={() => { setEditingTask(task); setFormData({...task}); setShowModal(true); }} className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all"><Icon name="edit" size={18} /></button>
                     <button onClick={() => deleteTask(task.id)} className="p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all"><Icon name="trash-2" size={18} /></button>
                  </div>
               </div>

               <h3 className={`text-2xl font-black text-slate-800 mb-3 tracking-tighter ${task.status === 'Completed' ? 'line-through' : ''}`}>{task.title}</h3>
               <p className="text-slate-500 font-bold text-sm mb-6 line-clamp-2">{task.description}</p>

               <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-black">
                     <span className="text-slate-400 uppercase tracking-wider">المسؤول:</span>
                     <span className="text-indigo-600">{task.empName}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-black">
                     <span className="text-slate-400 uppercase tracking-wider">الموعد النهائي:</span>
                     <span className={`${new Date(task.deadline) < new Date() && task.status !== 'Completed' ? 'text-rose-500' : 'text-slate-700'}`}>{task.deadline}</span>
                  </div>
               </div>

               <div className={`mt-8 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden`}>
                  <div className={`h-full transition-all duration-1000 ${task.status === 'Completed' ? 'w-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'w-1/3 bg-amber-500'}`}></div>
               </div>
            </motion.div>
          ))
        )}
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
                     <h3 className="text-3xl font-black text-slate-800 tracking-tighter italic">بروتوكول إسناد المهام</h3>
                     <button onClick={() => setShowModal(false)} className="w-14 h-14 bg-slate-50 rounded-2xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all"><Icon name="x" size={28} /></button>
                  </div>

                  <form onSubmit={handleSave} className="p-12 space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-4">عنوان المهمة</label>
                        <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-[25px] p-6 font-black text-slate-800 outline-none focus:border-indigo-500 transition-all" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="ما الذي يجب إنجازه؟" />
                     </div>

                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-4">إسناد إلى الموظف</label>
                           <select required className="w-full bg-slate-50 border-2 border-slate-100 rounded-[25px] p-6 font-black text-slate-800 outline-none focus:border-indigo-500 transition-all" value={formData.empId} onChange={e => setFormData({...formData, empId: e.target.value})}>
                              <option value="">اختر الموظف...</option>
                              {employees.map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-4">الموعد النهائي</label>
                           <input type="date" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-[25px] p-6 font-black text-slate-800 outline-none focus:border-indigo-500 transition-all" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-4">وصف المهمة والمتطلبات</label>
                        <textarea className="w-full bg-slate-50 border-2 border-slate-100 rounded-[35px] p-8 font-black text-slate-800 outline-none focus:border-indigo-500 transition-all h-32" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="تفاصيل إضافية للمهمة..." />
                     </div>

                     <button type="submit" className="w-full bg-slate-900 text-white p-7 rounded-[35px] font-black shadow-3xl hover:bg-amber-600 hover:scale-[1.02] transition-all flex items-center justify-center gap-4 text-xl tracking-tighter uppercase italic mt-6 underline-offset-8">
                        تثبيت المهمة بالنظام <Icon name="flag" size={24} />
                     </button>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}
