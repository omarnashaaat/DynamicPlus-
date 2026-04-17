import React from 'react';
import { Icon } from './ui/Icon';

export default function ActivityLog({ logs }: any) {
  const dummyLogs = [
    { user: 'مدير النظام', action: 'إضافة موظف جديد', time: '10:30 AM', target: 'أحمد محمد' },
    { user: 'مدير النظام', action: 'تعديل سياسة الحضور', time: '09:15 AM', target: 'القواعد العامة' },
    { user: 'موظف تجريبي', action: 'طلب إجازة', time: '08:45 AM', target: 'إجازة سنوية' },
  ];

  return (
    <div className="bg-white rounded-[40px] border shadow-xl overflow-hidden">
      <div className="p-8 border-b bg-slate-50 flex justify-between items-center">
         <h2 className="text-2xl font-black">سجل النشاطات (Audit Trail)</h2>
         <Icon name="history" className="text-slate-400" size={24} />
      </div>
      <div className="p-4">
        <div className="space-y-4">
          {dummyLogs.map((log, i) => (
            <div key={i} className="flex items-center gap-6 p-6 hover:bg-slate-50 rounded-3xl transition-all">
               <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black">
                  {log.user.charAt(0)}
               </div>
               <div className="flex-1">
                  <p className="font-black text-slate-800">{log.action}: <span className="text-indigo-600">{log.target}</span></p>
                  <p className="text-xs font-bold text-slate-400">بواسطة: {log.user}</p>
               </div>
               <div className="text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.time}</p>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
