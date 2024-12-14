$(function () {
  const forms = $(".voucher-form");

  forms.each(function () {
    //Control input value
    const percentageBar = $(this).find("#discount");
    const percentageOutput = $(this).find("#discountValue");
    const quantityFrame = $(this).find("#quantity");
    const productFrame = $(this).find("#product");
    const extraPointFrame = $(this).find("#extraPoint");

    percentageBar.on("input", function () {
      percentageOutput.text($(this).val() + "%");
    });

    quantityFrame.on("input", function () {
      const value = $(this).val();
      if (value.length > 3) {
        $(this).val(value.slice(0, 3));
      }
    });

    extraPointFrame.on("input", function () {
      const value = $(this).val();
      if (value.length > 5) {
        $(this).val(value.slice(0, 5));
      }
    });

    //Switch radio
    const radioButton = $(this).find('input[type="radio"]');
    const valueFrame = $(this).find("#value");
    const discount = $(this).find(".discount");
    const free = $(this).find(".free");
    const extra = $(this).find(".extra");

    function radioChange() {
      discount.addClass("d-none").attr("required", false);
      free.addClass("d-none").attr("required", false);
      extra.addClass("d-none").attr("required", false);

      if (radioButton[0].checked) {
        discount.removeClass("d-none").attr("required", true);
      } else if (radioButton[1].checked) {
        free.removeClass("d-none").attr("required", true);
      } else {
        extra.removeClass("d-none").attr("required", true);
      }
    }

    radioChange();
    radioButton.change(radioChange);

    $(this).on("reset", function () {
      setTimeout(radioChange, 0);
    });

    $(this).submit(function () {
      if (radioButton[0].checked) {
        valueFrame.val("d" + percentageBar.val());
      } else if (radioButton[1].checked) {
        valueFrame.val("g" + quantityFrame.val() + "/" + productFrame.val());
      } else {
        valueFrame.val("e" + extraPointFrame.val());
      }
    });
  });
});
