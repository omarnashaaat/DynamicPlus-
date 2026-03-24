import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from './Icon';
import html2pdf from 'html2pdf.js';
import { ATS } from './ATS';

interface RecruitmentProps {
    candidates: any[];
    setCandidates: React.Dispatch<React.SetStateAction<any[]>>;
}

export const Recruitment = React.memo(({ candidates, setCandidates }: RecruitmentProps) => {
    const [activeSubTab, setActiveSubTab] = useState('board'); // 'board' or 'ats'
    const STAGES = [
        { id: 'applied', title: 'فرز السير الذاتية', color: 'border-slate-100' },
        { id: 'interview', title: 'المقابلات', color: 'border-blue-50' },
        { id: 'offer', title: 'العروض الوظيفية', color: 'border-emerald-50' },
        { id: 'rejected', title: 'مرفوض', color: 'border-rose-50' },
    ];

    const [isLoading, setIsLoading] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingCandidate, setEditingCandidate] = useState<any>(null);
    const [newCandidate, setNewCandidate] = useState({
        name: '',
        role: '',
        experience: '',
        priority: 'عادي'
    });

    const handleAddCandidate = (e: React.FormEvent) => {
        e.preventDefault();
        const candidate = {
            id: Date.now().toString(),
            ...newCandidate,
            email: '',
            phone: '',
            score: Math.floor(Math.random() * 30) + 60,
            status: 'applied',
            createdAt: Date.now(),
            notes: ''
        };
        
        const updated = [...candidates, candidate];
        setCandidates(updated);
        setShowAddModal(false);
        setNewCandidate({ name: '', role: '', experience: '', priority: 'عادي' });
    };

    const handleEditCandidate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCandidate) return;
        
        const updated = candidates.map(c => c.id === editingCandidate.id ? editingCandidate : c);
        setCandidates(updated);
        setEditingCandidate(null);
    };

    const moveNext = (id: string) => {
        const cand = candidates.find(c => c.id === id);
        if (!cand) return;
        
        const currentIndex = STAGES.findIndex(s => s.id === cand.status);
        if (currentIndex < STAGES.length - 1) {
            const updatedCand = { ...cand, status: STAGES[currentIndex + 1].id };
            const updated = candidates.map(c => c.id === id ? updatedCand : c);
            setCandidates(updated);
        }
    };

    const deleteCandidate = (id: string) => {
        if (confirm('هل أنت متأكد من حذف هذا المرشح؟')) {
            const updated = candidates.filter(c => c.id !== id);
            setCandidates(updated);
        }
    };

    const stats = [
        { label: 'إجمالي المرشحين', value: candidates.length, icon: 'users', color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'مقابلات نشطة', value: candidates.filter(c => c.status === 'interview').length, icon: 'calendar', color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'عروض معلقة', value: candidates.filter(c => c.status === 'offer').length, icon: 'check-circle', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="space-y-6 animate-fade-in" dir="rtl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/50 p-4 rounded-[40px] border border-white shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                        <Icon name="briefcase" size={20} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tighter">إدارة التوظيف</h1>
                </div>
                
                <div className="flex bg-slate-100 p-1 rounded-full">
                    <button 
                        onClick={() => setActiveSubTab('board')}
                        className={`px-6 py-2 rounded-full font-black transition-all ${activeSubTab === 'board' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        لوحة المتابعة
                    </button>
                    <button 
                        onClick={() => setActiveSubTab('ats')}
                        className={`px-6 py-2 rounded-full font-black transition-all ${activeSubTab === 'ats' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        الماسح الذكي ATS
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={() => setShowAddModal(true)} className="px-6 py-3 bg-indigo-600 text-white rounded-full font-black flex items-center gap-2 shadow-lg hover:bg-indigo-700 transition-all">
                        <Icon name="plus" size={18} />
                        <span>إضافة مرشح</span>
                    </button>
                    <button 
                        onClick={() => {
                            const element = document.querySelector('.recruitment-container') as HTMLElement;
                            const opt = {
                                margin: 10,
                                filename: `recruitment.pdf`,
                                image: { type: 'jpeg' as const, quality: 0.98 },
                                html2canvas: { scale: 2, useCORS: true },
                                jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'landscape' as const }
                            };
                            html2pdf().set(opt).from(element).save();
                        }}
                        className="bg-slate-800 text-white px-6 py-3 rounded-full font-black flex items-center gap-2 shadow-lg hover:bg-slate-900 transition-all no-print"
                    >
                        <Icon name="download" size={18} /> تنزيل PDF
                    </button>
                    <button 
                        onClick={() => window.print()}
                        className="bg-blue-600 text-white px-6 py-3 rounded-full font-black flex items-center gap-2 shadow-lg hover:bg-blue-700 transition-all no-print"
                    >
                        <Icon name="printer" size={18} /> طباعة
                    </button>
                </div>
            </div>

            <div className="recruitment-container space-y-6">
                {activeSubTab === 'ats' ? (
                    <ATS onSaveCandidate={(cand) => setCandidates(prev => [...prev, cand])} />
                ) : (
                    <>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="relative flex-1 max-w-xl">
                                <Icon name="search" size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="بحث سريع..." 
                                    className="w-full bg-white border border-slate-100 rounded-2xl py-3 pr-12 pl-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {stats.map((stat, i) => (
                                <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-black text-slate-400 mb-1 uppercase tracking-wider">{stat.label}</p>
                                            <p className="text-3xl font-black text-slate-800">{stat.value}</p>
                                        </div>
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${stat.bg} ${stat.color}`}>
                                            <Icon name={stat.icon as any} size={28} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-6 overflow-x-auto pb-6 min-h-[700px]">
                            {STAGES.map(stage => {
                                const stageCandidates = candidates.filter(c => {
                                    const matchesStage = c.status === stage.id;
                                    const matchesSearch = !searchQuery || 
                                        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        (c.role && c.role.toLowerCase().includes(searchQuery.toLowerCase()));
                                    return matchesStage && matchesSearch;
                                });
                                return (
                                    <div key={stage.id} className="flex-1 min-w-[320px] flex flex-col gap-4">
                                        <div className="flex items-center justify-between px-2">
                                            <h3 className="font-black text-slate-800 text-sm">{stage.title}</h3>
                                            <span className="bg-white border border-slate-100 px-3 py-1 rounded-xl text-[10px] font-black text-slate-400 shadow-sm">
                                                {stageCandidates.length}
                                            </span>
                                        </div>
                                        <div className={`flex-1 rounded-[40px] p-4 space-y-4 border-2 border-dashed transition-colors ${
                                            stage.id === 'applied' ? "bg-slate-50/30 border-slate-100" :
                                            stage.id === 'interview' ? "bg-blue-50/20 border-blue-100/50" :
                                            stage.id === 'offer' ? "bg-emerald-50/20 border-emerald-100/50" :
                                            "bg-rose-50/20 border-rose-100/50"
                                        }`}>
                                            {stageCandidates.length === 0 ? (
                                                <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-3 opacity-50">
                                                    <Icon name="users" size={48} />
                                                    <p className="font-black text-xs">لا يوجد مرشحين</p>
                                                </div>
                                            ) : (
                                                stageCandidates.map(cand => (
                                                    <div key={cand.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div className={`px-3 py-1 rounded-lg text-[9px] font-black ${
                                                                cand.priority === 'عاجل' ? "bg-rose-100 text-rose-600" :
                                                                cand.priority === 'متوسط' ? "bg-amber-100 text-amber-600" :
                                                                "bg-blue-100 text-blue-600"
                                                            }`}>
                                                                {cand.priority}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <button 
                                                                    onClick={() => setEditingCandidate(cand)}
                                                                    className="text-slate-300 hover:text-indigo-500 transition-colors p-1"
                                                                    title="تعديل"
                                                                >
                                                                    <Icon name="edit-3" size={16} />
                                                                </button>
                                                                <button 
                                                                    onClick={() => deleteCandidate(cand.id)}
                                                                    className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                                                                    title="حذف"
                                                                >
                                                                    <Icon name="trash-2" size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1 mb-4">
                                                            <h4 className="font-black text-slate-800 text-base">{cand.name}</h4>
                                                            <p className="text-xs font-bold text-indigo-600">{cand.role}</p>
                                                        </div>
                                                        <div className="space-y-2 mb-4">
                                                            <div className="flex items-center gap-2 text-slate-400">
                                                                <Icon name="briefcase" size={14} />
                                                                <span className="text-[10px] font-bold">{cand.experience}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-slate-400">
                                                                <Icon name="calendar" size={14} />
                                                                <span className="text-[10px] font-bold">{new Date(cand.createdAt || Date.now()).toLocaleDateString('ar-EG')}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3 pt-1">
                                                                <Icon name="file-text" size={14} className="text-slate-300" />
                                                                <Icon name="phone" size={14} className="text-slate-300" />
                                                                <Icon name="mail" size={14} className="text-slate-300" />
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                                            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg text-amber-600 font-black text-[10px]">
                                                                <Icon name="star" size={12} className="fill-current" />
                                                                <span>{cand.score}</span>
                                                            </div>
                                                            {stage.id !== 'rejected' && (
                                                                <button 
                                                                    onClick={() => moveNext(cand.id)}
                                                                    className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1"
                                                                >
                                                                    <span>نقل للمرحلة التالية</span>
                                                                    <Icon name="chevron-right" size={12} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="w-full max-w-lg p-8 rounded-[40px] shadow-2xl animate-fade-in border bg-white border-slate-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-black text-slate-800">إضافة مرشح جديد</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-rose-500 transition-colors">
                                <Icon name="x-circle" size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddCandidate} className="space-y-4 text-right">
                            <div className="space-y-1">
                                <label className="text-xs font-black text-slate-500 uppercase">اسم المرشح</label>
                                <input 
                                    required 
                                    type="text" 
                                    className="w-full px-5 py-3 rounded-2xl border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    value={newCandidate.name}
                                    onChange={(e) => setNewCandidate({...newCandidate, name: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-black text-slate-500 uppercase">الوظيفة المستهدفة</label>
                                <input 
                                    required 
                                    type="text" 
                                    className="w-full px-5 py-3 rounded-2xl border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    value={newCandidate.role}
                                    onChange={(e) => setNewCandidate({...newCandidate, role: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-black text-slate-500 uppercase">سنوات الخبرة</label>
                                    <input 
                                        required 
                                        type="text" 
                                        placeholder="مثال: 3 سنوات"
                                        className="w-full px-5 py-3 rounded-2xl border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        value={newCandidate.experience}
                                        onChange={(e) => setNewCandidate({...newCandidate, experience: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-black text-slate-500 uppercase">الأولوية</label>
                                    <select 
                                        className="w-full px-5 py-3 rounded-2xl border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        value={newCandidate.priority}
                                        onChange={(e) => setNewCandidate({...newCandidate, priority: e.target.value})}
                                    >
                                        <option value="عادي">عادي</option>
                                        <option value="متوسط">متوسط</option>
                                        <option value="عاجل">عاجل</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pt-4">
                                <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl text-lg shadow-lg hover:bg-indigo-700 transition-all">
                                    إضافة لقائمة الفرز
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {editingCandidate && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="w-full max-w-lg p-8 rounded-[40px] shadow-2xl animate-fade-in border bg-white border-slate-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-black text-slate-800">تعديل بيانات المرشح</h3>
                            <button onClick={() => setEditingCandidate(null)} className="text-slate-400 hover:text-rose-500 transition-colors">
                                <Icon name="x-circle" size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleEditCandidate} className="space-y-4 text-right">
                            <div className="space-y-1">
                                <label className="text-xs font-black text-slate-500 uppercase">اسم المرشح</label>
                                <input 
                                    required 
                                    type="text" 
                                    className="w-full px-5 py-3 rounded-2xl border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    value={editingCandidate.name}
                                    onChange={(e) => setEditingCandidate({...editingCandidate, name: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-black text-slate-500 uppercase">الوظيفة المستهدفة</label>
                                <input 
                                    required 
                                    type="text" 
                                    className="w-full px-5 py-3 rounded-2xl border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    value={editingCandidate.role}
                                    onChange={(e) => setEditingCandidate({...editingCandidate, role: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-black text-slate-500 uppercase">سنوات الخبرة</label>
                                    <input 
                                        required 
                                        type="text" 
                                        className="w-full px-5 py-3 rounded-2xl border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        value={editingCandidate.experience}
                                        onChange={(e) => setEditingCandidate({...editingCandidate, experience: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-black text-slate-500 uppercase">الأولوية</label>
                                    <select 
                                        className="w-full px-5 py-3 rounded-2xl border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        value={editingCandidate.priority}
                                        onChange={(e) => setEditingCandidate({...editingCandidate, priority: e.target.value})}
                                    >
                                        <option value="عادي">عادي</option>
                                        <option value="متوسط">متوسط</option>
                                        <option value="عاجل">عاجل</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pt-4">
                                <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl text-lg shadow-lg hover:bg-indigo-700 transition-all">
                                    حفظ التعديلات
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
});
