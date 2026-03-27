import React from 'react';
import { Icon } from '../components/Layout';

export const Dashboard = ({ setActiveTab, userName, onLogout }: { setActiveTab: (tab: string) => void, userName: string, onLogout?: () => void }) => {
    const menuItems = [
        { id: 'employees', title: 'فريق العمل', sub: 'جميع ملفات الموظفين', icon: 'users', color: 'bg-indigo-600' },
        { id: 'attendance', title: 'الحضور والإنصراف', sub: 'سجلات الحضور اليومية', icon: 'clock', color: 'bg-blue-600' },
        { id: 'attendance_policy', title: 'لائحة الحضور', sub: 'قواعد التأخير والجزاءات', icon: 'file-text', color: 'bg-rose-500' },
        { id: 'monthly_report', title: 'التقرير الشهري', sub: 'ملخص حضور الموظفين', icon: 'file-text', color: 'bg-indigo-600' },
        { id: 'payroll', title: 'المرتبات والمكافآت', sub: 'إدارة كشوف الرواتب', icon: 'banknote', color: 'bg-emerald-600' },
        { id: 'annual_calendar', title: 'التقويم السنوي', sub: 'إدارة الإجازات والمناسبات', icon: 'calendar', color: 'bg-indigo-500' },
        { id: 'leaves', title: 'الإجازات', sub: 'رصيد غيابات الشهور', icon: 'calendar-days', color: 'bg-pink-600' },
        { id: 'archive', title: 'الأرشيف والمستندات', sub: 'مسوغات التعيين والملفات', icon: 'folder-archive', color: 'bg-amber-500' },
        { id: 'insurance', title: 'التأمينات الاجتماعية', sub: 'إدارة التغطية التأمينية', icon: 'shield-check', color: 'bg-sky-600' },
        { id: 'contracts', title: 'عقود العمل', sub: 'إدارة وتجديد العقود', icon: 'file-text', color: 'bg-teal-600' },
        { id: 'recruitment', title: 'التوظيف والتعيين', sub: 'إدارة طلبات التوظيف', icon: 'briefcase', color: 'bg-violet-600' },
        { id: 'ats', title: 'ATS', sub: 'الفرز الذكي للسير الذاتية', icon: 'sparkles', color: 'bg-indigo-500' },
        { id: 'kpis', title: 'مؤشرات الأداء (KPIs)', sub: 'متابعة أداء الموظفين', icon: 'trending-up', color: 'bg-orange-500' },
        { id: 'evaluation', title: 'تقييم الموظف', sub: 'التقييمات الدورية', icon: 'star', color: 'bg-yellow-500' },
        { id: 'digital_archive', title: 'الأرشيف الرقمي', sub: 'ملفات الموظفين (PDF)', icon: 'folder', color: 'bg-rose-500' },
        { id: 'training', title: 'تدريبات الموظفين', sub: 'الدورات والنتائج', icon: 'graduation-cap', color: 'bg-blue-600' },
        { id: 'resignations', title: 'الاستقالات', sub: 'إدارة طلبات الاستقالة', icon: 'user-minus', color: 'bg-pink-500' },
        { id: 'settings', title: 'إعدادات النظام', sub: 'النسخ الاحتياطي والتهيئة', icon: 'settings', color: 'bg-slate-700' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div className="pr-2">
                    <p className="text-indigo-600 font-bold text-sm mb-1">شركة طيبة للاستثمار العقاري والتطوير العمراني</p>
                    <h1 className="text-4xl font-black text-slate-800 mb-2 flex items-center gap-2">مرحباً بك يا {userName} 👋</h1>
                    <p className="text-slate-500 font-bold tracking-wide text-sm">إدارة أسهل... لقرارات أدق.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2.5 rounded-2xl font-bold text-sm border border-emerald-100">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        متصل
                    </div>
                    <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-colors">
                        <Icon name="download" size={18} />
                        تحميل التقرير PDF
                    </button>
                    <button onClick={onLogout} className="flex items-center gap-2 bg-rose-50 text-rose-600 px-6 py-2.5 rounded-2xl font-bold text-sm border border-rose-100 hover:bg-rose-100 transition-colors">
                        <Icon name="log-out" size={18} />
                        تسجيل الخروج
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-[30px] shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 font-bold text-xs mb-1">إجمالي الموظفين</p>
                        <h3 className="text-3xl font-black text-slate-800">2</h3>
                    </div>
                    <div className="bg-indigo-50 text-indigo-600 p-4 rounded-2xl">
                        <Icon name="users" size={28} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[30px] shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 font-bold text-xs mb-1">حضور اليوم</p>
                        <h3 className="text-3xl font-black text-slate-800">0</h3>
                    </div>
                    <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl">
                        <Icon name="check-circle" size={28} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[30px] shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 font-bold text-xs mb-1">طلبات التوظيف</p>
                        <h3 className="text-3xl font-black text-slate-800">0</h3>
                    </div>
                    <div className="bg-amber-50 text-amber-600 p-4 rounded-2xl">
                        <Icon name="briefcase" size={28} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[30px] shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 font-bold text-xs mb-1">إجازات معلقة</p>
                        <h3 className="text-3xl font-black text-slate-800">0</h3>
                    </div>
                    <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl">
                        <Icon name="clock" size={28} />
                    </div>
                </div>
            </div>

            {/* Main Menu Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {menuItems.map((item) => (
                    <button 
                        key={item.id} 
                        onClick={() => setActiveTab(item.id)}
                        className="group p-8 rounded-[40px] shadow-sm transition-all duration-300 flex flex-col items-center text-center border bg-white border-slate-100 hover:border-indigo-100 hover:shadow-md hover:-translate-y-1"
                    >
                        <div className={`${item.color} text-white p-5 rounded-[24px] mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300 flex items-center justify-center`}>
                            <Icon name={item.icon} size={32} />
                        </div>
                        <h3 className="text-xl font-black mb-1 text-slate-800">{item.title}</h3>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{item.sub}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};
