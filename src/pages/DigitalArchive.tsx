import React, { useState } from 'react';
import { Icon } from '../components/Layout';

export const DigitalArchive = ({ employees }: any) => {
    const [selectedEmployee, setSelectedEmployee] = useState<string>('');
    const [documents, setDocuments] = useState<any>(() => {
        const saved = localStorage.getItem('digital_archive');
        return saved ? JSON.parse(saved) : {};
    });

    const docTypes = [
        { id: 'id_card', name: 'بطاقة الرقم القومي', icon: 'shield-check' },
        { id: 'birth_cert', name: 'شهادة الميلاد', icon: 'file-text' },
        { id: 'edu_cert', name: 'المؤهل الدراسي', icon: 'graduation-cap' },
        { id: 'military', name: 'الموقف من التجنيد', icon: 'shield-x' },
        { id: 'criminal', name: 'فيش وتشبيه', icon: 'alert-circle' },
        { id: 'medical', name: 'شهادة صحية', icon: 'activity' },
    ];

    const handleFileUpload = (empId: string, docType: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // In a real app, we would upload to a server. 
        // Here we'll just store the file name and a fake URL for demo.
        const newDocs = {
            ...documents,
            [empId]: {
                ...(documents[empId] || {}),
                [docType]: {
                    name: file.name,
                    date: new Date().toISOString().split('T')[0],
                    url: '#'
                }
            }
        };
        setDocuments(newDocs);
        localStorage.setItem('digital_archive', JSON.stringify(newDocs));
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-800">الأرشيف الرقمي</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">إدارة الوثائق والمستندات الممسوحة ضوئياً</p>
                </div>
                <div className="flex items-center gap-3 no-print">
                    <select 
                        value={selectedEmployee}
                        onChange={(e) => setSelectedEmployee(e.target.value)}
                        className="bg-white border-none rounded-2xl px-6 py-3 font-black text-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">اختر موظفاً لعرض ملفاته</option>
                        {employees.map((e: any) => (
                            <option key={e.id} value={e.id}>{e.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedEmployee ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {docTypes.map(type => {
                        const doc = documents[selectedEmployee]?.[type.id];
                        return (
                            <div key={type.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-4 rounded-2xl ${doc ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                        <Icon name={type.icon as any} size={24} />
                                    </div>
                                    {doc && <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">موجود</span>}
                                </div>
                                <h3 className="text-lg font-black text-slate-800 mb-1">{type.name}</h3>
                                {doc ? (
                                    <div className="space-y-4">
                                        <p className="text-xs text-slate-400 font-bold truncate">{doc.name}</p>
                                        <div className="flex gap-2">
                                            <button className="flex-1 py-2 rounded-xl bg-indigo-50 text-indigo-600 font-black text-xs hover:bg-indigo-100 transition-all">عرض</button>
                                            <button className="flex-1 py-2 rounded-xl bg-slate-50 text-slate-400 font-black text-xs hover:bg-rose-50 hover:text-rose-600 transition-all">حذف</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-4">
                                        <label className="cursor-pointer block w-full py-3 rounded-2xl border-2 border-dashed border-slate-100 text-slate-300 font-black text-xs text-center hover:border-indigo-200 hover:text-indigo-400 transition-all">
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                onChange={(e) => handleFileUpload(selectedEmployee, type.id, e)}
                                            />
                                            رفع المستند
                                        </label>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white p-20 rounded-[50px] text-center border border-dashed border-slate-200">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon name="folder-open" size={40} className="text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">اختر موظفاً</h3>
                    <p className="text-slate-400 font-bold max-w-md mx-auto">قم باختيار موظف من القائمة أعلاه لعرض أو رفع المستندات والوثائق الخاصة به في الأرشيف الرقمي.</p>
                </div>
            )}
        </div>
    );
};
