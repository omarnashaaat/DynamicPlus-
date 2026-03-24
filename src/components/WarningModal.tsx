import React, { useState } from 'react';
import { Icon } from './Icon';

interface WarningModalProps {
    emp: any;
    onClose: () => void;
}

export const WarningModal = ({ emp, onClose }: WarningModalProps) => {
    const [note, setNote] = useState('');
    const [type, setType] = useState('warning'); // warning, note
    const [isSinglePage, setIsSinglePage] = useState(true);

    const handlePrint = () => {
        if (isSinglePage) document.body.classList.add('single-page-mode');
        window.print();
        document.body.classList.remove('single-page-mode');
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 print:static print:bg-transparent print:p-0 print:m-0">
            <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-fade-in border border-slate-200 flex flex-col max-h-[90vh] print:max-w-none print:border-none print:shadow-none print:rounded-none print:max-h-none print:block print:m-0 print:p-0">
                <div className="p-4 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print shrink-0">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className={`p-2 rounded-xl shrink-0 ${type === 'warning' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
                            <Icon name={type === 'warning' ? 'alert-triangle' : 'message-square'} size={24}/>
                        </div>
                        <h3 className="text-lg md:text-xl font-black text-slate-800">{type === 'warning' ? 'إصدار إنذار' : 'ملاحظة إدارية'}</h3>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button 
                            onClick={() => setIsSinglePage(!isSinglePage)}
                            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all border-2 ${isSinglePage ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                            title="ضمان احتواء المحتوى في صفحة واحدة"
                        >
                            {isSinglePage ? 'وضع الصفحة الواحدة: مفعل' : 'وضع الصفحة الواحدة: معطل'}
                        </button>
                        <button onClick={handlePrint} className="flex-1 sm:flex-none justify-center px-4 md:px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-sm flex items-center gap-2 shadow-lg hover:bg-indigo-700 transition-all">
                            <Icon name="printer" size={18}/> طباعة PDF
                        </button>
                        <button onClick={onClose} className="p-2.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-all shrink-0">
                            <Icon name="x" size={24}/>
                        </button>
                    </div>
                </div>

                <div className="p-6 md:p-10 overflow-y-auto no-print">
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <button onClick={() => setType('warning')} className={`flex-1 py-3 rounded-2xl font-black text-sm transition-all border-2 ${type === 'warning' ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>إنذار تأخير / انصراف مبكر</button>
                            <button onClick={() => setType('note')} className={`flex-1 py-3 rounded-2xl font-black text-sm transition-all border-2 ${type === 'note' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>ملاحظة عامة</button>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-700">نص الرسالة / الملاحظة</label>
                            <textarea 
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="w-full h-32 p-4 rounded-2xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none resize-none font-bold"
                                placeholder="اكتب الملاحظة هنا ليتم طباعتها وإبلاغ الموظف بها..."
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Print View */}
                <div className="hidden print:flex flex-col warning-box">
                    <div className="text-center mb-8 border-b-4 border-slate-900 pb-6">
                        <h1 className="text-5xl font-black text-slate-900 mb-2">{type === 'warning' ? 'إنذار إداري' : 'ملاحظة إدارية'}</h1>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">{type === 'warning' ? 'Administrative Warning' : 'Administrative Note'}</p>
                    </div>

                    <div className="space-y-0 text-xl mb-10">
                        <div className="detail-row">
                            <span className="font-bold text-slate-900">التاريخ:</span>
                            <span className="font-black">{new Date().toLocaleDateString('ar-EG')}</span>
                        </div>
                        <div className="detail-row">
                            <span className="font-bold text-slate-900">السيد / السيدة:</span>
                            <span className="font-black text-2xl">{emp.name}</span>
                        </div>
                        <div className="detail-row">
                            <span className="font-bold text-slate-900">الكود الوظيفي:</span>
                            <span className="font-mono font-black">{emp.code}</span>
                        </div>
                        <div className="detail-row">
                            <span className="font-bold text-slate-900">الإدارة / القسم:</span>
                            <span className="font-black">{emp.department}</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-2xl font-black text-slate-900 mb-6 underline underline-offset-8">الموضوع:</h3>
                        <div className="p-8 border-2 border-slate-200 rounded-[30px] min-h-[200px]">
                            <p className="text-2xl leading-loose font-bold whitespace-pre-wrap">{note || 'لا توجد تفاصيل إضافية.'}</p>
                        </div>
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-20 text-lg font-black text-slate-900 pt-10">
                        <div className="text-center space-y-8">
                            <p>توقيع الموظف بالاستلام</p>
                            <div className="w-full border-b-2 border-slate-400"></div>
                        </div>
                        <div className="text-center space-y-8">
                            <p>مدير الموارد البشرية</p>
                            <div className="w-full border-b-2 border-slate-400"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
