import React from 'react';

export default function OrgChart({ employees }: any) {
  return (
    <div className="bg-white p-10 rounded-[40px] border">
      <h2 className="text-3xl font-black mb-8 text-center">الهيكل التنظيمي</h2>
      <div className="flex flex-col items-center gap-10">
         <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl w-64 text-center">
            <p className="font-black">مجلس الإدارة</p>
            <p className="text-xs text-indigo-400">CEO / Founder</p>
         </div>
         <div className="w-1 bg-slate-200 h-10"></div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {['إدارة الموارد البشرية', 'الإدارة المالية', 'إدارة العمليات'].map(dept => (
              <div key={dept} className="flex flex-col items-center">
                 <div className="p-6 bg-indigo-600 text-white rounded-3xl shadow-lg w-56 text-center">
                    <p className="font-black">{dept}</p>
                 </div>
                 <div className="w-1 bg-slate-200 h-10"></div>
                 <div className="p-4 bg-slate-100 rounded-2xl w-48 text-center">
                    <p className="text-xs font-bold text-slate-500">فريق العمل</p>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
