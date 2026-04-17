import React, { useState } from 'react';
import { Icon } from './ui/Icon';

interface TrainingProps {
  employees: any[];
  showToast: (msg: string, type?: any) => void;
}

export default function Training({ employees, showToast }: TrainingProps) {
  const [courses, setCourses] = useState([
    { id: 1, title: 'القيادة الإدارية', provider: 'مركز التدريب العالمي', date: '2024-05-10', status: 'completed', attendees: 12 },
    { id: 2, title: 'مهارات التواصل الفعال', provider: 'أكاديمية الموارد البشرية', date: '2024-06-15', status: 'upcoming', attendees: 25 },
    { id: 3, title: 'إدارة الوقت والضغوط', provider: 'مؤسسة تطوير الذات', date: '2024-04-20', status: 'completed', attendees: 18 },
  ]);

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-800">التدريب والتطوير</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">تنمية مهارات الكوادر البشرية</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs hover:bg-indigo-700 transition-all flex items-center gap-2">
          <Icon name="plus" size={16} /> إضافة دورة تدريبية
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {courses.map(course => (
          <div key={course.id} className="bg-white rounded-[40px] border shadow-xl p-8 flex flex-col justify-between group hover:border-indigo-400 transition-all">
            <div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${course.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                <Icon name={course.status === 'completed' ? 'graduation-cap' : 'clock'} size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">{course.title}</h3>
              <p className="text-xs text-slate-400 font-bold mb-4">{course.provider}</p>
              <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase">
                <span className="flex items-center gap-1"><Icon name="calendar" size={12} /> {course.date}</span>
                <span className="flex items-center gap-1"><Icon name="users" size={12} /> {course.attendees} متدرب</span>
              </div>
            </div>
            <button className="mt-8 w-full py-3 rounded-xl bg-slate-50 text-slate-400 font-black text-[10px] uppercase group-hover:bg-indigo-600 group-hover:text-white transition-all">
              عرض التفاصيل
            </button>
          </div>
        ))}
      </div>

      <div className="bg-indigo-900 rounded-[50px] p-12 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-3xl font-black mb-4">خطة التدريب السنوية 2024</h3>
          <p className="text-indigo-200 font-bold text-sm mb-8 leading-relaxed">تم تصميم هذه الخطة لرفع كفاءة الموظفين في المجالات التقنية والإدارية بنسبة 25% خلال العام الحالي.</p>
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl flex-1">
              <p className="text-4xl font-black mb-1">15</p>
              <p className="text-[10px] font-black uppercase opacity-60">دورة متبقية</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl flex-1">
              <p className="text-4xl font-black mb-1">85%</p>
              <p className="text-[10px] font-black uppercase opacity-60">نسبة الإنجاز</p>
            </div>
          </div>
        </div>
        <Icon name="award" size={300} className="absolute -bottom-20 -left-20 text-white/5 rotate-12" />
      </div>
    </div>
  );
}
