import React, { useState, useRef } from 'react';
import { Icon } from './ui/Icon';

interface SettingsProps {
  appData: any;
  onRestore: (data: any) => void;
  onClear: () => void;
  shifts: any;
  setShifts: React.Dispatch<React.SetStateAction<any>>;
  policyCategories: any[];
  setPolicyCategories: React.Dispatch<React.SetStateAction<any[]>>;
  docTypes: any[];
  setDocTypes: React.Dispatch<React.SetStateAction<any[]>>;
  showToast: (msg: string, type?: any) => void;
  askConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export default function Settings({ appData, onRestore, onClear, shifts, setShifts, policyCategories, setPolicyCategories, docTypes, setDocTypes, showToast, askConfirm }: SettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [shiftForm, setShiftForm] = useState({ name: '', start: '09:00', end: '17:00' });
  const [newCatTitle, setNewCatTitle] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('layers');

  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocSub, setNewDocSub] = useState('');
  const [newDocIcon, setNewDocIcon] = useState('file-text');
  const [newDocColor, setNewDocColor] = useState('bg-indigo-600');

  const handleAddDocType = () => {
    if (!newDocTitle.trim()) return;
    if (docTypes.some(d => d.title === newDocTitle)) return showToast('هذا النوع موجود بالفعل', 'error');
    setDocTypes([...docTypes, { 
      title: newDocTitle, 
      sub: newDocSub || 'Dynamic Form', 
      icon: newDocIcon, 
      color: newDocColor 
    }]);
    setNewDocTitle('');
    setNewDocSub('');
    showToast('تم إضافة نوع المستند بنجاح');
  };

  const handleDeleteDocType = (title: string) => {
    askConfirm('حذف نوع المستند؟', 'هل أنت متأكد من حذف هذا النوع؟ سيؤدي ذلك لإزالته من مركز النماذج.', () => {
      setDocTypes(docTypes.filter(d => d.title !== title));
      showToast('تم حذف نوع المستند');
    });
  };

  const handleAddCategory = () => {
    if (!newCatTitle.trim()) return;
    const id = newCatTitle.toLowerCase().replace(/\s+/g, '_');
    if (policyCategories.some(c => c.id === id)) return showToast('هذا التصنيف موجود بالفعل', 'error');
    setPolicyCategories([...policyCategories, { id, title: newCatTitle, icon: newCatIcon }]);
    setNewCatTitle('');
    showToast('تم إضافة التصنيف بنجاح');
  };

  const handleDeleteCategory = (id: string) => {
    if (id === 'all') return showToast('لا يمكن حذف التصنيف الرئيسي', 'warning');
    askConfirm('حذف التصنيف؟', 'هل أنت متأكد من حذف هذا التصنيف؟ سيؤدي ذلك لإخفاء السياسات المرتبطة به في التصفية.', () => {
      setPolicyCategories(policyCategories.filter(c => c.id !== id));
      showToast('تم حذف التصنيف');
    });
  };

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

