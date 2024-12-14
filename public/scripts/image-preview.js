const imageUploadElements = $(".image-upload-control");
let imageDefaultSrc = [];
const itemForm = $("form");
const modalFade = $(".modal");

imageUploadElements.find("img").each(function () {
  imageDefaultSrc.push($(this).attr("src"));
});

function updateImagePreview(imagePickerElement, imagePreviewElement) {
  const files = imagePickerElement[0].files;

  if (!files || files.length === 0) {
    imagePreviewElement.hide();
    return;
  }

  const pickedFile = files[0];

  imagePreviewElement.attr("src", URL.createObjectURL(pickedFile)).show();
}

imageUploadElements.each(function () {
  const imagePickerElement = $(this).find("input");
  const imagePreviewElement = $(this).find("img");

  imagePickerElement.change(() => {
    updateImagePreview(imagePickerElement, imagePreviewElement);
  });
});

itemForm.on("reset", function () {
  imageUploadElements.find("img").each(function (index) {
    $(this).attr("src", imageDefaultSrc[index]);
  });
});
