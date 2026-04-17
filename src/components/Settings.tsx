import React, { useState, useRef } from 'react';
import { Icon } from './ui/Icon';

interface SettingsProps {
  appData: any;
  onRestore: (data: any) => void;
  onClear: () => void;
  shifts: any;
  setShifts: React.Dispatch<React.SetStateAction<any>>;
  showToast: (msg: string, type?: any) => void;
  askConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export default function Settings({ appData, onRestore, onClear, shifts, setShifts, showToast, askConfirm }: SettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [shiftForm, setShiftForm] = useState({ name: '', start: '09:00', end: '17:00' });

  const handleBackup = () => {
    const dataStr = JSON.stringify(appData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HR_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('تم تحميل نسخة احتياطية بنجاح');
  };

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        askConfirm('استعادة البيانات؟', 'هل أنت متأكد من استعادة البيانات؟ سيؤدي ذلك إلى استبدال كافة البيانات الحالية.', () => {
          onRestore(json);
          showToast('تمت استعادة البيانات بنجاح!');
        });
      } catch (err) {
        showToast('خطأ في ملف النسخة الاحتياطية', 'error');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-4xl font-black text-slate-800">إعدادات النظام</h2>
        <button 
          onClick={onClear}
          className="w-full sm:w-auto justify-center bg-rose-50 text-rose-600 px-6 py-3 rounded-2xl font-black border border-rose-100 hover:bg-rose-600 hover:text-white transition-all"
        >
          <Icon name="trash-2" size={20} className="ml-2 inline" /> مسح كافة البيانات
        </button>
      </div>

      <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl space-y-10">
        <div className="bg-indigo-50/50 rounded-[30px] p-8 border border-indigo-100">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                <Icon name="clock" size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-800">إدارة الورديات</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.values(shifts).map((shift: any) => (
              <div key={shift.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="font-black text-slate-800 text-sm">{shift.name}</p>
                  <p className="text-xs font-bold text-slate-400">{shift.start} - {shift.end}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50/50 rounded-[30px] p-8 border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
              <Icon name="save" size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-800">النسخ الاحتياطي والاستعادة</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={handleBackup}
              className="flex flex-col items-center justify-center p-8 bg-white border-2 border-slate-100 rounded-[30px] hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <Icon name="download" size={32} className="text-slate-300 group-hover:text-blue-500 mb-4 transition-colors" />
              <span className="text-lg font-black text-slate-700">تحميل نسخة (Backup)</span>
            </button>

            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-8 bg-white border-2 border-slate-100 rounded-[30px] hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
            >
              <Icon name="upload" size={32} className="text-slate-300 group-hover:text-indigo-500 mb-4 transition-colors" />
              <span className="text-lg font-black text-slate-700">استعادة (Restore)</span>
              <input type="file" ref={fileInputRef} onChange={handleRestore} accept=".json" className="hidden" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
