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
  Check,
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
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'students', label: 'Students', icon: Users },
      { id: 'add-student', label: 'Enroll Student', icon: UserPlus },
      { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
      { id: 'fees', label: 'Fees & Invoices', icon: CreditCard }
    ]
  },
  {
    heading: 'Academics',
    items: [
      { id: 'teachers', label: 'Teachers', icon: GraduationCap },
      { id: 'classes', label: 'Classes & Rooms', icon: BookOpen },
      { id: 'examinations', label: 'Examinations', icon: ClipboardList },
      { id: 'timetable', label: 'Timetable', icon: Clock },
      { id: 'homework', label: 'Homework', icon: FileText }
    ]
  },
  {
    heading: 'Administration',
    items: [
      { id: 'parents', label: 'Guardians', icon: HeartHandshake },
      { id: 'expenses', label: 'Expenses', icon: Wallet },
      { id: 'payroll', label: 'Staff Payroll', icon: Briefcase },
      { id: 'reports', label: 'Analytics & Reports', icon: BarChart3 },
      { id: 'settings', label: 'School Settings', icon: Settings }
    ]
  }
];

const CLASS_OPTIONS = ['All Classes', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

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

  // Attendance State (keyed by date string -> studentId -> status: 'Present' | 'Absent' | 'Late')
  const [attendanceDate, setAttendanceDate] = useState('2026-10-28');
  const [attendanceClassFilter, setAttendanceClassFilter] = useState('All Classes');
  const [attendanceByDate, setAttendanceByDate] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore storage read error
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
      // ignore storage quota errors
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
    const computedFeeStatus = balanceNum === 0 ? 'Paid' : newStudentForm.feeStatus === 'Paid' ? 'Partial' : newStudentForm.feeStatus;

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

    // Also create a corresponding tuition invoice
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
    if (status === 'Paid' || status === 'Present' || status === 'Active' || status === 'Completed' || status === 'Disbursed' || status === 'Approved') {
      return <span className="font-medium text-emerald-700">{status}</span>;
    }
    if (status === 'Partial' || status === 'Late' || status === 'Scheduled' || status === 'Pending Approval' || status === 'On Leave') {
      return <span className="font-medium text-amber-700">{status}</span>;
    }
    if (status === 'Overdue' || status === 'Absent') {
      return <span className="font-medium text-red-700">{status}</span>;
    }
    return <span className="font-medium text-slate-700">{status}</span>;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark (plus mobile drawer button on small viewports) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg focus-visible:outline-2 focus-visible:outline-blue-600"
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
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            TopTech School Suite
          </a>
        </div>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'dashboard' ? 'border-slate-900 text-slate-900 font-semibold' : 'border-transparent'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('students')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'students' || activeTab === 'student-profile'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent'
            }`}
          >
            Students
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('attendance')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'attendance' ? 'border-slate-900 text-slate-900 font-semibold' : 'border-transparent'
            }`}
          >
            Attendance
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('fees')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'fees' ? 'border-slate-900 text-slate-900 font-semibold' : 'border-transparent'
            }`}
          >
            Fees
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'reports' ? 'border-slate-900 text-slate-900 font-semibold' : 'border-transparent'
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
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll Student</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Layout: Sidebar (256px) + Main Content Viewport */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar Navigation */}
        <aside
          className={`${
            mobileMenuOpen ? 'fixed inset-y-0 left-0 z-40 block w-64 shadow-xl' : 'hidden'
          } lg:block lg:static lg:w-64 bg-white border-r border-slate-200 shrink-0 overflow-y-auto`}
        >
          <div className="p-5 flex flex-col justify-between min-h-full">
            <div className="space-y-6">
              {mobileMenuOpen && (
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 lg:hidden">
                  <span className="text-sm font-bold text-slate-900">Navigation</span>
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
                  <p className="px-3 mb-2 text-xs font-semibold text-slate-400 tracking-tight">
                    {group.heading}
                  </p>
                  <ul className="space-y-0.5">
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
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                              isActive
                                ? 'bg-slate-900 text-white'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                          >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span className="truncate">{item.label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200 text-xs text-slate-500 space-y-2">
              <div className="font-medium text-slate-800 truncate">{schoolSettings.schoolName}</div>
              <div>
                <span>{schoolSettings.academicYear}</span>
                <span aria-hidden="true"> · </span>
                <span>{schoolSettings.currentTerm.split(' ')[0]} {schoolSettings.currentTerm.split(' ')[1]}</span>
              </div>
              <button
                type="button"
                onClick={handleResetDemoData}
                className="pt-1 text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
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
            className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Viewport */}
        <main className="flex-1 min-w-0 p-6 lg:p-8 max-w-[1360px] mx-auto w-full space-y-6">
          {/* Toast feedback banner */}
          {toastMessage && (
            <div
              role="status"
              className="bg-slate-900 text-white px-4 py-3 rounded-lg text-sm flex items-center justify-between border border-slate-800"
            >
              <span>{toastMessage}</span>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                className="text-slate-400 hover:text-white ml-4"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Contextual Workspace Header & Breadcrumb */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span>TopTech Workspace</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span>{schoolSettings.academicYear}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-800 font-medium">{activeNavLabel}</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{activeNavLabel}</h1>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={exportStudentsCSV}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Students CSV</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('attendance')}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Mark Roll Call</span>
              </button>
            </div>
          </div>

          {/* ==================== VIEW 1: DASHBOARD ==================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* 4-Column KPI Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-xs font-medium text-slate-500">Enrolled Students</p>
                  <p className="text-2xl font-bold text-slate-900 tabular-nums mt-2">
                    {metrics.totalStudents}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    <span>Across 6 academic grades</span>
                    <span aria-hidden="true"> · </span>
                    <span className="text-emerald-700 font-medium">Active session</span>
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-xs font-medium text-slate-500">Average Attendance</p>
                  <p className="text-2xl font-bold text-slate-900 tabular-nums mt-2">
                    {metrics.avgAttendance}%
                  </p>
                  <p className="text-xs text-slate-500 mt-2 tabular-nums">
                    <span>Today: {metrics.presentToday} present</span>
                    <span aria-hidden="true"> · </span>
                    <span>{metrics.absentToday} absent</span>
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-xs font-medium text-slate-500">Term Fee Revenue Collected</p>
                  <p className="text-2xl font-bold text-slate-900 tabular-nums mt-2">
                    {schoolSettings.currencySymbol}
                    {metrics.totalCollected.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 mt-2 tabular-nums">
                    <span>{metrics.collectionRate}% of billed</span>
                    <span aria-hidden="true"> · </span>
                    <span>
                      {schoolSettings.currencySymbol}
                      {metrics.totalBilled.toLocaleString()} total
                    </span>
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-xs font-medium text-slate-500">Outstanding Fee Balance</p>
                  <p className="text-2xl font-bold text-slate-900 tabular-nums mt-2">
                    {schoolSettings.currencySymbol}
                    {metrics.totalOutstanding.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    <span>{invoices.filter((i) => i.status !== 'Paid').length} open invoices</span>
                    <span aria-hidden="true"> · </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('fees')}
                      className="text-blue-600 hover:underline font-medium cursor-pointer"
                    >
                      Review ledger
                    </button>
                  </p>
                </div>
              </div>

              {/* Enrollment & Attendance Breakdown + Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {/* Left 2 Columns: Grade Enrollment & Fee Collection Chart */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div>
                        <h2 className="text-base font-semibold text-slate-900">
                          Enrollment & Attendance by Grade Level
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Live distribution of registered students and average daily attendance rate
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('classes')}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
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
                        const pctWidth = Math.min(100, Math.max(12, Math.round((count / Math.max(1, students.length)) * 220)));

                        return (
                          <div key={grade} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-slate-800">{grade}</span>
                              <div className="text-slate-500 tabular-nums">
                                <span>{count} students</span>
                                <span aria-hidden="true"> · </span>
                                <span>{avgAtt}% attendance</span>
                              </div>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full"
                                style={{ width: `${pctWidth}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
                    <div>
                      <span>Faculty-to-Student Ratio: 1:11</span>
                      <span aria-hidden="true"> · </span>
                      <span>Academic Session {schoolSettings.academicYear}</span>
                    </div>
                    <span className="tabular-nums font-medium text-slate-700">
                      Total Active Faculty: {INITIAL_TEACHERS.length} instructors
                    </span>
                  </div>
                </div>

                {/* Right Column: Quick Workflows & Upcoming Examinations */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-6">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">Administrative Actions</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Direct shortcuts to frequent registrar and bursar tasks
                    </p>

                    <div className="mt-4 grid grid-cols-1 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setActiveTab('add-student')}
                        className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-900">Register New Student</div>
                          <div className="text-xs text-slate-500">Assign admission number and class section</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('attendance')}
                        className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-900">Record Daily Attendance</div>
                          <div className="text-xs text-slate-500">Update roll call for {attendanceDate}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('fees')}
                        className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-900">Log Tuition Payment</div>
                          <div className="text-xs text-slate-500">Settle pending or partial student invoices</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-800">Next Scheduled Assessment</span>
                      <button
                        type="button"
                        onClick={() => setActiveTab('examinations')}
                        className="text-xs text-blue-600 hover:underline cursor-pointer"
                      >
                        Full calendar
                      </button>
                    </div>
                    <div className="text-sm font-medium text-slate-900">
                      Further Mathematics Mid-Term
                    </div>
                    <div className="text-xs text-slate-500 mt-1 tabular-nums">
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
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">Student Directory Snapshot</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Click any student row to inspect academic profile, guardian contact, and fee history
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('students')}
                    className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto cursor-pointer"
                  >
                    Open Full Student Directory
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500">
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
                    <tbody className="divide-y divide-slate-200 text-sm">
                      {students.slice(0, 6).map((stu) => (
                        <tr
                          key={stu.id}
                          className="hover:bg-slate-50/90 transition-colors"
                        >
                          <td className="py-3 px-4 font-mono text-xs text-slate-600 tabular-nums">
                            {stu.admissionNo}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {stu.firstName} {stu.lastName}
                          </td>
                          <td className="py-3 px-4 text-slate-600 text-xs">
                            <span>{stu.className}</span>
                            <span aria-hidden="true"> · </span>
                            <span>Sec {stu.section}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 text-xs">
                            <span>{stu.guardianName}</span>
                            <span aria-hidden="true"> · </span>
                            <span className="tabular-nums">{stu.phone}</span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-xs text-slate-700 tabular-nums">
                            {Number(stu.attendanceRate).toFixed(1)}%
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-xs text-slate-700 tabular-nums">
                            {Number(stu.gpa).toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-xs">
                            {renderStatusText(stu.feeStatus)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedStudentId(stu.id);
                                setActiveTab('student-profile');
                              }}
                              className="text-xs font-medium text-blue-600 hover:text-blue-800 whitespace-nowrap cursor-pointer"
                            >
                              View Profile
                            </button>
                          </td>
                        </tr>
                      ))}
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
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Search by student name, admission no (e.g. TT-2601), or guardian..."
                    className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Class Dropdown */}
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                    <label htmlFor="class-filter-select" className="font-medium">
                      Grade:
                    </label>
                    <select
                      id="class-filter-select"
                      value={studentClassFilter}
                      onChange={(e) => setStudentClassFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium rounded-lg px-2.5 py-2 focus:outline-none focus:border-blue-600"
                    >
                      {CLASS_OPTIONS.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Interactive Segmented Fee Status Filter */}
                  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                    {['All', 'Paid', 'Partial', 'Overdue'].map((statusOpt) => (
                      <button
                        key={statusOpt}
                        type="button"
                        onClick={() => setStudentFeeFilter(statusOpt)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          studentFeeFilter === statusOpt
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {statusOpt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Student Table */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    Showing <strong className="text-slate-900 tabular-nums">{filteredStudents.length}</strong> of{' '}
                    <strong className="text-slate-900 tabular-nums">{students.length}</strong> enrolled students
                  </span>
                  <span>Stored in browser localStorage</span>
                </div>

                {filteredStudents.length === 0 ? (
                  <div className="p-12 text-center space-y-3">
                    <p className="text-base font-semibold text-slate-900">No matching student records found</p>
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
                      className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500">
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
                      <tbody className="divide-y divide-slate-200 text-sm">
                        {filteredStudents.map((stu) => (
                          <tr key={stu.id} className="hover:bg-slate-50/90 transition-colors">
                            <td className="py-3 px-4 font-mono text-xs text-slate-600 tabular-nums">
                              {stu.admissionNo}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-semibold text-slate-900">
                                {stu.firstName} {stu.lastName}
                              </div>
                              <div className="text-xs text-slate-500">
                                <span>{stu.gender}</span>
                                <span aria-hidden="true"> · </span>
                                <span className="tabular-nums">DOB {stu.dob}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-xs text-slate-700">
                              <span>{stu.className}</span>
                              <span aria-hidden="true"> · </span>
                              <span>Section {stu.section}</span>
                            </td>
                            <td className="py-3 px-4 text-xs text-slate-600">
                              <div className="font-medium text-slate-800">{stu.guardianName}</div>
                              <div className="tabular-nums">{stu.phone}</div>
                            </td>
                            <td className="py-3 px-4 text-right font-mono text-xs text-slate-700 tabular-nums">
                              {Number(stu.attendanceRate).toFixed(1)}%
                            </td>
                            <td className="py-3 px-4 text-right font-mono text-xs text-slate-800 tabular-nums">
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
                                  className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 whitespace-nowrap cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Profile</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteStudent(stu.id)}
                                  className="text-xs text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                                  title="Delete student record"
                                  aria-label={`Delete ${stu.firstName} ${stu.lastName}`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
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
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>← Back to Student Directory</span>
                </button>
                <div className="flex items-center gap-2">
                  <label htmlFor="switch-student-select" className="text-xs text-slate-500">
                    Quick jump:
                  </label>
                  <select
                    id="switch-student-select"
                    value={selectedStudent.id}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-800"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.admissionNo} — {s.firstName} {s.lastName} ({s.className})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg font-bold shrink-0">
                      {selectedStudent.firstName[0]}
                      {selectedStudent.lastName[0]}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {selectedStudent.firstName} {selectedStudent.lastName}
                      </h2>
                      <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-1.5">
                        <span className="font-mono tabular-nums text-slate-700 font-medium">
                          {selectedStudent.admissionNo}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{selectedStudent.className}</span>
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
                      <div className="text-xs text-slate-500">Cumulative GPA</div>
                      <div className="text-lg font-bold text-slate-900 tabular-nums">
                        {Number(selectedStudent.gpa).toFixed(2)} / 4.00
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Attendance Rate</div>
                      <div className="text-lg font-bold text-slate-900 tabular-nums">
                        {Number(selectedStudent.attendanceRate).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Fee Account</div>
                      <div className="text-sm mt-0.5">{renderStatusText(selectedStudent.feeStatus)}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-900">Personal & Academic Details</h3>
                    <dl className="divide-y divide-slate-100 text-sm">
                      <div className="py-2.5 flex justify-between">
                        <dt className="text-slate-500">Student System ID</dt>
                        <dd className="font-mono text-xs text-slate-800 tabular-nums">{selectedStudent.id}</dd>
                      </div>
                      <div className="py-2.5 flex justify-between">
                        <dt className="text-slate-500">Gender & Date of Birth</dt>
                        <dd className="text-slate-800 tabular-nums">
                          {selectedStudent.gender} · {selectedStudent.dob}
                        </dd>
                      </div>
                      <div className="py-2.5 flex justify-between">
                        <dt className="text-slate-500">Blood Group</dt>
                        <dd className="text-slate-800">{selectedStudent.bloodGroup || 'O+'}</dd>
                      </div>
                      <div className="py-2.5 flex justify-between">
                        <dt className="text-slate-500">Outstanding Tuition Balance</dt>
                        <dd className="font-mono font-semibold text-slate-900 tabular-nums">
                          {schoolSettings.currencySymbol}
                          {Number(selectedStudent.balanceDue || 0).toLocaleString()}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-900">Guardian & Emergency Contact</h3>
                    <dl className="divide-y divide-slate-100 text-sm">
                      <div className="py-2.5 flex justify-between">
                        <dt className="text-slate-500">Primary Guardian</dt>
                        <dd className="font-medium text-slate-800">
                          {selectedStudent.guardianName} ({selectedStudent.guardianRelation || 'Guardian'})
                        </dd>
                      </div>
                      <div className="py-2.5 flex justify-between">
                        <dt className="text-slate-500">Direct Telephone</dt>
                        <dd className="font-mono text-xs text-slate-800 tabular-nums">{selectedStudent.phone}</dd>
                      </div>
                      <div className="py-2.5 flex justify-between">
                        <dt className="text-slate-500">Email Address</dt>
                        <dd className="text-slate-800">{selectedStudent.email}</dd>
                      </div>
                      <div className="py-2.5 flex justify-between">
                        <dt className="text-slate-500">Residential Address</dt>
                        <dd className="text-slate-800 text-right">{selectedStudent.address}</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900 mb-1.5">Faculty Advisory Notes</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{selectedStudent.notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* ==================== VIEW 4: ADD / ENROLL STUDENT ==================== */}
          {activeTab === 'add-student' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-3xl">
              <div className="pb-4 border-b border-slate-200">
                <h2 className="text-base font-semibold text-slate-900">New Student Admission Form</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Creates a persistent student record in browser storage and generates a Term 1 tuition invoice automatically.
                </p>
              </div>

              <form onSubmit={handleAddStudentSubmit} className="mt-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newStudentForm.firstName}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, firstName: e.target.value })}
                      placeholder="e.g. Tariq"
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Last Name / Surname *
                    </label>
                    <input
                      type="text"
                      required
                      value={newStudentForm.lastName}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, lastName: e.target.value })}
                      placeholder="e.g. Ibrahim"
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Gender</label>
                    <select
                      value={newStudentForm.gender}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, gender: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-600"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={newStudentForm.dob}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, dob: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Assign Class Level
                    </label>
                    <select
                      value={newStudentForm.className}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, className: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-600"
                    >
                      {['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Section</label>
                    <select
                      value={newStudentForm.section}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, section: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-600"
                    >
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Primary Guardian Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newStudentForm.guardianName}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, guardianName: e.target.value })}
                      placeholder="e.g. Mrs. Halima Ibrahim"
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Guardian Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={newStudentForm.phone}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, phone: e.target.value })}
                      placeholder="+234 803 000 0000"
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Guardian Email
                    </label>
                    <input
                      type="email"
                      value={newStudentForm.email}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, email: e.target.value })}
                      placeholder="parent@example.com"
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Initial Balance Due ({schoolSettings.currencySymbol})
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="2400"
                      value={newStudentForm.balanceDue}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, balanceDue: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 tabular-nums"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Residential Address
                  </label>
                  <input
                    type="text"
                    value={newStudentForm.address}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, address: e.target.value })}
                    placeholder="Street address, district, city"
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Academic / Medical Advisory Notes
                  </label>
                  <textarea
                    rows={3}
                    value={newStudentForm.notes}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, notes: e.target.value })}
                    placeholder="Extracurricular clubs, scholarship notes, or learning accommodations..."
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab('students')}
                    className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
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
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-xs">
                    <label htmlFor="att-date" className="font-semibold text-slate-700">
                      Roll Call Date:
                    </label>
                    <input
                      id="att-date"
                      type="date"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium tabular-nums"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <label htmlFor="att-class" className="font-semibold text-slate-700">
                      Filter Class:
                    </label>
                    <select
                      id="att-class"
                      value={attendanceClassFilter}
                      onChange={(e) => setAttendanceClassFilter(e.target.value)}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
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
                    className="px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Mark All Present
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast(`Saved attendance register for ${attendanceDate}`)}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    Save Register
                  </button>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-6 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <div>
                    <span>Session Date: </span>
                    <strong className="text-slate-900 tabular-nums">{attendanceDate}</strong>
                  </div>
                  <div className="tabular-nums">
                    <span className="text-emerald-700 font-medium">{metrics.presentToday} Present</span>
                    <span aria-hidden="true"> · </span>
                    <span className="text-amber-700 font-medium">{metrics.lateToday} Late</span>
                    <span aria-hidden="true"> · </span>
                    <span className="text-red-700 font-medium">{metrics.absentToday} Absent</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500">
                        <th className="py-3 px-4">Admission No</th>
                        <th className="py-3 px-4">Student Name</th>
                        <th className="py-3 px-4">Grade & Section</th>
                        <th className="py-3 px-4 text-right">Term Attendance %</th>
                        <th className="py-3 px-4">Current Status</th>
                        <th className="py-3 px-4 text-right">Mark Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm">
                      {students
                        .filter(
                          (s) =>
                            attendanceClassFilter === 'All Classes' ||
                            s.className === attendanceClassFilter
                        )
                        .map((stu) => {
                          const status = currentDayAttendanceMap[stu.id] || 'Present';
                          return (
                            <tr key={stu.id} className="hover:bg-slate-50/90 transition-colors">
                              <td className="py-3 px-4 font-mono text-xs text-slate-600 tabular-nums">
                                {stu.admissionNo}
                              </td>
                              <td className="py-3 px-4 font-semibold text-slate-900">
                                {stu.firstName} {stu.lastName}
                              </td>
                              <td className="py-3 px-4 text-xs text-slate-600">
                                {stu.className} · Sec {stu.section}
                              </td>
                              <td className="py-3 px-4 text-right font-mono text-xs text-slate-700 tabular-nums">
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
                                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                                        status === opt
                                          ? 'bg-white text-slate-900 shadow-xs'
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
              {/* Summary Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-xs font-medium text-slate-500">Total Invoiced (Term 1)</p>
                  <p className="text-2xl font-bold text-slate-900 tabular-nums mt-1.5">
                    {schoolSettings.currencySymbol}
                    {metrics.totalBilled.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-xs font-medium text-slate-500">Total Collected</p>
                  <p className="text-2xl font-bold text-emerald-700 tabular-nums mt-1.5">
                    {schoolSettings.currencySymbol}
                    {metrics.totalCollected.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-xs font-medium text-slate-500">Outstanding Receivables</p>
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
                  className="bg-white border border-blue-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-blue-600">Record Fee Installment</div>
                    <div className="text-sm font-bold text-slate-900">
                      Invoice {recordingPaymentInvoiceId} —{' '}
                      {invoices.find((i) => i.id === recordingPaymentInvoiceId)?.studentName}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">
                        Amount ({schoolSettings.currencySymbol})
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={paymentAmountInput}
                        onChange={(e) => setPaymentAmountInput(e.target.value)}
                        className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg w-36 tabular-nums"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer"
                    >
                      Confirm Receipt
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecordingPaymentInvoiceId(null)}
                      className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Filter Bar */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={feeSearch}
                    onChange={(e) => setFeeSearch(e.target.value)}
                    placeholder="Search invoice ID or student name..."
                    className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                  {['All', 'Paid', 'Partial', 'Overdue'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setFeeStatusFilter(st)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                        feeStatusFilter === st
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Invoices Table */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500">
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
                    <tbody className="divide-y divide-slate-200 text-sm">
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
                            <tr key={inv.id} className="hover:bg-slate-50/90 transition-colors">
                              <td className="py-3 px-4 font-mono text-xs text-slate-600 tabular-nums">
                                {inv.id}
                              </td>
                              <td className="py-3 px-4">
                                <div className="font-semibold text-slate-900">{inv.studentName}</div>
                                <div className="text-xs text-slate-500">{inv.className}</div>
                              </td>
                              <td className="py-3 px-4 text-xs text-slate-600">
                                <div>{inv.category}</div>
                                <div className="text-slate-400">{inv.term}</div>
                              </td>
                              <td className="py-3 px-4 text-right font-mono text-xs text-slate-700 tabular-nums">
                                {schoolSettings.currencySymbol}
                                {inv.amount.toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-right font-mono text-xs text-emerald-700 tabular-nums">
                                {schoolSettings.currencySymbol}
                                {inv.paidAmount.toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-right font-mono text-xs font-semibold text-slate-900 tabular-nums">
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
                                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 whitespace-nowrap cursor-pointer"
                                  >
                                    Record Payment
                                  </button>
                                ) : (
                                  <span className="text-xs text-slate-400">Cleared</span>
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
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Academic Faculty Roster</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Departmental assignments, teaching loads, and direct contact directory
                  </p>
                </div>
                <span className="text-xs text-slate-500 tabular-nums">
                  {INITIAL_TEACHERS.length} Faculty Members
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500">
                      <th className="py-3 px-4">Staff ID</th>
                      <th className="py-3 px-4">Instructor Name</th>
                      <th className="py-3 px-4">Department & Qualification</th>
                      <th className="py-3 px-4">Assigned Grades</th>
                      <th className="py-3 px-4 text-right">Weekly Load</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm">
                    {INITIAL_TEACHERS.map((tch) => (
                      <tr key={tch.id} className="hover:bg-slate-50/90">
                        <td className="py-3 px-4 font-mono text-xs text-slate-600 tabular-nums">{tch.id}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{tch.name}</div>
                          <div className="text-xs text-slate-500">{tch.email}</div>
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-700">
                          <div className="font-medium text-slate-900">{tch.department}</div>
                          <div className="text-slate-500">{tch.qualification}</div>
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600">{tch.classesAssigned}</td>
                        <td className="py-3 px-4 text-right font-mono text-xs text-slate-700 tabular-nums">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {INITIAL_CLASSES.map((cls) => (
                <div key={cls.id} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-mono tabular-nums">{cls.id}</span>
                      <span>{cls.room}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      {cls.name} · Section {cls.section}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Form Tutor: <strong className="text-slate-800">{cls.classTeacher}</strong>
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="tabular-nums text-slate-600">
                      Enrolled: <strong className="text-slate-900">{cls.enrolled} / {cls.capacity}</strong>
                    </div>
                    <div className="tabular-nums text-emerald-700 font-medium">
                      {cls.avgAttendance}% avg attendance
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ==================== VIEW 9: EXAMINATIONS ==================== */}
          {activeTab === 'examinations' && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-base font-semibold text-slate-900">Examination & Assessment Schedule</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Term 1 continuous assessments, laboratory practicals, and grading status
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500">
                      <th className="py-3 px-4">Code</th>
                      <th className="py-3 px-4">Assessment Title</th>
                      <th className="py-3 px-4">Subject & Grade</th>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Venue</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm">
                    {INITIAL_EXAMS.map((ex) => (
                      <tr key={ex.id} className="hover:bg-slate-50/90">
                        <td className="py-3 px-4 font-mono text-xs text-slate-600 tabular-nums">{ex.id}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900">{ex.title}</td>
                        <td className="py-3 px-4 text-xs text-slate-600">
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

          {/* ==================== VIEW 10: TIMETABLE ==================== */}
          {activeTab === 'timetable' && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Master Academic Timetable</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Weekly period matrix across senior and junior secondary blocks
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Schedule</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500">
                      <th className="py-3 px-4">Period</th>
                      <th className="py-3 px-4">Monday</th>
                      <th className="py-3 px-4">Tuesday</th>
                      <th className="py-3 px-4">Wednesday</th>
                      <th className="py-3 px-4">Thursday</th>
                      <th className="py-3 px-4">Friday</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs">
                    {INITIAL_TIMETABLE.map((row) => (
                      <tr key={row.period} className="hover:bg-slate-50/90">
                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                          {row.period}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">{row.monday}</td>
                        <td className="py-3.5 px-4 text-slate-700">{row.tuesday}</td>
                        <td className="py-3.5 px-4 text-slate-700">{row.wednesday}</td>
                        <td className="py-3.5 px-4 text-slate-700">{row.thursday}</td>
                        <td className="py-3.5 px-4 text-slate-700">{row.friday}</td>
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
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-end gap-4"
              >
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assignment Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newHomework.title}
                    onChange={(e) => setNewHomework({ ...newHomework, title: e.target.value })}
                    placeholder="e.g. Electrochemistry Problem Set #4"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={newHomework.subject}
                    onChange={(e) => setNewHomework({ ...newHomework, subject: e.target.value })}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                  >
                    <option>Mathematics</option>
                    <option>Physics</option>
                    <option>Chemistry</option>
                    <option>Computer Science</option>
                    <option>English Literature</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Class</label>
                  <select
                    value={newHomework.className}
                    onChange={(e) => setNewHomework({ ...newHomework, className: e.target.value })}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                  >
                    {['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newHomework.dueDate}
                    onChange={(e) => setNewHomework({ ...newHomework, dueDate: e.target.value })}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg tabular-nums"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 whitespace-nowrap cursor-pointer"
                >
                  Post Assignment
                </button>
              </form>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500">
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">Assignment</th>
                      <th className="py-3 px-4">Class & Subject</th>
                      <th className="py-3 px-4">Instructor</th>
                      <th className="py-3 px-4">Due Date</th>
                      <th className="py-3 px-4 text-right">Submissions</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm">
                    {homeworkList.map((hw) => (
                      <tr key={hw.id} className="hover:bg-slate-50/90">
                        <td className="py-3 px-4 font-mono text-xs text-slate-600 tabular-nums">{hw.id}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900">{hw.title}</td>
                        <td className="py-3 px-4 text-xs text-slate-600">
                          {hw.className} · {hw.subject}
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600">{hw.assignedBy}</td>
                        <td className="py-3 px-4 font-mono text-xs text-slate-700 tabular-nums">{hw.dueDate}</td>
                        <td className="py-3 px-4 text-right font-mono text-xs text-slate-700 tabular-nums">
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
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-base font-semibold text-slate-900">Parents & Guardians Directory</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Linked household contacts for enrolled students across all grades
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500">
                      <th className="py-3 px-4">Guardian Name</th>
                      <th className="py-3 px-4">Relationship</th>
                      <th className="py-3 px-4">Ward / Student</th>
                      <th className="py-3 px-4">Telephone</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Residential Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm">
                    {students.map((stu) => (
                      <tr key={stu.id} className="hover:bg-slate-50/90">
                        <td className="py-3 px-4 font-semibold text-slate-900">{stu.guardianName}</td>
                        <td className="py-3 px-4 text-xs text-slate-600">{stu.guardianRelation || 'Guardian'}</td>
                        <td className="py-3 px-4 text-xs text-slate-800">
                          {stu.firstName} {stu.lastName} ({stu.className})
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-slate-700 tabular-nums">{stu.phone}</td>
                        <td className="py-3 px-4 text-xs text-slate-600">{stu.email}</td>
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
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-end gap-4"
              >
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Expense Description
                  </label>
                  <input
                    type="text"
                    required
                    value={newExpense.title}
                    onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                    placeholder="e.g. Auditorium Audio Mixer Maintenance"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Vendor</label>
                  <input
                    type="text"
                    value={newExpense.vendor}
                    onChange={(e) => setNewExpense({ ...newExpense, vendor: e.target.value })}
                    placeholder="Vendor Ltd"
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Amount ({schoolSettings.currencySymbol})
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    placeholder="450"
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg w-32 tabular-nums"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 whitespace-nowrap cursor-pointer"
                >
                  Log Expense
                </button>
              </form>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500">
                      <th className="py-3 px-4">Voucher ID</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">Department & Vendor</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm">
                    {expensesList.map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-50/90">
                        <td className="py-3 px-4 font-mono text-xs text-slate-600 tabular-nums">{exp.id}</td>
                        <td className="py-3 px-4 font-mono text-xs text-slate-600 tabular-nums">{exp.date}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900">{exp.title}</td>
                        <td className="py-3 px-4 text-xs text-slate-600">
                          {exp.department} · {exp.vendor}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-xs font-semibold text-slate-900 tabular-nums">
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
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Monthly Staff Payroll Ledger</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    October 2026 salary schedule, allowances, statutory deductions, and net disbursement
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-800 tabular-nums">
                  Total Net: {schoolSettings.currencySymbol}
                  {INITIAL_PAYROLL.reduce((s, p) => s + p.netPay, 0).toLocaleString()}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500">
                      <th className="py-3 px-4">Payroll Ref</th>
                      <th className="py-3 px-4">Staff Member</th>
                      <th className="py-3 px-4 text-right">Base Salary</th>
                      <th className="py-3 px-4 text-right">Allowances</th>
                      <th className="py-3 px-4 text-right">Deductions</th>
                      <th className="py-3 px-4 text-right">Net Pay</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm">
                    {INITIAL_PAYROLL.map((pay) => (
                      <tr key={pay.id} className="hover:bg-slate-50/90">
                        <td className="py-3 px-4 font-mono text-xs text-slate-600 tabular-nums">{pay.id}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{pay.name}</div>
                          <div className="text-xs text-slate-500">{pay.role}</div>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-xs text-slate-700 tabular-nums">
                          {schoolSettings.currencySymbol}
                          {pay.baseSalary.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-xs text-emerald-700 tabular-nums">
                          +{schoolSettings.currencySymbol}
                          {pay.allowances.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-xs text-red-700 tabular-nums">
                          -{schoolSettings.currencySymbol}
                          {pay.deductions.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-xs font-bold text-slate-900 tabular-nums">
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
                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                  <h2 className="text-base font-semibold text-slate-900">Academic Honor Roll (GPA ≥ 3.80)</h2>
                  <p className="text-xs text-slate-500">
                    Students qualifying for the Principal’s Commendation List in Term 1
                  </p>
                  <div className="divide-y divide-slate-100 text-sm">
                    {students
                      .filter((s) => Number(s.gpa) >= 3.8)
                      .sort((a, b) => b.gpa - a.gpa)
                      .map((stu) => (
                        <div key={stu.id} className="py-3 flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-slate-900">
                              {stu.firstName} {stu.lastName}
                            </div>
                            <div className="text-xs text-slate-500">
                              {stu.admissionNo} · {stu.className}
                            </div>
                          </div>
                          <div className="font-mono text-sm font-bold text-emerald-700 tabular-nums">
                            GPA {Number(stu.gpa).toFixed(2)}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                  <h2 className="text-base font-semibold text-slate-900">Financial & Operations Summary</h2>
                  <p className="text-xs text-slate-500">
                    Consolidated revenue vs. campus operational expenditure
                  </p>
                  <dl className="divide-y divide-slate-100 text-sm">
                    <div className="py-3 flex justify-between">
                      <dt className="text-slate-600">Gross Tuition Billed</dt>
                      <dd className="font-mono font-semibold text-slate-900 tabular-nums">
                        {schoolSettings.currencySymbol}
                        {metrics.totalBilled.toLocaleString()}
                      </dd>
                    </div>
                    <div className="py-3 flex justify-between">
                      <dt className="text-slate-600">Realized Fee Receipts</dt>
                      <dd className="font-mono font-semibold text-emerald-700 tabular-nums">
                        {schoolSettings.currencySymbol}
                        {metrics.totalCollected.toLocaleString()}
                      </dd>
                    </div>
                    <div className="py-3 flex justify-between">
                      <dt className="text-slate-600">Total Non-Payroll Expenses</dt>
                      <dd className="font-mono font-semibold text-slate-900 tabular-nums">
                        {schoolSettings.currencySymbol}
                        {expensesList.reduce((acc, e) => acc + e.amount, 0).toLocaleString()}
                      </dd>
                    </div>
                    <div className="py-3 flex justify-between">
                      <dt className="text-slate-600">Collection Efficiency Ratio</dt>
                      <dd className="font-mono font-bold text-blue-600 tabular-nums">
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
            <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-2xl">
              <div className="pb-4 border-b border-slate-200">
                <h2 className="text-base font-semibold text-slate-900">Institution & Academic Session Settings</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure school branding, active term labels, and currency formatting across all views
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast('Saved institution settings to browser storage');
                }}
                className="mt-6 space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Institution Name
                  </label>
                  <input
                    type="text"
                    value={schoolSettings.schoolName}
                    onChange={(e) => setSchoolSettings({ ...schoolSettings, schoolName: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Academic Year
                    </label>
                    <input
                      type="text"
                      value={schoolSettings.academicYear}
                      onChange={(e) => setSchoolSettings({ ...schoolSettings, academicYear: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Current Term
                    </label>
                    <input
                      type="text"
                      value={schoolSettings.currentTerm}
                      onChange={(e) => setSchoolSettings({ ...schoolSettings, currentTerm: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Principal / Head of School
                    </label>
                    <input
                      type="text"
                      value={schoolSettings.principalName}
                      onChange={(e) => setSchoolSettings({ ...schoolSettings, principalName: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Currency Symbol
                    </label>
                    <select
                      value={schoolSettings.currencySymbol}
                      onChange={(e) => setSchoolSettings({ ...schoolSettings, currencySymbol: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg bg-white"
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Campus Address
                  </label>
                  <input
                    type="text"
                    value={schoolSettings.campusAddress}
                    onChange={(e) => setSchoolSettings({ ...schoolSettings, campusAddress: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleResetDemoData}
                    className="px-3.5 py-2 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Reset All Local Storage Data
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
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
