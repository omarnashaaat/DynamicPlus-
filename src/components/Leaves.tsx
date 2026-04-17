import React, { useState, useEffect } from 'react';
import { Icon } from './ui/Icon';

interface LeavesProps {
  employees: any[];
  setEmployees: React.Dispatch<React.SetStateAction<any[]>>;
  showToast: (msg: string, type?: any) => void;
}

export default function Leaves({ employees, setEmployees, showToast }: LeavesProps) {
  const [viewMode, setViewMode] = useState<'balances' | 'requests'>('balances');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');
  
  const [leaveRequests, setLeaveRequests] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('hr_leave_requests') || '[]');
    } catch {
      return [];
    }
  });

  const [newRequest, setNewRequest] = useState({ empId: '', startDate: '', endDate: '', type: 'إعتيادي', notes: '' });
  const [showRequestModal, setShowRequestModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('hr_leave_requests', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

  const startEditing = (emp: any) => {
    setEditingId(emp.id);
    setEditData({ ...emp });
  };

  const saveEdit = () => {
    setEmployees(employees.map(e => e.id === editingId ? editData : e));
    setEditingId(null);
    showToast('تم تحديث رصيد الإجازات');
  };

  const submitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequest.empId || !newRequest.startDate || !newRequest.endDate) return showToast('أكمل البيانات المطلوبة', 'error');
    
    setLeaveRequests([{ ...newRequest, id: Date.now().toString(), status: 'مقبول' }, ...leaveRequests]);
    setShowRequestModal(false);
    setNewRequest({ empId: '', startDate: '', endDate: '', type: 'إعتيادي', notes: '' });
    showToast('تم تسجيل الإجازة بنجاح');
  };

  const deleteRequest = (id: string) => {
    setLeaveRequests(leaveRequests.filter(r => r.id !== id));
    showToast('تم حذف الإجازة');
  };

  const calculateTotalConsumed = (monthlyLeaves: any[]) => (monthlyLeaves || []).reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <div>
          <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <Icon name="calendar-days" className="text-pink-600" size={32} /> سجل غيابات الموظفين السنوي
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">إدارة الرصيد واستهلاك الأيام</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
            <button onClick={() => setViewMode('balances')} className={`px-4 py-2 font-black text-xs rounded-lg transition-all ${viewMode === 'balances' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>رصيد الإجازات</button>
            <button onClick={() => setViewMode('requests')} className={`px-4 py-2 font-black text-xs rounded-lg transition-all ${viewMode === 'requests' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>سجل الإجازات بالتاريخ</button>
          </div>
          <div className="relative">
            <Icon name="search" size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="بحث..." 
              className="bg-white border rounded-2xl py-2 pr-10 pl-4 text-xs font-bold outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {viewMode === 'balances' && editingId && (
            <button onClick={saveEdit} className="bg-slate-900 text-white px-6 py-2 rounded-xl font-black text-xs hover:bg-pink-600 transition-all flex items-center gap-2">
              <Icon name="save" size={14} /> حفظ
            </button>
          )}
          {viewMode === 'requests' && (
            <button onClick={() => setShowRequestModal(true)} className="bg-pink-600 text-white px-6 py-2 rounded-xl font-black text-xs hover:bg-pink-700 transition-all flex items-center gap-2">
              <Icon name="plus" size={14} /> إضافة إجازة
            </button>
          )}
          <button onClick={() => window.print()} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-black text-xs hover:bg-indigo-700 transition-all flex items-center gap-2">
            <Icon name="printer" size={14} /> طباعة
          </button>
        </div>
      </div>

      {viewMode === 'balances' ? (
      <div className="rounded-[40px] shadow-2xl overflow-hidden border bg-white border-slate-100 print:shadow-none print:border-none print:rounded-none">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse text-[11px]">
            <thead className="bg-slate-50 text-slate-500 font-black uppercase border-b">
              <tr>
                <th className="px-4 py-6 text-right sticky right-0 bg-slate-50 z-10">الموظف</th>
                <th className="px-2 py-6">الرصيد</th>
                {months.map((m, i) => (
                  <th key={i} className="px-1 py-6">{m}</th>
                ))}
                <th className="px-2 py-6 bg-slate-100">المتبقي</th>
                <th className="px-4 py-6 no-print">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.filter(e => e.name.includes(searchQuery)).map(emp => {
                const isEditing = editingId === emp.id;
                const data = isEditing ? editData : emp;
                const consumed = calculateTotalConsumed(data.monthlyLeaves);
                const remaining = (parseFloat(data.totalLeaves) || 0) - consumed;

                return (
                  <tr key={emp.id} className={`${isEditing ? 'bg-pink-50/30' : 'hover:bg-slate-50/50'}`}>
                    <td className="px-4 py-4 font-black text-right sticky right-0 bg-inherit z-10">
                      <p className="text-slate-800">{emp.name}</p>
                      <p className="text-[9px] text-slate-400 font-mono">{emp.code}</p>
                    </td>
                    <td className="px-2 py-4">
                      {isEditing ? (
                        <input type="number" className="w-12 text-center border rounded" value={data.totalLeaves} onChange={e => setEditData({...editData, totalLeaves: e.target.value})} />
                      ) : emp.totalLeaves}
                    </td>
                    {(data.monthlyLeaves || Array(12).fill(0)).map((val: any, idx: number) => (
                      <td key={idx} className={`px-1 py-4 ${val > 0 ? 'bg-pink-50' : ''}`}>
                        {isEditing ? (
                          <input 
                            type="number" 
                            step="0.5"
                            className="w-10 text-center bg-transparent border-b border-pink-200" 
                            value={val || ''} 
                            onChange={e => {
                              const newMonthly = [...data.monthlyLeaves];
                              newMonthly[idx] = parseFloat(e.target.value) || 0;
                              setEditData({...editData, monthlyLeaves: newMonthly});
                            }} 
                          />
                        ) : (val || '-')}
                      </td>
                    ))}
                    <td className={`px-2 py-4 font-black bg-slate-50 ${remaining < 3 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {remaining}
                    </td>
                    <td className="px-4 py-4 no-print">
                      {!isEditing && (
                        <button onClick={() => startEditing(emp)} className="p-2 text-slate-400 hover:text-pink-600 transition-all"><Icon name="edit-3" size={16} /></button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      ) : (
      <div className="rounded-[40px] shadow-2xl overflow-hidden border bg-white border-slate-100 print:shadow-none print:border-none print:rounded-none">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-sm">
            <thead className="bg-slate-50 text-slate-500 font-black uppercase border-b">
              <tr>
                <th className="px-6 py-5">الموظف</th>
                <th className="px-6 py-5">من تاريخ</th>
                <th className="px-6 py-5">إلى تاريخ</th>
                <th className="px-6 py-5">نوع الإجازة</th>
                <th className="px-6 py-5">ملاحظات</th>
                <th className="px-6 py-5 text-center no-print">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaveRequests.filter(req => {
                const emp = employees.find(e => e.id === req.empId);
                return emp?.name.includes(searchQuery) || false;
              }).map(req => {
                const emp = employees.find(e => e.id === req.empId);
                return (
                  <tr key={req.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-black text-slate-800">{emp?.name || '---'}</td>
                    <td className="px-6 py-4 font-mono">{req.startDate}</td>
                    <td className="px-6 py-4 font-mono">{req.endDate}</td>
                    <td className="px-6 py-4"><span className="bg-pink-50 text-pink-600 px-3 py-1 rounded-lg text-xs font-black">{req.type}</span></td>
                    <td className="px-6 py-4">{req.notes || '---'}</td>
                    <td className="px-6 py-4 text-center no-print">
                      <button onClick={() => deleteRequest(req.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-all"><Icon name="trash-2" size={16} /></button>
                    </td>
                  </tr>
                );
              })}
              {leaveRequests.length === 0 && (
                <tr><td colSpan={6} className="text-center py-10 font-bold text-slate-400">لا يوجد سجل إجازات مسجل حالياً.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {showRequestModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] shadow-2xl p-8 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-black text-slate-800">إضافة إجازة</h3>
              <button onClick={() => setShowRequestModal(false)} className="text-slate-400 hover:text-rose-500"><Icon name="x" size={24} /></button>
            </div>
            <form onSubmit={submitRequest} className="space-y-6">
              <div>
                <label className="block text-sm font-black text-slate-700 mb-2">الموظف</label>
                <select value={newRequest.empId} onChange={e => setNewRequest({...newRequest, empId: e.target.value})} className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-pink-500 font-bold" required>
                  <option value="">اختر الموظف...</option>
                  {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2">من تاريخ</label>
                  <input type="date" value={newRequest.startDate} onChange={e => setNewRequest({...newRequest, startDate: e.target.value})} className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-pink-500 font-bold font-mono" required />
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2">إلى تاريخ</label>
                  <input type="date" value={newRequest.endDate} onChange={e => setNewRequest({...newRequest, endDate: e.target.value})} className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-pink-500 font-bold font-mono" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2">نوع الإجازة</label>
                  <select value={newRequest.type} onChange={e => setNewRequest({...newRequest, type: e.target.value})} className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-pink-500 font-bold">
                    <option value="إعتيادي">إعتيادي</option>
                    <option value="عارضة">عارضة</option>
                    <option value="مرضي">مرضي</option>
                    <option value="بدون أجر">بدون أجر</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2">ملاحظات</label>
                  <input type="text" value={newRequest.notes} onChange={e => setNewRequest({...newRequest, notes: e.target.value})} className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-pink-500 font-bold" placeholder="سبب الإجازة..." />
                </div>
              </div>
              <div className="pt-4 flex gap-4">
                <button type="submit" className="flex-1 bg-pink-600 text-white py-3 rounded-xl font-black hover:bg-pink-700 transition">تسجيل الإجازة</button>
                <button type="button" onClick={() => setShowRequestModal(false)} className="px-6 border border-slate-200 bg-slate-50 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-100 transition">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
