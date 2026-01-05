// pagination.js
let currentPage = 1;
let itemsPerPage = 100;
let totalPages = 1;
let totalItems = 0;

// Atualizar estado da paginação
function atualizarPagination(total, perPage) {
  totalItems = total;
  if (perPage) itemsPerPage = perPage; // atualiza itemsPerPage
  totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const pageIndicator = document.getElementById("pageIndicator");
  if (pageIndicator) pageIndicator.textContent = `${currentPage} / ${totalPages}`;

  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;
}

// Inicializar eventos
function inicializarPagination(onPageChangeCallback) {
  document.getElementById("prevPage")?.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      onPageChangeCallback?.();
    }
  });

  document.getElementById("nextPage")?.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      onPageChangeCallback?.();
    }
  });

  document.getElementById("itemsPerPage")?.addEventListener("change", (e) => {
    itemsPerPage = parseInt(e.target.value);
    currentPage = 1;
    onPageChangeCallback?.();
  });
}

// Exportar
window.pagination = {
  get currentPage() { return currentPage; },
  set currentPage(val) { currentPage = val; },
  get itemsPerPage() { return itemsPerPage; },
  set itemsPerPage(val) { itemsPerPage = val; },
  get totalPages() { return totalPages; },
  set totalPages(val) { totalPages = val; },
  get totalItems() { return totalItems; },
  set totalItems(val) { totalItems = val; },
  atualizarPagination,
  inicializarPagination,
};
