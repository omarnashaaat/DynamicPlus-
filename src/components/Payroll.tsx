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
        return acc;
      }, { late: 0, early: 0 });

      if (!updatedRecords[selectedMonth]) updatedRecords[selectedMonth] = {};
      if (!updatedRecords[selectedMonth][emp.id]) {
        updatedRecords[selectedMonth][emp.id] = {
          basicSalary: emp.salary || 0,
          grossSalary: emp.salary || 0,
          insuranceDeduction: 0,
          lateCount: totals.late,
          earlyCount: totals.early,
          lateVal: totals.late * ((emp.salary || 0) / 30 / 8),
          earlyVal: totals.early * ((emp.salary || 0) / 30 / 8),
          settlements: []
        };
        changed = true;
      } else if (updatedRecords[selectedMonth][emp.id].lateCount !== totals.late) {
        updatedRecords[selectedMonth][emp.id].lateCount = totals.late;
        updatedRecords[selectedMonth][emp.id].lateVal = totals.late * (updatedRecords[selectedMonth][emp.id].basicSalary / 30 / 8);
        changed = true;
      }
    });

    if (changed) setPayrollRecords(updatedRecords);
  }, [selectedMonth, employees, attendanceLog]);

  const updateField = (empId: string, field: string, value: any) => {
    const monthRecords = payrollRecords[selectedMonth] || {};
    const current = monthRecords[empId] || { basicSalary: 0, settlements: [] };
    const updated = { ...current, [field]: parseFloat(value) || 0 };
    
    if (field === 'basicSalary') {
      updated.lateVal = (updated.lateCount || 0) * (updated.basicSalary / 30 / 8);
      updated.earlyVal = (updated.earlyCount || 0) * (updated.basicSalary / 30 / 8);
    }

    setPayrollRecords((prev: any) => ({
      ...prev,
      [selectedMonth]: { ...monthRecords, [empId]: updated }
    }));
  };

  const calculateNet = (record: any) => {
    const r = record || {};
    const additions = (r.basicSalary || 0) + (r.adjAddition || 0);
    const deductions = (r.lateVal || 0) + (r.earlyVal || 0) + (r.insuranceDeduction || 0) + (r.adjDeduction || 0) + (r.incomeTax || 0);
    return additions - deductions;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
          <Icon name="banknote" className="text-emerald-600" size={32} /> كشف الرواتب الشهري
        </h2>
        <div className="flex items-center gap-4">
          <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="bg-white border p-3 rounded-2xl font-bold shadow-sm" />
          <div className="relative">
            <Icon name="search" size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="بحث..." className="bg-white border rounded-2xl py-3 pr-10 pl-4 text-sm font-bold outline-none" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <button onClick={() => window.print()} className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-lg flex items-center gap-2">
            <Icon name="printer" size={18} /> طباعة القائمة
          </button>
        </div>
      </div>

      <div className="rounded-[30px] shadow-2xl overflow-hidden border bg-white border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] text-center border-collapse">
            <thead className="bg-slate-800 text-white font-black">
              <tr>
                <th className="px-4 py-4">الموظف</th>
                <th className="px-4 py-4">الراتب الأساسي</th>
                <th className="px-4 py-4">تأخير (س)</th>
                <th className="px-4 py-4">خصم تأخير</th>
                <th className="px-4 py-4">تأمينات</th>
                <th className="px-4 py-4">ضريبة العمل</th>
                <th className="px-4 py-4">تسويات (+)</th>
                <th className="px-4 py-4">تسويات (-)</th>
                <th className="px-4 py-4 bg-emerald-700">صافي الراتب</th>
                <th className="px-4 py-4">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {employees.filter(e => e.name.includes(searchQuery)).map(emp => {
                const record = (payrollRecords[selectedMonth] && payrollRecords[selectedMonth][emp.id]) || {};
                const net = calculateNet(record);
                return (
                  <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4 text-right font-black">
                      <p>{emp.name}</p>
                      <p className="text-[9px] text-slate-400">كود: {emp.code}</p>
                    </td>
                    <td className="px-4 py-4"><input type="number" value={record.basicSalary || ''} onChange={e => updateField(emp.id, 'basicSalary', e.target.value)} className="w-20 text-center bg-transparent font-bold" /></td>
                    <td className="px-4 py-4 font-bold">{record.lateCount || 0}</td>
                    <td className="px-4 py-4 text-rose-600 font-bold">{Math.round(record.lateVal || 0)}</td>
                    <td className="px-4 py-4"><input type="number" value={record.insuranceDeduction || ''} onChange={e => updateField(emp.id, 'insuranceDeduction', e.target.value)} className="w-16 text-center bg-transparent" /></td>
                    <td className="px-4 py-4"><input type="number" value={record.incomeTax || ''} onChange={e => updateField(emp.id, 'incomeTax', e.target.value)} className="w-16 text-center bg-transparent text-rose-600" /></td>
                    <td className="px-4 py-4"><input type="number" value={record.adjAddition || ''} onChange={e => updateField(emp.id, 'adjAddition', e.target.value)} className="w-16 text-center bg-transparent text-emerald-600 font-bold" /></td>
                    <td className="px-4 py-4"><input type="number" value={record.adjDeduction || ''} onChange={e => updateField(emp.id, 'adjDeduction', e.target.value)} className="w-16 text-center bg-transparent text-rose-600 font-bold" /></td>
                    <td className="px-4 py-4 bg-emerald-50 font-black text-emerald-700 text-sm">{Math.round(net)}</td>
                    <td className="px-4 py-4">
                      <button onClick={() => setPayslipTarget({ emp, record, net })} className="p-2 bg-slate-100 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"><Icon name="file-text" size={16} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payslip Modal */}
      <AnimatePresence>
        {payslipTarget && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl p-12 relative overflow-hidden"
            >
              <button onClick={() => setPayslipTarget(null)} className="absolute top-8 left-8 p-2 hover:bg-rose-50 text-slate-400 rounded-xl"><Icon name="x" size={24} /></button>
              <div className="text-center border-b-4 border-slate-900 pb-8 mb-8">
                <h1 className="text-3xl font-black">إشعار صرف راتب</h1>
                <p className="text-slate-500 font-bold mt-1">Payroll Advice Notice - {selectedMonth}</p>
              </div>
              <div className="grid grid-cols-2 gap-8 mb-12">
                <div className="space-y-2">
                  <p className="text-slate-400 text-[10px] font-black uppercase">اسم الموظف</p>
                  <p className="text-xl font-black">{payslipTarget.emp.name}</p>
                </div>
                <div className="space-y-2 text-left">
                  <p className="text-slate-400 text-[10px] font-black uppercase">الكود الوظيفي</p>
                  <p className="text-xl font-black font-mono">{payslipTarget.emp.code}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8 mb-12">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase border-b pb-2">الاستحقاقات (Additions)</h4>
                  <div className="flex justify-between text-sm font-bold">
                    <span>الراتب الأساسي</span>
                    <span className="text-slate-800">{Math.round(payslipTarget.record.basicSalary || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span>إضافات / تسويات</span>
                    <span className="text-emerald-600">+{Math.round(payslipTarget.record.adjAddition || 0)}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase border-b pb-2">الاستقطاعات (Deductions)</h4>
                  <div className="flex justify-between text-sm font-bold">
                    <span>تأخير / انصراف مبكر</span>
                    <span className="text-rose-600">-{Math.round((payslipTarget.record.lateVal || 0) + (payslipTarget.record.earlyVal || 0))}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span>تأمينات اجتماعية</span>
                    <span className="text-rose-600">-{Math.round(payslipTarget.record.insuranceDeduction || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span>ضريبة كسب العمل</span>
                    <span className="text-rose-600">-{Math.round(payslipTarget.record.incomeTax || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span>خصومات أخرى</span>
                    <span className="text-rose-600">-{Math.round(payslipTarget.record.adjDeduction || 0)}</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900 text-white p-10 rounded-3xl flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold opacity-60 uppercase tracking-widest">صافي الراتب المستحق</p>
                  <p className="text-sm">Net Salary Payable</p>
                </div>
                <div className="text-right">
                  <span className="text-5xl font-black">{Math.round(payslipTarget.net)}</span>
                  <span className="text-xl font-bold mr-2">ج.م</span>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between text-slate-400 font-bold text-xs">
                <p>توقيع الموظف: ............................</p>
                <p>تاريخ الصرف: {new Date().toLocaleDateString('ar-EG')}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
