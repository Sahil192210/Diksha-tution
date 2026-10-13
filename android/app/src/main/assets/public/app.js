/**
 * DIKSHA TUITION - CORE APPLICATION JAVASCRIPT
 * Digital Tuition Register: Student -> Fee -> Receipt -> WhatsApp
 */

const STORAGE_KEYS = {
  STUDENTS: 'diksha_tuition_students_v1',
  FEES: 'diksha_tuition_fees_v1',
  SETTINGS: 'diksha_tuition_settings_v1',
  RECEIPT_COUNTER: 'diksha_tuition_receipt_counter_v1'
};

// Initial Sample Data for immediate preview and testing
const INITIAL_STUDENTS = [
  {
    id: 'std_101',
    name: 'Riya Sharma',
    parentName: 'Ramesh Sharma',
    mobile: '9820123456',
    whatsapp: '9820123456',
    standard: '10th Std',
    board: 'CBSE',
    schoolName: 'St. Xavier\'s High School',
    address: 'B-302, Gokul Dham Society, Station Road',
    joiningDate: '2026-06-15',
    monthlyFees: 1500,
    status: 'Current', // Current / Left
    leavingDate: ''
  },
  {
    id: 'std_102',
    name: 'Amit Patel',
    parentName: 'Suresh Patel',
    mobile: '9820234567',
    whatsapp: '9820234567',
    standard: '10th Std',
    board: 'State Board',
    schoolName: 'Model English School',
    address: 'A-12, Shanti Nagar, Link Road',
    joiningDate: '2026-06-20',
    monthlyFees: 1200,
    status: 'Current',
    leavingDate: ''
  },
  {
    id: 'std_103',
    name: 'Sneha Kulkarni',
    parentName: 'Mahesh Kulkarni',
    mobile: '9890345678',
    whatsapp: '9890345678',
    standard: '9th Std',
    board: 'CBSE',
    schoolName: 'Kendriya Vidyalaya',
    address: 'Flat 405, Green Valley',
    joiningDate: '2026-07-01',
    monthlyFees: 1400,
    status: 'Current',
    leavingDate: ''
  },
  {
    id: 'std_104',
    name: 'Rohan Verma',
    parentName: 'Deepak Verma',
    mobile: '9870456789',
    whatsapp: '9870456789',
    standard: '8th Std',
    board: 'ICSE',
    schoolName: 'St. Mary High School',
    address: 'Row House 5, Sunrise Colony',
    joiningDate: '2026-05-10',
    monthlyFees: 1100,
    status: 'Current',
    leavingDate: ''
  },
  {
    id: 'std_105',
    name: 'Kavita Joshi',
    parentName: 'Vinod Joshi',
    mobile: '9819567890',
    whatsapp: '9819567890',
    standard: '10th Std',
    board: 'State Board',
    schoolName: 'Saraswati Vidyalaya',
    address: 'Sector 8, Charkop',
    joiningDate: '2026-04-15',
    monthlyFees: 1300,
    status: 'Left',
    leavingDate: '2026-08-30'
  }
];

const INITIAL_FEES = [
  {
    id: 'fee_1001',
    receiptNo: 'DT-REC-1001',
    studentId: 'std_101',
    studentName: 'Riya Sharma',
    parentName: 'Ramesh Sharma',
    standard: '10th Std',
    month: 'October',
    date: '2026-10-05',
    amount: 1500,
    mode: 'UPI'
  },
  {
    id: 'fee_1002',
    receiptNo: 'DT-REC-1002',
    studentId: 'std_102',
    studentName: 'Amit Patel',
    parentName: 'Suresh Patel',
    standard: '10th Std',
    month: 'October',
    date: '2026-10-06',
    amount: 1200,
    mode: 'Cash'
  },
  {
    id: 'fee_1003',
    receiptNo: 'DT-REC-1003',
    studentId: 'std_101',
    studentName: 'Riya Sharma',
    parentName: 'Ramesh Sharma',
    standard: '10th Std',
    month: 'September',
    date: '2026-09-07',
    amount: 1500,
    mode: 'UPI'
  },
  {
    id: 'fee_1004',
    receiptNo: 'DT-REC-1004',
    studentId: 'std_102',
    studentName: 'Amit Patel',
    parentName: 'Suresh Patel',
    standard: '10th Std',
    month: 'September',
    date: '2026-09-05',
    amount: 1200,
    mode: 'Cash'
  },
  {
    id: 'fee_1005',
    receiptNo: 'DT-REC-1005',
    studentId: 'std_103',
    studentName: 'Sneha Kulkarni',
    parentName: 'Mahesh Kulkarni',
    standard: '9th Std',
    month: 'September',
    date: '2026-09-10',
    amount: 1400,
    mode: 'Online'
  }
];

const DEFAULT_SETTINGS = {
  tuitionName: 'Diksha Tuition',
  teacherName: 'Diksha Sharma',
  contactPhone: '9876543210',
  receiptPrefix: 'DT-REC-',
  address: 'Shop 4, Sunrise Complex, Near Station Road'
};

const MONTHS_LIST = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// App State
let state = {
  students: [],
  fees: [],
  settings: DEFAULT_SETTINGS,
  receiptCounter: 1006,
  activeView: 'dashboard',
  currentViewingStudentId: null,
  latestGeneratedReceipt: null,
  selectedWaRecipients: new Set(),
  activeWaTemplateType: 'fee'
};

// =========================================================
// INITIALIZATION
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  setupNavigation();
  setupMonthPickers();
  updateUI();
  applyWhatsAppTemplate('fee');

  // Set default today's date in form fields
  const today = new Date().toISOString().split('T')[0];
  const feeDateInput = document.getElementById('feeDate');
  const joiningDateInput = document.getElementById('joiningDate');
  if (feeDateInput) feeDateInput.value = today;
  if (joiningDateInput) joiningDateInput.value = today;

  // Mobile drawer toggle
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const sidebar = document.querySelector('.sidebar');
  if (mobileBtn && sidebar) {
    mobileBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // Register Service Worker for Mobile PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => {
      console.log('ServiceWorker registration note:', err);
    });
  }
});

