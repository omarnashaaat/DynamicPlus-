import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './components/Icon';
import { Dashboard } from './components/Dashboard';
import { Attendance } from './components/Attendance';
import { MonthlyReport } from './components/MonthlyReport';
import { Payroll } from './components/Payroll';
import { Settings } from './components/Settings';
import { Leaves } from './components/Leaves';
import { Contracts } from './components/Contracts';
import { Insurance } from './components/Insurance';
import { Calendar } from './components/Calendar';
import { Archive } from './components/Archive';
import { EmployeeTable } from './components/EmployeeTable';
import { Regulations } from './components/Regulations';
import { AnnualAbsence } from './components/AnnualAbsence';
import { Recruitment } from './components/Recruitment';
import { ATS } from './components/ATS';
import { INITIAL_EMPLOYEES, INITIAL_SHIFTS } from './constants';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem('hr_isLoggedIn') === 'true';
    });
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [employees, setEmployees] = useState(() => {
        const saved = localStorage.getItem('hr_employees');
        return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
    });
    const [insuranceRecords, setInsuranceRecords] = useState(() => {
        const saved = localStorage.getItem('hr_insurance');
        return saved ? JSON.parse(saved) : {};
    });
    const [contractRecords, setContractRecords] = useState(() => {
        const saved = localStorage.getItem('hr_contracts');
        return saved ? JSON.parse(saved) : {};
    });
    const [attendanceLog, setAttendanceLog] = useState(() => {
        const saved = localStorage.getItem('hr_attendance');
        return saved ? JSON.parse(saved) : {};
    });
    const [payrollRecords, setPayrollRecords] = useState(() => {
        const saved = localStorage.getItem('hr_payroll');
        return saved ? JSON.parse(saved) : {};
    });
    const [regulations, setRegulations] = useState(() => {
        const saved = localStorage.getItem('hr_regulations');
        return saved ? JSON.parse(saved) : {
            late: [
                { id: '1', title: 'تأخير 15 دقيقة', deduction: 0.25 },
                { id: '2', title: 'تأخير 30 دقيقة', deduction: 0.5 },
                { id: '3', title: 'تأخير ساعة', deduction: 1 }
            ],
            absence: [
                { id: '1', title: 'غياب بدون عذر', deduction: 1 },
                { id: '2', title: 'غياب بعذر', deduction: 0 }
            ],
            disciplinary: [
                { id: '1', title: 'لفت نظر', deduction: 0 },
                { id: '2', title: 'إنذار كتابي', deduction: 0 },
                { id: '3', title: 'خصم يوم', deduction: 1 }
            ]
        };
    });
    const [calendarEvents, setCalendarEvents] = useState(() => {
        const saved = localStorage.getItem('hr_calendar');
        return saved ? JSON.parse(saved) : [];
    });
    const [candidates, setCandidates] = useState(() => {
        const saved = localStorage.getItem('hr_candidates');
        return saved ? JSON.parse(saved) : [];
    });
    const [shifts, setShifts] = useState(() => {
        const saved = localStorage.getItem('hr_shifts');
        const parsed = saved ? JSON.parse(saved) : INITIAL_SHIFTS;
        if (Object.keys(parsed).length < 4) {
            return INITIAL_SHIFTS;
        }
        return parsed;
    });
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isSaving, setIsSaving] = useState(false);
    const saveTimeoutRef = useRef<any>(null);

    // Keyboard Navigation Logic
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const active = document.activeElement as HTMLElement;
            if (!active || !['INPUT', 'SELECT', 'TEXTAREA'].includes(active.tagName)) return;

            if (e.key === 'Enter') {
                e.preventDefault();
                const form = active.closest('form') || document;
                const focusable = Array.from(form.querySelectorAll('input, select, textarea, button')).filter((el: any) => !el.disabled && el.tabIndex !== -1) as HTMLElement[];
                const index = focusable.indexOf(active);
                if (index > -1 && index < focusable.length - 1) {
                    focusable[index + 1].focus();
                }
            }

            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                const cell = active.closest('td');
                if (!cell) return;
                const row = cell.parentElement as HTMLTableRowElement;
                const table = row.closest('table') as HTMLTableElement;
                const colIndex = Array.from(row.children).indexOf(cell);
                const rowIndex = Array.from(table.querySelectorAll('tbody tr')).indexOf(row);

                if (e.key === 'ArrowDown') {
                    const nextRow = table.querySelectorAll('tbody tr')[rowIndex + 1];
                    if (nextRow) (nextRow.children[colIndex].querySelector('input, select') as HTMLElement)?.focus();
                } else if (e.key === 'ArrowUp') {
                    const prevRow = table.querySelectorAll('tbody tr')[rowIndex - 1];
                    if (prevRow) (prevRow.children[colIndex].querySelector('input, select') as HTMLElement)?.focus();
                } else if (e.key === 'ArrowRight') {
                    const nextCell = row.children[colIndex - 1];
                    if (nextCell) (nextCell.querySelector('input, select') as HTMLElement)?.focus();
                } else if (e.key === 'ArrowLeft') {
                    const prevCell = row.children[colIndex + 1];
                    if (prevCell) (prevCell.querySelector('input, select') as HTMLElement)?.focus();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Optimized Auto-save with Debounce
    useEffect(() => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        
        saveTimeoutRef.current = setTimeout(() => {
            localStorage.setItem('hr_isLoggedIn', isLoggedIn.toString());
            localStorage.setItem('hr_employees', JSON.stringify(employees));
            localStorage.setItem('hr_insurance', JSON.stringify(insuranceRecords));
            localStorage.setItem('hr_contracts', JSON.stringify(contractRecords));
            localStorage.setItem('hr_attendance', JSON.stringify(attendanceLog));
            localStorage.setItem('hr_payroll', JSON.stringify(payrollRecords));
            localStorage.setItem('hr_regulations', JSON.stringify(regulations));
            localStorage.setItem('hr_calendar', JSON.stringify(calendarEvents));
            localStorage.setItem('hr_candidates', JSON.stringify(candidates));
            localStorage.setItem('hr_shifts', JSON.stringify(shifts));
            
            setIsSaving(true);
            setTimeout(() => setIsSaving(false), 1500);
        }, 1000);

        return () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        };
    }, [isLoggedIn, employees, insuranceRecords, contractRecords, attendanceLog, payrollRecords, calendarEvents, candidates, regulations, shifts]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const addEmployee = (d: any) => setEmployees([...employees, { ...d, id: Date.now().toString(), status: 'نشط', totalLeaves: 21, monthlyLeaves: Array(12).fill(0) }]);
    const bulkAddEmployees = (list: any[]) => setEmployees(p => [...p, ...list]);
    const updateEmployee = (u: any) => setEmployees(employees.map((e: any) => e.id === u.id ? { ...e, ...u } : e));
    const deleteEmployee = (id: string) => setEmployees(employees.filter((e: any) => e.id !== id));

    const handleRestore = (data: any) => {
        if (data.employees) setEmployees(data.employees);
        if (data.attendanceLog) setAttendanceLog(data.attendanceLog);
        if (data.insuranceRecords) setInsuranceRecords(data.insuranceRecords);
        if (data.contractRecords) setContractRecords(data.contractRecords);
        if (data.payrollRecords) setPayrollRecords(data.payrollRecords);
        if (data.calendarEvents) setCalendarEvents(data.calendarEvents);
        if (data.candidates) setCandidates(data.candidates);
        if (data.regulations) setRegulations(data.regulations);
        if (data.shifts) setShifts(data.shifts);
    };

    const handleClear = () => {
        if (confirm('تحذير: هل أنت متأكد من مسح كافة بيانات النظام نهائياً؟ لا يمكن التراجع عن هذه الخطوة.')) {
            setEmployees([]);
            setAttendanceLog({});
            setInsuranceRecords({});
            setContractRecords({});
            setPayrollRecords({});
            setCalendarEvents([]);
            setCandidates([]);
            setShifts(INITIAL_SHIFTS);
            alert('تم مسح كافة البيانات بنجاح.');
        }
    };

    const formattedDate = currentTime.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = currentTime.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-20">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[70%] bg-emerald-500 rounded-full blur-[150px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[70%] bg-indigo-500 rounded-full blur-[150px] animate-pulse" style={{animationDelay: '2s'}}></div>
                </div>
                
                <div className="premium-glass p-12 rounded-[3rem] w-full max-w-md text-center relative z-10 border-white/10">
                    <div className="mb-10">
                        <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-indigo-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl animate-float">
                            <Icon name="sparkles" size={48} className="text-white" />
                        </div>
                        <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">Dynamic Plus</h1>
                        <p className="text-slate-400 font-bold">نظام إدارة الموارد البشرية الذكي</p>
                    </div>
                    
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (password === '2362001') {
                            setIsLoggedIn(true);
                        } else {
                            alert('كلمة السر غير صحيحة');
                        }
                    }} className="space-y-6">
                        <div className="relative">
                            <Icon name="lock" size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                required 
                                type="password" 
                                placeholder="كلمة المرور" 
                                className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-5 pr-14 pl-8 text-white text-center text-xl font-bold focus:outline-none focus:border-emerald-500/50 transition-all" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-3 text-xl transition-all active:scale-95"
                        >
                            دخول النظام <Icon name="arrow-left" size={24} />
                        </button>
                    </form>
                    
                    <p className="mt-10 text-slate-500 text-xs font-bold uppercase tracking-widest">v2.7.0 Premium Edition</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col px-8 py-10 max-w-[1600px] mx-auto">
            <header className="premium-glass rounded-[2rem] py-4 px-10 flex items-center justify-between mb-16 no-print sticky top-6 z-50">
                <div className="flex items-center gap-6">
                    <button onClick={() => setIsLoggedIn(false)} className="text-rose-500 hover:bg-rose-50 p-3 rounded-2xl transition-all shadow-sm" title="خروج">
                        <Icon name="log-out" size={22} />
                    </button>
                    <div className="h-10 w-[1px] bg-slate-200/50"></div>
                    <div className="flex items-center gap-4 bg-white/50 px-5 py-2 rounded-2xl border border-white/50 shadow-sm">
                        <div className="flex flex-col text-right leading-tight">
                            <span className="text-xs font-black text-slate-700">{formattedDate}</span>
                            <span className="text-[11px] font-black text-emerald-600 font-mono">{formattedTime}</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                            <Icon name="calendar" size={18} />
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex justify-center items-center px-8 overflow-x-auto scroll-hidden">
                    <nav className="flex items-center gap-2">
                        {[
                            {id: 'dashboard', label: 'الرئيسية', icon: 'layout-grid'},
                            {id: 'employees', label: 'الموظفين', icon: 'users'},
                            {id: 'attendance', label: 'الحضور', icon: 'clock'},
                            {id: 'monthly_report', label: 'التقرير', icon: 'file-text'},
                            {id: 'payroll', label: 'المرتبات', icon: 'banknote'},
                            {id: 'regulations', label: 'اللوائح', icon: 'list-checks'},
                            {id: 'annual_absence', label: 'الغياب', icon: 'calendar-x'},
                            {id: 'recruitment', label: 'التوظيف', icon: 'briefcase'},
                            {id: 'ats', label: 'ATS', icon: 'sparkles'},
                            {id: 'calendar', label: 'التقويم', icon: 'calendar'},
                            {id: 'leaves', label: 'الإجازات', icon: 'calendar-days'},
                            {id: 'archive', label: 'الأرشيف', icon: 'folder'},
                            {id: 'insurance', label: 'التأمينات', icon: 'shield-check'},
                            {id: 'contracts', label: 'العقود', icon: 'file-text'},
                            {id: 'settings', label: 'الإعدادات', icon: 'settings'}
                        ].map((l, i) => (
                            <button 
                                key={i} 
                                onClick={() => setActiveTab(l.id)} 
                                className={`px-5 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === l.id ? 'bg-slate-900 text-white shadow-xl scale-105' : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}`}
                            >
                                <Icon name={l.icon} size={14} />
                                {l.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-5 cursor-pointer group" onClick={() => setActiveTab('dashboard')}>
                    <div className="flex flex-col text-right">
                        <span className="text-2xl font-black tracking-tighter text-slate-900 leading-none group-hover:text-emerald-600 transition-colors">Dynamic</span>
                        <span className="text-2xl font-black tracking-tighter text-slate-900 leading-none group-hover:text-emerald-600 transition-colors">Plus</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-900 text-white shadow-2xl group-hover:scale-110 transition-transform duration-500">
                        <Icon name="sparkles" size={28} />
                    </div>
                </div>
            </header>
            <main className="flex-1">
                {activeTab === 'dashboard' ? (
                    <Dashboard setActiveTab={setActiveTab} userName="المدير" />
                ) : activeTab === 'employees' ? (
                    <EmployeeTable employees={employees} onAddEmployee={addEmployee} onUpdateEmployee={updateEmployee} onDeleteEmployee={deleteEmployee} onBulkAdd={bulkAddEmployees} setActiveTab={setActiveTab} shifts={shifts} />
                ) : activeTab === 'attendance' ? (
                    <Attendance employees={employees} attendanceLog={attendanceLog} setAttendanceLog={setAttendanceLog} shifts={shifts} />
                ) : activeTab === 'monthly_report' ? (
                    <MonthlyReport employees={employees} attendanceLog={attendanceLog} setAttendanceLog={setAttendanceLog} shifts={shifts} />
                ) : activeTab === 'payroll' ? (
                    <Payroll employees={employees} payrollRecords={payrollRecords} setPayrollRecords={setPayrollRecords} attendanceLog={attendanceLog} setActiveTab={setActiveTab} />
                ) : activeTab === 'regulations' ? (
                    <Regulations regulations={regulations} setRegulations={setRegulations} />
                ) : activeTab === 'annual_absence' ? (
                    <AnnualAbsence employees={employees} attendanceLog={attendanceLog} />
                ) : activeTab === 'recruitment' ? (
                    <Recruitment candidates={candidates} setCandidates={setCandidates} />
                ) : activeTab === 'ats' ? (
                    <ATS onSaveCandidate={(cand) => setCandidates(prev => [...prev, cand])} />
                ) : activeTab === 'leaves' ? (
                    <Leaves employees={employees} onUpdateEmployee={updateEmployee} />
                ) : activeTab === 'archive' ? (
                    <Archive employees={employees} />
                ) : activeTab === 'insurance' ? (
                    <Insurance employees={employees} insuranceRecords={insuranceRecords} setInsuranceRecords={setInsuranceRecords} />
                ) : activeTab === 'contracts' ? (
                    <Contracts employees={employees} contractRecords={contractRecords} setContractRecords={setContractRecords} />
                ) : activeTab === 'calendar' ? (
                    <Calendar employees={employees} calendarEvents={calendarEvents} setCalendarEvents={setCalendarEvents} />
                ) : activeTab === 'settings' ? (
                    <Settings appData={{ employees, attendanceLog, insuranceRecords, contractRecords, payrollRecords, calendarEvents, candidates, regulations, shifts }} onRestore={handleRestore} onClear={handleClear} shifts={shifts} setShifts={setShifts} />
                ) : (
                    <div className="text-center py-40 text-slate-300 font-black text-4xl uppercase tracking-[0.2em] animate-pulse">سيتم التفعيل قريباً</div>
                )}
            </main>
            <footer className="mt-12 mb-6 text-center no-print text-slate-500 font-bold text-[12px] uppercase tracking-wide">تطوير: عمر نشأت &copy; {new Date().getFullYear()}</footer>
            
            {isSaving && (
                <div className="fixed bottom-10 right-10 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in z-[100]">
                    <Icon name="save" size={18} />
                    <span className="font-black text-sm">تم حفظ التغييرات تلقائياً</span>
                </div>
            )}
        </div>
    );
};

export default App;
