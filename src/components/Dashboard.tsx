import React from 'react';
import { Icon } from './ui/Icon';
import { motion } from 'motion/react';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
  userName: string;
  employees: any[];
  attendanceLog: any;
  setIsLoggedIn: (val: boolean) => void;
  showToast: (msg: string, type?: any) => void;
  toggleFullScreen?: () => void;
  isFullView?: boolean;
  generateDummyData?: () => void;
}

export default function Dashboard({ 
  setActiveTab, 
  userName, 
  employees, 
  attendanceLog, 
  setIsLoggedIn, 
  showToast, 
  toggleFullScreen, 
  isFullView,
  generateDummyData 
}: DashboardProps) {
  const menuItems = [
    { id: 'employees', title: 'قاعدة البيانات', sub: 'إدارة شؤون العاملين', icon: 'users', color: 'bg-indigo-600', size: 'large' },
    { id: 'attendance', title: 'ذكاء الأعمال', sub: 'تحليلات القوى العاملة', icon: 'chart-column-increasing', color: 'bg-indigo-950', size: 'medium' },
    { id: 'offices', title: 'إدارة الفروع', sub: 'الانتشار الجغرافي', icon: 'building-2', color: 'bg-sky-600', size: 'medium' },
    { id: 'payroll', title: 'الرواتب والمالية', sub: 'المسيرات والتحويلات', icon: 'banknote', color: 'bg-emerald-600', size: 'medium' },
    { id: 'kpis', title: 'الأداء والنمو', sub: 'مؤشرات الكفاءة', icon: 'chart-line', color: 'bg-rose-500', size: 'small' },
    { id: 'training', title: 'أكاديمية التدريب', sub: 'تطوير المسار الوظيفي', icon: 'graduation-cap', color: 'bg-violet-600', size: 'small' },
    { id: 'portal', title: 'بوابة الموظف', sub: 'الخدمة الذاتية', icon: 'circle-user', color: 'bg-slate-800', size: 'small' },
    { id: 'doc_center', title: 'مركز الوثائق', sub: 'النماذج والشهادات', icon: 'file-text', color: 'bg-sky-700', size: 'small' },
    { id: 'recruitment', title: 'التوظيف والتعاقد', sub: 'نظام ATS المتكامل', icon: 'briefcase', color: 'bg-violet-600', size: 'small' },
    { id: 'leaves', title: 'الإجازات', sub: 'الأرصدة والطلبات', icon: 'calendar-days', color: 'bg-rose-500', size: 'small' },
    { id: 'insurance', title: 'التأمينات', sub: 'الحصص والمستندات', icon: 'shield-check', color: 'bg-sky-600', size: 'small' },
    { id: 'contracts', title: 'إدارة العقود', sub: 'المتابعة والتجديد', icon: 'scroll-text', color: 'bg-teal-600', size: 'small' },
    { id: 'loans', title: 'القروض والسلف', sub: 'الحسابات الجارية', icon: 'hand-coins', color: 'bg-amber-600', size: 'small' },
    { id: 'rewards', title: 'التميز الوظيفي', sub: 'المكافآت والتقدير', icon: 'trophy', color: 'bg-orange-600', size: 'small' },
    { id: 'org_chart', title: 'الهيكل الإداري', sub: 'التسلسل الوظيفي', icon: 'network', color: 'bg-blue-800', size: 'small' },
    { id: 'goals', title: 'الأهداف والإنتاجية', sub: 'نظام OKRs الذكي', icon: 'target', color: 'bg-rose-600', size: 'small' },
    { id: 'surveys', title: 'استطلاعات الرأي', sub: 'قياس الرضا', icon: 'message-square', color: 'bg-violet-500', size: 'small' },
    { id: 'announcements', title: 'أخبار الشركة', sub: 'الإعلانات العامة', icon: 'megaphone', color: 'bg-indigo-400', size: 'small' },
    { id: 'archive', title: 'الأرشيف سحابي', sub: 'الملفات الرقمية', icon: 'folder-archive', color: 'bg-slate-600', size: 'small' },
    { id: 'calendar', title: 'الأجندة العامة', sub: 'المناسبات والمهام', icon: 'calendar', color: 'bg-indigo-500', size: 'small' },
    { id: 'evaluations', title: 'تقييم 360', sub: 'التقييم السنوي', icon: 'star', color: 'bg-yellow-600', size: 'small' },
    { id: 'complaints', title: 'صندوق الاقتراحات', sub: 'الشكاوى والاستفسارات', icon: 'inbox', color: 'bg-rose-400', size: 'small' },
    { id: 'activity_log', title: 'سجل النظام', sub: 'متابعة العمليات', icon: 'history', color: 'bg-slate-500', size: 'small' },
    { id: 'settings', title: 'التحكم العام', sub: 'ضبط الإعدادات', icon: 'settings', color: 'bg-slate-700', size: 'small' },
  ];

  const stats = [
    { label: 'إجمالي الموظفين', value: employees.length, icon: 'users', color: 'text-indigo-600', bg: 'bg-indigo-100', trend: '+12%' },
    { label: 'سجل الحضور', value: Object.keys(attendanceLog[new Date().toISOString().split('T')[0]] || {}).length, icon: 'circle-check', color: 'text-emerald-600', bg: 'bg-emerald-100', trend: '98%' },
    { label: 'الموازنة التقديرية', value: employees.reduce((acc, emp) => acc + (emp.salary || 0), 0).toLocaleString(), icon: 'banknote', color: 'text-rose-600', bg: 'bg-rose-100', trend: 'استقرار' },
    { label: 'معدل الدوران', value: '4.2%', icon: 'refresh-ccw', color: 'text-amber-600', bg: 'bg-amber-100', trend: 'تحسن' },
  ];

  return (
    <div className="space-y-10 animate-fade-in w-full pb-10">
      {/* Dynamic Header Section */}
      <div className="no-print font-['Cairo']">
        <div className="bg-slate-900 p-8 md:p-14 rounded-[60px] text-white shadow-2xl relative overflow-hidden group border border-white/5">
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-600/20 rounded-full -mr-32 -mt-32 blur-[120px] group-hover:bg-indigo-600/30 transition-all duration-700"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full -ml-24 -mb-24 blur-[100px]"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-28 h-28 bg-white text-slate-900 rounded-[40px] flex items-center justify-center shadow-2xl shadow-indigo-500/10 shrink-0 transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
               <Icon name="sparkles" size={56} />
            </div>
            <div className="text-center md:text-right flex-1">
              <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">مرحباً بِكَ، <span className="text-indigo-400">{userName}</span></h1>
              <p className="text-slate-400 font-bold text-lg md:text-xl max-w-2xl leading-relaxed">أهلاً بك في منصة <span className="text-white">عالم الموارد البشرية</span>. لديك اليوم {stats[1].value} موظفاً باشروا أعمالهم. نظام التحليلات يشير إلى كفاءة تشغيل بنسبة 94%.</p>
              
              <div className="mt-10 flex flex-wrap gap-5 justify-center md:justify-start">
                 <button onClick={() => setActiveTab('employees')} className="bg-white text-slate-900 px-10 py-4 rounded-[20px] font-black text-sm shadow-xl hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all">لوحة التحكم</button>
                 <button onClick={generateDummyData} className="bg-white/10 backdrop-blur-md border border-white/10 text-white px-10 py-4 rounded-[20px] font-black text-sm hover:bg-white/20 hover:scale-105 active:scale-95 transition-all">توليد بيانات ذكية</button>
                 <button onClick={() => setActiveTab('portal')} className="flex items-center gap-2 group/btn px-6 py-4 text-indigo-400 font-black hover:text-white transition-colors">
                   بوابة الموظفين <Icon name="arrow-left" size={20} className="group-hover/btn:-translate-x-2 transition-transform" />
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout - Premium */}
      <div className="space-y-8">
        <div className="flex items-center gap-6 no-print">
          <div className="p-3 bg-white border rounded-2xl shadow-sm italic font-black text-indigo-600">01.</div>
          <h2 className="text-3xl font-black text-slate-900 italic tracking-tight uppercase">مركز العمليات <span className="text-slate-300 ml-2">Operations Hub</span></h2>
          <div className="h-px flex-1 bg-gradient-to-l from-slate-200 to-transparent"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 no-print">
          {menuItems.map((item) => (
            <motion.button 
              key={item.id} 
              whileHover={{ y: -10, rotate: 1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTab(item.id)}
              className={`group relative overflow-hidden p-8 rounded-[40px] border transition-all duration-500 flex flex-col items-center justify-center text-center bg-white border-slate-100/80 shadow-sm hover:border-indigo-500/30 hover:shadow-[0_20px_60px_-15px_rgba(79,70,229,0.12)] ${
                item.size === 'large' ? 'col-span-2 row-span-2 md:p-12' : 
                item.size === 'medium' ? 'col-span-2' : 'col-span-1'
              }`}
            >
              <div className={`${item.color} text-white p-6 rounded-[28px] mb-6 shadow-2xl transition-all duration-700 group-hover:scale-125 group-hover:rotate-12 group-hover:shadow-indigo-500/40 relative z-10`}>
                <Icon name={item.icon} size={item.size === 'large' ? 56 : 32} />
              </div>
              
              <div className="relative z-10 space-y-2">
                 <h3 className={`font-black text-slate-900 tracking-tight transition-colors group-hover:text-indigo-600 ${item.size === 'large' ? 'text-2xl' : 'text-sm'}`}>{item.title}</h3>
                 {item.size !== 'small' && <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.1em] italic">{item.sub}</p>}
              </div>
              
              {/* Background Accent */}
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-slate-50 rounded-full group-hover:bg-indigo-50 transition-colors duration-500"></div>
              <div className="absolute top-2 left-2 text-[10px] font-black text-slate-100 uppercase tracking-widest">{item.id.slice(0, 3)}</div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