function loadData() {
  try {
    const savedStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    const savedFees = localStorage.getItem(STORAGE_KEYS.FEES);
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const savedCounter = localStorage.getItem(STORAGE_KEYS.RECEIPT_COUNTER);

    state.students = savedStudents ? JSON.parse(savedStudents) : INITIAL_STUDENTS;
    state.fees = savedFees ? JSON.parse(savedFees) : INITIAL_FEES;
    state.settings = savedSettings ? { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) } : DEFAULT_SETTINGS;
    state.receiptCounter = savedCounter ? parseInt(savedCounter, 10) : 1006;
  } catch (err) {
    console.error('Error loading localStorage data:', err);
    state.students = INITIAL_STUDENTS;
    state.fees = INITIAL_FEES;
    state.settings = DEFAULT_SETTINGS;
  }
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(state.students));
    localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify(state.fees));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(state.settings));
    localStorage.setItem(STORAGE_KEYS.RECEIPT_COUNTER, state.receiptCounter.toString());
  } catch (err) {
    console.error('Error saving data to localStorage:', err);
  }
}

function setupNavigation() {
  const navButtons = document.querySelectorAll('.nav-item');
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetView = btn.getAttribute('data-view');
      navigateTo(targetView);
    });
  });
}

function navigateTo(viewId) {
  state.activeView = viewId;

  // Close mobile sidebar if open
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) sidebar.classList.remove('open');

  // Update active class on nav buttons
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-view') === viewId);
  });

  // Switch panels
  document.querySelectorAll('.view-panel').forEach(panel => {
    panel.classList.remove('active');
  });

  const activePanel = document.getElementById(`view-${viewId}`);
  if (activePanel) {
    activePanel.classList.add('active');
  }

  // Header Title & Subtitle updates
  const titleEl = document.getElementById('pageTitle');
  const subEl = document.getElementById('pageSubtitle');

  const titlesMap = {
    'dashboard': ['Dashboard', 'Tuition overview and quick register actions'],
    'current-students': ['Current Students', 'Students currently attending tuition'],
    'left-students': ['Left Students', 'Students who have stopped tuition (records preserved)'],
    'add-student': ['Add / Edit Student', 'Fill in student registration details'],
    'student-profile': ['Student Profile', 'Detailed student bio and fee transaction history'],
    'fee-records': ['Fee Records', 'All collected payments ledger'],
    'pending-fees': ['Pending Fees', 'Unpaid students for current or selected month'],
    'whatsapp': ['WhatsApp Hub', 'Direct parent messaging and fee reminders'],
    'settings': ['Settings', 'Tuition branding, header details and data backup']
  };

  if (titlesMap[viewId]) {
    titleEl.textContent = titlesMap[viewId][0];
    subEl.textContent = titlesMap[viewId][1];
  }

  // Trigger view specific rendering
  if (viewId === 'dashboard') renderDashboard();
  if (viewId === 'current-students') renderCurrentStudents();
  if (viewId === 'left-students') renderLeftStudents();
  if (viewId === 'fee-records') renderFeeRecords();
  if (viewId === 'pending-fees') renderPendingFees();
  if (viewId === 'whatsapp') renderWhatsAppView();
  if (viewId === 'settings') renderSettings();
}

function setupMonthPickers() {
  const currentMonthName = getCurrentMonthName();
  const sidebarMonth = document.getElementById('sidebarCurrentMonth');
  if (sidebarMonth) {
    const currentYear = new Date().getFullYear();
    sidebarMonth.textContent = `${currentMonthName} ${currentYear}`;
  }

  // Filter Fee Month dropdown
  const filterFeeMonth = document.getElementById('filterFeeMonth');
  if (filterFeeMonth) {
    filterFeeMonth.innerHTML = '<option value="">All Months</option>' +
      MONTHS_LIST.map(m => `<option value="${m}">${m}</option>`).join('');
  }

  // Pending Month Selector
  const pendingMonthSel = document.getElementById('pendingMonthSelector');
  if (pendingMonthSel) {
    pendingMonthSel.innerHTML = MONTHS_LIST.map(m =>
      `<option value="${m}" ${m === currentMonthName ? 'selected' : ''}>${m}</option>`
    ).join('');
  }

  // Fee modal month selector default
  const feeMonthSelect = document.getElementById('feeMonthSelect');
  if (feeMonthSelect) {
    feeMonthSelect.value = currentMonthName;
  }
}

function getCurrentMonthName() {
  const monthNames = MONTHS_LIST;
  const d = new Date();
  return monthNames[d.getMonth()];
}

function updateUI() {
  // Update sidebar branding
  const brandName = document.getElementById('sidebarBrandName');
  if (brandName) brandName.textContent = state.settings.tuitionName || 'Diksha Tuition';

  // Badges
  const currentCount = state.students.filter(s => s.status === 'Current').length;
  const leftCount = state.students.filter(s => s.status === 'Left').length;

  const currentBadge = document.getElementById('badgeCurrentCount');
  const leftBadge = document.getElementById('badgeLeftCount');
  if (currentBadge) currentBadge.textContent = currentCount;
  if (leftBadge) leftBadge.textContent = leftCount;

  // Pending count badge for current month
  const currentMonth = getCurrentMonthName();
  const pendingStudents = getPendingStudentsForMonth(currentMonth);
  const pendingBadge = document.getElementById('badgePendingCount');
  if (pendingBadge) pendingBadge.textContent = pendingStudents.length;

  renderDashboard();
}

