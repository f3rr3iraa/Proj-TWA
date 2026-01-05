const modals = ['/assets/components/reserveModal.html', '/assets/components/modalImg.html'];

modals.forEach(path => {
  fetch(path)
    .then(res => res.text())
    .then(html => {
      document.body.insertAdjacentHTML('beforeend', html);

      // Se for o reserveModal, inicializa os eventos
      if (path.includes('reserveModal')) {
        initReserveModal();
      }
    })
    .catch(err => console.error(`Erro ao carregar ${path}:`, err));

  
});
