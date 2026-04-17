import React, { useState } from 'react';
import { Icon } from './ui/Icon';
import { motion } from 'motion/react';

interface LoansProps {
  employees: any[];
  loans: any[];
  setLoans: (val: any) => void;
  showToast: (msg: string, type?: any) => void;
  askConfirm: (title: string, msg: string, onConfirm: () => void) => void;
}

export default function Loans({ employees, loans, setLoans, showToast, askConfirm }: LoansProps) {
  const [formData, setFormData] = useState({ empId: '', amount: '', date: new Date().toISOString().split('T')[0], reason: '', months: '1' });

  const handleAddLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.empId || !formData.amount) return;

    const emp = employees.find(e => e.id === formData.empId);
    const newLoan = {
      id: Date.now().toString(),
      empId: formData.empId,
      empName: emp?.name || 'غير معروف',
      amount: parseFloat(formData.amount),
      date: formData.date,
      reason: formData.reason,
      months: parseInt(formData.months),
      paid: 0,
      status: 'active'
    };

    setLoans([...loans, newLoan]);
    setFormData({ empId: '', amount: '', date: new Date().toISOString().split('T')[0], reason: '', months: '1' });
    showToast('تم تسجيل السلفة بنجاح');
  };

  const handleDeleteLoan = (id: string) => {
    askConfirm('حذف السلفة', 'هل أنت متأكد من حذف هذه السلفة؟', () => {
      setLoans(loans.filter(l => l.id !== id));
      showToast('تم حذف السلفة', 'warning');
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-8 rounded-[40px] border shadow-sm border-slate-100">
        <div className="flex items-center gap-4 mb-8">
           <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
              <Icon name="hand-coins" size={24} />
           </div>
           <div>
              <h2 className="text-2xl font-black text-slate-800">إدارة السلف والقروض</h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">تسجيل وجدولة سلف الموظفين</p>
           </div>
        </div>

        <form onSubmit={handleAddLoan} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase mr-2">الموظف</label>
            <select 
              required
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-slate-700 font-bold focus:ring-4 focus:ring-amber-500/5 outline-none transition-all"
              value={formData.empId}
              onChange={e => setFormData({...formData, empId: e.target.value})}
            >
              <option value="">اختر الموظف</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.code})</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase mr-2">المبلغ</label>
            <input 
              required
              type="number"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-slate-700 font-bold focus:ring-4 focus:ring-amber-500/5 outline-none transition-all"
              placeholder="0.00"
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase mr-2">عدد الشهور</label>
            <input 
              type="number"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-slate-700 font-bold focus:ring-4 focus:ring-amber-500/5 outline-none transition-all"
              value={formData.months}
              onChange={e => setFormData({...formData, months: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase mr-2">التاريخ</label>
            <input 
              type="date"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-slate-700 font-bold focus:ring-4 focus:ring-amber-500/5 outline-none transition-all"
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white font-black py-3.5 rounded-2xl shadow-lg hover:bg-amber-600 transition-all flex items-center justify-center gap-2">
            <Icon name="plus" size={18} /> تسجيل السلفة
          </button>
        </form>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">الموظف</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">المبلغ الإجمالي</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">القسط الشهري</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">التاريخ</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">الحالة</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loans.length === 0 ? (
               <tr>
                 <td colSpan={6} className="p-20 text-center text-slate-300 font-bold">لا توجد سلف مسجلة حالياً</td>
               </tr>
            ) : loans.map(loan => (
              <tr key={loan.id} className="hover:bg-slate-50 transition-colors group">
                <td className="p-6 font-black text-slate-700">{loan.empName}</td>
                <td className="p-6 font-black text-slate-900">{loan.amount.toLocaleString()} ج.م</td>
                <td className="p-6 font-bold text-slate-500">{(loan.amount / loan.months).toFixed(2)} ج.م / {loan.months} شهر</td>
                <td className="p-6 font-bold text-slate-500">{loan.date}</td>
                <td className="p-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${loan.status === 'active' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {loan.status === 'active' ? 'قيد السداد' : 'منتهية'}
                  </span>
                </td>
                <td className="p-6">
                  <button onClick={() => handleDeleteLoan(loan.id)} className="w-10 h-10 flex items-center justify-center text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                    <Icon name="trash-2" size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
