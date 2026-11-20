// Campus Drinking Water Issue Reporter
// Beginner-friendly JavaScript: functions, arrays, objects, DOM, and localStorage.

var STORAGE_KEY = "campusWaterComplaints";
var SAMPLE_FLAG_KEY = "campusWaterSamplesLoaded";

// Load complaints from localStorage. If nothing is saved yet, return an empty array.
function getComplaints() {
  var saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return [];
  }

  return JSON.parse(saved);
}

// Save the complaints array back to localStorage as a JSON string.
function saveComplaints(complaints) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
}

// Create a unique ID such as CWR-0001, CWR-0002, and so on.
function createComplaintId(complaints) {
  var nextNumber = complaints.length + 1;
  var padded = String(nextNumber).padStart(4, "0");
  return "CWR-" + padded;
}

// Add a few demo complaints the first time the app is opened.
// They are marked with isSample so they are easy to tell apart from real reports.
function addSampleComplaintsIfNeeded() {
  var alreadyLoaded = localStorage.getItem(SAMPLE_FLAG_KEY);
  var complaints = getComplaints();

  if (alreadyLoaded || complaints.length > 0) {
    return;
  }

  var samples = [
    {
      id: "CWR-0001",
      studentName: "Aisha Rahman",
      building: "Science Block",
      specificLocation: "Floor 2, near Lab 204",
      category: "Water leakage",
      description: "Tap near the lab sink is leaking onto the floor.",
      dateSubmitted: "2026-11-10",
      status: "Pending",
      isSample: true
    },
    {
      id: "CWR-0002",
      studentName: "Rohan Mehta",
      building: "Library",
      specificLocation: "Ground floor water cooler",
      category: "Non-functional water cooler",
      description: "The cooler is switched on but no cold water comes out.",
      dateSubmitted: "2026-11-11",
      status: "In Progress",
      isSample: true
    },
    {
      id: "CWR-0003",
      studentName: "Priya Nair",
      building: "Hostel A",
      specificLocation: "Floor 3 dispenser",
      category: "Empty water dispenser",
      description: "The drinking water jar has been empty since morning.",
      dateSubmitted: "2026-11-12",
      status: "Resolved",
      isSample: true
    }
  ];

  saveComplaints(samples);
  localStorage.setItem(SAMPLE_FLAG_KEY, "yes");
}

// Count complaints by status and update the dashboard numbers.
function updateDashboardStats() {
  var complaints = getComplaints();
  var pending = complaints.filter(function (item) {
    return item.status === "Pending";
  }).length;
  var inProgress = complaints.filter(function (item) {
    return item.status === "In Progress";
  }).length;
  var resolved = complaints.filter(function (item) {
    return item.status === "Resolved";
  }).length;

  document.getElementById("statTotal").textContent = complaints.length;
  document.getElementById("statPending").textContent = pending;
  document.getElementById("statProgress").textContent = inProgress;
  document.getElementById("statResolved").textContent = resolved;
}

// Return a coloured badge for the current status.
function statusBadge(status) {
  var className = "badge-pending";

  if (status === "In Progress") {
    className = "badge-progress";
  } else if (status === "Resolved") {
    className = "badge-resolved";
  }

  return '<span class="badge ' + className + '">' + status + "</span>";
}

// Build one table row for a complaint.
function createRowHtml(complaint, showStatusSelect) {
  var sampleLabel = complaint.isSample
    ? '<span class="sample-note">Sample</span>'
    : "";

  var statusCell = showStatusSelect
    ? '<select class="status-select" data-id="' + complaint.id + '">' +
      '<option value="Pending"' + (complaint.status === "Pending" ? " selected" : "") + ">Pending</option>" +
      '<option value="In Progress"' + (complaint.status === "In Progress" ? " selected" : "") + ">In Progress</option>" +
      '<option value="Resolved"' + (complaint.status === "Resolved" ? " selected" : "") + ">Resolved</option>" +
      "</select>"
    : statusBadge(complaint.status);

  return (
    "<tr>" +
    "<td><strong>" + complaint.id + "</strong>" + sampleLabel + "</td>" +
    "<td>" + complaint.studentName + "</td>" +
    "<td>" + complaint.building + "<br><small>" + complaint.specificLocation + "</small></td>" +
    "<td>" + complaint.category + "</td>" +
    '<td class="desc-cell">' + complaint.description + "</td>" +
    "<td>" + complaint.dateSubmitted + "</td>" +
    "<td>" + statusCell + "</td>" +
    "</tr>"
  );
}

