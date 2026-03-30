import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { TopNav, Icon } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { EmployeeTable } from './pages/Employees';
import { Attendance } from './pages/Attendance';
import { Payroll } from './pages/Payroll';
import { Leaves } from './pages/Leaves';
import { Archive } from './pages/Archive';
import { Insurance } from './pages/Insurance';
import { Contracts } from './pages/Contracts';
import { Recruitment } from './pages/Recruitment';
import { Settings } from './pages/Settings';
import { MonthlyReport } from './pages/MonthlyReport';
import { AnnualCalendar } from './pages/AnnualCalendar';
import { AttendancePolicy } from './pages/AttendancePolicy';
import { Evaluation } from './pages/Evaluation';
import { Training } from './pages/Training';
import { Resignations } from './pages/Resignations';
import { DigitalArchive } from './pages/DigitalArchive';
import { ATS } from './pages/ATS';
import { ComingSoon } from './components/ComingSoon';

const INITIAL_EMPLOYEES = [
    { id: '1', code: '101', name: 'أحمد محمد علي', jobTitle: 'مدير مبيعات', department: 'المبيعات', status: 'نشط', joinDate: '2023-01-15', totalLeaves: 21, monthlyLeaves: Array(12).fill(0), notes: '', nationalId: '29001011234567', phone: '01012345678', address: 'القاهرة - مدينة نصر' },
    { id: '2', code: '102', name: 'سارة محمود حسن', jobTitle: 'محاسب مالي', department: 'المالية', status: 'نشط', joinDate: '2023-03-10', totalLeaves: 30, monthlyLeaves: [1.5, 2, 0, 0.5, 0, 0, 0, 0, 0, 0, 0, 0], notes: 'مجتهدة جداً', nationalId: '29505021234568', phone: '01122334455', address: 'الجيزة - الدقي' },
];

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('hr_isLoggedIn') === 'true');
    const [password, setPassword] = useState('');
    const [systemPassword, setSystemPassword] = useState(() => localStorage.getItem('hr_password') || '2362001');
    const [userName, setUserName] = useState(() => localStorage.getItem('hr_userName') || 'ضياء');
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
    const [candidates, setCandidates] = useState(() => {
        const saved = localStorage.getItem('hr_candidates');
        return saved ? JSON.parse(saved) : [];
    });
    const [rules, setRules] = useState(() => {
        const saved = localStorage.getItem('hr_rules');
        return saved ? JSON.parse(saved) : {
            lateGracePeriod: 15,
            earlyDepartureGrace: 0,
            absencePenalty: 8,
            lateTiers: [
                { min: 16, max: 30, penalty: 0.5 },
                { min: 31, max: 60, penalty: 1 },
                { min: 61, max: 90, penalty: 1.5 },
                { min: 91, max: 120, penalty: 2 },
                { min: 121, max: 150, penalty: 3 },
                { min: 151, max: 180, penalty: 4 }
            ],
            earlyTiers: [
                { min: 1, max: 15, penalty: 0.5 },
                { min: 16, max: 30, penalty: 1 },
                { min: 31, max: 60, penalty: 1 },
                { min: 61, max: 90, penalty: 1.5 },
                { min: 91, max: 120, penalty: 2 },
                { min: 121, max: 150, penalty: 3 },
                { min: 151, max: 180, penalty: 4 }
            ]
        };
    });
    const [snapshots, setSnapshots] = useState<any[]>(() => {
        const saved = localStorage.getItem('hr_snapshots');
        return saved ? JSON.parse(saved) : [];
    });
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        localStorage.setItem('hr_employees', JSON.stringify(employees));
        localStorage.setItem('hr_insurance', JSON.stringify(insuranceRecords));
        localStorage.setItem('hr_contracts', JSON.stringify(contractRecords));
        localStorage.setItem('hr_attendance', JSON.stringify(attendanceLog));
        localStorage.setItem('hr_payroll', JSON.stringify(payrollRecords));
        localStorage.setItem('hr_candidates', JSON.stringify(candidates));
        localStorage.setItem('hr_rules', JSON.stringify(rules));
        localStorage.setItem('hr_snapshots', JSON.stringify(snapshots));
        localStorage.setItem('hr_password', systemPassword);
        localStorage.setItem('hr_userName', userName);
        localStorage.setItem('hr_isLoggedIn', isLoggedIn.toString());
    }, [employees, insuranceRecords, contractRecords, attendanceLog, payrollRecords, snapshots, systemPassword, userName, isLoggedIn]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const createSnapshot = (name: string) => {
        const newSnapshot = {
            id: Date.now().toString(),
            name: name || `نسخة ${new Date().toLocaleString('ar-EG')}`,
            date: new Date().toISOString(),
            data: { employees, attendanceLog, insuranceRecords, contractRecords, payrollRecords, candidates, systemPassword, userName }
        };
        setSnapshots([newSnapshot, ...snapshots.slice(0, 9)]); // Keep last 10
        alert('تم حفظ نسخة من البيانات بنجاح!');
    };

    const restoreSnapshot = (snapshot: any) => {
        if (confirm(`هل أنت متأكد من استعادة النسخة: ${snapshot.name}؟`)) {
            handleRestore(snapshot.data);
            alert('تمت استعادة البيانات بنجاح!');
        }
    };

    const deleteSnapshot = (id: string) => {
        setSnapshots(snapshots.filter(s => s.id !== id));
    };

    const addEmployee = (d: any) => {
        if (employees.some((e: any) => e.code === d.code)) {
            alert('هذا الكود مستخدم بالفعل لموظف آخر');
            return;
        }
        setEmployees([...employees, { ...d, id: Date.now().toString(), status: 'نشط', totalLeaves: 21, monthlyLeaves: Array(12).fill(0) }]);
    };
    const bulkAddEmployees = (list: any[]) => {
        const existingCodes = new Set(employees.map((e: any) => e.code));
        const uniqueNew = list.filter((emp: any) => !existingCodes.has(emp.code));
        if (uniqueNew.length === 0) {
            alert('لم يتم إضافة أي موظف جديد (أكواد مكررة)');
            return;
        }
        setEmployees(p => [...p, ...uniqueNew]);
        if (uniqueNew.length < list.length) {
            alert(`تم استيراد ${uniqueNew.length} موظف، وتجاهل ${list.length - uniqueNew.length} مكررين`);
        }
    };
    const updateEmployee = (u: any) => {
        if (employees.some((e: any) => e.code === u.code && e.id !== u.id)) {
            alert('هذا الكود مستخدم بالفعل لموظف آخر');
            return;
        }
        setEmployees(employees.map(e => e.id === u.id ? { ...e, ...u } : e));
    };
    const deleteEmployee = (id: string) => setEmployees(employees.filter(e => e.id !== id));

    const handleRestore = (data: any) => {
        if (data.employees) setEmployees(data.employees);
        if (data.attendanceLog) setAttendanceLog(data.attendanceLog);
        if (data.insuranceRecords) setInsuranceRecords(data.insuranceRecords);
        if (data.contractRecords) setContractRecords(data.contractRecords);
        if (data.payrollRecords) setPayrollRecords(data.payrollRecords);
        if (data.candidates) setCandidates(data.candidates);
        if (data.systemPassword) setSystemPassword(data.systemPassword);
        if (data.userName) setUserName(data.userName);
    };

    const formattedDate = currentTime.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = currentTime.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-slate-100 font-['Cairo'] selection:bg-indigo-100" dir="rtl">
                <div className="max-w-md w-full p-12 rounded-[60px] text-center border shadow-2xl bg-white border-slate-200 animate-fade-in">
                    <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-2xl rotate-3">
                        <Icon name="user-circle-2" size={54} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">المنسق HR</h1>
                    <p className="text-slate-500 mb-10 font-bold uppercase tracking-widest text-xs">نظام إدارة الموارد البشرية المتكامل</p>
                    <form onSubmit={(e) => { 
                        e.preventDefault(); 
                        if(password === systemPassword) {
                            setIsLoggedIn(true);
                        } else {
                            alert('كلمة السر غير صحيحة');
                        }
                    }} className="space-y-6">
                        <input required type="password" placeholder="كلمة السر" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-8 text-slate-800 text-center text-xl font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 text-xl hover:bg-indigo-700 active:scale-95 transition-all">دخول النظام <Icon name="arrow-left" size={24} /></button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <Router>
            <div className="min-h-screen flex flex-col w-full font-['Cairo'] bg-slate-50 selection:bg-indigo-100" dir="rtl">
                {activeTab !== 'dashboard' && (
                    <div className="w-full px-4 md:px-6 lg:px-8 pt-6">
                        <TopNav 
                            onLogout={() => setIsLoggedIn(false)} 
                            activeTab={activeTab} 
                            setActiveTab={setActiveTab} 
                            formattedDate={formattedDate}
                            formattedTime={formattedTime}
                        />
                    </div>
                )}
                <main className="flex-1 w-full px-4 md:px-6 lg:px-8 pb-12">
                    {activeTab === 'dashboard' ? (
                        <div className="pt-8">
                            <Dashboard 
                                setActiveTab={setActiveTab} 
                                userName={userName} 
                                onLogout={() => setIsLoggedIn(false)} 
                                employees={employees}
                            />
                        </div>
                    ) : activeTab === 'employees' ? (
                        <EmployeeTable employees={employees} onAddEmployee={addEmployee} onUpdateEmployee={updateEmployee} onDeleteEmployee={deleteEmployee} onBulkAdd={bulkAddEmployees} />
                    ) : activeTab === 'attendance' ? (
                        <Attendance employees={employees} attendanceLog={attendanceLog} setAttendanceLog={setAttendanceLog} />
                    ) : activeTab === 'payroll' ? (
                        <Payroll employees={employees} payrollRecords={payrollRecords} setPayrollRecords={setPayrollRecords} />
                    ) : activeTab === 'leaves' ? (
                        <Leaves employees={employees} attendanceLog={attendanceLog} setAttendanceLog={setAttendanceLog} />
                    ) : activeTab === 'archive' ? (
                        <Archive employees={employees} />
                    ) : activeTab === 'insurance' ? (
                        <Insurance employees={employees} insuranceRecords={insuranceRecords} setInsuranceRecords={setInsuranceRecords} />
                    ) : activeTab === 'contracts' ? (
                        <Contracts employees={employees} contractRecords={contractRecords} setContractRecords={setContractRecords} />
                    ) : activeTab === 'recruitment' ? (
                        <Recruitment candidates={candidates} setCandidates={setCandidates} />
                    ) : activeTab === 'settings' ? (
                        <Settings 
                            appData={{ employees, attendanceLog, insuranceRecords, contractRecords, payrollRecords, systemPassword, userName }} 
                            onRestore={handleRestore}
                            userName={userName}
                            setUserName={setUserName}
                            systemPassword={systemPassword}
                            setSystemPassword={setSystemPassword}
                            snapshots={snapshots}
                            onCreateSnapshot={createSnapshot}
                            onRestoreSnapshot={restoreSnapshot}
                            onDeleteSnapshot={deleteSnapshot}
                        />
                    ) : activeTab === 'attendance_policy' ? (
                        <AttendancePolicy rules={rules} setRules={setRules} />
                    ) : activeTab === 'monthly_report' ? (
                        <MonthlyReport employees={employees} attendanceLog={attendanceLog} payrollRecords={payrollRecords} />
                    ) : activeTab === 'annual_calendar' ? (
                        <AnnualCalendar employees={employees} />
                    ) : activeTab === 'ats' ? (
                        <ATS />
                    ) : activeTab === 'kpis' || activeTab === 'evaluation' ? (
                        <Evaluation employees={employees} />
                    ) : activeTab === 'digital_archive' ? (
                        <DigitalArchive employees={employees} />
                    ) : activeTab === 'training' ? (
                        <Training employees={employees} />
                    ) : activeTab === 'resignations' ? (
                        <Resignations employees={employees} />
                    ) : (
                        <ComingSoon title="قسم جديد" />
                    )}
                </main>
                <footer className="mt-12 mb-6 text-center no-print text-slate-500 font-bold text-[12px] uppercase tracking-wide">تطوير: عمر نشأت &copy; {new Date().getFullYear()}</footer>
            </div>
        </Router>
    );
}
