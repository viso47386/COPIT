const TAX_RATE = 0.13; // 13% tax

function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCart() {
  const cart = getCart();
  const cartItemsDiv = document.getElementById('cartItems');
  
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<div class="empty-cart"><h2>Your cart is empty</h2><p>Start shopping to add items!</p></div>';
    updateSummary([]);
    return;
  }
  
  cartItemsDiv.innerHTML = '';
  cart.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="item-details">
        <h3>${item.name}</h3>
        <p class="item-price">$${item.price.toFixed(2)}</p>
        <p>Category: ${item.category}</p>
        <p>Size: <span class="item-size">${item.size ? item.size : '-'}</span></p>
        <p>Color: <span class="item-color">${item.color ? item.color : '-'}</span></p>
      </div>
      <div class="item-quantity">
        <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
        <input type="number" class="qty-input" value="${item.quantity}" onchange="setQuantity(${index}, this.value)">
        <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
        <button class="remove-btn" onclick="removeFromCart(${index})">✕</button>
      </div>
    `;
    cartItemsDiv.appendChild(itemDiv);
  });
  
  updateSummary(cart);
}

function updateQuantity(index, change) {
  const cart = getCart();
  cart[index].quantity += change;
  if (cart[index].quantity < 1) cart[index].quantity = 1;
  saveCart(cart);
  renderCart();
}

function setQuantity(index, value) {
  const cart = getCart();
  const qty = parseInt(value);
  cart[index].quantity = qty < 1 ? 1 : qty;
  saveCart(cart);
  renderCart();
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

function updateSummary(cart) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  // Build itemized breakdown
  let breakdown = '';
  cart.forEach(item => {
    breakdown += `<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;">
      <span>${item.name} x${item.quantity}</span>
      <span>$${(item.price * item.quantity).toFixed(2)}</span>
    </div>`;
  });
  breakdown += `<div style='border-top:1px solid #333;margin:8px 0 2px 0;'></div>`;
  breakdown += `<div style="display:flex;justify-content:space-between;font-weight:700;font-size:15px;"><span>Total:</span><span>$${subtotal.toFixed(2)}</span></div>`;
  document.getElementById('subtotal').innerHTML = breakdown;
  document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Initial render
renderCart();