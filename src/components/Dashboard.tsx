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
    { id: 'employees', title: 'شؤون الموظفين', sub: 'إدارة ملفات وبيانات الموظفين', icon: 'users', color: 'bg-indigo-600', size: 'large' },
    { id: 'attendance', title: 'الحضور والانصراف', sub: 'متابعة سجلات التحضير اليومي', icon: 'chart-column', color: 'bg-indigo-950', size: 'medium' },
    { id: 'offices', title: 'المواقع والفروع', sub: 'إدارة الفروع والمواقع الجغرافية', icon: 'building-2', color: 'bg-sky-600', size: 'medium' },
    { id: 'payroll', title: 'الرواتب والأجور', sub: 'كشوف المرتبات والمسيرات المالية', icon: 'banknote', color: 'bg-emerald-600', size: 'medium' },
    { id: 'monthly_report', title: 'التقارير الشهرية', sub: 'سجلات الحضور والغياب المجمعة', icon: 'file-chart-column', color: 'bg-emerald-700', size: 'medium' },
    { id: 'kpis', title: 'تقييم الأداء', sub: 'مؤشرات الكفاءة والإنتاجية', icon: 'chart-line', color: 'bg-rose-500', size: 'small' },
    { id: 'training', title: 'التدريب والتطوير', sub: 'تطوير مهارات فريق العمل', icon: 'graduation-cap', color: 'bg-violet-600', size: 'small' },
    { id: 'doc_center', title: 'مركز النماذج', sub: 'النماذج الإدارية والشهادات', icon: 'file-text', color: 'bg-sky-700', size: 'small' },
    { id: 'recruitment', title: 'التوظيف', sub: 'إدارة طلبات التوظيف والمقابلات', icon: 'briefcase', color: 'bg-violet-600', size: 'small' },
    { id: 'leaves', title: 'الإجازات', sub: 'إدارة الأرصدة وطلبات الإجازة', icon: 'calendar-days', color: 'bg-rose-500', size: 'small' },
    { id: 'insurance', title: 'التأمينات', sub: 'إدارة التأمينات الاجتماعية والطبية', icon: 'shield-check', color: 'bg-sky-600', size: 'small' },
    { id: 'contracts', title: 'العقود', sub: 'متابعة وتجديد عقود الموظفين', icon: 'scroll-text', color: 'bg-teal-600', size: 'small' },
    { id: 'loans', title: 'السلف والقروض', sub: 'إدارة السلف والذمم المالية', icon: 'hand-coins', color: 'bg-amber-600', size: 'small' },
    { id: 'rewards', title: 'المكافآت', sub: 'نظام الحوافز والمكافآت التشجيعية', icon: 'gift', color: 'bg-orange-600', size: 'small' },
    { id: 'gamification', title: 'التحفيز الرقمي', sub: 'نظام النقاط ولوحة الصدارة', icon: 'trophy', color: 'bg-orange-600', size: 'small' },
    { id: 'org_chart', title: 'الهيكل التنظيمي', sub: 'التسلسل الإداري للشركة', icon: 'network', color: 'bg-blue-800', size: 'small' },
    { id: 'policies', title: 'سياسات الشركة', sub: 'الدليل التنظيمي واللوائح', icon: 'scroll-text', color: 'bg-slate-900', size: 'small' },
    { id: 'goals', title: 'الأهداف الاستراتيجية', sub: 'متابعة الأهداف والنتائج الرئيسية', icon: 'target', color: 'bg-rose-600', size: 'small' },
    { id: 'surveys', title: 'الاستبيانات', sub: 'قياس رضا الموظفين والمقترحات', icon: 'message-square', color: 'bg-violet-500', size: 'small' },
    { id: 'announcements', title: 'أخبار الشركة', sub: 'لوحة الإعلانات والتعميمات', icon: 'megaphone', color: 'bg-indigo-400', size: 'small' },
    { id: 'archive', title: 'الأرشيف الرقمي', sub: 'إدارة الوثائق والملفات الإلكترونية', icon: 'folder-archive', color: 'bg-slate-600', size: 'small' },
    { id: 'calendar', title: 'التقويم', sub: 'المناسبات والاجتماعات الهامة', icon: 'calendar', color: 'bg-indigo-500', size: 'small' },
    { id: 'evaluations', title: 'التقييم السنوي', sub: 'مراجعة أداء الموظفين السنوي', icon: 'star', color: 'bg-yellow-600', size: 'small' },
    { id: 'complaints', title: 'الشكاوى والمقترحات', sub: 'صندوق التواصل الداخلي', icon: 'inbox', color: 'bg-rose-400', size: 'small' },
    { id: 'activity_log', title: 'سجل العمليات', sub: 'مراقبة التغييرات في النظام', icon: 'history', color: 'bg-slate-500', size: 'small' },
    { id: 'settings', title: 'الإعدادات', sub: 'تهيئة النظام وصلاحيات المستخدمين', icon: 'settings', color: 'bg-slate-700', size: 'small' },
  ];

  const stats = [
    { label: 'إجمالي الموظفين', value: employees.length, icon: 'users', color: 'text-indigo-600', bg: 'bg-indigo-100', trend: '+12%' },
    { label: 'الحضور اليومي', value: Object.keys(attendanceLog[new Date().toISOString().split('T')[0]] || {}).length, icon: 'circle-check', color: 'text-emerald-600', bg: 'bg-emerald-100', trend: '98%' },
    { label: 'إجمالي الرواتب', value: employees.reduce((acc, emp) => acc + (emp.salary || 0), 0).toLocaleString(), icon: 'banknote', color: 'text-rose-600', bg: 'bg-rose-100', trend: 'استقرار' },
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
              className={`group relative overflow-hidden p-8 premium-card flex flex-col items-center justify-center text-center ${
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 no-print">
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-white border rounded-2xl shadow-sm italic font-black text-rose-500">02.</div>
              <h2 className="text-3xl font-black text-slate-900 italic tracking-tight uppercase">أخبار الشركة <span className="text-slate-300 ml-2">Corporate News</span></h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'موعد إفطار رمضان الجماعي', date: 'منذ ساعتين', tag: 'إجتماعي', color: 'bg-emerald-100 text-emerald-600' },
                { title: 'تحديث لائحة الإجازات الجديدة', date: 'منذ يوم', tag: 'إداري', color: 'bg-indigo-100 text-indigo-600' },
              ].map((news, idx) => (
                <div key={idx} className="bg-white p-6 rounded-[35px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                   <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${news.color}`}>{news.tag}</span>
                   <h4 className="mt-4 font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{news.title}</h4>
                   <div className="mt-6 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-bold">{news.date}</span>
                      <Icon name="arrow-left" size={16} className="text-slate-200 group-hover:text-indigo-400 group-hover:-translate-x-2 transition-all" />
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-6">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-white border rounded-2xl shadow-sm italic font-black text-amber-500">03.</div>
              <h2 className="text-3xl font-black text-slate-900 italic tracking-tight uppercase">المميزين <span className="text-slate-300 ml-2">Spotlight</span></h2>
           </div>
           
           <div className="bg-slate-900 p-8 rounded-[40px] text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                 <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/10 rotate-3">
                    <Icon name="medal" size={40} className="text-yellow-400" />
                 </div>
                 <div>
                    <h3 className="text-lg font-black">أحمد محمد علي</h3>
                    <p className="text-xs text-indigo-300 font-bold">موظف الشهر المثالي</p>
                 </div>
                 <p className="text-[11px] text-slate-400 font-bold italic">"تقدير لجهوده الاستثنائية في تطوير نظام الأرشفة الرقمي"</p>
                 <button onClick={() => setActiveTab('rewards')} className="w-full py-3 bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black hover:bg-white/20 transition-all">شاهد لوحة الشرف</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
