import React, { useState, useMemo } from 'react';
import { Icon } from '../components/Layout';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { ar } from 'date-fns/locale';

export const MonthlyReport = ({ employees, attendanceLog, payrollRecords }: any) => {
    const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));

    const reportData = useMemo(() => {
        const [year, month] = selectedMonth.split('-').map(Number);
        const start = startOfMonth(new Date(year, month - 1));
        const end = endOfMonth(start);
        const days = eachDayOfInterval({ start, end });

        return employees.map((emp: any) => {
            let totalDeductions = 0;
            let presentDays = 0;
            let absentDays = 0;

            days.forEach(day => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const record = attendanceLog[dateStr]?.[emp.id];
                if (record) {
                    if (record.arrivalTime || record.departureTime) {
                        presentDays++;
                        totalDeductions += parseFloat(record.deduction) || 0;
                    } else {
                        absentDays++;
                    }
                } else {
                    // Check if it's a weekend (Friday/Saturday)
                    const dayOfWeek = day.getDay();
                    if (dayOfWeek !== 5 && dayOfWeek !== 6) {
                        absentDays++;
                    }
                }
            });

            const payroll = payrollRecords[selectedMonth]?.[emp.id] || {};

            return {
                ...emp,
                presentDays,
                absentDays,
                totalDeductions,
                netSalary: payroll.netSalary || '---'
            };
        });
    }, [employees, attendanceLog, payrollRecords, selectedMonth]);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-800">التقرير الشهري الشامل</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">ملخص الأداء والرواتب والحضور</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => window.print()}
                        className="bg-slate-800 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg hover:bg-slate-900 transition-all"
                    >
                        <Icon name="printer" size={20} /> طباعة التقرير
                    </button>
                    <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                        <Icon name="calendar" className="text-slate-400" size={20} />
                        <input 
                            type="month" 
                            value={selectedMonth} 
                            onChange={(e) => setSelectedMonth(e.target.value)} 
                            className="outline-none font-bold text-slate-700 bg-transparent" 
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 no-print">
                <div className="bg-white p-6 rounded-[30px] border border-slate-100 shadow-sm">
                    <p className="text-xs font-black text-slate-400 uppercase mb-1">إجمالي الموظفين</p>
                    <p className="text-3xl font-black text-slate-800">{employees.length}</p>
                </div>
                <div className="bg-white p-6 rounded-[30px] border border-slate-100 shadow-sm">
                    <p className="text-xs font-black text-slate-400 uppercase mb-1">متوسط الحضور</p>
                    <p className="text-3xl font-black text-indigo-600">
                        {employees.length ? (reportData.reduce((acc: number, curr: any) => acc + curr.presentDays, 0) / employees.length).toFixed(1) : 0} يوم
                    </p>
                </div>
                <div className="bg-white p-6 rounded-[30px] border border-slate-100 shadow-sm">
                    <p className="text-xs font-black text-slate-400 uppercase mb-1">إجمالي الخصومات</p>
                    <p className="text-3xl font-black text-rose-500">
                        {reportData.reduce((acc: number, curr: any) => acc + curr.totalDeductions, 0)} س
                    </p>
                </div>
                <div className="bg-white p-6 rounded-[30px] border border-slate-100 shadow-sm">
                    <p className="text-xs font-black text-slate-400 uppercase mb-1">حالة التقرير</p>
                    <p className="text-3xl font-black text-emerald-500">مكتمل</p>
                </div>
            </div>

            <div className="rounded-[40px] shadow-2xl overflow-hidden border bg-white border-slate-100 print:border-none print:shadow-none">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-[11px] font-black uppercase tracking-wider border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-6">الموظف</th>
                                <th className="px-6 py-6">الإدارة</th>
                                <th className="px-4 py-6 text-center">أيام الحضور</th>
                                <th className="px-4 py-6 text-center">أيام الغياب</th>
                                <th className="px-4 py-6 text-center">تأخيرات (س)</th>
                                <th className="px-6 py-6 text-center">صافي الراتب</th>
                                <th className="px-6 py-6">الحالة</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {reportData.map((data: any) => (
                                <tr key={data.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-5">
                                        <span className="font-black block text-slate-800">{data.name}</span>
                                        <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">{data.jobTitle}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-black">{data.department}</span>
                                    </td>
                                    <td className="px-4 py-5 text-center font-black text-emerald-600">{data.presentDays}</td>
                                    <td className="px-4 py-5 text-center font-black text-rose-500">{data.absentDays}</td>
                                    <td className="px-4 py-5 text-center font-black text-amber-600">{data.totalDeductions}</td>
                                    <td className="px-6 py-5 text-center font-black text-indigo-600">{data.netSalary}</td>
                                    <td className="px-6 py-5">
                                        <span className="flex items-center gap-2 text-[10px] font-black text-emerald-500">
                                            <Icon name="check-circle" size={14} /> منتظم
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
