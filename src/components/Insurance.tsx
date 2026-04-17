import React, { useState, useMemo } from 'react';
import { Icon } from './ui/Icon';

interface InsuranceProps {
  employees: any[];
  insuranceRecords: any;
  setInsuranceRecords: React.Dispatch<React.SetStateAction<any>>;
  showToast: (msg: string, type?: any) => void;
}

export default function Insurance({ employees, insuranceRecords, setInsuranceRecords, showToast }: InsuranceProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRefS1 = React.useRef<HTMLInputElement>(null);
  const fileInputRefS6 = React.useRef<HTMLInputElement>(null);
  const [activeUploadEmp, setActiveUploadEmp] = useState<string | null>(null);

  const startEditing = (emp: any) => {
    const record = insuranceRecords[emp.id] || {
      status: 'غير مؤمن عليه',
      insuranceNumber: '',
      startDate: '',
      insuranceSalary: '',
      insuranceOffice: '',
      ratioCompany: '18',
      ratioEmployee: '11',
      s1: null,
      s6: null
    };
    setFormData(record);
    setEditingId(emp.id);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 's1' | 's6') => {
    const file = e.target.files?.[0];
    if (file && activeUploadEmp) {
      const reader = new FileReader();
      reader.onload = (event) => {
         const updatedRecord = { ...(insuranceRecords[activeUploadEmp] || {}) };
         updatedRecord[type] = {
           name: file.name,
           data: event.target?.result
         };
         setInsuranceRecords((prev: any) => ({ ...prev, [activeUploadEmp]: updatedRecord }));
         showToast(`تم رفع نموذج ${type.toUpperCase()} بنجاح`);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveRecord = (empId: string) => {
    setInsuranceRecords((prev: any) => ({ ...prev, [empId]: formData }));
    setEditingId(null);
    showToast('تم تحديث بيانات التأمين');
  };

  const stats = useMemo(() => {
    const vals = Object.values(insuranceRecords) as any[];
    return {
      insured: vals.filter(v => v.status === 'مؤمن عليه').length,
      notInsured: employees.length - vals.filter(v => v.status === 'مؤمن عليه').length,
    };
  }, [insuranceRecords, employees]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800">التأمينات الاجتماعية</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">إدارة ملفات التأمين</p>
        </div>
        <div className="relative">
          <Icon name="search" size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="بحث..." className="bg-white border rounded-2xl py-2 pr-10 pl-4 text-xs font-bold outline-none" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-500 p-8 rounded-[40px] text-white shadow-xl">
          <h4 className="text-sm font-black uppercase tracking-widest opacity-60">مؤمن عليه</h4>
          <p className="text-5xl font-black">{stats.insured}</p>
        </div>
        <div className="bg-rose-500 p-8 rounded-[40px] text-white shadow-xl">
          <h4 className="text-sm font-black uppercase tracking-widest opacity-60">غير مؤمن عليه</h4>
          <p className="text-5xl font-black">{stats.notInsured}</p>
        </div>
      </div>

      <input type="file" ref={fileInputRefS1} className="hidden" accept=".pdf,.jpeg,.jpg,.png" onChange={e => handleFileUpload(e, 's1')} />
      <input type="file" ref={fileInputRefS6} className="hidden" accept=".pdf,.jpeg,.jpg,.png" onChange={e => handleFileUpload(e, 's6')} />

      <div className="rounded-[40px] shadow-2xl overflow-hidden border bg-white border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-[11px] font-black uppercase border-b">
              <tr>
                <th className="px-4 py-5">الموظف</th>
                <th className="px-4 py-5">الحالة</th>
                <th className="px-4 py-5">الرقم التأميني</th>
                <th className="px-4 py-5">الأجر التأميني</th>
                <th className="px-4 py-5">نموذج س1</th>
                <th className="px-4 py-5">نموذج س6</th>
                <th className="px-4 py-5 text-center no-print">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {employees.filter(e => e.name.includes(searchQuery)).map(emp => {
                const record = insuranceRecords[emp.id] || { status: 'غير مؤمن عليه', s1: null, s6: null };
                const isEditing = editingId === emp.id;
                return (
                  <tr key={emp.id} className="hover:bg-sky-50/30 transition-colors">
                    <td className="px-4 py-4 font-black text-slate-800">{emp.name}</td>
                    <td className="px-4 py-4">
                      {isEditing ? (
                        <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="bg-white border p-1 rounded font-bold text-xs">
                          <option value="مؤمن عليه">مؤمن عليه</option>
                          <option value="غير مؤمن عليه">غير مؤمن عليه</option>
                        </select>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${record.status === 'مؤمن عليه' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>{record.status}</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {isEditing ? <input type="text" className="w-24 p-1 border rounded text-xs" value={formData.insuranceNumber} onChange={e => setFormData({...formData, insuranceNumber: e.target.value})} /> : record.insuranceNumber || '---'}
                    </td>
                    <td className="px-4 py-4">
                      {isEditing ? <input type="number" className="w-20 p-1 border rounded text-xs" value={formData.insuranceSalary} onChange={e => setFormData({...formData, insuranceSalary: e.target.value})} /> : record.insuranceSalary || '---'}
                    </td>
                    <td className="px-4 py-4">
                      {record.s1 ? (
                        <a href={record.s1.data} download={record.s1.name} className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1 font-bold">
                          <Icon name="download" size={14} /> س1 ({record.s1.name})
                        </a>
                      ) : (
                        <button onClick={() => { setActiveUploadEmp(emp.id); fileInputRefS1.current?.click(); }} className="text-slate-400 hover:text-indigo-600 text-xs flex items-center gap-1 font-bold">
                          <Icon name="upload" size={14} /> رفع س1
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {record.s6 ? (
                        <a href={record.s6.data} download={record.s6.name} className="text-emerald-600 hover:text-emerald-800 text-xs flex items-center gap-1 font-bold">
                          <Icon name="download" size={14} /> س6 ({record.s6.name})
                        </a>
                      ) : (
                        <button onClick={() => { setActiveUploadEmp(emp.id); fileInputRefS6.current?.click(); }} className="text-slate-400 hover:text-indigo-600 text-xs flex items-center gap-1 font-bold">
                          <Icon name="upload" size={14} /> رفع س6
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center no-print">
                      {isEditing ? (
                        <button onClick={() => saveRecord(emp.id)} className="p-2 bg-emerald-500 text-white rounded-lg"><Icon name="check" size={14} /></button>
                      ) : (
                        <button onClick={() => startEditing(emp)} className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-sky-500 hover:text-white transition-all"><Icon name="edit" size={14} /></button>
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
}
