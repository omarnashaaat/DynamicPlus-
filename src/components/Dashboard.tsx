import React from 'react';
import { Icon } from './Icon';

interface DashboardProps {
    setActiveTab: (tab: string) => void;
    userName: string;
}

export const Dashboard: React.FC<DashboardProps> = React.memo(({ setActiveTab, userName }) => {
    const menuItems = [
        { id: 'employees', title: 'فريق العمل', sub: 'جميع ملفات الموظفين', icon: 'users', color: 'from-indigo-500 to-blue-600', size: 'large' },
        { id: 'attendance', title: 'الحضور والإنصراف', sub: 'سجلات الحضور اليومية', icon: 'clock', color: 'from-blue-500 to-cyan-600' },
        { id: 'monthly_report', title: 'التقرير الشهري', sub: 'ملخص حضور الموظفين', icon: 'file-text', color: 'from-slate-700 to-slate-900' },
        { id: 'payroll', title: 'المرتبات والمكافآت', sub: 'إدارة كشوف الرواتب', icon: 'banknote', color: 'from-emerald-500 to-teal-600', size: 'large' },
        { id: 'regulations', title: 'اللوائح', sub: 'لائحة التأخير والجزاءات', icon: 'list-checks', color: 'from-amber-500 to-orange-600' },
        { id: 'annual_absence', title: 'سجل الغياب السنوي', sub: 'متابعة غيابات الموظفين', icon: 'calendar-x', color: 'from-rose-500 to-red-600' },
        { id: 'calendar', title: 'التقويم السنوي', sub: 'إدارة المواعيد والاجتماعات', icon: 'calendar', color: 'from-violet-500 to-purple-600' },
        { id: 'leaves', title: 'الإجازات', sub: 'رصيد غيابات الشهور', icon: 'calendar-days', color: 'from-pink-500 to-rose-600' },
        { id: 'archive', title: 'الأرشيف والمستندات', sub: 'مسوغات التعيين والملفات', icon: 'folder', color: 'from-orange-500 to-amber-600' },
        { id: 'insurance', title: 'التأمينات الاجتماعية', sub: 'إدارة التغطية التأمينية', icon: 'shield-check', color: 'from-sky-500 to-blue-600' },
        { id: 'contracts', title: 'عقود العمل', sub: 'إدارة وتجديد العقود', icon: 'file-text', color: 'from-teal-500 to-emerald-600' },
        { id: 'recruitment', title: 'التوظيف والتعيين', sub: 'إدارة طلبات التوظيف', icon: 'briefcase', color: 'from-purple-500 to-indigo-600' },
        { id: 'ats', title: 'ATS', sub: 'الماسح الذكي للسير الذاتية', icon: 'sparkles', color: 'from-blue-400 to-indigo-400' },
        { id: 'settings', title: 'إعدادات النظام', sub: 'النسخ الاحتياطي والتهيئة', icon: 'settings', color: 'from-slate-500 to-slate-700' },
    ];

    return (
        <div className="space-y-16 animate-fade-in pt-12 pb-20">
            <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-12 text-white shadow-2xl">
                <div className="relative z-10">
                    <h1 className="text-6xl font-black mb-6 leading-tight">
                        مرحباً بك يا {userName} <span className="inline-block animate-bounce">👋</span>
                    </h1>
                    <p className="text-slate-400 font-bold text-2xl max-w-2xl">
                        نظام Dynamic Plus المطور لإدارة الموارد البشرية. ذكاء في الإدارة، دقة في النتائج.
                    </p>
                </div>
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-emerald-500 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-indigo-500 rounded-full blur-[120px]"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {menuItems.map((item) => (
                    <button 
                        key={item.id} 
                        onClick={() => setActiveTab(item.id)}
                        className={`premium-glass group p-8 rounded-[2.5rem] flex flex-col items-start text-right relative overflow-hidden ${item.size === 'large' ? 'lg:col-span-2' : ''}`}
                    >
                        <div className={`bg-gradient-to-br ${item.color} text-white p-5 rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                            <Icon name={item.icon} size={32} />
                        </div>
                        <h3 className="text-2xl font-black mb-2 text-slate-800 group-hover:text-emerald-600 transition-colors">{item.title}</h3>
                        <p className="text-slate-400 text-sm font-bold leading-relaxed">{item.sub}</p>
                        
                        <div className="absolute bottom-6 left-8 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                            <Icon name="arrow-left" size={20} className="text-emerald-500" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
});
