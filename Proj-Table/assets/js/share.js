// ===============================
//  SHARE.JS | Partilha apenas com filtros
// ===============================

const copyBtn = document.getElementById("copyWhatsAppBtn");
const toastMessage = document.getElementById("toastMessage");
const liveToast = new bootstrap.Toast(document.getElementById("liveToast"));

// Função para identificar mobile
function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// Função para verificar se a URL tem filtros aplicados
function urlTemFiltros() {
  const path = window.location.pathname;
  // Só devolve true se houver algo depois de /filtro/
  return path.startsWith("/filtro/") && path.length > "/filtro/".length;
}

// Função para mostrar toast
function mostrarToast(message, tipo = "success") {
  toastMessage.textContent = message;

  const toastEl = document.getElementById("liveToast");
  toastEl.classList.remove("bg-success", "bg-danger", "bg-warning", "text-white", "text-dark");

  if (tipo === "success") {
    toastEl.classList.add("bg-success", "text-white");
  } else if (tipo === "error") {
    toastEl.classList.add("bg-danger", "text-white");
  } else if (tipo === "warning") {
    toastEl.classList.add("bg-warning", "text-dark");
  }

  liveToast.show();
}

copyBtn.addEventListener("click", async () => {
  if (!urlTemFiltros()) {
    mostrarToast("Aplique filtros antes de partilhar o link.", "warning");
    return;
  }
  

  const currentUrl = window.location.href;
  const message = `Informamos que este produto está disponível para encomenda. Consulte os detalhes aqui: ${currentUrl}`;

  // 👉 MOBILE (abre menu de apps)
  if (isMobile() && navigator.share) {
    try {
      await navigator.share({
        title: "Chapas e Sobras | Marmore Real, Lda",
        text: message,
      });
      return;
    } catch (err) {
      console.log("Partilha cancelada ou erro:", err);
      return;
    }
  }

  // 👉 DESKTOP (só copia o texto)
  navigator.clipboard
    .writeText(message)
    .then(() => {
      mostrarToast("Link copiado com sucesso!", "success");
    })
    .catch((err) => {
      mostrarToast("Erro ao copiar a mensagem.", "error");
      console.error(err);
    });
});
