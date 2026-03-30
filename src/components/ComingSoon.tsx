import React from 'react';
import { Icon } from './Layout';

export const ComingSoon = ({ title }: { title: string }) => (
    <div className="flex flex-col items-center justify-center py-32 space-y-6 animate-fade-in w-full">
        <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[32px] flex items-center justify-center shadow-inner">
            <Icon name="sparkles" size={48} />
        </div>
        <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-slate-800">{title}</h2>
            <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">سيتم تفعيل هذا القسم قريباً في التحديث القادم</p>
        </div>
        <div className="flex gap-2">
            {[1, 2, 3].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-indigo-200 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>
            ))}
        </div>
    </div>
);