// Show a message when there are no complaints to display.
function emptyStateHtml(message) {
  return '<p class="empty">' + message + "</p>";
}

// Turn an array of complaints into an HTML table.
function renderTable(complaints, containerId, showStatusSelect, emptyMessage) {
  var container = document.getElementById(containerId);

  if (complaints.length === 0) {
    container.innerHTML = emptyStateHtml(emptyMessage);
    return;
  }

  var rows = complaints.map(function (complaint) {
    return createRowHtml(complaint, showStatusSelect);
  }).join("");

  container.innerHTML =
    '<div class="table-wrap"><table>' +
    "<thead><tr>" +
    "<th>Complaint ID</th>" +
    "<th>Student Name</th>" +
    "<th>Location</th>" +
    "<th>Issue Category</th>" +
    "<th>Description</th>" +
    "<th>Date Submitted</th>" +
    "<th>Current Status</th>" +
    "</tr></thead>" +
    "<tbody>" + rows + "</tbody>" +
    "</table></div>";
}

// Show the 5 newest complaints on the dashboard.
function renderRecentReports() {
  var complaints = getComplaints().slice().reverse().slice(0, 5);
  renderTable(
    complaints,
    "recentReports",
    false,
    "No complaints have been submitted yet."
  );
}

// Apply search text, category filter, and status filter.
function getFilteredComplaints() {
  var searchText = document.getElementById("searchInput").value.toLowerCase().trim();
  var category = document.getElementById("filterCategory").value;
  var status = document.getElementById("filterStatus").value;

  return getComplaints().filter(function (complaint) {
    var matchesSearch =
      complaint.id.toLowerCase().indexOf(searchText) !== -1 ||
      complaint.building.toLowerCase().indexOf(searchText) !== -1 ||
      complaint.specificLocation.toLowerCase().indexOf(searchText) !== -1;

    var matchesCategory = category === "all" || complaint.category === category;
    var matchesStatus = status === "all" || complaint.status === status;

    return matchesSearch && matchesCategory && matchesStatus;
  });
}

function renderAllReports() {
  var filtered = getFilteredComplaints().slice().reverse();
  renderTable(
    filtered,
    "reportsList",
    true,
    "No complaints match your search or filters."
  );
}

function refreshAllViews() {
  updateDashboardStats();
  renderRecentReports();
  renderAllReports();
}

// Switch between Dashboard, Report an Issue, and All Reports.
function showPage(pageName) {
  var pages = ["dashboard", "report", "reports"];
  var titles = {
    dashboard: ["Dashboard", "Overview of campus drinking water complaints"],
    report: ["Report an Issue", "Submit a new drinking water complaint"],
    reports: ["All Reports", "Search, filter, and update complaint status"]
  };

  var i;
  for (i = 0; i < pages.length; i++) {
    var page = document.getElementById("page-" + pages[i]);
    if (pages[i] === pageName) {
      page.classList.remove("hidden");
    } else {
      page.classList.add("hidden");
    }
  }

  document.getElementById("pageTitle").textContent = titles[pageName][0];
  document.getElementById("pageSubtitle").textContent = titles[pageName][1];

  var buttons = document.querySelectorAll(".nav-btn");
  buttons.forEach(function (button) {
    if (button.getAttribute("data-page") === pageName) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });

  closeMobileMenu();
}

