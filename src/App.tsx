import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from './components/ui/Icon';
import { INITIAL_SHIFTS } from './lib/hr-logic';
import { motion, AnimatePresence } from 'motion/react';

// Components (to be created)
import Dashboard from './components/Dashboard';
import EmployeeTable from './components/EmployeeTable';
import Attendance from './components/Attendance';
import MonthlyReport from './components/MonthlyReport';
import Payroll from './components/Payroll';
import Recruitment from './components/Recruitment';
import Settings from './components/Settings';
import Leaves from './components/Leaves';
import Insurance from './components/Insurance';
import Contracts from './components/Contracts';
import Archive from './components/Archive';
import Calendar from './components/Calendar';
import KPIs from './components/KPIs';
import Evaluations from './components/Evaluations';
import DigitalFiles from './components/DigitalFiles';
import Training from './components/Training';
import Resignations from './components/Resignations';
import AttendanceRules from './components/AttendanceRules';
import ATS from './components/ATS';
import Loans from './components/Loans';
import Rewards from './components/Rewards';
import Assets from './components/Assets';
import Goals from './components/Goals';
import Surveys from './components/Surveys';
import OrgChart from './components/OrgChart';
import ActivityLog from './components/ActivityLog';
import Gamification from './components/Gamification';
import DocCenter from './components/DocCenter';
import Announcements from './components/Announcements';
import Complaints from './components/Complaints';
import Analytics from './components/Analytics';
import SmartChat from './components/SmartChat';
import Tasks from './components/Tasks';
import BranchManagement from './components/BranchManagement';
import Login from './components/Login';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return localStorage.getItem('hr_isLoggedIn') === 'true';
    } catch (e) {
      console.error('Error reading hr_isLoggedIn from localStorage', e);
      return false;
    }
  });
  const [username, setUsername] = useState(() => {
    try {
      return localStorage.getItem('hr_username') || 'عمر نشأت';
    } catch (e) {
      console.error('Error reading hr_username from localStorage', e);
      return 'عمر نشأت';
    }
  });
  const [userRole, setUserRole] = useState<'admin' | 'employee' | 'manager' | 'hr'>(() => {
    try {
      return (localStorage.getItem('hr_userRole') as any) || 'admin';
    } catch (e) {
      return 'admin';
    }
  });
  const [loginData, setLoginData] = useState({ user: '', pass: '' });
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appLoading, setAppLoading] = useState(true);

  const [isFullView, setIsFullView] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(err);
      });
      setIsFullView(true);
    } else {
      document.exitFullscreen();
      setIsFullView(false);
    }
  };

  // Core Data State
  const [employees, setEmployees] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hr_employees') || '[]');
    } catch (e) {
      console.error('Error reading hr_employees from localStorage', e);
      return [];
    }
  });
  const [attendanceLog, setAttendanceLog] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hr_attendance') || '{}');
    } catch (e) {
      console.error('Error reading hr_attendance from localStorage', e);
      return {};
    }
  });
  const [insuranceRecords, setInsuranceRecords] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hr_insurance') || '{}');
    } catch (e) {
      console.error('Error reading hr_insurance from localStorage', e);
      return {};
    }
  });
  const [contractRecords, setContractRecords] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hr_contracts') || '{}');
    } catch (e) {
      console.error('Error reading hr_contracts from localStorage', e);
      return {};
    }
  });
  const [loans, setLoans] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hr_loans') || '[]');
    } catch (e) {
      console.error('Error reading hr_loans from localStorage', e);
      return [];
    }
  });
  const [rewards, setRewards] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hr_rewards') || '[]');
    } catch (e) {
      console.error('Error reading hr_rewards from localStorage', e);
      return [];
    }
  });
  const [payrollRecords, setPayrollRecords] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hr_payroll') || '{}');
    } catch (e) {
      console.error('Error reading hr_payroll from localStorage', e);
      return {};
    }
  });
  const [calendarEvents, setCalendarEvents] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hr_calendar') || '[]');
    } catch (e) {
      console.error('Error reading hr_calendar from localStorage', e);
      return [];
    }
  });
  const [resignations, setResignations] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hr_resignations') || '[]');
    } catch (e) {
      console.error('Error reading hr_resignations from localStorage', e);
      return [];
    }
  });
  const [shifts, setShifts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hr_shifts') || JSON.stringify(INITIAL_SHIFTS));
    } catch (e) {
      console.error('Error reading hr_shifts from localStorage', e);
      return INITIAL_SHIFTS;
    }
  });
  const [attendanceRules, setAttendanceRules] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hr_attendance_rules') || JSON.stringify({
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
      }));
    } catch (e) {
      console.error('Error reading hr_attendance_rules from localStorage', e);
      return {
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
    }
  });

  const [assets, setAssets] = useState(() => JSON.parse(localStorage.getItem('hr_assets') || '[]'));
  const [goals, setGoals] = useState(() => JSON.parse(localStorage.getItem('hr_goals') || '[]'));
  const [surveys, setSurveys] = useState(() => JSON.parse(localStorage.getItem('hr_surveys') || '[]'));
  const [trainingCourses, setTrainingCourses] = useState(() => JSON.parse(localStorage.getItem('hr_training') || '[]'));
  const [announcements, setAnnouncements] = useState(() => JSON.parse(localStorage.getItem('hr_announcements') || '[]'));
  const [complaints, setComplaints] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hr_complaints') || '[]');
    } catch { return []; }
  });
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hr_tasks') || '[]');
    } catch { return []; }
  });
  const [activityLogs, setActivityLogs] = useState(() => JSON.parse(localStorage.getItem('hr_activity') || '[]'));
  const [documents, setDocuments] = useState(() => JSON.parse(localStorage.getItem('hr_docs') || '[]'));

  const [notifications, setNotifications] = useState<any[]>([]);
  const [confirmState, setConfirmState] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {}, type: 'danger' as 'danger' | 'warning' });

  useEffect(() => {
    const timer = setTimeout(() => setAppLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('hr_employees', JSON.stringify(employees));
      localStorage.setItem('hr_attendance', JSON.stringify(attendanceLog));
      localStorage.setItem('hr_insurance', JSON.stringify(insuranceRecords));
      localStorage.setItem('hr_contracts', JSON.stringify(contractRecords));
      localStorage.setItem('hr_payroll', JSON.stringify(payrollRecords));
      localStorage.setItem('hr_loans', JSON.stringify(loans));
      localStorage.setItem('hr_rewards', JSON.stringify(rewards));
      localStorage.setItem('hr_calendar', JSON.stringify(calendarEvents));
      localStorage.setItem('hr_resignations', JSON.stringify(resignations));
      localStorage.setItem('hr_shifts', JSON.stringify(shifts));
      localStorage.setItem('hr_attendance_rules', JSON.stringify(attendanceRules));
      localStorage.setItem('hr_assets', JSON.stringify(assets));
      localStorage.setItem('hr_goals', JSON.stringify(goals));
      localStorage.setItem('hr_surveys', JSON.stringify(surveys));
      localStorage.setItem('hr_training', JSON.stringify(trainingCourses));
      localStorage.setItem('hr_announcements', JSON.stringify(announcements));
      localStorage.setItem('hr_complaints', JSON.stringify(complaints));
      localStorage.setItem('hr_tasks', JSON.stringify(tasks));
      localStorage.setItem('hr_activity', JSON.stringify(activityLogs));
      localStorage.setItem('hr_docs', JSON.stringify(documents));
      localStorage.setItem('hr_userRole', userRole);
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }, [employees, attendanceLog, insuranceRecords, contractRecords, payrollRecords, calendarEvents, resignations, shifts, attendanceRules, assets, goals, surveys, trainingCourses, announcements, complaints, tasks, activityLogs, documents, userRole]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000);
  };

  const askConfirm = (title: string, message: string, onConfirm: () => void, type: 'danger' | 'warning' = 'danger') => {
    setConfirmState({ isOpen: true, title, message, onConfirm, type });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.user === 'مدير' && loginData.pass === 'admin') {
      setIsLoggedIn(true);
      setUserRole('admin');
      try {
        localStorage.setItem('hr_isLoggedIn', 'true');
        localStorage.setItem('hr_username', 'عمر نشأت');
        localStorage.setItem('hr_userRole', 'admin');
      } catch (e) {
        console.error('Error saving login state to localStorage', e);
      }
      setLoginError('');
    } else if (loginData.user === 'موظف' && loginData.pass === 'user') {
       setIsLoggedIn(true);
       setUserRole('employee');
       try {
         localStorage.setItem('hr_isLoggedIn', 'true');
         localStorage.setItem('hr_username', 'موظف تجريبي');
         localStorage.setItem('hr_userRole', 'employee');
       } catch (e) {}
    } else {
      setLoginError('اسم المستخدم (مدير/موظف) أو كلمة المرور غير صحيحة');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    try {
      localStorage.removeItem('hr_isLoggedIn');
      localStorage.removeItem('hr_username');
    } catch (e) {
      console.error('Error removing login state from localStorage', e);
    }
    setActiveTab('dashboard');
  };

  const generateDummyData = () => {
    const dummyNames = ['أحمد محمد', 'سارة محمود', 'ياسين علي', 'ليلى حسن', 'عمر كمال', 'نورا إبراهيم', 'مصطفى حسين', 'مريم يوسف', 'خالد سعيد', 'رنا جمال'];
    const departments = ['الموارد البشرية', 'الحسابات', 'المبيعات', 'تكنولوجيا المعلومات', 'التسويق'];
    const positions = ['مدير', 'محاسب', 'مهندس', 'مصمم', 'مندوب مبيعات', 'سكرتير'];
    
    const newEmployees = dummyNames.map((name, i) => ({
      id: (i + 1).toString(),
      code: `EMP${1000 + i}`,
      name,
      nationalId: `2900${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      phone: `01${Math.floor(100000000 + Math.random() * 900000000)}`,
      email: `emp${i}@hrworld.com`,
      dept: departments[Math.floor(Math.random() * departments.length)],
      position: positions[Math.floor(Math.random() * positions.length)],
      joinDate: '2023-01-01',
      salary: 5000 + Math.floor(Math.random() * 5000),
      shiftId: (Math.floor(Math.random() * 3) + 1).toString(),
      status: 'active',
      points: Math.floor(Math.random() * 100)
    }));
    
    setEmployees(newEmployees);
    setTasks([
      { id: '1', title: 'مراجعة عقود الموظفين الجدد', description: 'التأكد من اكتمال كافة المستندات والتوقيعات', empId: '1', empName: 'مدير النظام', deadline: '2026-04-30', status: 'Pending', createdAt: '2026-04-15' },
      { id: '2', title: 'تحديث كشوف التأمينات', description: 'إرسال الكشوف المحدثة للهيئة العامة للتأمينات', empId: '2', empName: 'موظف تجريبي', deadline: '2026-04-20', status: 'Completed', createdAt: '2026-04-10' }
    ]);
    
    showToast('تم إضافة بيانات تجريبية بنجاح', 'success');
  };

  if (appLoading) {
    return (
      <div className="fixed inset-0 bg-slate-950 z-[200] flex flex-col items-center justify-center gap-12 overflow-hidden">
        <div className="relative group">
          <div className="w-32 h-32 rounded-[40px] border-4 border-indigo-500/10 border-t-indigo-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon name="shield-check" size={40} className="text-indigo-400 animate-bounce" />
          </div>
        </div>
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-black text-white tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-white animate-pulse">عالم ال HR</h2>
          <p className="text-indigo-400/60 font-black text-xs uppercase tracking-[0.5em]">Advanced Management System</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <Login 
        onLogin={(name) => {
          setIsLoggedIn(true);
          setUsername(name);
          setUserRole('admin');
          try {
            localStorage.setItem('hr_isLoggedIn', 'true');
            localStorage.setItem('hr_username', name);
            localStorage.setItem('hr_userRole', 'admin');
          } catch (e) {
            console.error('Error saving login state', e);
          }
          showToast(`مرحباً بك مجدداً، ${name}`, 'success');
        }} 
      />
    );
  }

  return (
    <div className={`min-h-screen bg-slate-50 font-['Cairo'] transition-all duration-300 ${isFullView ? '' : 'p-0 sm:p-2 md:p-4'}`} dir="rtl">
      
      {/* Top Navbar */}
      <nav className="no-print bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 px-4 py-3 flex items-center justify-between shadow-sm mb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg rotate-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <Icon name="shield-check" size={24} />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-black text-slate-800 leading-tight">عالم ال HR</h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Advanced HR Management</p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto px-2 py-1 no-scrollbar max-w-[60vw]">
          {[
            { id: 'dashboard', icon: 'layout-dashboard', label: 'الرئيسية' },
            { id: 'employees', icon: 'users', label: 'الموظفين' },
            { id: 'attendance', icon: 'chart-column-increasing', label: 'التحليل' },
            { id: 'payroll', icon: 'banknote', label: 'الرواتب' },
            { id: 'kpis', icon: 'chart-line', label: 'الأداء' },
            { id: 'assets', icon: 'package', label: 'العهد' },
            { id: 'org_chart', icon: 'network', label: 'الهيكل' },
            { id: 'doc_center', icon: 'file-text', label: 'المستندات' },
            { id: 'gamification', icon: 'trophy', label: 'التميز' },
            { id: 'rewards', icon: 'trophy', label: 'التميز' },
            { id: 'tasks', icon: 'check-square', label: 'المهام' },
            { id: 'announcements', icon: 'megaphone', label: 'الإعلانات' },
            { id: 'training', icon: 'graduation-cap', label: 'التدريب' },
            { id: 'offices', icon: 'building-2', label: 'الفروع' },

          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <Icon name={item.icon} size={16} />
              <span className="hidden md:inline">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-50 border rounded-xl">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             <span className="text-xs font-bold text-slate-600">{username}</span>
          </div>
          <button onClick={toggleFullScreen} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
            <Icon name={isFullView ? "minimize" : "maximize"} size={20} />
          </button>
          <button onClick={handleLogout} className="w-10 h-10 flex items-center justify-center text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
            <Icon name="log-out" size={20} />
          </button>
        </div>
      </nav>

      <div className={`mx-auto bg-slate-50 transition-all duration-500 ${isFullView ? 'w-full max-w-none px-4 pb-6' : 'max-w-[1400px] px-4 pb-8'}`}>
        {activeTab !== 'dashboard' && (
          <div className="mb-6 flex items-center gap-4 no-print bg-white p-4 rounded-3xl border border-slate-100 shadow-sm animate-fade-in">
            <button onClick={() => setActiveTab('dashboard')} className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-all shadow-md group">
              <Icon name="arrow-right" size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <div>
              <h2 className="text-lg font-black text-slate-800 capitalize">{activeTab.replace('_', ' ')}</h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">نظام الموارد البشرية / {activeTab}</p>
            </div>
            
            <div className="mr-auto flex items-center gap-2">
               {activeTab === 'dashboard' && (
                 <button onClick={generateDummyData} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-black text-xs hover:bg-indigo-600 hover:text-white transition-all">إضافة بيانات تجريبية</button>
               )}
            </div>
          </div>
        )}

        <main>
          {activeTab === 'dashboard' && <Dashboard 
            setActiveTab={setActiveTab} 
            userName={username} 
            employees={employees} 
            attendanceLog={attendanceLog} 
            setIsLoggedIn={setIsLoggedIn} 
            showToast={showToast} 
            toggleFullScreen={toggleFullScreen} 
            isFullView={isFullView} 
            generateDummyData={generateDummyData}
          />}
          {activeTab === 'employees' && <EmployeeTable employees={employees} setEmployees={setEmployees} shifts={shifts} showToast={showToast} askConfirm={askConfirm} />}
          {activeTab === 'attendance' && <Analytics employees={employees} attendanceLog={attendanceLog} />}
          {activeTab === 'offices' && <BranchManagement askConfirm={askConfirm} showToast={showToast} />}
          {activeTab === 'monthly_report' && <MonthlyReport employees={employees} attendanceLog={attendanceLog} setAttendanceLog={setAttendanceLog} shifts={shifts} rules={attendanceRules} showToast={showToast} />}
          {activeTab === 'payroll' && <Payroll employees={employees} payrollRecords={payrollRecords} setPayrollRecords={setPayrollRecords} attendanceLog={attendanceLog} insuranceRecords={insuranceRecords} setActiveTab={setActiveTab} rules={attendanceRules} showToast={showToast} />}
          {activeTab === 'recruitment' && <Recruitment employees={employees} showToast={showToast} askConfirm={askConfirm} />}
          {activeTab === 'leaves' && <Leaves employees={employees} setEmployees={setEmployees} showToast={showToast} />}
          {activeTab === 'insurance' && <Insurance employees={employees} insuranceRecords={insuranceRecords} setInsuranceRecords={setInsuranceRecords} showToast={showToast} askConfirm={askConfirm} />}
          {activeTab === 'contracts' && <Contracts employees={employees} contractRecords={contractRecords} setContractRecords={setContractRecords} showToast={showToast} askConfirm={askConfirm} />}
          {activeTab === 'archive' && <Archive employees={employees} showToast={showToast} />}
          {activeTab === 'calendar' && <Calendar employees={employees} calendarEvents={calendarEvents} setCalendarEvents={setCalendarEvents} showToast={showToast} />}
          {activeTab === 'kpis' && <KPIs employees={employees} showToast={showToast} />}
          {activeTab === 'evaluations' && <Evaluations employees={employees} showToast={showToast} />}
          {activeTab === 'digital_files' && <DigitalFiles employees={employees} showToast={showToast} askConfirm={askConfirm} />}
          {activeTab === 'training' && <Training trainingCourses={trainingCourses} setTrainingCourses={setTrainingCourses} employees={employees} showToast={showToast} askConfirm={askConfirm} />}
          {activeTab === 'resignations' && <Resignations employees={employees} resignations={resignations} setResignations={setResignations} setEmployees={setEmployees} showToast={showToast} askConfirm={askConfirm} />}
          {activeTab === 'attendance_rules' && <AttendanceRules rules={attendanceRules} setRules={setAttendanceRules} showToast={showToast} />}
          {activeTab === 'ats' && <ATS showToast={showToast} />}
          {activeTab === 'loans' && <Loans employees={employees} loans={loans} setLoans={setLoans} showToast={showToast} askConfirm={askConfirm} />}
          {activeTab === 'rewards' && <Rewards employees={employees} rewards={rewards} setRewards={setRewards} showToast={showToast} askConfirm={askConfirm} />}
          {activeTab === 'assets' && <Assets assets={assets} setAssets={setAssets} employees={employees} showToast={showToast} askConfirm={askConfirm} />}
          {activeTab === 'goals' && <Goals goals={goals} setGoals={setGoals} employees={employees} showToast={showToast} />}
          {activeTab === 'surveys' && <Surveys surveys={surveys} setSurveys={setSurveys} showToast={showToast} askConfirm={askConfirm} />}
          {activeTab === 'org_chart' && <OrgChart employees={employees} />}
          {activeTab === 'doc_center' && <DocCenter employees={employees} showToast={showToast} />}
          {activeTab === 'gamification' && <Gamification employees={employees} />}
          {activeTab === 'announcements' && <Announcements announcements={announcements} setAnnouncements={setAnnouncements} showToast={showToast} askConfirm={askConfirm} />}
          {activeTab === 'activity_log' && <ActivityLog logs={activityLogs} />}
          {activeTab === 'complaints' && <Complaints complaints={complaints} setComplaints={setComplaints} employees={employees} showToast={showToast} askConfirm={askConfirm} />}
          {activeTab === 'tasks' && <Tasks tasks={tasks} setTasks={setTasks} employees={employees} showToast={showToast} askConfirm={askConfirm} />}
          {activeTab === 'settings' && <Settings appData={{ employees, attendanceLog, insuranceRecords, contractRecords, payrollRecords, calendarEvents, resignations, shifts, attendanceRules, loans, rewards, assets, goals, surveys, announcements, complaints, tasks }} onRestore={(d: any) => { setEmployees(d.employees || []); setAttendanceLog(d.attendanceLog || {}); setInsuranceRecords(d.insuranceRecords || {}); setContractRecords(d.contractRecords || {}); setPayrollRecords(d.payrollRecords || {}); setCalendarEvents(d.calendarEvents || []); setResignations(d.resignations || []); setShifts(d.shifts || INITIAL_SHIFTS); setAttendanceRules(d.attendanceRules || attendanceRules); setLoans(d.loans || []); setRewards(d.rewards || []); setAssets(d.assets || []); setGoals(d.goals || []); setSurveys(d.surveys || []); setAnnouncements(d.announcements || []); setComplaints(d.complaints || []); setTasks(d.tasks || []); }} onClear={() => { setEmployees([]); setAttendanceLog({}); setInsuranceRecords({}); setContractRecords({}); setPayrollRecords({}); setCalendarEvents([]); setResignations([]); setLoans([]); setRewards([]); setAssets([]); setGoals([]); setSurveys([]); setAnnouncements([]); setComplaints([]); setTasks([]); setShifts(INITIAL_SHIFTS); showToast('تم مسح البيانات', 'warning'); }} shifts={shifts} setShifts={setShifts} showToast={showToast} askConfirm={askConfirm} />}
        </main>
      </div>

      {/* Notifications */}
      <div className="fixed bottom-10 left-10 z-[100] space-y-4 pointer-events-none no-print">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div key={n.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className={`pointer-events-auto flex items-center gap-4 px-8 py-5 rounded-[24px] shadow-2xl border ${n.type === 'error' ? 'bg-rose-600 border-rose-500 text-white' : n.type === 'warning' ? 'bg-amber-500 border-amber-400 text-white' : 'bg-slate-900 border-slate-800 text-white'}`}>
              <Icon name={n.type === 'error' ? 'circle-alert' : n.type === 'warning' ? 'triangle-alert' : 'circle-check'} size={24} />
              <span className="font-black text-lg">{n.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Smart Chat Overlay */}
      <div className="no-print">
         <div className="fixed bottom-10 right-10 z-[200]">
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 12 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveTab(activeTab === 'smart_chat' ? 'dashboard' : 'smart_chat')}
              className={`w-20 h-20 rounded-[30px] shadow-2xl flex items-center justify-center transition-all duration-500 ${activeTab === 'smart_chat' ? 'bg-rose-500 text-white rotate-90' : 'bg-indigo-600 text-white'}`}
            >
               <Icon name={activeTab === 'smart_chat' ? 'x' : 'brain-circuit'} size={32} />
            </motion.button>
         </div>
         
         <AnimatePresence>
            {activeTab === 'smart_chat' && (
              <motion.div 
                initial={{ opacity: 0, y: 100, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 100, scale: 0.9 }}
                className="fixed bottom-36 left-10 right-10 lg:left-auto lg:right-10 lg:w-[450px] top-24 z-[150] shadow-3xl rounded-[50px] overflow-hidden border border-white/5"
              >
                 <SmartChat employees={employees} />
              </motion.div>
            )}
         </AnimatePresence>
      </div>

      {/* Confirmation Modal */}
      {confirmState.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100">
            <div className={`h-2 w-full ${confirmState.type === 'danger' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
            <div className="p-10 text-center space-y-6">
              <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center ${confirmState.type === 'danger' ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'}`}>
                <Icon name={confirmState.type === 'danger' ? 'trash-2' : 'alert-triangle'} size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-800">{confirmState.title}</h3>
                <p className="text-slate-500 font-bold leading-relaxed">{confirmState.message}</p>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setConfirmState(prev => ({ ...prev, isOpen: false }))} className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all">إلغاء</button>
                <button onClick={() => { confirmState.onConfirm(); setConfirmState(prev => ({ ...prev, isOpen: false })); }} className={`flex-1 py-4 text-white font-black rounded-2xl shadow-lg transition-all ${confirmState.type === 'danger' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-amber-500 hover:bg-amber-600'}`}>تأكيد</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
