import React from 'react';
import { Icon, Card } from '../components/Layout';
import { cn } from '../lib/utils';

export const Dashboard = ({ setActiveTab, userName, onLogout, employees }: { setActiveTab: (tab: string) => void, userName: string, onLogout?: () => void, employees: any[] }) => {
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

    const stats = [
        { label: 'إجمالي الموظفين', value: employees.length.toString(), icon: 'users', color: 'bg-indigo-50 text-indigo-600' },
        { label: 'حضور اليوم', value: '0', icon: 'check-circle', color: 'bg-emerald-50 text-emerald-600' },
        { label: 'طلبات التوظيف', value: '0', icon: 'briefcase', color: 'bg-amber-50 text-amber-600' },
        { label: 'إجازات معلقة', value: '0', icon: 'clock', color: 'bg-rose-50 text-rose-600' },
    ];

    return (
        <div className="space-y-10 animate-fade-in w-full mx-auto">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 no-print">
                <div className="pr-2">
                    <p className="text-indigo-600 font-black text-sm mb-2 tracking-widest uppercase">شركة طيبة للاستثمار العقاري</p>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 mb-3 flex items-center gap-4 tracking-tighter">مرحباً بك يا {userName} 👋</h1>
                    <p className="text-slate-500 font-bold tracking-wide text-lg">إدارة أسهل... لقرارات أدق.</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                    <div className="flex items-center gap-3 bg-white text-emerald-600 px-6 py-3.5 rounded-2xl font-black text-sm border border-emerald-100 shadow-xl shadow-emerald-500/5">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        النظام متصل
                    </div>
                    <button onClick={() => window.print()} className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-base shadow-2xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95">
                        <Icon name="download" size={22} />
                        طباعة التقرير العام
                    </button>
                    <button onClick={onLogout} className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-white text-rose-500 px-8 py-4 rounded-2xl font-black text-base border border-rose-100 shadow-xl shadow-rose-500/5 hover:bg-rose-50 transition-all active:scale-95">
                        <Icon name="log-out" size={22} />
                        خروج
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white p-8 rounded-[45px] shadow-[0_15px_50px_rgba(0,0,0,0.03)] border border-slate-50 flex items-center justify-between hover:shadow-[0_25px_70px_rgba(0,0,0,0.07)] transition-all group hover:-translate-y-1">
                        <div>
                            <p className="text-slate-400 font-black text-xs mb-2 uppercase tracking-widest">{s.label}</p>
                            <h3 className="text-4xl font-black text-slate-800 tracking-tighter">{s.value}</h3>
                        </div>
                        <div className={cn("p-5 rounded-3xl shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6", s.color)}>
                            <Icon name={s.icon} size={32} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Menu Grid */}
            <div className="space-y-6">
                <div className="flex items-center gap-4 no-print">
                    <div className="h-px flex-1 bg-slate-100"></div>
                    <span className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">قائمة الخدمات الرئيسية</span>
                    <div className="h-px flex-1 bg-slate-100"></div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-8 pb-16 no-print">
                    {menuItems.map((item) => (
                        <button 
                            key={item.id} 
                            onClick={() => setActiveTab(item.id)}
                            className="group p-8 md:p-10 rounded-[50px] shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all duration-500 flex flex-col items-center text-center border bg-white border-slate-50 hover:border-indigo-200 hover:shadow-[0_30px_80px_rgba(79,70,229,0.1)] hover:-translate-y-3 active:scale-95"
                        >
                            <div className={`${item.color} text-white p-6 rounded-[30px] mb-6 shadow-2xl shadow-indigo-500/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 flex items-center justify-center`}>
                                <Icon name={item.icon} size={36} />
                            </div>
                            <h3 className="text-xl md:text-2xl font-black mb-2 text-slate-800 leading-tight tracking-tight group-hover:text-indigo-600 transition-colors">{item.title}</h3>
                            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">{item.sub}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
