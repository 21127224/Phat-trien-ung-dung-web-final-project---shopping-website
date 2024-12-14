$(function () {
  const genderDropdown = $("#gender");
  const genders = [
    "Male",
    "Female",
    "Lesbian",
    "Gay",
    "Bisexual",
    "Transgender",
    "Asexual",
    "Pansexual",
    "Gender Fluid",
    "Questioning",
  ];

  genders.forEach((gender) => {
    if (gender !== genderDropdown.val()) {
      genderDropdown.append(new Option(gender, gender));
    }
  });
});
