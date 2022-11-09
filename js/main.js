const loader = document.querySelector(".loader-wrapper");
const timesTemplate = document.querySelector(".times-template").content;
const list = document.querySelector(".times-wrapper");
const buttons = document.querySelectorAll(".duration-btn");
const region = document.querySelector(".regions");
const tableTemplate = document.querySelector(".table-template").content;
const tableList = document.querySelector(".weekly-body");
const table = document.querySelector(".weekly-table");
const mainTitle = document.querySelector(".hero__title");

const fragment = new DocumentFragment();
const times = ["Tong", "Quyosh", "Peshin", "Asr", "Shom", "Xufton"];

let buttonVal = "day";
let selectVal = "Toshkent";
const currentMonth = new Date().getMonth() + 1;
function loadLoader() {
  loader.style.display = "flex";
  setTimeout(() => {
    loader.style.display = "none";
  }, 2000);
}
loadLoader();

async function getTimes(day = "day", region = "Toshkent") {
  mainTitle.textContent = `Namoz vaqtlari (${region.replace(
    region[0],
    region[0].toUpperCase()
  )})`;
  const response = await fetch(
    `https://islomapi.uz/api/${
      day == "monthly" ? "" : "present"
    }/${day}?region=${region}${
      day == "monthly" ? `&month=${currentMonth}` : ""
    }`
  );

  const data = await response.json();
  if (Array.isArray(data)) {
    list.style.display = "none";
    table.style.display = "flex";
    renderTable(data);
  } else {
    table.style.display = "none";
    list.style.display = "flex";
    renderTimes(data);
  }
}

getTimes(buttonVal, selectVal);

function renderTimes(data) {
  list.innerHTML = "";
  for (index in Object.entries(data.times)) {
    const template = timesTemplate.cloneNode(true);

    template.querySelector(".times-day").textContent = times[index];
    template.querySelector(".times-time").textContent = Object.entries(
      data.times
    )[index][1];

    fragment.appendChild(template);
  }
  list.appendChild(fragment);
}

buttons.forEach((item) => {
  item.addEventListener("click", function (evt) {
    buttonVal = evt.target.value;
    getTimes(buttonVal, selectVal);
  });
});

region.addEventListener("change", function (evt) {
  selectVal = evt.target.value;
  getTimes(buttonVal, selectVal);
});

function renderTable(arr) {
  tableList.innerHTML = "";

  arr.forEach((item) => {
    const template = tableTemplate.cloneNode(true);
    template.querySelector(".content-data").textContent = item.weekday;
    template.querySelector(".content-tong").textContent =
      item.times["tong_saharlik"];
    template.querySelector(".content-quyosh").textContent = item.times.quyosh;
    template.querySelector(".content-peshin").textContent = item.times.peshin;
    template.querySelector(".content-asr").textContent = item.times.asr;
    template.querySelector(".content-shom").textContent =
      item.times["shom_iftor"];
    template.querySelector(".content-xufton").textContent = item.times.hufton;

    fragment.appendChild(template);
  });
  tableList.appendChild(fragment);
}
