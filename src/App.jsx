import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  CalendarCheck,
  CreditCard,
  GraduationCap,
  BookOpen,
  ClipboardList,
  Clock,
  FileText,
  Wallet,
  HeartHandshake,
  Briefcase,
  BarChart3,
  Settings,
  Search,
  Download,
  Plus,
  X,
  ChevronRight,
  Menu,
  ArrowUpRight,
  SlidersHorizontal,
  Eye,
  Trash2,
  Printer,
  RotateCcw
} from 'lucide-react';
import {
  INITIAL_STUDENTS,
  INITIAL_INVOICES,
  INITIAL_TEACHERS,
  INITIAL_CLASSES,
  INITIAL_EXAMS,
  INITIAL_TIMETABLE,
  INITIAL_HOMEWORK,
  INITIAL_EXPENSES,
  INITIAL_PAYROLL
} from './data/schoolData';

const STORAGE_KEYS = {
  STUDENTS: 'toptech_sms_students_v1',
  INVOICES: 'toptech_sms_invoices_v1',
  ATTENDANCE: 'toptech_sms_attendance_v1',
  HOMEWORK: 'toptech_sms_homework_v1',
  EXPENSES: 'toptech_sms_expenses_v1',
  SETTINGS: 'toptech_sms_settings_v1'
};

const NAV_GROUPS = [
  {
    heading: 'Core Workspace',
    headingColor: 'text-indigo-600',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-indigo-600 bg-indigo-50', activeBg: 'from-indigo-600 to-blue-600' },
      { id: 'students', label: 'Students', icon: Users, color: 'text-violet-600 bg-violet-50', activeBg: 'from-violet-600 to-purple-600' },
      { id: 'add-student', label: 'Enroll Student', icon: UserPlus, color: 'text-blue-600 bg-blue-50', activeBg: 'from-blue-600 to-cyan-600' },
      { id: 'attendance', label: 'Attendance', icon: CalendarCheck, color: 'text-emerald-600 bg-emerald-50', activeBg: 'from-emerald-600 to-teal-600' },
      { id: 'fees', label: 'Fees & Invoices', icon: CreditCard, color: 'text-amber-600 bg-amber-50', activeBg: 'from-amber-500 to-orange-600' }
    ]
  },
  {
    heading: 'Academics',
    headingColor: 'text-purple-600',
    items: [
      { id: 'teachers', label: 'Teachers', icon: GraduationCap, color: 'text-fuchsia-600 bg-fuchsia-50', activeBg: 'from-fuchsia-600 to-pink-600' },
      { id: 'classes', label: 'Classes & Rooms', icon: BookOpen, color: 'text-cyan-600 bg-cyan-50', activeBg: 'from-cyan-600 to-sky-600' },
      { id: 'examinations', label: 'Examinations', icon: ClipboardList, color: 'text-rose-600 bg-rose-50', activeBg: 'from-rose-600 to-pink-600' },
      { id: 'timetable', label: 'Timetable', icon: Clock, color: 'text-sky-600 bg-sky-50', activeBg: 'from-sky-600 to-indigo-600' },
      { id: 'homework', label: 'Homework', icon: FileText, color: 'text-orange-600 bg-orange-50', activeBg: 'from-orange-500 to-rose-500' }
    ]
  },
  {
    heading: 'Administration',
    headingColor: 'text-teal-600',
    items: [
      { id: 'parents', label: 'Guardians', icon: HeartHandshake, color: 'text-pink-600 bg-pink-50', activeBg: 'from-pink-600 to-rose-600' },
      { id: 'expenses', label: 'Expenses', icon: Wallet, color: 'text-teal-600 bg-teal-50', activeBg: 'from-teal-600 to-emerald-600' },
      { id: 'payroll', label: 'Staff Payroll', icon: Briefcase, color: 'text-indigo-600 bg-indigo-50', activeBg: 'from-indigo-600 to-violet-600' },
      { id: 'reports', label: 'Analytics & Reports', icon: BarChart3, color: 'text-blue-600 bg-blue-50', activeBg: 'from-blue-600 to-indigo-600' },
      { id: 'settings', label: 'School Settings', icon: Settings, color: 'text-slate-700 bg-slate-100', activeBg: 'from-slate-800 to-slate-900' }
    ]
  }
];

