import React, { useRef } from 'react';
import { Icon, Card } from '../components/Layout';

export const Settings = ({ 
    appData, 
    onRestore, 
    userName, 
    setUserName, 
    systemPassword, 
    setSystemPassword,
    snapshots,
    onCreateSnapshot,
    onRestoreSnapshot,
    onDeleteSnapshot
}: any) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleRestore = (event: any) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e: any) => {
            try {
                const json = JSON.parse(e.target.result);
                if (confirm('هل أنت متأكد من استعادة البيانات؟ سيؤدي ذلك إلى استبدال كافة البيانات الحالية.')) {
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

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-20">
            <div className="flex items-center justify-between">
                <h2 className="text-4xl font-black text-slate-800 tracking-tighter">إعدادات النظام</h2>
                <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                    <Icon name="settings" size={16} />
                    <span>تخصيص وإدارة النظام</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* User Settings */}
                <Card title="إعدادات المستخدم" subtitle="تغيير اسم الترحيب وكلمة المرور">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 mr-2 uppercase tracking-widest">اسم المستخدم (يظهر في الترحيب)</label>
                            <input 
                                type="text" 
                                value={userName} 
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
                                placeholder="مثال: ضياء"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 mr-2 uppercase tracking-widest">كلمة مرور النظام</label>
                            <input 
                                type="text" 
                                value={systemPassword} 
                                onChange={(e) => setSystemPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
                                placeholder="كلمة السر الجديدة"
                            />
                        </div>
                    </div>
                </Card>

                {/* Backup Settings */}
                <Card title="النسخ الاحتياطي" subtitle="تصدير واستيراد قاعدة البيانات يدوياً">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button 
                            onClick={handleBackup}
                            className="flex flex-col items-center justify-center p-6 bg-emerald-50 border-2 border-emerald-100 rounded-3xl hover:border-emerald-500 hover:bg-emerald-100 transition-all group"
                        >
                            <Icon name="download" size={32} className="text-emerald-300 group-hover:text-emerald-600 mb-3 transition-colors" />
                            <span className="text-sm font-black text-emerald-700">تصدير (Backup)</span>
                        </button>

                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="flex flex-col items-center justify-center p-6 bg-indigo-50 border-2 border-indigo-100 rounded-3xl hover:border-indigo-500 hover:bg-indigo-100 transition-all group"
                        >
                            <Icon name="upload" size={32} className="text-indigo-300 group-hover:text-indigo-600 mb-3 transition-colors" />
                            <span className="text-sm font-black text-indigo-700">استيراد (Restore)</span>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleRestore} 
                                accept=".json" 
                                className="hidden" 
                            />
                        </button>
                    </div>
                    <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 items-start">
                        <Icon name="alert-circle" className="text-amber-500 shrink-0" size={16} />
                        <p className="text-[10px] font-bold text-amber-700 leading-relaxed">
                            تنبيه: استيراد نسخة احتياطية سيؤدي لاستبدال كافة البيانات الحالية. لا تشارك ملف النسخ مع أشخاص غير مخولين.
                        </p>
                    </div>
                </Card>

                {/* Snapshots (History) */}
                <Card title="سجل النسخ (Snapshots)" subtitle="استرجاع البيانات من نقاط زمنية سابقة" className="lg:col-span-2">
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-center bg-indigo-600 p-8 rounded-[35px] text-white shadow-xl shadow-indigo-100 gap-6">
                            <div className="text-center sm:text-right">
                                <h4 className="text-xl font-black mb-1">حفظ نقطة استعادة جديدة</h4>
                                <p className="text-xs font-bold text-indigo-100 opacity-80">سيتم حفظ الحالة الحالية للنظام في الذاكرة المحلية للمتصفح</p>
                            </div>
                            <button 
                                onClick={() => onCreateSnapshot('')}
                                className="bg-white text-indigo-600 px-10 py-4 rounded-2xl font-black shadow-2xl hover:bg-indigo-50 transition-all flex items-center gap-2 active:scale-95"
                            >
                                <Icon name="database" size={20} /> حفظ الآن
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {snapshots.length > 0 ? snapshots.map((s: any) => (
                                <div key={s.id} className="p-6 rounded-[30px] border-2 border-slate-50 bg-slate-50/30 hover:border-indigo-200 transition-all group relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2.5 rounded-xl bg-white shadow-sm text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                            <Icon name="history" size={20} />
                                        </div>
                                        <button onClick={() => onDeleteSnapshot(s.id)} className="text-slate-300 hover:text-rose-500 transition-colors p-1">
                                            <Icon name="trash-2" size={16} />
                                        </button>
                                    </div>
                                    <h5 className="font-black text-slate-800 mb-1 truncate text-sm">{s.name}</h5>
                                    <p className="text-[10px] font-bold text-slate-400 mb-6">{new Date(s.date).toLocaleString('ar-EG')}</p>
                                    <button 
                                        onClick={() => onRestoreSnapshot(s)}
                                        className="w-full py-3 rounded-xl bg-white border border-slate-200 font-black text-[11px] text-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm"
                                    >
                                        استعادة هذه النسخة
                                    </button>
                                </div>
                            )) : (
                                <div className="col-span-full py-16 text-center">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                        <Icon name="history" size={32} />
                                    </div>
                                    <p className="text-slate-300 italic font-bold">لا توجد نسخ محفوظة حالياً في السجل</p>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>

                {/* About */}
                <Card title="عن النظام" subtitle="معلومات الإصدار والترخيص" className="lg:col-span-2">
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="w-40 h-40 bg-slate-900 rounded-[50px] flex items-center justify-center text-white shadow-2xl shrink-0 rotate-3 hover:rotate-0 transition-transform duration-500">
                            <Icon name="layout-grid" size={80} />
                        </div>
                        <div className="text-center md:text-right flex-1">
                            <h4 className="text-3xl font-black text-slate-800 mb-2">المنسق HR - الإصدار 3.0.0</h4>
                            <p className="text-slate-500 font-bold mb-6 text-lg">نظام متكامل لإدارة الموارد البشرية والرواتب والحضور والمستندات</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <span className="px-5 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-[11px] font-black border border-indigo-100">ترخيص نشط</span>
                                <span className="px-5 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-[11px] font-black border border-emerald-100">قاعدة بيانات محلية</span>
                                <span className="px-5 py-2 rounded-xl bg-amber-50 text-amber-600 text-[11px] font-black border border-amber-100">دعم فني متاح</span>
                                <span className="px-5 py-2 rounded-xl bg-slate-100 text-slate-600 text-[11px] font-black border border-slate-200">v3.0.0 Stable</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
