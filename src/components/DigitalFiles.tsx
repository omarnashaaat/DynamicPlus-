import React, { useState } from 'react';
import { Icon } from './ui/Icon';

interface DigitalFilesProps {
  employees: any[];
  showToast: (msg: string, type?: any) => void;
  askConfirm: (title: string, message: string, onConfirm: () => void, type?: any) => void;
}

export default function DigitalFiles({ employees, showToast }: DigitalFilesProps) {
  const [selectedEmp, setSelectedEmp] = useState<any>(null);
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
    const empFiles = files[selectedEmp.id].filter((f: any) => f.id !== fileId);
    const newFiles = { ...files, [selectedEmp.id]: empFiles };
    setFiles(newFiles);
    try {
      localStorage.setItem('hr_digital_files', JSON.stringify(newFiles));
    } catch (e) {
      console.error('Error saving hr_digital_files to localStorage after deletion', e);
    }
    showToast('تم حذف الملف');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-800">الملفات الرقمية</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">الأرشفة السحابية للموظفين</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-[40px] border shadow-xl overflow-hidden">
          <div className="p-6 bg-slate-50 border-b">
            <h3 className="font-black text-slate-800">قائمة الموظفين</h3>
          </div>
          <div className="max-h-[600px] overflow-y-auto divide-y">
            {employees.map(emp => (
              <button 
                key={emp.id} 
                onClick={() => setSelectedEmp(emp)}
                className={`w-full p-4 text-right flex items-center gap-4 transition-all ${selectedEmp?.id === emp.id ? 'bg-indigo-50 border-r-4 border-indigo-600' : 'hover:bg-slate-50'}`}
              >
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-black">
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <p className="font-black text-slate-800 text-sm">{emp.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{emp.code}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {selectedEmp ? (
            <div className="bg-white rounded-[40px] border shadow-xl p-8 min-h-[600px]">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-2xl font-black text-slate-800">{selectedEmp.name}</h3>
                  <p className="text-slate-400 font-bold text-xs">إجمالي الملفات: {(files[selectedEmp.id] || []).length}</p>
                </div>
                <label className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs cursor-pointer hover:bg-indigo-700 transition-all flex items-center gap-2">
                  <Icon name="upload" size={16} /> رفع ملف جديد
                  <input type="file" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(files[selectedEmp.id] || []).map((file: any) => (
                  <div key={file.id} className="p-4 rounded-3xl border border-slate-100 bg-slate-50/50 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white rounded-2xl text-indigo-600 shadow-sm">
                        <Icon name="file-text" size={24} />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-xs truncate max-w-[150px]">{file.name}</p>
                        <p className="text-[9px] text-slate-400 font-bold">{file.size} • {file.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href={file.data} download={file.name} className="p-2 text-slate-400 hover:text-indigo-600"><Icon name="download" size={16} /></a>
                      <button onClick={() => deleteFile(file.id)} className="p-2 text-slate-400 hover:text-rose-600"><Icon name="trash-2" size={16} /></button>
                    </div>
                  </div>
                ))}
                {(files[selectedEmp.id] || []).length === 0 && (
                  <div className="col-span-full py-20 text-center text-slate-300">
                    <Icon name="folder-open" size={64} className="mx-auto mb-4 opacity-20" />
                    <p className="font-black">لا توجد ملفات مرفوعة لهذا الموظف</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-[40px] border border-dashed border-slate-200 flex flex-col items-center justify-center min-h-[600px] text-slate-400">
              <Icon name="user-check" size={80} className="mb-6 opacity-20" />
              <p className="text-xl font-black">اختر موظفاً لعرض ملفاته</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
