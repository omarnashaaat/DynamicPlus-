import React, { useState } from 'react';
import { Icon } from '../components/Layout';

export const Resignations = ({ employees }: any) => {
    const [resignations, setResignations] = useState<any[]>(() => {
        const saved = localStorage.getItem('resignations');
        return saved ? JSON.parse(saved) : [
            { id: '1', empName: 'أحمد محمد علي', date: '2026-02-15', reason: 'ظروف خاصة', status: 'مكتمل' },
            { id: '2', empName: 'سارة أحمد محمود', date: '2026-03-20', reason: 'عرض عمل آخر', status: 'قيد المراجعة' },
        ];
    });

    const [showAddModal, setShowAddModal] = useState(false);
    const [newResignation, setNewResignation] = useState({ empId: '', date: '', reason: '' });

    const addResignation = () => {
        if (!newResignation.empId || !newResignation.date) return;
        const emp = employees.find((e: any) => e.id === newResignation.empId);
        const updated = [...resignations, { 
            ...newResignation, 
            id: Date.now().toString(), 
            empName: emp?.name || 'غير معروف',
            status: 'قيد المراجعة' 
        }];
        setResignations(updated);
        localStorage.setItem('resignations', JSON.stringify(updated));
        setShowAddModal(false);
        setNewResignation({ empId: '', date: '', reason: '' });
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-800">الاستقالات وإخلاء الطرف</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">إدارة إنهاء الخدمة والمخالصات</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-rose-600 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg hover:bg-rose-700 transition-all no-print"
                >
                    <Icon name="user-minus" size={20} /> تسجيل استقالة جديدة
                </button>
            </div>

            <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-8 py-4 font-black text-slate-400 text-xs uppercase tracking-widest">الموظف</th>
                                <th className="px-8 py-4 font-black text-slate-400 text-xs uppercase tracking-widest">تاريخ الاستقالة</th>
                                <th className="px-8 py-4 font-black text-slate-400 text-xs uppercase tracking-widest">السبب</th>
                                <th className="px-8 py-4 font-black text-slate-400 text-xs uppercase tracking-widest text-center">الحالة</th>
                                <th className="px-8 py-4 font-black text-slate-400 text-xs uppercase tracking-widest text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {resignations.map((res: any) => (
                                <tr key={res.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="font-black text-slate-800">{res.empName}</div>
                                    </td>
                                    <td className="px-8 py-5 font-bold text-slate-500">{res.date}</td>
                                    <td className="px-8 py-5 font-bold text-slate-500">{res.reason}</td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={`inline-block px-4 py-1.5 rounded-full font-black text-sm ${
                                            res.status === 'مكتمل' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                        }`}>
                                            {res.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <button className="text-indigo-600 hover:text-indigo-800 font-black text-xs uppercase tracking-widest">
                                            عرض المخالصة
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-scale-in">
                        <h3 className="text-2xl font-black text-slate-800 mb-8">تسجيل استقالة</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">الموظف</label>
                                <select 
                                    value={newResignation.empId}
                                    onChange={(e) => setNewResignation({...newResignation, empId: e.target.value})}
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-black text-slate-800 focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">اختر الموظف</option>
                                    {employees.map((e: any) => (
                                        <option key={e.id} value={e.id}>{e.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">تاريخ الاستقالة</label>
                                <input 
                                    type="date" 
                                    value={newResignation.date}
                                    onChange={(e) => setNewResignation({...newResignation, date: e.target.value})}
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-black text-slate-800 focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">سبب الاستقالة</label>
                                <textarea 
                                    value={newResignation.reason}
                                    onChange={(e) => setNewResignation({...newResignation, reason: e.target.value})}
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-600 min-h-[100px] focus:ring-2 focus:ring-indigo-500"
                                ></textarea>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button 
                                    onClick={addResignation}
                                    className="flex-1 bg-rose-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all"
                                >
                                    تسجيل الاستقالة
                                </button>
                                <button 
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black hover:bg-slate-200 transition-all"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
