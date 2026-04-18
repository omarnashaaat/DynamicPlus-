import React from 'react';
import { Icon } from './ui/Icon';
import { motion } from 'motion/react';

export default function DeveloperPage() {
  const links = [
    { title: 'صفحة فيسبوك', url: 'https://www.facebook.com/share/1EwPzBSwsP/', icon: 'facebook', color: 'bg-blue-600' },
    { title: 'قناة واتس اب', url: 'https://chat.whatsapp.com/HHnwRArnuU873tYUMDS6eJ?mode=gi_t', icon: 'message-circle', color: 'bg-emerald-500' },
    { title: 'موقع شخصي', url: 'https://omarnashaat.vercel.app/', icon: 'globe', color: 'bg-slate-800' },
    { title: 'موقع Hr', url: 'https://dynamicplus.vercel.app/', icon: 'briefcase', color: 'bg-indigo-600' },
    { title: 'لينكد أن', url: 'https://www.linkedin.com/in/omar-nashaat-51b426336?utm_source=share_via&utm_content=profile&utm_medium=member_android', icon: 'linkedin', color: 'bg-sky-700' },
    { title: 'قناة يوتيوب', url: 'https://www.youtube.com/@omarnashaat', icon: 'youtube', color: 'bg-rose-600' },
  ];

  return (
    <div className="space-y-12 animate-fade-in pb-20 italic">
      <div className="flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex flex-col items-center md:items-start gap-6">
           <div className="w-32 h-32 bg-indigo-600 text-white rounded-[40px] flex items-center justify-center shadow-4xl rotate-6 animate-bounce">
              <Icon name="award" size={64} />
           </div>
           <div className="text-center md:text-right">
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase">مطور النظام <span className="text-indigo-600">Omar Nashaat</span></h2>
              <p className="text-lg font-bold text-slate-400 uppercase tracking-widest italic mt-2">خبير تطوير نظم الموارد البشرية والذكاء الاصطناعي</p>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[60px] shadow-4xl border border-slate-100 p-16 space-y-12">
        <div className="space-y-6 text-right">
           <h3 className="text-4xl font-black text-slate-900 tracking-tighter">🎯 أهلاً بيكم في مجتمع HR 👋</h3>
           <p className="text-xl font-bold text-slate-600 leading-relaxed">لو أنت مهتم بمجال الموارد البشرية (HR) سواء شغال بالفعل أو لسه بتبدأ، فأنت في المكان الصح ✅</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <div className="p-10 bg-slate-50 rounded-[45px] space-y-4 border border-slate-100">
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg text-indigo-600"><Icon name="lightbulb" size={32} /></div>
              <h4 className="text-2xl font-black text-slate-800">معلومات ونصايح</h4>
              <p className="text-sm font-bold text-slate-400">نقدم كل ما هو جديد ومفيد في عالم الـ HR الحديث</p>
           </div>
           <div className="p-10 bg-slate-50 rounded-[45px] space-y-4 border border-slate-100">
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg text-emerald-500"><Icon name="calculator" size={32} /></div>
              <h4 className="text-2xl font-black text-slate-800">شؤون عاملين و Payroll</h4>
              <p className="text-sm font-bold text-slate-400">شروحات تفصيلية لعمليات الرواتب والتأمينات والتعيينات</p>
           </div>
           <div className="p-10 bg-slate-50 rounded-[45px] space-y-4 border border-slate-100">
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg text-amber-500"><Icon name="file-code" size={32} /></div>
              <h4 className="text-2xl font-black text-slate-800">نماذج شغل ذكية</h4>
              <p className="text-sm font-bold text-slate-400">KPI's - Job Descriptions - Interviews Forms</p>
           </div>
        </div>

        <div className="p-12 bg-slate-950 rounded-[50px] text-center space-y-8 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[120px] -top-64 -left-64"></div>
           </div>
           <h4 className="text-3xl font-black text-white italic relative z-10">💡 هدفنا نبني مجتمع قوي يفيد بعض ويكبر سوا في المجال</h4>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative z-10">
              {links.map((link, i) => (
                <a 
                  key={i} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex flex-col items-center gap-4 transition-all hover:scale-110"
                >
                   <div className={`w-16 h-16 ${link.color} text-white rounded-[22px] flex items-center justify-center shadow-xl group-hover:rotate-12 transition-all`}>
                      <Icon name={link.icon} size={28} />
                   </div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{link.title}</span>
                </a>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
