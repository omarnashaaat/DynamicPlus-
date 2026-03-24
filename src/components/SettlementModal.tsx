import React, { useState } from 'react';
import { Icon } from './Icon';

interface SettlementModalProps {
    emp: any;
    month: string;
    record: any;
    onSave: (data: any) => void;
    onClose: () => void;
}

export const SettlementModal = ({ emp, month, record, onSave, onClose }: SettlementModalProps) => {
    const [settlements, setSettlements] = useState(record.settlements || []);
    const [newSettlement, setNewSettlement] = useState({ type: 'addition', amount: '', reason: '' });

    const addSettlement = () => {
        if (!newSettlement.amount || !newSettlement.reason) return;
        setSettlements([...settlements, { ...newSettlement, id: Date.now(), date: new Date().toISOString() }]);
        setNewSettlement({ type: 'addition', amount: '', reason: '' });
    };

    const removeSettlement = (id: number) => {
        setSettlements(settlements.filter(s => s.id !== id));
    };

    const handleSave = () => {
        const adjAddition = settlements.filter(s => s.type === 'addition').reduce((acc, s) => acc + (parseFloat(s.amount) || 0), 0);
        const adjDeduction = settlements.filter(s => s.type === 'deduction').reduce((acc, s) => acc + (parseFloat(s.amount) || 0), 0);
        onSave({ settlements, adjAddition, adjDeduction });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
                <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-black flex items-center gap-2">
                            <Icon name="calculator" size={24} className="text-indigo-400" /> تسويات مالية للموظف
                        </h3>
                        <p className="text-slate-400 text-xs font-bold mt-1">{emp.name} - دورة {month}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <Icon name="x" size={24} />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">النوع</label>
                                <select 
                                    value={newSettlement.type}
                                    onChange={e => setNewSettlement({ ...newSettlement, type: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                                >
                                    <option value="addition">إضافة (+)</option>
                                    <option value="deduction">خصم (-)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">المبلغ</label>
                                <input 
                                    type="number"
                                    value={newSettlement.amount}
                                    onChange={e => setNewSettlement({ ...newSettlement, amount: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">السبب</label>
                                <input 
                                    type="text"
                                    value={newSettlement.reason}
                                    onChange={e => setNewSettlement({ ...newSettlement, reason: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    placeholder="مثال: مكافأة تميز"
                                />
                            </div>
                        </div>
                        <button 
                            onClick={addSettlement}
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-black text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                        >
                            <Icon name="plus" size={18} /> إضافة التسوية للقائمة
                        </button>
                    </div>

                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {settlements.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl">
                                <Icon name="list-todo" size={48} className="mx-auto text-slate-200 mb-3" />
                                <p className="text-slate-400 font-bold">لا توجد تسويات مسجلة لهذه الفترة</p>
                            </div>
                        ) : (
                            settlements.map((s: any) => (
                                <div key={s.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${s.type === 'addition' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                            <Icon name={s.type === 'addition' ? 'trending-up' : 'trending-down'} size={20} />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-800">{s.reason}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(s.date).toLocaleDateString('ar-EG')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-lg font-black ${s.type === 'addition' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {s.type === 'addition' ? '+' : '-'}{s.amount}
                                        </span>
                                        <button onClick={() => removeSettlement(s.id)} className="p-2 text-slate-300 hover:text-rose-600 transition-colors">
                                            <Icon name="trash-2" size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-black text-slate-500 hover:bg-slate-200 transition-all">إلغاء</button>
                    <button onClick={handleSave} className="px-8 py-2.5 bg-slate-900 text-white rounded-xl font-black shadow-lg hover:bg-slate-800 transition-all">حفظ التعديلات</button>
                </div>
            </div>
        </div>
    );
};
