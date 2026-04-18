import React, { useState, useMemo, useRef } from 'react';
import { Icon } from './ui/Icon';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'motion/react';

interface EmployeeTableProps {
  employees: any[];
  setEmployees: React.Dispatch<React.SetStateAction<any[]>>;
  shifts: any;
  showToast: (msg: string, type?: any) => void;
  askConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export default function EmployeeTable({ employees, setEmployees, shifts, showToast, askConfirm }: EmployeeTableProps) {
  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState<any>(null);
  const [profileTab, setProfileTab] = useState('overview');
  const [editingEmp, setEditingEmp] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({ 
    name: '', code: '', joinDate: '', department: '', jobTitle: '', 
    nationalId: '', phone: '', address: '', email: '', birthDate: '',
    shift: (Object.values(shifts)[0] as any)?.name || '', salary: 0
  });

  const departmentsList = useMemo(() => ['all', ...new Set(employees.map(e => e.department).filter(Boolean))], [employees]);

  const filteredEmployees = useMemo(() => {
    let filtered = selectedDept === 'all' ? employees : employees.filter(e => e.department === selectedDept);
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(e => 
        e.name.toLowerCase().includes(q) || 
        e.code.toString().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.jobTitle.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [employees, selectedDept, searchQuery]);

  const normalizeText = (t: any) => t ? t.toString().trim().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/\s+/g, ' ') : "";

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary', cellDates: true });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (rows.length < 2) return showToast("الملف فارغ تماماً.", "error");

      let headerIdx = 0;
      for (let i = 0; i < Math.min(rows.length, 10); i++) {
        const rowData = rows[i];
        if (!rowData || !Array.isArray(rowData)) continue;
        const rowStr = rowData.map((c: any) => normalizeText(c)).join(' ');
        if (rowStr.includes('اسم') || rowStr.includes('كود')) {
          headerIdx = i;
          break;
        }
      }

      const headers = rows[headerIdx]?.map((h: any) => normalizeText(h)) || [];
      const f = (k: string[], df: number) => {
        const idx = headers.findIndex((h: string) => k.some(ki => h.includes(normalizeText(ki))));
        return idx !== -1 ? idx : df;
      };

      const m = {
        code: f(['كود', 'بصمه', 'رقم وظيفي'], 0),
        name: f(['اسم'], 1),
        joinDate: f(['تاريخ', 'تعيين'], 2),
        department: f(['قسم', 'اداره', 'قطاع'], 3),
        jobTitle: f(['مسمي', 'وظيفه', 'مهنه'], 4),
        nationalId: f(['قومي', 'هويه'], 5),
        phone: f(['هاتف', 'موبايل', 'تليفون'], 6),
        address: f(['عنوان', 'سكن'], 7),
        shift: f(['ورديه', 'شفت'], 8),
        salary: f(['راتب', 'مرتب', 'اجر'], 9),
        email: f(['ايميل', 'بريد'], 10),
        birthDate: f(['ميلاد'], 11)
      };

      const res = rows.slice(headerIdx + 1).map(r => {
        let joinDate = '';
        const rawDate = r[m.joinDate];
        if (rawDate instanceof Date) {
          joinDate = rawDate.toISOString().split('T')[0];
        } else if (rawDate) {
          const d = new Date(rawDate);
          joinDate = isNaN(d.getTime()) ? rawDate.toString() : d.toISOString().split('T')[0];
        }

        let birthDate = '';
        const rawBirth = r[m.birthDate];
        if (rawBirth instanceof Date) {
          birthDate = rawBirth.toISOString().split('T')[0];
        } else if (rawBirth) {
          const bd = new Date(rawBirth);
          birthDate = isNaN(bd.getTime()) ? rawBirth.toString() : bd.toISOString().split('T')[0];
        }

        return {
          id: Math.random().toString(36).substr(2, 9),
          code: r[m.code]?.toString() || '',
          joinDate,
          name: r[m.name]?.toString() || '',
          department: r[m.department]?.toString() || '',
          jobTitle: r[m.jobTitle]?.toString() || '',
          nationalId: r[m.nationalId]?.toString() || '',
          phone: r[m.phone]?.toString() || '',
          address: r[m.address]?.toString() || '',
          email: r[m.email]?.toString() || '',
          salary: parseFloat(r[m.salary]) || 0,
          birthDate,
          shift: r[m.shift]?.toString() || (Object.values(shifts)[0] as any)?.name || '',
          status: 'نشط',
          totalLeaves: 21,
          monthlyLeaves: Array(12).fill(0)
        };
      }).filter(emp => emp.name && emp.code);

      if (res.length) {
        setEmployees(prev => {
          const existingCodes = new Set(prev.map(e => e.code.toString()));
          const uniqueNew = res.filter(e => !existingCodes.has(e.code.toString()));
          if (uniqueNew.length < res.length) {
            showToast(`تم تجاهل ${res.length - uniqueNew.length} سجل مكرر.`);
          }
          return [...prev, ...uniqueNew];
        });
        showToast(`تم استيراد بيانات ${res.length} موظف بنجاح.`);
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  const handleDownloadTemplate = () => {
    const templateData = [{
      'كود الموظف': '101',
      'الاسم الكامل': 'محمد احمد علي',
      'تاريخ التعيين': '2024-01-01',
      'الإدارة': 'الموارد البشرية',
      'المسمى الوظيفي': 'أخصائي شؤون موظفين',
      'الرقم القومي': '29001011234567',
      'رقم الهاتف': '01012345678',
      'العنوان': 'القاهرة، مدينة نصر',
      'الوردية': 'الصباحية',
      'الراتب': '8000',
      'البريد الإلكتروني': 'emp@company.com',
      'تاريخ الميلاد': '1990-05-15'
    }];
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "HR_Import_Template.xlsx");
    showToast('تم تحميل نموذج الاستيراد', 'info');
  };

  const handleExcelExport = () => {
    const exportData = filteredEmployees.map(emp => ({
      'الكود': emp.code || '',
      'الاسم': emp.name || '',
      'القسم': emp.department || '',
      'الوظيفة': emp.jobTitle || '',
      'تاريخ التعيين': emp.joinDate || '',
      'الراتب': emp.salary || 0,
      'الوردية': emp.shift || '',
      'الحالة': emp.status || ''
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    XLSX.writeFile(workbook, "Employees_List.xlsx");
    showToast('تم تصدير البيانات بنجاح', 'success');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmp) {
      setEmployees(employees.map(e => e.id === editingEmp.id ? { ...formData, id: editingEmp.id } : e));
      showToast('تم تحديث البيانات');
    } else {
      if (employees.some(e => e.code === formData.code)) {
        return showToast('هذا الكود مستخدم بالفعل', 'error');
      }
      setEmployees([...employees, { ...formData, id: Date.now().toString(), status: 'نشط', totalLeaves: 21, monthlyLeaves: Array(12).fill(0) }]);
      showToast('تم إضافة الموظف بنجاح');
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    const emp = employees.find(e => e.id === id);
    askConfirm('حذف الموظف؟', `هل أنت متأكد من حذف الموظف ${emp?.name}؟`, () => {
      setEmployees(employees.filter(e => e.id !== id));
      showToast('تم حذف الموظف', 'error');
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tighter">فريق العمل</h2>
          <p className="text-slate-500 font-bold mt-1">إدارة بيانات الكادر البشري والملفات الوظيفية</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx, .xls" onChange={handleExcelUpload} />
          <button 
            onClick={handleExcelExport} 
            className="flex-1 sm:flex-none justify-center px-6 py-3.5 rounded-2xl font-black flex items-center gap-2 shadow-xl bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-all"
          >
            <Icon name="download" size={20} /> 
            تصدير Excel
          </button>
          <button 
            onClick={handleDownloadTemplate} 
            className="flex-1 sm:flex-none justify-center px-6 py-3.5 rounded-2xl font-black flex items-center gap-2 shadow-xl bg-orange-50 text-orange-700 border border-orange-100 hover:bg-orange-100 transition-all text-sm"
          >
            <Icon name="file-text" size={20} /> 
            تحميل النموذج
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="flex-1 sm:flex-none justify-center px-6 py-3.5 rounded-2xl font-black flex items-center gap-2 shadow-xl bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition-all"
          >
            <Icon name="file-spreadsheet" size={20} /> 
            استيراد Excel
          </button>
          <button 
            onClick={() => { 
              setEditingEmp(null); 
              setFormData({ 
                name: '', code: '', joinDate: '', department: '', jobTitle: '', 
                nationalId: '', phone: '', address: '', email: '', birthDate: '',
                shift: (Object.values(shifts)[0] as any)?.name || '', salary: 0 
              }); 
              setShowModal(true); 
            }} 
            className="w-full sm:w-auto justify-center bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-2 shadow-2xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all"
          >
            <Icon name="plus" size={22} /> 
            إضافة موظف جديد
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
        <div className="md:col-span-2 relative group">
          <Icon name="search" size={22} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="ابحث بالاسم، الكود، القسم..." 
            className="w-full bg-white border-2 border-slate-100 rounded-[25px] py-4 pr-14 pl-6 text-base font-bold outline-none focus:border-indigo-500/30 transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative">
          <Icon name="list-filter" size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <select 
            value={selectedDept} 
            onChange={(e) => setSelectedDept(e.target.value)} 
            className="w-full pr-12 pl-6 py-4 rounded-[25px] border-2 font-bold focus:outline-none bg-white border-slate-100 text-slate-700 appearance-none cursor-pointer shadow-sm"
          >
            <option value="all">كافة الأقسام والإدارات</option>
            {departmentsList.filter(d => d !== 'all').map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="rounded-[45px] shadow-2xl overflow-hidden border bg-white border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
              <tr>
                <th className="px-6 py-6">م</th>
                <th className="px-6 py-6">الكود</th>
                <th className="px-8 py-6">الاسم الكامل</th>
                <th className="px-6 py-6">الإدارة</th>
                <th className="px-6 py-6">المسمى الوظيفي</th>
                <th className="px-6 py-6 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredEmployees.map((emp, index) => (
                <tr key={emp.id} className="hover:bg-indigo-50/30 transition-all group">
                  <td className="px-6 py-5 font-bold text-slate-400 text-xs">{index + 1}</td>
                  <td className="px-6 py-5">
                    <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg font-mono font-black text-sm">{emp.code}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        {emp.name.substring(0, 1)}
                      </div>
                      <span className="font-black text-base text-slate-800">{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-lg">{emp.department}</span>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-500">{emp.jobTitle}</td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setShowProfile(emp)} className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all" title="عرض الملف الشخصي"><Icon name="user" size={18} /></button>
                      <button onClick={() => { setEditingEmp(emp); setFormData({ ...emp }); setShowModal(true); }} className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all" title="تعديل"><Icon name="edit" size={18} /></button>
                      <button onClick={() => handleDelete(emp.id)} className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all" title="حذف"><Icon name="trash-2" size={18} /></button>
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] p-4 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center py-10 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-4xl p-10 rounded-[40px] shadow-2xl border bg-white border-slate-200 text-right text-base mb-auto mt-auto"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-3xl font-black text-slate-800">{editingEmp ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}</h3>
                  <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-rose-500"><Icon name="x" size={32} /></button>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500 uppercase">الاسم الكامل</label>
                  <input required type="text" className="w-full px-5 py-3 rounded-2xl border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500 uppercase">الكود الوظيفي</label>
                  <input required type="text" className="w-full px-5 py-3 rounded-2xl border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500 uppercase">تاريخ التعيين</label>
                  <input required type="date" className="w-full px-5 py-3 rounded-2xl border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800" value={formData.joinDate} onChange={(e) => setFormData({...formData, joinDate: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500 uppercase">الإدارة</label>
                  <input required type="text" className="w-full px-5 py-3 rounded-2xl border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500 uppercase">المسمى الوظيفي</label>
                  <input required type="text" className="w-full px-5 py-3 rounded-2xl border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800" value={formData.jobTitle} onChange={(e) => setFormData({...formData, jobTitle: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500 uppercase">الرقم القومي</label>
                  <input required type="text" pattern="\d{14}" className="w-full px-5 py-3 rounded-2xl border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800" value={formData.nationalId} onChange={(e) => setFormData({...formData, nationalId: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500 uppercase">رقم الهاتف</label>
                  <input type="text" className="w-full px-5 py-3 rounded-2xl border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500 uppercase">البريد الإلكتروني</label>
                  <input type="email" className="w-full px-5 py-3 rounded-2xl border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500 uppercase">تاريخ الميلاد</label>
                  <input type="date" className="w-full px-5 py-3 rounded-2xl border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800" value={formData.birthDate} onChange={(e) => setFormData({...formData, birthDate: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500 uppercase">الراتب الأساسي</label>
                  <input type="number" className="w-full px-5 py-3 rounded-2xl border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800" value={formData.salary} onChange={(e) => setFormData({...formData, salary: parseFloat(e.target.value) || 0})} />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-black text-slate-500 uppercase">العنوان</label>
                  <input type="text" className="w-full px-5 py-3 rounded-2xl border outline-none font-bold bg-slate-50 border-slate-100 text-slate-800" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                </div>
                <div className="md:col-span-3 pt-6">
                  <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-3xl text-xl shadow-xl hover:bg-indigo-700 transition-all">حفظ البيانات</button>
                </div>
              </form>
            </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showProfile && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[150] p-4 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center py-10">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white w-full max-w-5xl rounded-[50px] shadow-3xl relative overflow-hidden mb-auto mt-auto"
              >
              <div className="h-32 bg-slate-900 w-full relative">
                 <div className="absolute -bottom-16 right-12 w-32 h-32 rounded-[35px] bg-indigo-600 border-4 border-white flex items-center justify-center text-white text-5xl font-black shadow-2xl">
                    {showProfile.name.charAt(0)}
                 </div>
                 <button onClick={() => setShowProfile(null)} className="absolute top-6 left-6 p-2 bg-white/10 hover:bg-rose-500 text-white rounded-xl transition-all"><Icon name="x" size={24} /></button>
              </div>
              
              <div className="pt-20 px-12 pb-12">
                 <div className="flex justify-between items-start mb-10">
                    <div>
                       <h2 className="text-4xl font-black text-slate-800 tracking-tighter">{showProfile.name}</h2>
                       <p className="text-indigo-600 font-bold text-lg mt-1 underline decoration-indigo-100 decoration-2 underline-offset-4">{showProfile.jobTitle} • {showProfile.department}</p>
                    </div>
                    <div className="flex gap-2">
                       <button className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-sm hover:bg-indigo-600 hover:text-white transition-all">تحميل السيرة الذاتية</button>
                    </div>
                 </div>

                 <div className="flex bg-slate-50 p-1.5 rounded-2xl mb-10 w-fit no-print">
                    {[
                      { id: 'overview', title: 'نظرة عامة', icon: 'layout' },
                      { id: 'timeline', title: 'سجل الترقيات', icon: 'milestone' },
                      { id: 'docs', title: 'المستندات', icon: 'files' },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setProfileTab(tab.id)}
                        className={`px-8 py-3 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${profileTab === tab.id ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                         <Icon name={tab.icon} size={16} />
                         {tab.title}
                      </button>
                    ))}
                 </div>

                 {profileTab === 'overview' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                       <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                          {[
                            { label: 'كود الموظف', val: showProfile.code, icon: 'id-card' },
                            { label: 'تاريخ التعيين', val: showProfile.joinDate, icon: 'calendar-range' },
                            { label: 'الرقم القومي', val: showProfile.nationalId, icon: 'id-card' },
                            { label: 'رقم الهاتف', val: showProfile.phone || 'غير مسجل', icon: 'phone' },
                            { label: 'البريد الإلكتروني', val: showProfile.email || 'غير مسجل', icon: 'mail' },
                            { label: 'تاريخ الميلاد', val: showProfile.birthDate || 'غير مسجل', icon: 'cake' },
                            { label: 'الراتب الأساسي', val: `${showProfile.salary} ج.م`, icon: 'banknote' },
                            { label: 'الوردية', val: showProfile.shift, icon: 'clock' },
                          ].map((stat, i) => (stat.val &&
                            <div key={i} className="p-6 bg-slate-50/50 border border-slate-50 rounded-[30px] space-y-2 group hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all">
                               <div className="text-slate-300 group-hover:text-indigo-400 transition-colors"><Icon name={stat.icon} size={20} /></div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                               <p className="font-black text-slate-800">{stat.val}</p>
                            </div>
                          ))}
                       </div>
                       
                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div className="p-8 bg-indigo-950 text-white rounded-[40px] shadow-2xl relative overflow-hidden">
                             <div className="absolute -top-12 -left-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
                             <h4 className="text-lg font-black mb-6 relative z-10">إحصائيات الحضور</h4>
                             <div className="grid grid-cols-3 gap-4 relative z-10">
                                <div className="text-center">
                                   <p className="text-3xl font-black mb-1">21</p>
                                   <p className="text-[10px] text-indigo-300 font-bold">يوم عمل</p>
                                </div>
                                <div className="text-center border-x border-white/10">
                                   <p className="text-3xl font-black mb-1">2</p>
                                   <p className="text-[10px] text-indigo-300 font-bold">تأخير</p>
                                </div>
                                <div className="text-center">
                                   <p className="text-3xl font-black mb-1">0</p>
                                   <p className="text-[10px] text-indigo-300 font-bold">غياب</p>
                                </div>
                             </div>
                          </div>
                          <div className="p-8 bg-white border border-slate-100 rounded-[40px] shadow-sm flex flex-col justify-center gap-2 italic">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">العنوان الفعلي</p>
                             <p className="text-xl font-black text-slate-800">{showProfile.address || 'لم يتم تسجيل العنوان'}</p>
                          </div>
                       </div>
                    </motion.div>
                 )}

                 {profileTab === 'timeline' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                       <div className="relative pr-12 space-y-12 before:absolute before:right-6 before:top-2 before:bottom-2 before:w-1 before:bg-slate-100 before:rounded-full">
                          {[
                            { title: 'موظف حالي', date: showProfile.joinDate, sub: 'بقرار تعيين رسمي', type: 'current' },
                            { title: 'فترة التجريب', date: showProfile.joinDate, sub: 'بداية العمل بالشركة', type: 'start' },
                          ].map((event, i) => (
                            <div key={i} className="relative group">
                               <div className={`absolute -right-[30px] top-1.5 w-4 h-4 rounded-full border-4 border-white shadow-md z-10 transition-all group-hover:scale-150 ${event.type === 'current' ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                               <div className="premium-card p-6 inline-block min-w-[300px]">
                                  <p className="text-[10px] font-black text-slate-400 italic mb-1">{event.date}</p>
                                  <h4 className="font-black text-slate-800">{event.title}</h4>
                                  <p className="text-xs text-slate-500 font-bold">{event.sub}</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </motion.div>
                 )}

                 {profileTab === 'docs' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {[
                         { name: 'صورة البطاقة', type: 'Identity', size: '1.2 MB' },
                         { name: 'شهادة التخرج', type: 'Education', size: '2.4 MB' },
                         { name: 'عقد العمل الموثق', type: 'Contract', size: '3.1 MB' },
                         { name: 'شهادة الخبرة', type: 'Experience', size: '0.8 MB' },
                       ].map((doc, i) => (
                         <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-[35px] flex items-center justify-between hover:bg-white hover:shadow-xl transition-all group cursor-pointer">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                  <Icon name="file-text" size={24} />
                               </div>
                               <div>
                                  <h5 className="font-black text-slate-800 text-sm">{doc.name}</h5>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase">{doc.type} • {doc.size}</p>
                               </div>
                            </div>
                            <button className="p-2 text-slate-300 hover:text-indigo-600 transition-all"><Icon name="download" size={18} /></button>
                         </div>
                       ))}
                    </motion.div>
                 )}
              </div>
            </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
