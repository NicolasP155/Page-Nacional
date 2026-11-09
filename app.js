// ====== CONFIGURACIÓN ======
// Tu número de WhatsApp con código de país, sin + ni espacios (ej. Colombia: 57 + número)
const WHATSAPP = "573000000000";

// Para usar fotos reales, agrega  img: "imagenes/camiseta.jpg"  a cada producto.
const PRODUCTOS = [
  { id: 1, nombre: "Camiseta local 2026", cat: "Ropa", precio: 189900, emoji: "👕", tallas: ["S","M","L","XL"], etiqueta: "Nuevo", desc: "Verde y blanco, tela transpirable." },
  { id: 2, nombre: "Camiseta visitante", cat: "Ropa", precio: 189900, emoji: "👕", tallas: ["S","M","L","XL"], desc: "Diseño oscuro con detalles verdes." },
  { id: 3, nombre: "Buzo hoodie Verdolaga", cat: "Ropa", precio: 159900, emoji: "🧥", tallas: ["S","M","L","XL"], desc: "Algodón suave para las noches frías." },
  { id: 4, nombre: "Gorra bordada", cat: "Accesorios", precio: 69900, emoji: "🧢", desc: "Escudo bordado, ajustable." },
  { id: 5, nombre: "Bufanda de hincha", cat: "Accesorios", precio: 49900, emoji: "🧣", desc: "Para alentar en el Atanasio." },
  { id: 6, nombre: "Bandera 150x90 cm", cat: "Accesorios", precio: 59900, emoji: "🏴", desc: "Tela resistente con ojales." },
  { id: 7, nombre: "Balón conmemorativo", cat: "Coleccionables", precio: 139900, emoji: "⚽", etiqueta: "Edición limitada", desc: "Balón número 5 de colección." },
  { id: 8, nombre: "Taza verdolaga", cat: "Coleccionables", precio: 34900, emoji: "☕", desc: "Cerámica con el escudo." },
  { id: 9, nombre: "Llavero escudo", cat: "Coleccionables", precio: 19900, emoji: "🔑", desc: "Metal esmaltado." }
];

// ====== LÓGICA ======
const $grid = document.getElementById("grid");
const $filtros = document.getElementById("filtros");
const cop = n => "$" + n.toLocaleString("es-CO");
const categorias = ["Todos", ...new Set(PRODUCTOS.map(p => p.cat))];
const tallaElegida = {}; // id -> talla
let filtroActual = "Todos";

function pintarFiltros() {
  $filtros.innerHTML = categorias.map(c =>
    `<button class="chip ${c === filtroActual ? "activo" : ""}" data-cat="${c}">${c}</button>`).join("");
}

function pintarProductos() {
  const lista = filtroActual === "Todos" ? PRODUCTOS : PRODUCTOS.filter(p => p.cat === filtroActual);
  $grid.innerHTML = lista.map(p => `
    <article class="card">
      <div class="card-img">
        ${p.img ? `<img src="${p.img}" alt="${p.nombre}" loading="lazy">` : `<span aria-hidden="true">${p.emoji}</span>`}
        ${p.etiqueta ? `<span class="etiqueta">${p.etiqueta}</span>` : ""}
      </div>
      <div class="card-body">
        <h3>${p.nombre}</h3>
        <p>${p.desc}</p>
        ${p.tallas ? `<div class="tallas" data-id="${p.id}">${p.tallas.map(t =>
          `<button class="talla ${tallaElegida[p.id] === t ? "activa" : ""}" data-talla="${t}">${t}</button>`).join("")}</div>` : ""}
        <span class="error" id="err-${p.id}"></span>
        <span class="precio">${cop(p.precio)}</span>
        <button class="btn" data-comprar="${p.id}">Comprar</button>
      </div>
    </article>`).join("");
}

function comprar(id) {
  const p = PRODUCTOS.find(x => x.id === id);
  const talla = tallaElegida[id];
  if (p.tallas && !talla) {
    document.getElementById("err-" + id).textContent = "Elige una talla para continuar.";
    return;
  }
  const msg = `Hola, quiero comprar:\n• ${p.nombre}${talla ? " (talla " + talla + ")" : ""}\n• Precio: ${cop(p.precio)}\n¿Tienen disponible?`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
}

$filtros.addEventListener("click", e => {
  const b = e.target.closest("[data-cat]");
  if (!b) return;
  filtroActual = b.dataset.cat;
  pintarFiltros();
  pintarProductos();
});

$grid.addEventListener("click", e => {
  const t = e.target.closest("[data-talla]");
  if (t) {
    const id = Number(t.parentElement.dataset.id);
    tallaElegida[id] = t.dataset.talla;
    t.parentElement.querySelectorAll(".talla").forEach(b => b.classList.toggle("activa", b === t));
    document.getElementById("err-" + id).textContent = "";
    return;
  }
  const c = e.target.closest("[data-comprar]");
  if (c) comprar(Number(c.dataset.comprar));
});

pintarFiltros();
pintarProductos();
