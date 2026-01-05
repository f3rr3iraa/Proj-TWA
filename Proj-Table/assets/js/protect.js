// ===============================
//  PROJECT FINAL | CONTROLE DE ACESSO REMOVIDO
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  // --- Mostrar todos os elementos sem login
  const contactos = document.getElementById("contactosNavbar");
  const filtros = document.getElementById("filtrosContainer");

  if (contactos) contactos.style.setProperty("display", "flex", "important");
  
  if (filtros) filtros.classList.remove("d-none");

  // --- Modo administrador (opcional, pode deixar ou remover)
  if (window.location.search.includes("admin=1")) {
    sessionStorage.removeItem("linkGuardado");
    console.log("🔓 Modo admin ativo, sem bloqueios.");
  }

  // --- Carregar filtros da URL normalmente
  carregarFiltrosDaURL();
});

// ===============================
//  CONTROLE DOS FILTROS + URL
// ===============================

function atualizarURLComFiltros() {
  const compacto = {
    m: filtros.marca || "",
    n: filtros.nome || "",
    t: filtros.tipo || "",
  };

  if (!compacto.m && !compacto.n && (!compacto.t || compacto.t === "" || compacto.t === "Todos")) {
    history.replaceState(null, "", "/");
    return;
  }

  const json = JSON.stringify(compacto);
  const compressed = LZString.compressToEncodedURIComponent(json);
  history.replaceState(null, "", `/filtro/${compressed}`);
}

function carregarFiltrosDaURL() {
  const match = window.location.pathname.match(/^\/filtro\/(.+)$/);
  if (!match) return;

  const compressed = match[1];
  let json;

  try {
    json = LZString.decompressFromEncodedURIComponent(compressed);
  } catch {
    json = null;
  }

  if (!json) return;

  let compacto;
  try {
    compacto = JSON.parse(json);
  } catch {
    return;
  }

  window.filtros.marca = compacto.m || "";
  window.filtros.nome = compacto.n || "";
  window.filtros.tipo = compacto.t || "";

  document.getElementById("filtroMarca").value = filtros.marca;
  document.getElementById("filtroNome").value = filtros.nome;
  document.getElementById("filtroTipo").value = filtros.tipo;
}
