const popoverTriggerList = $('[data-bs-toggle="popover"]');
[...popoverTriggerList].map(
  (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
);