const CLASS_OPTIONS = ['All Classes', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

const GRADE_THEMES = {
  'Grade 8': {
    bar: 'bg-gradient-to-r from-rose-500 to-pink-500',
    text: 'text-rose-700',
    tint: 'bg-rose-50/70 border-rose-200',
    headerStrip: 'from-rose-500 to-pink-500'
  },
  'Grade 9': {
    bar: 'bg-gradient-to-r from-amber-500 to-orange-500',
    text: 'text-amber-700',
    tint: 'bg-amber-50/70 border-amber-200',
    headerStrip: 'from-amber-500 to-orange-500'
  },
  'Grade 10': {
    bar: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    text: 'text-emerald-700',
    tint: 'bg-emerald-50/70 border-emerald-200',
    headerStrip: 'from-emerald-500 to-teal-500'
  },
  'Grade 11': {
    bar: 'bg-gradient-to-r from-sky-500 to-blue-600',
    text: 'text-sky-700',
    tint: 'bg-sky-50/70 border-sky-200',
    headerStrip: 'from-sky-500 to-blue-600'
  },
  'Grade 12': {
    bar: 'bg-gradient-to-r from-violet-600 to-purple-600',
    text: 'text-violet-700',
    tint: 'bg-violet-50/70 border-violet-200',
    headerStrip: 'from-violet-600 to-purple-600'
  }
};

const AVATAR_GRADIENTS = [
  'bg-gradient-to-br from-indigo-500 to-purple-600',
  'bg-gradient-to-br from-emerald-500 to-teal-600',
  'bg-gradient-to-br from-rose-500 to-orange-500',
  'bg-gradient-to-br from-sky-500 to-blue-600',
  'bg-gradient-to-br from-amber-500 to-pink-600',
  'bg-gradient-to-br from-violet-600 to-fuchsia-600'
];

function getAvatarGradient(idStr = '') {
  let sum = 0;
  for (let i = 0; i < idStr.length; i += 1) {
    sum += idStr.charCodeAt(i);
  }
  return AVATAR_GRADIENTS[sum % AVATAR_GRADIENTS.length];
}

function getTimetableCellColor(subjectText = '') {
  const lower = subjectText.toLowerCase();
  if (lower.includes('math')) return 'bg-indigo-50/90 text-indigo-900 border-indigo-100';
  if (lower.includes('physic') || lower.includes('chemis') || lower.includes('biolog'))
    return 'bg-emerald-50/90 text-emerald-900 border-emerald-100';
  if (lower.includes('computer') || lower.includes('robot') || lower.includes('coding'))
    return 'bg-sky-50/90 text-sky-900 border-sky-100';
  if (lower.includes('english') || lower.includes('lit') || lower.includes('history') || lower.includes('civics'))
    return 'bg-purple-50/90 text-purple-900 border-purple-100';
  return 'bg-amber-50/90 text-amber-900 border-amber-100';
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Persistent Students State
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  // Persistent Invoices State
  const [invoices, setInvoices] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
      return saved ? JSON.parse(saved) : INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
  });

  // Attendance State
  const [attendanceDate, setAttendanceDate] = useState('2026-10-28');
  const [attendanceClassFilter, setAttendanceClassFilter] = useState('All Classes');
  const [attendanceByDate, setAttendanceByDate] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    const initialMap = {};
    INITIAL_STUDENTS.forEach((stu, idx) => {
      initialMap[stu.id] = idx === 3 ? 'Absent' : idx === 1 ? 'Late' : 'Present';
    });
    return { '2026-10-28': initialMap };
  });

  // Homework & Expenses State
  const [homeworkList, setHomeworkList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HOMEWORK);
      return saved ? JSON.parse(saved) : INITIAL_HOMEWORK;
    } catch {
      return INITIAL_HOMEWORK;
    }
  });

  const [expensesList, setExpensesList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  });

  const [schoolSettings, setSchoolSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved
        ? JSON.parse(saved)
        : {
            schoolName: 'TopTech International Academy',
            academicYear: '2026/2027',
            currentTerm: 'Term 1 (First Semester)',
            currencySymbol: '$',
            principalName: 'Dr. Folake Balogun',
            contactEmail: 'registrar@toptechschool.edu',
            campusAddress: 'Plot 18 Innovation Corridor, Victoria Island, Lagos',
            lateFeeGraceDays: '14'
          };
    } catch {
      return {
        schoolName: 'TopTech International Academy',
        academicYear: '2026/2027',
        currentTerm: 'Term 1 (First Semester)',
        currencySymbol: '$',
        principalName: 'Dr. Folake Balogun',
        contactEmail: 'registrar@toptechschool.edu',
        campusAddress: 'Plot 18 Innovation Corridor, Victoria Island, Lagos',
        lateFeeGraceDays: '14'
      };
    }
  });

  // Student Directory Filters & Selected Student Profile
  const [studentSearch, setStudentSearch] = useState('');
  const [studentClassFilter, setStudentClassFilter] = useState('All Classes');
  const [studentFeeFilter, setStudentFeeFilter] = useState('All');
  const [selectedStudentId, setSelectedStudentId] = useState(INITIAL_STUDENTS[0].id);

  // Fee View Filters & Payment Modal
  const [feeStatusFilter, setFeeStatusFilter] = useState('All');
  const [feeSearch, setFeeSearch] = useState('');
  const [recordingPaymentInvoiceId, setRecordingPaymentInvoiceId] = useState(null);
  const [paymentAmountInput, setPaymentAmountInput] = useState('');

  // Add Student Form State
  const [newStudentForm, setNewStudentForm] = useState({
    firstName: '',
    lastName: '',
    gender: 'Female',
    dob: '2011-06-15',
    className: 'Grade 10',
    section: 'A',
    guardianName: '',
    guardianRelation: 'Mother',
    phone: '',
    email: '',
    address: '',
    bloodGroup: 'O+',
    feeStatus: 'Paid',
    balanceDue: '0',
    notes: ''
  });

  // New Homework Form State
  const [newHomework, setNewHomework] = useState({
    title: '',
    subject: 'Mathematics',
    className: 'Grade 10',
    assignedBy: 'Dr. Samuel Adebayo',
    dueDate: '2026-11-08'
  });

  // New Expense Form State
  const [newExpense, setNewExpense] = useState({
    title: '',
    department: 'Sciences',
    vendor: '',
    amount: ''
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch {
      // ignore
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
    } catch {
      // ignore
    }
  }, [invoices]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceByDate));
    } catch {
      // ignore
    }
  }, [attendanceByDate]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HOMEWORK, JSON.stringify(homeworkList));
    } catch {
      // ignore
    }
  }, [homeworkList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expensesList));
    } catch {
      // ignore
    }
  }, [expensesList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(schoolSettings));
    } catch {
      // ignore
    }
  }, [schoolSettings]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Derived metrics
  const currentDayAttendanceMap = useMemo(() => {
    if (attendanceByDate[attendanceDate]) {
      return attendanceByDate[attendanceDate];
    }
    const defaultMap = {};
    students.forEach((s) => {
      defaultMap[s.id] = 'Present';
    });
    return defaultMap;
  }, [attendanceByDate, attendanceDate, students]);

  const metrics = useMemo(() => {
    const totalStudents = students.length;
    const avgAttendance =
      totalStudents > 0
        ? (students.reduce((sum, s) => sum + Number(s.attendanceRate || 95), 0) / totalStudents).toFixed(1)
        : '0.0';
    const totalBilled = invoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
    const totalCollected = invoices.reduce((sum, inv) => sum + Number(inv.paidAmount || 0), 0);
    const totalOutstanding = Math.max(0, totalBilled - totalCollected);
    const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 100;

    let presentToday = 0;
    let absentToday = 0;
    let lateToday = 0;
    students.forEach((s) => {
      const st = currentDayAttendanceMap[s.id] || 'Present';
      if (st === 'Present') presentToday += 1;
      else if (st === 'Absent') absentToday += 1;
      else lateToday += 1;
    });

    return {
      totalStudents,
      avgAttendance,
      totalBilled,
      totalCollected,
      totalOutstanding,
      collectionRate,
      presentToday,
      absentToday,
      lateToday
    };
  }, [students, invoices, currentDayAttendanceMap]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((stu) => {
      const fullName = `${stu.firstName} ${stu.lastName}`.toLowerCase();
      const q = studentSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        fullName.includes(q) ||
        stu.admissionNo.toLowerCase().includes(q) ||
        stu.guardianName.toLowerCase().includes(q);
      const matchesClass = studentClassFilter === 'All Classes' || stu.className === studentClassFilter;
      const matchesFee = studentFeeFilter === 'All' || stu.feeStatus === studentFeeFilter;
      return matchesSearch && matchesClass && matchesFee;
    });
  }, [students, studentSearch, studentClassFilter, studentFeeFilter]);

  const selectedStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || students[0] || null;
  }, [students, selectedStudentId]);

  // Export CSV handler
  const exportStudentsCSV = () => {
    const headers = [
      'Student ID',
      'Admission No',
      'First Name',
      'Last Name',
      'Gender',
      'Date of Birth',
      'Class',
      'Section',
      'Guardian',
      'Phone',
      'Email',
      'Attendance %',
      'GPA',
      'Fee Status',
      'Balance Due'
    ];
    const rows = filteredStudents.map((s) => [
      s.id,
      s.admissionNo,
      s.firstName,
      s.lastName,
      s.gender,
      s.dob,
      s.className,
      s.section,
      `"${(s.guardianName || '').replace(/"/g, '""')}"`,
      `"${s.phone || ''}"`,
      s.email,
      s.attendanceRate,
      s.gpa,
      s.feeStatus,
      s.balanceDue
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `toptech-students-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported ${filteredStudents.length} student records to CSV`);
  };

  // Add Student Submission
  const handleAddStudentSubmit = (e) => {
    e.preventDefault();
    if (!newStudentForm.firstName.trim() || !newStudentForm.lastName.trim()) {
      showToast('Please enter both first name and last name.');
      return;
    }
    const nextNumber = students.length + 1;
    const newId = `STU-2026-${String(nextNumber).padStart(3, '0')}`;
    const admissionNo = `TT-${2600 + nextNumber}`;
    const balanceNum = Number(newStudentForm.balanceDue) || 0;
    const computedFeeStatus =
      balanceNum === 0 ? 'Paid' : newStudentForm.feeStatus === 'Paid' ? 'Partial' : newStudentForm.feeStatus;

    const createdStudent = {
      id: newId,
      admissionNo,
      firstName: newStudentForm.firstName.trim(),
      lastName: newStudentForm.lastName.trim(),
      gender: newStudentForm.gender,
      dob: newStudentForm.dob,
      className: newStudentForm.className,
      section: newStudentForm.section,
      rollNo: `${Math.floor(100 + Math.random() * 300)}`,
      guardianName: newStudentForm.guardianName.trim() || 'Parent / Guardian',
      guardianRelation: newStudentForm.guardianRelation,
      phone: newStudentForm.phone.trim() || '+234 800 000 0000',
      email: newStudentForm.email.trim() || `${newStudentForm.firstName.toLowerCase()}@example.com`,
      address: newStudentForm.address.trim() || 'Lagos Campus District',
      enrollmentDate: new Date().toISOString().slice(0, 10),
      attendanceRate: 100.0,
      gpa: 3.7,
      feeStatus: computedFeeStatus,
      balanceDue: balanceNum,
      bloodGroup: newStudentForm.bloodGroup,
      house: 'newton',
      notes: newStudentForm.notes.trim() || 'Newly enrolled student for 2026/2027 academic session.'
    };

    setStudents((prev) => [createdStudent, ...prev]);

    const baseTuition = 2400;
    const paidPortion = Math.max(0, baseTuition - balanceNum);
    const newInvoice = {
      id: `INV-2026-${8800 + invoices.length + 1}`,
      studentId: newId,
      studentName: `${createdStudent.firstName} ${createdStudent.lastName}`,
      className: createdStudent.className,
      term: 'Term 1 · 2026/2027',
      category: 'Tuition & Registration',
      amount: baseTuition,
      paidAmount: paidPortion,
      dueDate: '2026-11-15',
      status: computedFeeStatus,
      paymentMethod: paidPortion > 0 ? 'Bank Transfer' : 'Pending'
    };
    setInvoices((prev) => [newInvoice, ...prev]);

    setSelectedStudentId(newId);
    setNewStudentForm({
      firstName: '',
      lastName: '',
      gender: 'Female',
      dob: '2011-06-15',
      className: 'Grade 10',
      section: 'A',
      guardianName: '',
      guardianRelation: 'Mother',
      phone: '',
      email: '',
      address: '',
      bloodGroup: 'O+',
      feeStatus: 'Paid',
      balanceDue: '0',
      notes: ''
    });
    setActiveTab('student-profile');
    showToast(`Enrolled ${createdStudent.firstName} ${createdStudent.lastName} (${admissionNo})`);
  };

  const handleDeleteStudent = (studentId) => {
    const target = students.find((s) => s.id === studentId);
    if (!target) return;
    const remaining = students.filter((s) => s.id !== studentId);
    setStudents(remaining);
    if (selectedStudentId === studentId && remaining.length > 0) {
      setSelectedStudentId(remaining[0].id);
    }
    showToast(`Removed student record ${target.firstName} ${target.lastName}`);
  };

  const handleResetDemoData = () => {
    setStudents(INITIAL_STUDENTS);
    setInvoices(INITIAL_INVOICES);
    setHomeworkList(INITIAL_HOMEWORK);
    setExpensesList(INITIAL_EXPENSES);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.INVOICES);
    localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
    localStorage.removeItem(STORAGE_KEYS.HOMEWORK);
    localStorage.removeItem(STORAGE_KEYS.EXPENSES);
    showToast('Restored default TopTech demo dataset');
  };

  // Attendance Status Setter
  const setStudentAttendance = (studentId, status) => {
    setAttendanceByDate((prev) => ({
      ...prev,
      [attendanceDate]: {
        ...(prev[attendanceDate] || currentDayAttendanceMap),
        [studentId]: status
      }
    }));
  };

  const markAllAttendanceForClass = (status) => {
    const updatedDay = { ...currentDayAttendanceMap };
    students
      .filter((s) => attendanceClassFilter === 'All Classes' || s.className === attendanceClassFilter)
      .forEach((s) => {
        updatedDay[s.id] = status;
      });
    setAttendanceByDate((prev) => ({
      ...prev,
      [attendanceDate]: updatedDay
    }));
    showToast(`Marked visible ${attendanceClassFilter} roster as ${status}`);
  };

  // Record invoice payment
  const handleRecordPayment = (e) => {
    e.preventDefault();
    const inv = invoices.find((i) => i.id === recordingPaymentInvoiceId);
    if (!inv) return;
    const paymentVal = Number(paymentAmountInput);
    if (!paymentVal || paymentVal <= 0) {
      showToast('Enter a valid payment amount greater than zero.');
      return;
    }
    const updatedPaid = Math.min(inv.amount, inv.paidAmount + paymentVal);
    const remainingBalance = Math.max(0, inv.amount - updatedPaid);
    const updatedStatus = remainingBalance === 0 ? 'Paid' : 'Partial';

    setInvoices((prev) =>
      prev.map((item) =>
        item.id === inv.id
          ? {
              ...item,
              paidAmount: updatedPaid,
              status: updatedStatus,
              paymentMethod: 'Portal Receipt'
            }
          : item
      )
    );

    setStudents((prev) =>
      prev.map((stu) =>
        stu.id === inv.studentId
          ? {
              ...stu,
              balanceDue: remainingBalance,
              feeStatus: updatedStatus
            }
          : stu
      )
    );

    setRecordingPaymentInvoiceId(null);
    setPaymentAmountInput('');
    showToast(`Recorded ${schoolSettings.currencySymbol}${paymentVal.toLocaleString()} payment for ${inv.studentName}`);
  };

  // Active nav label for breadcrumb
  const activeNavLabel = useMemo(() => {
    if (activeTab === 'student-profile') return 'Student Profile';
    for (const group of NAV_GROUPS) {
      const found = group.items.find((i) => i.id === activeTab);
      if (found) return found.label;
    }
    return 'Dashboard';
  }, [activeTab]);

  // Status indicator helper (clean semantic color + text, no pill enclosure)
  const renderStatusText = (status) => {
    if (
      status === 'Paid' ||
      status === 'Present' ||
      status === 'Active' ||
      status === 'Completed' ||
      status === 'Disbursed' ||
      status === 'Approved'
    ) {
      return <span className="font-semibold text-emerald-600">{status}</span>;
    }
    if (
      status === 'Partial' ||
      status === 'Late' ||
      status === 'Scheduled' ||
      status === 'Pending Approval' ||
      status === 'On Leave'
    ) {
      return <span className="font-semibold text-amber-600">{status}</span>;
    }
    if (status === 'Overdue' || status === 'Absent') {
      return <span className="font-semibold text-rose-600">{status}</span>;
    }
    return <span className="font-semibold text-indigo-600">{status}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-slate-50 to-sky-50/50 text-slate-900 flex flex-col">
      {/* Colorful Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 bg-gradient-to-r from-indigo-950 via-indigo-900 to-blue-900 text-white shadow-md px-6 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 -ml-2 text-indigo-200 hover:text-white rounded-lg focus-visible:outline-2 focus-visible:outline-amber-400"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <a
            href="#dashboard"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('dashboard');
            }}
            className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-sky-200 to-amber-200 bg-clip-text text-transparent whitespace-nowrap shrink-0"
          >
            TopTech School Suite
          </a>
        </div>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-indigo-200">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer ${
              activeTab === 'dashboard' ? 'border-amber-400 text-white font-semibold' : 'border-transparent'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('students')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer ${
              activeTab === 'students' || activeTab === 'student-profile'
                ? 'border-amber-400 text-white font-semibold'
                : 'border-transparent'
            }`}
          >
            Students
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('attendance')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer ${
              activeTab === 'attendance' ? 'border-amber-400 text-white font-semibold' : 'border-transparent'
            }`}
          >
            Attendance
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('fees')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer ${
              activeTab === 'fees' ? 'border-amber-400 text-white font-semibold' : 'border-transparent'
            }`}
          >
            Fees
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer ${
              activeTab === 'reports' ? 'border-amber-400 text-white font-semibold' : 'border-transparent'
            }`}
          >
            Reports
          </button>
        </nav>

        {/* Zone 3: 1 primary action button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('add-student')}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg hover:from-amber-300 hover:to-orange-300 shadow-xs transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll Student</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Layout: Sidebar (256px) + Main Content Viewport */}
      <div className="flex-1 flex min-h-0">
        {/* Colorful Sidebar Navigation */}
        <aside
          className={`${
            mobileMenuOpen ? 'fixed inset-y-0 left-0 z-40 block w-64 shadow-2xl' : 'hidden'
          } lg:block lg:static lg:w-64 bg-white/95 backdrop-blur-xs border-r border-indigo-100 shrink-0 overflow-y-auto`}
        >
          <div className="p-5 flex flex-col justify-between min-h-full">
            <div className="space-y-6">
              {mobileMenuOpen && (
                <div className="flex items-center justify-between pb-3 border-b border-indigo-100 lg:hidden">
                  <span className="text-sm font-bold text-indigo-950">Navigation</span>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {NAV_GROUPS.map((group) => (
                <div key={group.heading}>
                  <p className={`px-3 mb-2 text-xs font-bold tracking-tight ${group.headingColor}`}>
                    {group.heading}
                  </p>
                  <ul className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive =
                        activeTab === item.id ||
                        (item.id === 'students' && activeTab === 'student-profile');
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab(item.id);
                              setMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                              isActive
                                ? `bg-gradient-to-r ${item.activeBg} text-white shadow-sm font-semibold`
                                : 'text-slate-600 hover:bg-indigo-50/60 hover:text-slate-900'
                            }`}
                          >
                            <span
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                isActive ? 'bg-white/20 text-white' : item.color
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </span>
                            <span className="truncate">{item.label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <div className="pt-5 mt-6 border-t border-indigo-100 bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-sky-50/80 p-3.5 rounded-xl text-xs text-slate-600 space-y-2">
              <div className="font-bold text-indigo-950 truncate">{schoolSettings.schoolName}</div>
              <div className="text-indigo-700 font-medium">
                <span>{schoolSettings.academicYear}</span>
                <span aria-hidden="true"> · </span>
                <span>
                  {schoolSettings.currentTerm.split(' ')[0]} {schoolSettings.currentTerm.split(' ')[1]}
                </span>
              </div>
              <button
                type="button"
                onClick={handleResetDemoData}
                className="pt-1 text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Data</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-30 bg-indigo-950/40 backdrop-blur-xs lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Viewport */}
        <main className="flex-1 min-w-0 p-6 lg:p-8 max-w-[1360px] mx-auto w-full space-y-6">
          {/* Colorful Toast Banner */}
          {toastMessage && (
            <div
              role="status"
              className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between shadow-md"
            >
              <span>{toastMessage}</span>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                className="text-indigo-100 hover:text-white ml-4"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Contextual Colorful Workspace Header & Breadcrumb */}
          <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 rounded-2xl p-6 text-white shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-indigo-100 mb-1">
                <span>TopTech Workspace</span>
                <ChevronRight className="w-3.5 h-3.5 text-indigo-300" />
                <span>{schoolSettings.academicYear}</span>
                <ChevronRight className="w-3.5 h-3.5 text-indigo-300" />
                <span className="text-amber-300 font-semibold">{activeNavLabel}</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">{activeNavLabel}</h1>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={exportStudentsCSV}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/25 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Students CSV</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('attendance')}
                className="px-3.5 py-2 text-xs font-bold text-indigo-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Mark Roll Call</span>
              </button>
            </div>
          </div>

          {/* ==================== VIEW 1: DASHBOARD ==================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* 4-Column Colorful KPI Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* KPI 1: Indigo / Violet */}
                <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 border border-indigo-200 rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-indigo-700">Enrolled Students</p>
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-indigo-950 tabular-nums mt-2">
                    {metrics.totalStudents}
                  </p>
                  <p className="text-xs text-slate-600 mt-2">
                    <span>Across 6 academic grades</span>
                    <span aria-hidden="true"> · </span>
                    <span className="text-emerald-600 font-semibold">Active session</span>
                  </p>
                </div>

                {/* KPI 2: Emerald / Teal */}
                <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 border border-emerald-200 rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-emerald-700">Average Attendance</p>
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center">
                      <CalendarCheck className="w-4 h-4" />
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-emerald-950 tabular-nums mt-2">
                    {metrics.avgAttendance}%
                  </p>
                  <p className="text-xs text-slate-600 mt-2 tabular-nums">
                    <span className="text-emerald-700 font-medium">Today: {metrics.presentToday} present</span>
                    <span aria-hidden="true"> · </span>
                    <span className="text-rose-600 font-medium">{metrics.absentToday} absent</span>
                  </p>
                </div>

                {/* KPI 3: Sky / Blue */}
                <div className="bg-gradient-to-br from-sky-50 via-white to-blue-50 border border-sky-200 rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-sky-700">Term Fee Revenue Collected</p>
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center">
                      <CreditCard className="w-4 h-4" />
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-sky-950 tabular-nums mt-2">
                    {schoolSettings.currencySymbol}
                    {metrics.totalCollected.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-600 mt-2 tabular-nums">
                    <span className="text-sky-700 font-semibold">{metrics.collectionRate}% of billed</span>
                    <span aria-hidden="true"> · </span>
                    <span>
                      {schoolSettings.currencySymbol}
                      {metrics.totalBilled.toLocaleString()} total
                    </span>
                  </p>
                </div>

                {/* KPI 4: Amber / Orange */}
                <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50 border border-amber-200 rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-amber-800">Outstanding Fee Balance</p>
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center">
                      <Wallet className="w-4 h-4" />
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-amber-950 tabular-nums mt-2">
                    {schoolSettings.currencySymbol}
                    {metrics.totalOutstanding.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-600 mt-2">
                    <span>{invoices.filter((i) => i.status !== 'Paid').length} open invoices</span>
                    <span aria-hidden="true"> · </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('fees')}
                      className="text-orange-600 hover:underline font-semibold cursor-pointer"
                    >
                      Review ledger
                    </button>
                  </p>
                </div>
              </div>

              {/* Enrollment & Attendance Breakdown + Colorful Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {/* Left 2 Columns: Multi-Color Grade Enrollment Chart */}
                <div className="lg:col-span-2 bg-white border border-indigo-100 rounded-xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div>
                        <h2 className="text-base font-bold text-indigo-950">
                          Enrollment & Attendance by Grade Level
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Color-coded distribution of registered students and average daily attendance
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('classes')}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <span>View Classes</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-5 space-y-4">
                      {['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map((grade) => {
                        const gradeStudents = students.filter((s) => s.className === grade);
                        const count = gradeStudents.length;
                        const avgAtt =
                          count > 0
                            ? (
                                gradeStudents.reduce((acc, s) => acc + Number(s.attendanceRate), 0) /
                                count
                              ).toFixed(1)
                            : '95.0';
                        const pctWidth = Math.min(
                          100,
                          Math.max(15, Math.round((count / Math.max(1, students.length)) * 220))
                        );
                        const theme = GRADE_THEMES[grade] || GRADE_THEMES['Grade 10'];

                        return (
                          <div key={grade} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className={`font-bold ${theme.text}`}>{grade}</span>
                              <div className="text-slate-600 tabular-nums font-medium">
                                <span>{count} students</span>
                                <span aria-hidden="true"> · </span>
                                <span className="text-emerald-700">{avgAtt}% attendance</span>
                              </div>
                            </div>
                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${theme.bar} rounded-full`}
                                style={{ width: `${pctWidth}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-indigo-50 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
                    <div>
                      <span className="font-semibold text-indigo-700">Faculty-to-Student Ratio: 1:11</span>
                      <span aria-hidden="true"> · </span>
                      <span>Academic Session {schoolSettings.academicYear}</span>
                    </div>
                    <span className="tabular-nums font-semibold text-purple-700">
                      Total Active Faculty: {INITIAL_TEACHERS.length} instructors
                    </span>
                  </div>
                </div>

                {/* Right Column: Colorful Quick Workflows & Upcoming Examinations */}
                <div className="bg-white border border-indigo-100 rounded-xl p-6 flex flex-col justify-between space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-indigo-950">Administrative Actions</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Direct shortcuts to frequent registrar and bursar tasks
                    </p>

                    <div className="mt-4 grid grid-cols-1 gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveTab('add-student')}
                        className="w-full text-left px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 hover:from-indigo-100 hover:to-blue-100 transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <div className="text-sm font-bold text-indigo-950">Register New Student</div>
                          <div className="text-xs text-indigo-700">Assign admission number and class section</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-indigo-600 shrink-0" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('attendance')}
                        className="w-full text-left px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 hover:from-emerald-100 hover:to-teal-100 transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <div className="text-sm font-bold text-emerald-950">Record Daily Attendance</div>
                          <div className="text-xs text-emerald-700">Update roll call for {attendanceDate}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-emerald-600 shrink-0" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('fees')}
                        className="w-full text-left px-4 py-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 hover:from-amber-100 hover:to-orange-100 transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <div className="text-sm font-bold text-amber-950">Log Tuition Payment</div>
                          <div className="text-xs text-amber-800">Settle pending or partial student invoices</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-amber-600 shrink-0" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-fuchsia-50 via-purple-50 to-indigo-50 border border-purple-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-purple-800">Next Scheduled Assessment</span>
                      <button
                        type="button"
                        onClick={() => setActiveTab('examinations')}
                        className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                      >
                        Full calendar
                      </button>
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      Further Mathematics Mid-Term
                    </div>
                    <div className="text-xs text-purple-700 mt-1 tabular-nums font-medium">
                      <span>Grade 11</span>
                      <span aria-hidden="true"> · </span>
                      <span>2026-11-04</span>
                      <span aria-hidden="true"> · </span>
                      <span>Exam Hall A</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Students Table */}
              <div className="bg-white border border-indigo-100 rounded-xl overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-indigo-50/70 via-white to-sky-50/70 border-b border-indigo-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-indigo-950">Student Directory Snapshot</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Click any student row to inspect academic profile, guardian contact, and fee history
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('students')}
                    className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-lg transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto cursor-pointer"
                  >
                    Open Full Student Directory
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-indigo-100 bg-indigo-50/40 text-xs font-bold text-indigo-900">
                        <th className="py-3 px-4">Admission No</th>
                        <th className="py-3 px-4">Student Name</th>
                        <th className="py-3 px-4">Class & Section</th>
                        <th className="py-3 px-4">Guardian</th>
                        <th className="py-3 px-4 text-right">Attendance</th>
                        <th className="py-3 px-4 text-right">GPA</th>
                        <th className="py-3 px-4">Fee Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {students.slice(0, 6).map((stu) => {
                        const gradeTheme = GRADE_THEMES[stu.className] || GRADE_THEMES['Grade 10'];
                        return (
                          <tr key={stu.id} className="hover:bg-indigo-50/40 transition-colors">
                            <td className="py-3 px-4 font-mono text-xs font-semibold text-indigo-600 tabular-nums">
                              {stu.admissionNo}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <span
                                  className={`w-7 h-7 rounded-lg text-white text-xs font-bold flex items-center justify-center shrink-0 ${getAvatarGradient(
                                    stu.id
                                  )}`}
                                >
                                  {stu.firstName[0]}
                                  {stu.lastName[0]}
                                </span>
                                <span className="font-semibold text-slate-900">
                                  {stu.firstName} {stu.lastName}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-xs">
                              <span className={`font-semibold ${gradeTheme.text}`}>{stu.className}</span>
                              <span aria-hidden="true" className="text-slate-400"> · </span>
                              <span className="text-slate-600">Sec {stu.section}</span>
                            </td>
                            <td className="py-3 px-4 text-slate-600 text-xs">
                              <span className="font-medium text-slate-800">{stu.guardianName}</span>
                              <span aria-hidden="true"> · </span>
                              <span className="tabular-nums text-slate-500">{stu.phone}</span>
                            </td>
                            <td className="py-3 px-4 text-right font-mono text-xs font-semibold text-teal-700 tabular-nums">
                              {Number(stu.attendanceRate).toFixed(1)}%
                            </td>
                            <td className="py-3 px-4 text-right font-mono text-xs font-bold text-indigo-700 tabular-nums">
                              {Number(stu.gpa).toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-xs">{renderStatusText(stu.feeStatus)}</td>
                            <td className="py-3 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedStudentId(stu.id);
                                  setActiveTab('student-profile');
                                }}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 whitespace-nowrap cursor-pointer"
                              >
                                View Profile
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== VIEW 2: STUDENT DIRECTORY ==================== */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              {/* Filter & Search Bar */}
              <div className="bg-white border border-indigo-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Search by student name, admission no (e.g. TT-2601), or guardian..."
                    className="w-full pl-9 pr-4 py-2 text-sm bg-indigo-50/40 border border-indigo-200 rounded-lg focus:bg-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Class Dropdown */}
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500" />
                    <label htmlFor="class-filter-select" className="font-semibold">
                      Grade:
                    </label>
                    <select
                      id="class-filter-select"
                      value={studentClassFilter}
                      onChange={(e) => setStudentClassFilter(e.target.value)}
                      className="bg-indigo-50/60 border border-indigo-200 text-indigo-950 text-xs font-semibold rounded-lg px-2.5 py-2 focus:outline-none focus:border-indigo-600"
                    >
                      {CLASS_OPTIONS.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Interactive Segmented Fee Status Filter */}
                  <div className="flex items-center gap-1 p-1 bg-indigo-50 rounded-lg">
                    {['All', 'Paid', 'Partial', 'Overdue'].map((statusOpt) => (
                      <button
                        key={statusOpt}
                        type="button"
                        onClick={() => setStudentFeeFilter(statusOpt)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          studentFeeFilter === statusOpt
                            ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-xs'
                            : 'text-indigo-700 hover:text-indigo-950'
                        }`}
                      >
                        {statusOpt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Student Table */}
              <div className="bg-white border border-indigo-100 rounded-xl overflow-hidden">
                <div className="px-6 py-3.5 bg-gradient-to-r from-indigo-50/60 via-white to-sky-50/60 border-b border-indigo-100 flex items-center justify-between text-xs text-slate-600">
                  <span>
                    Showing <strong className="text-indigo-950 tabular-nums">{filteredStudents.length}</strong> of{' '}
                    <strong className="text-indigo-950 tabular-nums">{students.length}</strong> enrolled students
                  </span>
                  <span className="text-indigo-600 font-medium">Synced with browser localStorage</span>
                </div>

                {filteredStudents.length === 0 ? (
                  <div className="p-12 text-center space-y-3">
                    <p className="text-base font-bold text-indigo-950">No matching student records found</p>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Try clearing your search query or switching the grade and fee status filter controls above.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setStudentSearch('');
                        setStudentClassFilter('All Classes');
                        setStudentFeeFilter('All');
                      }}
                      className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-indigo-100 bg-indigo-50/40 text-xs font-bold text-indigo-900">
                          <th className="py-3 px-4">Admission No</th>
                          <th className="py-3 px-4">Full Name</th>
                          <th className="py-3 px-4">Class</th>
                          <th className="py-3 px-4">Guardian Contact</th>
                          <th className="py-3 px-4 text-right">Attendance</th>
                          <th className="py-3 px-4 text-right">Balance Due</th>
                          <th className="py-3 px-4">Fee Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {filteredStudents.map((stu) => {
                          const gradeTheme = GRADE_THEMES[stu.className] || GRADE_THEMES['Grade 10'];
                          return (
                            <tr key={stu.id} className="hover:bg-indigo-50/40 transition-colors">
                              <td className="py-3 px-4 font-mono text-xs font-semibold text-indigo-600 tabular-nums">
                                {stu.admissionNo}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <span
                                    className={`w-8 h-8 rounded-lg text-white text-xs font-bold flex items-center justify-center shrink-0 ${getAvatarGradient(
                                      stu.id
                                    )}`}
                                  >
                                    {stu.firstName[0]}
                                    {stu.lastName[0]}
                                  </span>
                                  <div>
                                    <div className="font-semibold text-slate-900">
                                      {stu.firstName} {stu.lastName}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                      <span>{stu.gender}</span>
                                      <span aria-hidden="true"> · </span>
                                      <span className="tabular-nums">DOB {stu.dob}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-xs">
                                <span className={`font-bold ${gradeTheme.text}`}>{stu.className}</span>
                                <span aria-hidden="true" className="text-slate-400"> · </span>
                                <span className="text-slate-600">Section {stu.section}</span>
                              </td>
                              <td className="py-3 px-4 text-xs text-slate-600">
                                <div className="font-medium text-slate-800">{stu.guardianName}</div>
                                <div className="tabular-nums text-slate-500">{stu.phone}</div>
                              </td>
                              <td className="py-3 px-4 text-right font-mono text-xs font-semibold text-teal-700 tabular-nums">
                                {Number(stu.attendanceRate).toFixed(1)}%
                              </td>
                              <td className="py-3 px-4 text-right font-mono text-xs font-semibold text-slate-900 tabular-nums">
                                {schoolSettings.currencySymbol}
                                {Number(stu.balanceDue || 0).toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-xs">{renderStatusText(stu.feeStatus)}</td>
                              <td className="py-3 px-4 text-right">
                                <div className="inline-flex items-center gap-3">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedStudentId(stu.id);
                                      setActiveTab('student-profile');
                                    }}
                                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 whitespace-nowrap cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Profile</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteStudent(stu.id)}
                                    className="text-xs text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                    title="Delete student record"
                                    aria-label={`Delete ${stu.firstName} ${stu.lastName}`}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== VIEW 3: STUDENT PROFILE ==================== */}
          {activeTab === 'student-profile' && selectedStudent && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('students')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>← Back to Student Directory</span>
                </button>
                <div className="flex items-center gap-2">
                  <label htmlFor="switch-student-select" className="text-xs font-medium text-slate-600">
                    Quick jump:
                  </label>
                  <select
                    id="switch-student-select"
                    value={selectedStudent.id}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="bg-white border border-indigo-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-indigo-950"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.admissionNo} — {s.firstName} {s.lastName} ({s.className})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-white border border-indigo-100 rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-sky-50 p-6 border-b border-indigo-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 rounded-2xl text-white flex items-center justify-center text-xl font-bold shadow-sm shrink-0 ${getAvatarGradient(
                        selectedStudent.id
                      )}`}
                    >
                      {selectedStudent.firstName[0]}
                      {selectedStudent.lastName[0]}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-indigo-950">
                        {selectedStudent.firstName} {selectedStudent.lastName}
                      </h2>
                      <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-1.5">
                        <span className="font-mono tabular-nums text-indigo-700 font-bold">
                          {selectedStudent.admissionNo}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-purple-700">{selectedStudent.className}</span>
                        <span aria-hidden="true">·</span>
                        <span>Section {selectedStudent.section}</span>
                        <span aria-hidden="true">·</span>
                        <span>Roll No {selectedStudent.rollNo}</span>
                        <span aria-hidden="true">·</span>
                        <span>Enrolled {selectedStudent.enrollmentDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <div className="text-xs font-medium text-indigo-600">Cumulative GPA</div>
                      <div className="text-lg font-bold text-indigo-950 tabular-nums">
                        {Number(selectedStudent.gpa).toFixed(2)} / 4.00
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-emerald-700">Attendance Rate</div>
                      <div className="text-lg font-bold text-emerald-700 tabular-nums">
                        {Number(selectedStudent.attendanceRate).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500">Fee Account</div>
                      <div className="text-sm mt-0.5">{renderStatusText(selectedStudent.feeStatus)}</div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-indigo-900">Personal & Academic Details</h3>
                      <dl className="divide-y divide-slate-100 text-sm">
                        <div className="py-2.5 flex justify-between">
                          <dt className="text-slate-500">Student System ID</dt>
                          <dd className="font-mono text-xs font-semibold text-indigo-700 tabular-nums">
                            {selectedStudent.id}
                          </dd>
                        </div>
                        <div className="py-2.5 flex justify-between">
                          <dt className="text-slate-500">Gender & Date of Birth</dt>
                          <dd className="text-slate-800 tabular-nums">
                            {selectedStudent.gender} · {selectedStudent.dob}
                          </dd>
                        </div>
                        <div className="py-2.5 flex justify-between">
                          <dt className="text-slate-500">Blood Group</dt>
                          <dd className="font-semibold text-rose-600">{selectedStudent.bloodGroup || 'O+'}</dd>
                        </div>
                        <div className="py-2.5 flex justify-between">
                          <dt className="text-slate-500">Outstanding Tuition Balance</dt>
                          <dd className="font-mono font-bold text-amber-700 tabular-nums">
                            {schoolSettings.currencySymbol}
                            {Number(selectedStudent.balanceDue || 0).toLocaleString()}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-purple-900">Guardian & Emergency Contact</h3>
                      <dl className="divide-y divide-slate-100 text-sm">
                        <div className="py-2.5 flex justify-between">
                          <dt className="text-slate-500">Primary Guardian</dt>
                          <dd className="font-semibold text-slate-900">
                            {selectedStudent.guardianName} ({selectedStudent.guardianRelation || 'Guardian'})
                          </dd>
                        </div>
                        <div className="py-2.5 flex justify-between">
                          <dt className="text-slate-500">Direct Telephone</dt>
                          <dd className="font-mono text-xs font-semibold text-indigo-700 tabular-nums">
                            {selectedStudent.phone}
                          </dd>
                        </div>
                        <div className="py-2.5 flex justify-between">
                          <dt className="text-slate-500">Email Address</dt>
                          <dd className="text-sky-700 font-medium">{selectedStudent.email}</dd>
                        </div>
                        <div className="py-2.5 flex justify-between">
                          <dt className="text-slate-500">Residential Address</dt>
                          <dd className="text-slate-800 text-right">{selectedStudent.address}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-indigo-100">
                    <h3 className="text-sm font-bold text-indigo-950 mb-1.5">Faculty Advisory Notes</h3>
                    <p className="text-sm text-slate-700 leading-relaxed bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                      {selectedStudent.notes}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== VIEW 4: ADD / ENROLL STUDENT ==================== */}
          {activeTab === 'add-student' && (
            <div className="bg-white border border-indigo-100 rounded-xl overflow-hidden max-w-3xl">
              <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white">
                <h2 className="text-base font-bold">New Student Admission Form</h2>
                <p className="text-xs text-indigo-100 mt-0.5">
                  Creates a persistent student record in browser storage and generates a Term 1 tuition invoice automatically.
                </p>
              </div>

              <form onSubmit={handleAddStudentSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-indigo-950 mb-1.5">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newStudentForm.firstName}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, firstName: e.target.value })}
                      placeholder="e.g. Tariq"
                      className="w-full px-3.5 py-2 text-sm border border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-indigo-950 mb-1.5">
                      Last Name / Surname *
                    </label>
                    <input
                      type="text"
                      required
                      value={newStudentForm.lastName}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, lastName: e.target.value })}
                      placeholder="e.g. Ibrahim"
                      className="w-full px-3.5 py-2 text-sm border border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-indigo-950 mb-1.5">Gender</label>
                    <select
                      value={newStudentForm.gender}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, gender: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-indigo-200 rounded-lg bg-white focus:outline-none focus:border-indigo-600"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-indigo-950 mb-1.5">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={newStudentForm.dob}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, dob: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-600 tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-indigo-950 mb-1.5">
                      Assign Class Level
                    </label>
                    <select
                      value={newStudentForm.className}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, className: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-indigo-200 rounded-lg bg-white focus:outline-none focus:border-indigo-600"
                    >
                      {['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-indigo-950 mb-1.5">Section</label>
                    <select
                      value={newStudentForm.section}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, section: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-indigo-200 rounded-lg bg-white focus:outline-none focus:border-indigo-600"
                    >
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-indigo-950 mb-1.5">
                      Primary Guardian Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newStudentForm.guardianName}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, guardianName: e.target.value })}
                      placeholder="e.g. Mrs. Halima Ibrahim"
                      className="w-full px-3.5 py-2 text-sm border border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-indigo-950 mb-1.5">
                      Guardian Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={newStudentForm.phone}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, phone: e.target.value })}
                      placeholder="+234 803 000 0000"
                      className="w-full px-3.5 py-2 text-sm border border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-600 tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-indigo-950 mb-1.5">
                      Guardian Email
                    </label>
                    <input
                      type="email"
                      value={newStudentForm.email}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, email: e.target.value })}
                      placeholder="parent@example.com"
                      className="w-full px-3.5 py-2 text-sm border border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-indigo-950 mb-1.5">
                      Initial Balance Due ({schoolSettings.currencySymbol})
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="2400"
                      value={newStudentForm.balanceDue}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, balanceDue: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-600 tabular-nums"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-indigo-950 mb-1.5">
                    Residential Address
                  </label>
                  <input
                    type="text"
                    value={newStudentForm.address}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, address: e.target.value })}
                    placeholder="Street address, district, city"
                    className="w-full px-3.5 py-2 text-sm border border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-indigo-950 mb-1.5">
                    Academic / Medical Advisory Notes
                  </label>
                  <textarea
                    rows={3}
                    value={newStudentForm.notes}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, notes: e.target.value })}
                    placeholder="Extracurricular clubs, scholarship notes, or learning accommodations..."
                    className="w-full px-3.5 py-2 text-sm border border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-indigo-100">
                  <button
                    type="button"
                    onClick={() => setActiveTab('students')}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-colors cursor-pointer"
                  >
                    Complete Enrollment
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ==================== VIEW 5: ATTENDANCE CHECKLIST ==================== */}
          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div className="bg-white border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-xs">
                    <label htmlFor="att-date" className="font-bold text-emerald-950">
                      Roll Call Date:
                    </label>
                    <input
                      id="att-date"
                      type="date"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      className="px-3 py-1.5 bg-emerald-50/60 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-950 tabular-nums"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <label htmlFor="att-class" className="font-bold text-emerald-950">
                      Filter Class:
                    </label>
                    <select
                      id="att-class"
                      value={attendanceClassFilter}
                      onChange={(e) => setAttendanceClassFilter(e.target.value)}
                      className="px-3 py-1.5 bg-emerald-50/60 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-950"
                    >
                      {CLASS_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => markAllAttendanceForClass('Present')}
                    className="px-3.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Mark All Present
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast(`Saved attendance register for ${attendanceDate}`)}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Save Register
                  </button>
                </div>
              </div>

              <div className="bg-white border border-emerald-100 rounded-xl overflow-hidden">
                <div className="px-6 py-3.5 bg-gradient-to-r from-emerald-50/70 via-white to-teal-50/70 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                  <div>
                    <span>Session Date: </span>
                    <strong className="text-emerald-950 tabular-nums">{attendanceDate}</strong>
                  </div>
                  <div className="tabular-nums">
                    <span className="text-emerald-700 font-bold">{metrics.presentToday} Present</span>
                    <span aria-hidden="true"> · </span>
                    <span className="text-amber-600 font-bold">{metrics.lateToday} Late</span>
                    <span aria-hidden="true"> · </span>
                    <span className="text-rose-600 font-bold">{metrics.absentToday} Absent</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-emerald-100 bg-emerald-50/40 text-xs font-bold text-emerald-950">
                        <th className="py-3 px-4">Admission No</th>
                        <th className="py-3 px-4">Student Name</th>
                        <th className="py-3 px-4">Grade & Section</th>
                        <th className="py-3 px-4 text-right">Term Attendance %</th>
                        <th className="py-3 px-4">Current Status</th>
                        <th className="py-3 px-4 text-right">Mark Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {students
                        .filter(
                          (s) =>
                            attendanceClassFilter === 'All Classes' ||
                            s.className === attendanceClassFilter
                        )
                        .map((stu) => {
                          const status = currentDayAttendanceMap[stu.id] || 'Present';
                          const activeBtnColors = {
                            Present: 'bg-emerald-600 text-white shadow-xs',
                            Late: 'bg-amber-500 text-white shadow-xs',
                            Absent: 'bg-rose-600 text-white shadow-xs'
                          };
                          return (
                            <tr key={stu.id} className="hover:bg-emerald-50/30 transition-colors">
                              <td className="py-3 px-4 font-mono text-xs font-semibold text-indigo-600 tabular-nums">
                                {stu.admissionNo}
                              </td>
                              <td className="py-3 px-4 font-semibold text-slate-900">
                                {stu.firstName} {stu.lastName}
                              </td>
                              <td className="py-3 px-4 text-xs text-slate-600">
                                {stu.className} · Sec {stu.section}
                              </td>
                              <td className="py-3 px-4 text-right font-mono text-xs font-semibold text-emerald-700 tabular-nums">
                                {Number(stu.attendanceRate).toFixed(1)}%
                              </td>
                              <td className="py-3 px-4 text-xs">{renderStatusText(status)}</td>
                              <td className="py-3 px-4 text-right">
                                <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                                  {['Present', 'Late', 'Absent'].map((opt) => (
                                    <button
                                      key={opt}
                                      type="button"
                                      onClick={() => setStudentAttendance(stu.id, opt)}
                                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                                        status === opt
                                          ? activeBtnColors[opt]
                                          : 'text-slate-600 hover:text-slate-900'
                                      }`}
                                    >
                                      {opt}
                                    </button>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== VIEW 6: FEES & INVOICES ==================== */}
          {activeTab === 'fees' && (
            <div className="space-y-6">
              {/* Colorful Summary Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 border border-indigo-200 rounded-xl p-5">
                  <p className="text-xs font-bold text-indigo-700">Total Invoiced (Term 1)</p>
                  <p className="text-2xl font-bold text-indigo-950 tabular-nums mt-1.5">
                    {schoolSettings.currencySymbol}
                    {metrics.totalBilled.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 border border-emerald-200 rounded-xl p-5">
                  <p className="text-xs font-bold text-emerald-700">Total Collected</p>
                  <p className="text-2xl font-bold text-emerald-700 tabular-nums mt-1.5">
                    {schoolSettings.currencySymbol}
                    {metrics.totalCollected.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50 border border-amber-200 rounded-xl p-5">
                  <p className="text-xs font-bold text-amber-800">Outstanding Receivables</p>
                  <p className="text-2xl font-bold text-amber-700 tabular-nums mt-1.5">
                    {schoolSettings.currencySymbol}
                    {metrics.totalOutstanding.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Payment Modal/Inline Drawer when an invoice is selected */}
              {recordingPaymentInvoiceId && (
                <form
                  onSubmit={handleRecordPayment}
                  className="bg-gradient-to-r from-indigo-50 via-blue-50 to-sky-50 border border-indigo-300 rounded-xl p-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-indigo-600">Record Fee Installment</div>
                    <div className="text-sm font-bold text-indigo-950">
                      Invoice {recordingPaymentInvoiceId} —{' '}
                      {invoices.find((i) => i.id === recordingPaymentInvoiceId)?.studentName}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-indigo-800 mb-1">
                        Amount ({schoolSettings.currencySymbol})
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={paymentAmountInput}
                        onChange={(e) => setPaymentAmountInput(e.target.value)}
                        className="px-3 py-1.5 text-sm bg-white border border-indigo-300 rounded-lg w-36 tabular-nums"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg hover:from-indigo-700 hover:to-blue-700 cursor-pointer"
                    >
                      Confirm Receipt
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecordingPaymentInvoiceId(null)}
                      className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Filter Bar */}
              <div className="bg-white border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-amber-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={feeSearch}
                    onChange={(e) => setFeeSearch(e.target.value)}
                    placeholder="Search invoice ID or student name..."
                    className="w-full pl-9 pr-4 py-2 text-sm bg-amber-50/40 border border-amber-200 rounded-lg focus:bg-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-1 p-1 bg-amber-50 rounded-lg">
                  {['All', 'Paid', 'Partial', 'Overdue'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setFeeStatusFilter(st)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                        feeStatusFilter === st
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs'
                          : 'text-amber-900 hover:text-amber-950'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Invoices Table */}
              <div className="bg-white border border-amber-100 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-amber-100 bg-amber-50/50 text-xs font-bold text-amber-950">
                        <th className="py-3 px-4">Invoice No</th>
                        <th className="py-3 px-4">Student</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4 text-right">Billed</th>
                        <th className="py-3 px-4 text-right">Paid</th>
                        <th className="py-3 px-4 text-right">Balance</th>
                        <th className="py-3 px-4">Due Date</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {invoices
                        .filter((inv) => {
                          const matchesStatus = feeStatusFilter === 'All' || inv.status === feeStatusFilter;
                          const q = feeSearch.trim().toLowerCase();
                          const matchesQuery =
                            !q ||
                            inv.id.toLowerCase().includes(q) ||
                            inv.studentName.toLowerCase().includes(q);
                          return matchesStatus && matchesQuery;
                        })
                        .map((inv) => {
                          const balance = Math.max(0, inv.amount - inv.paidAmount);
                          return (
                            <tr key={inv.id} className="hover:bg-amber-50/30 transition-colors">
                              <td className="py-3 px-4 font-mono text-xs font-semibold text-indigo-600 tabular-nums">
                                {inv.id}
                              </td>
                              <td className="py-3 px-4">
                                <div className="font-semibold text-slate-900">{inv.studentName}</div>
                                <div className="text-xs text-purple-700 font-medium">{inv.className}</div>
                              </td>
                              <td className="py-3 px-4 text-xs text-slate-600">
                                <div className="font-medium text-slate-800">{inv.category}</div>
                                <div className="text-slate-400">{inv.term}</div>
                              </td>
                              <td className="py-3 px-4 text-right font-mono text-xs text-slate-700 tabular-nums">
                                {schoolSettings.currencySymbol}
                                {inv.amount.toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-right font-mono text-xs font-semibold text-emerald-700 tabular-nums">
                                {schoolSettings.currencySymbol}
                                {inv.paidAmount.toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-right font-mono text-xs font-bold text-slate-900 tabular-nums">
                                {schoolSettings.currencySymbol}
                                {balance.toLocaleString()}
                              </td>
                              <td className="py-3 px-4 font-mono text-xs text-slate-600 tabular-nums">
                                {inv.dueDate}
                              </td>
                              <td className="py-3 px-4 text-xs">{renderStatusText(inv.status)}</td>
                              <td className="py-3 px-4 text-right">
                                {balance > 0 ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setRecordingPaymentInvoiceId(inv.id);
                                      setPaymentAmountInput(String(balance));
                                    }}
                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 whitespace-nowrap cursor-pointer"
                                  >
                                    Record Payment
                                  </button>
                                ) : (
                                  <span className="text-xs font-semibold text-emerald-600">Cleared</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== VIEW 7: TEACHERS ==================== */}
          {activeTab === 'teachers' && (
            <div className="bg-white border border-fuchsia-100 rounded-xl overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-fuchsia-50/70 via-purple-50/50 to-indigo-50/70 border-b border-fuchsia-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-purple-950">Academic Faculty Roster</h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Departmental assignments, teaching loads, and direct contact directory
                  </p>
                </div>
                <span className="text-xs font-bold text-fuchsia-700 tabular-nums">
                  {INITIAL_TEACHERS.length} Faculty Members
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-fuchsia-100 bg-fuchsia-50/40 text-xs font-bold text-purple-950">
                      <th className="py-3 px-4">Staff ID</th>
                      <th className="py-3 px-4">Instructor Name</th>
                      <th className="py-3 px-4">Department & Qualification</th>
                      <th className="py-3 px-4">Assigned Grades</th>
                      <th className="py-3 px-4 text-right">Weekly Load</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {INITIAL_TEACHERS.map((tch) => (
                      <tr key={tch.id} className="hover:bg-fuchsia-50/30">
                        <td className="py-3 px-4 font-mono text-xs font-semibold text-fuchsia-700 tabular-nums">
                          {tch.id}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{tch.name}</div>
                          <div className="text-xs text-indigo-600">{tch.email}</div>
                        </td>
                        <td className="py-3 px-4 text-xs">
                          <div className="font-semibold text-purple-900">{tch.department}</div>
                          <div className="text-slate-500">{tch.qualification}</div>
                        </td>
                        <td className="py-3 px-4 text-xs font-medium text-indigo-700">{tch.classesAssigned}</td>
                        <td className="py-3 px-4 text-right font-mono text-xs font-semibold text-slate-800 tabular-nums">
                          {tch.workloadHours} hrs/wk
                        </td>
                        <td className="py-3 px-4 text-xs">{renderStatusText(tch.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== VIEW 8: CLASSES & ROOMS ==================== */}
          {activeTab === 'classes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {INITIAL_CLASSES.map((cls) => {
                const theme = GRADE_THEMES[cls.name] || GRADE_THEMES['Grade 10'];
                const fillPct = Math.round((cls.enrolled / cls.capacity) * 100);
                return (
                  <div
                    key={cls.id}
                    className="bg-white border border-indigo-100 rounded-xl overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className={`h-2 w-full bg-gradient-to-r ${theme.headerStrip}`} />
                      <div className="p-5">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className={`font-mono font-bold tabular-nums ${theme.text}`}>{cls.id}</span>
                          <span className="font-medium text-slate-600">{cls.room}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mt-1">
                          {cls.name} · Section {cls.section}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1">
                          Form Tutor: <strong className="text-indigo-900">{cls.classTeacher}</strong>
                        </p>

                        <div className="mt-4 space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Room Capacity Utilization</span>
                            <span className="font-mono font-semibold text-slate-800 tabular-nums">{fillPct}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${theme.bar} rounded-full`} style={{ width: `${fillPct}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="tabular-nums text-slate-600">
                        Enrolled: <strong className="text-slate-900">{cls.enrolled} / {cls.capacity}</strong>
                      </div>
                      <div className="tabular-nums text-emerald-700 font-bold">
                        {cls.avgAttendance}% avg attendance
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ==================== VIEW 9: EXAMINATIONS ==================== */}
          {activeTab === 'examinations' && (
            <div className="bg-white border border-rose-100 rounded-xl overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-rose-50/70 via-pink-50/40 to-orange-50/70 border-b border-rose-100">
                <h2 className="text-base font-bold text-rose-950">Examination & Assessment Schedule</h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Term 1 continuous assessments, laboratory practicals, and grading status
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-rose-100 bg-rose-50/40 text-xs font-bold text-rose-950">
                      <th className="py-3 px-4">Code</th>
                      <th className="py-3 px-4">Assessment Title</th>
                      <th className="py-3 px-4">Subject & Grade</th>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Venue</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {INITIAL_EXAMS.map((ex) => (
                      <tr key={ex.id} className="hover:bg-rose-50/30">
                        <td className="py-3 px-4 font-mono text-xs font-semibold text-rose-600 tabular-nums">
                          {ex.id}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">{ex.title}</td>
                        <td className="py-3 px-4 text-xs font-medium text-indigo-700">
                          {ex.subject} · {ex.className}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-slate-700 tabular-nums">
                          {ex.date} ({ex.time})
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600">{ex.venue}</td>
                        <td className="py-3 px-4 text-xs">{renderStatusText(ex.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== VIEW 10: COLORFUL TIMETABLE ==================== */}
          {activeTab === 'timetable' && (
            <div className="bg-white border border-sky-100 rounded-xl overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-sky-50/80 via-indigo-50/50 to-purple-50/80 border-b border-sky-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-indigo-950">Master Academic Timetable</h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Color-coded weekly period matrix across senior and junior secondary blocks
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Schedule</span>
                </button>
              </div>
              <div className="overflow-x-auto p-4">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-indigo-100 text-xs font-bold text-indigo-950">
                      <th className="py-3 px-3">Period</th>
                      <th className="py-3 px-3">Monday</th>
                      <th className="py-3 px-3">Tuesday</th>
                      <th className="py-3 px-3">Wednesday</th>
                      <th className="py-3 px-3">Thursday</th>
                      <th className="py-3 px-3">Friday</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {INITIAL_TIMETABLE.map((row) => (
                      <tr key={row.period}>
                        <td className="py-3 px-3 font-mono font-bold text-indigo-950 tabular-nums whitespace-nowrap">
                          {row.period}
                        </td>
                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((dayKey) => (
                          <td key={dayKey} className="p-1.5">
                            <div
                              className={`px-3 py-2.5 rounded-lg border font-semibold ${getTimetableCellColor(
                                row[dayKey]
                              )}`}
                            >
                              {row[dayKey]}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== VIEW 11: HOMEWORK ==================== */}
          {activeTab === 'homework' && (
            <div className="space-y-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newHomework.title.trim()) return;
                  const created = {
                    id: `HW-${300 + homeworkList.length + 1}`,
                    title: newHomework.title.trim(),
                    subject: newHomework.subject,
                    className: newHomework.className,
                    assignedBy: newHomework.assignedBy,
                    dueDate: newHomework.dueDate,
                    submissions: '0 / 26',
                    status: 'Active'
                  };
                  setHomeworkList([created, ...homeworkList]);
                  setNewHomework({ ...newHomework, title: '' });
                  showToast(`Published homework assignment: ${created.title}`);
                }}
                className="bg-gradient-to-r from-orange-50 via-amber-50/60 to-rose-50 border border-orange-200 rounded-xl p-5 flex flex-col md:flex-row md:items-end gap-4"
              >
                <div className="flex-1">
                  <label className="block text-xs font-bold text-orange-950 mb-1">
                    Assignment Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newHomework.title}
                    onChange={(e) => setNewHomework({ ...newHomework, title: e.target.value })}
                    placeholder="e.g. Electrochemistry Problem Set #4"
                    className="w-full px-3 py-2 text-sm bg-white border border-orange-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-orange-950 mb-1">Subject</label>
                  <select
                    value={newHomework.subject}
                    onChange={(e) => setNewHomework({ ...newHomework, subject: e.target.value })}
                    className="px-3 py-2 text-sm border border-orange-200 rounded-lg bg-white"
                  >
                    <option>Mathematics</option>
                    <option>Physics</option>
                    <option>Chemistry</option>
                    <option>Computer Science</option>
                    <option>English Literature</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-orange-950 mb-1">Class</label>
                  <select
                    value={newHomework.className}
                    onChange={(e) => setNewHomework({ ...newHomework, className: e.target.value })}
                    className="px-3 py-2 text-sm border border-orange-200 rounded-lg bg-white"
                  >
                    {['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-orange-950 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newHomework.dueDate}
                    onChange={(e) => setNewHomework({ ...newHomework, dueDate: e.target.value })}
                    className="px-3 py-2 text-sm bg-white border border-orange-200 rounded-lg tabular-nums"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-rose-500 rounded-lg hover:from-orange-600 hover:to-rose-600 whitespace-nowrap cursor-pointer"
                >
                  Post Assignment
                </button>
              </form>

              <div className="bg-white border border-orange-100 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-orange-100 bg-orange-50/50 text-xs font-bold text-orange-950">
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">Assignment</th>
                      <th className="py-3 px-4">Class & Subject</th>
                      <th className="py-3 px-4">Instructor</th>
                      <th className="py-3 px-4">Due Date</th>
                      <th className="py-3 px-4 text-right">Submissions</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {homeworkList.map((hw) => (
                      <tr key={hw.id} className="hover:bg-orange-50/30">
                        <td className="py-3 px-4 font-mono text-xs font-semibold text-orange-600 tabular-nums">
                          {hw.id}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">{hw.title}</td>
                        <td className="py-3 px-4 text-xs font-medium text-indigo-700">
                          {hw.className} · {hw.subject}
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600">{hw.assignedBy}</td>
                        <td className="py-3 px-4 font-mono text-xs text-slate-700 tabular-nums">{hw.dueDate}</td>
                        <td className="py-3 px-4 text-right font-mono text-xs font-semibold text-slate-800 tabular-nums">
                          {hw.submissions}
                        </td>
                        <td className="py-3 px-4 text-xs">{renderStatusText(hw.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== VIEW 12: PARENTS / GUARDIANS ==================== */}
          {activeTab === 'parents' && (
            <div className="bg-white border border-pink-100 rounded-xl overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-pink-50/70 via-rose-50/50 to-purple-50/70 border-b border-pink-100">
                <h2 className="text-base font-bold text-rose-950">Parents & Guardians Directory</h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Linked household contacts for enrolled students across all grades
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-pink-100 bg-pink-50/40 text-xs font-bold text-rose-950">
                      <th className="py-3 px-4">Guardian Name</th>
                      <th className="py-3 px-4">Relationship</th>
                      <th className="py-3 px-4">Ward / Student</th>
                      <th className="py-3 px-4">Telephone</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Residential Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {students.map((stu) => (
                      <tr key={stu.id} className="hover:bg-pink-50/30">
                        <td className="py-3 px-4 font-semibold text-slate-900">{stu.guardianName}</td>
                        <td className="py-3 px-4 text-xs font-medium text-pink-700">
                          {stu.guardianRelation || 'Guardian'}
                        </td>
                        <td className="py-3 px-4 text-xs font-semibold text-indigo-900">
                          {stu.firstName} {stu.lastName} ({stu.className})
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-slate-700 tabular-nums">{stu.phone}</td>
                        <td className="py-3 px-4 text-xs text-sky-700 font-medium">{stu.email}</td>
                        <td className="py-3 px-4 text-xs text-slate-500">{stu.address}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== VIEW 13: EXPENSES ==================== */}
          {activeTab === 'expenses' && (
            <div className="space-y-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newExpense.title.trim() || !newExpense.amount) return;
                  const created = {
                    id: `EXP-${400 + expensesList.length + 1}`,
                    date: new Date().toISOString().slice(0, 10),
                    title: newExpense.title.trim(),
                    department: newExpense.department,
                    vendor: newExpense.vendor.trim() || 'Campus Supplier',
                    amount: Number(newExpense.amount),
                    status: 'Approved'
                  };
                  setExpensesList([created, ...expensesList]);
                  setNewExpense({ title: '', department: 'Sciences', vendor: '', amount: '' });
                  showToast(`Logged operational expense: ${created.title}`);
                }}
                className="bg-gradient-to-r from-teal-50 via-emerald-50/60 to-cyan-50 border border-teal-200 rounded-xl p-5 flex flex-col md:flex-row md:items-end gap-4"
              >
                <div className="flex-1">
                  <label className="block text-xs font-bold text-teal-950 mb-1">
                    Expense Description
                  </label>
                  <input
                    type="text"
                    required
                    value={newExpense.title}
                    onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                    placeholder="e.g. Auditorium Audio Mixer Maintenance"
                    className="w-full px-3 py-2 text-sm bg-white border border-teal-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-teal-950 mb-1">Vendor</label>
                  <input
                    type="text"
                    value={newExpense.vendor}
                    onChange={(e) => setNewExpense({ ...newExpense, vendor: e.target.value })}
                    placeholder="Vendor Ltd"
                    className="px-3 py-2 text-sm bg-white border border-teal-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-teal-950 mb-1">
                    Amount ({schoolSettings.currencySymbol})
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    placeholder="450"
                    className="px-3 py-2 text-sm bg-white border border-teal-200 rounded-lg w-32 tabular-nums"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-600 rounded-lg hover:from-teal-700 hover:to-emerald-700 whitespace-nowrap cursor-pointer"
                >
                  Log Expense
                </button>
              </form>

              <div className="bg-white border border-teal-100 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-teal-100 bg-teal-50/50 text-xs font-bold text-teal-950">
                      <th className="py-3 px-4">Voucher ID</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">Department & Vendor</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {expensesList.map((exp) => (
                      <tr key={exp.id} className="hover:bg-teal-50/30">
                        <td className="py-3 px-4 font-mono text-xs font-semibold text-teal-700 tabular-nums">
                          {exp.id}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-slate-600 tabular-nums">{exp.date}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900">{exp.title}</td>
                        <td className="py-3 px-4 text-xs text-slate-600">
                          <span className="font-semibold text-indigo-700">{exp.department}</span> · {exp.vendor}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-xs font-bold text-slate-900 tabular-nums">
                          {schoolSettings.currencySymbol}
                          {exp.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-xs">{renderStatusText(exp.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== VIEW 14: PAYROLL ==================== */}
          {activeTab === 'payroll' && (
            <div className="bg-white border border-indigo-100 rounded-xl overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-indigo-50/80 via-violet-50/50 to-sky-50/80 border-b border-indigo-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-indigo-950">Monthly Staff Payroll Ledger</h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    October 2026 salary schedule, allowances, statutory deductions, and net disbursement
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-indigo-700 tabular-nums">
                  Total Net: {schoolSettings.currencySymbol}
                  {INITIAL_PAYROLL.reduce((s, p) => s + p.netPay, 0).toLocaleString()}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-indigo-100 bg-indigo-50/40 text-xs font-bold text-indigo-950">
                      <th className="py-3 px-4">Payroll Ref</th>
                      <th className="py-3 px-4">Staff Member</th>
                      <th className="py-3 px-4 text-right">Base Salary</th>
                      <th className="py-3 px-4 text-right">Allowances</th>
                      <th className="py-3 px-4 text-right">Deductions</th>
                      <th className="py-3 px-4 text-right">Net Pay</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {INITIAL_PAYROLL.map((pay) => (
                      <tr key={pay.id} className="hover:bg-indigo-50/30">
                        <td className="py-3 px-4 font-mono text-xs font-semibold text-indigo-600 tabular-nums">
                          {pay.id}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{pay.name}</div>
                          <div className="text-xs text-purple-700 font-medium">{pay.role}</div>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-xs text-slate-700 tabular-nums">
                          {schoolSettings.currencySymbol}
                          {pay.baseSalary.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-xs font-semibold text-emerald-600 tabular-nums">
                          +{schoolSettings.currencySymbol}
                          {pay.allowances.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-xs font-semibold text-rose-600 tabular-nums">
                          -{schoolSettings.currencySymbol}
                          {pay.deductions.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-xs font-bold text-indigo-950 tabular-nums">
                          {schoolSettings.currencySymbol}
                          {pay.netPay.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-xs">{renderStatusText(pay.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== VIEW 15: REPORTS ==================== */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/60 border border-emerald-200 rounded-xl p-6 space-y-4">
                  <h2 className="text-base font-bold text-emerald-950">Academic Honor Roll (GPA ≥ 3.80)</h2>
                  <p className="text-xs text-slate-600">
                    Students qualifying for the Principal’s Commendation List in Term 1
                  </p>
                  <div className="divide-y divide-emerald-100 text-sm">
                    {students
                      .filter((s) => Number(s.gpa) >= 3.8)
                      .sort((a, b) => b.gpa - a.gpa)
                      .map((stu) => (
                        <div key={stu.id} className="py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-8 h-8 rounded-lg text-white text-xs font-bold flex items-center justify-center shrink-0 ${getAvatarGradient(
                                stu.id
                              )}`}
                            >
                              {stu.firstName[0]}
                              {stu.lastName[0]}
                            </span>
                            <div>
                              <div className="font-semibold text-slate-900">
                                {stu.firstName} {stu.lastName}
                              </div>
                              <div className="text-xs text-slate-500">
                                {stu.admissionNo} · {stu.className}
                              </div>
                            </div>
                          </div>
                          <div className="font-mono text-sm font-bold text-emerald-700 tabular-nums">
                            GPA {Number(stu.gpa).toFixed(2)}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-50/60 via-white to-sky-50/60 border border-indigo-200 rounded-xl p-6 space-y-4">
                  <h2 className="text-base font-bold text-indigo-950">Financial & Operations Summary</h2>
                  <p className="text-xs text-slate-600">
                    Consolidated revenue vs. campus operational expenditure
                  </p>
                  <dl className="divide-y divide-indigo-100 text-sm">
                    <div className="py-3 flex justify-between">
                      <dt className="text-slate-600">Gross Tuition Billed</dt>
                      <dd className="font-mono font-bold text-indigo-950 tabular-nums">
                        {schoolSettings.currencySymbol}
                        {metrics.totalBilled.toLocaleString()}
                      </dd>
                    </div>
                    <div className="py-3 flex justify-between">
                      <dt className="text-slate-600">Realized Fee Receipts</dt>
                      <dd className="font-mono font-bold text-emerald-600 tabular-nums">
                        {schoolSettings.currencySymbol}
                        {metrics.totalCollected.toLocaleString()}
                      </dd>
                    </div>
                    <div className="py-3 flex justify-between">
                      <dt className="text-slate-600">Total Non-Payroll Expenses</dt>
                      <dd className="font-mono font-bold text-rose-600 tabular-nums">
                        {schoolSettings.currencySymbol}
                        {expensesList.reduce((acc, e) => acc + e.amount, 0).toLocaleString()}
                      </dd>
                    </div>
                    <div className="py-3 flex justify-between">
                      <dt className="text-slate-600">Collection Efficiency Ratio</dt>
                      <dd className="font-mono font-bold text-indigo-600 tabular-nums">
                        {metrics.collectionRate}%
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}

          {/* ==================== VIEW 16: SETTINGS ==================== */}
          {activeTab === 'settings' && (
            <div className="bg-white border border-indigo-100 rounded-xl overflow-hidden max-w-2xl">
              <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white">
                <h2 className="text-base font-bold">Institution & Academic Session Settings</h2>
                <p className="text-xs text-indigo-100 mt-0.5">
                  Configure school branding, active term labels, and currency formatting across all views
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast('Saved institution settings to browser storage');
                }}
                className="p-6 space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-indigo-950 mb-1">
                    Institution Name
                  </label>
                  <input
                    type="text"
                    value={schoolSettings.schoolName}
                    onChange={(e) => setSchoolSettings({ ...schoolSettings, schoolName: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-indigo-200 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-indigo-950 mb-1">
                      Academic Year
                    </label>
                    <input
                      type="text"
                      value={schoolSettings.academicYear}
                      onChange={(e) => setSchoolSettings({ ...schoolSettings, academicYear: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-indigo-200 rounded-lg tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-indigo-950 mb-1">
                      Current Term
                    </label>
                    <input
                      type="text"
                      value={schoolSettings.currentTerm}
                      onChange={(e) => setSchoolSettings({ ...schoolSettings, currentTerm: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-indigo-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-indigo-950 mb-1">
                      Principal / Head of School
                    </label>
                    <input
                      type="text"
                      value={schoolSettings.principalName}
                      onChange={(e) => setSchoolSettings({ ...schoolSettings, principalName: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-indigo-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-indigo-950 mb-1">
                      Currency Symbol
                    </label>
                    <select
                      value={schoolSettings.currencySymbol}
                      onChange={(e) => setSchoolSettings({ ...schoolSettings, currencySymbol: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-indigo-200 rounded-lg bg-white"
                    >
                      <option value="$">USD ($)</option>
                      <option value="₦">NGN (₦)</option>
                      <option value="£">GBP (£)</option>
                      <option value="€">EUR (€)</option>
                      <option value="GH₵">GHS (GH₵)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-indigo-950 mb-1">
                    Campus Address
                  </label>
                  <input
                    type="text"
                    value={schoolSettings.campusAddress}
                    onChange={(e) => setSchoolSettings({ ...schoolSettings, campusAddress: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-indigo-200 rounded-lg"
                  />
                </div>

                <div className="pt-4 border-t border-indigo-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleResetDemoData}
                    className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Reset All Local Storage Data
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors cursor-pointer"
                  >
                    Save Settings
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
