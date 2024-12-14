$(".discount").on("change", function () {
  if (this.checked) {
    $(".discount").not(this).prop("checked", false);
  }
});

$(".product").on("change", function () {
  if (this.checked) {
    $(".product").not(this).prop("checked", false);
  }
});

$(".point").on("change", function () {
  if (this.checked) {
    $(".point").not(this).prop("checked", false);
  }
});
