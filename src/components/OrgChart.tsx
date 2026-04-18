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
          <div className="p-10 bg-slate-900 text-white rounded-[45px] shadow-3xl w-80 text-center relative border border-white/10 group overflow-hidden">
             <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-700 opacity-20"></div>
             <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-xl">القيادة العليا Leadership</div>
             <div className="w-16 h-16 bg-white/10 rounded-2xl mx-auto mb-6 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:rotate-12 transition-all">
                <Icon name="crown" size={32} />
             </div>
             <p className="font-black text-2xl tracking-tighter">مجلس الإدارة</p>
             <p className="text-xs text-indigo-400 font-bold tracking-widest mt-2 uppercase">Executive Board</p>
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
                   
                   <div className="p-10 bg-white border-2 border-slate-100 text-slate-800 rounded-[40px] shadow-xl w-72 text-center group hover:border-indigo-600 hover:shadow-indigo-500/10 transition-all cursor-default relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-50 -mr-10 -mt-10 rounded-full group-hover:bg-indigo-600 transition-colors duration-500"></div>
                      <Icon name="users" size={24} className="mx-auto mb-4 text-slate-300 group-hover:text-white relative z-10 transition-colors" />
                      <p className="font-black text-xl relative z-10 tracking-tight">{dept}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 relative z-10">{deptEmployees.length} Personnel</p>
                   </div>
                   
                   <div className="flex flex-col gap-6 w-full items-center">
                      {deptEmployees.slice(0, 4).map(emp => (
                        <div key={emp.id} className="p-5 bg-white border border-slate-50 rounded-[25px] w-64 flex items-center gap-5 hover:shadow-2xl hover:-translate-y-1 transition-all group/item shadow-sm">
                           <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-black text-xs group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all shadow-inner">
                              {emp.name[0]}
                           </div>
                           <div className="text-right">
                              <p className="text-sm font-black text-slate-800 tracking-tight">{emp.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{emp.jobTitle || emp.position}</p>
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
