import React, { useState, useMemo, useRef } from 'react';
import { Icon } from './Icon';
import * as XLSX from 'xlsx';
import { WarningModal } from './WarningModal';

interface EmployeeTableProps {
    employees: any[];
    onAddEmployee: (data: any) => void;
    onUpdateEmployee: (data: any) => void;
    onDeleteEmployee: (id: string) => void;
    onBulkAdd: (list: any[]) => void;
    setActiveTab: (tab: string) => void;
    shifts: any;
}

export const EmployeeTable = React.memo(({ employees, onAddEmployee, onUpdateEmployee, onDeleteEmployee, onBulkAdd, setActiveTab, shifts }: EmployeeTableProps) => {
    const [showModal, setShowModal] = useState(false);
    const [editingEmp, setEditingEmp] = useState<any>(null);
    const [warningEmp, setWarningEmp] = useState<any>(null);
    const [selectedDept, setSelectedDept] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({ name: '', code: '', joinDate: '', department: '', jobTitle: '', nationalId: '', phone: '', address: '', shift: (Object.values(shifts)[0] as any)?.name || '' });
    
    const departmentsList = useMemo(() => ['all', ...new Set(employees.map(e => e.department).filter(Boolean))], [employees]);
    
    const filteredEmployees = useMemo(() => {
        let filtered = selectedDept === 'all' ? employees : employees.filter(e => e.department === selectedDept);
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(e => 
                e.name.toLowerCase().includes(q) || 
                e.code.toString().includes(q)
            );
        }
        return filtered;
    }, [employees, selectedDept, searchQuery]);

    const normalizeText = (t: any) => t ? t.toString().trim().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/\s+/g, ' ') : "";

    const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => { 
        const file = e.target.files?.[0]; 
        if (!file) return; 
        const reader = new FileReader(); 
        reader.onload = (evt: any) => { 
            const bstr = evt.target.result; 
            const wb = XLSX.read(bstr, { type: 'binary', cellDates: true }); 
            const ws = wb.Sheets[wb.SheetNames[0]]; 
            const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 }); 
            if (rows.length < 2) return alert("الملف فارغ تماماً."); 
            
            let headerIdx = 0;
            for (let i = 0; i < Math.min(rows.length, 10); i++) {
                const rowStr = rows[i].map(c => normalizeText(c)).join(' ');
                if (rowStr.includes('اسم') || rowStr.includes('كود')) {
                    headerIdx = i;
                    break;
                }
            }

            const headers = rows[headerIdx].map(h => normalizeText(h)); 
            const f = (k: string[], df: number) => { 
                const idx = headers.findIndex(h => k.some(ki => h.includes(normalizeText(ki)))); 
                return idx !== -1 ? idx : df; 
            }; 
            const m = { 
                code: f(['كود', 'بصمه'], 1), 
                joinDate: f(['تاريخ', 'تعيين'], 2), 
                name: f(['اسم'], 3), 
                department: f(['قسم', 'اداره'], 4), 
                jobTitle: f(['مسمي'], 5), 
                nationalId: f(['قومي'], 6), 
                phone: f(['هاتف'], 7), 
                address: f(['عنوان'], 8), 
                shift: f(['ورديه', 'شفت'], 9) 
            }; 
            const res = rows.slice(headerIdx + 1).map(r => {
                let joinDate = '';
                const rawDate = r[m.joinDate];
                if (rawDate instanceof Date) {
                    joinDate = rawDate.toISOString().split('T')[0];
                } else if (rawDate) {
                    const d = new Date(rawDate);
                    if (!isNaN(d.getTime())) {
                        joinDate = d.toISOString().split('T')[0];
                    } else {
                        joinDate = rawDate.toString();
                    }
                }
                return { 
                    id: Math.random().toString(36).substr(2, 9), 
                    code: r[m.code]?.toString() || '', 
                    joinDate: joinDate, 
                    name: r[m.name]?.toString() || '', 
                    department: r[m.department]?.toString() || '', 
                    jobTitle: r[m.jobTitle]?.toString() || '', 
                    nationalId: r[m.nationalId]?.toString() || '', 
                    phone: r[m.phone]?.toString() || '', 
                    address: r[m.address]?.toString() || '', 
                    shift: r[m.shift]?.toString() || (Object.values(shifts)[0] as any)?.name || '', 
                    status: 'نشط', 
                    totalLeaves: 21, 
                    monthlyLeaves: Array(12).fill(0) 
                };
            }).filter(emp => {
                if (!emp.name || !emp.code) return false;
                const n = normalizeText(emp.name);
                const c = normalizeText(emp.code);
                if (n.includes('اسم') || n.includes('كامل') || n.includes('موظف')) return false;
                if (c.includes('كود') || c.includes('بصمه') || c.includes('رقم')) return false;
                if (n.includes('تاريخ') || n.includes('تعيين')) return false;
                return true;
            }); 
            if (res.length) { 
                onBulkAdd(res); 
                alert(`تم استيراد بيانات ${res.length} موظف بنجاح.`); 
            } 
        }; 
        reader.readAsBinaryString(file); 
        e.target.value = ''; 
    };

    const handleSubmit = (e: React.FormEvent) => { 
        e.preventDefault(); 
        editingEmp ? onUpdateEmployee({ ...formData, id: editingEmp.id }) : onAddEmployee(formData); 
        setShowModal(false); 
    };

    return (
        <div className={`animate-fade-in employee-list-container ${warningEmp ? 'print:space-y-0 print:m-0 print:p-0' : 'space-y-10 pt-8 pb-10'}`}>
            <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${warningEmp ? 'print:hidden' : ''}`}>
                <div className="space-y-2">
                    <h2 className="text-4xl font-black text-slate-800">قائمة الموظفين</h2>
                    <p className="text-slate-500 font-bold text-lg">إدارة بيانات الكادر البشري في النظام</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative">
                        <Icon name="search" size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="بحث بالاسم أو الكود..." 
                            className="bg-white border border-slate-100 rounded-full py-3 pr-12 pl-6 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all w-64 shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Icon name="filter" size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="pr-12 pl-6 py-3 rounded-full border border-slate-100 font-bold focus:outline-none bg-white text-slate-700 appearance-none cursor-pointer shadow-sm text-sm">
                            <option value="all">كافة الأقسام</option>
                            {departmentsList.filter(d => d !== 'all').map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx, .xls" onChange={handleExcelUpload} />
                    <button onClick={() => fileInputRef.current?.click()} className="px-8 py-3.5 rounded-full font-black flex items-center gap-3 shadow-lg bg-emerald-50 text-emerald-700 border border-emerald-100 no-print hover:bg-emerald-100 transition-all">
                        <Icon name="file-spreadsheet" size={22} /> استيراد Excel
                    </button>
                    <button onClick={() => { setEditingEmp(null); setFormData({ name: '', code: '', joinDate: '', department: '', jobTitle: '', nationalId: '', phone: '', address: '', shift: (Object.values(shifts)[0] as any)?.name || '' }); setShowModal(true); }} className="bg-indigo-600 text-white px-10 py-3.5 rounded-full font-black flex items-center gap-3 shadow-lg hover:bg-indigo-700 transition-all no-print">
                        <Icon name="plus" size={22} /> إضافة موظف جديد
                    </button>
                </div>
            </div>
            <div className={`rounded-[40px] shadow-xl overflow-hidden border bg-white border-slate-100 ${warningEmp ? 'print:hidden' : ''}`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-[11px] font-black uppercase tracking-wider border-b border-slate-100">
                            <tr>
                                <th className="px-4 py-5">م</th>
                                <th className="px-4 py-5">الكود</th>
                                <th className="px-4 py-5">تاريخ التعيين</th>
                                <th className="px-6 py-5">الاسم الكامل</th>
                                <th className="px-4 py-5">الإدارة</th>
                                <th className="px-4 py-5">المسمى الوظيفي</th>
                                <th className="px-4 py-5">الوردية</th>
                                <th className="px-6 py-5">الرقم القومي</th>
                                <th className="px-4 py-5 text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredEmployees.length ? filteredEmployees.map((emp, index) => (
                                <tr key={emp.id} className="hover:bg-indigo-500/5 transition-colors group">
                                    <td className="px-4 py-4 font-bold text-slate-500">{index + 1}</td>
                                    <td className="px-4 py-4 font-mono font-black text-indigo-500">{emp.code}</td>
                                    <td className="px-4 py-4 text-xs font-bold text-slate-500">{emp.joinDate}</td>
                                    <td className="px-6 py-4 font-black text-base text-slate-800">{emp.name}</td>
                                    <td className="px-4 py-4 text-sm font-bold text-slate-500">{emp.department}</td>
                                    <td className="px-4 py-4 text-sm font-bold text-slate-500">{emp.jobTitle}</td>
                                    <td className="px-4 py-4 text-[10px] font-bold text-indigo-600">{emp.shift || '---'}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{emp.nationalId}</td>
                                    <td className="px-4 py-4 text-center">
                                        <div className="flex justify-center items-center gap-2">
                                            <button onClick={() => setWarningEmp(emp)} className="p-2 rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-500 transition-all hover:text-white" title="إنذار / ملاحظة">
                                                <Icon name="alert-triangle" size={16} />
                                            </button>
                                            <button onClick={() => { setEditingEmp(emp); setFormData({ ...emp }); setShowModal(true); }} className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 transition-all hover:text-white">
                                                <Icon name="edit" size={16} />
                                            </button>
                                            <button onClick={() => { if(confirm('حذف الموظف؟')) onDeleteEmployee(emp.id); }} className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 transition-all hover:text-white">
                                                <Icon name="trash-2" size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={9} className="px-6 py-10 text-center text-slate-400 font-bold italic">لا توجد بيانات حالياً</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-4xl p-10 rounded-[40px] shadow-2xl animate-fade-in border bg-white border-slate-200">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-3xl font-black text-slate-800">{editingEmp ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}</h3>
                            <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-all"><Icon name="x" size={32} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-black text-slate-500 uppercase px-4">الاسم الكامل</label>
                                <input required type="text" className="w-full px-6 py-3.5 rounded-full border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 transition-all" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-black text-slate-500 uppercase px-4">الكود الوظيفي</label>
                                <input required type="text" className="w-full px-6 py-3.5 rounded-full border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 transition-all" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-black text-slate-500 uppercase px-4">تاريخ التعيين</label>
                                <input required type="date" className="w-full px-6 py-3.5 rounded-full border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 transition-all" value={formData.joinDate} onChange={(e) => setFormData({...formData, joinDate: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-black text-slate-500 uppercase px-4">الإدارة</label>
                                <input required type="text" className="w-full px-6 py-3.5 rounded-full border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 transition-all" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-black text-slate-500 uppercase px-4">المسمى الوظيفي</label>
                                <input required type="text" className="w-full px-6 py-3.5 rounded-full border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 transition-all" value={formData.jobTitle} onChange={(e) => setFormData({...formData, jobTitle: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-black text-slate-500 uppercase px-4">الرقم القومي</label>
                                <input required type="text" pattern="\\d{14}" title="يجب إدخال 14 رقم" className="w-full px-6 py-3.5 rounded-full border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 transition-all" value={formData.nationalId} onChange={(e) => setFormData({...formData, nationalId: e.target.value.replace(/\D/g, '')})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-black text-slate-500 uppercase px-4">رقم الهاتف</label>
                                <input required type="tel" pattern="01[0125]\\d{8}" title="يجب إدخال رقم هاتف مصري صحيح" className="w-full px-6 py-3.5 rounded-full border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 transition-all" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/[^\d+]/g, '')})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-black text-slate-500 uppercase px-4">الوردية</label>
                                <select required className="w-full px-6 py-3.5 rounded-full border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none" value={formData.shift} onChange={(e) => setFormData({...formData, shift: e.target.value})}>
                                    {Object.values(shifts).map((s: any) => <option key={s.id} value={s.name}>{s.name}</option>)}
                                </select>
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-xs font-black text-slate-500 uppercase px-4">العنوان السكني</label>
                                <input required type="text" className="w-full px-6 py-3.5 rounded-full border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 transition-all" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                            </div>
                            <div className="md:col-span-3 pt-6">
                                <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-full text-xl shadow-xl hover:bg-indigo-700 transition-all">حفظ البيانات</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {warningEmp && <WarningModal emp={warningEmp} onClose={() => setWarningEmp(null)} />}
        </div>
    );
});
