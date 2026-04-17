import React, { useState, useRef } from 'react';
import { Icon } from './ui/Icon';
import * as XLSX from 'xlsx';
import { calculateDeduction, getShiftByAny } from '../lib/hr-logic';

interface AttendanceProps {
  employees: any[];
  attendanceLog: any;
  setAttendanceLog: React.Dispatch<React.SetStateAction<any>>;
  shifts: any;
  rules: any;
  showToast: (msg: string, type?: any) => void;
}

export default function Attendance({ employees, attendanceLog, setAttendanceLog, shifts, rules, showToast }: AttendanceProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateRecord = (empId: string, field: string, value: any) => {
    const dateRecords = attendanceLog[selectedDate] || {};
    const emp = employees.find(e => e.id === empId);
    const defaultShift = emp?.shift || (Object.values(shifts)[0] as any)?.name || '';
    
    const currentRecord = dateRecords[empId] || { 
      arrivalTime: '', 
      departureTime: '', 
      deduction: 0, 
      lateDeduction: 0, 
      earlyDeduction: 0, 
      shift: defaultShift, 
      notes: '' 
    };

    const updated = { ...currentRecord, [field]: value };

    if (field === 'arrivalTime' || field === 'departureTime' || field === 'shift') {
      const d = calculateDeduction(updated.arrivalTime, updated.departureTime, updated.shift, shifts, rules, selectedDate);
      updated.lateDeduction = d.late;
      updated.earlyDeduction = d.early;
      updated.deduction = d.total;
    }

    setAttendanceLog((prev: any) => ({
      ...prev,
      [selectedDate]: { ...dateRecords, [empId]: updated }
    }));
  };

  const handleFingerprintUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary', cellDates: true });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rawRows: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });
      
      const normalizeText = (t: any) => t ? t.toString().trim().toLowerCase() : "";
      
      let headerIdx = 0;
      for (let i = 0; i < Math.min(rawRows.length, 10); i++) {
        const rowStr = rawRows[i].map((c: any) => normalizeText(c)).join(' ');
        if (rowStr.includes('كود') || rowStr.includes('تاريخ') || rowStr.includes('code') || rowStr.includes('date')) {
          headerIdx = i;
          break;
        }
      }

      const headers = rawRows[headerIdx].map((h: any) => normalizeText(h));
      const parsedRecords: any[] = [];

      for (let i = headerIdx + 1; i < rawRows.length; i++) {
        const rowArray = rawRows[i];
        if (!rowArray || rowArray.length === 0) continue;
        
        const row: any = {};
        headers.forEach((h: string, idx: number) => { if (h) row[h] = rowArray[idx]; });

        const codeRaw = row['كود البصمه'] || row['كود'] || row['code'] || row['id'];
        const code = codeRaw?.toString().trim();
        const dateVal = row['التاريخ'] || row['date'] || row['تاريخ'];
        const entry = row['وقت الدخول'] || row['حضور'] || row['entry'] || row['in'];
        const exit = row['وقت الخروج'] || row['انصراف'] || row['exit'] || row['out'];

        if (!code || !dateVal) continue;

        const emp = employees.find(e => e.code.toString() === code);
        if (!emp) continue;

        let formattedDate = '';
        if (dateVal instanceof Date) formattedDate = dateVal.toISOString().split('T')[0];
        else formattedDate = new Date(dateVal).toISOString().split('T')[0];

        const formatTime = (t: any) => {
          if (!t) return '';
          if (t instanceof Date) return t.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
          return t.toString();
        };

        const arrivalTime = formatTime(entry);
        const departureTime = formatTime(exit);
        const d = calculateDeduction(arrivalTime, departureTime, emp.shift, shifts, rules, formattedDate);

        parsedRecords.push({
          empId: emp.id,
          empName: emp.name,
          empCode: emp.code,
          date: formattedDate,
          arrivalTime,
          departureTime,
          lateDeduction: d.late,
          earlyDeduction: d.early,
          deduction: d.total,
          shift: emp.shift,
          notes: row['ملاحظات'] || ''
        });
      }

      if (parsedRecords.length === 0) return showToast("لم يتم العثور على بيانات صالحة.", "error");
      setPreviewData(parsedRecords);
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  const confirmUpload = () => {
    if (!previewData) return;
    const newLog = { ...attendanceLog };
    previewData.forEach(rec => {
      if (!newLog[rec.date]) newLog[rec.date] = {};
      newLog[rec.date][rec.empId] = {
        arrivalTime: rec.arrivalTime,
        departureTime: rec.departureTime,
        deduction: rec.deduction,
        lateDeduction: rec.lateDeduction,
        earlyDeduction: rec.earlyDeduction,
        shift: rec.shift,
        notes: rec.notes
      };
    });
    setAttendanceLog(newLog);
    setPreviewData(null);
    showToast(`تم حفظ ${previewData.length} سجل بنجاح`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {previewData && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-6xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-2xl font-black text-slate-800">مراجعة بيانات البصمة</h3>
                <p className="text-slate-500 font-bold text-sm">تأكد من صحة البيانات قبل الحفظ النهائي</p>
              </div>
              <button onClick={() => setPreviewData(null)} className="p-3 rounded-2xl hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors">
                <Icon name="x" size={24} />
              </button>
            </div>
            <div className="p-8 overflow-auto flex-1">
              <table className="w-full text-right border-collapse">
                <thead className="bg-slate-100 text-slate-500 text-[10px] font-black uppercase sticky top-0">
                  <tr>
                    <th className="px-4 py-3">الموظف</th>
                    <th className="px-4 py-3">التاريخ</th>
                    <th className="px-4 py-3">حضور</th>
                    <th className="px-4 py-3">انصراف</th>
                    <th className="px-4 py-3 text-center">خصم</th>
                    <th className="px-4 py-3">ملاحظات</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {previewData.map((rec, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/30">
                      <td className="px-4 py-3"><span className="font-black block text-xs">{rec.empName}</span></td>
                      <td className="px-4 py-3 text-xs font-bold">{rec.date}</td>
                      <td className="px-4 py-3 text-xs">{rec.arrivalTime}</td>
                      <td className="px-4 py-3 text-xs">{rec.departureTime}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-3 py-1 rounded-full font-black text-[10px] ${rec.deduction > 0 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {rec.deduction} س
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs">{rec.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button onClick={confirmUpload} className="flex-1 bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-emerald-700 transition-all">تأكيد وحفظ البيانات</button>
              <button onClick={() => setPreviewData(null)} className="px-8 bg-white text-slate-500 font-black py-4 rounded-2xl border border-slate-200">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print">
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-800 flex items-center gap-4 tracking-tighter">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg">
              <Icon name="clock" size={32} />
            </div>
            الحضور والانصراف اليومي
          </h2>
          <p className="text-slate-500 font-bold">تسجيل المواعيد وتطبيق اللائحة الذكية</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx, .xls" onChange={handleFingerprintUpload} />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 sm:flex-none justify-center bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-2xl hover:bg-emerald-700 transition-all"
          >
            <Icon name="upload" size={22} className="ml-2 inline" /> 
            رفع شيت بصمة
          </button>
          <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-xl border border-slate-50">
            <Icon name="calendar" className="text-slate-400" size={24} />
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="outline-none font-black text-slate-800 bg-transparent text-lg" />
          </div>
          <button onClick={() => window.print()} className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2">
            <Icon name="printer" size={22} /> طباعة
          </button>
        </div>
      </div>

      <div className="rounded-[40px] shadow-2xl overflow-hidden border bg-white border-slate-100 print:shadow-none print:border-none print:rounded-none">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-slate-800 text-white text-[11px] font-black uppercase border-b">
              <tr>
                <th className="px-6 py-5">الموظف</th>
                <th className="px-4 py-5">الوردية</th>
                <th className="px-4 py-5">حضور</th>
                <th className="px-4 py-5">انصراف</th>
                <th className="px-4 py-5 text-center">خصم (س)</th>
                <th className="px-4 py-5">ملاحظات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map(emp => {
                const record = (attendanceLog[selectedDate] && attendanceLog[selectedDate][emp.id]) || { arrivalTime: '', departureTime: '', deduction: 0, shift: emp.shift, notes: '' };
                return (
                  <tr key={emp.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-black block text-slate-800">{emp.name}</span>
                      <span className="text-[10px] text-slate-500">كود: {emp.code}</span>
                    </td>
                    <td className="px-4 py-4">
                      <select 
                        value={record.shift || ''} 
                        onChange={(e) => updateRecord(emp.id, 'shift', e.target.value)} 
                        className="w-full bg-slate-50 p-2 rounded-xl text-[10px] font-black border border-slate-200"
                      >
                        {Object.values(shifts).map((s: any) => (
                          <option key={s.id} value={s.name}>{s.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <input type="time" value={record.arrivalTime} onChange={(e) => updateRecord(emp.id, 'arrivalTime', e.target.value)} className="bg-slate-50 p-2 rounded-xl text-xs font-black border border-slate-200" />
                    </td>
                    <td className="px-4 py-4">
                      <input type="time" value={record.departureTime} onChange={(e) => updateRecord(emp.id, 'departureTime', e.target.value)} className="bg-slate-50 p-2 rounded-xl text-xs font-black border border-slate-200" />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-4 py-2 rounded-2xl font-black text-xs ${record.deduction > 0 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {record.deduction}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <input type="text" value={record.notes} onChange={(e) => updateRecord(emp.id, 'notes', e.target.value)} className="w-full bg-slate-50 p-2 rounded-xl text-xs border border-slate-100" placeholder="..." />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
