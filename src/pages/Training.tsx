import React, { useState } from 'react';
import { Icon } from '../components/Layout';

export const Training = ({ employees }: any) => {
    const [trainings, setTrainings] = useState<any[]>(() => {
        const saved = localStorage.getItem('trainings');
        return saved ? JSON.parse(saved) : [
            { id: '1', title: 'دورة السلامة والصحة المهنية', date: '2026-04-15', status: 'قادم', attendees: 12 },
            { id: '2', title: 'مهارات التواصل الفعال', date: '2026-03-10', status: 'مكتمل', attendees: 8 },
            { id: '3', title: 'إدارة الوقت والإنتاجية', date: '2026-05-20', status: 'قادم', attendees: 15 },
        ];
    });

    const [showAddModal, setShowAddModal] = useState(false);
    const [newTraining, setNewTraining] = useState({ title: '', date: '', attendees: 0 });

    const addTraining = () => {
        if (!newTraining.title || !newTraining.date) return;
        const updated = [...trainings, { ...newTraining, id: Date.now().toString(), status: 'قادم' }];
        setTrainings(updated);
        localStorage.setItem('trainings', JSON.stringify(updated));
        setShowAddModal(false);
        setNewTraining({ title: '', date: '', attendees: 0 });
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-800">تدريبات الموظفين</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">تطوير مهارات الكادر البشري</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg hover:bg-indigo-700 transition-all no-print"
                >
                    <Icon name="plus" size={20} /> إضافة دورة تدريبية
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainings.map(training => (
                    <div key={training.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl ${training.status === 'مكتمل' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                <Icon name="book-open" size={24} />
                            </div>
                            <span className={`px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest ${
                                training.status === 'مكتمل' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                                {training.status}
                            </span>
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-2">{training.title}</h3>
                        <div className="flex items-center gap-4 text-slate-400 font-bold text-sm mb-6">
                            <div className="flex items-center gap-1">
                                <Icon name="calendar" size={14} /> {training.date}
                            </div>
                            <div className="flex items-center gap-1">
                                <Icon name="users" size={14} /> {training.attendees} متدرب
                            </div>
                        </div>
                        <button className="w-full py-3 rounded-2xl border-2 border-slate-100 font-black text-slate-400 group-hover:border-indigo-600 group-hover:text-indigo-600 transition-all">
                            عرض التفاصيل
                        </button>
                    </div>
                ))}
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-scale-in">
                        <h3 className="text-2xl font-black text-slate-800 mb-8">إضافة دورة جديدة</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">عنوان الدورة</label>
                                <input 
                                    type="text" 
                                    value={newTraining.title}
                                    onChange={(e) => setNewTraining({...newTraining, title: e.target.value})}
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-black text-slate-800 focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">تاريخ الانعقاد</label>
                                <input 
                                    type="date" 
                                    value={newTraining.date}
                                    onChange={(e) => setNewTraining({...newTraining, date: e.target.value})}
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-black text-slate-800 focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">عدد المتدربين</label>
                                <input 
                                    type="number" 
                                    value={newTraining.attendees}
                                    onChange={(e) => setNewTraining({...newTraining, attendees: parseInt(e.target.value) || 0})}
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-black text-slate-800 focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button 
                                    onClick={addTraining}
                                    className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                                >
                                    حفظ الدورة
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
