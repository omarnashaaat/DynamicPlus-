import React, { useState } from 'react';
import { Icon } from './ui/Icon';
import { motion } from 'motion/react';

interface RewardsProps {
  employees: any[];
  rewards: any[];
  setRewards: (val: any) => void;
  showToast: (msg: string, type?: any) => void;
  askConfirm: (title: string, msg: string, onConfirm: () => void) => void;
}

export default function Rewards({ employees, rewards, setRewards, showToast, askConfirm }: RewardsProps) {
  const [formData, setFormData] = useState({ empId: '', amount: '', type: 'bonus', reason: '', points: '10' });

  const handleAddReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.empId || (!formData.amount && formData.type !== 'points')) return;

    const emp = employees.find(e => e.id === formData.empId);
    const newReward = {
      id: Date.now().toString(),
      empId: formData.empId,
      empName: emp?.name || 'غير معروف',
      amount: parseFloat(formData.amount || '0'),
      points: parseInt(formData.points || '0'),
      type: formData.type,
      reason: formData.reason,
      date: new Date().toISOString().split('T')[0],
    };

    setRewards([...rewards, newReward]);
    setFormData({ empId: '', amount: '', type: 'bonus', reason: '', points: '10' });
    showToast('تم تسجيل المكافأة بنجاح');
  };

  const deleteReward = (id: string) => {
    askConfirm('حذف المكافأة؟', 'هل أنت متأكد من حذف هذا السجل بشكل نهائي؟', () => {
      setRewards(rewards.filter((r: any) => r.id !== id));
      showToast('تم حذف السجل', 'error');
    });
  };

  const sortedLeadboard = [...employees].sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[40px] border shadow-sm border-slate-100">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
                  <Icon name="trophy" size={24} />
               </div>
               <div>
                  <h2 className="text-2xl font-black text-slate-800">نظام المكافآت والتميز</h2>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">توزيع المكافآت ونقاط الأداء</p>
               </div>
            </div>

            <form onSubmit={handleAddReward} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase mr-2">الموظف</label>
                <select 
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-slate-700 font-bold focus:ring-4 focus:ring-orange-500/5 outline-none transition-all"
                  value={formData.empId}
                  onChange={e => setFormData({...formData, empId: e.target.value})}
                >
                  <option value="">اختر الموظف</option>
                  {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase mr-2">نوع التكريم</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-slate-700 font-bold focus:ring-4 focus:ring-orange-500/5 outline-none transition-all"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option value="bonus">مكافأة مالية</option>
                  <option value="points">نقاط أداء (Gamification)</option>
                  <option value="appraisal">خطاب شكر</option>
                </select>
              </div>
              {formData.type === 'bonus' ? (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase mr-2">المبلغ (ج.م)</label>
                  <input 
                    required
                    type="number"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-slate-700 font-bold focus:ring-4 focus:ring-orange-500/5 outline-none transition-all"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase mr-2">النقاط</label>
                  <input 
                    required
                    type="number"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-slate-700 font-bold focus:ring-4 focus:ring-orange-500/5 outline-none transition-all"
                    value={formData.points}
                    onChange={e => setFormData({...formData, points: e.target.value})}
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase mr-2">السبب</label>
                <input 
                  type="text"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-slate-700 font-bold focus:ring-4 focus:ring-orange-500/5 outline-none transition-all"
                  placeholder="مثال: تميز في العمل.."
                  value={formData.reason}
                  onChange={e => setFormData({...formData, reason: e.target.value})}
                />
              </div>
              <button type="submit" className="md:col-span-2 w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
                <Icon name="award" size={20} /> منح التكريم
              </button>
            </form>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
               <h3 className="font-black text-slate-800">سجل المكافآت الأخير</h3>
               <Icon name="history" size={18} className="text-slate-400" />
            </div>
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-50">
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">الموظف</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">النوع</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">القيمة</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">السبب</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">التاريخ</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">العمليات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rewards.length === 0 ? (
                   <tr>
                     <td colSpan={6} className="p-12 text-center text-slate-300 font-bold">لا توجد سجلات مكافآت حتى الآن</td>
                   </tr>
                ) : rewards.slice().reverse().map(reward => (
                  <tr key={reward.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-6 font-black text-slate-700">{reward.empName}</td>
                    <td className="p-6">
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${reward.type === 'bonus' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                          {reward.type === 'bonus' ? 'مالية' : reward.type === 'points' ? 'نقاط' : 'خطاب شكر'}
                       </span>
                    </td>
                    <td className="p-6 font-black text-slate-900">
                       {reward.type === 'bonus' ? `${reward.amount.toLocaleString()} ج.م` : `${reward.points} نقطة`}
                    </td>
                    <td className="p-6 font-bold text-slate-400 text-xs">{reward.reason || '---'}</td>
                    <td className="p-6 font-bold text-slate-400 text-xs">{reward.date}</td>
                    <td className="p-6">
                       <button onClick={() => deleteReward(reward.id)} className="p-2.5 rounded-xl bg-rose-50 text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"><Icon name="trash-2" size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-8">
           {/* Honor Board */}
           <div className="bg-slate-900 p-8 rounded-[50px] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                 <Icon name="crown" className="text-yellow-400" size={24} /> لوحة الشرف
              </h3>
              
              <div className="space-y-6">
                 {sortedLeadboard.map((emp, i) => (
                   <div key={emp.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${i === 0 ? 'bg-yellow-400 text-slate-900 shadow-[0_0_20px_rgba(250,204,21,0.4)]' : 'bg-white/10 text-white'}`}>
                            {i + 1}
                         </div>
                         <div>
                            <p className="font-black text-sm">{emp.name}</p>
                            <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">{emp.dept}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="font-black text-yellow-400">{emp.points || 0}</p>
                         <p className="text-[9px] text-white/40 font-bold uppercase">نقطة</p>
                      </div>
                   </div>
                 ))}
                 {employees.length === 0 && <p className="text-center text-white/30 font-bold">يرجى إضافة موظفين أولاً</p>}
              </div>
              
              <button onClick={() => showToast('سيتم إطلاق نظام الترقيات قريباً!', 'info')} className="mt-8 w-full py-4 bg-white/10 border border-white/20 hover:bg-white/20 text-white rounded-2xl font-black text-xs transition-all uppercase tracking-widest">تفاصيل النقاط</button>
           </div>
           
           {/* Quick Tips */}
           <div className="bg-indigo-50 p-8 rounded-[40px] border border-indigo-100">
              <h4 className="font-black text-indigo-900 mb-4 flex items-center gap-2">
                 <Icon name="info" size={18} /> نصيحة اليوم
              </h4>
              <p className="text-sm font-bold text-indigo-700 leading-relaxed">
                 تحفيز الموظفين بنظام النقاط (Gamification) يزيد من الإنتاجية بنسبة 40%. جرب منح نقاط للموظفين الملتزمين بالحضور المبكر!
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
