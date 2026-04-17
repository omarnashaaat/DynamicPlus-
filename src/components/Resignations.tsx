import React, { useState } from 'react';
import { Icon } from './ui/Icon';

interface ResignationsProps {
  employees: any[];
  resignations: any[];
  setResignations: React.Dispatch<React.SetStateAction<any[]>>;
  setEmployees: React.Dispatch<React.SetStateAction<any[]>>;
  showToast: (msg: string, type?: any) => void;
}

export default function Resignations({ employees, resignations, setResignations, setEmployees, showToast }: ResignationsProps) {
  const [showModal, setShowModal] = useState(false);
  const [newRes, setNewRes] = useState({ empId: '', date: '', reason: '', type: 'استقالة' });

  const addResignation = () => {
    const emp = employees.find(e => e.id === newRes.empId);
    const updated = [...resignations, { ...newRes, id: Date.now(), empName: emp?.name }];
    setResignations(updated);
    try {
      localStorage.setItem('hr_resignations', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving hr_resignations to localStorage', e);
    }
    setShowModal(false);
    showToast('تم تسجيل طلب الاستقالة');
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-800">إدارة الاستقالات</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">إجراءات إنهاء الخدمة</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-rose-600 text-white px-6 py-3 rounded-2xl font-black text-xs hover:bg-rose-700 transition-all flex items-center gap-2">
          <Icon name="user-minus" size={16} /> تسجيل استقالة
        </button>
      </div>

      <div className="rounded-[40px] shadow-2xl overflow-hidden border bg-white border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-rose-50 text-rose-700 text-[11px] font-black uppercase border-b">
              <tr>
                <th className="px-6 py-6">الموظف</th>
                <th className="px-6 py-6">النوع</th>
                <th className="px-6 py-6">التاريخ</th>
                <th className="px-6 py-6">السبب</th>
                <th className="px-6 py-6 text-center">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {resignations.map((res: any) => (
                <tr key={res.id} className="hover:bg-rose-50/20 transition-colors">
                  <td className="px-6 py-5 font-black text-slate-800">{res.empName}</td>
                  <td className="px-6 py-5 text-xs font-bold text-slate-500">{res.type}</td>
                  <td className="px-6 py-5 text-xs font-bold text-slate-500">{res.date}</td>
                  <td className="px-6 py-5 text-xs text-slate-400">{res.reason}</td>
                  <td className="px-6 py-5 text-center">
                    <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-[10px] font-black">قيد المراجعة</span>
                  </td>
                </tr>
              ))}
              {resignations.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-300 font-black">لا توجد طلبات استقالة مسجلة</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] p-8 w-full max-w-md shadow-2xl animate-scale-in">
            <h3 className="text-2xl font-black text-slate-800 mb-6">تسجيل استقالة جديدة</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">الموظف</label>
                <select className="w-full bg-slate-50 border rounded-2xl p-4 text-sm font-bold outline-none" value={newRes.empId} onChange={e => setNewRes({...newRes, empId: e.target.value})}>
                  <option value="">اختر الموظف...</option>
                  {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">التاريخ</label>
                <input type="date" className="w-full bg-slate-50 border rounded-2xl p-4 text-sm font-bold outline-none" value={newRes.date} onChange={e => setNewRes({...newRes, date: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">السبب</label>
                <textarea className="w-full bg-slate-50 border rounded-2xl p-4 text-sm font-bold outline-none h-24" value={newRes.reason} onChange={e => setNewRes({...newRes, reason: e.target.value})}></textarea>
              </div>
              <div className="flex gap-4 mt-8">
                <button onClick={addResignation} className="flex-1 bg-rose-600 text-white py-4 rounded-2xl font-black text-xs hover:bg-rose-700 transition-all">تسجيل</button>
                <button onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black text-xs hover:bg-slate-200 transition-all">إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
