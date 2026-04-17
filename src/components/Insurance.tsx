import React, { useState, useMemo } from 'react';
import { Icon } from './ui/Icon';
import { motion, AnimatePresence } from 'motion/react';

export default function Insurance({ employees, insuranceRecords, setInsuranceRecords, showToast, askConfirm }: any) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRefS1 = React.useRef<HTMLInputElement>(null);
  const fileInputRefS6 = React.useRef<HTMLInputElement>(null);
  const [activeUploadEmp, setActiveUploadEmp] = useState<string | null>(null);

  const stats = useMemo(() => {
    const vals = employees.map(emp => insuranceRecords[emp.id] || { status: 'غير مؤمن عليه' });
    const insuredCount = vals.filter(v => v.status === 'مؤمن عليه').length;
    return {
      total: employees.length,
      insured: insuredCount,
      notInsured: employees.length - insuredCount,
      percentage: employees.length > 0 ? Math.round((insuredCount / employees.length) * 100) : 0
    };
  }, [insuranceRecords, employees]);

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

  const saveRecord = (empId: string) => {
    setInsuranceRecords((prev: any) => ({ ...prev, [empId]: formData }));
    setEditingId(null);
    showToast('تم تحديث بيانات التأمين بنجاح');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 's1' | 's6') => {
    const file = e.target.files?.[0];
    if (file && activeUploadEmp) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('حجم الملف كبير جداً (الأقصى 2 ميجابايت)', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
         const updatedRecord = { ...(insuranceRecords[activeUploadEmp] || { status: 'غير مؤمن عليه' }) };
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

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 animate-fade-in px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic">التأمينات الاجتماعية <span className="text-indigo-600">Insurance</span></h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1 italic">إدارة الملفات التأمينية والامتثال القانوني</p>
        </div>
        
        <div className="relative w-full md:w-96 group">
          <Icon name="search" size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text" 
            placeholder="البحث بالاسم أو كود الموظف..." 
            className="w-full bg-white border-2 border-slate-100 rounded-[25px] py-5 pr-14 pl-6 font-black text-slate-800 outline-none focus:border-indigo-500 transition-all shadow-sm"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">إجمالي الموظفين</span>
            <div className="flex items-end justify-between mt-4">
               <p className="text-5xl font-black text-slate-800 tracking-tighter">{stats.total}</p>
               <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-black"><Icon name="users" /></div>
            </div>
        </div>
        <div className="bg-emerald-500 p-8 rounded-[40px] text-white shadow-xl shadow-emerald-200/50 flex flex-col justify-between">
            <span className="text-[10px] font-black text-emerald-100 uppercase tracking-[0.2em] italic">مؤمن عليه</span>
            <div className="flex items-end justify-between mt-4">
               <p className="text-5xl font-black tracking-tighter">{stats.insured}</p>
               <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center font-black"><Icon name="shield-check" /></div>
            </div>
        </div>
        <div className="bg-rose-500 p-8 rounded-[40px] text-white shadow-xl shadow-rose-200/50 flex flex-col justify-between">
            <span className="text-[10px] font-black text-rose-100 uppercase tracking-[0.2em] italic">غير مؤمن عليه</span>
            <div className="flex items-end justify-between mt-4">
               <p className="text-5xl font-black tracking-tighter">{stats.notInsured}</p>
               <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center font-black"><Icon name="shield-alert" /></div>
            </div>
        </div>
        <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-xl shadow-slate-900/40 flex flex-col justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">نسبة التغطية</span>
            <div className="flex items-end justify-between mt-4">
               <p className="text-5xl font-black tracking-tighter">{stats.percentage}%</p>
               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400 font-black"><Icon name="activity" /></div>
            </div>
        </div>
      </div>

      <input type="file" ref={fileInputRefS1} className="hidden" accept=".pdf,.jpeg,.jpg,.png" onChange={e => handleFileUpload(e, 's1')} />
      <input type="file" ref={fileInputRefS6} className="hidden" accept=".pdf,.jpeg,.jpg,.png" onChange={e => handleFileUpload(e, 's6')} />

      <div className="bg-white border border-slate-100 rounded-[50px] shadow-3xl overflow-hidden mb-20 italic">
         <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse italic">
               <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-50 italic">
                     <th className="px-10 py-8">الموظف / الكود</th>
                     <th className="px-8 py-8">الحالة التأمينية</th>
                     <th className="px-8 py-8">الرقم التأميني</th>
                     <th className="px-8 py-8">الأجر التأميني</th>
                     <th className="px-8 py-8">المستندات (س1/س6)</th>
                     <th className="px-10 py-8 text-center">الإجراءات</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 italic text-sm">
                  {filteredEmployees.map(emp => {
                     const record = insuranceRecords[emp.id] || { status: 'غير مؤمن عليه', insuranceNumber: '', insuranceSalary: '', s1: null, s6: null };
                     const isEditing = editingId === emp.id;

                     return (
                        <motion.tr layout key={emp.id} className="hover:bg-slate-50/50 transition-colors group italic">
                           <td className="px-10 py-8 font-black">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all font-black">{emp.name.charAt(0)}</div>
                                 <div className="flex flex-col italic">
                                    <span className="text-slate-800 text-lg uppercase tracking-tighter">{emp.name}</span>
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mt-1">{emp.code}</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-8">
                              {isEditing ? (
                                 <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl font-black text-xs outline-none focus:border-indigo-500 transition-all w-full italic">
                                    <option value="مؤمن عليه">مؤمن عليه</option>
                                    <option value="غير مؤمن عليه">غير مؤمن عليه</option>
                                 </select>
                              ) : (
                                 <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm italic ${record.status === 'مؤمن عليه' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                    <div className={`w-2 h-2 rounded-full ${record.status === 'مؤمن عليه' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                                    {record.status}
                                 </div>
                              )}
                           </td>
                           <td className="px-8 py-8">
                               {isEditing ? (
                                  <input type="text" className="bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl font-black text-xs outline-none focus:border-indigo-500 transition-all italic w-32" value={formData.insuranceNumber} onChange={e => setFormData({...formData, insuranceNumber: e.target.value})} />
                               ) : (
                                  <span className="font-black text-slate-500 tracking-widest italic">{record.insuranceNumber || '—'}</span>
                               )}
                           </td>
                           <td className="px-8 py-8 font-black text-slate-800 italic">
                               {isEditing ? (
                                  <input type="number" className="bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl font-black text-xs outline-none focus:border-indigo-500 transition-all italic w-28" value={formData.insuranceSalary} onChange={e => setFormData({...formData, insuranceSalary: e.target.value})} />
                               ) : (
                                  record.insuranceSalary ? `${record.insuranceSalary} ج.م` : '—'
                               )}
                           </td>
                           <td className="px-8 py-8">
                              <div className="flex items-center gap-3">
                                 {record.s1 ? (
                                    <div className="flex items-center gap-1 group/btn">
                                       <a href={record.s1.data} download={record.s1.name} className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm" title={`تحميل س1: ${record.s1.name}`}><Icon name="download" size={16} /></a>
                                       <button onClick={() => { setActiveUploadEmp(emp.id); fileInputRefS1.current?.click(); }} className="w-8 h-8 bg-slate-50 text-slate-300 rounded-lg flex items-center justify-center opacity-0 group-hover/btn:opacity-100 transition-opacity"><Icon name="refresh-cw" size={12} /></button>
                                    </div>
                                 ) : (
                                    <button onClick={() => { setActiveUploadEmp(emp.id); fileInputRefS1.current?.click(); }} className="px-4 py-2 border-2 border-dashed border-slate-200 text-slate-400 rounded-xl font-black text-[10px] uppercase hover:border-indigo-500 hover:text-indigo-500 transition-all">رفع س1</button>
                                 )}

                                 {record.s6 ? (
                                    <div className="flex items-center gap-1 group/btn">
                                       <a href={record.s6.data} download={record.s6.name} className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm" title={`تحميل س6: ${record.s6.name}`}><Icon name="download" size={16} /></a>
                                       <button onClick={() => { setActiveUploadEmp(emp.id); fileInputRefS6.current?.click(); }} className="w-8 h-8 bg-slate-50 text-slate-300 rounded-lg flex items-center justify-center opacity-0 group-hover/btn:opacity-100 transition-opacity"><Icon name="refresh-cw" size={12} /></button>
                                    </div>
                                 ) : (
                                    <button onClick={() => { setActiveUploadEmp(emp.id); fileInputRefS6.current?.click(); }} className="px-4 py-2 border-2 border-dashed border-slate-200 text-slate-400 rounded-xl font-black text-[10px] uppercase hover:border-emerald-500 hover:text-emerald-500 transition-all">رفع س6</button>
                                 )}
                              </div>
                           </td>
                           <td className="px-10 py-8 text-center no-print">
                               {isEditing ? (
                                  <div className="flex items-center justify-center gap-2">
                                     <button onClick={() => saveRecord(emp.id)} className="w-12 h-12 bg-emerald-500 text-white rounded-2xl shadow-lg hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all outline-none"><Icon name="check" size={20} /></button>
                                     <button onClick={() => setEditingId(null)} className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl hover:bg-rose-50 hover:text-rose-500 shadow-sm transition-all"><Icon name="x" size={20} /></button>
                                  </div>
                               ) : (
                                  <button onClick={() => startEditing(emp)} className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white group-hover:shadow-2xl transition-all flex items-center justify-center mx-auto outline-none italic"><Icon name="edit" size={20} /></button>
                               )}
                           </td>
                        </motion.tr>
                     );
                  })}
               </tbody>
            </table>
         </div>
         {filteredEmployees.length === 0 && (
            <div className="py-20 flex flex-col items-center text-slate-300 italic">
               <Icon name="search-x" size={64} strokeWidth={1} />
               <p className="mt-4 font-black">لم نعثر على نتائج مطابقة لبحثك</p>
            </div>
         )}
      </div>
    </div>
  );
}
