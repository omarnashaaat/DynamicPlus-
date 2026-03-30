import React, { useState, useMemo } from 'react';
import { Icon } from '../components/Layout';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ar } from 'date-fns/locale';

export const AnnualCalendar = ({ employees }: any) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const holidays = [
        { date: '2026-01-07', name: 'عيد الميلاد المجيد' },
        { date: '2026-01-25', name: 'عيد الثورة' },
        { date: '2026-04-25', name: 'عيد تحرير سيناء' },
        { date: '2026-05-01', name: 'عيد العمال' },
        { date: '2026-07-23', name: 'عيد الثورة' },
        { date: '2026-10-06', name: 'عيد القوات المسلحة' },
    ];

    const getDayEvents = (day: Date) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const dayHolidays = holidays.filter(h => h.date === dateStr);
        const dayBirthdays = employees.filter((e: any) => {
            if (!e.nationalId || e.nationalId.length < 14) return false;
            const birthYear = e.nationalId.substring(1, 3);
            const birthMonth = e.nationalId.substring(3, 5);
            const birthDay = e.nationalId.substring(5, 7);
            return birthMonth === format(day, 'MM') && birthDay === format(day, 'dd');
        });
        const dayAnniversaries = employees.filter((e: any) => {
            if (!e.joinDate) return false;
            return format(new Date(e.joinDate), 'MM-dd') === format(day, 'MM-dd');
        });

        return { holidays: dayHolidays, birthdays: dayBirthdays, anniversaries: dayAnniversaries };
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-800">التقويم السنوي</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">الإجازات الرسمية والمناسبات الخاصة</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => window.print()}
                        className="bg-slate-800 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg hover:bg-slate-900 transition-all"
                    >
                        <Icon name="printer" size={20} /> طباعة التقويم
                    </button>
                    <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                        <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-indigo-600">
                            <Icon name="chevron-right" size={20} />
                        </button>
                        <span className="px-4 font-black text-slate-800 min-w-[150px] text-center">
                            {format(currentDate, 'MMMM yyyy', { locale: ar })}
                        </span>
                        <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-indigo-600">
                            <Icon name="chevron-right" className="rotate-180" size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-4 print:gap-1">
                {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map(day => (
                    <div key={day} className="text-center py-4 font-black text-slate-400 text-xs uppercase tracking-widest">{day}</div>
                ))}
                {calendarDays.map((day, i) => {
                    const { holidays, birthdays, anniversaries } = getDayEvents(day);
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isToday = isSameDay(day, new Date());

                    return (
                        <div key={i} className={`min-h-[140px] p-4 rounded-[30px] border transition-all ${
                            !isCurrentMonth ? 'bg-slate-50/50 border-transparent opacity-30' : 
                            isToday ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100' :
                            'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-lg'
                        }`}>
                            <div className="flex justify-between items-start mb-3">
                                <span className={`text-xl font-black ${isToday ? 'text-white' : 'text-slate-800'}`}>
                                    {format(day, 'd')}
                                </span>
                                {isToday && <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-lg">اليوم</span>}
                            </div>
                            <div className="space-y-1.5">
                                {holidays.map((h, idx) => (
                                    <div key={idx} className={`text-[9px] font-black p-1.5 rounded-lg flex items-center gap-1 ${isToday ? 'bg-white/20 text-white' : 'bg-rose-50 text-rose-600'}`}>
                                        <Icon name="star" size={10} /> {h.name}
                                    </div>
                                ))}
                                {birthdays.map((b, idx) => (
                                    <div key={idx} className={`text-[9px] font-black p-1.5 rounded-lg flex items-center gap-1 ${isToday ? 'bg-white/20 text-white' : 'bg-amber-50 text-amber-600'}`}>
                                        <Icon name="sparkles" size={10} /> عيد ميلاد: {b.name.split(' ')[0]}
                                    </div>
                                ))}
                                {anniversaries.map((a, idx) => (
                                    <div key={idx} className={`text-[9px] font-black p-1.5 rounded-lg flex items-center gap-1 ${isToday ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600'}`}>
                                        <Icon name="check-circle" size={10} /> ذكرى تعيين: {a.name.split(' ')[0]}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
