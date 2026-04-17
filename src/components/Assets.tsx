import React, { useState } from 'react';
import { Icon } from './ui/Icon';

export default function Assets({ assets, setAssets, employees, showToast, askConfirm }: any) {
  const [formData, setFormData] = useState({ name: '', code: '', employeeId: '', category: 'Laptop', status: 'Good' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((x: any) => x.id === formData.employeeId);
    setAssets([...assets, { ...formData, id: Date.now().toString(), employeeName: emp?.name || 'مخزن' }]);
    setFormData({ name: '', code: '', employeeId: '', category: 'Laptop', status: 'Good' });
    showToast('تم إضافة العهدة بنجاح');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[40px] border shadow-sm">
        <h2 className="text-2xl font-black mb-6">إدارة العهد والأصول</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <input className="p-3 bg-slate-50 rounded-2xl border outline-none" placeholder="اسم الجهاز" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input className="p-3 bg-slate-50 rounded-2xl border outline-none" placeholder="السيريال / الكود" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
          <select className="p-3 bg-slate-50 rounded-2xl border outline-none" value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})}>
            <option value="">بالمخزن</option>
            {employees.map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
          <button className="bg-slate-900 text-white p-3 rounded-2xl font-black">إضافة عهدة</button>
        </form>
      </div>

      <div className="bg-white rounded-[40px] border overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4">الجهاز</th>
              <th className="p-4">الكود</th>
              <th className="p-4">المستلم</th>
              <th className="p-4">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((a: any) => (
              <tr key={a.id} className="border-b">
                <td className="p-4 font-bold">{a.name}</td>
                <td className="p-4">{a.code}</td>
                <td className="p-4 text-indigo-600 font-bold">{a.employeeName}</td>
                <td className="p-4">{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
