import React, { useState } from 'react';
import { Icon } from './ui/Icon';
import { motion, AnimatePresence } from 'motion/react';

export default function Assets({ assets, setAssets, employees, showToast, askConfirm }: any) {
  const [showModal, setShowModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', code: '', employeeId: '', category: 'Laptop', status: 'Good', notes: '' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((x: any) => x.id === formData.employeeId);
    const assetData = { 
      ...formData, 
      id: editingAsset ? editingAsset.id : Date.now().toString(), 
      employeeName: emp?.name || 'مخزن' 
    };

    if (editingAsset) {
      setAssets(assets.map((a: any) => a.id === editingAsset.id ? assetData : a));
      showToast('تم تحديث بيانات العهدة');
    } else {
      setAssets([...assets, assetData]);
      showToast('تم إضافة العهدة بنجاح');
    }
    
    setShowModal(false);
    setEditingAsset(null);
    setFormData({ name: '', code: '', employeeId: '', category: 'Laptop', status: 'Good', notes: '' });
  };

  const deleteAsset = (id: string) => {
    askConfirm('حذف العهدة؟', 'هل أنت متأكد من حذف هذا الأصل من العهد؟', () => {
      setAssets(assets.filter((a: any) => a.id !== id));
      showToast('تم الحذف بنجاح', 'error');
    });
  };

  const stats = [
    { label: 'إجمالي الأصول', value: assets.length, icon: 'package', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'عهدة موظفين', value: assets.filter((a: any) => a.employeeId).length, icon: 'user-check', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'بالمخزن', value: assets.filter((a: any) => !a.employeeId).length, icon: 'archive', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'تحتاج صيانة', value: assets.filter((a: any) => a.status === 'Needs Maintenance').length, icon: 'wrench', color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic">إدارة العهد والأصول <span className="text-indigo-600">Asset Tracking</span></h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1 italic">نظام تتبع الأجهزة والمعدات المسلمة للموظفين</p>
        </div>
        <button 
           onClick={() => { setEditingAsset(null); setShowModal(true); }}
           className="bg-slate-900 text-white px-10 py-5 rounded-[30px] font-black shadow-2xl hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group"
        >
           <Icon name="plus" size={24} className="group-hover:rotate-90 transition-transform" />
           تسجيل عهدة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
         {stats.map((s, i) => (
           <div key={i} className={`${s.bg} p-8 rounded-[40px] border border-white shadow-sm space-y-4`}>
              <div className="flex justify-between items-start text-indigo-900/20">
                 <div className={`p-4 bg-white rounded-2xl shadow-sm ${s.color}`}><Icon name={s.icon} size={24} /></div>
                 <p className="text-[10px] font-black uppercase tracking-widest">Realtime Stat</p>
              </div>
              <div>
                 <p className="text-sm font-black text-slate-500">{s.label}</p>
                 <h3 className={`text-3xl font-black ${s.color}`}>{s.value}</h3>
              </div>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-[50px] shadow-3xl overflow-hidden border border-slate-100 mx-4">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 border-b border-slate-100 italic">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-10 py-8">اسم الأصل / الجهاز</th>
                <th className="p-8">الكود / السيريال</th>
                <th className="p-8">المستلم (العهدة)</th>
                <th className="p-8">الحالة الفنية</th>
                <th className="px-10 py-8 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {assets.length === 0 ? (
                 <tr>
                    <td colSpan={5} className="py-24 text-center text-slate-300 font-black italic">لا يوجد عهد مسجلة حتى الآن</td>
                 </tr>
              ) : assets.map((a: any) => (
                <tr key={a.id} className="hover:bg-slate-50 transition-all font-bold group">
                  <td className="px-10 py-6">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm transition-all group-hover:scale-110">
                           <Icon name={a.category === 'Laptop' ? 'laptop' : a.category === 'Phone' ? 'smartphone' : 'package'} size={24} />
                        </div>
                        <div>
                           <p className="text-slate-800 font-black">{a.name}</p>
                           <p className="text-[10px] text-slate-400 uppercase">{a.category}</p>
                        </div>
                     </div>
                  </td>
                  <td className="p-6">
                     <span className="font-mono text-sm bg-slate-100 px-3 py-1.5 rounded-xl">{a.code}</span>
                  </td>
                  <td className="p-6">
                     <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${a.employeeId ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                        <span className={`text-sm ${a.employeeId ? 'text-emerald-600 font-black' : 'text-slate-400 italic'}`}>{a.employeeName}</span>
                     </div>
                  </td>
                  <td className="p-6">
                     <span className={`px-4 py-1.5 rounded-full text-[10px] uppercase font-black tracking-widest ${a.status === 'Good' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {a.status === 'Good' ? 'حالة ممتازة' : 'يحتاج صيانة'}
                     </span>
                  </td>
                  <td className="px-10 py-6 text-center">
                     <div className="flex items-center gap-3 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingAsset(a); setFormData({...a}); setShowModal(true); }} className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all"><Icon name="edit" size={18} /></button>
                        <button onClick={() => deleteAsset(a.id)} className="p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all"><Icon name="trash-2" size={18} /></button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
         {showModal && (
           <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white w-full max-w-2xl rounded-[50px] shadow-3xl overflow-hidden"
              >
                 <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                    <div>
                       <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{editingAsset ? 'تعديل بيانات العهدة' : 'تسجيل عهدة جديدة'}</h3>
                       <p className="text-sm font-bold text-slate-400 mt-1 italic">Asset Registration Protocol v4.0</p>
                    </div>
                    <button onClick={() => setShowModal(false)} className="w-14 h-14 bg-slate-50 flex items-center justify-center rounded-2xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all shadow-sm"><Icon name="x" size={28} /></button>
                 </div>

                 <form onSubmit={handleSave} className="p-12 space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 ml-4 uppercase tracking-widest italic">اسم الجهاز / الأصل</label>
                          <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-[25px] p-6 font-black text-slate-800 outline-none focus:border-indigo-500 transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 ml-4 uppercase tracking-widest italic">الكود / السيريال</label>
                          <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-[25px] p-6 font-black text-slate-800 outline-none focus:border-indigo-500 transition-all" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 ml-4 uppercase tracking-widest italic">الموظف (المستلم)</label>
                          <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-[25px] p-6 font-black text-slate-800 outline-none focus:border-indigo-500 transition-all" value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})}>
                            <option value="">بالمخزن (غير مسلم)</option>
                            {employees.map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 ml-4 uppercase tracking-widest italic">تصنيف العهدة</label>
                          <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-[25px] p-6 font-black text-slate-800 outline-none focus:border-indigo-500 transition-all" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                            <option value="Laptop">لابتوب / كمبيوتر</option>
                            <option value="Phone">هاتف محمول</option>
                            <option value="Vehicle">سيارة شركة</option>
                            <option value="Access">بطاقة دخول / مفاتيح</option>
                            <option value="Other">أخرى</option>
                          </select>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 ml-4 uppercase tracking-widest italic">الحالة الفنية</label>
                       <div className="grid grid-cols-2 gap-4">
                          <button type="button" onClick={() => setFormData({...formData, status: 'Good'})} className={`p-5 rounded-[25px] font-black text-xs transition-all border-2 ${formData.status === 'Good' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-400 border-slate-100'}`}>حالة ممتازة</button>
                          <button type="button" onClick={() => setFormData({...formData, status: 'Needs Maintenance'})} className={`p-5 rounded-[25px] font-black text-xs transition-all border-2 ${formData.status === 'Needs Maintenance' ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-slate-400 border-slate-100'}`}>تحتاج صيانة</button>
                       </div>
                    </div>

                    <button type="submit" className="w-full bg-slate-900 text-white p-7 rounded-[35px] font-black shadow-3xl hover:bg-indigo-600 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 text-xl tracking-tighter uppercase italic">حفظ بيانات الأصول <Icon name="shield-check" size={24} /></button>
                 </form>
              </motion.div>
           </div>
         )}
      </AnimatePresence>
    </div>
  );
}
