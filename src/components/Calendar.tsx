import React, { useState } from 'react';
import { Icon } from './ui/Icon';

interface CalendarProps {
  employees: any[];
  calendarEvents: any[];
  setCalendarEvents: React.Dispatch<React.SetStateAction<any[]>>;
  showToast: (msg: string, type?: any) => void;
}

export default function Calendar({ employees, calendarEvents, setCalendarEvents, showToast }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', type: 'holiday' });

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthName = currentDate.toLocaleString('ar-EG', { month: 'long' });

  const addEvent = () => {
    const updated = [...calendarEvents, { ...newEvent, id: Date.now() }];
    setCalendarEvents(updated);
    setShowModal(false);
    setNewEvent({ title: '', date: '', type: 'holiday' });
    showToast('تم إضافة المناسبة');
  };

  const deleteEvent = (id: number) => {
    const updated = calendarEvents.filter((e: any) => e.id !== id);
    setCalendarEvents(updated);
    showToast('تم حذف المناسبة');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-800">التقويم السنوي</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">العطلات والمناسبات الرسمية</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs hover:bg-indigo-700 transition-all flex items-center gap-2">
          <Icon name="plus" size={16} /> إضافة مناسبة
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[40px] border shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><Icon name="chevron-right" /></button>
            <h3 className="text-2xl font-black text-slate-800">{monthName} {currentDate.getFullYear()}</h3>
            <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><Icon name="chevron-left" /></button>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center mb-4">
            {["ح", "ن", "ث", "ر", "خ", "ج", "س"].map(d => <div key={d} className="text-xs font-black text-slate-400 uppercase">{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array(firstDayOfMonth).fill(null).map((_, i) => <div key={`empty-${i}`} className="aspect-square"></div>)}
            {Array(daysInMonth).fill(null).map((_, i) => {
              const day = i + 1;
              const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayEvents = calendarEvents.filter((e: any) => e.date === dateStr);
              return (
                <div key={day} className="aspect-square border rounded-2xl p-2 relative group hover:border-indigo-400 transition-all cursor-pointer">
                  <span className="font-black text-slate-400 text-xs">{day}</span>
                  <div className="mt-1 space-y-1">
                    {dayEvents.map((e: any) => (
                      <div key={e.id} className={`h-1.5 rounded-full ${e.type === 'holiday' ? 'bg-rose-500' : 'bg-indigo-500'}`}></div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-[40px] border shadow-xl p-8">
          <h3 className="font-black text-slate-800 mb-6">المناسبات القادمة</h3>
          <div className="space-y-4">
            {calendarEvents.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((e: any) => (
              <div key={e.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-10 rounded-full ${e.type === 'holiday' ? 'bg-rose-500' : 'bg-indigo-500'}`}></div>
                  <div>
                    <p className="font-black text-slate-800 text-xs">{e.title}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{e.date}</p>
                  </div>
                </div>
                <button onClick={() => deleteEvent(e.id)} className="text-slate-300 hover:text-rose-600 transition-colors"><Icon name="trash-2" size={14} /></button>
              </div>
            ))}
            {calendarEvents.length === 0 && <p className="text-center text-slate-400 text-xs py-10">لا توجد مناسبات مسجلة</p>}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] p-8 w-full max-w-md shadow-2xl animate-scale-in">
            <h3 className="text-2xl font-black text-slate-800 mb-6">إضافة مناسبة جديدة</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">عنوان المناسبة</label>
                <input type="text" className="w-full bg-slate-50 border rounded-2xl p-4 text-sm font-bold outline-none" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">التاريخ</label>
                <input type="date" className="w-full bg-slate-50 border rounded-2xl p-4 text-sm font-bold outline-none" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">النوع</label>
                <select className="w-full bg-slate-50 border rounded-2xl p-4 text-sm font-bold outline-none" value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value})}>
                  <option value="holiday">إجازة رسمية</option>
                  <option value="event">حدث داخلي</option>
                </select>
              </div>
              <div className="flex gap-4 mt-8">
                <button onClick={addEvent} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs hover:bg-indigo-700 transition-all">حفظ</button>
                <button onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black text-xs hover:bg-slate-200 transition-all">إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
