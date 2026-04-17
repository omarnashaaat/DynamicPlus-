import React, { useState } from 'react';
import { Icon } from './ui/Icon';

interface ArchiveProps {
  employees: any[];
  showToast: (msg: string, type?: any) => void;
}

export default function Archive({ employees, showToast }: ArchiveProps) {
  const [view, setView] = useState('folders');
  const [docsState, setDocsState] = useState<any>(() => {
    try {
      return JSON.parse(localStorage.getItem('hr_archive_matrix') || '{}');
    } catch (e) {
      console.error('Error reading hr_archive_matrix from localStorage', e);
      return {};
    }
  });
  const [searchQuery, setSearchQuery] = useState('');

  const docHeaders = ["صورة البطاقة", "إقرار استلام العمل", "أصل المؤهل الدراسي", "أصل شهادة الميلاد", "الكشف الطبي (111)", "صحيفة الحالة الجنائية", "الموقف من التجنيد", "الصور الشخصية (6)", "كعب العمل", "أصل العقد الموقع", "استمارة س1"];

  const toggleDoc = (empId: string, docIdx: number) => {
    const key = `${empId}-${docIdx}`;
    const newState = { ...docsState, [key]: !docsState[key] };
    setDocsState(newState);
    try {
      localStorage.setItem('hr_archive_matrix', JSON.stringify(newState));
    } catch (e) {
      console.error('Error saving hr_archive_matrix to localStorage', e);
    }
  };

  if (view === 'folders') {
    return (
      <div className="space-y-10 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black text-slate-800">الأرشيف الرقمي</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">إدارة الوثائق والملفات الرسمية</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <button onClick={() => setView('hiring_matrix')} className="group p-8 rounded-[50px] border-2 transition-all flex flex-col items-center text-center bg-white border-slate-100 hover:border-amber-400">
            <div className="bg-amber-600 p-6 rounded-[30px] text-white shadow-xl mb-6 group-hover:scale-110 transition-transform">
              <Icon name="folder-open" size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-800">مسوغات التعيين</h3>
            <p className="text-slate-400 text-[10px] font-bold mt-2 uppercase">اضغط لعرض المصفوفة</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <button onClick={() => setView('folders')} className="flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600 transition-colors">
          <Icon name="arrow-right" size={20} /> العودة للمجلدات
        </button>
        <div className="relative">
          <Icon name="search" size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="بحث..." className="bg-white border rounded-2xl py-2 pr-10 pl-4 text-xs font-bold outline-none" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>

      <div className="rounded-[30px] shadow-2xl overflow-hidden border bg-white border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead className="bg-slate-50 text-slate-700 text-[9px] font-black uppercase">
              <tr>
                <th className="px-4 py-6 border-b border-l sticky right-0 bg-slate-50 z-10 text-right min-w-[150px]">الموظف</th>
                {docHeaders.map((h, i) => (
                  <th key={i} className="p-2 border-b border-l min-w-[80px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {employees.filter(e => e.name.includes(searchQuery)).map(emp => (
                <tr key={emp.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="px-4 py-4 border-l font-black text-right sticky right-0 bg-inherit z-10">
                    <p className="text-slate-800 text-xs">{emp.name}</p>
                    <p className="text-[9px] text-slate-400 font-mono">{emp.code}</p>
                  </td>
                  {docHeaders.map((_, i) => {
                    const key = `${emp.id}-${i}`;
                    const checked = docsState[key];
                    return (
                      <td key={i} onClick={() => toggleDoc(emp.id, i)} className={`px-1 py-4 border-l cursor-pointer transition-all ${checked ? 'bg-emerald-50' : ''}`}>
                        <div className="flex justify-center items-center">
                          {checked ? <Icon name="circle-check" size={20} className="text-emerald-500" /> : <div className="w-5 h-5 rounded border-2 border-slate-100 opacity-20"></div>}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
