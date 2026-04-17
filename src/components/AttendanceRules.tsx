import React, { useState } from 'react';
import { Icon } from './ui/Icon';

interface AttendanceRulesProps {
  rules: any;
  setRules: React.Dispatch<React.SetStateAction<any>>;
  showToast: (msg: string, type?: any) => void;
}

export default function AttendanceRules({ rules, setRules, showToast }: AttendanceRulesProps) {

  const saveRules = () => {
    try {
      localStorage.setItem('hr_attendance_rules', JSON.stringify(rules));
      showToast('تم حفظ الإعدادات بنجاح');
    } catch (e) {
      console.error('Error saving hr_attendance_rules to localStorage', e);
      showToast('فشل حفظ الإعدادات', 'error');
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-800">قواعد الحضور والانصراف</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">تخصيص لوائح العمل والجزاءات</p>
        </div>
        <button onClick={saveRules} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs hover:bg-indigo-600 transition-all flex items-center gap-2">
          <Icon name="save" size={16} /> حفظ التغييرات
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[40px] border shadow-xl p-8">
          <h3 className="text-xl font-black text-slate-800 mb-8">الإعدادات العامة</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <p className="font-black text-slate-800 text-xs">فترة السماح للتأخير</p>
                <p className="text-[10px] text-slate-400 font-bold">بالدقائق من بداية الوردية</p>
              </div>
              <input type="number" className="w-20 bg-white border rounded-xl p-2 text-center font-black text-indigo-600" value={rules.lateGracePeriod} onChange={e => setRules({...rules, lateGracePeriod: parseInt(e.target.value)})} />
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <p className="font-black text-slate-800 text-xs">معدل احتساب الإضافي</p>
                <p className="text-[10px] text-slate-400 font-bold">مضاعف الساعة العادية</p>
              </div>
              <input type="number" step="0.1" className="w-20 bg-white border rounded-xl p-2 text-center font-black text-indigo-600" value={rules.overtimeRate} onChange={e => setRules({...rules, overtimeRate: parseFloat(e.target.value)})} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[40px] border shadow-xl p-8">
          <h3 className="text-xl font-black text-slate-800 mb-8">لائحة الجزاءات</h3>
          <div className="space-y-4">
            {rules.deductionRules.map((rule: any) => (
              <div key={rule.id} className="flex items-center justify-between p-4 rounded-2xl bg-rose-50/50 border border-rose-100">
                <div>
                  <p className="font-black text-rose-800 text-xs">{rule.range}</p>
                  <p className="text-[10px] text-rose-400 font-bold">{rule.type}</p>
                </div>
                <div className="text-left">
                  <p className="font-black text-rose-600 text-sm">{rule.penalty}</p>
                  <p className="text-[9px] font-black text-rose-300 uppercase">خصم</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
