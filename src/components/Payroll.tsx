import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from './ui/Icon';
import { motion, AnimatePresence } from 'motion/react';

interface PayrollProps {
  employees: any[];
  payrollRecords: any;
  setPayrollRecords: React.Dispatch<React.SetStateAction<any>>;
  attendanceLog: any;
  insuranceRecords: any;
  setActiveTab: (tab: string) => void;
  rules: any;
  showToast: (msg: string, type?: any) => void;
}

export default function Payroll({ employees, payrollRecords, setPayrollRecords, attendanceLog, insuranceRecords, setActiveTab, rules, showToast }: PayrollProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [searchQuery, setSearchQuery] = useState('');
  const [payslipTarget, setPayslipTarget] = useState<any>(null);
  const [editTarget, setEditTarget] = useState<any>(null);

  // Auto-calculate deductions from attendance
  useEffect(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const startDate = new Date(year, month - 2, 26);
    const endDate = new Date(year, month - 1, 25);
    
    const days: string[] = [];
    let current = new Date(startDate);
    while (current <= endDate) {
      days.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }

    const updatedRecords = { ...payrollRecords };
    let changed = false;

    employees.forEach(emp => {
      const totals = days.reduce((acc, date) => {
        const rec = (attendanceLog[date] && attendanceLog[date][emp.id]);
        acc.late += (rec?.lateDeduction || 0);
        acc.early += (rec?.earlyDeduction || 0);
        acc.absent += (rec?.status === 'absent' ? 1 : 0);
        return acc;
      }, { late: 0, early: 0, absent: 0 });

      if (!updatedRecords[selectedMonth]) updatedRecords[selectedMonth] = {};
      if (!updatedRecords[selectedMonth][emp.id]) {
        updatedRecords[selectedMonth][emp.id] = {
          basicSalary: emp.salary || 0,
          housingAllowance: 0,
          transportAllowance: 0,
          foodAllowance: 0,
          performanceBonus: 0,
          overtimePay: 0,
          otherAdditions: 0,
          insuranceDeduction: 0,
          incomeTax: 0,
          loanDeduction: 0,
          otherDeductions: 0,
          lateCount: totals.late,
          earlyCount: totals.early,
          absentCount: totals.absent,
          lateVal: totals.late * ((emp.salary || 0) / 30 / 8),
          earlyVal: totals.early * ((emp.salary || 0) / 30 / 8),
          absentVal: totals.absent * ((emp.salary || 0) / 30),
        };
        changed = true;
      } else {
        const rec = updatedRecords[selectedMonth][emp.id];
        let recChanged = false;
        if (rec.lateCount !== totals.late) { rec.lateCount = totals.late; rec.lateVal = totals.late * (rec.basicSalary / 30 / 8); recChanged = true; }
        if (rec.earlyCount !== totals.early) { rec.earlyCount = totals.early; rec.earlyVal = totals.early * (rec.basicSalary / 30 / 8); recChanged = true; }
        if (rec.absentCount !== totals.absent) { rec.absentCount = totals.absent; rec.absentVal = totals.absent * (rec.basicSalary / 30); recChanged = true; }
        if (recChanged) changed = true;
      }
    });

    if (changed) setPayrollRecords(updatedRecords);
  }, [selectedMonth, employees, attendanceLog]);

  const updateField = (empId: string, field: string, value: any) => {
    const val = parseFloat(value) || 0;
    setPayrollRecords((prev: any) => {
      const monthRecords = prev[selectedMonth] || {};
      const current = monthRecords[empId] || {};
      const updated = { ...current, [field]: val };
      
      if (field === 'basicSalary') {
        updated.lateVal = (updated.lateCount || 0) * (val / 30 / 8);
        updated.earlyVal = (updated.earlyCount || 0) * (val / 30 / 8);
        updated.absentVal = (updated.absentCount || 0) * (val / 30);
      }

      return {
        ...prev,
        [selectedMonth]: { ...monthRecords, [empId]: updated }
      };
    });
  };

  const calculateAdditions = (r: any) => {
    return (r.basicSalary || 0) + (r.housingAllowance || 0) + (r.transportAllowance || 0) + 
           (r.foodAllowance || 0) + (r.performanceBonus || 0) + (r.overtimePay || 0) + (r.otherAdditions || 0);
  };

  const calculateDeductions = (r: any) => {
    return (r.lateVal || 0) + (r.earlyVal || 0) + (r.absentVal || 0) + (r.insuranceDeduction || 0) + 
           (r.incomeTax || 0) + (r.loanDeduction || 0) + (r.otherDeductions || 0);
  };

  const calculateNet = (record: any) => {
    const r = record || {};
    return calculateAdditions(r) - calculateDeductions(r);
  };

  const printPayslip = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print px-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center shadow-lg">
             <Icon name="banknote" size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">إدارة الرواتب والأجور</h2>
            <p className="text-sm font-bold text-slate-400">نظام محاسبي متكامل للمستحقات والخصومات</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white p-3 rounded-[30px] border shadow-xl">
          <div className="flex items-center gap-2 px-4 border-l">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">الفترة المختارة</span>
            <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="bg-transparent font-black text-slate-800 outline-none" />
          </div>
          <div className="relative">
            <Icon name="search" size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="بحث باسم الموظف..." className="bg-slate-50 border-none rounded-2xl py-3 pr-10 pl-4 text-xs font-bold outline-none w-64 focus:ring-2 ring-emerald-500/20" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <button onClick={() => window.print()} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black hover:bg-emerald-600 transition-all shadow-xl flex items-center gap-2 group">
            <Icon name="printer" size={18} className="group-hover:rotate-12 transition-transform" /> طباعة
          </button>
        </div>
      </div>

      <div className="rounded-[40px] shadow-3xl overflow-hidden border bg-white border-slate-200 no-print mx-4">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] text-center border-collapse">
            <thead className="bg-slate-900 text-white font-black">
              <tr>
                <th className="px-6 py-6 text-right">الموظف</th>
                <th className="px-6 py-6">الأساسي</th>
                <th className="px-6 py-6">بدلات (+)</th>
                <th className="px-6 py-6 text-emerald-400">إجمالي مستحق</th>
                <th className="px-6 py-6">غياب/تأخير</th>
                <th className="px-6 py-6">استقطاعات (-)</th>
                <th className="px-6 py-6 text-rose-400">إجمالي خصم</th>
                <th className="px-6 py-6 bg-emerald-800">الصافي النهائي</th>
                <th className="px-6 py-6">العمليات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.filter(e => e.name.includes(searchQuery)).map(emp => {
                const record = (payrollRecords[selectedMonth] && payrollRecords[selectedMonth][emp.id]) || {};
                const additions = calculateAdditions(record);
                const totalDeductions = calculateDeductions(record);
                const net = additions - totalDeductions;
                
                const attendanceDeductions = (record.lateVal || 0) + (record.earlyVal || 0) + (record.absentVal || 0);
                const otherDeductionsSum = (record.insuranceDeduction || 0) + (record.incomeTax || 0) + (record.loanDeduction || 0) + (record.otherDeductions || 0);

                return (
                  <tr key={emp.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-6 text-right">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400">{emp.name.charAt(0)}</div>
                        <div>
                          <p className="font-black text-slate-800">{emp.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">{emp.department} • {emp.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 font-bold">{Math.round(record.basicSalary || 0)}</td>
                    <td className="px-6 py-6 text-emerald-600 font-bold">
                      {(record.housingAllowance || 0) + (record.transportAllowance || 0) + (record.foodAllowance || 0) + (record.overtimePay || 0) + (record.performanceBonus || 0) + (record.otherAdditions || 0)}
                    </td>
                    <td className="px-6 py-6 text-emerald-700 font-black text-sm">{Math.round(additions)}</td>
                    <td className="px-6 py-6 text-rose-600 font-bold">{Math.round(attendanceDeductions)}</td>
                    <td className="px-6 py-6 text-rose-600 font-bold">{Math.round(otherDeductionsSum)}</td>
                    <td className="px-6 py-6 text-rose-700 font-black text-sm">{Math.round(totalDeductions)}</td>
                    <td className="px-6 py-6 bg-emerald-50/50 font-black text-lg text-emerald-800">{Math.round(net).toLocaleString()}</td>
                    <td className="px-6 py-6">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => setEditTarget({ emp, record })}
                          className="w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                        >
                          <Icon name="pencil" size={16} />
                        </button>
                        <button 
                          onClick={() => setPayslipTarget({ emp, record, net })}
                          className="w-10 h-10 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                        >
                          <Icon name="file-text" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Additions Modal */}
      <AnimatePresence>
        {editTarget && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-[200] flex items-center justify-center p-4 overflow-y-auto no-scrollbar">
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-4xl rounded-[50px] shadow-3xl overflow-hidden border border-white/20"
            >
              <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-5">
                   <div className="w-16 h-16 bg-slate-900 text-white rounded-[30px] flex items-center justify-center text-3xl font-black">{editTarget.emp.name.charAt(0)}</div>
                   <div>
                      <h3 className="text-2xl font-black text-slate-800">تعديل بنود الراتب • {editTarget.emp.name}</h3>
                      <p className="text-sm font-bold text-slate-400">إدارة المستحقات والبدلات والخصومات الشهرية</p>
                   </div>
                </div>
                <button onClick={() => setEditTarget(null)} className="w-12 h-12 flex items-center justify-center bg-white shadow-lg rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all">
                  <Icon name="x" size={24} />
                </button>
              </div>

              <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Additions Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b pb-4">
                    <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><Icon name="plus" size={16} /></div>
                    <h4 className="font-black text-slate-800 italic uppercase tracking-wider">الإستحقاقات والبدلات</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الراتب الأساسي</label>
                       <input type="number" value={editTarget.record.basicSalary || ''} onChange={e => updateField(editTarget.emp.id, 'basicSalary', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 font-black focus:border-emerald-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">بدل سكن</label>
                       <input type="number" value={editTarget.record.housingAllowance || ''} onChange={e => updateField(editTarget.emp.id, 'housingAllowance', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 font-black focus:border-emerald-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">بدل انتقالات</label>
                       <input type="number" value={editTarget.record.transportAllowance || ''} onChange={e => updateField(editTarget.emp.id, 'transportAllowance', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 font-black focus:border-emerald-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">بدل طعام</label>
                       <input type="number" value={editTarget.record.foodAllowance || ''} onChange={e => updateField(editTarget.emp.id, 'foodAllowance', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 font-black focus:border-emerald-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">مكافأة أداء</label>
                       <input type="number" value={editTarget.record.performanceBonus || ''} onChange={e => updateField(editTarget.emp.id, 'performanceBonus', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 font-black focus:border-emerald-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">أوفر تايم</label>
                       <input type="number" value={editTarget.record.overtimePay || ''} onChange={e => updateField(editTarget.emp.id, 'overtimePay', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 font-black focus:border-emerald-500 outline-none" />
                    </div>
                  </div>
                </div>

                {/* Deductions Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b pb-4">
                    <div className="w-8 h-8 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center"><Icon name="minus" size={16} /></div>
                    <h4 className="font-black text-slate-800 italic uppercase tracking-wider">الإستقطاعات والخصومات</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">تأمينات إجتماعية</label>
                       <input type="number" value={editTarget.record.insuranceDeduction || ''} onChange={e => updateField(editTarget.emp.id, 'insuranceDeduction', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 font-black focus:border-rose-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">كسب عمل (ضرائب)</label>
                       <input type="number" value={editTarget.record.incomeTax || ''} onChange={e => updateField(editTarget.emp.id, 'incomeTax', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 font-black focus:border-rose-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">أقساط قروض</label>
                       <input type="number" value={editTarget.record.loanDeduction || ''} onChange={e => updateField(editTarget.emp.id, 'loanDeduction', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 font-black focus:border-rose-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">خصومات أخرى</label>
                       <input type="number" value={editTarget.record.otherDeductions || ''} onChange={e => updateField(editTarget.emp.id, 'otherDeductions', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 font-black focus:border-rose-500 outline-none" />
                    </div>
                    <div className="space-y-2 col-span-2">
                       <div className="p-5 bg-rose-50 rounded-[25px] border border-rose-100 flex items-center justify-between">
                          <div>
                             <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest italic">استقطاع الغياب والتأثير التلقائي</p>
                             <p className="font-black text-rose-800 text-sm">{(editTarget.record.lateVal || 0) + (editTarget.record.earlyVal || 0) + (editTarget.record.absentVal || 0)} ج.م</p>
                          </div>
                          <Icon name="clock-alert" size={24} className="text-rose-500" />
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-10 bg-slate-900 flex items-center justify-between">
                 <div className="flex gap-10">
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">إجمالي المستحق</p>
                       <p className="text-2xl font-black text-emerald-400">{(calculateAdditions(editTarget.record)).toLocaleString()} ج.م</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">إجمالي المستقطع</p>
                       <p className="text-2xl font-black text-rose-400">{(calculateDeductions(editTarget.record)).toLocaleString()} ج.م</p>
                    </div>
                    <div className="h-full w-px bg-white/10"></div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">صافي الراتب</p>
                       <p className="text-3xl font-black text-white">{(calculateNet(editTarget.record)).toLocaleString()} ج.م</p>
                    </div>
                 </div>
                 <button onClick={() => setEditTarget(null)} className="bg-white text-slate-900 px-12 py-5 rounded-[25px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">حفظ واعتماد</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payslip Modal - Professional Print Style */}
      <AnimatePresence>
        {payslipTarget && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl z-[300] flex items-center justify-center p-4 overflow-y-auto print:bg-white print:p-0">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-[800px] rounded-[50px] shadow-3xl p-16 relative overflow-hidden print:shadow-none print:rounded-none"
              id="payslip-to-print"
            >
              <button onClick={() => setPayslipTarget(null)} className="absolute top-10 left-10 p-3 hover:bg-rose-50 text-slate-400 rounded-2xl no-print"><Icon name="x" size={28} /></button>
              
              <div className="flex justify-between items-start border-b-8 border-slate-900 pb-12 mb-12">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-4 bg-slate-900 text-white p-4 rounded-[20px]">
                    <Icon name="shield-check" size={32} />
                    <span className="text-2xl font-black tracking-tighter">HR WORLD</span>
                  </div>
                  <h1 className="text-5xl font-black tracking-tighter uppercase italic">Payslip <br/><span className="text-slate-400 text-lg uppercase tracking-[0.3em] font-black italic">Employee Copy</span></h1>
                </div>
                <div className="text-left space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Salary Period</p>
                  <p className="text-4xl font-black text-slate-900 font-mono italic">{selectedMonth}</p>
                  <p className="text-sm font-bold text-slate-500">تاريخ الإصدار: {new Date().toLocaleDateString('ar-EG')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-16 mb-16 px-4">
                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Employee Details</p>
                    <h2 className="text-3xl font-black text-slate-900">{payslipTarget.emp.name}</h2>
                    <p className="text-slate-500 font-bold">{payslipTarget.emp.position} • {payslipTarget.emp.department}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Employee ID</p>
                        <p className="text-xl font-black font-mono">#{payslipTarget.emp.code}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Bank Account</p>
                        <p className="text-xl font-black font-mono">**** 5932</p>
                     </div>
                  </div>
                </div>
                <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 shadow-inner flex flex-col justify-center items-center text-center">
                   <div className="w-16 h-16 bg-white shadow-xl rounded-[25px] flex items-center justify-center text-emerald-600 mb-4 transform -rotate-6">
                      <Icon name="banknote" size={32} />
                   </div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Net Salary Payable</p>
                   <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black tracking-tighter">{(payslipTarget.net).toLocaleString()}</span>
                      <span className="text-sm font-black text-slate-500 uppercase">EGP</span>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-16 mb-16 px-4">
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase border-b-2 border-emerald-500/20 pb-3 italic tracking-[0.2em]">Earnings (+)</h4>
                   <div className="space-y-4 font-bold text-slate-700 text-sm">
                      <div className="flex justify-between"><span>الراتب الأساسي</span><span>{Math.round(payslipTarget.record.basicSalary || 0)}</span></div>
                      <div className="flex justify-between text-slate-400"><span>بدل سكن</span><span>{Math.round(payslipTarget.record.housingAllowance || 0)}</span></div>
                      <div className="flex justify-between text-slate-400"><span>بدل انتقالات</span><span>{Math.round(payslipTarget.record.transportAllowance || 0)}</span></div>
                      <div className="flex justify-between text-slate-400"><span>بدل طعام</span><span>{Math.round(payslipTarget.record.foodAllowance || 0)}</span></div>
                      <div className="flex justify-between text-emerald-600"><span>مكافآت وأوفرتايم</span><span>{Math.round((payslipTarget.record.performanceBonus || 0) + (payslipTarget.record.overtimePay || 0) + (payslipTarget.record.otherAdditions || 0))}</span></div>
                      <div className="h-px bg-slate-100 my-2"></div>
                      <div className="flex justify-between text-slate-900 font-black"><span>إجمالي المستحق</span><span>{Math.round(calculateAdditions(payslipTarget.record))}</span></div>
                   </div>
                </div>
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase border-b-2 border-rose-500/20 pb-3 italic tracking-[0.2em]">Deductions (-)</h4>
                   <div className="space-y-4 font-bold text-slate-700 text-sm">
                      <div className="flex justify-between text-rose-500"><span>غياب وتأخير</span><span>{Math.round((payslipTarget.record.lateVal || 0) + (payslipTarget.record.earlyVal || 0) + (payslipTarget.record.absentVal || 0))}</span></div>
                      <div className="flex justify-between"><span>تأمينات اجتماعية</span><span>{Math.round(payslipTarget.record.insuranceDeduction || 0)}</span></div>
                      <div className="flex justify-between"><span>ضريبة كسب العمل</span><span>{Math.round(payslipTarget.record.incomeTax || 0)}</span></div>
                      <div className="flex justify-between text-rose-400"><span>أقساط قروض</span><span>{Math.round(payslipTarget.record.loanDeduction || 0)}</span></div>
                      <div className="flex justify-between text-rose-400"><span>خصومات أخرى</span><span>{Math.round(payslipTarget.record.otherDeductions || 0)}</span></div>
                      <div className="h-px bg-slate-100 my-2"></div>
                      <div className="flex justify-between text-slate-900 font-black"><span>إجمالي الخصم</span><span>{Math.round(calculateDeductions(payslipTarget.record))}</span></div>
                   </div>
                </div>
              </div>

              <div className="mt-20 flex justify-between px-4 pb-10">
                 <div className="space-y-12">
                    <div className="space-y-2">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Management Authorized Seal</p>
                       <div className="w-32 h-32 border-4 border-slate-100 rounded-[40px] flex items-center justify-center opacity-30 rotate-12">
                          <Icon name="shield-check" size={64} />
                       </div>
                    </div>
                 </div>
                 <div className="text-left space-y-12">
                    <div className="space-y-1">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Employee Signature</p>
                       <div className="w-64 h-px bg-slate-200 mt-10"></div>
                       <p className="text-[10px] font-bold text-slate-300">By signing, you acknowledge receipt of payment.</p>
                    </div>
                 </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-4 bg-slate-900 no-print"></div>

              <div className="mt-10 flex justify-center no-print">
                 <button onClick={printPayslip} className="bg-slate-900 text-white px-12 py-5 rounded-[25px] font-black shadow-2xl hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 uppercase tracking-[0.2em]">
                    <Icon name="printer" size={24} /> Print Advice
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
