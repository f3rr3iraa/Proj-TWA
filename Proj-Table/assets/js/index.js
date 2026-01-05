// =======================
// index.js
// =======================

let produtoSelecionado = null;

// =======================
// Mostrar toast dinâmico
// =======================
function showToast(message, type = "primary") {
  const toastEl = document.getElementById("liveToast");
  const toastBody = document.getElementById("toastMessage");

  if (!toastEl || !toastBody) return;

  toastBody.textContent = message;
  toastEl.className = `toast align-items-center text-bg-${type} border-0`;

  const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
  toast.show();
}

// =======================
// Carregar marcas
// =======================
async function carregarMarcas() {
  try {
    const res = await fetch("http://localhost:3000/api/table/items?from=0&to=99999");
    const data = await res.json();

    if (!data || !data.items) return;

    const marcasNormalizadas = data.items
      .map(i => i.marca?.trim())
      .filter(Boolean)
      .map(m => m.charAt(0).toUpperCase() + m.slice(1).toLowerCase());

    const marcasUnicas = [...new Set(marcasNormalizadas)].sort();

    const select = document.getElementById("filtroMarca");
    if (!select) return;

    marcasUnicas.forEach(marca => {
      const opt = document.createElement("option");
      opt.value = marca;
      opt.textContent = marca;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error("Erro ao carregar marcas:", err);
  }
}


// =======================
// Carregar produtos com filtros e paginação
// =======================
async function initHome(filtroEstado = "on") {
  try {
    const tableBody = document.getElementById("itemsBody");
    if (!tableBody) return;

    // Resetar tabela ao carregar novos dados
    tableBody.innerHTML = `<tr><td colspan="8">A carregar dados...</td></tr>`;

    // Pegar índices da paginação
    const from = (window.pagination.currentPage - 1) * window.pagination.itemsPerPage;
    const to = from + window.pagination.itemsPerPage - 1;

    // Montar query string para Netlify Function
    const queryParams = new URLSearchParams({
      marca: window.filtros?.marca || "",
      nome: window.filtros?.nome || "",
      tipo: window.filtros?.tipo || "",
      from,
      to
    }).toString();

    const res = await fetch(`http://localhost:3000/api/table/items?${queryParams}`);
    const data = await res.json();

    // Checar se retornou itens
    if (!data?.items || data.items.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8">Nenhum produto encontrado.</td></tr>`;
      if (window.pagination?.atualizarPagination) window.pagination.atualizarPagination(0);
      return;
    }

    // Renderizar tabela
    tableBody.innerHTML = data.items.map(item => {
      const marcaenomeeespessura = `${item.marca ?? ""} - ${item.nome ?? ""} ${item.espessura ?? ""}`;
      return `
        <tr data-id="${item.id}">
          ${filtroEstado === "on" ? `<td><button class="btn btn-sm btn-reserve btn-reversar">Reservar</button></td>` : ""}
          <td>${marcaenomeeespessura}</td>
          <td>${item.comprimento ?? ""}</td>
          <td>${item.largura ?? ""}</td>
          <td>${item.lote ?? ""}</td>
          <td>${item.tipo ?? ""}</td>
          <td>${item.foto ? `<img src="${item.foto}" style="max-width:100px;height:60px;object-fit:cover;">` : ""}</td>
          <td>${item.observacoes ?? ""}</td>
        </tr>
      `;
    }).join("");

    // Botão reservar
    if (filtroEstado === "on") {
      document.querySelectorAll(".btn-reversar").forEach(btn => {
        btn.addEventListener("click", e => {
          const row = e.target.closest("tr");
          const id = row.getAttribute("data-id");
          const item = data.items.find(d => d.id == id);
          if (!item) return showToast("Erro: produto não encontrado!", "danger");

          produtoSelecionado = item;
          window.selectedProduct = item; 
          initReserveModal();

          const infoDiv = document.getElementById("reserveProductInfo");
          const marcaenomeeespessura = `${item.marca ?? ""} - ${item.nome ?? ""} ${item.espessura ?? ""}`;
          infoDiv.innerHTML = `
            <h5><strong>Informações do Produto</strong></h5>
            <p><strong>Marca/Nome:</strong> ${marcaenomeeespessura}</p>
            <p><strong>Comprimento:</strong> ${item.comprimento ?? ""}</p>
            <p><strong>Largura:</strong> ${item.largura ?? ""}</p>
            <p><strong>Lote:</strong> ${item.lote ?? ""}</p>
            <p><strong>Tipo:</strong> ${item.tipo ?? ""}</p>
            <p><strong>Observação:</strong> ${item.observacoes ?? ""}</p>
            ${item.foto ? `<img src="${item.foto}" class="img-fluid rounded" style="height:286px;width:auto;">` : ""}
          `;
          new bootstrap.Modal(document.getElementById("reserveModal")).show();
        });
      });
    }

    // Atualizar paginação
    if (window.pagination?.atualizarPagination) {
      window.pagination.atualizarPagination(data.totalItems || data.items.length);
    }

  } catch (err) {
    console.error(err);
    const tableBody = document.getElementById("itemsBody");
    if (tableBody) tableBody.innerHTML = `<tr><td colspan="8">Erro inesperado ao carregar dados.</td></tr>`;
  }
}

// =======================
// Inicialização
// =======================
document.addEventListener("DOMContentLoaded", async () => {
  if (typeof inicializarFiltros === "function") inicializarFiltros();

  if (typeof carregarFiltrosDaURL === "function") {
    carregarFiltrosDaURL();
    if (typeof atualizarFiltrosNoDOM === "function") atualizarFiltrosNoDOM();
  }

  if (window.pagination?.inicializarPagination) {
    window.pagination.inicializarPagination(() => initHome());
  }

  await carregarMarcas();
  await initHome();

  window.addEventListener("filtrosAtualizados", () => {
    window.pagination.currentPage = 1;
    initHome();
    if (typeof atualizarURLComFiltros === "function") atualizarURLComFiltros();
  });

  // =======================
  // Polling suave de atualizações
  // =======================
  window.lastCheck = Date.now();

  setInterval(async () => {
    const res = await fetch("http://localhost:3000/api/table/itemsUpdates?lastCheck=" + window.lastCheck);
    const data = await res.json();

    if (data.items && data.items.length) {
      data.items.forEach(item => {
        const row = document.querySelector(`tr[data-id="${item.id}"]`);
        if (row) {
          // Produto reservado → remove linha suavemente
          row.style.transition = "opacity 0.5s";
          row.style.opacity = 0;
          setTimeout(() => row.remove(), 500);
        }
      });
      window.lastCheck = Date.now();
    }
  }, 3000); 
});


// =======================
// Modal de imagem
// =======================
document.addEventListener("click", e => {
  const img = e.target.closest("img");
  if (img && img.src && img.closest("table")) {
    const modalImg = document.getElementById("modalImgView");
    modalImg.src = img.src;

    const modal = new bootstrap.Modal(document.getElementById("modalImg"));
    modal.show();
  }
});

// =======================
// Exportar função principal
// =======================
window.initHome = initHome;
