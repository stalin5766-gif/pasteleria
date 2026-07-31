const WHATSAPP_NUMBER = "593996620438";

const products = [
  {
    id: 1,
    name: "Pastel Rosé",
    category: "pasteles",
    price: 32,
    unit: "desde",
    badge: "Más pedido",
    description: "Bizcocho suave con crema de vainilla, frutos rojos y decoración floral.",
    image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 2,
    name: "Pastel Chocolate Deluxe",
    category: "pasteles",
    price: 38,
    unit: "desde",
    badge: "Chocolate",
    description: "Capas de chocolate intenso, relleno cremoso y ganache artesanal.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 3,
    name: "Pastel Infantil",
    category: "pasteles",
    price: 42,
    unit: "desde",
    badge: "Personalizable",
    description: "Pastel temático con nombre, edad, colores y personaje a elección.",
    image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 4,
    name: "Mini Sándwiches",
    category: "bocaditos",
    price: 18,
    unit: "25 unidades",
    badge: "Salado",
    description: "Mini sándwiches frescos con rellenos variados para compartir.",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 5,
    name: "Empanaditas Mixtas",
    category: "bocaditos",
    price: 16,
    unit: "25 unidades",
    badge: "Favorito",
    description: "Empanaditas doradas con rellenos de queso, pollo y carne.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 6,
    name: "Box de Bocaditos",
    category: "bocaditos",
    price: 28,
    unit: "40 unidades",
    badge: "Combo",
    description: "Selección de mini pizzas, empanaditas, rollitos y sándwiches.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 7,
    name: "Cheesecake de Frutos Rojos",
    category: "postres",
    price: 24,
    unit: "8 porciones",
    badge: "Cremoso",
    description: "Cheesecake horneado con salsa artesanal de frutos rojos.",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 8,
    name: "Cupcakes Decorados",
    category: "postres",
    price: 18,
    unit: "12 unidades",
    badge: "Personalizable",
    description: "Cupcakes de vainilla o chocolate con decoración temática.",
    image: "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 9,
    name: "Vasitos Dulces",
    category: "postres",
    price: 20,
    unit: "12 unidades",
    badge: "Surtidos",
    description: "Tres leches, chocolate, maracuyá y cheesecake en presentación individual.",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=85"
  }
];

let selectedCategory = "todos";
let cart = JSON.parse(localStorage.getItem("dulceEncantoCart") || "[]");
let modalProduct = null;
let modalQuantity = 1;

const productGrid = document.getElementById("productGrid");
const emptyState = document.getElementById("emptyState");
const productSearch = document.getElementById("productSearch");
const cartDrawer = document.getElementById("cartDrawer");
const drawerOverlay = document.getElementById("drawerOverlay");
const cartItems = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartSummary = document.getElementById("cartSummary");
const cartCount = document.getElementById("cartCount");
const cartSubtotal = document.getElementById("cartSubtotal");
const productModal = document.getElementById("productModal");
const toast = document.getElementById("toast");

const money = value => new Intl.NumberFormat("es-EC", {
  style: "currency",
  currency: "USD"
}).format(value);

const labelForCategory = category => ({
  pasteles: "Pasteles",
  bocaditos: "Bocaditos",
  postres: "Postres"
}[category] || category);

function renderProducts() {
  const term = productSearch.value.trim().toLowerCase();
  const filtered = products.filter(product => {
    const categoryMatches = selectedCategory === "todos" || product.category === selectedCategory;
    const textMatches = `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(term);
    return categoryMatches && textMatches;
  });

  productGrid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-image" onclick="openProduct(${product.id})">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="product-badge">${product.badge}</span>
        <button class="quick-view" type="button">Ver detalles</button>
      </div>
      <div class="product-content">
        <span class="product-category">${labelForCategory(product.category)}</span>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-footer">
          <div class="product-price">
            <strong>${money(product.price)}</strong>
            <small>${product.unit}</small>
          </div>
          <button class="add-button" type="button" onclick="addToCart(${product.id})" aria-label="Agregar ${product.name}">+</button>
        </div>
      </div>
    </article>
  `).join("");

  emptyState.classList.toggle("hidden", filtered.length > 0);
}

function saveCart() {
  localStorage.setItem("dulceEncantoCart", JSON.stringify(cart));
  renderCart();
}

function addToCart(productId, quantity = 1, note = "") {
  const product = products.find(item => item.id === productId);
  const normalizedNote = note.trim();
  const existing = cart.find(item => item.id === productId && item.note === normalizedNote);

  if (existing) existing.quantity += quantity;
  else cart.push({ id: product.id, quantity, note: normalizedNote });

  saveCart();
  showToast(`${product.name} agregado`);
}

function changeQuantity(index, amount) {
  cart[index].quantity += amount;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  saveCart();
}

function removeCartItem(index) {
  cart.splice(index, 1);
  saveCart();
}

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => {
    const product = products.find(product => product.id === item.id);
    return sum + product.price * item.quantity;
  }, 0);

  cartCount.textContent = totalItems;
  cartSubtotal.textContent = money(subtotal);

  const hasItems = cart.length > 0;
  cartItems.classList.toggle("hidden", !hasItems);
  cartEmpty.classList.toggle("hidden", hasItems);
  cartSummary.classList.toggle("hidden", !hasItems);

  cartItems.innerHTML = cart.map((item, index) => {
    const product = products.find(product => product.id === item.id);
    return `
      <article class="cart-item">
        <img src="${product.image}" alt="${product.name}">
        <div>
          <h4>${product.name}</h4>
          <small>${item.note ? `Nota: ${item.note}` : product.unit}</small>
          <div class="cart-item-actions">
            <div class="quantity-control">
              <button onclick="changeQuantity(${index}, -1)" aria-label="Restar">−</button>
              <span>${item.quantity}</span>
              <button onclick="changeQuantity(${index}, 1)" aria-label="Sumar">+</button>
            </div>
            <button class="remove-item" onclick="removeCartItem(${index})">Eliminar</button>
          </div>
        </div>
        <span class="cart-item-price">${money(product.price * item.quantity)}</span>
      </article>
    `;
  }).join("");
}

