import React, { useState } from 'react';
import { Icon } from '../components/Layout';

export const AttendancePolicy = ({ rules, setRules }: any) => {
    const [editingTier, setEditingTier] = useState<any>(null);

    const updateRule = (field: string, value: any) => {
        setRules({ ...rules, [field]: value });
    };

    const updateTier = (type: 'late' | 'early', index: number, field: string, value: any) => {
        const tiers = [...(type === 'late' ? rules.lateTiers : rules.earlyTiers)];
        tiers[index] = { ...tiers[index], [field]: parseFloat(value) || 0 };
        setRules({ ...rules, [type === 'late' ? 'lateTiers' : 'earlyTiers']: tiers });
    };

    const addTier = (type: 'late' | 'early') => {
        const tiers = [...(type === 'late' ? rules.lateTiers : rules.earlyTiers)];
        tiers.push({ min: 0, max: 0, penalty: 0 });
        setRules({ ...rules, [type === 'late' ? 'lateTiers' : 'earlyTiers']: tiers });
    };

    const removeTier = (type: 'late' | 'early', index: number) => {
        const tiers = [...(type === 'late' ? rules.lateTiers : rules.earlyTiers)];
        tiers.splice(index, 1);
        setRules({ ...rules, [type === 'late' ? 'lateTiers' : 'earlyTiers']: tiers });
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-800">لائحة الحضور والجزاءات</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">إدارة قواعد التأخير والانصراف المبكر</p>
                </div>
                <button 
                    onClick={() => window.print()}
                    className="bg-slate-800 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg hover:bg-slate-900 transition-all no-print"
                >
                    <Icon name="printer" size={20} /> طباعة اللائحة
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* General Settings */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                        <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                            <Icon name="settings" className="text-indigo-600" /> إعدادات عامة
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">فترة السماح (دقائق)</label>
                                <input 
                                    type="number" 
                                    value={rules.lateGracePeriod} 
                                    onChange={(e) => updateRule('lateGracePeriod', parseInt(e.target.value))}
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-black text-slate-800 focus:ring-2 focus:ring-indigo-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">جزاء الغياب (أيام)</label>
                                <input 
                                    type="number" 
                                    value={rules.absencePenalty} 
                                    onChange={(e) => updateRule('absencePenalty', parseFloat(e.target.value))}
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-black text-slate-800 focus:ring-2 focus:ring-indigo-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-indigo-600 p-8 rounded-[40px] text-white shadow-xl shadow-indigo-100">
                        <Icon name="info" size={32} className="mb-4" />
                        <h4 className="text-lg font-black mb-2">نصيحة إدارية</h4>
                        <p className="text-indigo-100 font-bold text-sm leading-relaxed">
                            تساعد اللوائح الواضحة على تحسين الانضباط الوظيفي. تأكد من إبلاغ جميع الموظفين بالتغييرات في اللائحة.
                        </p>
                    </div>
                </div>

                {/* Tiers */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Late Tiers */}
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                <Icon name="clock" className="text-rose-500" /> شرائح التأخير
                            </h3>
                            <button 
                                onClick={() => addTier('late')}
                                className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:text-indigo-700 flex items-center gap-1 no-print"
                            >
                                <Icon name="plus" size={14} /> إضافة شريحة
                            </button>
                        </div>
                        <div className="space-y-4">
                            {rules.lateTiers.map((tier: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl group">
                                    <div className="flex-1 grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">من (دقيقة)</label>
                                            <input 
                                                type="number" 
                                                value={tier.min} 
                                                onChange={(e) => updateTier('late', idx, 'min', e.target.value)}
                                                className="w-full bg-white border-none rounded-xl p-2 font-black text-slate-800 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">إلى (دقيقة)</label>
                                            <input 
                                                type="number" 
                                                value={tier.max} 
                                                onChange={(e) => updateTier('late', idx, 'max', e.target.value)}
                                                className="w-full bg-white border-none rounded-xl p-2 font-black text-slate-800 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">الجزاء (يوم)</label>
                                            <input 
                                                type="number" 
                                                step="0.25"
                                                value={tier.penalty} 
                                                onChange={(e) => updateTier('late', idx, 'penalty', e.target.value)}
                                                className="w-full bg-white border-none rounded-xl p-2 font-black text-slate-800 text-sm"
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => removeTier('late', idx)}
                                        className="p-2 text-slate-300 hover:text-rose-500 transition-colors no-print"
                                    >
                                        <Icon name="trash-2" size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Early Tiers */}
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                <Icon name="log-out" className="text-amber-500" /> شرائح الانصراف المبكر
                            </h3>
                            <button 
                                onClick={() => addTier('early')}
                                className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:text-indigo-700 flex items-center gap-1 no-print"
                            >
                                <Icon name="plus" size={14} /> إضافة شريحة
                            </button>
                        </div>
                        <div className="space-y-4">
                            {rules.earlyTiers.map((tier: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl group">
                                    <div className="flex-1 grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">من (دقيقة)</label>
                                            <input 
                                                type="number" 
                                                value={tier.min} 
                                                onChange={(e) => updateTier('early', idx, 'min', e.target.value)}
                                                className="w-full bg-white border-none rounded-xl p-2 font-black text-slate-800 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">إلى (دقيقة)</label>
                                            <input 
                                                type="number" 
                                                value={tier.max} 
                                                onChange={(e) => updateTier('early', idx, 'max', e.target.value)}
                                                className="w-full bg-white border-none rounded-xl p-2 font-black text-slate-800 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">الجزاء (يوم)</label>
                                            <input 
                                                type="number" 
                                                step="0.25"
                                                value={tier.penalty} 
                                                onChange={(e) => updateTier('early', idx, 'penalty', e.target.value)}
                                                className="w-full bg-white border-none rounded-xl p-2 font-black text-slate-800 text-sm"
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => removeTier('early', idx)}
                                        className="p-2 text-slate-300 hover:text-rose-500 transition-colors no-print"
                                    >
                                        <Icon name="trash-2" size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
