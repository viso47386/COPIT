// Sample products array
const products = [
  { id: 1, name: 'Spydur Hoodie', category: 'shirts', price: 25.99, image: 'images/spyder-black.jpeg', sales: 150, newest: true, oldPrice: 79.99 },
  { id: 2, name: 'Blue Denim Shirt', category: 'shirts', price: 49.99, image: 'images/shirt1.jpg', sales: 120, newest: false },
  { id: 3, name: 'Black Jeans', category: 'pants', price: 79.99, image: 'images/jeans1.jpg', sales: 200, newest: true },
  { id: 4, name: 'Grey Sweatpants', category: 'pants', price: 59.99, image: 'images/pants1.jpg', sales: 85, newest: false },
  { id: 5, name: 'Leather Jacket', category: 'jackets', price: 199.99, image: 'images/jacket1.jpg', sales: 95, newest: true },
  { id: 6, name: 'Winter Coat', category: 'jackets', price: 249.99, image: 'images/coat1.jpg', sales: 110, newest: false },
  { id: 7, name: 'Polo Shirt', category: 'shirts', price: 39.99, image: 'images/polo.jpg', sales: 140, newest: true },
  { id: 8, name: 'Cargo Pants', category: 'pants', price: 89.99, image: 'images/cargo.jpg', sales: 75, newest: false },
];

let currentFilters = {
  category: 'all',
  maxPrice: 500,
  sort: 'newest'
};

function filterAndSortProducts() {
  let filtered = products.filter(product => {
    const categoryMatch = currentFilters.category === 'all' || product.category === currentFilters.category;
    const priceMatch = product.price <= currentFilters.maxPrice;
    return categoryMatch && priceMatch;
  });

  // Sort
  switch(currentFilters.sort) {
    case 'newest':
      filtered.sort((a, b) => b.newest - a.newest);
      break;
    case 'best-selling':
      filtered.sort((a, b) => b.sales - a.sales);
      break;
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price);
      break;
  }

  renderProducts(filtered);
}

function renderProducts(productsToRender) {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';
  // Grid: rows of 4, Spydur Hoodie is just one of the 4 in the first row
  let row = document.createElement('div');
  row.className = 'products-row';
  let rowCount = 0;
  // Sort so Spydur Hoodie is first
  const sorted = [...productsToRender].sort((a, b) => {
    if (a.name === 'Spydur Hoodie') return -1;
    if (b.name === 'Spydur Hoodie') return 1;
    return 0;
  });
  for (let i = 0; i < sorted.length; i++) {
    const product = sorted[i];
    const card = document.createElement('div');
    card.className = 'product-card';
    const link = product.name === 'Spydur Hoodie' ? 'Spyderhoodie-page.html' : `item.html?id=${product.id}`;
    card.innerHTML = `
      <a href="${link}" style="text-decoration:none;color:inherit;display:block;">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p class="product-price">
          $${product.price.toFixed(2)}
          ${product.oldPrice ? `<span style='text-decoration:line-through;color:#999;font-size:16px;margin-left:10px;'>$${product.oldPrice.toFixed(2)}</span>` : ''}
        </p>
      </a>
    `;
    row.appendChild(card);
    rowCount++;
    if (rowCount === 4) {
      grid.appendChild(row);
      row = document.createElement('div');
      row.className = 'products-row';
      rowCount = 0;
    }
  }
  if (row.children.length > 0) grid.appendChild(row);
}

// Event listeners
document.querySelectorAll('.category-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentFilters.category = e.target.dataset.category;
    filterAndSortProducts();
  });
});

document.getElementById('priceFilter').addEventListener('input', (e) => {
  currentFilters.maxPrice = e.target.value;
  document.getElementById('priceValue').textContent = `$0 - $${e.target.value}`;
  filterAndSortProducts();
});

document.getElementById('sortFilter').addEventListener('change', (e) => {
  currentFilters.sort = e.target.value;
  filterAndSortProducts();
});

// Initial load
filterAndSortProducts();