function openCart() {
  cartDrawer.classList.add("open");
  drawerOverlay.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  drawerOverlay.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  if (!productModal.classList.contains("open")) document.body.classList.remove("no-scroll");
}

window.openProduct = function(productId) {
  modalProduct = products.find(item => item.id === productId);
  modalQuantity = 1;
  document.getElementById("modalImage").src = modalProduct.image;
  document.getElementById("modalImage").alt = modalProduct.name;
  document.getElementById("modalCategory").textContent = labelForCategory(modalProduct.category);
  document.getElementById("modalName").textContent = modalProduct.name;
  document.getElementById("modalDescription").textContent = modalProduct.description;
  document.getElementById("modalQuantity").textContent = modalQuantity;
  document.getElementById("modalNote").value = "";
  updateModalPrice();
  productModal.classList.add("open");
  document.body.classList.add("no-scroll");
};

function closeProductModal() {
  productModal.classList.remove("open");
  if (!cartDrawer.classList.contains("open")) document.body.classList.remove("no-scroll");
}

function updateModalPrice() {
  document.getElementById("modalPrice").textContent = money(modalProduct.price * modalQuantity);
  document.getElementById("modalQuantity").textContent = modalQuantity;
}

function showToast(message) {
  toast.querySelector("p").textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove("show"), 2600);
}

function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function checkout() {
  if (!cart.length) return;

  const lines = cart.map(item => {
    const product = products.find(product => product.id === item.id);
    const note = item.note ? ` | Nota: ${item.note}` : "";
    return `• ${item.quantity} x ${product.name} — ${money(product.price * item.quantity)}${note}`;
  });

  const subtotal = cart.reduce((sum, item) => {
    const product = products.find(product => product.id === item.id);
    return sum + product.price * item.quantity;
  }, 0);

  const message = [
    "¡Hola! Quiero realizar el siguiente pedido:",
    "",
    ...lines,
    "",
    `Subtotal estimado: ${money(subtotal)}`,
    "",
    "¿Me ayudan a confirmar disponibilidad, entrega y valor final?"
  ].join("\n");

  window.open(whatsappUrl(message), "_blank", "noopener");
}

document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    selectedCategory = button.dataset.category;
    renderProducts();
  });
});

productSearch.addEventListener("input", renderProducts);
document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
drawerOverlay.addEventListener("click", closeCart);
document.getElementById("continueShopping").addEventListener("click", () => {
  closeCart();
  document.getElementById("productos").scrollIntoView({ behavior: "smooth" });
});
document.getElementById("clearCart").addEventListener("click", () => {
  cart = [];
  saveCart();
});
document.getElementById("checkoutBtn").addEventListener("click", checkout);

document.getElementById("closeProductModal").addEventListener("click", closeProductModal);
productModal.addEventListener("click", event => {
  if (event.target === productModal) closeProductModal();
});
document.getElementById("modalMinus").addEventListener("click", () => {
  modalQuantity = Math.max(1, modalQuantity - 1);
  updateModalPrice();
});
document.getElementById("modalPlus").addEventListener("click", () => {
  modalQuantity += 1;
  updateModalPrice();
});
document.getElementById("modalAddToCart").addEventListener("click", () => {
  addToCart(modalProduct.id, modalQuantity, document.getElementById("modalNote").value);
  closeProductModal();
  openCart();
});

document.getElementById("customCakeForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("customerName").value.trim();
  const date = document.getElementById("eventDate").value;
  const size = document.getElementById("cakeSize").value;
  const flavor = document.getElementById("cakeFlavor").value;
  const idea = document.getElementById("cakeIdea").value.trim();

  const message = [
    "¡Hola! Quiero cotizar un pastel personalizado.",
    "",
    `Nombre: ${name}`,
    `Fecha del evento: ${date}`,
    `Tamaño: ${size}`,
    `Sabor: ${flavor}`,
    `Idea: ${idea}`,
    "",
    "¿Me ayudan con el precio y la disponibilidad?"
  ].join("\n");

  window.open(whatsappUrl(message), "_blank", "noopener");
});

const genericMessage = whatsappUrl("¡Hola! Me gustaría recibir información sobre sus pasteles, bocaditos y postres.");
["whatsappCta", "floatingWhatsapp"].forEach(id => {
  document.getElementById(id).href = genericMessage;
});

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open.toString());
});

navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
    closeProductModal();
  }
});

const dateInput = document.getElementById("eventDate");
const minDate = new Date();
minDate.setDate(minDate.getDate() + 2);
dateInput.min = minDate.toISOString().split("T")[0];

document.getElementById("year").textContent = new Date().getFullYear();

renderProducts();
renderCart();
