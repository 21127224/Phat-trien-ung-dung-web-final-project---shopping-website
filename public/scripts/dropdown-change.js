const categoryDropdown = $("#categoryDropdown");
const priceDropdown = $("#priceDropdown");
const searchForm = $("#searchForm");

categoryDropdown.change(function () {
  searchForm.submit();
});

priceDropdown.change(function () {
  searchForm.submit();
});
