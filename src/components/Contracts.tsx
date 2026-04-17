import React, { useState } from 'react';
import { Icon } from './ui/Icon';

interface ContractsProps {
  employees: any[];
  contractRecords: any;
  setContractRecords: React.Dispatch<React.SetStateAction<any>>;
  showToast: (msg: string, type?: any) => void;
}

export default function Contracts({ employees, contractRecords, setContractRecords, showToast }: ContractsProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContract, setSelectedContract] = useState<any>(null);

  const startEditing = (emp: any) => {
    const record = contractRecords[emp.id] || {
      companyName: 'شركة عالم الـ HR للتجارة',
      branch: 'المركز الرئيسي',
      hiringEntity: 'عالم الـ HR',
      startDate: emp.joinDate || '',
      endDate: '',
      type: 'محدد المدة',
      salary: emp.salary || 0,
    };
    setFormData(record);
    setEditingId(emp.id);
  };

  const saveRecord = (empId: string) => {
    setContractRecords((prev: any) => ({ ...prev, [empId]: formData }));
    setEditingId(null);
    showToast('تم تحديث بيانات العقد');
  };

  const handlePrintContract = (emp: any) => {
    const record = contractRecords[emp.id];
    if (!record) {
      showToast('يرجى تعبئة بيانات العقد وحفظها أولاً', 'warning');
      return;
    }
    setSelectedContract({ emp, ...record });
    setTimeout(() => {
      window.print();
      setSelectedContract(null);
    }, 100);
  };

  return (
    <div className="space-y-8 animate-fade-in no-scrollbar">
      {/* Contract Preview for Printing */}
      {selectedContract && (
        <div className="hidden print:block fixed inset-0 bg-white z-[500] p-[20mm] font-['Cairo'] text-right" dir="rtl">
          <div className="border-[3px] border-black p-10 h-full flex flex-col">
            <div className="flex justify-between items-start border-b-2 border-black pb-8 mb-10">
               <div>
                  <h1 className="text-3xl font-black mb-2">عقد عمل فردي</h1>
                  <p className="font-bold">رقم العقد: {selectedContract.emp.code}</p>
               </div>
               <div className="text-left font-black">
                  <p>شركة عالم الـ HR</p>
                  <p>تاريخ العقد: {new Date().toLocaleDateString('ar-EG')}</p>
               </div>
            </div>

            <div className="space-y-8 flex-1">
               <p className="text-lg leading-relaxed font-bold">
                 إنه في يوم {new Date().toLocaleDateString('ar-EG', { weekday: 'long' })} الموافق {new Date().toLocaleDateString('ar-EG')} تحرر هذا العقد بين كل من:
               </p>
               
               <div className="space-y-4">
                  <p className="font-black border-r-4 border-black pr-4 py-2 bg-slate-50">طرف أول: {selectedContract.companyName}</p>
                  <p className="font-black border-r-4 border-black pr-4 py-2 bg-slate-50">طرف ثان: السيد/ {selectedContract.emp.name}</p>
               </div>

               <div className="space-y-6 mt-10 text-justify">
                  <h3 className="font-black text-xl underline underline-offset-8 decoration-2">البند الأول: موضوع العقد</h3>
                  <p className="font-bold leading-loose text-lg">
                    وافق الطرف الأول على تعيين الطرف الثاني لديه بوظيفة ({selectedContract.emp.position}) بإدارة ({selectedContract.emp.dept}) وذلك للقيام بكافة المهام الوظيفية الموكلة إليه بكفاءة وأمانة.
                  </p>

                  <h3 className="font-black text-xl underline underline-offset-8 decoration-2">البند الثاني: مدة العقد</h3>
                  <p className="font-bold leading-loose text-lg">
                    مدة هذا العقد ({selectedContract.type}) تبدأ من {selectedContract.startDate} {selectedContract.endDate ? `وتنتهي في ${selectedContract.endDate}` : ''}.
                  </p>

                  <h3 className="font-black text-xl underline underline-offset-8 decoration-2">البند الثالث: الأجر والبدلات</h3>
                  <p className="font-bold leading-loose text-lg">
                    يتقاضى الطرف الثاني بموجب هذا العقد راتباً شهرياً إجمالياً قدره ({selectedContract.salary} ج.م) فقط وقدره ثمانية آلاف جنيه مصري لا غير، شاملة كافة البدلات المتفق عليها.
                  </p>
               </div>
            </div>

            <div className="mt-20 grid grid-cols-2 gap-20 text-center">
               <div className="space-y-12">
                  <p className="font-black text-xl">توقيع الطرف الأول</p>
                  <div className="h-20 border-b-2 border-dashed border-black mx-auto w-48"></div>
               </div>
               <div className="space-y-12">
                  <p className="font-black text-xl">توقيع الطرف الثاني</p>
                  <div className="h-20 border-b-2 border-dashed border-black mx-auto w-48"></div>
               </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 no-print">
        <div>
          <h2 className="text-3xl font-black text-slate-800">إدارة عقود العمل</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">توثيق وطباعة عقود الموظفين</p>
        </div>
        <div className="relative w-full sm:w-auto">
          <Icon name="search" size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="بحث باسم الموظف..." className="w-full sm:w-80 bg-white border border-slate-200 rounded-[20px] py-3 pr-12 pl-6 text-sm font-black outline-none shadow-sm focus:ring-4 focus:ring-teal-500/5 transition-all" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>

      <div className="rounded-[40px] shadow-2xl overflow-hidden border bg-white border-slate-100 no-print">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-right border-collapse min-w-[800px]">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase border-b border-slate-100">
              <tr>
                <th className="px-8 py-6 tracking-widest">الموظف</th>
                <th className="px-8 py-6 tracking-widest">نوع العقد</th>
                <th className="px-8 py-6 tracking-widest">بداية العقد</th>
                <th className="px-8 py-6 tracking-widest">نهاية العقد</th>
                <th className="px-8 py-6 tracking-widest text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {employees.filter(e => e.name.includes(searchQuery)).length === 0 ? (
                <tr>
                   <td colSpan={5} className="p-20 text-center text-slate-300 font-black">لا توجد سجلات مطابقة للبحث</td>
                </tr>
              ) : employees.filter(e => e.name.includes(searchQuery)).map(emp => {
                const record = contractRecords[emp.id] || {};
                const isEditing = editingId === emp.id;

                return (
                  <tr key={emp.id} className="hover:bg-teal-50/20 transition-colors group">
                    <td className="px-8 py-5">
                       <div className="flex flex-col">
                          <span className="font-black text-slate-800 text-base">{emp.name}</span>
                          <span className="text-[10px] text-teal-600 font-black uppercase tracking-widest">{emp.dept}</span>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                      {isEditing ? (
                        <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="bg-slate-50 border border-slate-200 p-2 rounded-xl font-bold text-xs outline-none">
                          <option value="محدد المدة">محدد المدة</option>
                          <option value="غير محدد المدة">غير محدد المدة</option>
                          <option value="تحت الاختبار">تحت الاختبار</option>
                        </select>
                      ) : (
                        <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-wide">{record.type || 'محدد المدة'}</span>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      {isEditing ? <input type="date" className="p-2 border border-slate-200 rounded-xl text-xs bg-slate-50" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} /> : <span className="text-slate-500 font-bold">{record.startDate || emp.joinDate}</span>}
                    </td>
                    <td className="px-8 py-5">
                      {isEditing ? <input type="date" className="p-2 border border-slate-200 rounded-xl text-xs bg-slate-50" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} /> : <span className="text-slate-500 font-bold">{record.endDate || '---'}</span>}
                    </td>
                    <td className="px-8 py-5 text-center no-print">
                      <div className="flex items-center justify-center gap-3">
                        {isEditing ? (
                          <button onClick={() => saveRecord(emp.id)} className="w-10 h-10 flex items-center justify-center bg-teal-600 text-white rounded-xl shadow-lg hover:shadow-teal-500/20 transition-all"><Icon name="save" size={18} /></button>
                        ) : (
                          <>
                            <button onClick={() => startEditing(emp)} className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-400 rounded-xl hover:bg-teal-600 hover:text-white transition-all"><Icon name="edit-3" size={18} /></button>
                            <button onClick={() => handlePrintContract(emp)} className={`w-10 h-10 flex items-center justify-center text-white rounded-xl shadow-lg transition-all ${record.type ? 'bg-slate-900 hover:bg-indigo-600 shadow-indigo-500/10' : 'bg-slate-200 cursor-not-allowed'}`} title="طباعة العقد">
                              <Icon name="printer" size={18} />
                            </button>
                          </>
                        )}
                      </div>
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
