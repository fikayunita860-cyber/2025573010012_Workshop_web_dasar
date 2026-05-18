const products = [
  { id: 1, name: "Buket Snack", price: 50000, img: "https://i.pinimg.com/736x/bd/6c/8b/bd6c8b2392cad51705e6114ed8b30807.jpg" },
  { id: 2, name: "Buket Bunga Satin", price: 80000, img: "https://i.pinimg.com/1200x/ae/6b/3b/ae6b3bf7ca0da78f334762180a401e33.jpg" },
  { id: 3, name: "Buket Uang", price: 100000, img: "https://i.pinimg.com/736x/e4/18/9d/e4189d21cbea927ee84473c491073bd5.jpg" },
  { id: 4, name: "Buket Bunga", price: 120000, img: "https://i.pinimg.com/736x/60/46/47/6046476205e0d521100673be60685fdf.jpg" },
  { id: 5, name: "Buket Balon", price: 90000, img: "https://i.pinimg.com/1200x/c4/98/fa/c498fa42efaff8089853cc39f597a445.jpg" },
  { id: 6, name: "Buket Costum", price: 100000, img: "https://i.pinimg.com/736x/57/9e/a0/579ea05cc876b6e3133ca44dea271cdd.jpg" }
];

let cart = [];
const productsEl = document.getElementById("products");
const cartEl = document.getElementById("cart-items");
const totalEl = document.getElementById("total");
const badge = document.getElementById("badge");

// tampilkan produk
function renderProducts() {
  productsEl.innerHTML = products.map(p => `
    <div class="card">
      <img src="${p.img}">
      <h4>${p.name}</h4>
      <p>Rp ${p.price}</p>
      <button data-id="${p.id}">Tambah</button>
    </div>
  `).join("");
}

// tambah ke keranjang
function addToCart(id) {
  const item = cart.find(i => i.id === id);

  if (item) {
    item.qty++;
  } else {
    const product = products.find(p => p.id === id);
    cart.push({ ...product, qty: 1 });
  }

  renderCart();
}

// render keranjang
function renderCart() {
  cartEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <strong>${item.name}</strong><br>
      Rp ${item.price} x ${item.qty}<br>
      <button data-action="minus" data-id="${item.id}">-</button>
      <button data-action="plus" data-id="${item.id}">+</button>
      <button data-action="remove" data-id="${item.id}">Hapus</button>
    </div>
  `).join("");

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  totalEl.textContent = total;

  const totalItem = cart.reduce((sum, i) => sum + i.qty, 0);
  badge.textContent = totalItem;
}

// klik produk
productsEl.addEventListener("click", e => {
  const id = Number(e.target.dataset.id);
  if (id) addToCart(id);
});

// klik keranjang
cartEl.addEventListener("click", e => {
  const id = Number(e.target.dataset.id);
  const action = e.target.dataset.action;

  const item = cart.find(i => i.id === id);
  if (!item) return;

  if (action === "plus") item.qty++;
  if (action === "minus") item.qty--;

  if (item.qty <= 0 || action === "remove") {
    cart = cart.filter(i => i.id !== id);
  }

  renderCart();
});

// checkout
document.getElementById("checkout").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Keranjang kosong!");
    return;
  }

  let text = "Pesanan Buket:\n\n";

  cart.forEach(item => {
    text += `${item.name} x${item.qty} = Rp ${item.price * item.qty}\n`;
  });

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  text += `\nTotal: Rp ${total}`;

  alert(text);
});

// init
renderProducts();
renderCart();