let cart = JSON.parse(localStorage.getItem("cart")) || [];
let discount = 0;
const shipping = 10;

function renderCart() {
    const container = document.getElementById("cart-items");
    container.innerHTML = "";

    let subtotal = 0;

    cart.forEach((item, index) => {
        subtotal += item.price * item.quantity;

        container.innerHTML += `
        <div class="cart-item">
            <img src="${item.image}">
            <div class="cart-details">
                <h4>${item.name}</h4>
                <p>Category: ${item.category}</p>
                <p>$${item.price}</p>

                <div class="quantity-box">
                    <button onclick="changeQty(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQty(${index}, 1)">+</button>
                </div>
            </div>

            <div>
                <h4>$${item.price * item.quantity}</h4>
                <span class="remove-btn" onclick="removeItem(${index})">🗑</span>
            </div>
        </div>
        `;
    });

    document.getElementById("subtotal").innerText = subtotal.toFixed(2);
    document.getElementById("discount").innerText = discount.toFixed(2);

    const total = subtotal + shipping - discount;
    document.getElementById("total").innerText = total.toFixed(2);
}

function changeQty(index, change) {
    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function applyCoupon() {
    const code = document.getElementById("coupon").value;

    if (code === "GOLD20") {
        discount = 20;
    } else if (code === "SAVE10") {
        discount = 10;
    } else {
        discount = 0;
        alert("Invalid coupon");
    }

    renderCart();
}

function checkout(){
  if(cart.length === 0){
    alert("Your cart is empty.");
    return;
  }

  window.location.href = "checkout.html";
}
renderCart();

fetch('product.json')
.then(res => res.json())
.then(data => {
    const container = document.getElementById("similar-products");
    data.slice(0,3).forEach(product => {
        container.innerHTML += `
        <div class="similar-card" onclick="goToProduct(${product.id})">
            <img src="${product.image}" style="width:100%; border-radius:15px;">
            <h4>${product.name}</h4>
            <p>$${product.price}</p>
        </div>
        `;
    });
});

function goToProduct(id){
    localStorage.setItem("selectedProduct", id);
    window.location.href = "product.html";
}
