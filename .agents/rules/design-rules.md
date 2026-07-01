---
trigger: manual
---

# UI/UX Development Rule

Whenever I ask for UI, UX, components, pages, layouts, redesigns, improvements, or visual changes for this project, always follow these guidelines unless I explicitly specify otherwise.

---

# Project Context

This project is a **private web application designed exclusively for two users** (a couple).

It is **not** a commercial product, social network, messaging platform, or productivity application intended for multiple users.

Every design decision should reinforce the feeling that this is a **shared personal space** rather than a public application.

The experience should feel:

* Personal
* Warm
* Calm
* Intimate
* Lightweight
* Elegant

The interface should avoid feeling corporate, enterprise, or overly technical.

---

# Design Philosophy

Every UI decision should prioritize:

* Simplicity over complexity.
* Clarity over decoration.
* Emotional connection over excessive functionality.
* Fast interactions over feature-heavy interfaces.

Always ask yourself:

* Does this feel like a personal space shared by two people?
* Can the user accomplish the intended action in the fewest possible interactions?
* Is anything on the screen unnecessary?

If something does not directly improve the experience, it should probably not exist.

---

# Technology Stack

Always assume the project uses:

* ReactJS
* Vite
* TailwindCSS
* DaisyUI
* Lucide React

Unless explicitly requested, never recommend:

* Bootstrap
* Material UI
* Chakra UI
* Ant Design
* Bulma
* Semantic UI
* Other UI frameworks

---

# Mobile First

This application is **mobile-first**.

Every interface should be designed for smartphones before tablets or desktop.

Design primarily for widths around:

* 360px
* 375px
* 390px
* 430px

Desktop should simply be a responsive adaptation.

Never start with desktop layouts.

---

# Visual Style

The overall aesthetic should be:

* Modern
* Clean
* Warm
* Soft
* Elegant

The UI should resemble the design quality of applications like:

* Telegram
* Notion
* Spotify
* Apple applications

Use these only as inspiration, not as exact copies.

Avoid:

* Busy layouts
* Heavy borders
* Excessive shadows
* Too many colors
* Visual clutter
* Dashboard-like interfaces

---

# Minimalism

Avoid unnecessary UI elements such as:

* Statistics (unless that the current component have statistics)
* Counters (unless that the current component have statistics)
* Badges without purpose
* Complex menus
* Decorative widgets
* Unnecessary cards
* Duplicate actions

Only display information that provides immediate value to the user.

---

# Components

Prefer DaisyUI components whenever possible.

Examples:

* Button
* Card
* Modal
* Drawer
* Dropdown
* Tabs
* Input
* Textarea
* Badge
* Avatar
* Skeleton
* Toast

Only create custom components when DaisyUI cannot achieve the desired experience, and add it in the components folder separated in folders if it is for only one feature, if it is for general pursoses, add it in the root of component and not in other folder.

---

# Styling

Use:

* DaisyUI components.
* DaisyUI theme variables.
* Tailwind utility classes.
* Take in consideration that the project uses the DaisyUI themes

Avoid:

* Inline styles.
* Large custom CSS files.
* Hardcoded colors when theme variables already exist.

---

# Touch Experience

Every interaction should be comfortable on mobile.

Buttons should:

* Be at least 44×44 pixels.
* Have sufficient spacing.
* Be easy to reach with one thumb.

Avoid relying on hover interactions. Since this application is mobile-first, hover effects (such as border color changes or shadows on hover) must be changed primarily to active/click states on mobile devices (e.g. using `active:border-primary` instead of plain `hover:border-primary`, or restricting `hover:` classes with the `md:` breakpoint like `md:hover:border-primary` so they only apply on desktop/tablet widths).

---

# Navigation

Prefer mobile navigation patterns such as:

* Bottom navigation
* Floating Action Buttons (only when justified)
* Drawers
* Bottom sheets
* Simple modals

Avoid desktop-style navigation unless specifically requested.

---

# Animations

Animations should be subtle and meaningful.

Prefer:

* Fade
* Slide
* Scale
* Soft transitions

Animations should communicate state changes without becoming distracting.

Avoid flashy or excessive motion.

---

# Forms

Forms should include:

* Clear labels
* Helpful validation
* Inline error messages
* Loading indicators
* Disabled submit buttons while processing
* Mobile-friendly keyboard behavior

---
Take in consideration that always the forms are going to be inside of the Modal component.

# Lists

Lists should support when appropriate:

* Lazy loading
* Infinite scrolling
* Skeleton loading
* Empty states

Avoid long overwhelming screens.

---

# Images

Always assume:

* Lazy loading
* Responsive sizing
* WebP whenever possible
* Image optimization before upload

Optimize for bandwidth and mobile performance.

---

# Performance

Always prioritize:

* Small bundles
* Component reusability
* Efficient rendering
* Minimal re-renders
* Fast loading
* Mobile responsiveness

---

# Accessibility

Always consider:

* Semantic HTML
* Color contrast
* Readable typography
* Accessible touch targets
* Keyboard accessibility where applicable

---

# Consistency

Maintain consistency in:

* Spacing
* Typography
* Colors
* Icons
* Border radius
* Shadows
* Component behavior
* Animation timing

The application should feel like a single cohesive product rather than a collection of unrelated screens.

---

# UX States

Every component should consider:

* Loading state
* Empty state
* Error state
* Success feedback
* Disabled state

Do not leave these undefined.

---

# Response Guidelines

Whenever proposing a UI or UX improvement:

1. Explain the reasoning behind the design.
2. Explain why it improves usability.
3. Prioritize mobile interactions.
4. Keep the interface visually simple.
5. Avoid unnecessary complexity.
6. Ensure consistency with the rest of the application.
7. Consider future scalability without sacrificing simplicity.

Never optimize purely for aesthetics.

Always optimize for usability, clarity, emotional warmth, and the experience of two people sharing a private digital space.