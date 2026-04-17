import React, { useState } from 'react';
import { Icon } from './ui/Icon';

interface KPIsProps {
  employees: any[];
  showToast: (msg: string, type?: any) => void;
}

export default function KPIs({ employees, showToast }: KPIsProps) {
  const [kpis, setKpis] = useState([
    { id: 1, name: 'معدل دوران العمالة', target: '5%', current: '3.2%', status: 'good', trend: 'up' },
    { id: 2, name: 'متوسط وقت التوظيف', target: '15 يوم', current: '18 يوم', status: 'warning', trend: 'down' },
    { id: 3, name: 'نسبة الغياب الشهرية', target: '2%', current: '1.5%', status: 'good', trend: 'up' },
    { id: 4, name: 'رضا الموظفين', target: '85%', current: '78%', status: 'warning', trend: 'stable' },
  ]);

  return (
    <div className="space-y-10 animate-fade-in">
      <div>
        <h2 className="text-3xl font-black text-slate-800">مؤشرات الأداء الرئيسية (KPIs)</h2>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">قياس كفاءة الموارد البشرية</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map(kpi => (
          <div key={kpi.id} className="bg-white p-8 rounded-[40px] border shadow-xl relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-2 h-full ${kpi.status === 'good' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
            <h4 className="text-slate-400 text-[10px] font-black uppercase mb-2">{kpi.name}</h4>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-black text-slate-800">{kpi.current}</span>
              <span className="text-[10px] text-slate-400 font-bold">المستهدف: {kpi.target}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`p-1 rounded-full ${kpi.trend === 'up' ? 'bg-emerald-100 text-emerald-600' : kpi.trend === 'down' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-400'}`}>
                <Icon name={kpi.trend === 'up' ? 'trending-up' : kpi.trend === 'down' ? 'trending-down' : 'minus'} size={12} />
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase">{kpi.trend === 'up' ? 'تحسن' : kpi.trend === 'down' ? 'تراجع' : 'مستقر'}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[40px] border shadow-xl p-10">
        <h3 className="text-xl font-black text-slate-800 mb-8">تحليل الأداء الربعي</h3>
        <div className="h-64 flex items-end justify-between gap-4">
          {[40, 70, 55, 90, 65, 85, 45, 95, 75, 60, 80, 100].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-indigo-50 rounded-t-xl relative group">
                <div 
                  className="w-full bg-indigo-600 rounded-t-xl transition-all duration-1000 group-hover:bg-pink-500" 
                  style={{ height: `${h}%` }}
                ></div>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {h}%
                </div>
              </div>
              <span className="text-[9px] font-black text-slate-400 uppercase">{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
