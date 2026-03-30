import React, { useState } from 'react';
import { Icon } from '../components/Layout';

export const ATS = () => {
    const [candidates, setCandidates] = useState<any[]>(() => {
        const saved = localStorage.getItem('ats_candidates');
        return saved ? JSON.parse(saved) : [
            { id: '1', name: 'أحمد علي', score: 85, skills: ['React', 'Node.js', 'TypeScript'], status: 'مؤهل' },
            { id: '2', name: 'سارة محمود', score: 92, skills: ['UI/UX', 'Figma', 'Adobe XD'], status: 'ممتاز' },
            { id: '3', name: 'محمد حسن', score: 65, skills: ['PHP', 'Laravel', 'MySQL'], status: 'يحتاج مراجعة' },
        ];
    });

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-800">الفرز الذكي (ATS)</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">تحليل وتصنيف السير الذاتية آلياً</p>
                </div>
                <button className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg hover:bg-indigo-700 transition-all no-print">
                    <Icon name="upload" size={20} /> رفع سير ذاتية جديدة
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {candidates.map(candidate => (
                        <div key={candidate.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-xl transition-all flex flex-col md:flex-row items-center gap-8">
                            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 font-black text-2xl shrink-0">
                                {candidate.score}%
                            </div>
                            <div className="flex-1 text-center md:text-right">
                                <h3 className="text-xl font-black text-slate-800 mb-1">{candidate.name}</h3>
                                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                                    {candidate.skills.map((skill: string) => (
                                        <span key={skill} className="px-3 py-1 bg-slate-50 text-slate-400 font-bold text-[10px] rounded-lg uppercase tracking-widest">{skill}</span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-4">
                                    <span className={`px-4 py-1 rounded-full font-black text-xs ${
                                        candidate.status === 'ممتاز' ? 'bg-emerald-50 text-emerald-600' :
                                        candidate.status === 'مؤهل' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                                    }`}>
                                        {candidate.status}
                                    </span>
                                    <button className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline">عرض السيرة الذاتية</button>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-100 transition-all"><Icon name="check" size={20} /></button>
                                <button className="p-4 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all"><Icon name="x" size={20} /></button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl shadow-slate-200">
                        <h4 className="text-lg font-black mb-4 flex items-center gap-2">
                            <Icon name="sparkles" className="text-indigo-400" /> تحليل الذكاء الاصطناعي
                        </h4>
                        <p className="text-slate-400 font-bold text-sm leading-relaxed mb-6">
                            يقوم النظام حالياً بتحليل الكلمات المفتاحية والخبرات السابقة لمطابقتها مع متطلبات الوظيفة الشاغرة.
                        </p>
                        <div className="space-y-4">
                            <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                                <span>دقة التحليل</span>
                                <span>98%</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 w-[98%]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