function openMobileMenu() {
  document.getElementById("sidebar").classList.add("open");
  document.getElementById("overlay").classList.add("show");
}

function closeMobileMenu() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
}

function setError(fieldId, message) {
  document.getElementById("error-" + fieldId).textContent = message;
}

function clearFormErrors() {
  setError("studentName", "");
  setError("building", "");
  setError("specificLocation", "");
  setError("category", "");
  setError("description", "");
}

// Check that required form fields are filled in.
function validateForm(formData) {
  var isValid = true;
  clearFormErrors();

  if (formData.studentName.length < 2) {
    setError("studentName", "Please enter your name.");
    isValid = false;
  }

  if (formData.building.length < 2) {
    setError("building", "Please enter a building or location.");
    isValid = false;
  }

  if (formData.specificLocation.length < 2) {
    setError("specificLocation", "Please enter a more specific location.");
    isValid = false;
  }

  if (!formData.category) {
    setError("category", "Please choose an issue category.");
    isValid = false;
  }

  if (formData.description.length < 10) {
    setError("description", "Please describe the issue in at least 10 characters.");
    isValid = false;
  }

  return isValid;
}

function getTodayDate() {
  var today = new Date();
  var year = today.getFullYear();
  var month = String(today.getMonth() + 1).padStart(2, "0");
  var day = String(today.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

// Save a new complaint after the form is submitted.
function handleFormSubmit(event) {
  event.preventDefault();

  var formData = {
    studentName: document.getElementById("studentName").value.trim(),
    building: document.getElementById("building").value.trim(),
    specificLocation: document.getElementById("specificLocation").value.trim(),
    category: document.getElementById("category").value,
    description: document.getElementById("description").value.trim()
  };

  if (!validateForm(formData)) {
    return;
  }

  var complaints = getComplaints();
  var newComplaint = {
    id: createComplaintId(complaints),
    studentName: formData.studentName,
    building: formData.building,
    specificLocation: formData.specificLocation,
    category: formData.category,
    description: formData.description,
    dateSubmitted: getTodayDate(),
    status: "Pending",
    isSample: false
  };

  complaints.push(newComplaint);
  saveComplaints(complaints);
  refreshAllViews();

  document.getElementById("reportForm").reset();
  clearFormErrors();

  var success = document.getElementById("successMessage");
  success.textContent = "Report submitted successfully. Your complaint ID is " + newComplaint.id + ".";
  success.classList.remove("hidden");

  setTimeout(function () {
    success.classList.add("hidden");
  }, 5000);
}

// Change the status of a complaint and save it.
function handleStatusChange(event) {
  var select = event.target;

  if (!select.classList.contains("status-select")) {
    return;
  }

  var complaintId = select.getAttribute("data-id");
  var newStatus = select.value;
  var complaints = getComplaints();

  complaints = complaints.map(function (complaint) {
    if (complaint.id === complaintId) {
      complaint.status = newStatus;
    }
    return complaint;
  });

  saveComplaints(complaints);
  refreshAllViews();
}

function setupEventListeners() {
  document.querySelectorAll(".nav-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      showPage(button.getAttribute("data-page"));
    });
  });

  document.querySelectorAll("[data-page].link-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      showPage(button.getAttribute("data-page"));
    });
  });

  document.getElementById("reportForm").addEventListener("submit", handleFormSubmit);

  document.getElementById("searchInput").addEventListener("input", renderAllReports);
  document.getElementById("filterCategory").addEventListener("change", renderAllReports);
  document.getElementById("filterStatus").addEventListener("change", renderAllReports);

  document.getElementById("reportsList").addEventListener("change", handleStatusChange);

  document.getElementById("menuToggle").addEventListener("click", function () {
    var sidebar = document.getElementById("sidebar");
    if (sidebar.classList.contains("open")) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  document.getElementById("overlay").addEventListener("click", closeMobileMenu);
}

function init() {
  addSampleComplaintsIfNeeded();
  setupEventListeners();
  refreshAllViews();
}

init();
