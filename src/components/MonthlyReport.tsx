import React, { useState, useMemo } from 'react';
import { Icon } from './Icon';
import html2pdf from 'html2pdf.js';
import { calculateDetailedAttendance, calculateDeduction } from '../utils';
import { WarningModal } from './WarningModal';

interface MonthlyReportProps {
    employees: any[];
    attendanceLog: any;
    setAttendanceLog: React.Dispatch<React.SetStateAction<any>>;
    shifts: any;
}

export const MonthlyReport = React.memo(({ employees, attendanceLog, setAttendanceLog, shifts }: MonthlyReportProps) => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [selectedEmpId, setSelectedEmpId] = useState('all');
    const [customRange, setCustomRange] = useState(false);
    const [startDateStr, setStartDateStr] = useState('');
    const [endDateStr, setEndDateStr] = useState('');
    const [isSinglePage, setIsSinglePage] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [warningEmp, setWarningEmp] = useState<any>(null);

    const handlePrint = () => {
        if (isSinglePage) document.body.classList.add('single-page-mode');
        window.print();
        document.body.classList.remove('single-page-mode');
    };

    const monthData = useMemo(() => {
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
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
        return days;
    }, [selectedMonth, customRange, startDateStr, endDateStr]);

    const getDayName = (date: Date) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
    };

    const reportRecords = useMemo(() => {
        const emps = selectedEmpId === 'all' 
            ? employees.filter(emp => emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || emp.code.toLowerCase().includes(searchQuery.toLowerCase()))
            : employees.filter(e => e.id === selectedEmpId);
        
        return emps.map(emp => {
            const records = monthData.map((dateObj, idx) => {
                const dateStr = dateObj.toISOString().split('T')[0];
                const record = (attendanceLog[dateStr] && attendanceLog[dateStr][emp.id]) || null;
                
                const empShift = record?.shift || emp.shift || (Object.values(shifts)[0] as any).name;
                const details = calculateDetailedAttendance(record?.arrivalTime, record?.departureTime, empShift, shifts);

                return { 
                    no: idx + 1,
                    date: dateStr, 
                    day: getDayName(dateObj),
                    in: record?.arrivalTime || '',
                    out: record?.departureTime || '',
                    total: record?.totalHours !== undefined ? record.totalHours : details.total,
                    late: record?.lateHours !== undefined ? record.lateHours : details.late,
                    early: record?.earlyHours !== undefined ? record.earlyHours : details.early,
                    lateDed: record?.lateDeduction || 0,
                    earlyDed: record?.earlyDeduction || 0,
                    shift: empShift,
                    ded: record?.deduction !== undefined ? record.deduction : (record ? calculateDeduction(record.arrivalTime, record.departureTime, empShift, shifts) : 0),
                    ot: record?.overtimeHours !== undefined ? record.overtimeHours : details.ot,
                    notes: record?.notes || '',
                    isWeekend: dateObj.getDay() === 5 || dateObj.getDay() === 6
                };
            });

            const totalDeduction = records.reduce((acc, curr) => acc + Number(curr.ded), 0);
            const presentDays = records.filter(r => r.in).length;
            const totalOTMin = records.reduce((acc, curr) => {
                if (!curr.ot || curr.ot === '0:00') return acc;
                const [h, m] = curr.ot.split(':').map(Number);
                return acc + (h * 60 + m);
            }, 0);
            const totalOTStr = `${Math.floor(totalOTMin / 60)}:${(totalOTMin % 60).toString().padStart(2, '0')}`;

            return { emp, records, totalDeduction, presentDays, totalOTStr };
        });
    }, [employees, attendanceLog, selectedMonth, selectedEmpId, customRange, startDateStr, endDateStr, shifts, monthData, searchQuery]);

    const monthName = useMemo(() => {
        if (customRange && startDateStr && endDateStr) {
            return `${startDateStr} to ${endDateStr}`;
        }
        const [year, month] = selectedMonth.split('-').map(Number);
        return new Date(year, month - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
    }, [selectedMonth, customRange, startDateStr, endDateStr]);

    const updateReportRecord = (date: string, empId: string, field: string, value: any) => {
        const newLog = { ...attendanceLog };
        if (!newLog[date]) newLog[date] = {};
        if (!newLog[date][empId]) newLog[date][empId] = { arrivalTime: '', departureTime: '', deduction: 0, lateDeduction: 0, earlyDeduction: 0, shift: '', notes: '' };
        
        if (field === 'shift') {
            Object.values(shifts).forEach((s: any) => {
                if (value === s.name.split(' (')[0] || value === s.name) {
                    value = s.name;
                }
            });
        }
        newLog[date][empId] = { ...newLog[date][empId], [field]: value };
        
        if (field === 'lateDeduction' || field === 'earlyDeduction') {
            newLog[date][empId].deduction = (parseFloat(newLog[date][empId].lateDeduction) || 0) + (parseFloat(newLog[date][empId].earlyDeduction) || 0);
        }
        
        setAttendanceLog(newLog);
        localStorage.setItem('hr_attendance', JSON.stringify(newLog));
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12 bg-white min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print p-8 bg-slate-50 border-b">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                        <Icon name="file-bar-chart" className="text-indigo-600" size={32} /> تقرير الحضور التفصيلي
                    </h2>
                    <p className="text-slate-500 font-bold">نموذج التقرير المعتمد للموظفين</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-white border p-1 rounded-xl shadow-sm">
                        <button 
                            onClick={() => setCustomRange(!customRange)} 
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${customRange ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
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

                    <div className="relative">
                        <Icon name="search" size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="بحث بالاسم أو الكود..." 
                            className="bg-white border border-slate-200 rounded-xl py-2 pr-10 pl-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all w-48"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <select value={selectedEmpId} onChange={(e) => setSelectedEmpId(e.target.value)} className="bg-white border p-2.5 rounded-xl font-bold outline-none text-sm">
                        <option value="all">كافة الموظفين</option>
                        {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                    
                    <button 
                        onClick={() => setIsSinglePage(!isSinglePage)}
                        className={`px-4 py-2 rounded-xl font-bold text-xs transition-all border-2 ${isSinglePage ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-100 text-slate-500'}`}
                    >
                        {isSinglePage ? 'صفحة واحدة: مفعل' : 'صفحة واحدة: معطل'}
                    </button>
                    
                    <button onClick={handlePrint} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black flex items-center gap-2 shadow-lg hover:bg-slate-800 transition-all">
                        <Icon name="printer" size={18} /> طباعة
                    </button>
                    <button 
                        onClick={() => {
                            const element = document.createElement('div');
                            element.className = 'pdf-container';
                            element.innerHTML = `
                                <div class="pdf-header">
                                    <div style="text-align: right">
                                        <div style="font-weight: 900; font-size: 14px">شركة طيبة للاستثمار العقارى والتطوير العمراني</div>
                                        <div style="font-size: 10px; color: #64748b">تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}</div>
                                    </div>
                                    <div class="pdf-title">تقرير الحضور التفصيلي - ${selectedMonth}</div>
                                </div>
                                ${employees.filter(emp => selectedEmpId === 'all' || emp.id === selectedEmpId).map(emp => {
                                    const days = monthData.map(d => d.toISOString().split('T')[0]);
                                    return `
                                        <div style="margin-bottom: 30px; page-break-inside: avoid">
                                            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1e293b; padding-bottom: 5px; margin-bottom: 10px">
                                                <div style="font-weight: 900; font-size: 14px">${emp.name} (${emp.code})</div>
                                                <div style="font-size: 10px">${emp.department}</div>
                                            </div>
                                            <table class="pdf-table" style="font-size: 8px">
                                                <thead>
                                                    <tr>
                                                        <th>التاريخ</th>
                                                        <th>الحضور</th>
                                                        <th>الانصراف</th>
                                                        <th>تأخير</th>
                                                        <th>مبكر</th>
                                                        <th>خصم يدوي</th>
                                                        <th>ملاحظات</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    ${days.map(date => {
                                                        const rec = attendanceLog[date]?.[emp.id] || {};
                                                        if (!rec.arrivalTime && !rec.departureTime) return '';
                                                        return `
                                                            <tr>
                                                                <td>${date}</td>
                                                                <td>${rec.arrivalTime || '-'}</td>
                                                                <td>${rec.departureTime || '-'}</td>
                                                                <td>${rec.lateDeduction || 0}</td>
                                                                <td>${rec.earlyDeduction || 0}</td>
                                                                <td>${rec.manualDeduction || 0}</td>
                                                                <td>${rec.notes || ''}</td>
                                                            </tr>
                                                        `;
                                                    }).join('')}
                                                </tbody>
                                            </table>
                                        </div>
                                    `;
                                }).join('')}
                                <div class="print-signatures" style="margin-top: 50px; display: flex; justify-content: space-between; gap: 40px; width: 100%; padding: 0 40px 40px 40px;">
                                    <div style="flex: 1; border-top: 2px solid #000; padding-top: 10px; text-align: center; font-weight: 900; font-size: 12px;">مدير حسابات</div>
                                    <div style="flex: 1; border-top: 2px solid #000; padding-top: 10px; text-align: center; font-weight: 900; font-size: 12px;">مدير الموارد البشرية</div>
                                    <div style="flex: 1; border-top: 2px solid #000; padding-top: 10px; text-align: center; font-weight: 900; font-size: 12px;">المدير التنفيذى</div>
                                </div>
                            `;
                            const opt = {
                                margin: 5,
                                filename: `monthly-report-${selectedMonth}.pdf`,
                                image: { type: 'jpeg' as const, quality: 0.98 },
                                html2canvas: { scale: 2, useCORS: true },
                                jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
                            };
                            html2pdf().set(opt).from(element).save();
                        }}
                        className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-black flex items-center gap-2 shadow-lg hover:bg-emerald-700 transition-all"
                    >
                        <Icon name="download" size={18} /> تنزيل PDF
                    </button>
                </div>
            </div>

            <div className={`space-y-6 print:space-y-0 max-w-[1200px] mx-auto p-4 md:p-8 print:p-0 monthly-report-container ${isSinglePage ? 'print-one-page' : ''}`}>
                {reportRecords
                    .filter(({ emp }) => emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || emp.code.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(({ emp, records, totalDeduction, presentDays, totalOTStr }) => (
                    <div key={emp.id} className="report-container bg-white text-slate-900" style={{ pageBreakAfter: 'always' }}>
                        <div className="text-center space-y-1 mb-4 print:mb-0.5 print:space-y-0">
                            <h1 className="text-xl print:text-sm font-bold uppercase tracking-widest">Monthly Attendance Report</h1>
                            <p className="text-sm font-bold">{customRange ? `${startDateStr} to ${endDateStr}` : monthName}</p>
                        </div>

                        <div className="flex justify-between items-end mb-4 px-2 print:mb-0.5">
                            <div className="space-y-1 text-sm print:text-[10px] font-bold">
                                <p>Employee Name: <span className="border-b border-slate-300 px-4 inline-block min-w-[200px]">{emp.name}</span></p>
                                <p>No.: <span className="border-b border-slate-300 px-4 inline-block min-w-[100px]">{emp.code}</span></p>
                            </div>
                            <div className="text-sm print:text-[10px] font-bold">
                                <p>Month: <span className="border-b border-slate-300 px-4 inline-block min-w-[150px]">{monthName}</span></p>
                            </div>
                        </div>

                        <div className="overflow-x-auto border border-slate-300 report-table-wrapper">
                            <table className="w-full text-center text-[11px] print:text-[12px] border-collapse">
                                <thead>
                                    <tr className="bg-slate-100 border-b border-slate-300">
                                        <th className="border-r border-slate-300 py-2 print:py-0.5 w-8">م</th>
                                        <th className="border-r border-slate-300 py-2 print:py-0.5 w-20">التاريخ</th>
                                        <th className="border-r border-slate-300 py-2 print:py-0.5 w-20">اليوم</th>
                                        <th className="border-r border-slate-300 py-2 print:py-0.5 w-14">الوردية</th>
                                        <th className="border-r border-slate-300 py-2 print:py-0.5 w-14">دخول</th>
                                        <th className="border-r border-slate-300 py-2 print:py-0.5 w-14">خروج</th>
                                        <th className="border-r border-slate-300 py-2 print:py-0.5 w-14">إجمالي</th>
                                        <th className="border-r border-slate-300 py-2 print:py-0.5 w-14">تأخير (س)</th>
                                        <th className="border-r border-slate-300 py-2 print:py-0.5 w-14">مبكر (س)</th>
                                        <th className="border-r border-slate-300 py-2 print:py-0.5 w-14">خصم</th>
                                        <th className="border-r border-slate-300 py-2 print:py-0.5 w-14">إضافي</th>
                                        <th className="py-2 print:py-0.5">ملاحظات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map((r) => (
                                        <tr key={r.date} className={`border-b border-slate-200 ${r.isWeekend ? 'bg-emerald-50/50' : ''}`}>
                                            <td className="border-r border-slate-200 py-1 print:py-0 font-bold">{r.no}</td>
                                            <td className="border-r border-slate-200 py-1 print:py-0">{new Date(r.date).toLocaleDateString('en-GB')}</td>
                                            <td className="border-r border-slate-200 py-1 print:py-0 font-bold">{r.day}</td>
                                            <td className="border-r border-slate-200 py-1 print:py-0">
                                                <input 
                                                    type="text" 
                                                    value={r.shift} 
                                                    onChange={(e) => updateReportRecord(r.date, emp.id, 'shift', e.target.value)}
                                                    className="w-full text-center bg-transparent outline-none focus:bg-blue-50 print:text-[8px] print:h-auto"
                                                />
                                            </td>
                                            <td className="border-r border-slate-200 py-1 print:py-0">
                                                <input 
                                                    type="time" 
                                                    value={r.in} 
                                                    onChange={(e) => updateReportRecord(r.date, emp.id, 'arrivalTime', e.target.value)}
                                                    className="w-full text-center bg-transparent outline-none focus:bg-blue-50 print:text-[8px] print:h-auto"
                                                />
                                            </td>
                                            <td className="border-r border-slate-200 py-1 print:py-0">
                                                <input 
                                                    type="time" 
                                                    value={r.out} 
                                                    onChange={(e) => updateReportRecord(r.date, emp.id, 'departureTime', e.target.value)}
                                                    className="w-full text-center bg-transparent outline-none focus:bg-blue-50 print:text-[8px] print:h-auto"
                                                />
                                            </td>
                                            <td className="border-r border-slate-200 py-1 print:py-0">
                                                <input 
                                                    type="text" 
                                                    value={r.total} 
                                                    onChange={(e) => updateReportRecord(r.date, emp.id, 'totalHours', e.target.value)}
                                                    className="w-full text-center bg-transparent outline-none focus:bg-blue-50 print:text-[8px] print:h-auto"
                                                />
                                            </td>
                                            <td className="border-r border-slate-200 py-1 print:py-0 font-bold">
                                                <input 
                                                    type="number" 
                                                    step="0.5"
                                                    value={r.lateDed || 0} 
                                                    onChange={(e) => updateReportRecord(r.date, emp.id, 'lateDeduction', e.target.value)}
                                                    className="w-full text-center bg-transparent outline-none focus:bg-blue-50 print:text-[8px] print:h-auto"
                                                />
                                            </td>
                                            <td className="border-r border-slate-200 py-1 print:py-0 font-bold">
                                                <input 
                                                    type="number" 
                                                    step="0.5"
                                                    value={r.earlyDed || 0} 
                                                    onChange={(e) => updateReportRecord(r.date, emp.id, 'earlyDeduction', e.target.value)}
                                                    className="w-full text-center bg-transparent outline-none focus:bg-blue-50 print:text-[8px] print:h-auto"
                                                />
                                            </td>
                                            <td className="border-r border-slate-200 py-1 print:py-0 font-bold text-rose-600">
                                                <input 
                                                    type="number" 
                                                    value={r.ded} 
                                                    onChange={(e) => updateReportRecord(r.date, emp.id, 'deduction', parseFloat(e.target.value) || 0)}
                                                    className="w-full text-center bg-transparent outline-none focus:bg-blue-50 print:text-[8px] print:h-auto"
                                                />
                                            </td>
                                            <td className="border-r border-slate-200 py-1 print:py-0">
                                                <input 
                                                    type="text" 
                                                    value={r.ot} 
                                                    onChange={(e) => updateReportRecord(r.date, emp.id, 'overtimeHours', e.target.value)}
                                                    className="w-full text-center bg-transparent outline-none focus:bg-blue-50 print:text-[8px] print:h-auto"
                                                />
                                            </td>
                                            <td className="py-1 print:py-0 text-right px-2 text-[9px]">
                                                <div className="flex items-center gap-1">
                                                    <input 
                                                        type="text" 
                                                        value={r.notes} 
                                                        onChange={(e) => updateReportRecord(r.date, emp.id, 'notes', e.target.value)}
                                                        className="flex-1 text-right bg-transparent outline-none focus:bg-blue-50 print:text-[8px] print:h-auto"
                                                        placeholder="..."
                                                    />
                                                    <button 
                                                        onClick={() => setWarningEmp(emp)}
                                                        className="p-1 text-slate-400 hover:text-rose-500 no-print transition-colors"
                                                        title="إصدار إنذار"
                                                    >
                                                        <Icon name="alert-triangle" size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="mt-4 print:mt-0.5 flex justify-between px-10 print:px-2">
                            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 no-print">
                                <p className="text-[9px] font-black text-emerald-600 uppercase">أيام الحضور</p>
                                <p className="text-xl font-black text-emerald-700">{presentDays}</p>
                            </div>
                            <div className="bg-rose-50 p-3 rounded-xl border border-rose-100 no-print">
                                <p className="text-[9px] font-black text-rose-600 uppercase">إجمالي الخصم</p>
                                <p className="text-xl font-black text-rose-700">{totalDeduction} ساعة</p>
                            </div>
                            <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 no-print">
                                <p className="text-[9px] font-black text-indigo-600 uppercase">إجمالي الإضافي</p>
                                <p className="text-xl font-black text-indigo-700">{totalOTStr}</p>
                            </div>
                            <div className="hidden print:block text-lg font-black space-y-2 border-t-2 border-slate-900 pt-4">
                                <p className="flex justify-between gap-8"><span>أيام الحضور:</span> <span>{presentDays}</span></p>
                                <p className="flex justify-between gap-8"><span>إجمالي الخصم:</span> <span className="text-rose-700">{totalDeduction} ساعة</span></p>
                                <p className="flex justify-between gap-8"><span>إجمالي الإضافي:</span> <span className="text-emerald-700">{totalOTStr}</span></p>
                            </div>
                        </div>

                        <div className="flex-1"></div>
                        <div className="print-only print-signatures px-8 pb-8">
                            <div>مدير حسابات</div>
                            <div>مدير الموارد البشرية</div>
                            <div>المدير التنفيذى</div>
                        </div>
                    </div>
                ))}
            </div>
            {warningEmp && <WarningModal emp={warningEmp} onClose={() => setWarningEmp(null)} />}
        </div>
    );
});
