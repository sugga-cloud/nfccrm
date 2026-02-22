

# NFC Digital Profile Platform — Frontend Implementation Plan

## Overview
A modern, modular SaaS frontend for an NFC-powered digital profile platform — combining a digital visiting card, mini website, portfolio, store, and SaaS dashboard into one responsive application.

**Design:** Clean, minimal SaaS UI with neutral colors, card-based layouts, subtle shadows, rounded corners, and smooth scrolling. Mobile-first, fully responsive.

---

## Phase 1: Foundation & Global Layout

- **Navbar** — Sticky top header with logo, nav links, login/register buttons, and a mobile hamburger menu
- **Footer** — Minimal footer with links and copyright
- **Routing Structure** — All routes wired up: `/:username`, `/dashboard`, `/admin`, `/login`, `/register`, `/pricing`, `/404`
- **Role-based UI** — Simple context/provider to toggle between Admin, Customer, and Guest views
- **Login & Register Pages** — Clean auth forms with email/password fields (no backend logic)
- **404 Page** — Friendly not-found page

---

## Phase 2: Public Profile Page (`/:username`)

A single-page scroll layout acting as a digital visiting card / mini website:

1. **Header Section** — Cover image, circular profile photo, name, designation, company name & description
2. **Contact & Social Section** — Action buttons for Phone, Email, WhatsApp, Google Maps + social icons (Instagram, Facebook, LinkedIn, YouTube, X) + website link
3. **QR Code Section** — QR placeholder image with Download PNG and Download PDF buttons
4. **Services Section** — Card grid with service title, description, image (mapped from placeholder array)
5. **Gallery Section** — Responsive grid of image/video cards with a lightbox modal for preview
6. **Products Section** — Product cards with image, name, description, price, Add to Cart button, and an optional Checkout button
7. **Blogs Section** — Blog cards with featured image, title, date, excerpt, and a Read More modal
8. **Business Hours Section** — Day-wise table showing open/close times with an auto Open/Closed status badge
9. **Appointment Booking** — Date picker, time slot selector, and Book button
10. **Enquiry Form** — Fields for name, phone, email, message with Submit button
11. **Bottom Contact Bar** — Add to Contact (vCard), Exchange Contact, and Share buttons

---

## Phase 3: Customer Dashboard (`/dashboard`)

- **Sidebar Navigation** — Collapsible sidebar with links: Edit Profile, Upload Media, Manage Services, Manage Products, Manage Blogs, View Enquiries, View Appointments, Download QR, Analytics
- **Edit Profile** — Form with all profile fields (mirrors the public profile data)
- **Manage Services/Products/Blogs** — Simple CRUD table views with Add/Edit/Delete actions (UI only)
- **View Enquiries & Appointments** — Read-only table views with placeholder data
- **Download QR** — QR preview with download buttons
- **Analytics** — Dashboard cards showing visits, link clicks, bookings (placeholder numbers)

---

## Phase 4: Admin Dashboard (`/admin`)

- **Sidebar Navigation** — Manage Profiles, Subscription Plans, Payment Tracking, Activate/Deactivate, User Management, Storage Monitoring, Analytics
- **Profile List** — Table of all user profiles with search and status indicators
- **Subscription Plans** — Cards displaying plan details
- **Payment History** — Table with payment records
- **Activate/Deactivate** — Toggle switches per profile
- **User Management** — User list table with role badges
- **Storage Monitoring** — Progress bars showing storage usage
- **Analytics Overview** — Summary cards and simple charts (using Recharts)

---

## Phase 5: Subscription & Pricing UI

- **Pricing Page** (`/pricing`) — Plan cards with Monthly/Yearly toggle and feature comparison
- **Auto Renewal Toggle** — Switch inside subscription settings
- **Expired Popup Modal** — "Subscription Expired – Renew to Activate" dialog

---

## Phase 6: Tech Placeholders

UI-only placeholder sections/components for:
- NFC Redirect (info card)
- QR Generator (placeholder)
- SMTP Email integration (placeholder)
- WhatsApp API (placeholder)
- Payment Gateway (placeholder)
- Google Maps API (embedded placeholder)

---

## Component Architecture

All built as reusable components:
- `ProfileHeader`, `ContactBar`, `SocialLinks`
- `ServiceCard`, `ProductCard`, `BlogCard`, `GalleryGrid`
- `BusinessHoursTable`, `AppointmentBooker`, `EnquiryForm`
- `QRSection`, `LightboxModal`
- `DashboardLayout`, `AdminLayout` (with sidebar)
- `PricingCard`, `AnalyticsCard`, `DataTable`
- `AuthForm`, `Navbar`, `Footer`, `MobileMenu`

