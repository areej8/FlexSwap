import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import { INITIAL_COURSES, INITIAL_SWAP_MARKET, MIN_CREDITS } from './data/mockData';
import {
  computeTotalCredits,
  computeDropCredits,
  isScheduleValid,
  isDropLocked,
  getCascadeDropIds,
  validateSwapProposal,
  validateSwapAcceptance,
  fetchSwapMarket,
  devLog,
} from './utils/rules';
import { ViewSwitcher, EmptyState } from './components/UI';
import CourseCard from './components/CourseCard';
import SwapCard from './components/SwapCard';
import ScheduleBanner from './components/ScheduleBanner';
import ProposeForm from './components/ProposeForm';
import Dashboard from './components/Dashboard';
import Feedback from './components/Feedback';
import { colors } from './theme';

export default function App() {
  const [currentView, setCurrentView] = useState('courses'); // 'courses' | 'marketplace' | 'propose' | 'dashboard'
  const [enrolledCourses, setEnrolledCourses] = useState(INITIAL_COURSES);
  const [swapMarket, setSwapMarket] = useState([]);
  const [pendingReReg, setPendingReReg] = useState([]);
  const [isLoadingMarket, setIsLoadingMarket] = useState(true);
  const [feedback, setFeedback] = useState(null); // { type: 'error' | 'warning' | 'success', title, message }

  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [desiredSectionInput, setDesiredSectionInput] = useState('');
  const [formError, setFormError] = useState('');
  const [marketSearch, setMarketSearch] = useState('');

  // Runs once on mount (empty dependency array). `fetchSwapMarket` returns a
  // Promise that resolves with the mock offers after a short delay, standing
  // in for a request to a server; `isLoadingMarket` drives the spinner.
  useEffect(() => {
    fetchSwapMarket(INITIAL_SWAP_MARKET)
      .then((data) => {
        setSwapMarket(data);
        devLog('Loaded swap market', data.length, 'offers');
      })
      .finally(() => setIsLoadingMarket(false));
  }, []);

  // Runs whenever enrolledCourses changes: removes the student's own offers
  // for any course they are no longer enrolled in (e.g. after a drop).
  useEffect(() => {
    const enrolledCodes = enrolledCourses.map((c) => c.code);
    setSwapMarket((prev) =>
      prev.filter((item) => item.offeredBy !== 'You' || enrolledCodes.includes(item.courseCode))
    );
  }, [enrolledCourses]);

  const totalCredits = computeTotalCredits(enrolledCourses);
  const scheduleValid = isScheduleValid(enrolledCourses);

  const showFeedback = (type, title, message) => {
    setFeedback({ type, title, message });
  };

  // Switching views by hand clears any old message. handleProposeSwap calls
  // setCurrentView directly so its success message stays visible.
  const handleChangeView = (view) => {
    setFeedback(null);
    setCurrentView(view);
  };

  const handleDropCourse = (course) => {
    if (isDropLocked(course)) {
      showFeedback('error', 'FLEX Rule Violation', `Cannot drop ${course.type} course (${course.code}).`);
      return;
    }

    const linkedCourse = enrolledCourses.find((c) => c.id === course.linkedId);
    const remaining = totalCredits - computeDropCredits(course, enrolledCourses);
    const idsToRemove = getCascadeDropIds(course);
    setEnrolledCourses((prev) => prev.filter((c) => !idsToRemove.includes(c.id)));

    const droppedLabel = linkedCourse ? `${course.code} and its linked ${linkedCourse.code}` : course.code;

    // The drop still goes through, but a schedule below the credit floor is
    // flagged for automatic re-registration after the registration window.
    if (remaining < MIN_CREDITS) {
      setPendingReReg((prev) => [...prev, course.code]);
      showFeedback(
        'warning',
        'Credit Limit Warning',
        `Dropping ${droppedLabel} takes you to ${remaining} CH (minimum is ${MIN_CREDITS}). It will be auto re-registered after the deadline.`
      );
      return;
    }

    showFeedback(
      'success',
      linkedCourse ? 'Linked Course Dropped' : 'Course Dropped',
      `Dropped ${droppedLabel}. You now have ${remaining} CH.`
    );
  };

  const handleProposeSwap = () => {
    const course = enrolledCourses.find((c) => c.id === selectedCourseId);
    const error = validateSwapProposal(course, desiredSectionInput);
    if (error) {
      setFormError(error);
      return;
    }
    setFormError('');

    const newOffer = {
      id: `m_${Date.now()}`,
      courseCode: course.code,
      courseName: course.name,
      currentSection: course.section,
      desiredSection: desiredSectionInput.trim().toUpperCase(),
      offeredBy: 'You',
    };

    setSwapMarket((prev) => [newOffer, ...prev]);
    setSelectedCourseId('');
    setDesiredSectionInput('');
    showFeedback('success', 'Offer Published', `Your ${course.code} swap offer is now listed in the marketplace.`);
    setCurrentView('marketplace');
  };

  const handleAcceptSwap = (marketItem) => {
    const myCourse = enrolledCourses.find((c) => c.code === marketItem.courseCode);
    const { ok, reason } = validateSwapAcceptance(myCourse, marketItem);
    if (!ok) {
      showFeedback('error', 'Ineligible', reason);
      return;
    }

    setEnrolledCourses((prev) =>
      prev.map((c) => (c.code === marketItem.courseCode ? { ...c, section: marketItem.currentSection } : c))
    );
    setSwapMarket((prev) => prev.filter((item) => item.id !== marketItem.id));

    showFeedback(
      'success',
      'Swap Executed!',
      `Swapped ${marketItem.courseCode} to Section ${marketItem.currentSection}. Section capacities stay balanced.`
    );
  };

  const handleCancelOffer = (marketItem) => {
    setSwapMarket((prev) => prev.filter((item) => item.id !== marketItem.id));
    showFeedback('success', 'Offer Cancelled', `Your ${marketItem.courseCode} swap offer was removed from the marketplace.`);
  };

  // Case-insensitive match on course code; an empty search shows every offer.
  const visibleMarket = marketSearch.trim()
    ? swapMarket.filter((item) => item.courseCode.toUpperCase().includes(marketSearch.trim().toUpperCase()))
    : swapMarket;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>FlexSwap</Text>
        <Text style={styles.headerSub}>P2P Section Matcher & Rule Guard</Text>
      </View>

      <ViewSwitcher currentView={currentView} onChangeView={handleChangeView} marketCount={swapMarket.length} />

      <Feedback feedback={feedback} onDismiss={() => setFeedback(null)} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {currentView === 'courses' && (
          <View>
            <ScheduleBanner totalCredits={totalCredits} valid={scheduleValid} pendingReReg={pendingReReg} />
            <Text style={styles.sectionHeader}>Registered Courses</Text>
            {/* No empty state needed: Core/Must-Take courses can't be dropped, so this list never reaches zero. */}
            {enrolledCourses.map((course) => (
              <CourseCard key={course.id} course={course} onDrop={handleDropCourse} />
            ))}
          </View>
        )}

        {currentView === 'marketplace' && (
          <View>
            <Text style={styles.sectionHeader}>P2P Swap Marketplace</Text>
            <Text style={styles.sectionSub}>Accepting a swap maintains section cap equilibrium (50/50 balance).</Text>

            <TextInput
              style={styles.searchInput}
              placeholder="Search by course code (e.g. CS1001)"
              value={marketSearch}
              onChangeText={setMarketSearch}
              autoCapitalize="characters"
            />

            {isLoadingMarket ? (
              <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 24 }} />
            ) : visibleMarket.length === 0 ? (
              <EmptyState message={marketSearch ? 'No offers match that search.' : 'No active swap offers available.'} />
            ) : (
              visibleMarket.map((item) => (
                <SwapCard
                  key={item.id}
                  item={item}
                  isMine={item.offeredBy === 'You'}
                  onAccept={handleAcceptSwap}
                  onCancel={handleCancelOffer}
                />
              ))
            )}
          </View>
        )}

        {currentView === 'propose' && (
          <ProposeForm
            courses={enrolledCourses}
            selectedCourseId={selectedCourseId}
            onSelectCourse={setSelectedCourseId}
            desiredSection={desiredSectionInput}
            onChangeDesiredSection={setDesiredSectionInput}
            formError={formError}
            onSubmit={handleProposeSwap}
          />
        )}

        {currentView === 'dashboard' && <Dashboard courses={enrolledCourses} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  headerSub: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  scrollContent: { padding: 16 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 6, marginTop: 10 },
  sectionSub: { fontSize: 12, color: '#6B7280', marginBottom: 12 },
  searchInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
});
