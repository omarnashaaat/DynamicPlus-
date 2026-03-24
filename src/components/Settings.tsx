import React, { useState, useRef } from 'react';
import { Icon } from './Icon';

interface SettingsProps {
    appData: any;
    onRestore: (data: any) => void;
    onClear: () => void;
    shifts: any;
    setShifts: React.Dispatch<React.SetStateAction<any>>;
}

export const Settings = React.memo(({ appData, onRestore, onClear, shifts, setShifts }: SettingsProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showShiftModal, setShowShiftModal] = useState(false);
    const [editingShift, setEditingShift] = useState<string | null>(null);
    const [shiftForm, setShiftForm] = useState({ name: '', start: '09:00', end: '17:00' });

    const handleBackup = () => {
        const dataStr = JSON.stringify(appData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `HR_Coordinator_Backup_${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                if (window.confirm('هل أنت متأكد من استعادة البيانات؟ سيؤدي ذلك إلى استبدال كافة البيانات الحالية.')) {
                    onRestore(json);
                    alert('تمت استعادة البيانات بنجاح!');
                }
            } catch (err) {
                alert('خطأ في ملف النسخة الاحتياطية. يرجى التأكد من صحة الملف.');
            }
        };
        reader.readAsText(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSaveShift = (e: React.FormEvent) => {
        e.preventDefault();
        const newShifts = { ...shifts };
        if (editingShift) {
            newShifts[editingShift] = { ...newShifts[editingShift], ...shiftForm };
        } else {
            const id = Date.now().toString();
            newShifts[id] = { id, ...shiftForm };
        }
        setShifts(newShifts);
        setShowShiftModal(false);
        setEditingShift(null);
        setShiftForm({ name: '', start: '09:00', end: '17:00' });
    };

    const deleteShift = (id: string) => {
        if (Object.keys(shifts).length <= 1) {
            alert('يجب أن يكون هناك وردية واحدة على الأقل في النظام.');
            return;
        }
        if (window.confirm('هل أنت متأكد من حذف هذه الوردية؟')) {
            const newShifts = { ...shifts };
            delete newShifts[id];
            setShifts(newShifts);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20">
            <div className="flex items-center justify-between">
                <h2 className="text-4xl font-black text-slate-800">إعدادات النظام</h2>
                <button 
                    onClick={onClear}
                    className="bg-rose-50 text-rose-600 px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
                >
                    <Icon name="trash-2" size={20} /> مسح كافة البيانات
                </button>
            </div>

            <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl space-y-10">
                {/* Shifts Management */}
                <div className="bg-indigo-50/50 rounded-[30px] p-8 border border-indigo-100">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                                <Icon name="clock" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-800">إدارة الورديات</h3>
                                <p className="text-slate-400 text-xs font-bold">إضافة وتعديل مواعيد العمل الرسمية والورديات المخصصة.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => { setEditingShift(null); setShiftForm({ name: '', start: '09:00', end: '17:00' }); setShowShiftModal(true); }}
                            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-black flex items-center gap-2 shadow-lg hover:bg-indigo-700 transition-all"
                        >
                            <Icon name="plus" size={18} /> إضافة وردية
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.values(shifts).map((shift: any) => (
                            <div key={shift.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group">
                                <div>
                                    <p className="font-black text-slate-800 text-sm">{shift.name}</p>
                                    <p className="text-xs font-bold text-slate-400">{shift.start} - {shift.end}</p>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => { setEditingShift(shift.id); setShiftForm({ name: shift.name, start: shift.start, end: shift.end }); setShowShiftModal(true); }}
                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                    >
                                        <Icon name="edit" size={16} />
                                    </button>
                                    <button 
                                        onClick={() => deleteShift(shift.id)}
                                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                    >
                                        <Icon name="trash-2" size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {showShiftModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <div className="w-full max-w-md p-8 rounded-[40px] shadow-2xl animate-fade-in border bg-white border-slate-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-black text-slate-800">{editingShift ? 'تعديل الوردية' : 'إضافة وردية جديدة'}</h3>
                                <button onClick={() => setShowShiftModal(false)} className="text-slate-400 hover:text-rose-500 transition-colors">
                                    <Icon name="x-circle" size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleSaveShift} className="space-y-4 text-right">
                                <div className="space-y-1">
                                    <label className="text-xs font-black text-slate-500 uppercase">اسم الوردية</label>
                                    <input 
                                        required 
                                        type="text" 
                                        className="w-full px-5 py-3 rounded-2xl border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        value={shiftForm.name}
                                        onChange={(e) => setShiftForm({...shiftForm, name: e.target.value})}
                                        placeholder="مثال: الوردية المسائية"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-black text-slate-500 uppercase">وقت الحضور</label>
                                        <input 
                                            required 
                                            type="time" 
                                            className="w-full px-5 py-3 rounded-2xl border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                            value={shiftForm.start}
                                            onChange={(e) => setShiftForm({...shiftForm, start: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-black text-slate-500 uppercase">وقت الانصراف</label>
                                        <input 
                                            required 
                                            type="time" 
                                            className="w-full px-5 py-3 rounded-2xl border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                            value={shiftForm.end}
                                            onChange={(e) => setShiftForm({...shiftForm, end: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl text-lg shadow-lg hover:bg-indigo-700 transition-all">
                                        حفظ الوردية
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                <div className="bg-slate-50/50 rounded-[30px] p-8 border border-slate-100">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                            <Icon name="save" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800">النسخ الاحتياطي والاستعادة</h3>
                            <p className="text-slate-400 text-xs font-bold">قم بتصدير قاعدة البيانات كاملة (JSON) لحفظها بأمان أو نقلها لجهاز آخر.</p>
                        </div>
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
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleRestore} 
                                accept=".json" 
                                className="hidden" 
                            />
                        </button>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-emerald-600">
                        <Icon name="shield-check" size={18} />
                        <span className="text-xs font-black">النظام محدث ومؤمن بالكامل</span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        إصدار النظام v2.7.0 - TIBA COORDINATOR
                    </div>
                </div>
            </div>

            <div className="bg-amber-50 rounded-[30px] p-6 border border-amber-100 flex gap-4 items-start">
                <Icon name="alert-circle" className="text-amber-500 shrink-0" size={20} />
                <p className="text-xs font-bold text-amber-700 leading-relaxed">
                    تنبيه: لا تقم بمشاركة ملف النسخة الاحتياطية مع أي شخص غير مخول، حيث يحتوي الملف على كافة البيانات الشخصية والرواتب الخاصة بالموظفين.
                </p>
            </div>
        </div>
    );
});
