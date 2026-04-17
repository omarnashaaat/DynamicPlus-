import React, { useState } from 'react';
import { Icon } from './ui/Icon';
import { motion, AnimatePresence } from 'motion/react';

export default function Contracts({ employees, contractRecords, setContractRecords, showToast, askConfirm }: any) {
  const [selectedEmp, setSelectedEmp] = useState<any>(null);
  const [contractType, setContractType] = useState('full-time');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);

  // Use contractRecords as a list if it's an array, otherwise fallback
  const archivedContracts = Array.isArray(contractRecords) ? contractRecords : [];

  const generateContract = () => {
    if (!selectedEmp) return;
    setIsGenerating(true);
    setTimeout(() => {
      const doc = `
        عقد عمل - ${contractType === 'full-time' ? 'دوام كامل' : 'فترة تدريب'}
        
        الطرف الأول: شركة عالم الموارد البشرية (HR WORLD)
        الطرف الثاني: السيد/ ${selectedEmp.name}
        
        البند الأول: الوظيفة
        يعمل الطرف الثاني لدى الطرف الأول بوظيفة (${selectedEmp.position}) بقسم (${selectedEmp.dept || selectedEmp.department}).
        
        البند الثاني: الراتب المالي
        يستحق الطرف الثاني راتباً شهرياً وقدره (${selectedEmp.salary}) ج.م.
        
        البند الثالث: تاريخ البدء
        يبدأ سريان هذا العقد اعتباراً من تاريخ ${new Date(selectedEmp.joinDate).toLocaleDateString('ar-EG')}.
        
        البند الرابع: المهام والمسؤوليات
        يلتزم الطرف الثاني بأداء كافة الأعمال الموكلة إليه طبقاً للوصف الوظيفي المعتمد من قبل الطرف الأول.
        
        تم تحرير هذا العقد من نسختين بيد كل طرف نسخة للعمل بمقتضاها.
        
        توقيع المدير العام: عمر نشأت
        توقيع الموظف: ${selectedEmp.name}
      `;
      
      const newRecord = {
        id: Date.now().toString(),
        empName: selectedEmp.name,
        type: contractType === 'full-time' ? 'دوام كامل' : 'فترة تدريب',
        date: new Date().toISOString().split('T')[0],
        content: doc
      };

      setContractRecords([...archivedContracts, newRecord]);
      setGeneratedDoc(doc);
      setIsGenerating(false);
      showToast("تم توليد العقد وأرشفته بنجاح");
    }, 1500);
  };

  const deleteContract = (id: string) => {
    askConfirm('حذف العقد المؤرشف؟', 'سيتم إزالة سجل هذا العقد تماماً من الأرشيف.', () => {
      setContractRecords(archivedContracts.filter((c: any) => c.id !== id));
      showToast('تم حذف السجل المكوب', 'error');
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-12 animate-fade-in relative px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print">
        <div className="flex items-center gap-5">
           <div className="w-20 h-20 bg-teal-100 text-teal-600 rounded-[35px] flex items-center justify-center shadow-lg transform rotate-6">
              <Icon name="scroll-text" size={40} />
           </div>
           <div>
              <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic">إدارة العقود القانونية <span className="text-teal-600">Legal</span></h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] italic">نظام التوليد الآلي والبروتوكولات القانونية</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Selection Sidebar */}
        <div className="lg:col-span-1 space-y-8 no-print">
           <div className="bg-white p-10 rounded-[50px] shadow-2xl border border-slate-100 space-y-8 italic">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-4">1. اختر الموظف</label>
                 <select 
                    onChange={(e) => setSelectedEmp(employees.find(emp => emp.id === e.target.value))}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[25px] p-6 font-black text-slate-800 outline-none focus:border-teal-500 transition-all appearance-none italic"
                 >
                    <option value="">-- اختر موظفاً من القائمة --</option>
                    {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.code})</option>)}
                 </select>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-4">2. نوع النموذج</label>
                 <div className="grid grid-cols-2 gap-4">
                    <button 
                       onClick={() => setContractType('full-time')}
                       className={`p-5 rounded-[25px] font-black text-xs transition-all border-2 italic ${contractType === 'full-time' ? 'bg-teal-600 text-white border-teal-600 shadow-xl shadow-teal-200' : 'bg-white text-slate-400 border-slate-100 hover:border-teal-200'}`}
                    >
                       دوام كامل
                    </button>
                    <button 
                       onClick={() => setContractType('intern')}
                       className={`p-5 rounded-[25px] font-black text-xs transition-all border-2 italic ${contractType === 'intern' ? 'bg-teal-600 text-white border-teal-600 shadow-xl shadow-teal-200' : 'bg-white text-slate-400 border-slate-100 hover:border-teal-200'}`}
                    >
                       فترة تدريب
                    </button>
                 </div>
              </div>

              <button 
                 onClick={generateContract} 
                 disabled={!selectedEmp || isGenerating}
                 className="w-full bg-slate-900 text-white p-7 rounded-[35px] font-black shadow-2xl hover:bg-teal-600 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-4 text-xl tracking-tighter italic"
              >
                 {isGenerating ? (
                   <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                 ) : (
                   <>
                     <Icon name="sparkles" size={24} />
                     توليد العقد الآن
                   </>
                 )}
              </button>
           </div>

           <div className="bg-slate-900 p-10 rounded-[50px] shadow-2xl space-y-6 italic overflow-hidden relative">
              <Icon name="archive" size={100} className="absolute -bottom-10 -left-10 text-white/5 rotate-12" />
              <h3 className="text-white font-black flex items-center gap-2">آخر العقود المؤرشفة <Icon name="clock" size={20} className="text-teal-400" /></h3>
              <div className="space-y-4 relative z-10">
                 {archivedContracts.length === 0 ? (
                    <p className="text-slate-500 text-xs italic">لا توجد عقود محفوظة حالياً</p>
                 ) : archivedContracts.slice(-3).reverse().map((c: any) => (
                    <div key={c.id} className="bg-white/5 border border-white/10 p-5 rounded-3xl flex items-center justify-between group">
                       <div>
                          <p className="text-white font-black text-sm">{c.empName}</p>
                          <p className="text-[10px] text-teal-400 uppercase tracking-widest">{c.date} • {c.type}</p>
                       </div>
                       <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setGeneratedDoc(c.content)} title="معاينة" className="p-2 text-teal-400 hover:bg-teal-500 hover:text-white rounded-xl transition-all"><Icon name="eye" size={14} /></button>
                          <button onClick={() => deleteContract(c.id)} title="حذف" className="p-2 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all"><Icon name="trash-2" size={14} /></button>
                       </div>
                    </div>
                 ))}
                 {archivedContracts.length > 3 && (
                    <p className="text-center text-[10px] font-black text-slate-500 italic mt-4">+ {archivedContracts.length - 3} عقود أخرى بالأرشيف</p>
                 )}
              </div>
           </div>
        </div>

        {/* Contract Preview Area */}
        <div className="lg:col-span-2 relative min-h-[700px]">
           <AnimatePresence mode="wait">
              {generatedDoc ? (
                <motion.div 
                   key="doc"
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   className="bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] rounded-[60px] p-20 border border-slate-100 relative print:shadow-none print:border-none print:p-0 italic"
                >
                   <div className="absolute top-10 left-10 no-print flex gap-4">
                      <button onClick={handlePrint} className="w-16 h-16 bg-teal-600 text-white rounded-[25px] flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all">
                         <Icon name="printer" size={28} />
                      </button>
                      <button onClick={() => setGeneratedDoc(null)} className="w-16 h-16 bg-slate-50 text-slate-400 rounded-[25px] flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all">
                         <Icon name="x" size={28} />
                      </button>
                   </div>

                   <div className="space-y-12 max-w-4xl mx-auto">
                      <div className="flex justify-between items-center border-b-8 border-slate-900 pb-12 italic">
                         <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center shadow-xl">
                               <Icon name="shield-check" size={32} />
                            </div>
                            <div>
                               <span className="text-3xl font-black tracking-tighter block leading-none">HU WORLD</span>
                               <span className="text-[10px] font-black tracking-[0.5em] text-slate-400 uppercase">HR Management</span>
                            </div>
                         </div>
                         <div className="text-left font-black">
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest italic mb-1">Authentic Document Serial</p>
                            <p className="font-mono text-xl text-slate-900">CT-SEC-{Math.floor(Math.random()*90000) + 10000}</p>
                         </div>
                      </div>

                      <div className="whitespace-pre-line font-['Cairo'] leading-loose text-slate-800 text-xl text-justify p-4 bg-slate-50/30 rounded-[40px] border border-dashed border-slate-100 italic">
                         {generatedDoc}
                      </div>

                      <div className="grid grid-cols-2 gap-32 pt-20">
                         <div className="space-y-12">
                            <div className="w-full h-1 bg-slate-900 rounded-full"></div>
                            <p className="text-center font-black text-slate-400 uppercase text-xs tracking-widest italic">توقيع المسؤول التنفيذي</p>
                         </div>
                         <div className="space-y-12">
                            <div className="w-full h-1 bg-slate-900 rounded-full"></div>
                            <p className="text-center font-black text-slate-400 uppercase text-xs tracking-widest italic">توقيع الطرف الثاني (الموظف)</p>
                         </div>
                      </div>
                   </div>
                </motion.div>
              ) : (
                <div className="h-full bg-slate-50 border-4 border-dashed border-slate-200 rounded-[80px] flex flex-col items-center justify-center text-center p-20 space-y-10 italic">
                   <motion.div 
                     animate={{ rotate: [0, 5, -5, 0], y: [0, -10, 0] }}
                     transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                     className="w-40 h-40 bg-white shadow-3xl rounded-[50px] flex items-center justify-center text-slate-200"
                   >
                      <Icon name="file-text" size={80} strokeWidth={1} />
                   </motion.div>
                   <div className="space-y-4">
                      <h3 className="text-3xl font-black text-slate-300 tracking-tighter uppercase italic">Preview Terminal</h3>
                      <p className="text-slate-400 font-bold max-w-sm mx-auto leading-relaxed italic">اختر الموظف ونوع المسودة القانونية لفتح نظام التوليد التلقائي للعقود والاتفاقيات الرسمية</p>
                   </div>
                </div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
