document.addEventListener('DOMContentLoaded', function() {
  let pagerows = 10; // Default number of rows per page
  let pagenumber = 1; // Current page
  let fetch_cve_data; // Global variable to store fetched data

  // Function to calculate total number of pages
  function TotalPages(total_number_page) {
    return Math.ceil(total_number_page / pagerows);
  }

  // Function to display rows for the current page
  function display_the_table_row() {
    const table_body = document.getElementById('cve-table-body');
    const starting_page = (pagenumber - 1) * pagerows;
    const ending_page = Math.min(starting_page + pagerows, fetch_cve_data.vulnerabilities.length);
    table_body.innerHTML = ''; // Clear previous rows
    for (let i = starting_page; i < ending_page; i++) {
      const cve_data = fetch_cve_data.vulnerabilities[i];
      const row = document.createElement('tr');
      row.classList.add('clickable-row');
      row.addEventListener('click', () => {
        window.location.href = `cvedetailspage.html?id=${cve_data.cve.id}`; // Pass the CVE ID as a query parameter
      });
      row.innerHTML = `
        <td>${cve_data.cve.id}</td>
        <td>${cve_data.cve.sourceIdentifier}</td>
        <td>${cve_data.cve.published.split('T')[0]}</td>
        <td>${cve_data.cve.lastModified.split('T')[0]}</td>
        <td>${cve_data.cve.vulnStatus}</td>
      `;
      table_body.appendChild(row);
    }
  }

  // Function to update pagination buttons
  function updatePaginationButtons(totalPages) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = ''; // Clear previous buttons

    // Previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Prev';
    prevButton.classList.add('pagination-button');
    prevButton.disabled = pagenumber === 1;
    prevButton.addEventListener('click', () => {
      if (pagenumber > 1) {
        pagenumber--;
        display_the_table_row();
        updatePaginationButtons(totalPages);
      }
    });
    

    // Display pagination count
    const paginationCount = document.createElement('span');
    paginationCount.classList.add('totalcount');
    paginationCount.textContent = `${(pagenumber - 1) * pagerows + 1}-${Math.min(pagenumber * pagerows, fetch_cve_data.vulnerabilities.length)} total records of ${fetch_cve_data.vulnerabilities.length}`;
    paginationContainer.appendChild(paginationCount);
    paginationContainer.appendChild(prevButton);

    // Page numbers
    const numToShow = 5; // Number of page numbers to show
    let startingPage = Math.max(pagenumber - Math.floor(numToShow / 2), 1);
    let endingPage = Math.min(startingPage + numToShow - 1, totalPages);

    if (endingPage - startingPage + 1 < numToShow) {
      startingPage = Math.max(endingPage - numToShow + 1, 1);
    }

    for (let i = startingPage; i <= endingPage; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      button.classList.add('pagination-button');
      button.addEventListener('click', () => {
        pagenumber = i;
        display_the_table_row();
        updatePaginationButtons(totalPages);
      });
      if (i === pagenumber) {
        button.disabled = true;
        button.style.backgroundColor = '#ddd';
      }
      paginationContainer.appendChild(button);
    }

    // Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.classList.add('pagination-button');
    nextButton.disabled = pagenumber === totalPages;
    nextButton.addEventListener('click', () => {
      if (pagenumber < totalPages) {
        pagenumber++;
        display_the_table_row();
        updatePaginationButtons(totalPages);
      }
    });
    paginationContainer.appendChild(nextButton);
  }

  document.getElementById('results-per-page-select').addEventListener('change', function() {
    pagerows = parseInt(this.value);
    const total_number_page = fetch_cve_data.vulnerabilities.length;
    const totalPages = TotalPages(total_number_page);
    pagenumber = 1; // Reset current page
    display_the_table_row();
    updatePaginationButtons(totalPages);
  });

  fetch('http://127.0.0.1:5000/api/cve')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(responseData => {
      fetch_cve_data = responseData;
      console.log("Data fetched successfully:", fetch_cve_data);
      const total_number_page = fetch_cve_data.vulnerabilities.length;
      const totalPages = TotalPages(total_number_page);
      display_the_table_row();
      updatePaginationButtons(totalPages);
    })
    .catch(error => console.error('Error fetching data:', error));
});
