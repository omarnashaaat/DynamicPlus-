import React from 'react';
import { Icon } from './Icon';

interface PayslipModalProps {
    emp: any;
    month: string;
    record: any;
    onClose: () => void;
}

export const PayslipModal = ({ emp, month, record, onClose }: PayslipModalProps) => {
    const totalDeductions = (record.leaveVal || 0) + (record.penaltyVal || 0) + (record.absenceVal || 0) + (record.lateVal || 0) + (record.advanceInstallment || 0) + (record.adjDeduction || 0);
    const netSalary = (record.grossSalary || 0) + (record.adjAddition || 0) - totalDeductions;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[40px] w-full max-w-xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
                <div className="p-8 print:p-4">
                    <div className="flex justify-between items-start mb-8 no-print">
                        <div className="bg-indigo-50 p-4 rounded-3xl">
                            <Icon name="file-text" size={32} className="text-indigo-600" />
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <Icon name="x" size={24} className="text-slate-400" />
                        </button>
                    </div>

                    <div id="payslip-content" className="space-y-8">
                        <div className="text-center border-b-2 border-slate-900 pb-6">
                            <h2 className="text-2xl font-black text-slate-900 mb-1">بيان مفردات المرتب</h2>
                            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Salary Payslip Statement</p>
                            <div className="mt-4 flex justify-between items-end text-xs font-bold px-4">
                                <div className="text-right">
                                    <p>اسم الموظف: {emp.name}</p>
                                    <p>كود الموظف: {emp.code}</p>
                                </div>
                                <div className="text-left">
                                    <p>الفترة: {month}</p>
                                    <p>تاريخ الإصدار: {new Date().toLocaleDateString('ar-EG')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-emerald-600 uppercase tracking-widest border-b border-emerald-100 pb-2">المستحقات (Additions)</h4>
                                <div className="space-y-2 text-sm font-bold">
                                    <div className="flex justify-between"><span>الراتب الأساسي:</span> <span>{record.basicSalary || 0}</span></div>
                                    <div className="flex justify-between"><span>بدل هاتف:</span> <span>{record.mobileAllowance || 0}</span></div>
                                    <div className="flex justify-between"><span>بدل مواصلات:</span> <span>{record.transportAllowance || 0}</span></div>
                                    <div className="flex justify-between"><span>بدل سهر:</span> <span>{record.overtimeAllowance || 0}</span></div>
                                    <div className="flex justify-between text-emerald-600 pt-2 border-t border-emerald-50"><span>إجمالي الاستحقاق:</span> <span>{record.grossSalary || 0}</span></div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-rose-600 uppercase tracking-widest border-b border-rose-100 pb-2">الاستقطاعات (Deductions)</h4>
                                <div className="space-y-2 text-sm font-bold">
                                    <div className="flex justify-between"><span>أجازات بخصم:</span> <span>{Math.round(record.leaveVal) || 0}</span></div>
                                    <div className="flex justify-between"><span>جزاءات إدارية:</span> <span>{record.penaltyVal || 0}</span></div>
                                    <div className="flex justify-between"><span>أيام غياب:</span> <span>{Math.round(record.absenceVal) || 0}</span></div>
                                    <div className="flex justify-between"><span>ساعات تأخير:</span> <span>{Math.round(record.lateVal) || 0}</span></div>
                                    <div className="flex justify-between"><span>قسط سُلفة:</span> <span>{record.advanceInstallment || 0}</span></div>
                                    <div className="flex justify-between text-rose-600 pt-2 border-t border-rose-50"><span>إجمالي الاستقطاع:</span> <span>{Math.round(totalDeductions)}</span></div>
                                </div>
                            </div>
                        </div>

                        {record.settlements?.length > 0 && (
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase mb-3">تفاصيل التسويات المالية</h4>
                                <div className="space-y-2">
                                    {record.settlements.map((s: any) => (
                                        <div key={s.id} className="flex justify-between text-xs font-bold">
                                            <span className="text-slate-600">{s.reason}</span>
                                            <span className={s.type === 'addition' ? 'text-emerald-600' : 'text-rose-600'}>
                                                {s.type === 'addition' ? '+' : '-'}{s.amount}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-slate-900 text-white p-6 rounded-[24px] flex justify-between items-center shadow-xl shadow-slate-200">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">صافي الراتب المستحق</p>
                                <p className="text-xs text-slate-500 font-bold">Net Salary Payable</p>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-black text-emerald-400">{Math.round(netSalary)}</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase">جنيه مصري</p>
                            </div>
                        </div>

                        <div className="print-only grid grid-cols-2 gap-12 mt-12 text-center text-xs font-black">
                            <div className="border-t border-slate-200 pt-4">توقيع الموظف المستلم</div>
                            <div className="border-t border-slate-200 pt-4">ختم وتوقيع الحسابات</div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 no-print">
                    <button onClick={() => window.print()} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg hover:bg-slate-800 transition-all">
                        <Icon name="printer" size={20} /> طباعة القسيمة
                    </button>
                </div>
            </div>
        </div>
    );
};
