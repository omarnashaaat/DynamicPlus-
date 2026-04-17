import React from 'react';
import { Icon } from './ui/Icon';

interface OrgChartProps {
  employees: any[];
}

export default function OrgChart({ employees }: OrgChartProps) {
  return (
    <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-2xl">
      <h2 className="text-4xl font-black mb-16 text-center text-slate-900 italic tracking-tighter">الهيكل التنظيمي <span className="text-indigo-600 block text-sm not-italic font-bold uppercase tracking-widest mt-2">Visual Hierarchy</span></h2>
      <div className="flex flex-col items-center gap-12">
         {/* Top Level */}
         <div className="p-8 bg-slate-900 text-white rounded-[35px] shadow-3xl w-72 text-center relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">Leadership</div>
            <p className="font-black text-lg">مجلس الإدارة</p>
            <p className="text-xs text-indigo-400 font-bold tracking-widest">CEO / Founder</p>
         </div>

         <div className="w-1 bg-slate-100 h-16"></div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative w-full">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-0 left-[16%] right-[16%] h-1 bg-slate-100 -translate-y-[64px]"></div>
            
            {['إدارة الموارد البشرية', 'الإدارة المالية', 'إدارة العمليات'].map(dept => {
              const deptEmployees = employees.filter(e => e.dept === dept || e.department === dept);
              return (
                <div key={dept} className="flex flex-col items-center relative gap-8">
                   <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-1 bg-slate-100 h-16 -translate-y-16"></div>
                   
                   <div className="p-7 bg-white border-2 border-indigo-600 text-indigo-600 rounded-[30px] shadow-xl w-64 text-center group hover:bg-indigo-600 hover:text-white transition-all cursor-default">
                      <p className="font-black">{dept}</p>
                      <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">{deptEmployees.length} Members</p>
                   </div>
                   
                   <div className="flex flex-col gap-4 w-full items-center">
                      {deptEmployees.slice(0, 3).map(emp => (
                        <div key={emp.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl w-56 flex items-center gap-4 hover:shadow-md transition-shadow">
                           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                              <Icon name="circle-user" size={20} />
                           </div>
                           <div className="text-right">
                              <p className="text-xs font-black text-slate-800">{emp.name}</p>
                              <p className="text-[9px] font-bold text-slate-400">{emp.position}</p>
                           </div>
                        </div>
                      ))}
                      {deptEmployees.length > 3 && (
                        <div className="text-[10px] font-black text-slate-400 bg-slate-50 px-4 py-2 rounded-full italic">
                           +{deptEmployees.length - 3} موظفين آخرين
                        </div>
                      )}
                      {deptEmployees.length === 0 && (
                        <div className="text-[10px] font-black text-slate-300 italic">لا يوجد موظفين حالياً</div>
                      )}
                   </div>
                </div>
              );
            })}
         </div>
      </div>
    </div>
  );
}
