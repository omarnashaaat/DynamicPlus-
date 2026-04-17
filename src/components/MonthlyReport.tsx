import React, { useState, useMemo } from 'react';
import { Icon } from './ui/Icon';
import { calculateDetailedAttendance, calculateDeduction } from '../lib/hr-logic';

interface MonthlyReportProps {
  employees: any[];
  attendanceLog: any;
  setAttendanceLog: React.Dispatch<React.SetStateAction<any>>;
  shifts: any;
  rules: any;
  showToast: (msg: string, type?: any) => void;
}

export default function MonthlyReport({ employees, attendanceLog, setAttendanceLog, shifts, rules, showToast }: MonthlyReportProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedEmpId, setSelectedEmpId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const monthData = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const startDate = new Date(year, month - 2, 26); 
    const endDate = new Date(year, month - 1, 25);  
    
    const days = [];
    let current = new Date(startDate);
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  }, [selectedMonth]);

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
        const details = calculateDetailedAttendance(record?.arrivalTime, record?.departureTime, empShift, shifts, rules, dateStr);

        return { 
          no: idx + 1,
          date: dateStr, 
          day: getDayName(dateObj),
          in: record?.arrivalTime || '',
          out: record?.departureTime || '',
          total: details.total,
          late: details.late,
          early: details.early,
          ded: record?.deduction !== undefined ? record.deduction : (record ? calculateDeduction(record.arrivalTime, record.departureTime, empShift, shifts, rules, dateStr).total : 0),
          ot: details.ot,
          notes: record?.notes || '',
          isWeekend: dateObj.getDay() === 5 || dateObj.getDay() === 6
        };
      });

      const totalDeduction = records.reduce((acc, curr) => acc + Number(curr.ded), 0);
      const totalOTMin = records.reduce((acc, curr) => {
        if (!curr.ot || curr.ot === '0:00') return acc;
        const [h, m] = curr.ot.split(':').map(Number);
        return acc + (h * 60 + m);
      }, 0);
      const totalOTStr = `${Math.floor(totalOTMin / 60)}:${(totalOTMin % 60).toString().padStart(2, '0')}`;

      return { emp, records, totalDeduction, totalOTStr };
    });
  }, [employees, attendanceLog, selectedMonth, selectedEmpId, searchQuery]);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <Icon name="file-chart-column" className="text-indigo-600" size={32} /> تقرير الحضور التفصيلي
          </h2>
          <p className="text-slate-500 font-bold">نموذج التقرير المعتمد للموظفين</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="bg-slate-50 border p-2.5 rounded-xl font-bold outline-none" />
          <select value={selectedEmpId} onChange={(e) => setSelectedEmpId(e.target.value)} className="bg-slate-50 border p-2.5 rounded-xl font-bold outline-none">
            <option value="all">كافة الموظفين</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
          <div className="relative">
            <Icon name="search" size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="بحث..." className="bg-slate-50 border rounded-xl py-2 pr-10 pl-4 text-xs font-bold outline-none" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <button onClick={() => window.print()} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-black text-xs hover:bg-indigo-700 transition-all flex items-center gap-2">
            <Icon name="printer" size={16} /> طباعة
          </button>
        </div>
      </div>

      <div className="space-y-12">
        {reportRecords.map(({ emp, records, totalDeduction, totalOTStr }) => (
          <div key={emp.id} className="bg-white p-10 rounded-[50px] shadow-2xl border border-slate-100 print:p-0 print:shadow-none print:border-none">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black uppercase tracking-widest">Monthly Attendance Report</h1>
              <p className="text-slate-500 font-bold">{selectedMonth}</p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8 border-b pb-8">
              <div className="space-y-1">
                <p className="text-xs font-black text-slate-400 uppercase">Employee Name</p>
                <p className="text-xl font-black">{emp.name}</p>
              </div>
              <div className="text-left space-y-1">
                <p className="text-xs font-black text-slate-400 uppercase">Employee Code</p>
                <p className="text-xl font-black font-mono">{emp.code}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-[10px] border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b">
                    <th className="py-3 px-2">#</th>
                    <th className="py-3 px-2">Date</th>
                    <th className="py-3 px-2">Day</th>
                    <th className="py-3 px-2">In</th>
                    <th className="py-3 px-2">Out</th>
                    <th className="py-3 px-2">Total</th>
                    <th className="py-3 px-2">Late</th>
                    <th className="py-3 px-2">Early</th>
                    <th className="py-3 px-2 bg-rose-50 text-rose-600">Ded</th>
                    <th className="py-3 px-2 bg-emerald-50 text-emerald-600">OT</th>
                    <th className="py-3 px-2">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {records.map((r) => (
                    <tr key={r.date} className={`${r.isWeekend ? 'bg-slate-50/50' : 'hover:bg-slate-50/30'}`}>
                      <td className="py-2">{r.no}</td>
                      <td className="py-2 font-mono">{r.date}</td>
                      <td className="py-2 font-bold">{r.day}</td>
                      <td className="py-2 font-mono">{r.in || '-'}</td>
                      <td className="py-2 font-mono">{r.out || '-'}</td>
                      <td className="py-2">{r.total}</td>
                      <td className="py-2 text-rose-500">{r.late !== '0.00' ? r.late : '-'}</td>
                      <td className="py-2 text-rose-500">{r.early !== '0.00' ? r.early : '-'}</td>
                      <td className="py-2 font-black text-rose-700">{r.ded || '-'}</td>
                      <td className="py-2 font-black text-emerald-600">{r.ot !== '0:00' ? r.ot : '-'}</td>
                      <td className="py-2 text-right text-[9px] text-slate-400">{r.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex justify-between items-center bg-slate-900 text-white p-8 rounded-3xl">
              <div className="flex gap-12">
                <div>
                  <p className="text-[10px] font-black uppercase opacity-50">Total Deductions</p>
                  <p className="text-3xl font-black">{totalDeduction} Hours</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase opacity-50">Total Overtime</p>
                  <p className="text-3xl font-black">{totalOTStr} Hours</p>
                </div>
              </div>
              <div className="text-left">
                <p className="text-xs font-bold opacity-50">HR Verification</p>
                <div className="w-32 h-px bg-white/20 mt-4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
