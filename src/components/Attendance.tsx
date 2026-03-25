import React, { useState, useRef } from 'react';
import { Icon } from './Icon';
import * as XLSX from 'xlsx';
import html2pdf from 'html2pdf.js';

interface AttendanceProps {
    employees: any[];
    attendanceLog: any;
    setAttendanceLog: React.Dispatch<React.SetStateAction<any>>;
    shifts: any;
}

export const Attendance = React.memo(({ employees, attendanceLog, setAttendanceLog, shifts }: AttendanceProps) => {
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
            overtimeHours: 0,
            overtimeValue: 0,
            notes: '' 
        };

        if (field === 'shift') {
            Object.values(shifts).forEach((s: any) => {
                if (value === s.name.split(' (')[0] || value === s.name) {
                    value = s.name;
                }
            });
        }
        
        const newRecord = { ...currentRecord, [field]: value };
        
        if (field === 'lateDeduction' || field === 'earlyDeduction') {
            newRecord.deduction = (parseFloat(newRecord.lateDeduction) || 0) + (parseFloat(newRecord.earlyDeduction) || 0);
        }

        setAttendanceLog((prev: any) => {
            const updated = {
                ...prev,
                [selectedDate]: { ...dateRecords, [empId]: newRecord }
            };
            
            return updated;
        });
    };

    const handleFingerprintUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target?.result;
            const wb = XLSX.read(bstr, { type: 'binary', cellDates: true });
            const ws = wb.Sheets[wb.SheetNames[0]];
            
            const rawRows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
            if (rawRows.length < 2) return alert("الملف فارغ");

            const normalizeText = (t: any) => t ? t.toString().trim().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/\s+/g, ' ').toLowerCase() : "";

            let headerIdx = 0;
            for (let i = 0; i < Math.min(rawRows.length, 10); i++) {
                const rowStr = rawRows[i].map(c => normalizeText(c)).join(' ');
                if (rowStr.includes('كود') || rowStr.includes('تاريخ') || rowStr.includes('بصمه') || rowStr.includes('code') || rowStr.includes('date') || rowStr.includes('اسم') || rowStr.includes('حضور')) {
                    headerIdx = i;
                    break;
                }
            }

            const headers = rawRows[headerIdx].map(h => normalizeText(h));
            const parsedRecords: any[] = [];

            const empByCode = new Map();
            const empByName = new Map();
            employees.forEach(e => {
                empByCode.set(e.code.toString().trim(), e);
                empByName.set(normalizeText(e.name), e);
            });

            for (let i = headerIdx + 1; i < rawRows.length; i++) {
                const rowArray = rawRows[i];
                if (!rowArray || rowArray.length === 0) continue;
                
                const row: any = {};
                headers.forEach((h, idx) => {
                    if (h) row[h] = rowArray[idx];
                });

                const codeRaw = row['كود البصمه'] || row['كود'] || row['code'] || row['id'] || row['رقم الموظف'] || row['م'] || row['رقم'] || row['اسم الموظف'] || row['الاسم'] || row['اسم'] || row['name'];
                const dateVal = row['التاريخ'] || row['date'] || row['تاريخ'] || row['يوم'];
                const entry = row['وقت الدخول'] || row['حضور'] || row['entry'] || row['دخول'] || row['بصمه حضور'] || row['الحضور'] || row['in'] || row['time in'];
                const exit = row['وقت الخروج'] || row['انصراف'] || row['exit'] || row['خروج'] || row['بصمه انصراف'] || row['الانصراف'] || row['out'] || row['time out'];
                
                if (!codeRaw || !dateVal) continue;

                const codeStr = codeRaw.toString().trim();
                let emp = empByCode.get(codeStr) || empByName.get(normalizeText(codeRaw));
                if (!emp) continue;

                let formattedDate;
                try {
                    if (dateVal instanceof Date) {
                        formattedDate = dateVal.toISOString().split('T')[0];
                    } else if (typeof dateVal === 'number') {
                        const d = XLSX.SSF.parse_date_code(dateVal);
                        formattedDate = `${d.y}-${String(d.m).padStart(2, '0')}-${String(d.d).padStart(2, '0')}`;
                    } else {
                        const dateStr = dateVal.toString().trim();
                        const parts = dateStr.split(/[\/\-.]/);
                        if (parts.length === 3) {
                            let d, m, y;
                            if (parts[0].length === 4) { [y, m, d] = parts; } else { [d, m, y] = parts; }
                            const parsedDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
                            if (!isNaN(parsedDate.getTime())) { formattedDate = parsedDate.toISOString().split('T')[0]; }
                        }
                        if (!formattedDate) {
                            const d = new Date(dateVal);
                            if (!isNaN(d.getTime())) { formattedDate = d.toISOString().split('T')[0]; } else { continue; }
                        }
                    }
                } catch (err) { continue; }

                const formatTime = (t: any) => {
                    if (t === undefined || t === null || t === '') return '';
                    if (t instanceof Date) return t.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
                    if (typeof t === 'number') {
                        const fraction = t % 1;
                        const totalSeconds = Math.round(fraction * 24 * 60 * 60);
                        const hours = Math.floor(totalSeconds / 3600);
                        const minutes = Math.floor((totalSeconds % 3600) / 60);
                        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                    }
                    if (typeof t === 'string') {
                        const timeMatch = t.match(/(\d{1,2}:\d{2}(?:\s?[APap][Mm])?)/);
                        if (timeMatch) {
                            let timeStr = timeMatch[1];
                            const isPM = timeStr.toLowerCase().includes('pm') || timeStr.toLowerCase().includes('م');
                            const isAM = timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('ص');
                            let [h, m] = timeStr.replace(/[^\d:]/g, '').split(':').map(Number);
                            if (isPM && h < 12) h += 12;
                            if (isAM && h === 12) h = 0;
                            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                        }
                        return t;
                    }
                    return '';
                };

                const arrivalTime = formatTime(entry);
                const departureTime = formatTime(exit);

                parsedRecords.push({
                    empId: emp.id,
                    empName: emp.name,
                    empCode: emp.code,
                    date: formattedDate,
                    arrivalTime,
                    departureTime,
                    lateDeduction: 0,
                    earlyDeduction: 0,
                    deduction: 0,
                    shift: emp.shift || '',
                    notes: row['ملاحظات'] || ''
                });
            }

            if (parsedRecords.length === 0) {
                return alert("لم يتم العثور على بيانات صالحة للموظفين المسجلين.");
            }
            setPreviewData(parsedRecords);
        };
        reader.readAsBinaryString(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
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
                manualDeduction: rec.manualDeduction || 0,
                lateDeduction: rec.lateDeduction,
                earlyDeduction: rec.earlyDeduction,
                shift: rec.shift,
                notes: rec.notes,
                lateHours: rec.lateHours,
                earlyHours: rec.earlyHours,
                overtimeHours: rec.overtimeHours,
                totalHours: rec.totalHours
            };
        });
        setAttendanceLog(newLog);
        setPreviewData(null);
        alert(`تم حفظ ${previewData.length} سجل بنجاح`);
    };

    const updatePreviewRow = (idx: number, field: string, value: any) => {
        if (!previewData) return;
        const newData = [...previewData];
        newData[idx] = { ...newData[idx], [field]: value };
        if (field === 'lateDeduction' || field === 'earlyDeduction' || field === 'manualDeduction') {
            newData[idx].deduction = (parseFloat(newData[idx].lateDeduction) || 0) + (parseFloat(newData[idx].earlyDeduction) || 0);
        }
        setPreviewData(newData);
    };

    const removePreviewRow = (idx: number) => {
        if (!previewData) return;
        setPreviewData(previewData.filter((_, i) => i !== idx));
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {previewData && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-6xl rounded-[40px] shadow-2xl overflow-hidden animate-fade-in border border-slate-200 flex flex-col max-h-[90vh]">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800">مراجعة وتعديل بيانات البصمة</h3>
                                <p className="text-slate-500 font-bold text-sm">يمكنك تعديل المواعيد أو حذف السجلات قبل الحفظ</p>
                            </div>
                            <button onClick={() => setPreviewData(null)} className="p-3 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors">
                                <Icon name="x" size={24} />
                            </button>
                        </div>
                        <div className="p-8 overflow-y-auto flex-1">
                            <table className="w-full text-right border-collapse">
                                <thead className="bg-slate-100 text-slate-500 text-[10px] font-black uppercase sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 py-3 border-b">الموظف</th>
                                        <th className="px-4 py-3 border-b">الوردية</th>
                                        <th className="px-4 py-3 border-b">التاريخ</th>
                                        <th className="px-4 py-3 border-b">حضور</th>
                                        <th className="px-4 py-3 border-b">انصراف</th>
                                        <th className="px-4 py-3 border-b text-center">تأخير (س)</th>
                                        <th className="px-4 py-3 border-b text-center">مبكر (س)</th>
                                        <th className="px-4 py-3 border-b text-center">خصم يدوي (يوم)</th>
                                        <th className="px-4 py-3 border-b text-center">إجمالي الخصم</th>
                                        <th className="px-4 py-3 border-b">ملاحظات</th>
                                        <th className="px-4 py-3 border-b text-center">إجراء</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {previewData.map((rec, idx) => (
                                        <tr key={idx} className="hover:bg-blue-50/30">
                                            <td className="px-4 py-3"><span className="font-black block text-xs">{rec.empName}</span><span className="text-[9px] text-slate-400">كود: {rec.empCode}</span></td>
                                            <td className="px-4 py-3">
                                                <input 
                                                    type="text" 
                                                    value={rec.shift || ''} 
                                                    onChange={(e) => updatePreviewRow(idx, 'shift', e.target.value)}
                                                    className="w-16 bg-slate-50 p-1.5 rounded-lg text-[10px] font-bold border border-slate-100 outline-none"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-xs font-bold">{rec.date}</td>
                                            <td className="px-4 py-3">
                                                <input 
                                                    type="time" 
                                                    value={rec.arrivalTime} 
                                                    onChange={(e) => updatePreviewRow(idx, 'arrivalTime', e.target.value)}
                                                    className="bg-slate-50 p-1.5 rounded-lg text-[10px] font-bold border border-slate-100 outline-none focus:ring-1 focus:ring-blue-400"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <input 
                                                    type="time" 
                                                    value={rec.departureTime} 
                                                    onChange={(e) => updatePreviewRow(idx, 'departureTime', e.target.value)}
                                                    className="bg-slate-50 p-1.5 rounded-lg text-[10px] font-bold border border-slate-100 outline-none focus:ring-1 focus:ring-blue-400"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <input 
                                                    type="number" 
                                                    step="0.5"
                                                    value={rec.lateDeduction || 0} 
                                                    onChange={(e) => updatePreviewRow(idx, 'lateDeduction', e.target.value)}
                                                    className="w-12 bg-slate-50 p-1.5 rounded-lg text-[10px] font-bold border border-slate-100 text-center outline-none"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <input 
                                                    type="number" 
                                                    step="0.5"
                                                    value={rec.earlyDeduction || 0} 
                                                    onChange={(e) => updatePreviewRow(idx, 'earlyDeduction', e.target.value)}
                                                    className="w-12 bg-slate-50 p-1.5 rounded-lg text-[10px] font-bold border border-slate-100 text-center outline-none"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <input 
                                                    type="number" 
                                                    step="0.25"
                                                    value={rec.manualDeduction || 0} 
                                                    onChange={(e) => updatePreviewRow(idx, 'manualDeduction', e.target.value)}
                                                    className="w-12 bg-amber-50 p-1.5 rounded-lg text-[10px] font-bold border border-amber-100 text-center outline-none text-amber-700"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-3 py-1 rounded-full font-black text-[10px] ${rec.deduction > 0 || rec.manualDeduction > 0 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                    {rec.manualDeduction > 0 ? `${rec.manualDeduction} ي` : `${rec.deduction} س`}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <input 
                                                    type="text" 
                                                    value={rec.notes} 
                                                    onChange={(e) => updatePreviewRow(idx, 'notes', e.target.value)}
                                                    className="w-full bg-transparent border-b text-[10px] outline-none"
                                                    placeholder="..."
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button onClick={() => removePreviewRow(idx)} className="p-2 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors">
                                                    <Icon name="trash-2" size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                            <button onClick={confirmUpload} className="flex-1 bg-emerald-600 text-white font-black py-4 rounded-full shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                                <Icon name="check-circle" size={20} /> تأكيد وحفظ {previewData.length} سجل
                            </button>
                            <button onClick={() => setPreviewData(null)} className="px-8 bg-white text-slate-500 font-black py-4 rounded-full border border-slate-200 hover:bg-slate-50 transition-all">إلغاء</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                        <Icon name="clock" className="text-blue-600" size={32} /> الحضور والانصراف اليومي
                    </h2>
                    <p className="text-slate-500 font-bold">تسجيل المواعيد وتطبيق اللائحة</p>
                    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-xl">
                        <Icon name="info" size={16} className="text-blue-600" />
                        <span className="text-xs font-black text-blue-700">دورة الشهر: من يوم 26 حتى يوم 25 من الشهر التالي</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Icon name="search" size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="بحث بالاسم أو الكود..." 
                            className="bg-white border border-slate-100 rounded-2xl py-2 pr-10 pl-4 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all w-48 md:w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => {
                            const element = document.createElement('div');
                            element.className = 'pdf-container';
                            element.innerHTML = `
                                <div class="pdf-header">
                                    <div style="text-align: right">
                                        <div style="font-weight: 900; font-size: 14px">شركة طيبة للاستثمار العقارى والتطوير العمراني</div>
                                        <div style="font-size: 10px; color: #64748b">التاريخ: ${selectedDate}</div>
                                    </div>
                                    <div class="pdf-title">تقرير الحضور والانصراف اليومي</div>
                                </div>
                                <table class="pdf-table">
                                    <thead>
                                        <tr>
                                            <th>الموظف</th>
                                            <th>الكود</th>
                                            <th>الحضور</th>
                                            <th>الانصراف</th>
                                            <th>تأخير (س)</th>
                                            <th>مبكر (س)</th>
                                            <th>خصم يدوي</th>
                                            <th>ملاحظات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${employees.map(emp => {
                                            const rec = attendanceLog[selectedDate]?.[emp.id] || {};
                                            return `
                                                <tr>
                                                    <td>${emp.name}</td>
                                                    <td>${emp.code}</td>
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
                                <div style="margin-top: 40px; display: flex; justify-content: space-between; font-size: 12px; font-weight: 900">
                                    <div>توقيع المدير المباشر: .........................</div>
                                    <div>توقيع الموارد البشرية: .........................</div>
                                </div>
                            `;
                            const opt = {
                                margin: 0,
                                filename: `attendance-${selectedDate}.pdf`,
                                image: { type: 'jpeg' as const, quality: 0.98 },
                                html2canvas: { scale: 2, useCORS: true },
                                jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
                            };
                            html2pdf().set(opt).from(element).save();
                        }}
                        className="bg-slate-800 text-white px-6 py-2.5 rounded-full font-black flex items-center gap-2 shadow-lg hover:bg-slate-900 transition-all no-print"
                    >
                        <Icon name="download" size={18} /> تنزيل PDF
                    </button>
                    <button 
                        onClick={() => window.print()}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-black flex items-center gap-2 shadow-lg hover:bg-blue-700 transition-all no-print"
                    >
                        <Icon name="printer" size={18} /> طباعة
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx, .xls, .csv" onChange={handleFingerprintUpload} />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-emerald-600 text-white px-6 py-2.5 rounded-full font-black flex items-center gap-2 shadow-lg hover:bg-emerald-700 transition-all"
                    >
                        <Icon name="upload" size={18} /> رفع شيت بصمة
                    </button>
                    <div className="flex items-center gap-3 bg-white p-2 rounded-full shadow-sm border border-slate-100">
                        <Icon name="calendar" className="text-slate-400" size={20} />
                        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="outline-none font-bold text-slate-700 bg-transparent" />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 attendance-container">
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-blue-600 rounded-[40px] p-8 text-white shadow-xl">
                        <h3 className="font-black text-lg mb-4 flex items-center gap-2"><Icon name="info" size={20} /> لائحة التأخير (يدوي)</h3>
                        <div className="space-y-2 text-xs font-bold opacity-90">
                            <p className="border-b border-white/20 pb-1">يمكنك تعديل الخصم يدوياً لكل موظف في الجدول.</p>
                            <p>النظام يقترح خصم تلقائي ولكن القرار النهائي للمدير.</p>
                        </div>
                    </div>
                    <div className="bg-slate-800 rounded-[40px] p-8 text-white shadow-xl">
                        <h3 className="font-black text-lg mb-4 flex items-center gap-2"><Icon name="alert-circle" size={20} /> انصراف مبكر (يدوي)</h3>
                        <div className="space-y-2 text-xs font-bold opacity-90">
                            <p className="border-b border-white/20 pb-1">يتم إدخال خصم الانصراف المبكر يدوياً في خانة "مبكر (س)".</p>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-3">
                    <div className="rounded-[40px] shadow-2xl overflow-hidden border bg-white border-slate-100">
                        <table className="w-full text-right">
                            <thead className="bg-slate-50 text-slate-500 text-[11px] font-black uppercase border-b">
                                <tr>
                                    <th className="px-6 py-5">الموظف</th>
                                    <th className="px-4 py-5">الوردية</th>
                                    <th className="px-4 py-5">حضور</th>
                                    <th className="px-4 py-5">انصراف</th>
                                    <th className="px-4 py-5 text-center">تأخير (س)</th>
                                    <th className="px-4 py-5 text-center">مبكر (س)</th>
                                    <th className="px-4 py-5 text-center">إجمالي الخصم</th>
                                    <th className="px-4 py-5">ملاحظات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {employees
                                    .filter(emp => emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || emp.code.toLowerCase().includes(searchQuery.toLowerCase()))
                                    .map(emp => {
                                    const record = (attendanceLog[selectedDate] && attendanceLog[selectedDate][emp.id]) || { arrivalTime: '', departureTime: '', deduction: 0, lateDeduction: 0, earlyDeduction: 0, shift: '', notes: '' };
                                    return (
                                        <tr key={emp.id} className="hover:bg-blue-50/30">
                                            <td className="px-6 py-4">
                                                <span className="font-black block">{emp.name}</span>
                                                <span className="text-[10px] text-slate-400">كود: {emp.code}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <select 
                                                    value={record.shift || ''} 
                                                    onChange={(e) => updateRecord(emp.id, 'shift', e.target.value)} 
                                                    className="w-32 bg-slate-50 p-2 rounded-xl text-[10px] font-bold border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20"
                                                >
                                                    <option value="">اختر الوردية</option>
                                                    {Object.values(shifts).map((s: any) => (
                                                        <option key={s.id} value={s.name}>{s.name}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-4 py-4">
                                                <input type="time" value={record.arrivalTime} onChange={(e) => updateRecord(emp.id, 'arrivalTime', e.target.value)} className="bg-slate-50 p-2 rounded-xl text-xs font-bold border border-slate-100" />
                                            </td>
                                            <td className="px-4 py-4">
                                                <input type="time" value={record.departureTime} onChange={(e) => updateRecord(emp.id, 'departureTime', e.target.value)} className="bg-slate-50 p-2 rounded-xl text-xs font-bold border border-slate-100" />
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <input 
                                                    type="number" 
                                                    step="0.5"
                                                    value={record.lateDeduction || 0} 
                                                    onChange={(e) => updateRecord(emp.id, 'lateDeduction', e.target.value)} 
                                                    className="w-16 bg-slate-50 p-2 rounded-xl text-xs font-bold border border-slate-100 text-center" 
                                                />
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <input 
                                                    type="number" 
                                                    step="0.5"
                                                    value={record.earlyDeduction || 0} 
                                                    onChange={(e) => updateRecord(emp.id, 'earlyDeduction', e.target.value)} 
                                                    className="w-16 bg-slate-50 p-2 rounded-xl text-xs font-bold border border-slate-100 text-center" 
                                                />
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className={`px-4 py-2 rounded-full font-black text-xs ${record.deduction > 0 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                    {record.deduction} س
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <input type="text" value={record.notes} onChange={(e) => updateRecord(emp.id, 'notes', e.target.value)} className="w-full bg-transparent border-b text-xs" />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
});
