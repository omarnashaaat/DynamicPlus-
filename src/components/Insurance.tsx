import React, { useState, useMemo } from 'react';
import { Icon } from './Icon';
import html2pdf from 'html2pdf.js';

interface InsuranceProps {
    employees: any[];
    insuranceRecords: any;
    setInsuranceRecords: React.Dispatch<React.SetStateAction<any>>;
}

export const Insurance = React.memo(({ employees, insuranceRecords, setInsuranceRecords }: InsuranceProps) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [searchQuery, setSearchQuery] = useState('');

    const startEditing = (emp: any) => {
        const record = insuranceRecords[emp.id] || {
            status: 'غير مؤمن عليه',
            insuranceNumber: '',
            startDate: '',
            insuranceSalary: '',
            insuranceOffice: '',
            ratioCompany: '18.75',
            ratioEmployee: '11'
        };
        
        // Pre-calculate amounts if salary exists but amounts don't
        if (record.insuranceSalary && (!record.companyAmount || !record.employeeAmount)) {
            const salary = parseFloat(record.insuranceSalary) || 0;
            record.companyAmount = (salary * 0.1875).toFixed(2);
            record.employeeAmount = (salary * 0.11).toFixed(2);
        }
        
        setFormData(record);
        setEditingId(emp.id);
    };

    const saveRecord = (empId: string) => {
        setInsuranceRecords((prev: any) => ({ ...prev, [empId]: formData }));
        setEditingId(null);
    };

    const stats = useMemo(() => {
        const vals = Object.values(insuranceRecords) as any[];
        return {
            insured: vals.filter(v => v.status === 'مؤمن عليه').length,
            notInsured: employees.length - vals.filter(v => v.status === 'مؤمن عليه' || v.status === 'جاري التنفيذ').length,
            processing: vals.filter(v => v.status === 'جاري التنفيذ').length
        };
    }, [insuranceRecords, employees]);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-800">التأمينات الاجتماعية</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">إدارة ملفات التأمين وحصص المساهمة</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Icon name="search" size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="بحث بالاسم أو الكود..." 
                            className="bg-white border border-slate-100 rounded-2xl py-2 pr-10 pl-4 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all w-48 md:w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => {
                            const element = document.querySelector('.insurance-container') as HTMLElement;
                            const opt = {
                                margin: 10,
                                filename: `insurance.pdf`,
                                image: { type: 'jpeg' as const, quality: 0.98 },
                                html2canvas: { scale: 2, useCORS: true },
                                jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'landscape' as const }
                            };
                            html2pdf().set(opt).from(element).save();
                        }}
                        className="bg-slate-800 text-white px-6 py-2.5 rounded-2xl font-black flex items-center gap-2 shadow-lg hover:bg-slate-900 transition-all no-print"
                    >
                        <Icon name="download" size={18} /> تنزيل PDF
                    </button>
                    <button 
                        onClick={() => window.print()}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-black flex items-center gap-2 shadow-lg hover:bg-blue-700 transition-all no-print"
                    >
                        <Icon name="printer" size={18} /> طباعة
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 insurance-container">
                <div className="bg-emerald-500 p-8 rounded-[40px] text-white shadow-xl shadow-emerald-200">
                    <Icon name="shield-check" size={32} className="mb-4 opacity-50" />
                    <h4 className="text-sm font-black uppercase tracking-widest">مؤمن عليه</h4>
                    <p className="text-5xl font-black">{stats.insured}</p>
                </div>
                <div className="bg-rose-500 p-8 rounded-[40px] text-white shadow-xl shadow-rose-200">
                    <Icon name="shield-x" size={32} className="mb-4 opacity-50" />
                    <h4 className="text-sm font-black uppercase tracking-widest">غير مؤمن عليه</h4>
                    <p className="text-5xl font-black">{stats.notInsured}</p>
                </div>
                <div className="bg-amber-500 p-8 rounded-[40px] text-white shadow-xl shadow-amber-200">
                    <Icon name="clock" size={32} className="mb-4 opacity-50" />
                    <h4 className="text-sm font-black uppercase tracking-widest">جاري التنفيذ</h4>
                    <p className="text-5xl font-black">{stats.processing}</p>
                </div>
            </div>
            <div className="rounded-[40px] shadow-2xl overflow-hidden border bg-white border-slate-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-[11px] font-black uppercase tracking-wider border-b border-slate-100">
                            <tr>
                                <th className="px-4 py-5">الكود</th>
                                <th className="px-6 py-5">الاسم</th>
                                <th className="px-4 py-5">الحالة</th>
                                <th className="px-4 py-5">الرقم التأميني</th>
                                <th className="px-4 py-5">تاريخ الاشتراك</th>
                                <th className="px-4 py-5">الأجر التأميني</th>
                                <th className="px-4 py-5">مكتب التأمينات</th>
                                <th className="px-4 py-5 text-center">النسبة (شركة/موظف)</th>
                                <th className="px-4 py-5 text-center no-print">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {employees
                                .filter(emp => emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || emp.code.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map(emp => {
                                const record = insuranceRecords[emp.id] || { status: 'غير مؤمن عليه' };
                                const isEditing = editingId === emp.id;
                                return (
                                    <tr key={emp.id} className="hover:bg-sky-500/5 transition-colors group">
                                        <td className="px-4 py-4 font-mono font-black text-sky-600">{emp.code}</td>
                                        <td className="px-6 py-4 font-black text-slate-800">{emp.name}</td>
                                        <td className="px-4 py-4">
                                            {isEditing ? (
                                                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="bg-white border p-1 rounded font-bold text-xs">
                                                    <option value="مؤمن عليه">مؤمن عليه</option>
                                                    <option value="غير مؤمن عليه">غير مؤمن عليه</option>
                                                    <option value="جاري التنفيذ">جاري التنفيذ</option>
                                                </select>
                                            ) : (
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                                                    record.status === 'مؤمن عليه' ? 'bg-emerald-100 text-emerald-600' :
                                                    record.status === 'جاري التنفيذ' ? 'bg-amber-100 text-amber-600' :
                                                    'bg-rose-100 text-rose-600'
                                                }`}>{record.status}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">{isEditing ? <input type="text" className="w-24 p-1 border rounded text-xs font-mono" value={formData.insuranceNumber} onChange={e => setFormData({...formData, insuranceNumber: e.target.value})} /> : <span className="font-mono text-xs text-slate-500">{record.insuranceNumber || '---'}</span>}</td>
                                        <td className="px-4 py-4">{isEditing ? <input type="date" className="w-32 p-1 border rounded text-xs" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} /> : <span className="font-mono text-[10px] text-slate-400">{record.startDate || '---'}</span>}</td>
                                        <td className="px-4 py-4">{isEditing ? <input type="number" className="w-20 p-1 border rounded text-xs font-bold" value={formData.insuranceSalary} onChange={e => {
                                            const val = e.target.value;
                                            const salary = parseFloat(val) || 0;
                                            setFormData({
                                                ...formData, 
                                                insuranceSalary: val,
                                                companyAmount: (salary * 0.1875).toFixed(2),
                                                employeeAmount: (salary * 0.11).toFixed(2)
                                            });
                                        }} /> : <span className="font-bold text-sky-700">{record.insuranceSalary ? `${record.insuranceSalary} ج.م` : '---'}</span>}</td>
                                        <td className="px-4 py-4">{isEditing ? <input type="text" className="w-28 p-1 border rounded text-xs" value={formData.insuranceOffice} onChange={e => setFormData({...formData, insuranceOffice: e.target.value})} /> : <span className="text-xs text-slate-500">{record.insuranceOffice || '---'}</span>}</td>
                                        <td className="px-4 py-4 text-center">
                                            {isEditing ? (
                                                <div className="flex flex-col items-center gap-1">
                                                    <div className="flex items-center gap-1 justify-center">
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-[8px] text-slate-400">شركة (18.75%)</span>
                                                            <input type="text" readOnly className="w-16 p-1 border rounded text-[10px] bg-slate-50 text-center font-bold" value={formData.companyAmount || '0.00'} />
                                                        </div>
                                                        <span className="text-slate-300 mt-3">/</span>
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-[8px] text-slate-400">موظف (11%)</span>
                                                            <input type="text" readOnly className="w-16 p-1 border rounded text-[10px] bg-slate-50 text-center font-bold" value={formData.employeeAmount || '0.00'} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[10px] font-bold text-slate-600">
                                                        {record.companyAmount || '0.00'} / {record.employeeAmount || '0.00'}
                                                    </span>
                                                    <span className="text-[8px] text-slate-400">حصة الشركة / حصة الموظف</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-center no-print">
                                            {isEditing ? (
                                                <button onClick={() => saveRecord(emp.id)} className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                                                    <Icon name="check" size={14} />
                                                </button>
                                            ) : (
                                                <button onClick={() => startEditing(emp)} className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-sky-500 hover:text-white transition-all">
                                                    <Icon name="edit" size={14} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
});
