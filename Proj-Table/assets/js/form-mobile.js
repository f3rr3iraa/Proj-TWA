function initReserveModal() {
  const reserveModal = document.getElementById("reserveModal");
  if (!reserveModal) return console.error("reserveModal não encontrado!");

  // Evita duplicação de listeners
  if (reserveModal.dataset.initialized) return;
  reserveModal.dataset.initialized = "true";

  // =======================
  // 1️⃣ Ajustes mobile ao abrir
  // =======================
  reserveModal.addEventListener("show.bs.modal", () => {
    if (window.innerWidth < 992) {
      const dialog = reserveModal.querySelector(".modal-dialog");
      const content = reserveModal.querySelector(".modal-content");
      const body = reserveModal.querySelector(".modal-body");
      const formInputs = reserveModal.querySelectorAll(
        "input, select, textarea, button, label"
      );
      const modalTitle = reserveModal.querySelector(".modal-title");
      const closeBtn = reserveModal.querySelector(".btn-close");

      dialog.style.width = "100vw";
      dialog.style.maxWidth = "100vw";
      dialog.style.height = "100vh";
      dialog.style.margin = "0";
      dialog.style.position = "fixed";
      dialog.style.top = "0";
      dialog.style.left = "0";
      dialog.style.transform = "none";

      content.style.height = "100vh";
      content.style.borderRadius = "0";

      body.style.height = "calc(100vh - 70px)";
      body.style.overflowY = "auto";

      formInputs.forEach((el) => {
        if (["INPUT", "SELECT", "TEXTAREA"].includes(el.tagName)) {
          el.style.fontSize = "1.3rem";
          el.style.padding = "16px";
        }
        if (el.tagName === "BUTTON") {
          el.style.fontSize = "1.3rem";
          el.style.padding = "16px";
        }
        if (el.tagName === "LABEL") {
          el.style.fontSize = "1.1rem";
        }
      });

      if (modalTitle) modalTitle.style.fontSize = "1.8rem";
      if (closeBtn) closeBtn.style.fontSize = "1.8rem";
    }
  });

  // =======================
  // 2️⃣ Limpar elementos ao fechar
  // =======================
  reserveModal.addEventListener("hidden.bs.modal", () => {
    const lines = reserveModal.querySelectorAll(
      'div[style*="background-color: #2ae4752"]'
    );
    lines.forEach((line) => line.remove());
    window.selectedProduct = null;
    const form = reserveModal.querySelector("#contactForm");
    if (form) form.reset();
  });

  // =======================
  // 3️⃣ Submit do formulário
  // =======================
  const form = reserveModal.querySelector("#contactForm");
  if (!form)
    return console.error("contactForm não encontrado dentro do modal!");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');


    const formData = new FormData(this);
    const json = Object.fromEntries(formData.entries());

    if (!window.selectedProduct) {
      showToast("Erro: nenhum produto selecionado!", "danger");
      return;
    }

    json.produto = window.selectedProduct;

    // 🟢 Toast de "reserva em processo..."
    showToast("Reserva em processo...", "info");

    try {
      const res = await fetch("http://localhost:3000/api/table/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });


      if (!res.ok) throw new Error("Erro ao enviar o pedido");

      let modal = bootstrap.Modal.getInstance(reserveModal);
      if (!modal) modal = new bootstrap.Modal(reserveModal);
      modal.hide(); // fecha o modal

      form.reset();

      // 🟢 Toast de sucesso
      showToast("Reserva realizada com sucesso!", "success");

      // Salva no sessionStorage para mostrar após o reload
      sessionStorage.setItem("toastMessage", "Reserva realizada com sucesso!");
      sessionStorage.setItem("toastType", "success");

      // Recarrega a página
      location.reload();


    } catch (error) {
      console.error(error);
      showToast("Este produto já não esta disponível!", "danger");
    }

  });
}


document.addEventListener("DOMContentLoaded", () => {
  const message = sessionStorage.getItem("toastMessage");
  const type = sessionStorage.getItem("toastType");

  if (message && type) {
    showToast(message, type, 7000); 
    sessionStorage.removeItem("toastMessage");
    sessionStorage.removeItem("toastType");
  }
});