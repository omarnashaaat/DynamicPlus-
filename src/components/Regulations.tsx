import React, { useState } from 'react';
import { Icon } from './Icon';

interface RegulationsProps {
    regulations: any;
    setRegulations: React.Dispatch<React.SetStateAction<any>>;
}

export const Regulations = React.memo(({ regulations, setRegulations }: RegulationsProps) => {
    const [activeSubTab, setActiveSubTab] = useState('late');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [newItem, setNewItem] = useState({ title: '', deduction: 0 });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const updated = { ...regulations };
        if (editingItem) {
            updated[activeSubTab] = updated[activeSubTab].map((item: any) => item.id === editingItem.id ? { ...item, ...newItem } : item);
        } else {
            updated[activeSubTab] = [...updated[activeSubTab], { ...newItem, id: Date.now().toString() }];
        }
        setRegulations(updated);
        setShowModal(false);
        setEditingItem(null);
        setNewItem({ title: '', deduction: 0 });
    };

    const deleteItem = (id: string) => {
        const updated = { ...regulations };
        updated[activeSubTab] = updated[activeSubTab].filter((item: any) => item.id !== id);
        setRegulations(updated);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/50 p-4 rounded-[40px] border border-white shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-100">
                        <Icon name="list-checks" size={20} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tighter">لوائح العمل والجزاءات</h1>
                </div>
                
                <div className="flex bg-slate-100 p-1 rounded-full">
                    {[
                        { id: 'late', label: 'لائحة التأخير' },
                        { id: 'absence', label: 'لائحة الغياب' },
                        { id: 'disciplinary', label: 'لائحة الجزاءات' }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveSubTab(tab.id)}
                            className={`px-6 py-2 rounded-full font-black transition-all text-xs ${activeSubTab === tab.id ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <button 
                    onClick={() => { setEditingItem(null); setNewItem({ title: '', deduction: 0 }); setShowModal(true); }}
                    className="bg-amber-500 text-white px-6 py-2.5 rounded-full font-black flex items-center gap-2 shadow-lg hover:bg-amber-600 transition-all"
                >
                    <Icon name="plus" size={18} /> إضافة بند جديد
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(regulations[activeSubTab] || []).map((item: any) => (
                    <div key={item.id} className="bg-white p-6 rounded-[30px] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                                <Icon name="alert-triangle" size={24} />
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setEditingItem(item); setNewItem(item); setShowModal(true); }} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"><Icon name="edit-3" size={16} /></button>
                                <button onClick={() => deleteItem(item.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Icon name="trash-2" size={16} /></button>
                            </div>
                        </div>
                        <h3 className="text-lg font-black text-slate-800 mb-1">{item.title}</h3>
                        <p className="text-amber-600 font-black text-xl">{item.deduction} <span className="text-xs">يوم خصم</span></p>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-fade-in border border-slate-200">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-xl font-black text-slate-800">{editingItem ? 'تعديل بند' : 'إضافة بند جديد'}</h3>
                            <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors"><Icon name="x" size={20} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase px-4">وصف البند</label>
                                <input required type="text" className="w-full px-6 py-3.5 rounded-full border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800 focus:ring-2 focus:ring-amber-500/20 transition-all" value={newItem.title} onChange={(e) => setNewItem({...newItem, title: e.target.value})} placeholder="مثال: تأخير ساعة" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase px-4">قيمة الخصم (بالأيام)</label>
                                <input required type="number" step="0.25" className="w-full px-6 py-3.5 rounded-full border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800 focus:ring-2 focus:ring-amber-500/20 transition-all text-center" value={newItem.deduction} onChange={(e) => setNewItem({...newItem, deduction: parseFloat(e.target.value)})} />
                            </div>
                            <button type="submit" className="w-full bg-amber-500 text-white font-black py-4 rounded-full shadow-lg hover:bg-amber-600 transition-all">حفظ البند</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
});
