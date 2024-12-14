const notificationModal = new bootstrap.Modal($("#notificationModal"));
const message = $("#message").text().trim();

if (message) {
  notificationModal.show();
}
