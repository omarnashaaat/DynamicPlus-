import React, { useState } from 'react';
import { Icon } from './ui/Icon';
import { motion, AnimatePresence } from 'motion/react';

interface DocCenterProps {
  employees: any[];
  showToast: (msg: string, type?: any) => void;
  issuedDocs: any[];
  setIssuedDocs: (val: any) => void;
  askConfirm: (title: string, msg: string, onConfirm: () => void) => void;
  docTypes: any[];
}

export default function DocCenter({ employees, showToast, issuedDocs, setIssuedDocs, askConfirm, docTypes }: DocCenterProps) {
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleGenerate = () => {
    if (!selectedEmpId) return showToast('يرجى اختيار الموظف أولاً', 'error');
    const emp = employees.find(e => e.id === selectedEmpId);
    
    const newRecord = {
      id: Date.now().toString(),
      empId: selectedEmpId,
      empName: emp?.name || 'غير معروف',
      docTitle: selectedDoc.title,
      type: selectedDoc.title,
      date: new Date().toISOString().split('T')[0],
      status: 'عتمد',
      notes: 'تم التوليد آلياً من النظام'
    };

    setIssuedDocs([newRecord, ...issuedDocs]);
    showToast(`تم توليد ${selectedDoc.title} وحفظه في السجلات`);
    setSelectedDoc(null);
    setSelectedEmpId('');
  };

  const deleteRecord = (id: string) => {
    askConfirm('حذف السجل؟', 'هل أنت متأكد من حذف سجل هذا المستند؟', () => {
      setIssuedDocs(issuedDocs.filter((r: any) => r.id !== id));
      showToast('تم حذف السجل بنجاح', 'error');
    });
  };

  // Dynamic docs list from props
  const docs = docTypes || [];

  return (
    <div className="space-y-12 animate-fade-in relative px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print">
        <div className="flex items-center gap-5">
           <div className="w-20 h-20 bg-sky-100 text-sky-600 rounded-[35px] flex items-center justify-center shadow-lg transform rotate-6 hover:rotate-0 transition-transform duration-500 border border-white">
              <Icon name="files" size={40} />
           </div>
           <div>
              <h2 className="text-4xl font-black text-slate-800 tracking-tighter">مركز النماذج والوثائق</h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] italic">مستودع الشهادات والنماذج القياسية للشركة</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 no-print">
         {docs.map((doc, i) => (
           <motion.button 
             key={i}
             whileHover={{ y: -10, rotate: 1 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => setSelectedDoc(doc)}
             className="bg-white p-10 rounded-[50px] shadow-3xl flex flex-col items-center text-center space-y-6 border border-slate-100 hover:border-sky-500/30 transition-all group"
           >
              <div className={`${doc.color} text-white p-6 rounded-[30px] shadow-2xl transition-all group-hover:scale-110 group-hover:rotate-6`}>
                 <Icon name={doc.icon} size={40} />
              </div>
              <div className="space-y-1">
                 <h3 className="text-xl font-black text-slate-800 tracking-tight">{doc.title}</h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{doc.sub}</p>
              </div>
              <div className="w-full h-px bg-slate-50 relative overflow-hidden">
                 <div className="absolute inset-0 bg-sky-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
              </div>
              <p className="text-xs font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">اكتشف النموذج الآن</p>
           </motion.button>
         ))}
      </div>

      <div className="bg-white rounded-[50px] shadow-2xl overflow-hidden border border-slate-100 no-print animate-slide-up">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/30">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg">
                 <Icon name="history" size={24} />
              </div>
              <h3 className="text-2xl font-black text-slate-800">سجل الوثائق الصادرة</h3>
           </div>
           
           <div className="relative w-full md:w-96">
              <Icon name="search" size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="بحث باسم الموظف أو نوع الوثيقة..." 
                className="w-full bg-white border-2 border-slate-100 rounded-3xl py-4 pr-14 pl-6 text-sm font-black text-slate-700 outline-none focus:border-indigo-500 transition-all shadow-sm"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-right border-collapse">
              <thead className="bg-slate-900 text-white">
                 <tr>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest border-l border-slate-800">الموظف</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest border-l border-slate-800">نوع الوثيقة</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest border-l border-slate-800">تاريخ الصدور</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest border-l border-slate-800">الحالة</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-center">العمليات</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {issuedDocs.filter(d => 
                   d.empName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                   d.docTitle.toLowerCase().includes(searchQuery.toLowerCase())
                 ).length === 0 ? (
                    <tr>
                       <td colSpan={5} className="p-20 text-center">
                          <div className="flex flex-col items-center gap-4 opacity-30">
                             <Icon name="file-question" size={64} />
                             <p className="text-xl font-black">لا توجد وثائق صادرة حالياً</p>
                          </div>
                       </td>
                    </tr>
                 ) : issuedDocs.filter(d => 
                   d.empName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                   d.docTitle.toLowerCase().includes(searchQuery.toLowerCase())
                 ).map(doc => (
                    <tr key={doc.id} className="hover:bg-slate-50 transition-colors group">
                       <td className="px-8 py-6">
                          <p className="font-black text-slate-800">{doc.empName}</p>
                          <p className="text-[10px] text-slate-400 font-bold">ID: {doc.empId.slice(0, 8)}</p>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                             <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                             <span className="font-black text-slate-700">{doc.docTitle}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6 font-bold text-slate-500">{doc.date}</td>
                       <td className="px-8 py-6">
                          <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black border border-emerald-100">
                             {doc.status}
                          </span>
                       </td>
                       <td className="px-8 py-6 text-center">
                          <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => window.print()} className="p-3 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:text-indigo-600 hover:border-indigo-500 transition-all shadow-sm">
                                <Icon name="printer" size={18} />
                             </button>
                             <button onClick={() => deleteRecord(doc.id)} className="p-3 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:text-rose-600 hover:border-rose-500 transition-all shadow-sm">
                                <Icon name="trash-2" size={18} />
                             </button>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>

      <AnimatePresence>
         {selectedDoc && (
           <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xl z-[200] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white w-full max-w-4xl rounded-[60px] shadow-3xl overflow-hidden"
              >
                 <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-5">
                       <div className={`${selectedDoc.color} text-white p-4 rounded-3xl shadow-lg`}>
                          <Icon name={selectedDoc.icon} size={32} />
                       </div>
                       <div>
                          <h3 className="text-2xl font-black text-slate-800">{selectedDoc.title}</h3>
                          <p className="text-sm font-bold text-slate-400 italic">Generate Professional Dynamic Form</p>
                       </div>
                    </div>
                    <button onClick={() => setSelectedDoc(null)} className="w-12 h-12 flex items-center justify-center bg-white shadow-xl rounded-2xl hover:text-rose-500 transition-all"><Icon name="x" size={24} /></button>
                 </div>

                  <div className="p-16 text-center space-y-10">
                    <div className="w-48 h-48 bg-slate-50 rounded-full mx-auto flex items-center justify-center border-4 border-dashed border-slate-200">
                       <Icon name="file-search" size={64} className="text-slate-300" />
                    </div>
                    
                    <div className="max-w-md mx-auto space-y-6">
                       <div className="space-y-2 text-right">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic pr-4">اختر الموظف المعني</label>
                          <select 
                             className="w-full bg-slate-50 border-2 border-slate-100 rounded-[25px] p-5 font-black text-slate-800 outline-none focus:border-sky-500 transition-all appearance-none"
                             value={selectedEmpId}
                             onChange={e => setSelectedEmpId(e.target.value)}
                          >
                             <option value="">-- اختر من القائمة --</option>
                             {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.code})</option>)}
                          </select>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-2xl font-black text-slate-800">توليد مستند</h4>
                       <p className="text-slate-500 font-bold max-w-md mx-auto leading-relaxed">سيقوم النظام بسحب بيانات الموظف المختار وتنسيقها في نموذج {selectedDoc.title} جاهز للطباعة والاعتماد.</p>
                    </div>

                    <div className="flex gap-6 justify-center pt-6">
                       <button onClick={handleGenerate} className="px-16 py-5 bg-slate-900 text-white rounded-[30px] font-black shadow-2xl hover:bg-sky-600 hover:scale-105 active:scale-95 transition-all flex items-center gap-4">
                          <Icon name="sparkles" size={20} />
                          توليد بصيغة PDF
                       </button>
                    </div>
                 </div>
              </motion.div>
           </div>
         )}
      </AnimatePresence>
    </div>
  );
}
