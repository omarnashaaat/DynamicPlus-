import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { SettlementModal } from './SettlementModal';
import { PayslipModal } from './PayslipModal';
import html2pdf from 'html2pdf.js';

interface PayrollProps {
    employees: any[];
    payrollRecords: any;
    setPayrollRecords: React.Dispatch<React.SetStateAction<any>>;
    attendanceLog: any;
    setActiveTab: (tab: string) => void;
}

export const Payroll = React.memo(({ employees, payrollRecords, setPayrollRecords, attendanceLog, setActiveTab }: PayrollProps) => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); 
    const [settlementTarget, setSettlementTarget] = useState<any>(null);
    const [payslipTarget, setPayslipTarget] = useState<any>(null);
    const [customRange, setCustomRange] = useState(false);
    const [startDateStr, setStartDateStr] = useState('');
    const [endDateStr, setEndDateStr] = useState('');
    const [isSinglePage, setIsSinglePage] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Link Attendance Deductions Automatically
    useEffect(() => {
        let startDate, endDate;
        if (customRange && startDateStr && endDateStr) {
            startDate = new Date(startDateStr);
            endDate = new Date(endDateStr);
        } else {
            const [year, month] = selectedMonth.split('-').map(Number);
            startDate = new Date(year, month - 2, 26);
            endDate = new Date(year, month - 1, 25);
        }
        
        const days = [];
        let current = new Date(startDate);
        while (current <= endDate) {
            days.push(current.toISOString().split('T')[0]);
            current.setDate(current.getDate() + 1);
        }

        const updatedRecords = { ...payrollRecords };
        let changed = false;
        const monthKey = customRange ? `${startDateStr}_${endDateStr}` : selectedMonth;

        employees.forEach(emp => {
            let totalLateHours = 0;
            let totalManualDays = 0;
            let totalEarlyHours = 0;

            days.forEach(date => {
                const rec = (attendanceLog[date] && attendanceLog[date][emp.id]);
                if (rec) {
                    totalLateHours += (parseFloat(rec.lateDeduction) || 0);
                    totalEarlyHours += (parseFloat(rec.earlyDeduction) || 0);
                    totalManualDays += (parseFloat(rec.manualDeduction) || 0);
                }
            });

            const totalDeductionHours = totalLateHours + totalEarlyHours;

            if (!updatedRecords[monthKey]) updatedRecords[monthKey] = {};
            if (!updatedRecords[monthKey][emp.id]) {
                updatedRecords[monthKey][emp.id] = {
                    basicSalary: emp.salary || 0,
                    grossSalary: emp.salary || 0,
                    mobileAllowance: 0,
                    transportAllowance: 0,
                    overtimeAllowance: 0,
                    leaveCount: 0, leaveVal: 0,
                    penaltyCount: 0, penaltyVal: 0,
                    absenceCount: 0, absenceVal: 0,
                    lateCount: totalDeductionHours, 
                    lateVal: (totalDeductionHours * ((emp.salary || 0) / 30 / 8)) + (totalManualDays * ((emp.salary || 0) / 30)),
                    manualDeductionDays: totalManualDays,
                    earlyDepartureHours: totalEarlyHours,
                    advanceInstallment: 0, advanceTotal: 0,
                    adjDeduction: 0, adjAddition: 0,
                    notes: '',
                    settlements: []
                };
                changed = true;
            } else if (updatedRecords[monthKey][emp.id].lateCount !== totalDeductionHours || updatedRecords[monthKey][emp.id].manualDeductionDays !== totalManualDays) {
                updatedRecords[monthKey][emp.id].lateCount = totalDeductionHours;
                updatedRecords[monthKey][emp.id].manualDeductionDays = totalManualDays;
                updatedRecords[monthKey][emp.id].earlyDepartureHours = totalEarlyHours;
                const baseForLate = updatedRecords[monthKey][emp.id].basicSalary || updatedRecords[monthKey][emp.id].grossSalary || 0;
                updatedRecords[monthKey][emp.id].lateVal = (totalDeductionHours * (baseForLate / 30 / 8)) + (totalManualDays * (baseForLate / 30));
                changed = true;
            }
        });

        if (changed) setPayrollRecords(updatedRecords);
    }, [selectedMonth, attendanceLog, employees, customRange, startDateStr, endDateStr]);

    const handlePrint = () => {
        if (isSinglePage) document.body.classList.add('single-page-mode');
        window.print();
        document.body.classList.remove('single-page-mode');
    };

    const currentMonthKey = customRange ? `${startDateStr}_${endDateStr}` : selectedMonth;

    const updateField = (empId, field, value) => {
        const monthKey = customRange ? `${startDateStr}_${endDateStr}` : selectedMonth;
        const monthRecords = payrollRecords[monthKey] || {};
        const current = monthRecords[empId] || {
            basicSalary: 0,
            mobileAllowance: 0,
            transportAllowance: 0,
            overtimeAllowance: 0,
            grossSalary: 0,
            leaveCount: 0, leaveVal: 0,
            penaltyCount: 0, penaltyVal: 0,
            absenceCount: 0, absenceVal: 0,
            lateCount: 0, lateVal: 0,
            advanceInstallment: 0, advanceTotal: 0,
            adjDeduction: 0, adjAddition: 0,
            notes: '',
            settlements: []
        };
        
        const updated = { ...current, [field]: value };
        
        if (field !== 'settlements' && field !== 'notes') {
            const numVal = parseFloat(value) || 0;
            updated[field] = numVal;

            if (['basicSalary', 'mobileAllowance', 'transportAllowance', 'overtimeAllowance'].includes(field)) {
                updated.grossSalary = (updated.basicSalary || 0) + (updated.mobileAllowance || 0) + (updated.transportAllowance || 0) + (updated.overtimeAllowance || 0);
            }

            const dayRate = (updated.grossSalary || 0) / 30;
            const basicDayRate = (updated.basicSalary || 0) / 30;
            
            if (field === 'leaveCount' || field === 'basicSalary' || field === 'mobileAllowance' || field === 'transportAllowance' || field === 'overtimeAllowance') updated.leaveVal = (updated.leaveCount || 0) * dayRate;
            if (field === 'absenceCount' || field === 'basicSalary' || field === 'mobileAllowance' || field === 'transportAllowance' || field === 'overtimeAllowance') updated.absenceVal = (updated.absenceCount || 0) * dayRate;
            if (field === 'lateCount' || field === 'basicSalary') updated.lateVal = (updated.lateCount || 0) * (basicDayRate / 8);
        }

        setPayrollRecords(prev => ({
            ...prev,
            [monthKey]: { ...monthRecords, [empId]: updated }
        }));
    };

    const calculateTotals = (record) => {
        const r = record || {};
        const totalDeductions = (r.leaveVal || 0) + (r.penaltyVal || 0) + (r.absenceVal || 0) + (r.lateVal || 0) + (r.advanceInstallment || 0) + (r.adjDeduction || 0);
        const netSalary = (r.grossSalary || 0) + (r.adjAddition || 0) - totalDeductions;
        return { totalDeductions, netSalary };
    };

    const handleSaveSettlements = (data) => {
        updateField(settlementTarget.emp.id, 'settlements', data.settlements);
        updateField(settlementTarget.emp.id, 'adjAddition', data.adjAddition);
        updateField(settlementTarget.emp.id, 'adjDeduction', data.adjDeduction);
        setSettlementTarget(null);
    };

    return (
        <div className="space-y-6 animate-fade-in pb-12 payroll-container">
            {settlementTarget && (
                <SettlementModal 
                    emp={settlementTarget.emp} 
                    month={currentMonthKey} 
                    record={settlementTarget.record} 
                    onSave={handleSaveSettlements}
                    onClose={() => setSettlementTarget(null)}
                />
            )}

            {payslipTarget && (
                <PayslipModal 
                    emp={payslipTarget.emp}
                    month={currentMonthKey}
                    record={payslipTarget.record}
                    onClose={() => setPayslipTarget(null)}
                />
            )}
            
            <div className="print-only mb-6 text-center border-b-2 border-slate-900 pb-4">
                <h1 className="text-xl font-black mb-1">كشف رواتب الموظفين الشهري</h1>
                <p className="text-base font-bold">للفترة: {customRange ? `${startDateStr} إلى ${endDateStr}` : selectedMonth}</p>
                <div className="flex justify-between items-end mt-2 text-xs font-bold">
                    <span>اسم المنشأة: .................................</span>
                    <span>تاريخ الطباعة: {new Date().toLocaleDateString('ar-EG')}</span>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setActiveTab('dashboard')}
                        className="p-3 bg-white text-slate-400 rounded-full border border-slate-100 shadow-sm hover:bg-indigo-600 hover:text-white transition-all"
                        title="العودة للرئيسية"
                    >
                        <Icon name="arrow-right" size={20} />
                    </button>
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                            <Icon name="banknote" className="text-emerald-600" size={32} /> كشف الرواتب الشهري
                        </h2>
                        <p className="text-slate-500 font-bold tracking-wide text-xs">إدارة المستحقات، الاستقطاعات، والتسويات المالية لكل موظف</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative no-print">
                        <Icon name="search" size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="بحث بالاسم أو الكود..." 
                            className="bg-white border border-slate-100 rounded-full py-2 pr-10 pl-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all w-48 md:w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => setIsSinglePage(!isSinglePage)}
                        className={`px-4 py-2 rounded-full font-black text-xs transition-all border-2 ${isSinglePage ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
                    >
                        {isSinglePage ? 'وضع الصفحة الواحدة: مفعل' : 'وضع الصفحة الواحدة: معطل'}
                    </button>
                    <button 
                        onClick={handlePrint}
                        className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-black flex items-center gap-2 shadow-lg hover:bg-slate-800 transition-all"
                    >
                        <Icon name="printer" size={18} /> طباعة الكشف الكامل
                    </button>
                    <button 
                        onClick={() => {
                            const element = document.createElement('div');
                            element.className = 'pdf-container';
                            element.style.width = '297mm'; 
                            element.innerHTML = `
                                <div class="pdf-header">
                                    <div style="text-align: right">
                                        <div style="font-weight: 900; font-size: 14px">شركة طيبة للاستثمار العقارى والتطوير العمراني</div>
                                        <div style="font-size: 10px; color: #64748b">تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}</div>
                                    </div>
                                    <div class="pdf-title">كشف الرواتب الشهري - ${selectedMonth}</div>
                                </div>
                                <table class="pdf-table" style="font-size: 8px">
                                    <thead>
                                        <tr>
                                            <th>م</th>
                                            <th>الكود</th>
                                            <th>الاسم</th>
                                            <th>الأساسي</th>
                                            <th>الإجمالي</th>
                                            <th>تأخير (س)</th>
                                            <th>خصم يدوي (ي)</th>
                                            <th>استقطاعات</th>
                                            <th>صافي الراتب</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${employees.map((emp, i) => {
                                            const record = (payrollRecords[currentMonthKey] && payrollRecords[currentMonthKey][emp.id]) || {};
                                            const { totalDeductions, netSalary } = calculateTotals(record);
                                            return `
                                                <tr>
                                                    <td>${i + 1}</td>
                                                    <td>${emp.code}</td>
                                                    <td>${emp.name}</td>
                                                    <td>${record.basicSalary || 0}</td>
                                                    <td>${record.grossSalary || 0}</td>
                                                    <td>${record.lateCount || 0}</td>
                                                    <td>${record.manualDeductionDays || 0}</td>
                                                    <td>${Math.round(totalDeductions)}</td>
                                                    <td style="font-weight: 900; color: #059669">${Math.round(netSalary)}</td>
                                                </tr>
                                            `;
                                        }).join('')}
                                    </tbody>
                                </table>
                            `;
                            const opt = {
                                margin: 0,
                                filename: `payroll-${selectedMonth}.pdf`,
                                image: { type: 'jpeg' as const, quality: 0.98 },
                                html2canvas: { scale: 2, useCORS: true },
                                jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'landscape' as const }
                            };
                            html2pdf().set(opt).from(element).save();
                        }}
                        className="bg-emerald-600 text-white px-6 py-2.5 rounded-full font-black flex items-center gap-2 shadow-lg hover:bg-emerald-700 transition-all"
                    >
                        <Icon name="download" size={18} /> تنزيل PDF
                    </button>
                    
                    <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                        <button 
                            onClick={() => setCustomRange(!customRange)} 
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${customRange ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
                        >
                            {customRange ? 'فترة مخصصة' : 'دورة شهرية'}
                        </button>
                        
                        {!customRange ? (
                            <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="outline-none font-bold text-slate-700 bg-transparent text-sm px-2" />
                        ) : (
                            <div className="flex items-center gap-2 px-2">
                                <input type="date" value={startDateStr} onChange={(e) => setStartDateStr(e.target.value)} className="outline-none font-bold text-slate-700 bg-transparent text-xs" />
                                <span className="text-slate-300 text-[10px]">إلى</span>
                                <input type="date" value={endDateStr} onChange={(e) => setEndDateStr(e.target.value)} className="outline-none font-bold text-slate-700 bg-transparent text-xs" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className={`rounded-[30px] shadow-2xl overflow-hidden print:overflow-visible border bg-white border-slate-200 landscape-page ${isSinglePage ? 'print-one-page' : ''}`}>
                <div className="hidden print:block text-center mb-2 border-b-2 border-slate-900 pb-2">
                    <h2 className="text-xs font-black text-indigo-600 mb-0.5">شركة طيبة للاستثمار العقارى والتطوير العمراني</h2>
                    <h1 className="text-xl font-black text-slate-900">كشف الرواتب الشهري - {selectedMonth}</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[7px]">Monthly Payroll Register</p>
                </div>
                <div className="overflow-x-auto print:overflow-visible payroll-print-wrapper scroll-smooth">
                    <table className="w-full text-[10px] md:text-[11px] text-center payroll-table border-collapse min-w-full">
                        <thead>
                            <tr className="bg-slate-50 text-slate-700 font-black">
                                <th rowSpan={2} className="px-1 py-2 bg-slate-100 w-[2%]">م</th>
                                <th rowSpan={2} className="px-1 py-2 bg-slate-100 w-[3%]">الكود</th>
                                <th rowSpan={2} className="px-2 py-2 bg-slate-100 w-[15%] text-right">اسم الموظف</th>
                                <th rowSpan={2} className="px-1 py-2 bg-slate-100 w-[5%]">الراتب الأساسي</th>
                                <th rowSpan={2} className="px-1 py-2 bg-slate-100 w-[5%]">بدل هاتف</th>
                                <th rowSpan={2} className="px-1 py-2 bg-slate-100 w-[5%]">بدل مواصلات</th>
                                <th rowSpan={2} className="px-1 py-2 bg-slate-100 w-[5%]">بدل سهر</th>
                                <th rowSpan={2} className="px-1 py-2 bg-slate-100 w-[7%]">الراتب الإجمالي</th>
                                <th colSpan={2} className="bg-yellow-400 text-white w-[6%]">الأجازة بخصم</th>
                                <th colSpan={2} className="bg-rose-600 text-white w-[6%]">الجزاءات</th>
                                <th colSpan={2} className="bg-orange-500 text-white w-[6%]">الغياب</th>
                                <th colSpan={2} className="bg-sky-500 text-white w-[6%]">التأخير</th>
                                <th rowSpan={2} className="bg-amber-500 text-white w-[4%]">خصم يدوي (يوم)</th>
                                <th rowSpan={2} className="bg-emerald-500 text-white w-[4%]">قسط السُلفة</th>
                                <th colSpan={2} className="bg-indigo-500 text-white w-[6%]">تسويات</th>
                                <th rowSpan={2} className="px-1 py-2 bg-emerald-50 text-emerald-600 w-[6%] font-black">إجمالي السُلفة</th>
                                <th rowSpan={2} className="px-1 py-2 bg-rose-50 text-rose-700 w-[7%]">إجمالي استقطاع</th>
                                <th rowSpan={2} className="px-1 py-2 bg-emerald-50 text-emerald-700 font-black text-[10px] w-[8%]">صافي الراتب</th>
                                <th rowSpan={2} className="px-1 py-2 bg-slate-50 w-[7%]">ملاحظات</th>
                                <th rowSpan={2} className="px-1 py-2 bg-slate-50 no-print w-[3%]">إجراء</th>
                            </tr>
                            <tr className="bg-slate-50 text-slate-600 font-bold">
                                <th className="bg-yellow-100">عدد</th><th className="bg-yellow-100">قيمة</th>
                                <th className="bg-rose-100">عدد</th><th className="bg-rose-100">قيمة</th>
                                <th className="bg-orange-100">عدد</th><th className="bg-orange-100">قيمة</th>
                                <th className="bg-sky-100">عدد</th><th className="bg-sky-100">قيمة</th>
                                <th className="bg-indigo-100">خصم</th><th className="bg-indigo-100">إضافة</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {employees
                                .filter(emp => emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || emp.code.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map((emp, i) => {
                                const record = (payrollRecords[currentMonthKey] && payrollRecords[currentMonthKey][emp.id]) || { settlements: [] };
                                const { totalDeductions, netSalary } = calculateTotals(record);
                                return (
                                    <tr key={emp.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-1 py-2 font-bold text-slate-400">{i + 1}</td>
                                        <td className="px-1 py-2 font-mono font-bold text-indigo-600">{emp.code}</td>
                                        <td className="px-2 py-2 text-right font-black text-slate-800">
                                            <div className="flex justify-between items-center gap-1">
                                                <span>{emp.name}</span>
                                                <button 
                                                    onClick={() => setSettlementTarget({ emp, record })}
                                                    className="no-print p-1 text-indigo-400 hover:text-indigo-600 transition-colors"
                                                    title="إضافة تسوية مالية"
                                                >
                                                    <Icon name="plus-square" size={14} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-1 py-1"><input type="number" value={record.basicSalary || ''} onChange={e => updateField(emp.id, 'basicSalary', e.target.value)} className="w-full text-center bg-transparent focus:bg-white outline-none" /></td>
                                        <td className="px-1 py-1"><input type="number" value={record.mobileAllowance || ''} onChange={e => updateField(emp.id, 'mobileAllowance', e.target.value)} className="w-full text-center bg-transparent focus:bg-white outline-none" /></td>
                                        <td className="px-1 py-1"><input type="number" value={record.transportAllowance || ''} onChange={e => updateField(emp.id, 'transportAllowance', e.target.value)} className="w-full text-center bg-transparent focus:bg-white outline-none" /></td>
                                        <td className="px-1 py-1"><input type="number" value={record.overtimeAllowance || ''} onChange={e => updateField(emp.id, 'overtimeAllowance', e.target.value)} className="w-full text-center bg-transparent focus:bg-white outline-none" /></td>
                                        <td className="px-1 py-1 bg-slate-50"><input type="number" value={record.grossSalary || ''} readOnly className="w-full text-center bg-transparent outline-none font-bold cursor-default" /></td>
                                        
                                        <td className="px-1 py-1 bg-yellow-50/30"><input type="number" value={record.leaveCount || ''} onChange={e => updateField(emp.id, 'leaveCount', e.target.value)} className="w-full text-center bg-transparent outline-none" /></td>
                                        <td className="px-1 py-1 bg-yellow-50/30 font-bold"><input type="number" value={Math.round(record.leaveVal) || ''} onChange={e => updateField(emp.id, 'leaveVal', e.target.value)} className="w-full text-center bg-transparent outline-none" /></td>
                                        
                                        <td className="px-1 py-1 bg-rose-50/30"><input type="number" value={record.penaltyCount || ''} onChange={e => updateField(emp.id, 'penaltyCount', e.target.value)} className="w-full text-center bg-transparent outline-none" /></td>
                                        <td className="px-1 py-1 bg-rose-50/30 font-bold"><input type="number" value={record.penaltyVal || ''} onChange={e => updateField(emp.id, 'penaltyVal', e.target.value)} className="w-full text-center bg-transparent outline-none" /></td>
                                        
                                        <td className="px-1 py-1 bg-orange-50/30"><input type="number" value={record.absenceCount || ''} onChange={e => updateField(emp.id, 'absenceCount', e.target.value)} className="w-full text-center bg-transparent outline-none" /></td>
                                        <td className="px-1 py-1 bg-orange-50/30 font-bold"><input type="number" value={Math.round(record.absenceVal) || ''} onChange={e => updateField(emp.id, 'absenceVal', e.target.value)} className="w-full text-center bg-transparent outline-none" /></td>

                                        <td className="px-1 py-1 bg-sky-50/30"><input type="number" value={record.lateCount || ''} onChange={e => updateField(emp.id, 'lateCount', e.target.value)} className="w-full text-center bg-transparent outline-none" /></td>
                                        <td className="px-1 py-1 bg-sky-50/30 font-bold"><input type="number" value={Math.round(record.lateVal) || ''} onChange={e => updateField(emp.id, 'lateVal', e.target.value)} className="w-full text-center bg-transparent outline-none" /></td>
                                        
                                        <td className="px-1 py-1 bg-amber-50/30 font-bold"><input type="number" value={record.manualDeductionDays || ''} onChange={e => updateField(emp.id, 'manualDeductionDays', e.target.value)} className="w-full text-center bg-transparent outline-none" /></td>

                                        <td className="px-1 py-1 bg-emerald-50/30 font-bold"><input type="number" value={record.advanceInstallment || ''} onChange={e => updateField(emp.id, 'advanceInstallment', e.target.value)} className="w-full text-center bg-transparent outline-none" /></td>

                                        <td className="px-1 py-1 bg-indigo-50/50">
                                            <div className="flex flex-col items-center">
                                                <input 
                                                    type="number" 
                                                    value={record.adjDeduction || ''} 
                                                    onChange={e => updateField(emp.id, 'adjDeduction', e.target.value)}
                                                    className="w-full text-center bg-transparent outline-none text-rose-600 font-bold" 
                                                />
                                                {record.settlements?.filter(s => s.type === 'deduction').length > 0 && <span className="text-[7px] text-slate-400 no-print">({record.settlements.filter(s => s.type === 'deduction').length})</span>}
                                            </div>
                                        </td>
                                        <td className="px-1 py-1 bg-indigo-50/50">
                                            <div className="flex flex-col items-center">
                                                <input 
                                                    type="number" 
                                                    value={record.adjAddition || ''} 
                                                    onChange={e => updateField(emp.id, 'adjAddition', e.target.value)}
                                                    className="w-full text-center bg-transparent outline-none text-emerald-600 font-bold" 
                                                />
                                                {record.settlements?.filter(s => s.type === 'addition').length > 0 && <span className="text-[7px] text-slate-400 no-print">({record.settlements.filter(s => s.type === 'addition').length})</span>}
                                            </div>
                                        </td>
                                        
                                        <td className="px-1 py-1 bg-emerald-50/30 font-bold"><input type="number" value={record.advanceTotal || ''} onChange={e => updateField(emp.id, 'advanceTotal', e.target.value)} className="w-full text-center bg-transparent outline-none" /></td>
                                        
                                        <td className="px-1 py-2 bg-rose-50/50 font-black text-rose-700 print:text-[8px]">{Math.round(totalDeductions)}</td>
                                        <td className="px-1 py-2 bg-emerald-50/50 font-black text-emerald-700 text-[10px] print:text-[14px]">{Math.round(netSalary)}</td>
                                        
                                        <td className="px-1 py-1">
                                            <textarea 
                                                rows={1}
                                                className="w-full bg-transparent focus:bg-white border-none outline-none text-[8px] resize-none" 
                                                value={record.notes || ''} 
                                                onChange={e => updateField(emp.id, 'notes', e.target.value)}
                                                placeholder="..."
                                            />
                                        </td>

                                        <td className="px-1 py-2 text-center no-print">
                                            <button 
                                                onClick={() => setPayslipTarget({ emp, record })}
                                                className="p-1.5 bg-slate-100 text-slate-400 rounded-lg hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                                title="عرض مفردات المرتب"
                                            >
                                                <Icon name="file-text" size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="print-only print-signatures">
                <div>مدير حسابات</div>
                <div>مدير الموارد البشرية</div>
                <div>المدير التنفيذى</div>
                <div>اعتماد</div>
            </div>
        </div>
    );
});
