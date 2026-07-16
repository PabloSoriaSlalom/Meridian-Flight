# Meridian Flight

## What is this?

Meridian Flight is the mobile-first passenger companion for Meridian Space, guiding travelers through the final stages of departure from the Meridian Passenger Lobby to boarding their flight.

The application guides passengers through the final stages of their departure experience, beginning when they enter the **Meridian Passenger Lobby** and ending once they are seated onboard awaiting launch.

This is **not** a native mobile application. It is a responsive mobile web experience built with Vue and designed primarily for portrait orientation on a smartphone.

Commercial space travel should feel as familiar and predictable as modern air travel. The experience should reduce uncertainty by presenting one clear action at a time, allowing passengers to move confidently through the spaceport with minimal interaction.



---

## User

### Primary User

A commercial Meridian passenger arriving at the spaceport for departure.

This is not their first flight to orbit. Commercial space travel has become routine, and passengers expect an experience that feels as organized, predictable, and intuitive as traveling through a modern airport.

By the end of the experience, users should feel:

> *"That was incredibly simple. I always knew exactly what to do next."*

---

## Design Thesis

**The best mobile experiences don't show users everything they need to know. They show them only what they need to know right now.**

---

## Experience Principles

The journey should always take priority over the interface.

Present only one primary action at a time.

Every stage should communicate one clear instruction.

Users should spend more time looking at their surroundings than looking at their phone.

The interface should support movement through the physical environment rather than compete for attention.

Large icons, generous spacing, and clear typography should communicate information quickly while walking.

The experience should feel calm, premium, and quietly confident.

Avoid unnecessary features, settings, or navigation.

Simplicity is more valuable than completeness.

---

## Product Structure

The application consists of three primary sections.

### Journey

The primary guided experience.

This is where passengers spend nearly all of their time.

The application guides them through each stage of departure by presenting one task at a time.

---

### Status

A simple operational status view providing reassurance that the departure remains on schedule.

This section communicates the readiness of the flight rather than detailed operational analytics.

---

### Pass

The passenger's digital travel wallet.

This includes the boarding credential, QR code, seat assignment, flight information, and required travel documents.

---

## Journey Structure

The experience progresses through five stages.

### Stage 1 - Passenger Lobby

The passenger has entered the Meridian Passenger Lobby.

Primary message:

**You're in the right place.**

Guide the passenger to Check-in Counter B.

Instruct them to follow the blue overhead guidance line.

Present one primary action:

**Begin Check-in**

Selecting the button initiates a short simulated processing sequence before automatically advancing to the next stage.

---

### Stage 2 - Check-in

Simulate the completion of check-in.

Processing should briefly communicate:

* Confirming reservation
* Verifying identity
* Registering baggage
* Validating travel clearance

Once complete:

Guide the passenger to Terminal C Security.

Remind them to have their Boarding Credential and Government ID ready.

Present one primary action:

**Begin Security**

---

### Stage 3 - Security

Simulate the passenger clearing security.

Display a short processing state before confirming successful screening.

Once complete:

Guide the passenger toward the Departure Lounge.

Present one primary action:

**Continue to Departure Lounge**

---

### Stage 4 - Departure Lounge

The passenger has reached the departure lounge.

Boarding will begin shortly.

Provide only the essential information needed while waiting.

Examples include:

* Boarding begins in approximately 20 minutes
* Launch remains on schedule

Present one primary action:

**Begin Boarding**

Selecting the button initiates a short simulated boarding sequence before advancing automatically.

---

### Stage 5 - Onboard

The passenger has successfully boarded.

This is the final state of the application.

Display:

* Confirmation that boarding is complete
* Seat assignment
* Live launch countdown
* Launch remains on schedule

Conclude the experience with a calm, friendly message such as:

**Enjoy the view.**

No additional actions are required.

The application has completed its purpose.

---

## Operational Status

Create a believable local JSON dataset located at:

`src/data/flight-status.json`

The data should represent the operational state of a routine commercial departure.

The purpose of the data is reassurance rather than analysis.

Include:

* Flight Number
* Vehicle Name
* Destination
* Launch Time
* Live Countdown
* Launch Window
* Vehicle Turnaround Status
* Cabin Preparation
* Fueling Status
* Final Inspection
* Weather
* Boarding Status

The countdown should update in real time.

Journey progress should update as the passenger advances through each stage.

All remaining values may remain static.

The operational data should reinforce the idea that reusable spacecraft are maintained and prepared with the same consistency as modern commercial aircraft.

---

## Interaction Model

The Journey is the primary experience.

Each stage presents:

* One large icon
* One primary headline
* One concise instruction
* One primary action

Selecting the primary action begins a short simulated processing sequence.

After a brief delay:

* The current stage is marked complete.
* The progress indicator advances.
* The next stage becomes active automatically.

No forms, authentication, backend services, GPS, QR scanning, or camera integration are required.

The application should create the impression that real-world events are being reflected digitally while remaining entirely self-contained.

---

## Responsive Behavior

The experience should be designed mobile-first.

Portrait orientation should be the primary layout.

Desktop should faithfully present the mobile experience within a centered phone-sized viewport for demonstration purposes.

The interface should remain comfortable to use with one hand.

Large touch targets, generous spacing, and glanceable information should remain consistent across screen sizes.

---

## Layout

The interface should feel closer to a premium transportation product than a traditional application.

Every screen should follow a consistent structure.

* Progress indicator
* Primary content card
* Primary action
* Bottom navigation

The layout should use generous whitespace throughout.

Avoid visual clutter.

Avoid nested cards.

Avoid dense layouts.

The experience should communicate confidence through restraint.

---

## Iconography

Large, simple icons should define each Journey stage.

Icons should communicate meaning immediately without requiring additional explanation.

Favor universally recognizable transportation and wayfinding symbols over futuristic or science-fiction imagery.

The interface should rely on visual recognition more than reading.

---

## Visual Style

Continue the Meridian visual language established in Protogen 301 and Protogen 302.

* Dark theme
* Premium presentation
* Large typography
* Large simple icons
* Generous whitespace
* Minimal interface chrome
* Restrained color palette
* Existing Meridian blue accent palette
* Subtle motion
* Calm visual hierarchy

Avoid:

* Dashboard layouts
* Dense information
* Neon sci-fi aesthetics
* Holographic interfaces
* Decorative animations
* Visual clutter
* Excessive gradients

The experience should feel timeless, premium, optimistic, and believable.

---

## Technical Requirements

* Vue 3
* TypeScript
* Vue Router
* Vuetify 3
* Local JSON data only
* No API calls
* Mobile-first responsive layout
* Portrait-first design
* Bottom navigation with Journey, Status, and Pass sections
* Simulated state transitions
* Live countdown timer
* Reuse the existing Meridian visual language established in Protogen 301 and Protogen 302
