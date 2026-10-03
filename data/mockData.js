// data/mockData.js
// Starting data for FlexSwap. App.js copies these into state on launch; the
// course list, credit totals and dashboard charts are all computed from it.

export const MIN_CREDITS = 12;

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

// `days` lists the weekdays a course meets (used by the weekly-load chart).
// `linkedId` pairs a theory course with its lab; dropping one drops both.
export const INITIAL_COURSES = [
  {
    id: '1',
    code: 'CS1001',
    name: 'Programming Fundamentals',
    section: 'CS-A',
    type: 'Core',
    credits: 3,
    isLab: false,
    linkedId: '1L',
    days: ['Mon', 'Wed'],
  },
  {
    id: '1L',
    code: 'CS1001L',
    name: 'Programming Fundamentals Lab',
    section: 'CS-A1',
    type: 'Core',
    credits: 1,
    isLab: true,
    linkedId: '1',
    days: ['Thu'],
  },
  {
    id: '2',
    code: 'CS2002',
    name: 'Data Structures',
    section: 'CS-B',
    type: 'Must-Take',
    credits: 3,
    isLab: false,
    linkedId: null,
    days: ['Tue', 'Thu'],
  },
  {
    id: '3',
    code: 'EE1002',
    name: 'Basic Electronics',
    section: 'EE-A',
    type: 'Elective',
    group: 'EG1',
    credits: 3,
    isLab: false,
    linkedId: '3L',
    days: ['Mon', 'Wed'],
  },
  {
    id: '3L',
    code: 'EE1002L',
    name: 'Basic Electronics Lab',
    section: 'EE-A1',
    type: 'Elective',
    group: 'EG1',
    credits: 1,
    isLab: true,
    linkedId: '3',
    days: ['Tue'],
  },
  {
    id: '4',
    code: 'MG1001',
    name: 'University English',
    section: 'SE-A',
    type: 'Elective',
    group: 'EG2',
    credits: 3,
    isLab: false,
    linkedId: null,
    days: ['Fri'],
  },
];

export const INITIAL_SWAP_MARKET = [
  { id: 'm1', courseCode: 'CS1001', courseName: 'Programming Fundamentals', currentSection: 'CS-B', desiredSection: 'CS-A', offeredBy: 'Student_102' },
  { id: 'm2', courseCode: 'CS2002', courseName: 'Data Structures', currentSection: 'CS-A', desiredSection: 'CS-B', offeredBy: 'Student_405' },
  { id: 'm3', courseCode: 'EE1002', courseName: 'Basic Electronics', currentSection: 'EE-B', desiredSection: 'EE-A', offeredBy: 'Student_881' },
];