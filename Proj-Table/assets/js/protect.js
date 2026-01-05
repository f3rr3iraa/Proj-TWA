// ===============================
//  PROJECT FINAL | CONTROLE DE ACESSO + URL
// ===============================

document.addEventListener("DOMContentLoaded", async () => {
  const path = window.location.pathname;
  const urlCompleta = window.location.href;
  const rotasPermitidas = ["/", "/index.html", "/filtro"];
  let loginFeito = false;



  // --- Função para mostrar/esconder elementos
  function atualizarElementosLogin() {
    const contactos = document.getElementById("contactosNavbar");
    const botaoshare = document.getElementById("botaoshare");
    const filtros = document.getElementById("filtrosContainer");

    if (loginFeito) {
      // 🔒 Logado → esconder contactos
      if (contactos)
        contactos.style.setProperty("display", "none", "important");

      // Mostrar botão de share
      if (botaoshare) {
        botaoshare.style.display = "block";
        botaoshare.classList.remove("d-none");
      }

      // Mostrar filtros
      if (filtros) filtros.classList.remove("d-none");
    } else {
      // 🔓 Não logado → mostrar contactos
      if (contactos)
        contactos.style.setProperty("display", "flex", "important");

      // Esconder botão de share
      if (botaoshare) {
        botaoshare.style.display = "none";
        botaoshare.classList.add("d-none");
      }

      // Esconder filtros
      if (filtros) filtros.classList.add("d-none");
    }
  }

  // --- Pedir login se necessário
const tokenExistente = localStorage.getItem("authToken");
if (tokenExistente) {
  loginFeito = true;
}

if (rotasPermitidas.includes(path) && !loginFeito) {
  const pass = prompt(
    "🔒 Bem-vindo à Lista | J. Sousa e Coelho, LDA\n\nIntroduza a Palavra-Passe:"
  );

  try {
    const res = await fetch(`http://localhost:3000/api/table/verifica-pass?pass=${pass}`);
    const data = await res.json();

    if (!data.autorizado) {
      alert("❌ Palavra-Passe incorreta!");
      window.location.href = "/";
      return;
    }

    localStorage.setItem("authToken", data.token);
    loginFeito = true;

    sessionStorage.clear();
  } catch (err) {
    console.error(err);
    alert("Erro ao verificar a senha. Tente novamente.");
    window.location.href = "/";
    return;
  }
}


  // --- Atualiza visibilidade dos elementos após login ou se já estava logado
  atualizarElementosLogin();

  // --- Modo administrador
  if (window.location.search.includes("admin=1")) {
    sessionStorage.removeItem("linkGuardado");
    console.log("🔓 Bloqueio removido (modo admin).");
  }

  // --- BLOQUEIO DE URL
  const linkGuardado = sessionStorage.getItem("linkBloqueado");

  if (!loginFeito && path.startsWith("/filtro/") && !linkGuardado) {
    sessionStorage.setItem("linkBloqueado", urlCompleta);
  }

  if (!loginFeito && linkGuardado) {
    if (path.startsWith("/filtro/") && linkGuardado !== urlCompleta) {
      window.location.href = linkGuardado;
      return;
    }

    const rotasProibidas = ["/", "/index.html", "/filtro", "/filtro/"];
    if (rotasProibidas.includes(path)) {
      window.location.href = linkGuardado;
      return;
    }
  }

  if (
    !rotasPermitidas.includes(path) &&
    !path.startsWith("/filtro/") &&
    !loginFeito
  ) {
    window.location.href = "/";
    return;
  }
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

  if (
    !compacto.m &&
    !compacto.n &&
    (!compacto.t || compacto.t === "" || compacto.t === "Todos")
  ) {
    const linkGuardado = sessionStorage.getItem("linkBloqueado");
    history.replaceState(null, "", linkGuardado || "/");
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

  if (!json) {
    const linkGuardado = sessionStorage.getItem("linkBloqueado");
    if (linkGuardado) window.location.href = linkGuardado;
    return;
  }

  let compacto;
  try {
    compacto = JSON.parse(json);
  } catch {
    const linkGuardado = sessionStorage.getItem("linkBloqueado");
    if (linkGuardado) window.location.href = linkGuardado;
    return;
  }

  window.filtros.marca = compacto.m || "";
  window.filtros.nome = compacto.n || "";
  window.filtros.tipo = compacto.t || "";

  document.getElementById("filtroMarca").value = filtros.marca;
  document.getElementById("filtroNome").value = filtros.nome;
  document.getElementById("filtroTipo").value = filtros.tipo;
}
