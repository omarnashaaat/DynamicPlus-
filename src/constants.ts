export const INITIAL_EMPLOYEES = [
    { id: '101', name: 'أحمد محمد علي', role: 'مدير الموارد البشرية', department: 'الموارد البشرية', phone: '01012345678', email: 'ahmed@example.com', joinDate: '2023-01-15', status: 'active', salary: 15000, insurance: 'yes', shift: 'الوردية الأولى (9ص - 5م)' },
    { id: '102', name: 'سارة محمود حسن', role: 'محاسب أول', department: 'المالية', phone: '01122334455', email: 'sara@example.com', joinDate: '2023-02-01', status: 'active', salary: 12000, insurance: 'yes', shift: 'الوردية الأولى (9ص - 5م)' },
    { id: '103', name: 'محمد خالد إبراهيم', role: 'مطور برمجيات', department: 'تكنولوجيا المعلومات', phone: '01233445566', email: 'mohamed@example.com', joinDate: '2023-03-10', status: 'active', salary: 18000, insurance: 'no', shift: 'الوردية الثانية (8:30ص - 5:30م)' },
    { id: '104', name: 'ليلى عبد العزيز', role: 'مصمم جرافيك', department: 'التسويق', phone: '01544556677', email: 'layla@example.com', joinDate: '2023-04-20', status: 'active', salary: 10000, insurance: 'yes', shift: 'الوردية الأولى (9ص - 5م)' }
];

export const INITIAL_SHIFTS = {
    '1': { id: '1', name: 'الوردية الأولى (9ص - 5م)', start: '09:00', end: '17:00' },
    '2': { id: '2', name: 'الوردية الثانية (8:30ص - 5:30م)', start: '08:30', end: '17:30' },
    '3': { id: '3', name: 'الوردية الثالثة (9:30ص - 5:30م)', start: '09:30', end: '17:30' },
    '4': { id: '4', name: 'وردية رمضان (9ص - 3م)', start: '09:00', end: '15:00' }
};

export const INITIAL_REGULATIONS = {
    late: [
        { id: 1, title: 'تأخير حتى 15 دقيقة', deduction: 0, type: 'late' },
        { id: 2, title: 'تأخير من 16 إلى 30 دقيقة', deduction: 0.25, type: 'late' },
        { id: 3, title: 'تأخير من 31 إلى 60 دقيقة', deduction: 0.5, type: 'late' },
        { id: 4, title: 'تأخير أكثر من ساعة', deduction: 1, type: 'late' }
    ],
    absence: [
        { id: 5, title: 'غياب بدون إذن مسبق', deduction: 2, type: 'absence' },
        { id: 6, title: 'غياب بإذن مسبق', deduction: 1, type: 'absence' }
    ]
};