        {/* Policy Categories Management */}
        <div className="bg-amber-50/50 rounded-[30px] p-8 border border-amber-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
              <Icon name="layers" size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-800">إدارة تصنيفات السياسات</h3>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input 
              type="text" 
              placeholder="اسم التصنيف الجديد..." 
              className="flex-1 px-5 py-3 rounded-xl border-2 border-slate-100 outline-none focus:border-amber-400 font-bold"
              value={newCatTitle}
              onChange={e => setNewCatTitle(e.target.value)}
            />
            <select 
              className="px-5 py-3 rounded-xl border-2 border-slate-100 outline-none focus:border-amber-400 font-bold bg-white"
              value={newCatIcon}
              onChange={e => setNewCatIcon(e.target.value)}
            >
              <option value="layers">افتراضي</option>
              <option value="file-text">إداري</option>
              <option value="scale">قانوني</option>
              <option value="banknote">مالي</option>
              <option value="package">أصول</option>
              <option value="shield-check">أمان</option>
              <option value="heart">صحي</option>
            </select>
            <button 
              onClick={handleAddCategory}
              className="bg-amber-600 text-white px-8 py-3 rounded-xl font-black hover:bg-amber-700 transition-all shadow-lg shadow-amber-superlight"
            >
              إضافة
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {policyCategories.map((cat: any) => (
              <div key={cat.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="text-slate-400 group-hover:text-amber-600 transition-colors">
                    <Icon name={cat.icon} size={16} />
                  </div>
                  <span className="font-black text-slate-700 text-sm">{cat.title}</span>
                </div>
                {cat.id !== 'all' && (
                  <button 
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Icon name="trash-2" size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Document Types Management */}
        <div className="bg-sky-50/50 rounded-[30px] p-8 border border-sky-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-sky-100 text-sky-600 rounded-2xl">
              <Icon name="files" size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-800">إدارة أنواع المستندات والشهادات</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
               <input 
                 type="text" 
                 placeholder="عنوان المستند (مثلاً: شهادة تدريب)..." 
                 className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 outline-none focus:border-sky-400 font-bold bg-white"
                 value={newDocTitle}
                 onChange={e => setNewDocTitle(e.target.value)}
               />
               <input 
                 type="text" 
                 placeholder="العنوان بالإنجليزية (Sub Title)..." 
                 className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 outline-none focus:border-sky-400 font-bold bg-white"
                 value={newDocSub}
                 onChange={e => setNewDocSub(e.target.value)}
               />
            </div>
            <div className="space-y-4">
               <div className="flex gap-4">
                  <select 
                    className="flex-1 px-5 py-3 rounded-xl border-2 border-slate-100 outline-none focus:border-sky-400 font-bold bg-white"
                    value={newDocIcon}
                    onChange={e => setNewDocIcon(e.target.value)}
                  >
                    <option value="file-text">ملف نصي</option>
                    <option value="award">وسام / جائزة</option>
                    <option value="graduation-cap">شهادة تخرج</option>
                    <option value="certificate">شهادة معتمدة</option>
                    <option value="briefcase">عمل / وظيفة</option>
                    <option value="shield-check">أمان / حماية</option>
                    <option value="heart">صحي</option>
                    <option value="scroll-text">وثيقة رسمية</option>
                  </select>
                  <select 
                    className="flex-1 px-5 py-3 rounded-xl border-2 border-slate-100 outline-none focus:border-sky-400 font-bold bg-white"
                    value={newDocColor}
                    onChange={e => setNewDocColor(e.target.value)}
                  >
                    <option value="bg-indigo-600">نيلي (Indigo)</option>
                    <option value="bg-sky-600">سماوي (Sky)</option>
                    <option value="bg-rose-500">وردي (Rose)</option>
                    <option value="bg-emerald-600">زمردي (Emerald)</option>
                    <option value="bg-amber-600">ذهبي (Amber)</option>
                    <option value="bg-slate-800">فحمي (Slate)</option>
                    <option value="bg-violet-600">بنفسجي (Violet)</option>
                  </select>
               </div>
               <button 
                onClick={handleAddDocType}
                className="w-full bg-sky-600 text-white px-8 py-3 rounded-xl font-black hover:bg-sky-700 transition-all shadow-lg shadow-sky-superlight"
              >
                إضافة نوع مستند جديد
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {docTypes.map((doc: any, i: number) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`${doc.color} text-white p-2 rounded-xl transition-transform group-hover:scale-110`}>
                    <Icon name={doc.icon} size={20} />
                  </div>
                  <div>
                    <span className="font-black text-slate-700 text-sm block">{doc.title}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{doc.sub}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteDocType(doc.title)}
                  className="p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Icon name="trash-2" size={16} />
                </button>
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

          <div className="mt-8 pt-6 border-t border-slate-100">
             <button 
                onClick={() => {
                  askConfirm('إعادة ضبط المصنع؟', 'سيتم مسح كافة البيانات المسجلة نهائياً وإعادة تشغيل النظام.', () => {
                    localStorage.clear();
                    window.location.reload();
                  });
                }}
                className="w-full py-4 text-rose-500 font-black text-xs hover:bg-rose-50 rounded-2xl transition-all border-2 border-dashed border-rose-100 group flex items-center justify-center gap-3"
             >
                <Icon name="refresh-cw" size={16} className="group-hover:rotate-180 transition-transform duration-700" />
                إعادة ضبط المصنع بالكامل (Hard Reset)
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