// =========================================================
// 1. DASHBOARD
// =========================================================
function renderDashboard() {
  const currentStudents = state.students.filter(s => s.status === 'Current');
  const leftStudents = state.students.filter(s => s.status === 'Left');

  const currentMonth = getCurrentMonthName();
  const pendingList = getPendingStudentsForMonth(currentMonth);

  const totalPendingAmount = pendingList.reduce((sum, item) => sum + item.amount, 0);
  const totalCollectedAmount = state.fees.reduce((sum, f) => sum + Number(f.amount || 0), 0);

  // Set Stats Cards
  document.getElementById('dashTotalCurrent').textContent = currentStudents.length;
  document.getElementById('dashTotalLeft').textContent = leftStudents.length;
  document.getElementById('dashTotalPending').textContent = `₹${totalPendingAmount.toLocaleString('en-IN')}`;
  document.getElementById('dashPendingCountText').textContent = `${pendingList.length} students pending →`;
  document.getElementById('dashTotalCollection').textContent = `₹${totalCollectedAmount.toLocaleString('en-IN')}`;

  // Recent Fee Collections (last 5)
  const recentFees = [...state.fees].reverse().slice(0, 5);
  const recentBody = document.getElementById('dashRecentFeesBody');
  if (recentBody) {
    if (recentFees.length === 0) {
      recentBody.innerHTML = `<tr><td colspan="6" class="text-muted" style="text-align: center; padding: 2rem;">No fee records found. Click "+ Collect Fee" to start.</td></tr>`;
    } else {
      recentBody.innerHTML = recentFees.map(fee => `
        <tr>
          <td><strong>${escapeHtml(fee.studentName)}</strong></td>
          <td>${escapeHtml(fee.month)}</td>
          <td>${formatDate(fee.date)}</td>
          <td style="font-weight: 700; color: var(--emerald);">₹${Number(fee.amount).toLocaleString('en-IN')}</td>
          <td><span class="payment-mode-tag ${fee.mode.toLowerCase().includes('online') || fee.mode.toLowerCase().includes('upi') ? 'online' : ''}">${escapeHtml(fee.mode)}</span></td>
          <td>
            <button class="btn btn-xs btn-outline-primary" onclick="showReceiptById('${fee.id}')">Receipt</button>
          </td>
        </tr>
      `).join('');
    }
  }

  // Dashboard Pending Fees (Top 5)
  const pendingBody = document.getElementById('dashPendingFeesBody');
  if (pendingBody) {
    if (pendingList.length === 0) {
      pendingBody.innerHTML = `<tr><td colspan="4" class="text-emerald" style="text-align: center; padding: 2rem;">🎉 All current students have paid for ${currentMonth}!</td></tr>`;
    } else {
      pendingBody.innerHTML = pendingList.slice(0, 5).map(item => `
        <tr>
          <td><strong>${escapeHtml(item.student.name)}</strong></td>
          <td>${escapeHtml(item.student.standard)}</td>
          <td style="font-weight: 700; color: var(--danger);">₹${item.amount.toLocaleString('en-IN')}</td>
          <td>
            <button class="btn btn-xs btn-whatsapp" onclick="sendPendingFeeWhatsApp('${item.student.id}', '${currentMonth}', ${item.amount})">
              WhatsApp
            </button>
          </td>
        </tr>
      `).join('');
    }
  }
}

// Helper: Calculate pending fees for given month
function getPendingStudentsForMonth(monthName) {
  const currentStudents = state.students.filter(s => s.status === 'Current');
  const paidStudentIds = new Set(
    state.fees
      .filter(f => f.month.toLowerCase() === monthName.toLowerCase())
      .map(f => f.studentId)
  );

  return currentStudents
    .filter(s => !paidStudentIds.has(s.id))
    .map(s => ({
      student: s,
      month: monthName,
      amount: Number(s.monthlyFees || 0)
    }));
}

