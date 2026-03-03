// ---------------------- Global Variables ----------------------
let products = [];
let currentPage = 1;
const perPage = 8;
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ---------------------- Fetch Products ----------------------
fetch('product.json')
  .then(res => res.json())
  .then(data => {
    products = data;
    localStorage.setItem("products", JSON.stringify(products)); // store all products for product.html
    initFilters();
    displayProducts();
    renderMiniCart();
  })
  .catch(err => console.error("Error loading products:", err));

// ---------------------- Display Products ----------------------
function displayProducts() {
  const container = document.getElementById("products");
  if(!container) return;

  container.innerHTML = "";
  const filtered = applyFilters();

  const start = (currentPage - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  paginated.forEach(product => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${product.image}" onclick="viewProduct(${product.id})">
        <h4>${product.name}</h4>
        <p>${product.brand}</p>
        <p>$${product.price}</p>
        <button onclick='addToCart(${JSON.stringify(product)})'>
          Add to Cart
        </button>
      </div>
    `;
  });

  renderPagination(filtered.length);
}

// ---------------------- Pagination ----------------------
function renderPagination(total) {
  const pages = Math.ceil(total / perPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  for(let i=1;i<=pages;i++){
    pagination.innerHTML += `
      <button onclick="goToPage(${i})" 
      class="${i===currentPage?'active':''}">
      ${i}
      </button>
    `;
  }
}

function goToPage(page){
  currentPage = page;
  displayProducts();
}

// ---------------------- Filters ----------------------
function initFilters(){
    const categorySet = new Set();
    const brandSet = new Set();
    const colorSet = new Set();

    products.forEach(p => {
        categorySet.add(p.category);
        brandSet.add(p.brand);
        colorSet.add(p.color);
    });

    const categoryFilter = document.getElementById("categoryFilter");
    const brandFilter = document.getElementById("brandFilter");
    const colorFilter = document.getElementById("colorFilter");

    categoryFilter.innerHTML = `<option value="">All Categories</option>` + 
        Array.from(categorySet).map(c=>`<option value="${c}">${c}</option>`).join("");

    brandFilter.innerHTML = `<option value="">All Brands</option>` + 
        Array.from(brandSet).map(b=>`<option value="${b}">${b}</option>`).join("");

    colorFilter.innerHTML = `<option value="">All Colors</option>` + 
        Array.from(colorSet).map(cl=>`<option value="${cl}">${cl}</option>`).join("");

    // Event listener for filters
    [categoryFilter, brandFilter, colorFilter].forEach(sel => {
        sel.addEventListener("change", () => {
            currentPage = 1;
            displayProducts();
        });
    });
}

function applyFilters(){
  const search = document.getElementById("searchInput").value.toLowerCase();
  const category = document.getElementById("categoryFilter").value;
  const brand = document.getElementById("brandFilter").value;
  const color = document.getElementById("colorFilter").value;
  const luxury = document.getElementById("luxuryFilter") ? document.getElementById("luxuryFilter").value : "";
  const isNew = document.getElementById("newFilter") ? document.getElementById("newFilter").value : "";

  return products.filter(p => {
    return (
      p.name.toLowerCase().includes(search) &&
      (category === "" || p.category === category) &&
      (brand === "" || p.brand === brand) &&
      (color === "" || p.color === color) &&
      (luxury === "" || String(p.luxury) === luxury) &&
      (isNew === "" || String(p.new) === isNew)
    );
  });
}

// Search input
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  if(searchInput){
    searchInput.addEventListener("input", () => {
      currentPage = 1;
      displayProducts();
    });
  }
});

// ---------------------- Add To Cart ----------------------
function addToCart(product){
  const existing = cart.find(p => p.id === product.id);
  if(existing){
    existing.quantity++;
  } else {
    cart.push({...product, quantity:1});
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  renderMiniCart();
  toggleMiniCart(true);
  showNotification(`${product.name} added to cart`);
}

// ---------------------- Mini Cart ----------------------
function renderMiniCart(){
  const container = document.getElementById("miniCartItems");
  if(!container) return;

  container.innerHTML = "";
  let total = 0;

  cart.forEach((item,index)=>{
    total += item.price * item.quantity;

    container.innerHTML += `
      <div class="mini-cart-item">
        <img src="${item.image}">
        <div>
          <p>${item.name}</p>
          <small>Qty: ${item.quantity}</small>
        </div>
        <span onclick="removeMini(${index})">🗑</span>
      </div>
    `;
  });

  const totalSpan = document.getElementById("miniTotal");
  if(totalSpan) totalSpan.innerText = total.toFixed(2);

  // Update cart count badge
  const cartCount = document.getElementById("cartCount");
  if(cartCount) cartCount.innerText = cart.reduce((acc,i)=>acc+i.quantity,0);
}

function removeMini(index){
  cart.splice(index,1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderMiniCart();
}

// ---------------------- Mini Cart Toggle ----------------------
function toggleMiniCart(forceOpen=false){
  const mini = document.getElementById("miniCart");
  if(!mini) return;

  if(forceOpen){
    mini.classList.add("active");
  } else {
    mini.classList.toggle("active");
  }
}

// ---------------------- Checkout ----------------------
function goToCheckout(){
  window.location.href = "cart.html";
}

// ---------------------- View Product ----------------------
function viewProduct(id){
  localStorage.setItem("selectedProduct", id);
  window.location.href = "product.html";
}

// ---------------------- Notification ----------------------
function showNotification(message){
  let notif = document.querySelector(".notification");
  if(!notif){
    notif = document.createElement("div");
    notif.classList.add("notification");
    document.body.appendChild(notif);
  }
  notif.innerText = message;
  notif.style.display = "block";
  setTimeout(()=>{notif.style.display="none"},1500);
}
