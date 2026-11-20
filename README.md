# Campus Drinking Water Issue Reporter

A simple college project that lets students report drinking water problems on campus and track their status.

This app uses only **HTML5**, **CSS3**, and **vanilla JavaScript**. Complaints are saved in the browser with **localStorage**. There is no backend, database, or framework.

## How to run the project locally

1. Open the `campus-water-reporter` folder.
2. Double-click `index.html`, or right-click it and open it in Chrome, Edge, or Firefox.
3. You do not need to install anything or start a server.

If you later open the files through a live server, that works too. The important file is still `index.html`.

## What each file does

- `index.html` — page structure: sidebar, dashboard, report form, and reports table.
- `style.css` — layout, colours, cards, table, and mobile/tablet responsive styles.
- `script.js` — form validation, localStorage, search/filter, status updates, and page switching.
- `README.md` — this guide.

## How the application works

The site is a **single-page app**. All three screens live in one HTML file. JavaScript shows one screen at a time:

1. **Dashboard** — counts total, pending, in progress, and resolved reports. It also lists the five newest complaints.
2. **Report an Issue** — a form that validates required fields, creates a unique ID such as `CWR-0004`, and saves the complaint.
3. **All Reports** — a table of every complaint. You can search, filter, and change status.

The first time you open the site, three **sample** complaints are added so the dashboard is not empty. They are labelled **Sample** in the table. Real submissions do not have that label.

## How localStorage stores and retrieves complaints

- Complaints are kept as an array of objects.
- `getComplaints()` reads the `campusWaterComplaints` key and uses `JSON.parse`.
- `saveComplaints()` writes the array back with `JSON.stringify`.
- New reports, status changes, and sample data all call `saveComplaints()`, so data stays after you refresh the page.

Each complaint object looks like this:

```json
{
  "id": "CWR-0004",
  "studentName": "Sparsh",
  "building": "Hostel B",
  "specificLocation": "Floor 1, near mess",
  "category": "Poor water quality",
  "description": "Water smells unusual.",
  "dateSubmitted": "2026-11-13",
  "status": "Pending",
  "isSample": false
}
```

To start over, open DevTools → Application → Local Storage and delete `campusWaterComplaints` and `campusWaterSamplesLoaded`.

## How search and filtering works

On **All Reports**, three controls run together:

- Search box: matches complaint ID, building, or specific location (case-insensitive).
- Category dropdown: keeps one category, or all.
- Status dropdown: keeps Pending, In Progress, Resolved, or all.

`getFilteredComplaints()` uses `filter()` so a row must match **all** of the selected rules. Changing any control redraws the table.

## How status updates work

Each row on All Reports has a status dropdown. When it changes:

1. JavaScript finds the complaint by ID.
2. It updates `status`.
3. It saves the array to localStorage.
4. Dashboard numbers and tables refresh.

Pending is red, In Progress is yellow, and Resolved is green.

## JavaScript concepts you should know for a demo

- **Variables and objects** — each complaint is an object with named fields.
- **Arrays** — the list of complaints; `push`, `filter`, `map`, and `slice`.
- **Functions** — small named steps such as `saveComplaints` and `validateForm`.
- **DOM** — `getElementById`, `innerHTML`, and `classList` to update the page.
- **Events** — `addEventListener` for clicks, form submit, typing, and dropdown changes.
- **Conditionals** — validation and matching filters.
- **localStorage and JSON** — save strings, convert objects with `stringify` / `parse`.

## Features checklist

- Dashboard statistics that update automatically
- Report form with validation, success message, and form reset
- Unique complaint IDs
- All reports table with empty states
- Search by ID or location
- Filter by category and status
- Status can be changed: Pending, In Progress, Resolved
- Data saved in localStorage
- Responsive layout for laptop, tablet, and phone