// =========================================================
// 2. CURRENT STUDENTS
// =========================================================
function renderCurrentStudents() {
  const search = (document.getElementById('searchCurrentStudents')?.value || '').toLowerCase().trim();
  const students = state.students.filter(s => s.status === 'Current');

  const filtered = students.filter(s => {
    return s.name.toLowerCase().includes(search) ||
           (s.mobile && s.mobile.includes(search)) ||
           (s.parentName && s.parentName.toLowerCase().includes(search));
  });

  const tbody = document.getElementById('currentStudentsTableBody');
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-muted" style="text-align: center; padding: 2.5rem;">No current students found matching "${escapeHtml(search)}".</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(s => `
    <tr>
      <td>
        <a href="javascript:void(0)" onclick="viewStudentProfile('${s.id}')" style="font-weight: 700; color: var(--primary); text-decoration: none;">
          ${escapeHtml(s.name)}
        </a>
      </td>
      <td>${escapeHtml(s.standard)}</td>
      <td>${escapeHtml(s.parentName)}</td>
      <td>
        <a href="tel:${s.mobile}" style="color: inherit; text-decoration: none;">${escapeHtml(s.mobile)}</a>
      </td>
      <td style="font-weight: 700;">₹${Number(s.monthlyFees).toLocaleString('en-IN')}</td>
      <td><span class="status-pill current">● Current</span></td>
      <td class="text-right">
        <div class="table-actions">
          <button class="btn btn-xs btn-secondary" onclick="viewStudentProfile('${s.id}')" title="View Profile">View</button>
          <button class="btn btn-xs btn-secondary" onclick="editStudent('${s.id}')" title="Edit">Edit</button>
          <button class="btn btn-xs btn-outline-primary" onclick="openFeeModalForStudent('${s.id}')" title="Collect Fee">Fee</button>
          <button class="btn btn-xs btn-whatsapp" onclick="openWhatsAppSingle('${s.id}')" title="WhatsApp">WA</button>
          <button class="btn btn-xs btn-danger-ghost" onclick="openMarkLeftModal('${s.id}')" title="Mark as Left">Left</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function filterCurrentStudents() {
  renderCurrentStudents();
}

// =========================================================
// 3. LEFT STUDENTS
// =========================================================
function renderLeftStudents() {
  const search = (document.getElementById('searchLeftStudents')?.value || '').toLowerCase().trim();
  const students = state.students.filter(s => s.status === 'Left');

  const filtered = students.filter(s => {
    return s.name.toLowerCase().includes(search) ||
           (s.mobile && s.mobile.includes(search)) ||
           (s.parentName && s.parentName.toLowerCase().includes(search));
  });

  const tbody = document.getElementById('leftStudentsTableBody');
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-muted" style="text-align: center; padding: 2.5rem;">No left students recorded.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(s => `
    <tr>
      <td>
        <a href="javascript:void(0)" onclick="viewStudentProfile('${s.id}')" style="font-weight: 700; color: var(--text-main); text-decoration: none;">
          ${escapeHtml(s.name)}
        </a>
      </td>
      <td>${escapeHtml(s.standard)}</td>
      <td>${escapeHtml(s.parentName)}</td>
      <td>${escapeHtml(s.mobile)}</td>
      <td>${s.leavingDate ? formatDate(s.leavingDate) : 'Not specified'}</td>
      <td><span class="status-pill left">Left</span></td>
      <td class="text-right">
        <div class="table-actions">
          <button class="btn btn-xs btn-secondary" onclick="viewStudentProfile('${s.id}')">View</button>
          <button class="btn btn-xs btn-secondary" onclick="editStudent('${s.id}')">Edit</button>
          <button class="btn btn-xs btn-outline-primary" onclick="reEnrollStudent('${s.id}')" title="Restore to Current">Re-enroll</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function filterLeftStudents() {
  renderLeftStudents();
}

function reEnrollStudent(id) {
  const student = state.students.find(s => s.id === id);
  if (!student) return;
  if (confirm(`Do you want to re-enroll ${student.name} as a Current student?`)) {
    student.status = 'Current';
    student.leavingDate = '';
    saveData();
    updateUI();
    renderLeftStudents();
    showToast(`${student.name} is now marked as Current student!`);
  }
}

// Mark Student Left Modal
function openMarkLeftModal(id) {
  const student = state.students.find(s => s.id === id);
  if (!student) return;

  document.getElementById('markLeftStudentId').value = id;
  document.getElementById('markLeftConfirmText').innerHTML = 
    `Mark <strong>${escapeHtml(student.name)}</strong> (${escapeHtml(student.standard)}) as Left? Their fee history will remain preserved.`;
  
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('markLeavingDateInput').value = today;

  document.getElementById('markLeftModalOverlay').classList.add('open');
}

function closeMarkLeftModal() {
  document.getElementById('markLeftModalOverlay').classList.remove('open');
}

function handleConfirmMarkLeft(e) {
  e.preventDefault();
  const id = document.getElementById('markLeftStudentId').value;
  const leavingDate = document.getElementById('markLeavingDateInput').value;

  const student = state.students.find(s => s.id === id);
  if (!student) return;

  student.status = 'Left';
  student.leavingDate = leavingDate;

  saveData();
  closeMarkLeftModal();
  updateUI();
  renderCurrentStudents();
  showToast(`Marked ${student.name} as Left.`);
}

// =========================================================
// 4. ADD / EDIT STUDENT
// =========================================================
function showAddStudentForm() {
  document.getElementById('studentEditId').value = '';
  document.getElementById('studentRecordForm').reset();
  document.getElementById('studentFormTitle').textContent = 'Add New Student';
  document.getElementById('studentFormSubtitle').textContent = 'Fill in student details to enroll in the tuition register';

  const today = new Date().toISOString().split('T')[0];
  document.getElementById('joiningDate').value = today;
  document.getElementById('studentStatus').value = 'Current';
  toggleLeavingDateField();

  navigateTo('add-student');
}

function editStudent(id) {
  const student = state.students.find(s => s.id === id);
  if (!student) return;

  document.getElementById('studentEditId').value = student.id;
  document.getElementById('studentName').value = student.name || '';
  document.getElementById('parentName').value = student.parentName || '';
  document.getElementById('mobileNumber').value = student.mobile || '';
  document.getElementById('whatsappNumber').value = student.whatsapp || '';
  document.getElementById('standard').value = student.standard || '';
  document.getElementById('board').value = student.board || 'CBSE';
  document.getElementById('schoolName').value = student.schoolName || '';
  document.getElementById('monthlyFees').value = student.monthlyFees || '';
  document.getElementById('joiningDate').value = student.joiningDate || '';
  document.getElementById('studentStatus').value = student.status || 'Current';
  document.getElementById('leavingDate').value = student.leavingDate || '';
  document.getElementById('address').value = student.address || '';

  document.getElementById('studentFormTitle').textContent = `Edit Student: ${student.name}`;
  document.getElementById('studentFormSubtitle').textContent = 'Update student contact or fee details';

  toggleLeavingDateField();
  navigateTo('add-student');
}

function toggleLeavingDateField() {
  const status = document.getElementById('studentStatus').value;
  const leavingGroup = document.getElementById('leavingDateGroup');
  if (leavingGroup) {
    leavingGroup.style.display = status === 'Left' ? 'block' : 'none';
  }
}

function handleSaveStudent(e) {
  e.preventDefault();
  const editId = document.getElementById('studentEditId').value;

  const name = document.getElementById('studentName').value.trim();
  const parentName = document.getElementById('parentName').value.trim();
  const mobile = document.getElementById('mobileNumber').value.trim();
  let whatsapp = document.getElementById('whatsappNumber').value.trim();
  if (!whatsapp) whatsapp = mobile;

  const standard = document.getElementById('standard').value;
  const board = document.getElementById('board').value;
  const schoolName = document.getElementById('schoolName').value.trim();
  const monthlyFees = Number(document.getElementById('monthlyFees').value);
  const joiningDate = document.getElementById('joiningDate').value;
  const status = document.getElementById('studentStatus').value;
  const leavingDate = status === 'Left' ? document.getElementById('leavingDate').value : '';
  const address = document.getElementById('address').value.trim();

  if (editId) {
    // Update existing student
    const student = state.students.find(s => s.id === editId);
    if (student) {
      student.name = name;
      student.parentName = parentName;
      student.mobile = mobile;
      student.whatsapp = whatsapp;
      student.standard = standard;
      student.board = board;
      student.schoolName = schoolName;
      student.monthlyFees = monthlyFees;
      student.joiningDate = joiningDate;
      student.status = status;
      student.leavingDate = leavingDate;
      student.address = address;

      // Also update studentName in past fee entries for consistency
      state.fees.forEach(f => {
        if (f.studentId === editId) {
          f.studentName = name;
          f.parentName = parentName;
          f.standard = standard;
        }
      });
      showToast(`Updated details for ${name}`);
    }
  } else {
    // Create new student
    const newStudent = {
      id: 'std_' + Date.now(),
      name,
      parentName,
      mobile,
      whatsapp,
      standard,
      board,
      schoolName,
      monthlyFees,
      joiningDate,
      status,
      leavingDate,
      address
    };
    state.students.unshift(newStudent);
    showToast(`Added new student: ${name}`);
  }

  saveData();
  updateUI();
  navigateTo(status === 'Left' ? 'left-students' : 'current-students');
}

// =========================================================
// 5. STUDENT PROFILE
// =========================================================
function viewStudentProfile(id) {
  const student = state.students.find(s => s.id === id);
  if (!student) return;

  state.currentViewingStudentId = id;

  // Header info
  const initials = student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  document.getElementById('profileAvatarText').textContent = initials;
  document.getElementById('profileName').textContent = student.name;
  
  const statusBadge = document.getElementById('profileStatusBadge');
  statusBadge.textContent = student.status;
  statusBadge.className = `status-pill ${student.status === 'Current' ? 'current' : 'left'}`;

  document.getElementById('profileStandardBadge').textContent = student.standard || '-';
  document.getElementById('profileBoardText').textContent = student.board || 'CBSE';
  document.getElementById('profileSchoolText').textContent = student.schoolName || 'Not specified';

  // Details
  document.getElementById('profileParent').textContent = student.parentName || '-';
  document.getElementById('profileMobile').textContent = student.mobile || '-';
  document.getElementById('profileWhatsApp').textContent = student.whatsapp || student.mobile || '-';
  document.getElementById('profileFeeAmount').textContent = `₹${Number(student.monthlyFees).toLocaleString('en-IN')}`;
  document.getElementById('profileJoiningDate').textContent = student.joiningDate ? formatDate(student.joiningDate) : '-';
  document.getElementById('profileAddress').textContent = student.address || '-';

  const leavingRow = document.getElementById('profileLeavingDateRow');
  if (student.status === 'Left' && student.leavingDate) {
    leavingRow.style.display = 'flex';
    document.getElementById('profileLeavingDate').textContent = formatDate(student.leavingDate);
  } else {
    leavingRow.style.display = 'none';
  }

  // Buttons in profile
  document.getElementById('profileEditBtn').onclick = () => editStudent(student.id);
  document.getElementById('profileWhatsAppBtn').onclick = () => openWhatsAppSingle(student.id);
  document.getElementById('profileCollectFeeBtn').onclick = () => openFeeModalForStudent(student.id);
  document.getElementById('profileHistoryAddFeeBtn').onclick = () => openFeeModalForStudent(student.id);

  // Fee History Table
  const historyBody = document.getElementById('profileFeeHistoryBody');
  const studentFees = state.fees.filter(f => f.studentId === student.id).reverse();

  if (studentFees.length === 0) {
    historyBody.innerHTML = `<tr><td colspan="5" class="text-muted" style="text-align: center; padding: 2rem;">No fees recorded for this student yet.</td></tr>`;
  } else {
    historyBody.innerHTML = studentFees.map(fee => `
      <tr>
        <td><strong>${escapeHtml(fee.month)}</strong></td>
        <td>${formatDate(fee.date)}</td>
        <td style="font-weight: 700; color: var(--emerald);">₹${Number(fee.amount).toLocaleString('en-IN')}</td>
        <td><span class="payment-mode-tag ${fee.mode.toLowerCase().includes('online') || fee.mode.toLowerCase().includes('upi') ? 'online' : ''}">${escapeHtml(fee.mode)}</span></td>
        <td>
          <button class="btn btn-xs btn-outline-primary" onclick="showReceiptById('${fee.id}')">View Receipt</button>
        </td>
      </tr>
    `).join('');
  }

  navigateTo('student-profile');
}

// =========================================================
// 6. FEE ENTRY & RECEIPT GENERATION
// =========================================================
function openFeeModal(preselectedStudentId = null) {
  const modal = document.getElementById('feeModalOverlay');
  const select = document.getElementById('feeStudentSelect');
  
  // Populate students list (Current first, then left)
  const currentList = state.students.filter(s => s.status === 'Current');
  const leftList = state.students.filter(s => s.status === 'Left');

  select.innerHTML = '<option value="">-- Choose Student --</option>' +
    currentList.map(s => `<option value="${s.id}">${escapeHtml(s.name)} (${escapeHtml(s.standard)})</option>`).join('') +
    (leftList.length ? '<optgroup label="Left Students">' + leftList.map(s => `<option value="${s.id}">${escapeHtml(s.name)} (Left)</option>`).join('') + '</optgroup>' : '');

  if (preselectedStudentId) {
    select.value = preselectedStudentId;
    handleFeeStudentChange();
  } else {
    document.getElementById('feeAmount').value = '';
  }

  const today = new Date().toISOString().split('T')[0];
  document.getElementById('feeDate').value = today;
  document.getElementById('feeMonthSelect').value = getCurrentMonthName();

  modal.classList.add('open');
}

function openFeeModalForStudent(studentId) {
  openFeeModal(studentId);
}

function closeFeeModal() {
  document.getElementById('feeModalOverlay').classList.remove('open');
}

function handleFeeStudentChange() {
  const studentId = document.getElementById('feeStudentSelect').value;
  const student = state.students.find(s => s.id === studentId);
  const amountInput = document.getElementById('feeAmount');
  if (student && amountInput) {
    amountInput.value = student.monthlyFees || '';
  }
}

function handleSaveFee(e) {
  e.preventDefault();
  const studentId = document.getElementById('feeStudentSelect').value;
  const month = document.getElementById('feeMonthSelect').value;
  const date = document.getElementById('feeDate').value;
  const amount = Number(document.getElementById('feeAmount').value);
  const mode = document.getElementById('feePaymentMode').value;

  const student = state.students.find(s => s.id === studentId);
  if (!student) {
    alert('Please select a student');
    return;
  }

  const receiptNo = `${state.settings.receiptPrefix}${state.receiptCounter}`;
  state.receiptCounter++;

  const feeRecord = {
    id: 'fee_' + Date.now(),
    receiptNo,
    studentId: student.id,
    studentName: student.name,
    parentName: student.parentName,
    standard: student.standard,
    board: student.board,
    month,
    date,
    amount,
    mode
  };

  state.fees.push(feeRecord);
  saveData();
  closeFeeModal();
  updateUI();

  // If in student profile, refresh that profile
  if (state.activeView === 'student-profile' && state.currentViewingStudentId === student.id) {
    viewStudentProfile(student.id);
  }

  showToast(`Fee payment recorded! Receipt: ${receiptNo}`);

  // Display receipt immediately as requested in specs: "Receipt Generated -> Download Receipt / Send on WhatsApp"
  showReceipt(feeRecord);
}

// Receipt Modal display
function showReceipt(feeRecord) {
  state.latestGeneratedReceipt = feeRecord;
  const modal = document.getElementById('receiptModalOverlay');

  document.getElementById('recTuitionName').textContent = state.settings.tuitionName || 'Diksha Tuition';
  document.getElementById('recTuitionSub').textContent = state.settings.address || '';
  document.getElementById('recNumber').textContent = feeRecord.receiptNo;
  document.getElementById('recDate').textContent = formatDate(feeRecord.date);
  document.getElementById('recStudentName').textContent = feeRecord.studentName;
  document.getElementById('recParentName').textContent = feeRecord.parentName || '-';
  document.getElementById('recStandard').textContent = `${feeRecord.standard || ''} ${feeRecord.board ? '(' + feeRecord.board + ')' : ''}`;
  document.getElementById('recMonth').textContent = feeRecord.month;
  document.getElementById('recMode').textContent = feeRecord.mode;
  document.getElementById('recAmount').textContent = `₹${Number(feeRecord.amount).toLocaleString('en-IN')}`;
  document.getElementById('recTeacherSign').textContent = state.settings.teacherName ? `Authorized Signature (${state.settings.teacherName})` : 'Authorized Signature';

  modal.classList.add('open');
}

function showReceiptById(feeId) {
  const fee = state.fees.find(f => f.id === feeId);
  if (fee) {
    showReceipt(fee);
  }
}

function closeReceiptModal() {
  document.getElementById('receiptModalOverlay').classList.remove('open');
}

function printReceipt() {
  window.print();
}

function sendReceiptOnWhatsApp() {
  if (!state.latestGeneratedReceipt) return;
  const fee = state.latestGeneratedReceipt;
  const student = state.students.find(s => s.id === fee.studentId);
  const phone = student ? (student.whatsapp || student.mobile) : '';

  const tuitionName = state.settings.tuitionName || 'Diksha Tuition';
  const message = `*FEE PAYMENT RECEIPT - ${tuitionName}*
----------------------------------------
Receipt No: *${fee.receiptNo}*
Date: *${formatDate(fee.date)}*
Student: *${fee.studentName}*
Parent: *${fee.parentName}*
Class: *${fee.standard}*
Fee Month: *${fee.month}*
Amount Received: *₹${fee.amount.toLocaleString('en-IN')}*
Payment Mode: *${fee.mode}*
Status: *PAID (Thank You)*
----------------------------------------
Thank you for your payment!`;

  openWhatsAppUrl(phone, message);
}

// =========================================================
// 7. FEE RECORDS LEDGER
// =========================================================
function renderFeeRecords() {
  const search = (document.getElementById('searchFeeRecords')?.value || '').toLowerCase().trim();
  const filterMonth = document.getElementById('filterFeeMonth')?.value || '';
  const filterMode = document.getElementById('filterFeeMode')?.value || '';

  const filtered = [...state.fees].reverse().filter(f => {
    const matchesSearch = f.studentName.toLowerCase().includes(search) || (f.receiptNo && f.receiptNo.toLowerCase().includes(search));
    const matchesMonth = !filterMonth || f.month.toLowerCase() === filterMonth.toLowerCase();
    const matchesMode = !filterMode || f.mode.toLowerCase().includes(filterMode.toLowerCase());
    return matchesSearch && matchesMonth && matchesMode;
  });

  const tbody = document.getElementById('feeRecordsTableBody');
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-muted" style="text-align: center; padding: 2.5rem;">No fee transactions match the selected filters.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(fee => `
    <tr>
      <td>
        <strong style="color: var(--text-main);">${escapeHtml(fee.studentName)}</strong>
        <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(fee.receiptNo)}</div>
      </td>
      <td>${escapeHtml(fee.month)}</td>
      <td>${formatDate(fee.date)}</td>
      <td class="text-right" style="font-weight: 700; color: var(--emerald);">₹${Number(fee.amount).toLocaleString('en-IN')}</td>
      <td><span class="payment-mode-tag ${fee.mode.toLowerCase().includes('online') || fee.mode.toLowerCase().includes('upi') ? 'online' : ''}">${escapeHtml(fee.mode)}</span></td>
      <td class="text-right">
        <div class="table-actions">
          <button class="btn btn-xs btn-outline-primary" onclick="showReceiptById('${fee.id}')">Receipt</button>
          <button class="btn btn-xs btn-whatsapp" onclick="sendDirectReceiptWhatsApp('${fee.id}')">WhatsApp</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function filterFeeRecords() {
  renderFeeRecords();
}

function sendDirectReceiptWhatsApp(feeId) {
  const fee = state.fees.find(f => f.id === feeId);
  if (fee) {
    state.latestGeneratedReceipt = fee;
    sendReceiptOnWhatsApp();
  }
}

// =========================================================
// 8. PENDING FEES
// =========================================================
function renderPendingFees() {
  const monthSelector = document.getElementById('pendingMonthSelector');
  const selectedMonth = monthSelector ? monthSelector.value : getCurrentMonthName();

  const pendingList = getPendingStudentsForMonth(selectedMonth);
  const tbody = document.getElementById('pendingFeesTableBody');
  if (!tbody) return;

  if (pendingList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-emerald" style="text-align: center; padding: 2.5rem;">✨ Excellent! All current students have paid their fees for ${escapeHtml(selectedMonth)}.</td></tr>`;
    return;
  }

  tbody.innerHTML = pendingList.map(item => `
    <tr>
      <td>
        <a href="javascript:void(0)" onclick="viewStudentProfile('${item.student.id}')" style="font-weight: 700; color: var(--primary); text-decoration: none;">
          ${escapeHtml(item.student.name)}
        </a>
      </td>
      <td>${escapeHtml(item.student.standard)}</td>
      <td>${escapeHtml(item.student.parentName)}</td>
      <td><span style="font-weight: 600;">${escapeHtml(item.month)}</span></td>
      <td class="text-right" style="font-weight: 700; color: var(--danger);">₹${item.amount.toLocaleString('en-IN')}</td>
      <td class="text-right">
        <div class="table-actions">
          <button class="btn btn-xs btn-whatsapp" onclick="sendPendingFeeWhatsApp('${item.student.id}', '${item.month}', ${item.amount})">
            WhatsApp Reminder
          </button>
          <button class="btn btn-xs btn-outline-primary" onclick="openFeeModalForStudent('${item.student.id}')">
            Collect Fee
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function sendPendingFeeWhatsApp(studentId, month, amount) {
  const student = state.students.find(s => s.id === studentId);
  if (!student) return;

  const phone = student.whatsapp || student.mobile;
  const tuitionName = state.settings.tuitionName || 'Diksha Tuition';
  const message = `Dear ${student.parentName || 'Parent'}, please note that the tuition fee for ${student.name} for the month of *${month}* (₹${amount.toLocaleString('en-IN')}) is pending at *${tuitionName}*. Kindly submit it at your convenience. Thank you.`;

  openWhatsAppUrl(phone, message);
}

function broadcastPendingReminders() {
  const monthSelector = document.getElementById('pendingMonthSelector');
  const selectedMonth = monthSelector ? monthSelector.value : getCurrentMonthName();
  const pendingList = getPendingStudentsForMonth(selectedMonth);

  if (pendingList.length === 0) {
    alert(`No pending fees for ${selectedMonth}!`);
    return;
  }

  // Pre-select all these students in the WhatsApp view
  state.selectedWaRecipients = new Set(pendingList.map(item => item.student.id));
  applyWhatsAppTemplate('fee');
  navigateTo('whatsapp');
  showToast(`Selected ${pendingList.length} pending students in WhatsApp Hub`);
}

// =========================================================
// 9. WHATSAPP HUB & TEMPLATES
// =========================================================
const WA_TEMPLATES = {
  fee: `Dear {PARENT}, please note that the tuition fee for {STUDENT} for the month of {MONTH} (₹{AMOUNT}) is pending at {TUITION}. Kindly submit it at your convenience. Thank you.`,
  holiday: `Dear {PARENT}, please note that {TUITION} will remain closed on account of upcoming holidays/festival. Regular classes will resume as informed. Thank you.`,
  general: `Dear {PARENT}, this is an update regarding {STUDENT}'s studies and progress at {TUITION}. Please ensure regular revision at home. Feel free to contact us for any queries. Thank you.`
};

function renderWhatsAppView() {
  const currentStudents = state.students.filter(s => s.status === 'Current');
  const listContainer = document.getElementById('recipientsCheckboxList');
  const search = (document.getElementById('searchRecipientsInput')?.value || '').toLowerCase().trim();

  if (!listContainer) return;

  const filtered = currentStudents.filter(s => 
    s.name.toLowerCase().includes(search) || 
    (s.parentName && s.parentName.toLowerCase().includes(search)) ||
    (s.mobile && s.mobile.includes(search))
  );

  if (filtered.length === 0) {
    listContainer.innerHTML = '<div class="text-muted" style="padding: 1rem; text-align: center;">No matching current students.</div>';
    return;
  }

  listContainer.innerHTML = filtered.map(s => {
    const isChecked = state.selectedWaRecipients.has(s.id);
    return `
      <label class="recipient-item" for="chk_${s.id}">
        <input type="checkbox" id="chk_${s.id}" value="${s.id}" ${isChecked ? 'checked' : ''} onchange="toggleWaRecipient('${s.id}', this.checked)">
        <div class="recipient-info">
          <span class="recipient-name">${escapeHtml(s.name)}</span>
          <span class="recipient-meta">${escapeHtml(s.standard)} • Parent: ${escapeHtml(s.parentName)} (${escapeHtml(s.whatsapp || s.mobile)})</span>
        </div>
      </label>
    `;
  }).join('');

  updateWaRecipientCount();
  updateWaPreview();
}

function filterRecipientsList() {
  renderWhatsAppView();
}

function toggleWaRecipient(id, isChecked) {
  if (isChecked) {
    state.selectedWaRecipients.add(id);
  } else {
    state.selectedWaRecipients.delete(id);
  }
  updateWaRecipientCount();
  updateWaPreview();
}

function selectAllRecipients(all = true) {
  const currentStudents = state.students.filter(s => s.status === 'Current');
  if (all) {
    state.selectedWaRecipients = new Set(currentStudents.map(s => s.id));
  } else {
    state.selectedWaRecipients.clear();
  }
  renderWhatsAppView();
}

function updateWaRecipientCount() {
  const countEl = document.getElementById('selectedRecipientCount');
  if (countEl) {
    countEl.textContent = `${state.selectedWaRecipients.size} Selected`;
  }
}

function applyWhatsAppTemplate(templateType) {
  state.activeWaTemplateType = templateType;
  const chips = document.querySelectorAll('.template-chips .chip');
  chips.forEach(c => c.classList.remove('active'));

  const chipMap = { fee: 0, holiday: 1, general: 2 };
  if (chips[chipMap[templateType]]) {
    chips[chipMap[templateType]].classList.add('active');
  }

  const textarea = document.getElementById('waMessageText');
  if (textarea && WA_TEMPLATES[templateType]) {
    textarea.value = WA_TEMPLATES[templateType];
    updateWaPreview();
  }
}

function updateWaPreview() {
  const previewBubble = document.getElementById('waPreviewBubble');
  const textarea = document.getElementById('waMessageText');
  if (!previewBubble || !textarea) return;

  const rawMsg = textarea.value;

  if (state.selectedWaRecipients.size === 0) {
    previewBubble.textContent = "Please select at least 1 student from the left panel to preview personalized message.";
    return;
  }

  // Get the first selected student
  const firstId = Array.from(state.selectedWaRecipients)[0];
  const student = state.students.find(s => s.id === firstId);

  if (student) {
    const personalized = buildPersonalizedMessage(rawMsg, student);
    previewBubble.textContent = personalized;
  }
}

function buildPersonalizedMessage(template, student) {
  const currentMonth = getCurrentMonthName();
  const tuitionName = state.settings.tuitionName || 'Diksha Tuition';
  return template
    .replace(/{STUDENT}/g, student.name)
    .replace(/{PARENT}/g, student.parentName || 'Parent')
    .replace(/{MONTH}/g, currentMonth)
    .replace(/{AMOUNT}/g, Number(student.monthlyFees || 0).toLocaleString('en-IN'))
    .replace(/{TUITION}/g, tuitionName);
}

// Send WhatsApp batch or single
function handleSendWhatsAppBatch() {
  if (state.selectedWaRecipients.size === 0) {
    alert('Please select at least one student recipient.');
    return;
  }

  const rawMsg = document.getElementById('waMessageText').value.trim();
  if (!rawMsg) {
    alert('Please enter a message to send.');
    return;
  }

  const recipients = Array.from(state.selectedWaRecipients)
    .map(id => state.students.find(s => s.id === id))
    .filter(Boolean);

  if (recipients.length === 1) {
    const student = recipients[0];
    const phone = student.whatsapp || student.mobile;
    const finalMsg = buildPersonalizedMessage(rawMsg, student);
    openWhatsAppUrl(phone, finalMsg);
    showToast(`WhatsApp chat opened for ${student.name}`);
  } else {
    // For multiple recipients: Open first one and prompt for subsequent or show send list
    const firstStudent = recipients[0];
    const phone = firstStudent.whatsapp || firstStudent.mobile;
    const finalMsg = buildPersonalizedMessage(rawMsg, firstStudent);
    openWhatsAppUrl(phone, finalMsg);
    
    showToast(`Opened WhatsApp for ${firstStudent.name}. ${recipients.length - 1} more ready in batch.`);
    
    // Provide user-friendly guidance for WhatsApp web limits
    setTimeout(() => {
      alert(`Sent to ${firstStudent.name} (${recipients[0].parentName}). You have ${recipients.length - 1} more selected students. Since browsers restrict opening multiple simultaneous tabs, you can click on each individual student's 'WA' button or proceed sequentially.`);
    }, 1000);
  }
}

function openWhatsAppSingle(studentId) {
  state.selectedWaRecipients = new Set([studentId]);
  applyWhatsAppTemplate('fee');
  navigateTo('whatsapp');
}

function openWhatsAppUrl(phoneNumber, message) {
  let cleaned = (phoneNumber || '').replace(/[^0-9]/g, '');
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned; // default India prefix for 10-digit mobile numbers
  }
  const encodedText = encodeURIComponent(message);
  const waUrl = `https://api.whatsapp.com/send?phone=${cleaned}&text=${encodedText}`;
  window.open(waUrl, '_blank');
}

// Live preview typing event
document.addEventListener('input', (e) => {
  if (e.target && e.target.id === 'waMessageText') {
    updateWaPreview();
  }
});

// =========================================================
// 10. SETTINGS & DATA BACKUP / RESTORE
// =========================================================
function renderSettings() {
  document.getElementById('settingsTuitionName').value = state.settings.tuitionName || 'Diksha Tuition';
  document.getElementById('settingsTeacherName').value = state.settings.teacherName || '';
  document.getElementById('settingsContactPhone').value = state.settings.contactPhone || '';
  document.getElementById('settingsReceiptPrefix').value = state.settings.receiptPrefix || 'DT-REC-';
  document.getElementById('settingsTuitionAddress').value = state.settings.address || '';
}

function handleSaveSettings(e) {
  e.preventDefault();
  state.settings.tuitionName = document.getElementById('settingsTuitionName').value.trim();
  state.settings.teacherName = document.getElementById('settingsTeacherName').value.trim();
  state.settings.contactPhone = document.getElementById('settingsContactPhone').value.trim();
  state.settings.receiptPrefix = document.getElementById('settingsReceiptPrefix').value.trim();
  state.settings.address = document.getElementById('settingsTuitionAddress').value.trim();

  saveData();
  updateUI();
  showToast('Settings saved successfully!');
}

function exportDataBackup() {
  const exportPayload = {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    settings: state.settings,
    receiptCounter: state.receiptCounter,
    students: state.students,
    fees: state.fees
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const dlAnchorElem = document.createElement('a');
  dlAnchorElem.setAttribute("href", dataStr);
  const dateTag = new Date().toISOString().split('T')[0];
  dlAnchorElem.setAttribute("download", `diksha_tuition_backup_${dateTag}.json`);
  dlAnchorElem.click();
  showToast('Backup file downloaded!');
}

function importDataBackup(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.students && Array.isArray(data.students)) {
        state.students = data.students;
        state.fees = data.fees || [];
        state.settings = data.settings || DEFAULT_SETTINGS;
        state.receiptCounter = data.receiptCounter || 1001;

        saveData();
        updateUI();
        showToast('Data restored successfully!');
      } else {
        alert('Invalid backup file format');
      }
    } catch (err) {
      alert('Error parsing backup JSON file');
    }
  };
  reader.readAsText(file);
}

function resetToDemoData() {
  if (confirm('Reset register to original sample student & fee data? (All custom additions will be replaced)')) {
    state.students = JSON.parse(JSON.stringify(INITIAL_STUDENTS));
    state.fees = JSON.parse(JSON.stringify(INITIAL_FEES));
    state.settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    state.receiptCounter = 1006;
    saveData();
    updateUI();
    showToast('Reset to demo sample data successfully.');
  }
}

// =========================================================
// UTILITY FUNCTIONS
// =========================================================
function formatDate(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = String(d.getDate()).padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return dateStr;
  }
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}
