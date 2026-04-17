import React, { useState } from 'react';
import { Icon } from './ui/Icon';
import { motion, AnimatePresence } from 'motion/react';

interface LoansProps {
  employees: any[];
  loans: any[];
  setLoans: React.Dispatch<React.SetStateAction<any[]>>;
  showToast: (msg: string, type?: any) => void;
  askConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export default function Loans({ employees, loans, setLoans, showToast, askConfirm }: LoansProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    empId: '',
    amount: '',
    installments: '3',
    reason: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleAddLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.empId || !formData.amount) return;

    const emp = employees.find(e => e.id === formData.empId);
    const newLoan = {
      id: Math.random().toString(36).substr(2, 9),
      empName: emp.name,
      empId: emp.id,
      amount: parseFloat(formData.amount),
      installments: parseInt(formData.installments),
      paid: 0,
      reason: formData.reason,
      date: formData.date,
      status: 'pending'
    };

    setLoans([...loans, newLoan]);
    setShowAddModal(false);
    showToast("تم تسجيل طلب السلفة بنجاح");
  };

  const approveLoan = (id: string) => {
    setLoans(loans.map(l => l.id === id ? { ...l, status: 'approved' } : l));
    showToast("تمت الموافقة على السلفة");
  };

   const deleteLoan = (id: string) => {
    askConfirm('حذف السلفة؟', 'هل أنت متأكد من حذف هذا السجل بشكل نهائي؟', () => {
      setLoans(loans.filter(l => l.id !== id));
      showToast("تم حذف السجل", "error");
    });
  };

  return (
    <div className="space-y-10 animate-fade-in relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print px-4">
        <div className="flex items-center gap-5">
           <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-[35px] flex items-center justify-center shadow-lg transform rotate-6 hover:rotate-0 transition-transform duration-500">
              <Icon name="hand-coins" size={40} />
           </div>
           <div>
              <h2 className="text-4xl font-black text-slate-800 tracking-tighter">الحسابات الجارية والسلف</h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] italic">نظام تتبع القروض والخصم التلقائي</p>
           </div>
        </div>
        <button 
           onClick={() => setShowAddModal(true)}
           className="bg-slate-900 text-white px-10 py-5 rounded-[30px] font-black shadow-2xl hover:bg-amber-600 hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
        >
           <Icon name="plus" size={24} />
           طلب سلفة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 no-print">
         {[
           { label: 'إجمالي السلف النشطة', value: loans.length, color: 'text-indigo-600', bg: 'bg-indigo-50', icon: 'activity' },
           { label: 'إجمالي المبالغ المعلقة', value: `${loans.reduce((acc, l) => acc + (l.status === 'pending' ? l.amount : 0), 0).toLocaleString()} ج.م`, color: 'text-amber-600', bg: 'bg-amber-50', icon: 'pause-circle' },
           { label: 'المبالغ المعتمدة', value: `${loans.reduce((acc, l) => acc + (l.status === 'approved' ? l.amount : 0), 0).toLocaleString()} ج.م`, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: 'circle-check' },
           { label: 'تم تحصيله هذا الشهر', value: '45,200 ج.م', color: 'text-blue-600', bg: 'bg-blue-50', icon: 'trending-up' }
         ].map((stat, i) => (
           <div key={i} className={`${stat.bg} p-8 rounded-[40px] border border-white space-y-4 shadow-sm`}>
             <div className="flex justify-between items-start">
               <div className={`p-4 bg-white rounded-[20px] shadow-sm ${stat.color}`}><Icon name={stat.icon} size={24} /></div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Live Status</span>
             </div>
             <div>
               <p className="text-sm font-black text-slate-500">{stat.label}</p>
               <h3 className={`text-2xl font-black ${stat.color}`}>{stat.value}</h3>
             </div>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-[50px] shadow-3xl overflow-hidden border border-slate-100 mx-4">
         <div className="overflow-x-auto">
            <table className="w-full text-center">
               <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b">
                  <tr>
                     <th className="px-10 py-8 text-right">الموظف</th>
                     <th className="px-8 py-8">المبلغ الإجمالي</th>
                     <th className="px-8 py-8">عدد الأقساط</th>
                     <th className="px-8 py-8">الهدف / السبب</th>
                     <th className="px-8 py-8">الحالة</th>
                     <th className="px-10 py-8">العمليات</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {loans.length === 0 ? (
                    <tr>
                       <td colSpan={6} className="py-20 text-slate-300 font-black italic">لا يوجد طلبات سلف حالياً</td>
                    </tr>
                  ) : (
                    loans.map(loan => (
                      <tr key={loan.id} className="hover:bg-slate-50 transition-all font-bold group text-sm">
                         <td className="px-10 py-6 text-right flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black italic">#</div>
                            <div>
                               <p className="text-slate-800 font-black">{loan.empName}</p>
                               <p className="text-[10px] text-slate-400 uppercase italic">ID: {loan.empId?.slice(0, 8)}</p>
                            </div>
                         </td>
                         <td className="px-8 py-6 font-black text-lg text-slate-900">{loan.amount.toLocaleString()} ج.م</td>
                         <td className="px-8 py-6 text-xs text-slate-500">
                            <span className="px-4 py-2 bg-slate-100 rounded-xl">{loan.installments} شهور</span>
                         </td>
                         <td className="px-8 py-6 text-slate-500 italic text-xs">{loan.reason}</td>
                         <td className="px-8 py-6">
                            <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${loan.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                               {loan.status === 'approved' ? 'معتمدة' : 'قيد الانتظار'}
                            </span>
                         </td>
                         <td className="px-10 py-6">
                            <div className="flex items-center gap-2 justify-center">
                               {loan.status === 'pending' && (
                                  <button 
                                    onClick={() => approveLoan(loan.id)}
                                    className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-black text-[10px] hover:bg-slate-900 transition-all shadow-xl"
                                  >
                                     اعتماد
                                  </button>
                               )}
                               <button onClick={() => deleteLoan(loan.id)} className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><Icon name="trash-2" size={16} /></button>
                            </div>
                         </td>
                      </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-white w-full max-w-xl rounded-[50px] shadow-3xl overflow-hidden"
            >
               <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tighter">طلب سلفة وذمة مالية</h3>
                    <p className="text-sm font-bold text-slate-400">يرجى استيفاء البيانات المالية المطلوبة بعناية</p>
                  </div>
                  <button onClick={() => setShowAddModal(false)} className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all"><Icon name="x" size={24} /></button>
               </div>
               
               <form onSubmit={handleAddLoan} className="p-10 space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">الموظف المقترض</label>
                     <select 
                        required
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-[25px] p-5 font-black text-slate-800 outline-none focus:border-amber-500 transition-all"
                        value={formData.empId}
                        onChange={e => setFormData({ ...formData, empId: e.target.value })}
                     >
                        <option value="">-- اختر الموظف --</option>
                        {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                     </select>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">المبلغ المطلوب (ج.م)</label>
                        <input 
                           type="number" required
                           className="w-full bg-slate-50 border-2 border-slate-100 rounded-[25px] p-5 font-black text-slate-800 outline-none focus:border-amber-500 transition-all"
                           placeholder="0.00"
                           value={formData.amount}
                           onChange={e => setFormData({ ...formData, amount: e.target.value })}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">مدة القسط (شهور)</label>
                        <select 
                           className="w-full bg-slate-50 border-2 border-slate-100 rounded-[25px] p-5 font-black text-slate-800 outline-none focus:border-amber-500 transition-all"
                           value={formData.installments}
                           onChange={e => setFormData({ ...formData, installments: e.target.value })}
                        >
                           <option value="3">3 شهور</option>
                           <option value="6">6 شهور</option>
                           <option value="12">12 شهر (سنة)</option>
                           <option value="24">24 شهر (سنتين)</option>
                        </select>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">سبب السلفة</label>
                     <textarea 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-[25px] p-5 font-black text-slate-800 outline-none focus:border-amber-500 transition-all h-32"
                        placeholder="اكتب سبب السلفة هنا للتثبت من الاستحقاق..."
                        value={formData.reason}
                        onChange={e => setFormData({ ...formData, reason: e.target.value })}
                     ></textarea>
                  </div>

                  <button type="submit" className="w-full bg-slate-900 text-white p-6 rounded-[30px] font-black shadow-2xl hover:bg-amber-600 hover:scale-[1.02] active:scale-[0.98] transition-all mt-6 uppercase tracking-widest italic">
                     إرسال للتحقق والاعتماد
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
