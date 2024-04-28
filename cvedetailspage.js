function displayCVEId() {
    const cveIdElement = document.getElementById("cveId");
    cveIdElement.textContent = cveData.vulnerabilities[0].cve.id;
}

//description
function displayDescription() {
    const descriptionElement = document.getElementById("cveDescription");
    descriptionElement.textContent = cveData.vulnerabilities[0].cve.descriptions[0].value; 
}

//CVSS Metrics
function displayCVSSMetrics() {
    const cvssMetric = cveData.vulnerabilities[0].cve.metrics.cvssMetricV2[0];
    document.getElementById("accessVector").textContent = cvssMetric.cvssData.accessVector;
    document.getElementById("score").textContent = cvssMetric.cvssData.baseScore;
    document.getElementById("vectorString").textContent = cvssMetric.cvssData.vectorString;
}

//scores
function displayScores() {
    const cvssMetric = cveData.vulnerabilities[0].cve.metrics.cvssMetricV2[0]; 
    document.getElementById("exploitabilityScore").textContent = cvssMetric.exploitabilityScore;
    document.getElementById("impactScore").textContent = cvssMetric.impactScore;
}

//CVSS Metrics table rows
function displayCVSSMetricsTable() {
    const cvssMetricsBody = document.getElementById("cvssMetricsTableBody");
    cveData.vulnerabilities[0].cve.metrics.cvssMetricV2.forEach(cvssMetric => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${cvssMetric.cvssData.accessVector}</td>
            <td>${cvssMetric.cvssData.accessComplexity}</td>
            <td>${cvssMetric.cvssData.authentication}</td>
            <td>${cvssMetric.cvssData.confidentialityImpact}</td>
            <td>${cvssMetric.cvssData.integrityImpact}</td>
            <td>${cvssMetric.cvssData.availabilityImpact}</td>
        `;
        cvssMetricsBody.appendChild(row);
    });
}

//CPE table rows
function displayCPETable() {
    const cpeBody = document.getElementById("cpeTableBody");
    for (let i = 0; i < 3 && i < cveData.vulnerabilities[0].cve.configurations[0].nodes[0].cpeMatch.length; i++) {
        const cpeMatch = cveData.vulnerabilities[0].cve.configurations[0].nodes[0].cpeMatch[i];
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${cpeMatch.criteria}</td>
            <td>${cpeMatch.matchCriteriaId}</td>
            <td>${cpeMatch.vulnerable}</td>
        `;
        cpeBody.appendChild(row);
    }
}

function displayRows() {
}

function updatePaginationButtons(totalPages) {
    
}

//calculate total pages 
function calculateTotalPages(totalRows) {
   
    return Math.ceil(totalRows / 10);
}

// Fetch data from the API
fetch('http://127.0.0.1:5000/api/cve')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(responseData => {
        cveData = responseData;
        console.log("Data fetched successfully:", cveData);
        //append data to HTML
        displayDescription();
        displayCVEId();
        displayCVSSMetrics();
        displayScores();
        displayCVSSMetricsTable();
        displayCPETable();
        
        const totalRows = cveData.vulnerabilities.length;
        const totalPages = calculateTotalPages(totalRows);
        displayRows();
        updatePaginationButtons(totalPages);
    })
    .catch(error => console.error('Error fetching data:', error));
