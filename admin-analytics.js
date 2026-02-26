// Analytics chart rendering for admin.html
// Requires Chart.js CDN in admin.html

document.addEventListener('DOMContentLoaded', function() {
  // Default: show 1 month
  renderLineChart('month');

  document.getElementById('analyticsRangeWeek').onclick = () => renderLineChart('week');
  document.getElementById('analyticsRangeMonth').onclick = () => renderLineChart('month');
  document.getElementById('analyticsRangeYear').onclick = () => renderLineChart('year');
});

function renderLineChart(range) {
  // Get real order data from localStorage
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  let orders = [];
  users.forEach(u => {
    if (u.orders && u.orders.length) {
      u.orders.forEach(order => {
        // Assume order.date is stored as ISO string or timestamp
        orders.push({
          date: order.date ? new Date(order.date) : null,
          total: Number(order.total) || 0
        });
      });
    }
  });

  // Prepare labels and data based on range
  let labels = [], data = [];
  const now = new Date();
  let start, end = new Date(now);
  if (range === 'week') {
    start = new Date(now); start.setDate(now.getDate() - 6);
    for (let i = 0; i < 7; i++) {
      let d = new Date(start); d.setDate(start.getDate() + i);
      labels.push(d.toLocaleDateString());
      // Sum revenue for this day
      let sum = orders.filter(o => o.date && o.date.toLocaleDateString() === d.toLocaleDateString()).reduce((acc, o) => acc + o.total, 0);
      data.push(sum);
    }
  } else if (range === 'month') {
    start = new Date(now); start.setDate(now.getDate() - 29);
    for (let i = 0; i < 30; i++) {
      let d = new Date(start); d.setDate(start.getDate() + i);
      labels.push(d.toLocaleDateString());
      let sum = orders.filter(o => o.date && o.date.toLocaleDateString() === d.toLocaleDateString()).reduce((acc, o) => acc + o.total, 0);
      data.push(sum);
    }
  } else if (range === 'year') {
    start = new Date(now); start.setMonth(now.getMonth() - 11);
    for (let i = 0; i < 12; i++) {
      let d = new Date(start); d.setMonth(start.getMonth() + i);
      // Use month/year as label
      labels.push(d.toLocaleString('default', { month: 'short', year: '2-digit' }));
      // Sum revenue for this month
      let sum = orders.filter(o => o.date && o.date.getMonth() === d.getMonth() && o.date.getFullYear() === d.getFullYear()).reduce((acc, o) => acc + o.total, 0);
      data.push(sum);
    }
  }

  const ctx = document.getElementById('analyticsLineChart').getContext('2d');
  if (window.analyticsChart) window.analyticsChart.destroy();
  window.analyticsChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Revenue',
        data,
        borderColor: '#ff1e1e',
        backgroundColor: 'rgba(255,30,30,0.08)',
        tension: 0.3,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: '#fff',
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: '#222' }, ticks: { color: '#fff' } },
        x: { grid: { color: '#222' }, ticks: { color: '#fff' } }
      },
      animation: {
        duration: 600,
        easing: 'easeOutQuart'
      },
      // Zoom effect: adjust min/max for x axis
      // Chart.js v3+ does not support axis min/max for category axes, so we just show the right number of labels
    }
  });

  // Highlight active button
  document.getElementById('analyticsRangeWeek').classList.remove('active');
  document.getElementById('analyticsRangeMonth').classList.remove('active');
  document.getElementById('analyticsRangeYear').classList.remove('active');
  if (range === 'week') document.getElementById('analyticsRangeWeek').classList.add('active');
  if (range === 'month') document.getElementById('analyticsRangeMonth').classList.add('active');
  if (range === 'year') document.getElementById('analyticsRangeYear').classList.add('active');
}
