// Estado global de filtros
const filtros = {
  marca: "",
  nome: "",
  tipo: "",
};

// Atualizar filtros a partir dos inputs
function inicializarFiltros() {
  const filtroMarca = document.getElementById("filtroMarca");
  const filtroNome = document.getElementById("filtroNome");
  const filtroTipo = document.getElementById("filtroTipo");

  if (filtroMarca) {
    filtroMarca.addEventListener("change", (e) => {
      filtros.marca = e.target.value;
      window.dispatchEvent(new Event("filtrosAtualizados"));
    });
  }

  if (filtroNome) {
    filtroNome.addEventListener("input", (e) => {
      filtros.nome = e.target.value.trim();
      window.dispatchEvent(new Event("filtrosAtualizados"));
    });
  }

  if (filtroTipo) {
    filtroTipo.addEventListener("change", (e) => {
      filtros.tipo = e.target.value;
      window.dispatchEvent(new Event("filtrosAtualizados"));
    });
  }

  // Botão limpar filtros
  const btnLimpar = document.getElementById("btnLimparFiltros");
  if (btnLimpar) {
    btnLimpar.addEventListener("click", () => {
      filtros.marca = "";
      filtros.nome = "";
      filtros.tipo = "";

      if (filtroMarca) filtroMarca.value = "";
      if (filtroNome) filtroNome.value = "";
      if (filtroTipo) filtroTipo.value = "";

      window.dispatchEvent(new Event("filtrosAtualizados"));
    });
  }
}

// Atualizar inputs a partir do estado
function atualizarFiltrosNoDOM() {
  const filtroMarca = document.getElementById("filtroMarca");
  const filtroNome = document.getElementById("filtroNome");
  const filtroTipo = document.getElementById("filtroTipo");

  if (filtroMarca) filtroMarca.value = filtros.marca;
  if (filtroNome) filtroNome.value = filtros.nome;
  if (filtroTipo) filtroTipo.value = filtros.tipo;
}

// Exportar para outros ficheiros
window.filtros = filtros;
window.inicializarFiltros = inicializarFiltros;
window.atualizarFiltrosNoDOM = atualizarFiltrosNoDOM;
