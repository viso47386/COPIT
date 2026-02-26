  // Move these inside DOMContentLoaded below
// Auth modal logic for login/signup
window.addEventListener('DOMContentLoaded', function() {
    // --- Product Management ---
    // Add product management modal and logic
    var productBtn = document.getElementById('productBtn');
    var productModal = document.getElementById('productModal');
    var closeProductModal = document.getElementById('closeProductModal');
    var productContent = document.getElementById('productContent');
    if (productBtn && productModal && closeProductModal && productContent) {
      productBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // Show all products and allow add/edit/remove
        var products = JSON.parse(localStorage.getItem('products') || '[]');
        var html = '<h3>Products</h3>';
        html += '<ul style="padding-left:18px;">';
        products.forEach((p, idx) => {
          html += '<li>';
          html += '<b>' + p.name + '</b> ($' + p.price + ')';
          html += '<br>Category: ' + (p.category || '');
          html += '<br><button data-idx="' + idx + '" class="edit-product">Edit</button>';
          html += '<button data-idx="' + idx + '" class="delete-product">Delete</button>';
          html += '</li><br>';
        });
        html += '</ul>';
        html += '<button id="addProductBtn">Add Product</button>';
        productContent.innerHTML = html;
        productModal.style.display = 'flex';
        // Add event listeners for edit/delete/add
        Array.from(productContent.querySelectorAll('.delete-product')).forEach(function(btn) {
          btn.addEventListener('click', function() {
            var idx = parseInt(btn.dataset.idx);
            products.splice(idx, 1);
            localStorage.setItem('products', JSON.stringify(products));
            productBtn.click();
          });
        });
        Array.from(productContent.querySelectorAll('.edit-product')).forEach(function(btn) {
          btn.addEventListener('click', function() {
            var idx = parseInt(btn.dataset.idx);
            var p = products[idx];
            var newName = prompt('Edit name:', p.name);
            var newPrice = prompt('Edit price:', p.price);
            var newCategory = prompt('Edit category:', p.category);
            if (newName && newPrice && newCategory) {
              products[idx] = { ...p, name: newName, price: Number(newPrice), category: newCategory };
              localStorage.setItem('products', JSON.stringify(products));
              productBtn.click();
            }
          });
        });
        var addBtn = document.getElementById('addProductBtn');
        if (addBtn) {
          addBtn.addEventListener('click', function() {
            var name = prompt('Product name:');
            var price = prompt('Product price:');
            var category = prompt('Product category:');
            if (name && price && category) {
              products.push({ name, price: Number(price), category });
              localStorage.setItem('products', JSON.stringify(products));
              productBtn.click();
            }
          });
        }
      });
      closeProductModal.addEventListener('click', function() {
        productModal.style.display = 'none';
      });
    }

    // --- Order Status Updates ---
    // Add order status update logic for admins
    window.updateOrderStatus = function(email, orderIdx, status) {
      var users = JSON.parse(localStorage.getItem('users') || '[]');
      var user = users.find(u => u.email === email);
      if (user && user.orders && user.orders[orderIdx]) {
        user.orders[orderIdx].status = status;
        localStorage.setItem('users', JSON.stringify(users));
      }
    };

    // --- Notifications System ---
    // Store notifications in localStorage and show in admin panel
    window.addNotification = function(type, message) {
      var notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      notifications.push({ type, message, date: new Date().toISOString() });
      localStorage.setItem('notifications', JSON.stringify(notifications));
    };

    // --- Advanced Analytics ---
    // Store user growth, order trends, product popularity in localStorage
    window.trackUserSignup = function() {
      var analytics = JSON.parse(localStorage.getItem('analytics') || '{}');
      var today = new Date().toLocaleDateString();
      analytics.userGrowth = analytics.userGrowth || {};
      analytics.userGrowth[today] = (analytics.userGrowth[today] || 0) + 1;
      localStorage.setItem('analytics', JSON.stringify(analytics));
    };
    window.trackOrder = function() {
      var analytics = JSON.parse(localStorage.getItem('analytics') || '{}');
      var today = new Date().toLocaleDateString();
      analytics.orderTrends = analytics.orderTrends || {};
      analytics.orderTrends[today] = (analytics.orderTrends[today] || 0) + 1;
      localStorage.setItem('analytics', JSON.stringify(analytics));
    };
    window.trackProductPopularity = function(productName) {
      var analytics = JSON.parse(localStorage.getItem('analytics') || '{}');
      analytics.productPopularity = analytics.productPopularity || {};
      analytics.productPopularity[productName] = (analytics.productPopularity[productName] || 0) + 1;
      localStorage.setItem('analytics', JSON.stringify(analytics));
    };

    // --- Dark/Light Mode Toggle ---

    // --- Customizable Dashboard ---
    // Allow hiding dashboard widgets
    window.toggleWidget = function(widgetId) {
      var widget = document.getElementById(widgetId);
      if (widget) widget.style.display = (widget.style.display === 'none' ? '' : 'none');
    };
  var adminBtn = document.getElementById('adminBtn');
  var adminModal = document.getElementById('adminModal');
  var closeAdminModal = document.getElementById('closeAdminModal');
  var adminContent = document.getElementById('adminContent');
  var authModal = document.getElementById('authModal');
  var authForm = document.getElementById('authForm');
  var authTitle = document.getElementById('authTitle');
  var signupFields = document.getElementById('signupFields');
  var toggleAuthMode = document.getElementById('toggleAuthMode');
  var authError = document.getElementById('authError');
  var profileBtn = document.getElementById('profileBtn');
  var logoutBtn = document.getElementById('logoutBtn');
  var isSignup = false;


  function openAuth(mode) {
    authModal.style.display = 'flex';
    isSignup = (mode === 'signup');
    updateAuthMode();
  }
  window.openAuth = openAuth;

  function closeAuth() {
    authModal.style.display = 'none';
    authError.textContent = '';
    authForm.reset();
  }
  window.closeAuth = closeAuth;

  function updateAuthMode() {
    // If admin email is entered, force login mode
    var emailInput = document.getElementById('authEmail');
    var nameInput = document.getElementById('authName');
    var phoneInput = document.getElementById('authPhone');
    if (emailInput && emailInput.value.trim() === 'CopitOfficial') {
      isSignup = false;
    }
    if (isSignup) {
      authTitle.textContent = 'SIGN UP';
      signupFields.style.display = '';
      toggleAuthMode.textContent = 'Already have an account? Log in';
      if (nameInput) nameInput.setAttribute('required', 'required');
      if (phoneInput) phoneInput.removeAttribute('required');
    } else {
      authTitle.textContent = 'LOGIN';
      signupFields.style.display = 'none';
      toggleAuthMode.textContent = "Don't have an account? Sign up";
      if (nameInput) nameInput.removeAttribute('required');
      if (phoneInput) phoneInput.removeAttribute('required');
    }
  }
  // Force login mode if admin email is typed
  var emailInput = document.getElementById('authEmail');
  if (emailInput) {
    emailInput.addEventListener('input', function() {
      if (emailInput.value.trim() === 'CopitOfficial' && isSignup) {
        isSignup = false;
        updateAuthMode();
      }
    });
  }

  if (toggleAuthMode) {
    toggleAuthMode.addEventListener('click', function(e) {
      e.preventDefault();
      isSignup = !isSignup;
      updateAuthMode();
    });
  }

  if (authForm) {
    authForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var email = document.getElementById('authEmail').value.trim();
      var password = document.getElementById('authPassword').value;
      var users = JSON.parse(localStorage.getItem('users') || '[]');
      if (isSignup) {
        // Prevent admin from signing up
        if (email === 'CopitOfficial') {
          authError.textContent = 'Admin account cannot be created. Please log in as admin.';
          return;
        }
        var name = document.getElementById('authName').value.trim();
        var phone = document.getElementById('authPhone').value.trim();
        var role = 'customer';
        if (users.find(u => u.email === email)) {
          authError.textContent = 'Email already registered.';
          return;
        }
        var isAdmin = false;
        var newUser = { email, password, name, phone, cart: [], orders: [], isAdmin, role };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', email);
        window.updateProfileBtn(); // update UI before closing
        closeAuth();
        location.reload();
      } else {
        var user = users.find(u => u.email === email && u.password === password);
        if (!user) {
          authError.textContent = 'Invalid email or password.';
          return;
        }
        // If logging in as admin, ensure only this account is admin
        if (email === 'CopitOfficial' && password === 'Rowanisthegoat32@$$') {
          // Remove any existing admin user
          let filteredUsers = users.filter(u => u.email !== 'CopitOfficial');
          // Add fresh admin user
          filteredUsers.push({
            email: 'CopitOfficial',
            password: 'Rowanisthegoat32@$$',
            name: 'Admin',
            phone: '',
            cart: [],
            orders: [],
            isAdmin: true,
            role: 'admin'
          });
          localStorage.setItem('users', JSON.stringify(filteredUsers));
          localStorage.setItem('currentUser', email);
          window.updateProfileBtn(); // update UI before closing
          closeAuth();
          window.location.href = 'admin.html';
          return;
        }
        localStorage.setItem('currentUser', email);
        window.updateProfileBtn(); // update UI before closing
        closeAuth();
        location.reload();
      }
    });
  }

  // Open signup modal if not logged in and user clicks SIGN UP
  if (profileBtn) {
    profileBtn.addEventListener('click', function(e) {
      var currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        e.preventDefault();
        openAuth('signup');
      } else {
        e.preventDefault();
        window.location.href = 'profile.html';
      }
    });
  }
});

