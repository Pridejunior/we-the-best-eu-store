let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {
    cart.push({ name, price });
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Added to cart");
}

function updateCartCount() {
    const count = document.getElementById("cart-count");
    if (count) {
        count.innerText = cart.length;
    }
}

function displayCart() {
    const cartContainer = document.getElementById("cart-items");
    const totalContainer = document.getElementById("cart-total");

    if (!cartContainer) return;

    cartContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;

        cartContainer.innerHTML += `
            <div class="cart-item">
                ${item.name} - €${item.price}
                <button onclick="removeItem(${index})">Remove</button>
            </div>
        `;
    });

    totalContainer.innerText = "Total: €" + total;
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

updateCartCount();
displayCart();

function processPayment() {
    const name = document.getElementById("customerName").value;
    const email = document.getElementById("customerEmail").value;

    if (!name || !email) {
        alert("Please fill all fields");
        return;
    }

    localStorage.setItem("lastOrder", JSON.stringify(cart));

    // Stripe Test Redirect (replace with real public key later)
    window.location.href = "https://checkout.stripe.com/test";
}


function login() {
    const email = document.getElementById("loginEmail").value;
    if (!email) return;

    localStorage.setItem("user", email);
    alert("Logged in successfully");
    document.getElementById("loginModal").style.display = "none";
}

function openLogin() {
    document.getElementById("loginModal").style.display = "flex";
}


function generateInvoice() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const order = JSON.parse(localStorage.getItem("lastOrder")) || [];

    let y = 20;
    doc.text("WE THE BEST EU STORE", 20, 10);
    doc.text("Invoice", 20, y);

    order.forEach(item => {
        y += 10;
        doc.text(item.name + " - €" + item.price, 20, y);
    });

    doc.save("invoice.pdf");
}


function loadAdmin() {
    const container = document.getElementById("adminOrders");
    if (!container) return;

    const order = JSON.parse(localStorage.getItem("lastOrder"));
    if (!order) {
        container.innerHTML = "No orders yet.";
        return;
    }

    order.forEach(item => {
        container.innerHTML += `<p>${item.name} - €${item.price}</p>`;
    });
}

loadAdmin();


// Sticky shadow on scroll
window.addEventListener("scroll", function(){
    const navbar = document.querySelector(".navbar");
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  });
  
  // Mobile menu toggle
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  
  if(navToggle){
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // Add shadow when scrolling
window.addEventListener("scroll", function(){
    const navbar = document.querySelector(".navbar");
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  });