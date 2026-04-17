import React, { useState } from 'react';
import { Icon } from './ui/Icon';

interface EvaluationsProps {
  employees: any[];
  showToast: (msg: string, type?: any) => void;
}

export default function Evaluations({ employees, showToast }: EvaluationsProps) {
  const [selectedEmp, setSelectedEmp] = useState<any>(null);
  const [evals, setEvals] = useState<any>(() => {
    try {
      return JSON.parse(localStorage.getItem('hr_evaluations') || '{}');
    } catch (e) {
      console.error('Error reading hr_evaluations from localStorage', e);
      return {};
    }
  });
  const [newEval, setNewEval] = useState({ period: 'سنوي 2024', score: 0, notes: '', date: new Date().toLocaleDateString('ar-EG') });

  const saveEval = () => {
    if (!selectedEmp) return;
    const empEvals = evals[selectedEmp.id] || [];
    const updated = { ...evals, [selectedEmp.id]: [...empEvals, { ...newEval, id: Date.now() }] };
    setEvals(updated);
    try {
      localStorage.setItem('hr_evaluations', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving hr_evaluations to localStorage', e);
    }
    showToast('تم حفظ التقييم');
    setNewEval({ period: 'سنوي 2024', score: 0, notes: '', date: new Date().toLocaleDateString('ar-EG') });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-black text-slate-800">تقييمات الموظفين</h2>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">إدارة الأداء السنوي والدوري</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-[40px] border shadow-xl overflow-hidden">
          <div className="p-6 bg-slate-50 border-b">
            <h3 className="font-black text-slate-800">قائمة الموظفين</h3>
          </div>
          <div className="max-h-[600px] overflow-y-auto divide-y">
            {employees.map(emp => (
              <button 
                key={emp.id} 
                onClick={() => setSelectedEmp(emp)}
                className={`w-full p-4 text-right flex items-center gap-4 transition-all ${selectedEmp?.id === emp.id ? 'bg-indigo-50 border-r-4 border-indigo-600' : 'hover:bg-slate-50'}`}
              >
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-black">
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <p className="font-black text-slate-800 text-sm">{emp.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{emp.code}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {selectedEmp ? (
            <div className="space-y-6">
              <div className="bg-white rounded-[40px] border shadow-xl p-8">
                <h3 className="text-xl font-black text-slate-800 mb-6">إضافة تقييم جديد لـ {selectedEmp.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">الفترة</label>
                    <input type="text" className="w-full bg-slate-50 border rounded-2xl p-4 text-sm font-bold outline-none" value={newEval.period} onChange={e => setNewEval({...newEval, period: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">الدرجة (من 100)</label>
                    <input type="number" className="w-full bg-slate-50 border rounded-2xl p-4 text-sm font-bold outline-none" value={newEval.score} onChange={e => setNewEval({...newEval, score: parseInt(e.target.value) || 0})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">ملاحظات التقييم</label>
                    <textarea className="w-full bg-slate-50 border rounded-2xl p-4 text-sm font-bold outline-none h-24" value={newEval.notes} onChange={e => setNewEval({...newEval, notes: e.target.value})}></textarea>
                  </div>
                </div>
                <button onClick={saveEval} className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-xs hover:bg-indigo-700 transition-all">حفظ التقييم</button>
              </div>

              <div className="bg-white rounded-[40px] border shadow-xl p-8">
                <h3 className="text-xl font-black text-slate-800 mb-6">سجل التقييمات السابقة</h3>
                <div className="space-y-4">
                  {(evals[selectedEmp.id] || []).map((ev: any) => (
                    <div key={ev.id} className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <p className="font-black text-slate-800">{ev.period}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{ev.date}</p>
                        <p className="text-xs text-slate-500 mt-2">{ev.notes}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-black text-indigo-600">{ev.score}%</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase">النتيجة</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(evals[selectedEmp.id] || []).length === 0 && <p className="text-center text-slate-400 py-10">لا توجد تقييمات سابقة</p>}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-[40px] border border-dashed border-slate-200 flex flex-col items-center justify-center min-h-[600px] text-slate-400">
              <Icon name="award" size={80} className="mb-6 opacity-20" />
              <p className="text-xl font-black">اختر موظفاً لعرض تقييماته</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
