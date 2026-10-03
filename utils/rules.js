// utils/rules.js
// Registration rules and chart-data builders for FlexSwap.
// Plain functions with no React or state: they take data in and return a
// result, so App.js and the components can call them during render.

import { MIN_CREDITS, WEEKDAYS } from '../data/mockData';

// Rest parameters ("...values") collect any number of extra arguments,
// then the spread inside console.log expands them back out again.
export function devLog(label, ...values) {
  console.log(`[FlexSwap] ${label}:`, ...values);
}

export function computeTotalCredits(courses) {
  return courses.reduce((sum, item) => sum + item.credits, 0);
}

export function isScheduleValid(courses, minCredits = MIN_CREDITS) {
  return computeTotalCredits(courses) >= minCredits;
}

// A course can never be dropped if it's Core or Must-Take (previous-semester
// failures / missed courses, in real FLEX terms).
export function isDropLocked(course) {
  return course.type === 'Core' || course.type === 'Must-Take';
}

// Returns the ids that must be removed together: the course itself, plus its
// paired lab/theory course if one exists.
export function getCascadeDropIds(course) {
  return course.linkedId ? [course.id, course.linkedId] : [course.id];
}

// Credit hours removed by dropping `course`, including its linked lab/theory
// partner if it has one.
export function computeDropCredits(course, allCourses) {
  const ids = getCascadeDropIds(course);
  return computeTotalCredits(allCourses.filter((c) => ids.includes(c.id)));
}

// A swap can only be *accepted* if the accepting student is currently in
// exactly the section the poster wants — otherwise it isn't a real 1-to-1
// trade, just someone grabbing a seat. `myCourse` may be undefined if the
// student isn't enrolled in that course at all.
export function validateSwapAcceptance(myCourse, marketItem) {
  if (!myCourse) {
    return { ok: false, reason: `You are not enrolled in ${marketItem.courseCode}.` };
  }
  // Strict equality ("===") on purpose — section codes are short strings
  // and we never want a "==" coercion surprise deciding a registration swap.
  if (myCourse.section === marketItem.currentSection) {
    return { ok: false, reason: 'You are already in that section.' };
  }
  if (myCourse.section !== marketItem.desiredSection) {
    return {
      ok: false,
      reason: `This trade needs someone in Section ${marketItem.desiredSection}. You're in ${myCourse.section}.`,
    };
  }
  return { ok: true, reason: '' };
}

export function validateSwapProposal(course, desiredSection) {
  if (!course) return 'Please select a course to swap.';
  if (!desiredSection.trim()) return 'Please enter a target section.';
  if (course.section.toUpperCase() === desiredSection.trim().toUpperCase()) {
    return 'Target section must be different from your current section.';
  }
  return '';
}

// Builds the pie-chart dataset: total credits grouped by course type.
export function buildCreditsByType(courses) {
  const totals = { Core: 0, 'Must-Take': 0, Elective: 0 };
  courses.forEach((c) => {
    if (totals[c.type] !== undefined) totals[c.type] += c.credits;
  });
  return [
    { name: 'Core', credits: totals.Core, color: '#10B981', legendFontColor: '#333', legendFontSize: 12 },
    { name: 'Must-Take', credits: totals['Must-Take'], color: '#EF4444', legendFontColor: '#333', legendFontSize: 12 },
    { name: 'Elective', credits: totals.Elective, color: '#3B82F6', legendFontColor: '#333', legendFontSize: 12 },
  ];
}

// Builds the bar-chart dataset: for each weekday, the sum of credit hours of
// every enrolled course that meets on that day.
export function buildWeeklyLoad(courses) {
  const totalsByDay = WEEKDAYS.reduce((acc, day) => ({ ...acc, [day]: 0 }), {});
  courses.forEach((course) => {
    (course.days || []).forEach((day) => {
      if (totalsByDay[day] !== undefined) totalsByDay[day] += course.credits;
    });
  });
  return {
    labels: WEEKDAYS,
    datasets: [{ data: WEEKDAYS.map((day) => totalsByDay[day]) }],
  };
}

// Simulated network call. Real FLEX has no public API a student project can
// hit, so this stands in for `fetch(...).then(res => res.json())` — same
// async shape, just resolving from local mock data after a short delay
// instead of a server round-trip.
export function fetchSwapMarket(initialData) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(initialData), 700);
  });
}