$(function () {
  const carousels = $(".carousel");
  const firstCarousel = carousels.first();
  let isClick = false;

  carousels.find("button").mousedown(function () {
    isClick = true;
  });

  firstCarousel.on("slide.bs.carousel", function () {
    if (!isClick) {
      carousels.not(firstCarousel).each(function () {
        const otherCarousel = new bootstrap.Carousel(this);
        otherCarousel.next();
      });
    }
    isClick = false;
  });
});
