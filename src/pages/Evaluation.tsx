import React, { useState } from 'react';
import { Icon } from '../components/Layout';

export const Evaluation = ({ employees }: any) => {
    const [selectedEmployee, setSelectedEmployee] = useState<string>('');
    const [evaluations, setEvaluations] = useState<any>(() => {
        const saved = localStorage.getItem('evaluations');
        return saved ? JSON.parse(saved) : {};
    });

    const metrics = [
        { id: 'productivity', name: 'الإنتاجية', icon: 'zap' },
        { id: 'quality', name: 'جودة العمل', icon: 'check-circle' },
        { id: 'attendance', name: 'الالتزام بالحضور', icon: 'clock' },
        { id: 'teamwork', name: 'العمل الجماعي', icon: 'users' },
        { id: 'initiative', name: 'المبادرة والابتكار', icon: 'lightbulb' },
    ];

    const saveEvaluation = (empId: string, metricId: string, value: number) => {
        const newEvals = {
            ...evaluations,
            [empId]: {
                ...(evaluations[empId] || {}),
                [metricId]: value,
                lastUpdated: new Date().toISOString()
            }
        };
        setEvaluations(newEvals);
        localStorage.setItem('evaluations', JSON.stringify(newEvals));
    };

    const getAverage = (empId: string) => {
        const empEval = evaluations[empId];
        if (!empEval) return "0";
        const values = Object.entries(empEval)
            .filter(([key]) => metrics.find(m => m.id === key))
            .map(([_, val]) => val as number);
        if (values.length === 0) return "0";
        return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-800">تقييم الأداء (KPIs)</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">قياس وتحليل أداء الموظفين</p>
                </div>
                <div className="flex items-center gap-3 no-print">
                    <select 
                        value={selectedEmployee}
                        onChange={(e) => setSelectedEmployee(e.target.value)}
                        className="bg-white border-none rounded-2xl px-6 py-3 font-black text-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">اختر موظفاً للتقييم</option>
                        {employees.map((e: any) => (
                            <option key={e.id} value={e.id}>{e.name}</option>
                        ))}
                    </select>
                    <button 
                        onClick={() => window.print()}
                        className="bg-slate-800 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg hover:bg-slate-900 transition-all"
                    >
                        <Icon name="printer" size={20} /> طباعة التقرير
                    </button>
                </div>
            </div>

            {selectedEmployee ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                        <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-2">
                            <Icon name="edit-3" className="text-indigo-600" /> نموذج التقييم
                        </h3>
                        <div className="space-y-8">
                            {metrics.map(metric => (
                                <div key={metric.id} className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-black text-slate-700 flex items-center gap-2">
                                            <Icon name={metric.icon as any} size={18} className="text-slate-400" />
                                            {metric.name}
                                        </span>
                                        <span className="text-indigo-600 font-black">{(evaluations[selectedEmployee]?.[metric.id] || 0)} / 10</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="10" 
                                        step="1"
                                        value={evaluations[selectedEmployee]?.[metric.id] || 0}
                                        onChange={(e) => saveEvaluation(selectedEmployee, metric.id, parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-indigo-600 p-10 rounded-[40px] text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-indigo-100 font-black uppercase tracking-widest text-xs mb-2">متوسط التقييم العام</p>
                                <h4 className="text-7xl font-black mb-4">{getAverage(selectedEmployee)}</h4>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 flex-1 bg-white/20 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-white transition-all duration-1000" 
                                            style={{ width: `${(parseFloat(getAverage(selectedEmployee)) * 10)}%` }}
                                        ></div>
                                    </div>
                                    <span className="font-black text-sm">{(parseFloat(getAverage(selectedEmployee)) * 10)}%</span>
                                </div>
                            </div>
                            <Icon name="trending-up" size={120} className="absolute -bottom-4 -right-4 text-white/10 rotate-12" />
                        </div>

                        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                            <h4 className="text-lg font-black text-slate-800 mb-4">ملاحظات الأداء</h4>
                            <textarea 
                                placeholder="أضف ملاحظاتك حول أداء الموظف هنا..."
                                value={evaluations[selectedEmployee]?.notes || ''}
                                onChange={(e) => saveEvaluation(selectedEmployee, 'notes', e.target.value as any)}
                                className="w-full bg-slate-50 border-none rounded-2xl p-6 font-bold text-slate-600 min-h-[150px] focus:ring-2 focus:ring-indigo-500"
                            ></textarea>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white p-20 rounded-[50px] text-center border border-dashed border-slate-200">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon name="user-check" size={40} className="text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">ابدأ التقييم</h3>
                    <p className="text-slate-400 font-bold max-w-md mx-auto">اختر موظفاً من القائمة أعلاه للبدء في تقييم أدائه وتحديد نقاط القوة والضعف.</p>
                </div>
            )}

            <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-bottom border-slate-50">
                    <h3 className="text-xl font-black text-slate-800">ملخص تقييمات الفريق</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-8 py-4 font-black text-slate-400 text-xs uppercase tracking-widest">الموظف</th>
                                <th className="px-8 py-4 font-black text-slate-400 text-xs uppercase tracking-widest">القسم</th>
                                <th className="px-8 py-4 font-black text-slate-400 text-xs uppercase tracking-widest text-center">التقييم</th>
                                <th className="px-8 py-4 font-black text-slate-400 text-xs uppercase tracking-widest text-center">الحالة</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {employees.map((emp: any) => {
                                const avg = parseFloat(getAverage(emp.id));
                                return (
                                    <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="font-black text-slate-800">{emp.name}</div>
                                            <div className="text-xs text-slate-400 font-bold">{emp.position}</div>
                                        </td>
                                        <td className="px-8 py-5 font-bold text-slate-500">{emp.department}</td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`inline-block px-4 py-1.5 rounded-full font-black text-sm ${
                                                avg >= 8 ? 'bg-emerald-50 text-emerald-600' :
                                                avg >= 5 ? 'bg-amber-50 text-amber-600' :
                                                avg > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-400'
                                            }`}>
                                                {avg > 0 ? avg : 'لم يقيم'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            {avg >= 8 ? (
                                                <span className="text-emerald-500 flex items-center justify-center gap-1 font-black text-xs">
                                                    <Icon name="award" size={14} /> متميز
                                                </span>
                                            ) : avg >= 5 ? (
                                                <span className="text-amber-500 flex items-center justify-center gap-1 font-black text-xs">
                                                    <Icon name="activity" size={14} /> جيد
                                                </span>
                                            ) : avg > 0 ? (
                                                <span className="text-rose-500 flex items-center justify-center gap-1 font-black text-xs">
                                                    <Icon name="alert-circle" size={14} /> يحتاج تطوير
                                                </span>
                                            ) : '-'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
