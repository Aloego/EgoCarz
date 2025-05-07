// js/include.js
function includeHTML() {
    const elements = document.querySelectorAll('[data-include]');
    elements.forEach(el => {
      const file = el.getAttribute('data-include');
      fetch(file)
        .then(response => {
          if (!response.ok) throw new Error(`Failed to load ${file}`);
          return response.text();
        })
        .then(data => {
          el.innerHTML = data;
        })
        .catch(error => {
          el.innerHTML = `<p style="color:red;">${error.message}</p>`;
        });
    });
  }
  window.addEventListener("DOMContentLoaded", includeHTML);
  