// Mock data
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBknxUstLA8F4YkkNT9rVCoEgTzJBSu24A",
    authDomain: "r7nttconaf.firebaseapp.com",
    projectId: "r7nttconaf",
    storageBucket: "r7nttconaf.firebasestorage.app",
    messagingSenderId: "521822609098",
    appId: "1:521822609098:web:e8ee10f63098924bb35e33",
    measurementId: "G-0VPXC641LT"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const issuancesCol = collection(db, 'issuances');

let currentData = [];
let expandedRows = new Set();
let sortField = "fullName";
let sortOrder = "asc";

function getFullName(person) {
    return `${person.manpowerProfile?.lastName || ''}, ${person.manpowerProfile?.firstName || ''} ${person.manpowerProfile?.middleName ? person.manpowerProfile.middleName[0] + '.' : ''}${person.manpowerProfile?.extension ? ' ' + person.manpowerProfile.extension : ''}`.trim();
}

function filterAndSortData(searchTerm) {
    // Filter data
    const filtered = currentData.filter((person) => {
        const fullName = getFullName(person).toLowerCase();
        const institution = (person.nttcApplication?.trainingInstitution || '').toLowerCase();
        const sector = (person.nttcApplication?.sector || '').toLowerCase();
        const qualification = (person.nttcApplication?.qualification || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        return (
            fullName.includes(search) ||
            institution.includes(search) ||
            sector.includes(search) ||
            qualification.includes(search)
        );
    });
    // Sort data
    filtered.sort((a, b) => {
        let aValue, bValue;
        switch (sortField) {
            case "fullName":
                aValue = getFullName(a);
                bValue = getFullName(b);
                break;
            case "trainingInstitution":
                aValue = a.nttcApplication?.trainingInstitution || '';
                bValue = b.nttcApplication?.trainingInstitution || '';
                break;
            case "sector":
                aValue = a.nttcApplication?.sector || '';
                bValue = b.nttcApplication?.sector || '';
                break;
            case "qualification":
                aValue = a.nttcApplication?.qualification || '';
                bValue = b.nttcApplication?.qualification || '';
                break;
            default:
                return 0;
        }
        const comparison = aValue.localeCompare(bValue);
        return sortOrder === "asc" ? comparison : -comparison;
    });
    return filtered;
}

function toggleRow(index) {
    if (expandedRows.has(index)) {
      expandedRows.delete(index)
    } else {
      expandedRows.add(index)
    }
    renderTable()
  }
  
  function createExpandedContent(person) {
    return `
          <td colspan="5" class="p-0">
              <div class="animate-slide-in-from-top">
                  <div class="m-4 border border-gray-200 border-l-4 border-l-blue-500 rounded-lg bg-white shadow-sm">
                      <div class="p-6">
                          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              <div class="space-y-4">
                                  <h4 class="font-semibold text-sm text-gray-500 uppercase tracking-wide">
                                      Personal Information
                                  </h4>
                                  <div class="space-y-2">
                                      <div><span class="font-medium">Birthday:</span> ${person.manpowerProfile?.birthday}</div>
                                      <div><span class="font-medium">Sex:</span> ${person.manpowerProfile?.sex}</div>
                                      <div><span class="font-medium">Address:</span> ${person.manpowerProfile?.completeAddress}</div>
                                      <div><span class="font-medium">Email:</span> ${person.manpowerProfile?.emailAddress}</div>
                                      <div><span class="font-medium">Contact:</span> ${person.manpowerProfile?.contactNumber}</div>
                                  </div>
                              </div>
  
                              <div class="space-y-4">
                                  <h4 class="font-semibold text-sm text-gray-500 uppercase tracking-wide">
                                      Education & Training
                                  </h4>
                                  <div class="space-y-2">
                                      <div><span class="font-medium">Educational Attainment:</span> ${person.nttcApplication?.educationalAttainment}</div>
                                      <div><span class="font-medium">Institution Type:</span> ${person.nttcApplication?.institutionType}</div>
                                      <div><span class="font-medium">Work Experience:</span> ${person.nttcApplication?.workExperience} years</div>
                                      <div><span class="font-medium">Training Hours:</span> ${person.nttcApplication?.trainingHours} hours</div>
                                  </div>
                              </div>
  
                              <div class="space-y-4">
                                  <h4 class="font-semibold text-sm text-gray-500 uppercase tracking-wide">
                                      Certifications
                                  </h4>
                                  <div class="space-y-2">
                                      <div><span class="font-medium">NC Certificate:</span> ${person.nttcApplication?.ncCertificateNumber}</div>
                                      <div><span class="font-medium">NC Issued:</span> ${person.nttcApplication?.ncDateOfIssuance}</div>
                                      <div><span class="font-medium">NC Valid Until:</span> ${person.nttcApplication?.ncValidity}</div>
                                      <div><span class="font-medium">TM Certificate:</span> ${person.nttcApplication?.tmCertificateNumber}</div>
                                      <div><span class="font-medium">TM Issued:</span> ${person.nttcApplication?.tmDateOfIssuance}</div>
                                      <div><span class="font-medium">TM Valid Until:</span> ${person.nttcApplication?.tmValidity}</div>
                                  </div>
                              </div>
  
                              <div class="space-y-4 md:col-span-2 lg:col-span-3">
                                  <h4 class="font-semibold text-sm text-gray-500 uppercase tracking-wide">
                                      Assessors
                                  </h4>
                                  <div class="flex flex-wrap gap-2">
                                      <span class="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                          ${person.nttcApplication?.assessor1}
                                      </span>
                                      <span class="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                          ${person.nttcApplication?.assessor2}
                                      </span>
                                      <span class="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                          ${person.nttcApplication?.assessor3}
                                      </span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </td>
      `
  }
  
  function renderTable() {
    const tableBody = document.getElementById("tableBody")
    const noResults = document.getElementById("noResults")
    const recordCount = document.getElementById("recordCount")
  
    // Update record count
    recordCount.textContent = `${currentData.length} record${currentData.length !== 1 ? "s" : ""}`
  
    if (currentData.length === 0) {
      tableBody.innerHTML = ""
      noResults.classList.remove("hidden")
      return
    }
  
    noResults.classList.add("hidden")
  
    let html = ""
  
    currentData.forEach((person, index) => {
      const isExpanded = expandedRows.has(index)
      const chevronIcon = isExpanded
        ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>`
        : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>`
  
      // Main row
      html += `
              <tr class="hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100" onclick="toggleRow(${index})">
                  <td class="px-4 py-3">
                      <button class="h-8 w-8 p-0 hover:bg-gray-100 rounded transition-colors flex items-center justify-center" onclick="event.stopPropagation(); toggleRow(${index})">
                          <svg class="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              ${chevronIcon}
                          </svg>
                      </button>
                  </td>
                  <td class="px-4 py-3 font-medium">${getFullName(person)}</td>
                  <td class="px-4 py-3">${person.nttcApplication?.trainingInstitution}</td>
                  <td class="px-4 py-3">
                      <span class="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          ${person.nttcApplication?.sector}
                      </span>
                  </td>
                  <td class="px-4 py-3">${person.nttcApplication?.qualification}</td>
              </tr>
          `
  
      // Expanded row
      if (isExpanded) {
        html += `<tr>${createExpandedContent(person)}</tr>`
      }
    })
  
    tableBody.innerHTML = html
  }
  
  function handleSort(field) {
    if (sortField === field) {
      sortOrder = sortOrder === "asc" ? "desc" : "asc"
    } else {
      sortField = field
      sortOrder = "asc"
    }
  
    const searchTerm = document.getElementById("searchInput").value
    currentData = filterAndSortData(searchTerm)
    expandedRows.clear() // Close all expanded rows when sorting
    renderTable()
  }
  
  function handleSearch() {
    const searchTerm = document.getElementById("searchInput").value
    currentData = filterAndSortData(searchTerm)
    expandedRows.clear() // Close all expanded rows when searching
    renderTable()
  }
  
  // Add SheetJS CDN if not already present
  if (!window.XLSX) {
    var script = document.createElement('script');
    script.src = 'https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js';
    script.onload = function() { window.sheetjsLoaded = true; };
    document.head.appendChild(script);
  }

  // Utility to convert column index to Excel column letter
  function colIdxToLetter(idx) {
    let s = '';
    while (idx >= 0) {
      s = String.fromCharCode((idx % 26) + 65) + s;
      idx = Math.floor(idx / 26) - 1;
    }
    return s;
  }

  // Export to Excel logic
  function exportToExcel() {
    if (!window.XLSX) {
      alert('SheetJS library not loaded yet. Please try again in a moment.');
      return;
    }
    // Define columns D (3) to AC (28), i.e., 26 columns
    const startCol = 3; // D
    const endCol = 28; // AC
    const numCols = endCol - startCol + 1;
    // Prepare header row (customize as needed)
    const headers = [
      'Last Name', 'First Name', 'Middle Initial', 'Extension', 'Birthday', 'Sex', 'Complete Address', 'Email Address', 'Contact Number', 'Educational Attainment', 'Training Institution', 'Institution Type', 'Work Experience', 'Training Hours', 'Sector', 'Qualification', 'NC Certificate Number', 'NC Date Of Issuance', 'NC Validity', 'TM Certificate Number', 'TM Date Of Issuance', 'TM Validity', 'Assessor 1', 'Assessor 2', 'Assessor 3'
    ];
    // Map mockData/currentData to rows
    const rows = [headers];
    currentData.forEach(person => {
      rows.push([
        person.manpowerProfile?.lastName,
        person.manpowerProfile?.firstName,
        person.manpowerProfile?.middleName,
        person.manpowerProfile?.extension,
        person.manpowerProfile?.birthday,
        person.manpowerProfile?.sex,
        person.manpowerProfile?.completeAddress,
        person.manpowerProfile?.emailAddress,
        person.manpowerProfile?.contactNumber,
        person.nttcApplication?.educationalAttainment,
        person.nttcApplication?.trainingInstitution,
        person.nttcApplication?.institutionType,
        person.nttcApplication?.workExperience,
        person.nttcApplication?.trainingHours,
        person.nttcApplication?.sector,
        person.nttcApplication?.qualification,
        person.nttcApplication?.ncCertificateNumber,
        person.nttcApplication?.ncDateOfIssuance,
        person.nttcApplication?.ncValidity,
        person.nttcApplication?.tmCertificateNumber,
        person.nttcApplication?.tmDateOfIssuance,
        person.nttcApplication?.tmValidity,
        person.nttcApplication?.assessor1,
        person.nttcApplication?.assessor2,
        person.nttcApplication?.assessor3
      ]);
    });
    // Create worksheet and shift to D8
    const ws = XLSX.utils.aoa_to_sheet([]);
    // Place data at D8
    XLSX.utils.sheet_add_aoa(ws, rows, {origin: 'D8'});
    // Create workbook and append sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'NTTC');
    // Export as NTTC.xlsx
    XLSX.writeFile(wb, 'NTTC.xlsx');
  }

  // Copy to clipboard logic
  function copyToClipboard() {
    // Only copy values, not headers
    const rows = [];
    currentData.forEach(person => {
      rows.push([
        person.manpowerProfile?.lastName,
        person.manpowerProfile?.firstName,
        person.manpowerProfile?.middleName,
        person.manpowerProfile?.extension,
        person.manpowerProfile?.birthday,
        person.manpowerProfile?.sex,
        person.manpowerProfile?.completeAddress,
        person.manpowerProfile?.emailAddress,
        person.manpowerProfile?.contactNumber,
        person.nttcApplication?.educationalAttainment,
        person.nttcApplication?.trainingInstitution,
        person.nttcApplication?.institutionType,
        person.nttcApplication?.workExperience,
        person.nttcApplication?.trainingHours,
        person.nttcApplication?.sector,
        person.nttcApplication?.qualification,
        person.nttcApplication?.ncCertificateNumber,
        person.nttcApplication?.ncDateOfIssuance,
        person.nttcApplication?.ncValidity,
        person.nttcApplication?.tmCertificateNumber,
        person.nttcApplication?.tmDateOfIssuance,
        person.nttcApplication?.tmValidity,
        person.nttcApplication?.assessor1,
        person.nttcApplication?.assessor2,
        person.nttcApplication?.assessor3
      ]);
    });
    // Convert to tab-separated values
    const tsv = rows.map(row => row.map(cell => cell == null ? '' : cell).join('\t')).join('\n');
    // Copy to clipboard
    navigator.clipboard.writeText(tsv).then(() => {
      alert('Copied to clipboard!');
    }, () => {
      alert('Failed to copy to clipboard.');
    });
  }

  // Event listeners
  document.addEventListener("DOMContentLoaded", () => {
    listenToIssuances();
    document.getElementById("searchInput").addEventListener("input", handleSearch);
    document.querySelectorAll("[data-sort]").forEach(th => {
        th.addEventListener("click", () => handleSort(th.getAttribute("data-sort")));
    });
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', exportToExcel);
    }
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', copyToClipboard);
    }
  })
  
  // Make toggleRow available globally
  window.toggleRow = toggleRow
  