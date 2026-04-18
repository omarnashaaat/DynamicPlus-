import React, { useState } from 'react';
import { Icon } from './ui/Icon';
import ATS from './ATS';

interface RecruitmentProps {
  employees: any[];
  showToast: (msg: string, type?: any) => void;
  askConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export default function Recruitment({ employees, showToast, askConfirm }: RecruitmentProps) {
  const [activeSubTab, setActiveSubTab] = useState('board');
  const [candidates, setCandidates] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('hr_recruitment_candidates') || '[]');
    } catch (e) {
      console.error('Error reading hr_recruitment_candidates from localStorage', e);
      return [];
    }
  });

  const STAGES = [
    { id: 'applied', title: 'فرز السير الذاتية', color: 'bg-slate-400' },
    { id: 'interview', title: 'المقابلات', color: 'bg-blue-500' },
    { id: 'offer', title: 'العروض الوظيفية', color: 'bg-emerald-500' },
    { id: 'rejected', title: 'مرفوض', color: 'bg-rose-500' },
  ];

  const saveCandidates = (newCandidates: any[]) => {
    setCandidates(newCandidates);
    try {
      localStorage.setItem('hr_recruitment_candidates', JSON.stringify(newCandidates));
    } catch (e) {
      console.error('Error saving hr_recruitment_candidates to localStorage', e);
    }
  };

  const moveCandidate = (id: string, newStage: string) => {
    const updated = candidates.map(c => c.id === id ? { ...c, stage: newStage } : c);
    saveCandidates(updated);
    showToast('تم نقل المرشح');
  };

  const deleteCandidate = (id: string) => {
    askConfirm('حذف مرشح', 'هل أنت متأكد من حذف هذا المرشح؟', () => {
      const updated = candidates.filter(c => c.id !== id);
      saveCandidates(updated);
      showToast('تم حذف المرشح');
    });
  };

  const addCandidate = (candidate: any) => {
    const newCandidates = [...candidates, { ...candidate, id: Date.now().toString(), stage: 'applied', date: new Date().toLocaleDateString('ar-EG') }];
    saveCandidates(newCandidates);
    showToast('تم إضافة المرشح بنجاح');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 bg-white p-8 rounded-[45px] border border-slate-50 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-indigo-600 rounded-[25px] flex items-center justify-center text-white shadow-2xl">
            <Icon name="briefcase" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tighter">إدارة التوظيف</h1>
            <p className="text-slate-400 font-bold text-sm">متابعة المرشحين وعمليات التعيين</p>
          </div>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => setActiveSubTab('board')}
            className={`px-8 py-3 rounded-xl font-black transition-all ${activeSubTab === 'board' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-500'}`}
          >
            لوحة المتابعة
          </button>
          <button 
            onClick={() => setActiveSubTab('ats')}
            className={`px-8 py-3 rounded-xl font-black transition-all ${activeSubTab === 'ats' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-500'}`}
          >
            نظام ATS
          </button>
        </div>
      </div>

      {activeSubTab === 'ats' ? (
        <ATS showToast={showToast} onSaveCandidate={addCandidate} />
      ) : (
        <div className="flex gap-8 overflow-x-auto pb-12 min-h-[600px]">
          {STAGES.map(stage => {
            const stageCandidates = candidates.filter(c => c.stage === stage.id);
            return (
              <div key={stage.id} className="flex-1 min-w-[300px] flex flex-col gap-6">
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                    <h3 className="font-black text-slate-800 text-lg">{stage.title}</h3>
                  </div>
                  <span className="bg-white border border-slate-100 px-3 py-1 rounded-lg text-xs font-black text-slate-400">
                    {stageCandidates.length}
                  </span>
                </div>
                
                <div className="flex-1 rounded-[40px] p-6 bg-slate-50/50 border-2 border-dashed border-slate-100 space-y-4">
                  {stageCandidates.map(candidate => (
                    <div key={candidate.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group hover:shadow-xl transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-black text-slate-800 text-sm">{candidate.name}</h4>
                          <p className="text-[10px] text-slate-400 font-bold">{candidate.position}</p>
                        </div>
                        <button onClick={() => deleteCandidate(candidate.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                          <Icon name="trash-2" size={14} />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase mb-6">
                        <Icon name="calendar" size={10} />
                        {candidate.date}
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-50">
                        <div className="flex gap-1">
                          {STAGES.filter(s => s.id !== stage.id).map(s => (
                            <button 
                              key={s.id}
                              onClick={() => moveCandidate(candidate.id, s.id)}
                              className={`w-6 h-6 rounded-lg flex items-center justify-center text-white transition-all hover:scale-110 ${s.color}`}
                              title={s.title}
                            >
                              <Icon name="arrow-left" size={10} className="rotate-180" />
                            </button>
                          ))}
                        </div>
                        {candidate.score && (
                          <div className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg text-[10px] font-black">
                            {candidate.score}%
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {stageCandidates.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4 opacity-40 py-20">
                      <Icon name="users" size={48} />
                      <p className="font-black text-sm italic">لا يوجد مرشحين</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
