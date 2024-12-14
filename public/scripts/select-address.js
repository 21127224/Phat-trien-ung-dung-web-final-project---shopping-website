const addressDataUrl =
  "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json";
let addressData;

function fetchData() {
  return axios.get(addressDataUrl).then((response) => {
    addressData = response.data;
  });
}

function renderData(cities, districts, wards) {
  addressData.forEach((city) => {
    if (city.Name !== cities.val()) {
      cities.append(new Option(city.Name, city.Name));
    }
  });

  const selectedCity = addressData.find((city) => city.Name === cities.val());
  if (selectedCity) {
    selectedCity.Districts.forEach((district) => {
      if (district.Name !== districts.val()) {
        districts.append(new Option(district.Name, district.Name));
      }
    });
  }

  const selectedDistrict = selectedCity?.Districts.find(
    (district) => district.Name === districts.val()
  );
  if (selectedDistrict) {
    selectedDistrict.Wards.forEach((ward) => {
      if (ward.Name !== wards.val()) {
        wards.append(new Option(ward.Name, ward.Name));
      }
    });
  }
}

$(function () {
  const form = $("form");
  const cities = $("#city");
  const districts = $("#district");
  const wards = $("#ward");
  const street = $("#street");
  const address = $("#address").val();

  function initializeData() {
    const [currentStreet, currentWard, currentDistrict, currentCity] =
      address && address !== "?"
        ? address.split(", ")
        : ["", "Ward / Town", "District", "City / Province"];

    cities.empty().append(new Option(currentCity, currentCity));
    districts.empty().append(new Option(currentDistrict, currentDistrict));
    wards.empty().append(new Option(currentWard, currentWard));
    street.val(currentStreet);

    renderData(cities, districts, wards);
  }

  fetchData().then(() => {
    initializeData();

    form.on("reset", function () {
      setTimeout(initializeData, 0);
    });

    cities.change(function () {
      districts.empty().append(new Option("District", ""));
      wards.empty().append(new Option("Ward / Town", ""));
      renderData(cities, districts, wards);
    });

    districts.change(function () {
      wards.empty().append(new Option("Ward / Town", ""));
      renderData(cities, districts, wards);
    });
  });
});
