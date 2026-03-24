import React, { useState, useMemo } from 'react';
import { Icon } from './Icon';

interface CalendarProps {
    employees: any[];
    calendarEvents: any[];
    setCalendarEvents: React.Dispatch<React.SetStateAction<any[]>>;
}

export const Calendar = React.memo(({ employees, calendarEvents, setCalendarEvents }: CalendarProps) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [editingId, setEditingId] = useState<number | null>(null);
    const [eventForm, setEventForm] = useState({ title: 'Sprint Review', date: new Date().toISOString().split('T')[0], type: 'MEETING' });
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | string | null>(null);

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const goToToday = () => setCurrentDate(new Date());

    const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const dayNames = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];

    const calendarDays = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysCount = daysInMonth(year, month);
        const firstDay = firstDayOfMonth(year, month);
        const offset = (firstDay + 1) % 7;
        const days = [];
        const prevMonthDaysCount = daysInMonth(year, month - 1);
        for (let i = offset - 1; i >= 0; i--) {
            days.push({ day: prevMonthDaysCount - i, month: month - 1, year, current: false });
        }
        for (let i = 1; i <= daysCount; i++) {
            days.push({ day: i, month, year, current: true });
        }
        const remaining = 42 - days.length;
        for (let i = 1; i <= remaining; i++) {
            days.push({ day: i, month: month + 1, year, current: false });
        }
        return days;
    }, [currentDate]);

    const handleSubmit = () => {
        if (!eventForm.title) return;
        if (editingId) {
            setCalendarEvents(calendarEvents.map(e => e.id === editingId ? { ...eventForm, id: editingId } : e));
            setEditingId(null);
        } else {
            setCalendarEvents([...calendarEvents, { ...eventForm, id: Date.now() }]);
        }
        setEventForm({ title: '', date: new Date().toISOString().split('T')[0], type: 'MEETING' });
    };

    const confirmDelete = () => {
        if (deleteConfirmId === 'all') {
            setCalendarEvents([]);
        } else {
            setCalendarEvents(calendarEvents.filter(e => e.id !== deleteConfirmId));
        }
        setDeleteConfirmId(null);
    };

    const startEdit = (event: any) => {
        setEventForm({ title: event.title, date: event.date, type: event.type });
        setEditingId(event.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getEventsForDay = (day: number, month: number, year: number) => {
        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return calendarEvents.filter(e => e.date === dateStr);
    };

    const eventColors: any = {
        'MEETING': 'bg-blue-200 text-blue-800 border-blue-300',
        'HOLIDAY': 'bg-emerald-200 text-emerald-800 border-emerald-300',
        'EVENT': 'bg-sky-200 text-sky-800 border-sky-300',
        'LEAVE': 'bg-indigo-100 text-indigo-700 border-indigo-200',
        'OTHER': 'bg-orange-200 text-orange-800 border-orange-300'
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                    <Icon name="calendar" className="text-indigo-600" size={32} /> التقويم الحالي
                </h2>
                <div className="flex gap-2">
                    <button onClick={() => setDeleteConfirmId('all')} className="bg-rose-50 text-rose-600 px-6 py-2.5 rounded-xl font-black border border-rose-100 shadow-sm hover:bg-rose-100 flex items-center gap-2">
                        <Icon name="trash-2" size={18} /> مسح الكل
                    </button>
                    {editingId && (
                        <button onClick={() => { setEditingId(null); setEventForm({ title: '', date: new Date().toISOString().split('T')[0], type: 'MEETING' }); }} className="bg-amber-50 text-amber-600 px-6 py-2.5 rounded-xl font-black border border-amber-100 shadow-sm hover:bg-amber-100 flex items-center gap-2">
                            إلغاء التعديل
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-[40px] p-8 shadow-2xl border border-slate-100">
                <div className="flex flex-col md:flex-row gap-6 mb-8 items-end">
                    <div className="flex-1 space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase">التاريخ</label>
                        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            <Icon name="calendar" className="text-slate-400" size={20} />
                            <input type="date" value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} className="bg-transparent outline-none font-bold text-slate-700 w-full" />
                        </div>
                    </div>
                    <div className="flex-1 space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase">العنوان</label>
                        <input type="text" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} className="w-full bg-slate-50 p-3 rounded-2xl border border-slate-100 outline-none font-bold text-slate-700" placeholder="Sprint Review" />
                    </div>
                    <div className="flex-1 space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase">النوع</label>
                        <select value={eventForm.type} onChange={e => setEventForm({...eventForm, type: e.target.value})} className="w-full bg-slate-50 p-3 rounded-2xl border border-slate-100 outline-none font-bold text-slate-700 appearance-none">
                            <option value="MEETING">اجتماع</option>
                            <option value="HOLIDAY">إجازة رسمية</option>
                            <option value="EVENT">فعالية</option>
                            <option value="LEAVE">إجازة موظف</option>
                            <option value="OTHER">أخرى</option>
                        </select>
                    </div>
                    <button onClick={handleSubmit} className={`${editingId ? 'bg-amber-500' : 'bg-indigo-600'} text-white px-8 py-3.5 rounded-2xl font-black shadow-lg hover:opacity-90 transition-all flex items-center gap-2`}>
                        <Icon name={editingId ? "save" : "plus"} size={20} /> {editingId ? 'حفظ التعديلات' : 'إضافة للتقويم'}
                    </button>
                </div>

                <div className="border rounded-2xl overflow-hidden">
                    <div className="bg-slate-400 p-4 flex justify-between items-center text-white">
                        <div className="flex gap-2">
                            <button onClick={prevMonth} className="p-1 hover:bg-white/20 rounded">{'<'}</button>
                        </div>
                        <h3 className="text-xl font-black cursor-pointer" onClick={goToToday}>
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()} (اضغط للعودة للشهر الحالي)
                        </h3>
                        <div className="flex gap-2">
                            <button onClick={nextMonth} className="p-1 hover:bg-white/20 rounded">{'>'}</button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-7 bg-slate-200 gap-px">
                        {dayNames.map(d => (
                            <div key={d} className="bg-slate-300 p-2 text-center font-black text-slate-600 text-sm">{d}</div>
                        ))}
                        {calendarDays.map((d, i) => {
                            const events = getEventsForDay(d.day, d.month, d.year);
                            return (
                                <div key={i} className={`min-h-[140px] p-2 bg-white border-slate-100 border-r border-b ${!d.current ? 'bg-slate-50/50 grayscale opacity-50' : ''}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-sm font-black ${d.current ? 'text-slate-700' : 'text-slate-400'}`}>{d.day}</span>
                                        {d.current && <Icon name="check-square" size={14} className="text-emerald-500" />}
                                    </div>
                                    <div className="space-y-1">
                                        {events.map(e => (
                                            <div key={e.id} className={`group relative text-[9px] p-1.5 rounded border font-bold ${eventColors[e.type] || 'bg-slate-100'}`}>
                                                <div className="truncate pr-4">[{e.type}] {e.title}</div>
                                                <div className="absolute top-0 left-0 h-full flex items-center gap-0.5 px-1 bg-inherit opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => startEdit(e)} className="p-0.5 hover:text-indigo-600 transition-colors">
                                                        <Icon name="edit" size={10} />
                                                    </button>
                                                    <button onClick={() => setDeleteConfirmId(e.id)} className="p-0.5 hover:text-rose-600 transition-colors">
                                                        <Icon name="trash-2" size={10} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {deleteConfirmId && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-[40px] shadow-2xl max-w-sm w-full text-center border-4 border-rose-100 animate-fade-in">
                        <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <Icon name="alert-triangle" size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-2">تأكيد الحذف</h3>
                        <p className="text-slate-500 font-bold mb-8">
                            {deleteConfirmId === 'all' ? 'هل أنت متأكد من مسح كافة المواعيد والفعاليات من التقويم؟' : 'هل أنت متأكد من حذف هذا الحدث نهائياً؟'}
                        </p>
                        <div className="flex gap-3">
                            <button onClick={confirmDelete} className="flex-1 bg-rose-600 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-rose-700 transition-all">نعم، احذف</button>
                            <button onClick={() => setDeleteConfirmId(null)} className="flex-1 bg-slate-100 text-slate-600 font-black py-4 rounded-2xl hover:bg-slate-200 transition-all">إلغاء</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});