// Catalog dropdown click-to-open and close on mouse leave
window.addEventListener('DOMContentLoaded', function() {
  // Catalog dropdown
  var catalogDropdown = document.querySelector('.catalog-dropdown');
  var megaMenu = catalogDropdown ? catalogDropdown.querySelector('.mega-menu') : null;
  if (catalogDropdown && megaMenu) {
    let menuOpen = false;
    function openMenu() {
      megaMenu.style.display = 'flex';
      menuOpen = true;
    }
    function closeMenu() {
      megaMenu.style.display = 'none';
      menuOpen = false;
    }
    catalogDropdown.addEventListener('mouseenter', openMenu);
    megaMenu.addEventListener('mouseenter', openMenu);
    catalogDropdown.addEventListener('mouseleave', function(e) {
      // Only close if mouse is not entering megaMenu
      if (!megaMenu.contains(e.relatedTarget)) closeMenu();
    });
    megaMenu.addEventListener('mouseleave', function(e) {
      // Only close if mouse is not entering catalogDropdown
      if (!catalogDropdown.contains(e.relatedTarget)) closeMenu();
    });
  }

  // Profile button text
  var profileBtn = document.getElementById('profileBtn');
  function updateProfileBtn() {
    var currentUser = localStorage.getItem('currentUser');
    var users = JSON.parse(localStorage.getItem('users') || '[]');
    var user = users.find(u => u.email === currentUser);
    // Force admin status if credentials match
    if (user && user.email === 'CopitOfficial' && user.password === 'Rowanisthegoat32@$$') {
      user.isAdmin = true;
      // Remove admin from all other users
      users.forEach(u => {
        if (u.email !== 'CopitOfficial') u.isAdmin = false;
      });
      localStorage.setItem('users', JSON.stringify(users));
    }
    if (profileBtn) profileBtn.textContent = currentUser ? 'PROFILE' : 'SIGN UP';
    if (logoutBtn) logoutBtn.style.display = currentUser ? '' : 'none';
    if (adminBtn) adminBtn.style.display = (user && user.isAdmin) ? '' : 'none';
  }
    if (adminBtn && adminModal && closeAdminModal && adminContent) {
      adminBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // Show all users and their data, allow role editing
        var users = JSON.parse(localStorage.getItem('users') || '[]');
        var html = '<h3>All Users</h3>';
        html += '<ul style="padding-left:18px;">';
        users.forEach((u, idx) => {
          html += '<li>';
          html += '<b>' + u.email + '</b>';
          if (u.isAdmin) html += ' <span style="color:#ff1e1e">(admin)</span>';
          html += '<br>Name: ' + (u.name || '') + '<br>Phone: ' + (u.phone || '');
          html += '<br>Role: <select data-idx="' + idx + '" class="role-select">';
          html += '<option value="admin"' + (u.role === 'admin' ? ' selected' : '') + '>Admin</option>';
          html += '<option value="moderator"' + (u.role === 'moderator' ? ' selected' : '') + '>Moderator</option>';
          html += '<option value="customer"' + ((u.role === 'customer' || !u.role) ? ' selected' : '') + '>Customer</option>';
          html += '</select>';
          html += '<br>Orders: ' + (u.orders ? u.orders.length : 0);
          html += '</li><br>';
        });
        html += '</ul>';
        adminContent.innerHTML = html;
        adminModal.style.display = 'flex';

        // Add event listeners for role changes
        Array.from(adminContent.querySelectorAll('.role-select')).forEach(function(sel) {
          sel.addEventListener('change', function() {
            var idx = parseInt(sel.dataset.idx);
            var newRole = sel.value;
            users[idx].role = newRole;
            users[idx].isAdmin = (newRole === 'admin');
            localStorage.setItem('users', JSON.stringify(users));
            window.updateProfileBtn();
            sel.blur();
          });
        });
      });
      closeAdminModal.addEventListener('click', function() {
        adminModal.style.display = 'none';
      });
    }
  window.updateProfileBtn = updateProfileBtn;
  updateProfileBtn();

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('currentUser');
      updateProfileBtn();
      location.reload();
    });
  }

  // Hide announcement on close
  var closeAnnouncementBtn = document.querySelector('.close-announcement');
  if (closeAnnouncementBtn) {
    closeAnnouncementBtn.addEventListener('click', function() {
      var announcement = document.getElementById('announcement');
      if (announcement) announcement.style.display = 'none';
    });
  }

  // Scroll shrink header
  const header = document.getElementById('mainHeader');
  const THRESHOLD = 100;
  function onScroll(){
    if(window.scrollY > THRESHOLD) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hide announcement/moving banner on scroll
  window.addEventListener('scroll', function(){
    const announcement = document.getElementById('announcement');
    const movingBanner = document.getElementById('movingBanner');
    const THRESHOLD = 100;
    if(window.scrollY > THRESHOLD){
      if(announcement) announcement.style.transform = 'translateY(-100%)';
      if(movingBanner) movingBanner.style.transform = 'translateY(-100%)';
    } else {
      if(announcement) announcement.style.transform = 'translateY(0)';
      if(movingBanner) movingBanner.style.transform = 'translateY(0)';
    }
  });

  // Duplicate reviews for seamless loop
  const track = document.getElementById('reviewTrack');
  if(track) track.innerHTML += track.innerHTML;
});