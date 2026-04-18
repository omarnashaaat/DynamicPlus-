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
import PolicyCenter from './components/PolicyCenter';
import Gamification from './components/Gamification';
import DocCenter from './components/DocCenter';
import Announcements from './components/Announcements';
import Complaints from './components/Complaints';
import Analytics from './components/Analytics';
import Tasks from './components/Tasks';
import ActivityLog from './components/ActivityLog';
import BranchManagement from './components/BranchManagement';
import DeveloperPage from './components/DeveloperPage';
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
  
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifSidebar, setShowNotifSidebar] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

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
  
  const INITIAL_POLICY_CATEGORIES = [
    { id: 'all', title: 'الكل', icon: 'layers' },
    { id: 'administrative', title: 'إدارية', icon: 'file-text' },
    { id: 'legal', title: 'قانونية', icon: 'scale' },
    { id: 'financial', title: 'مالية', icon: 'banknote' },
    { id: 'assets', title: 'العهدة', icon: 'package' },
  ];
  
  const [policyCategories, setPolicyCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('hr_policy_categories');
      return saved ? JSON.parse(saved) : INITIAL_POLICY_CATEGORIES;
    } catch (e) {
      return INITIAL_POLICY_CATEGORIES;
    }
  });

  const INITIAL_DOC_TYPES = [
    { title: 'شهادة خبرة', sub: 'Experience Certificate', icon: 'award', color: 'bg-indigo-600' },
    { title: 'بيان حالة وظيفية', sub: 'Job Status Report', icon: 'file-text', color: 'bg-sky-600' },
    { title: 'نموذج إجازة سنوية', sub: 'Leave Request Form', icon: 'calendar-plus', color: 'bg-rose-500' },
    { title: 'إقرار استلام العمل', sub: 'Job Acceptance Form', icon: 'clipboard-check', color: 'bg-emerald-600' },
    { title: 'طلب استقالة', sub: 'Resignation Form', icon: 'log-out', color: 'bg-slate-800' },
    { title: 'مفردات مرتب', sub: 'Detailed Salary Sheet', icon: 'banknote', color: 'bg-amber-600' },
    { title: 'شهادة تقدير', sub: 'Certificate of Appreciation', icon: 'award', color: 'bg-amber-500' },
  ];

  const [docTypes, setDocTypes] = useState(() => {
    try {
      const saved = localStorage.getItem('hr_doc_types');
      return saved ? JSON.parse(saved) : INITIAL_DOC_TYPES;
    } catch (e) {
      return INITIAL_DOC_TYPES;
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

  const [issuedDocs, setIssuedDocs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hr_issued_docs') || '[]');
    } catch (e) {
      console.error('Error reading hr_issued_docs from localStorage', e);
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
    const handleKD = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKD);
    
    // Safety timeout to end loading
    const loader = setTimeout(() => {
      setAppLoading(false);
    }, 1000);

    return () => {
      window.removeEventListener('keydown', handleKD);
      clearTimeout(loader);
    };
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
      localStorage.setItem('hr_issued_docs', JSON.stringify(issuedDocs));
      localStorage.setItem('hr_policy_categories', JSON.stringify(policyCategories));
      localStorage.setItem('hr_doc_types', JSON.stringify(docTypes));
      localStorage.setItem('hr_userRole', userRole);
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }, [employees, attendanceLog, insuranceRecords, contractRecords, payrollRecords, calendarEvents, resignations, shifts, attendanceRules, assets, goals, surveys, trainingCourses, announcements, complaints, tasks, activityLogs, documents, issuedDocs, policyCategories, docTypes, userRole]);

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
          <h2 className="text-4xl font-black text-white tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-white animate-pulse">عالم الـ HR</h2>
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
      <nav className="no-print glass-effect sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-2xl mb-8 border-b border-white/40">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg rotate-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <Icon name="briefcase" size={24} />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-black text-slate-800 leading-tight">عالم الـ HR</h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Advanced HR Management</p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto px-2 py-1 no-scrollbar max-w-[60vw]">
          {[
            { id: 'dashboard', icon: 'layout-dashboard', label: 'الرئيسية' },
            { id: 'employees', icon: 'users', label: 'شؤون الموظفين' },
            { id: 'attendance', icon: 'clock', label: 'الحضور والانصراف' },
            { id: 'payroll', icon: 'banknote', label: 'الرواتب والأجور' },
            { id: 'monthly_report', icon: 'file-chart-column', label: 'التقارير الشهرية' },
            { id: 'kpis', icon: 'chart-line', label: 'تقييم الأداء' },
            { id: 'assets', icon: 'package', label: 'إدارة العهد' },
            { id: 'policies', icon: 'scroll-text', label: 'سياسات الشركة' },
            { id: 'doc_center', icon: 'file-text', label: 'مركز النماذج' },
            { id: 'digital_files', icon: 'cloud-upload', label: 'الأرشيف الرقمي' },
            { id: 'tasks', icon: 'list-todo', label: 'المهام الإدارية' },
            { id: 'announcements', icon: 'megaphone', label: 'أخبار الشركة' },
            { id: 'offices', icon: 'building-2', label: 'المواقع والفروع' },
            { id: 'developer', icon: 'award', label: 'عمر نشأت' },
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
          <button onClick={() => setShowSearch(true)} className="w-10 h-10 hidden md:flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-xl transition-all border border-slate-100">
            <Icon name="search" size={20} />
          </button>
          <div className="relative group">
            <button onClick={() => setShowNotifSidebar(true)} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-xl transition-all relative">
              <Icon name="bell" size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
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
          {activeTab === 'attendance' && <Attendance employees={employees} attendanceLog={attendanceLog} setAttendanceLog={setAttendanceLog} shifts={shifts} rules={attendanceRules} showToast={showToast} askConfirm={askConfirm} />}
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
          {activeTab === 'doc_center' && <DocCenter employees={employees} showToast={showToast} issuedDocs={issuedDocs} setIssuedDocs={setIssuedDocs} askConfirm={askConfirm} docTypes={docTypes} />}
          {activeTab === 'policies' && <PolicyCenter categories={policyCategories} />}
          {activeTab === 'gamification' && <Gamification employees={employees} />}
          {activeTab === 'developer' && <DeveloperPage />}
          {activeTab === 'announcements' && <Announcements announcements={announcements} setAnnouncements={setAnnouncements} showToast={showToast} askConfirm={askConfirm} />}
          {activeTab === 'activity_log' && <ActivityLog logs={activityLogs} />}
          {activeTab === 'complaints' && <Complaints complaints={complaints} setComplaints={setComplaints} employees={employees} showToast={showToast} askConfirm={askConfirm} />}
          {activeTab === 'tasks' && <Tasks tasks={tasks} setTasks={setTasks} employees={employees} showToast={showToast} askConfirm={askConfirm} />}
          {activeTab === 'settings' && <Settings 
            appData={{ employees, attendanceLog, insuranceRecords, contractRecords, payrollRecords, calendarEvents, resignations, shifts, attendanceRules, loans, rewards, assets, goals, surveys, announcements, complaints, tasks, policyCategories, docTypes }} 
            onRestore={(d: any) => { 
              setEmployees(d.employees || []); 
              setAttendanceLog(d.attendanceLog || {}); 
              setInsuranceRecords(d.insuranceRecords || {}); 
              setContractRecords(d.contractRecords || {}); 
              setPayrollRecords(d.payrollRecords || {}); 
              setCalendarEvents(d.calendarEvents || []); 
              setResignations(d.resignations || []); 
              setShifts(d.shifts || INITIAL_SHIFTS); 
              setAttendanceRules(d.attendanceRules || attendanceRules); 
              setLoans(d.loans || []); 
              setRewards(d.rewards || []); 
              setAssets(d.assets || []); 
              setGoals(d.goals || []); 
              setSurveys(d.surveys || []); 
              setAnnouncements(d.announcements || []); 
              setComplaints(d.complaints || []); 
              setTasks(d.tasks || []); 
              setPolicyCategories(d.policyCategories || INITIAL_POLICY_CATEGORIES);
              setDocTypes(d.docTypes || INITIAL_DOC_TYPES);
            }} 
            onClear={() => { 
              setEmployees([]); 
              setAttendanceLog({}); 
              setInsuranceRecords({}); 
              setContractRecords({}); 
              setPayrollRecords({}); 
              setCalendarEvents([]); 
              setResignations([]); 
              setLoans([]); 
              setRewards([]); 
              setAssets([]); 
              setGoals([]); 
              setSurveys([]); 
              setAnnouncements([]); 
              setComplaints([]); 
              setTasks([]); 
              setShifts(INITIAL_SHIFTS); 
              setPolicyCategories(INITIAL_POLICY_CATEGORIES);
              setDocTypes(INITIAL_DOC_TYPES);
              showToast('تم مسح البيانات', 'warning'); 
            }} 
            shifts={shifts} 
            setShifts={setShifts} 
            policyCategories={policyCategories}
            setPolicyCategories={setPolicyCategories}
            docTypes={docTypes}
            setDocTypes={setDocTypes}
            showToast={showToast} 
            askConfirm={askConfirm} 
          />}
        </main>
      </div>

      {/* Search Palette */}
      <AnimatePresence>
        {showSearch && (
          <div className="fixed inset-0 z-[600] flex items-start justify-center pt-[15vh] px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowSearch(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl bg-white rounded-[40px] shadow-3xl overflow-hidden relative z-10 border border-white/20"
            >
              <div className="p-8 border-b border-slate-50 flex items-center gap-4 bg-slate-50/50">
                <Icon name="search" size={24} className="text-indigo-600" />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="ابحث عن موظف، مهمة، أو قسم... (Ctrl + K)" 
                  className="w-full bg-transparent text-xl font-black text-slate-800 outline-none placeholder:text-slate-300"
                  value={globalSearchQuery}
                  onChange={e => setGlobalSearchQuery(e.target.value)}
                />
                <button onClick={() => setShowSearch(false)} className="p-2 bg-white rounded-xl shadow-sm text-slate-300 hover:text-slate-500">
                  <Icon name="x" size={20} />
                </button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                <div className="p-4 space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2 italic">نتائج البحث المقترحة</h4>
                    <div className="space-y-2">
                       {employees.filter(e => e.name.toLowerCase().includes(globalSearchQuery.toLowerCase())).slice(0, 5).map(emp => (
                         <button 
                           key={emp.id}
                           onClick={() => { setActiveTab('employees'); setShowSearch(false); }}
                           className="w-full p-4 hover:bg-slate-50 rounded-3xl flex items-center justify-between group transition-all"
                         >
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black italic">
                                  {emp.name[0]}
                               </div>
                               <div className="text-right">
                                  <p className="font-black text-slate-800">{emp.name}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{emp.dept} / {emp.position}</p>
                               </div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                               <Icon name="arrow-left" size={16} className="text-indigo-600" />
                            </div>
                         </button>
                       ))}
                       {globalSearchQuery && employees.filter(e => e.name.toLowerCase().includes(globalSearchQuery.toLowerCase())).length === 0 && (
                         <div className="p-10 text-center text-slate-300 font-black italic">لا توجد نتائج مطابقة</div>
                       )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notification Sidebar */}
      <AnimatePresence>
        {showNotifSidebar && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowNotifSidebar(false)}
              className="fixed inset-0 z-[550] bg-slate-900/40 backdrop-blur-sm no-print" 
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-full max-w-[450px] bg-white z-[560] shadow-3xl no-print p-10 flex flex-col"
            >
               <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                        <Icon name="bell" size={24} />
                     </div>
                     <h2 className="text-2xl font-black text-slate-900">التنبيهات الإدارية</h2>
                  </div>
                  <button onClick={() => setShowNotifSidebar(false)} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-slate-900 transition-all">
                     <Icon name="x" size={24} />
                  </button>
               </div>
               
               <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar pb-10">
                  {[
                    { title: 'موعد تجديد عقد عمل', sub: 'الموظف أحمد محمد (بعد 3 أيام)', date: 'الآن', type: 'warning' },
                    { title: 'طلب سلفة جديد', sub: 'طلب مقدم من سارة محمود بقيمة 5000 ج.م', date: 'منذ ساعة', type: 'info' },
                    { title: 'اكتمال المسير المالي', sub: 'تم مراجعة كافة الرواتب لشهر أبريل', date: 'منذ ساعتين', type: 'success' },
                    { title: 'تنبيه غياب متكرر', sub: 'ياسين علي (3 أيام متتالية)', date: 'اليوم', type: 'error' },
                  ].map((notif, i) => (
                    <div key={i} className="p-6 bg-slate-50/50 border border-slate-100 rounded-[35px] hover:bg-white hover:shadow-xl transition-all cursor-pointer group">
                       <div className="flex gap-4">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                            notif.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                            notif.type === 'info' ? 'bg-blue-100 text-blue-600' :
                            notif.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                          }`}>
                             <Icon name={notif.type === 'warning' ? 'alert-triangle' : notif.type === 'info' ? 'info' : notif.type === 'success' ? 'circle-check' : 'circle-alert'} size={18} />
                          </div>
                          <div className="space-y-1">
                             <p className="font-black text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{notif.title}</p>
                             <p className="text-xs text-slate-500 font-bold leading-relaxed">{notif.sub}</p>
                             <p className="text-[10px] text-slate-300 font-black uppercase mt-4 italic">{notif.date}</p>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
               
               <div className="pt-8 border-t border-slate-100">
                  <button className="w-full py-5 bg-slate-900 text-white rounded-[25px] font-black text-sm shadow-xl hover:bg-indigo-600 transition-all">مشاهدة كافة السجلات</button>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
