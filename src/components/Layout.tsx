import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LogOut,
  LayoutGrid,
  Calendar,
  X,
  Printer,
  FileText,
  Plus,
  Edit3,
  Trash2,
  Check,
  PlusSquare,
  PlusCircle,
  RotateCcw,
  Info,
  AlertCircle,
  Clock,
  Banknote,
  Users,
  CalendarDays,
  FolderArchive,
  ShieldCheck,
  Settings as SettingsIcon,
  ArrowLeft,
  UserCircle2,
  Download,
  Upload,
  Save,
  Search,
  Briefcase,
  Home,
  ChevronRight,
  ShieldX,
  CalendarRange,
  FolderOpen,
  BarChart,
  TrendingUp,
  Star,
  GraduationCap,
  UserMinus,
  Sparkles,
  CheckCircle,
  Folder
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Map Lucide icons to names used in the provided code
const iconMap: Record<string, any> = {
  'layout-grid': LayoutGrid,
  'calendar': Calendar,
  'log-out': LogOut,
  'x': X,
  'printer': Printer,
  'file-text': FileText,
  'plus': Plus,
  'edit-3': Edit3,
  'trash-2': Trash2,
  'check': Check,
  'plus-square': PlusSquare,
  'plus-circle': PlusCircle,
  'rotate-ccw': RotateCcw,
  'info': Info,
  'alert-circle': AlertCircle,
  'clock': Clock,
  'banknote': Banknote,
  'users': Users,
  'calendar-days': CalendarDays,
  'folder-archive': FolderArchive,
  'shield-check': ShieldCheck,
  'settings': SettingsIcon,
  'arrow-left': ArrowLeft,
  'user-circle-2': UserCircle2,
  'download': Download,
  'upload': Upload,
  'save': Save,
  'search': Search,
  'briefcase': Briefcase,
  'home': Home,
  'chevron-right': ChevronRight,
  'shield-x': ShieldX,
  'calendar-range': CalendarRange,
  'folder-open': FolderOpen,
  'edit': Edit3,
  'bar-chart': BarChart,
  'trending-up': TrendingUp,
  'star': Star,
  'graduation-cap': GraduationCap,
  'user-minus': UserMinus,
  'sparkles': Sparkles,
  'check-circle': CheckCircle,
  'folder': Folder,
  'history': RotateCcw,
  'database': Save
};

export const Icon = ({ name, size = 24, className = "" }: { name: string, size?: number, className?: string }) => {
  const LucideIcon = iconMap[name] || AlertCircle;
  return <LucideIcon size={size} className={className} />;
};

export const TopNav = ({ onLogout, activeTab, setActiveTab, formattedDate, formattedTime }: { 
  onLogout?: () => void, 
  activeTab: string, 
  setActiveTab: (tab: string) => void,
  formattedDate: string,
  formattedTime: string
}) => {
  const navItems = [
    {id: 'dashboard', label: 'الرئيسية'},
    {id: 'employees', label: 'الموظفين'},
    {id: 'attendance', label: 'الحضور'},
    {id: 'attendance_policy', label: 'اللائحة'},
    {id: 'monthly_report', label: 'التقرير'},
    {id: 'payroll', label: 'المرتبات'},
    {id: 'annual_calendar', label: 'التقويم'},
    {id: 'leaves', label: 'الإجازات'},
    {id: 'archive', label: 'الأرشيف'},
    {id: 'insurance', label: 'التأمينات'},
    {id: 'contracts', label: 'العقود'},
    {id: 'recruitment', label: 'التوظيف'},
    {id: 'ats', label: 'ATS'},
    {id: 'kpis', label: 'KPIs'},
    {id: 'evaluation', label: 'التقييم'},
    {id: 'digital_archive', label: 'الرقمي'},
    {id: 'training', label: 'التدريب'},
    {id: 'resignations', label: 'الاستقالات'},
    {id: 'settings', label: 'الإعدادات'}
  ];

  return (
    <header className="glass-card rounded-2xl md:rounded-[35px] py-3 md:py-4 px-4 md:px-10 flex items-center justify-between mb-6 md:mb-10 no-print sticky top-4 z-50">
      <div className="flex items-center gap-2 md:gap-4 cursor-pointer shrink-0" onClick={() => setActiveTab('dashboard')}>
        <div className="p-2 md:p-3 rounded-xl md:rounded-2xl shadow-xl bg-slate-900 text-white transition-transform hover:scale-110">
          <Icon name="layout-grid" size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-lg md:text-2xl font-black tracking-tighter hidden xs:block text-slate-800 leading-none">المنسق HR</span>
        </div>
      </div>
      
      <div className="flex-1 flex justify-center items-center gap-2 md:gap-6 px-2 overflow-x-auto scroll-hidden">
        <nav className="flex items-center gap-1">
          {navItems.map((l) => (
            <button 
              key={l.id} 
              onClick={() => setActiveTab(l.id)} 
              className={cn(
                "px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl font-bold text-[10px] md:text-xs transition-all whitespace-nowrap",
                activeTab === l.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              )}
            >
              {l.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <div className="hidden lg:flex items-center gap-3 bg-slate-50/80 px-3 py-1.5 rounded-xl border border-slate-100 shadow-inner group hover:bg-white transition-all">
          <div className="flex flex-col text-right leading-tight">
            <span className="text-[11px] font-bold text-slate-700">{formattedDate}</span>
            <span className="text-[10px] font-black text-indigo-600 font-mono">{formattedTime}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform">
            <Icon name="calendar" size={16} />
          </div>
        </div>
        <button onClick={onLogout} className="text-rose-500 hover:bg-rose-50 p-2 md:p-3 rounded-xl md:rounded-2xl transition-all hover:scale-110 active:scale-95" title="خروج">
          <Icon name="log-out" size={20} />
        </button>
      </div>
    </header>
  );
};

export const Card = ({ children, className, title, subtitle, action, key }: { children: React.ReactNode, className?: string, title?: string, subtitle?: string, action?: React.ReactNode, key?: React.Key }) => (
  <div key={key} className={cn("bg-white rounded-[40px] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgba(79,70,229,0.08)] group", className)}>
    {(title || action) && (
      <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-gradient-to-l from-slate-50/50 to-transparent">
        <div>
          {title && <h3 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">{title}</h3>}
          {subtitle && <p className="text-xs font-bold text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className="transition-transform group-hover:scale-105">
          {action}
        </div>
      </div>
    )}
    <div className="p-10">
      {children}
    </div>
  </div>
);

export const Button = ({ children, variant = 'primary', className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }) => {
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
    danger: "bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-100",
    ghost: "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
  };

  return (
    <button 
      className={cn(
        "px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
