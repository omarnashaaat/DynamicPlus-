import React from 'react';
import { Icon } from './ui/Icon';

export default function Surveys({ surveys, setSurveys, showToast }: any) {
  return (
    <div className="bg-white p-10 rounded-[40px] border shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black">استطلاعات الرأي</h2>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-sm">إنشاء استطلاع جديد</button>
      </div>
      <div className="space-y-4">
        {['تقييم بيئة العمل - الربع الأول', 'استقصاء الرضا عن التأمين الطبي'].map(s => (
          <div key={s} className="p-6 bg-slate-50 border rounded-3xl flex items-center justify-between">
            <span className="font-black text-slate-700">{s}</span>
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-400">45 مشاركة</span>
              <button className="text-indigo-600 font-bold hover:underline">عرض النتائج</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
