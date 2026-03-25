import React, { useState, useMemo } from 'react';
import { Icon } from './Icon';
import html2pdf from 'html2pdf.js';

interface AnnualAbsenceProps {
    employees: any[];
    attendanceLog: any;
}

export const AnnualAbsence = React.memo(({ employees, attendanceLog }: AnnualAbsenceProps) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDept, setSelectedDept] = useState('الكل');

    const departments = ['الكل', ...new Set(employees.map(e => e.department))];

    const absenceData = useMemo(() => {
        const results: any[] = [];
        const yearStart = new Date(parseInt(selectedYear), 0, 1);
        const yearEnd = new Date(parseInt(selectedYear), 11, 31);
        
        employees.forEach(emp => {
            const absences: any[] = [];
            let current = new Date(yearStart);
            while (current <= yearEnd) {
                const dateStr = current.toISOString().split('T')[0];
                const record = attendanceLog[dateStr]?.[emp.id];
                
                const day = current.getDay();
                if (!record && day !== 5 && day !== 6) {
                    absences.push({
                        date: dateStr,
                        type: 'بدون عذر'
                    });
                } else if (record && record.notes?.includes('غياب')) {
                    absences.push({
                        date: dateStr,
                        type: record.notes.includes('عذر') ? 'بعذر' : 'بدون عذر'
                    });
                }
                current.setDate(current.getDate() + 1);
            }
            
            if (absences.length > 0) {
                results.push({
                    emp,
                    absences,
                    total: absences.length
                });
            }
        });
        return results;
    }, [selectedYear, employees, attendanceLog]);

    const filteredData = absenceData.filter(item => {
        const matchesSearch = item.emp.name.includes(searchQuery) || item.emp.code.toString().includes(searchQuery);
        const matchesDept = selectedDept === 'الكل' || item.emp.department === selectedDept;
        return matchesSearch && matchesDept;
    });

    return (
        <div className="space-y-6 animate-fade-in pb-12 annual-absence-container">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                        <Icon name="calendar-x" className="text-rose-600" size={32} /> سجل الغيابات السنوي
                    </h2>
                    <p className="text-slate-500 font-bold text-xs">متابعة غيابات الموظفين وتصنيفها على مدار العام</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Icon name="search" size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="بحث بالاسم أو الكود..." 
                            className="bg-white border border-slate-100 rounded-full py-2 pr-10 pl-4 text-xs font-bold outline-none focus:ring-2 focus:ring-rose-500/20 transition-all w-48 md:w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="bg-white border border-slate-100 rounded-full py-2 px-4 text-xs font-bold outline-none">
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="bg-white border border-slate-100 rounded-full py-2 px-4 text-xs font-bold outline-none">
                        {['2023', '2024', '2025', '2026'].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
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
                                    <div class="pdf-title">سجل الغيابات السنوي - ${selectedYear}</div>
                                </div>
                                ${filteredData.map(item => `
                                    <div style="margin-bottom: 20px; border: 1px solid #e2e8f0; border-radius: 10px; padding: 15px">
                                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px">
                                            <div>
                                                <div style="font-weight: 900; font-size: 14px">${item.emp.name}</div>
                                                <div style="font-size: 10px; color: #64748b">كود: ${item.emp.code} | ${item.emp.department}</div>
                                            </div>
                                            <div style="text-align: center">
                                                <div style="font-size: 20px; font-weight: 900; color: #e11d48">${item.total}</div>
                                                <div style="font-size: 8px; color: #64748b uppercase">يوم غياب</div>
                                            </div>
                                        </div>
                                        <div style="display: flex; flex-wrap: wrap; gap: 5px">
                                            ${item.absences.map((abs: any) => `
                                                <div style="font-size: 9px; padding: 2px 8px; border-radius: 5px; background: ${abs.type === 'بعذر' ? '#f0fdf4' : '#fef2f2'}; border: 1px solid ${abs.type === 'بعذر' ? '#dcfce7' : '#fee2e2'}">
                                                    ${abs.date} (${abs.type})
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            `;
                            const opt = {
                                margin: 0,
                                filename: `annual-absence-${selectedYear}.pdf`,
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
                        className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-black flex items-center gap-2 shadow-lg hover:bg-slate-800 transition-all"
                    >
                        <Icon name="printer" size={18} /> طباعة السجل
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {filteredData.map(item => (
                    <div key={item.emp.id} className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
                                    <Icon name="user" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-800">{item.emp.name}</h3>
                                    <p className="text-xs text-slate-400 font-bold">كود: {item.emp.code} | {item.emp.department}</p>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-black text-rose-600 leading-none">{item.total}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">يوم غياب</p>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex flex-wrap gap-2">
                                {item.absences.map((abs: any, idx: number) => (
                                    <div key={idx} className={`px-4 py-2 rounded-2xl border flex flex-col items-center gap-1 ${abs.type === 'بعذر' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                                        <span className="text-[10px] font-black">{abs.date}</span>
                                        <span className="text-[8px] font-bold opacity-70">{abs.type}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                {filteredData.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
                            <Icon name="search-x" size={40} />
                        </div>
                        <p className="text-slate-400 font-bold">لا توجد غيابات مسجلة لهذا العام</p>
                    </div>
                )}
            </div>
        </div>
    );
});
