# FlexSwap: P2P Section Matcher & Rule Guard

A React Native (Expo) app that helps university students trade course sections with each other without breaking registration rules.

## The problem: the "FLEX Deadlock"

Students register through FLEX, the university's registration portal. Three real university policies combine to leave students stuck in sections they don't want:

1. **Core and Must-Take courses are locked.** A Core course, or a Must-Take course (one failed or missed in an earlier semester), cannot be dropped. A student who wants a different section can't drop it and re-add it in another section.
2. **There is a credit-hour floor.** A schedule must stay at or above the minimum credit hours (12 CH). Dropping a course that takes the student below the floor still goes through, but the course is automatically re-registered after the registration deadline.
3. **Section changes are 1-to-1 swaps.** Sections are capped, so moving from Section A to Section B only works if someone in Section B wants to move to Section A at the same time.

Together, these create a deadlock. The rules block students from changing sections themselves, and the only alternative, a direct trade, needs two students who happen to want opposite moves to find each other. Today that matching happens informally in group chats, with no way to check whether a proposed trade is valid.

## How FlexSwap addresses it

- **A swap marketplace** where students post the section they have and the section they want. Others can accept an offer directly.
- **Rule checks before any change.** A swap can only be accepted by a student who is actually in the section the poster wants, which makes it a true 1-to-1 trade. Locked courses can't be dropped, linked theory/lab courses are dropped together, and drops below the credit floor are flagged.
- **A dashboard** showing how the current schedule is made up and how the weekly load is spread.

## Features

**My Schedule**
- Course cards generated from the enrolled-courses data, each with a type badge (Core / Must-Take / Elective) and an elective group.
- A credit-hour banner that switches between "Valid Schedule" and "Below Minimum Threshold".
- Drop rules: Core/Must-Take courses are locked; dropping a theory course also drops its linked lab (and vice versa); dropping below 12 CH shows a warning and adds an auto re-registration notice.

**Market**
- A list of swap offers, with a loading indicator while offers load.
- A search box that filters offers by course code, with separate empty states for "no offers" and "no matches".
- *Accept & Swap* checks eligibility and updates your section. *Cancel Offer* withdraws your own offer.
- Your offers for a course are removed automatically if you drop that course.

**+ Trade**
- A form to propose a swap: select an enrolled course, then enter the target section.
- Validation: a course must be selected, the target section can't be empty, and it must differ from your current section. Errors are shown inline.

**Analytics**
- A Pie chart of credit hours by course type.
- A Bar chart of credit hours per weekday.
- Both charts are built with `react-native-chart-kit` and recalculate from the current schedule.

**Feedback**
- Every action shows an inline, dismissible banner (error / warning / success) under the view switcher.

## Project structure

```
App.js                    State, event handlers and view switching
components/
  UI.js                   Badge, EmptyState, ViewSwitcher, SwitcherChip
  CourseCard.js           One enrolled course with its drop button
  SwapCard.js             One marketplace offer (accept / cancel)
  ProposeForm.js          Swap proposal form
  ScheduleBanner.js       Credit total and re-registration warning
  Dashboard.js            Pie and Bar charts
  Feedback.js             Inline feedback banner
utils/rules.js            Registration rules and chart-data builders
data/mockData.js          Starting courses, swap offers and the credit floor
theme.js                  Shared colours
```

## Running the app

**On Expo Snack:** open the project in [snack.expo.dev](https://snack.expo.dev) and scan the QR code with the Expo Go app, or use the device preview.

**Locally** (requires Node.js and the Expo Go app on your phone):

```bash
npm install
npx expo start
```

Then scan the QR code with Expo Go (Android) or the Camera app (iOS).
