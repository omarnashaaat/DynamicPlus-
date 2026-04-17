import React, { useState } from 'react';
import { Icon } from './ui/Icon';
import { motion, AnimatePresence } from 'motion/react';

export default function DigitalFiles({ employees, showToast, askConfirm }: any) {
  const [selectedEmp, setSelectedEmp] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [files, setFiles] = useState<any>(() => {
    try {
      return JSON.parse(localStorage.getItem('hr_digital_files') || '{}');
    } catch (e) {
      console.error('Error reading hr_digital_files from localStorage', e);
      return {};
    }
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedEmp) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('حجم الملف كبير جداً (الأقصى 5 ميجابايت)', 'error');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const newFile = {
          id: Date.now().toString(),
          name: file.name,
          type: file.type,
          size: (file.size / 1024).toFixed(2) + ' KB',
          date: new Date().toLocaleDateString('ar-EG'),
          data: event.target?.result
        };
        const empFiles = files[selectedEmp.id] || [];
        const newFiles = { ...files, [selectedEmp.id]: [...empFiles, newFile] };
        setFiles(newFiles);
        try {
          localStorage.setItem('hr_digital_files', JSON.stringify(newFiles));
        } catch (e) {
          console.error('Error saving hr_digital_files to localStorage', e);
          showToast('فشل حفظ الملف في التخزين المحلي', 'error');
        }
        showToast('تم رفع الملف بنجاح');
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteFile = (fileId: string) => {
    askConfirm('حذف الملف؟', 'سيتم حذف هذا المستند نهائياً من أرشيف الموظف.', () => {
      const empFiles = files[selectedEmp.id].filter((f: any) => f.id !== fileId);
      const newFiles = { ...files, [selectedEmp.id]: empFiles };
      setFiles(newFiles);
      try {
        localStorage.setItem('hr_digital_files', JSON.stringify(newFiles));
      } catch (e) {
        console.error('Error saving hr_digital_files to localStorage', e);
      }
      showToast('تم حذف الملف بنجاح', 'error');
    });
  };

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return 'image';
    if (type.includes('pdf')) return 'file-text';
    return 'file';
  };

  return (
    <div className="space-y-12 animate-fade-in px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic">الأرشيف الرقمي <span className="text-indigo-600">Cloud Vault</span></h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1 italic">إدارة المستندات والوثائق الرسمية للموظفين</p>
        </div>
        
        <div className="relative w-full md:w-96 group">
          <Icon name="search" size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text" 
            placeholder="البحث باسم الموظف..." 
            className="w-full bg-white border-2 border-slate-100 rounded-[25px] py-5 pr-14 pl-6 font-black text-slate-800 outline-none focus:border-indigo-500 transition-all shadow-sm italic"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 min-h-[700px]">
        {/* Employee List Section */}
        <div className="lg:col-span-1 bg-white rounded-[50px] shadow-3xl border border-slate-100 flex flex-col overflow-hidden italic">
           <div className="p-8 bg-slate-50 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3 italic">
                 <Icon name="users" size={18} className="text-indigo-600" /> قائمة الموظفين
              </h3>
           </div>
           
           <div className="flex-1 overflow-y-auto no-scrollbar py-4 italic">
              {filteredEmployees.length > 0 ? filteredEmployees.map(emp => (
                 <motion.button 
                    layout
                    key={emp.id} 
                    onClick={() => setSelectedEmp(emp)}
                    className={`w-full p-6 text-right flex items-center gap-4 transition-all group relative italic ${selectedEmp?.id === emp.id ? 'bg-indigo-600' : 'hover:bg-slate-50'}`}
                 >
                    {selectedEmp?.id === emp.id && (
                       <motion.div layoutId="activeInd" className="absolute right-0 top-0 bottom-0 w-2 bg-indigo-400" />
                    )}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-colors ${selectedEmp?.id === emp.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                       {emp.name.charAt(0)}
                    </div>
                    <div>
                       <p className={`font-black text-sm transition-colors ${selectedEmp?.id === emp.id ? 'text-white' : 'text-slate-800'}`}>{emp.name}</p>
                       <p className={`text-[10px] uppercase font-black tracking-widest transition-colors ${selectedEmp?.id === emp.id ? 'text-indigo-200' : 'text-slate-300'}`}>{emp.code}</p>
                    </div>
                 </motion.button>
              )) : (
                 <div className="p-10 text-center text-slate-300 italic">
                    <Icon name="user-x" size={40} className="mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-black">لا يوجد موظفين</p>
                 </div>
              )}
           </div>
        </div>

        {/* File Content Area */}
        <div className="lg:col-span-3">
           <AnimatePresence mode="wait">
              {selectedEmp ? (
                 <motion.div 
                    key={selectedEmp.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-[60px] shadow-4xl border border-slate-100 p-12 min-h-full flex flex-col italic"
                 >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 italic border-b-2 border-slate-50 pb-10">
                       <div className="flex items-center gap-6">
                          <div className="w-20 h-20 bg-slate-900 text-white rounded-[35px] flex items-center justify-center text-4xl font-black shadow-2xl rotate-3">{selectedEmp.name.charAt(0)}</div>
                          <div>
                             <h3 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">{selectedEmp.name}</h3>
                             <div className="flex items-center gap-3 mt-1">
                                <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest italic">{selectedEmp.position}</span>
                                <span className="text-slate-400 font-bold text-xs">إجمالي الملفات: {(files[selectedEmp.id] || []).length}</span>
                             </div>
                          </div>
                       </div>
                       
                       <label className="bg-slate-900 text-white px-10 py-5 rounded-[25px] font-black text-sm cursor-pointer hover:bg-indigo-600 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-4 italic shadow-2xl">
                          <Icon name="upload-cloud" size={24} /> رفع ملف جديد
                          <input type="file" className="hidden" onChange={handleFileUpload} />
                       </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 flex-1 italic">
                       {(files[selectedEmp.id] || []).map((file: any) => (
                          <motion.div 
                             layout
                             key={file.id} 
                             className="p-6 rounded-[35px] border-2 border-slate-50 bg-white hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-50/50 transition-all group relative flex flex-col justify-between italic"
                          >
                             <div className="flex items-center gap-4 mb-6 italic">
                                <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm italic">
                                   <Icon name={getFileIcon(file.type)} size={28} />
                                </div>
                                <div className="overflow-hidden italic">
                                   <p className="font-black text-slate-800 text-sm truncate pr-2 italic">{file.name}</p>
                                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 italic">{file.size} • {file.date}</p>
                                </div>
                             </div>
                             
                             <div className="flex items-center gap-2 pt-4 justify-end border-t border-slate-50 italic">
                                <a href={file.data} download={file.name} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-indigo-100 hover:text-indigo-600 transition-all" title="تحميل"><Icon name="download" size={18} /></a>
                                <button onClick={() => deleteFile(file.id)} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all" title="حذف بالماك"><Icon name="trash-2" size={18} /></button>
                             </div>
                          </motion.div>
                       ))}

                       {(files[selectedEmp.id] || []).length === 0 && (
                          <div className="col-span-full h-full flex flex-col items-center justify-center text-slate-200 py-32 italic">
                             <div className="w-32 h-32 bg-slate-50 rounded-[40px] flex items-center justify-center mb-6">
                                <Icon name="folder-kanban" size={64} strokeWidth={1} />
                             </div>
                             <p className="text-xl font-black uppercase tracking-tighter italic">No Documents Found</p>
                             <p className="text-sm font-bold opacity-60">ابدأ أرشفة ملفات الموظف عبر زر الرفع أعلاه</p>
                          </div>
                       )}
                    </div>
                 </motion.div>
              ) : (
                 <div className="bg-slate-50/50 rounded-[70px] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center min-h-full text-slate-300 italic p-20 text-center">
                    <motion.div 
                      animate={{ y: [0, -15, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="w-32 h-32 bg-white shadow-2xl rounded-[40px] flex items-center justify-center mb-10 text-slate-100"
                    >
                       <Icon name="layers" size={80} strokeWidth={1} />
                    </motion.div>
                    <h3 className="text-3xl font-black text-slate-300 tracking-tighter uppercase italic">Central Archives</h3>
                    <p className="text-slate-400 font-bold max-w-sm mx-auto mt-4 leading-relaxed italic">يُرجى اختيار موظف من القائمة الجانبية للوصول إلى وحدة التخزين الآمنة للملفات والوثائق الرقمية الخاصة به</p>
                 </div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
