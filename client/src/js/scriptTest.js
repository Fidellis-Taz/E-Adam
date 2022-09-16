let tbody = document.querySelector("tbody");
let addBtn = document.querySelector(".add");
let form = document.querySelector(".form-wrapper");
let saveBtn = document.querySelector(".save");
let cancelBtn = document.querySelector(".cancel");
let categoriesEl = document.querySelector("#categories");
let brandEl = document.querySelector("#brand");
let seriesEl = document.querySelector("#series");
let yearEl = document.querySelector("#year");
let colorEl = document.querySelector("#color");
let kmEl = document.querySelector("#km");
let engineCapacityEl = document.querySelector("#engineCapacity");
let plateEl = document.querySelector("#plate");

let httpm = null;

let url = "http://localhost:8001/getCars";

let cars = [];

let id = null;

let data = {};

addBtn.onclick = function () {
  httpm = "POST";
  clearForm();
  form.classList.add("active");
};

cancelBtn.onclick = function () {
  form.classList.remove("active");
};

const sendHttpRequest = (method, url, data) => {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);

    xhr.responseType = "json";

    //add headers
    if (data) {
      xhr.setRequestHeader("Content-Type", "application/json");
    }
    xhr.onload = () => {
      if (xhr.status >= 400) {
        reject(xhr.response);
      } else {
        resolve(xhr.response);
      }
    };

    xhr.onerror = () => {
      reject("Something went wrong");
    };
    xhr.send(JSON.stringify(data));
  });
  return promise;
};

saveBtn.onclick = function () {
  data.categories = categoriesEl.value;
  data.brand = brandEl.value;
  data.series = seriesEl.value;
  data.year = yearEl.value;
  data.color = colorEl.value;
  data.km = kmEl.value;
  data.engineCapacity = engineCapacityEl.value;
  data.plate = plateEl.value;
  if (httpm == "PUT") {
    data.id = id;
  }

  /* 
  fetch("http://localhost:8001/saveCar", {
    method: httpm,
    body: JSON.stringify(data),
     method: "GET",
    headers: {
      "access-control-allow-origin" : "*",
      "Content-type": "application/json; charset=UTF-8"
    }}),
  }).then(() => {
    clearForm();
    form.classList.remove("active");
    getMobiles();
  }); */
};

function clearForm() {
  categoriesEl.value = null;
  brandEl.value = null;
  seriesEl.value = null;
  yearEl.value = null;
  colorEl.value = null;
  kmEl.value = null;
  engineCapacityEl.value = null;
  plateEl.value = null;
}

function getMobiles() {
  sendHttpRequest("GET", "http://localhost:8001/getCars").then(
    (responseData) => {
      console.log(responseData);
      cars = responseData;
      updateTable(cars);
    }
  );
}

getMobiles();

function updateTable(cars) {
  let data = "";

  if (cars.length > 0) {
    for (i = 0; i < cars.length; i++) {
      data += `<tr id="${cars[i]["plate"]}">
                        <td>${cars[i]["categories"]}</td>
                        <td id="filterB">${cars[i]["brand"]}</td>
                        <td>${cars[i]["series"]}</td>
                        <td>${cars[i]["year"]}</td>
                        <td>${cars[i]["color"]}</td>
                        <td>${cars[i]["km"]}</td>
                        <td>${cars[i]["engineCapacity"]}</td>
                        <td id="filterB">${cars[i]["plate"]}</td>
                         <td><button class="btn btn-danger" onclick="deleteMobile(event)">Sell Car</button></td>   
                     </tr>`;
    }

    tbody.innerHTML = data;
  }
}

/* function editMobile(e) {
  form.classList.add("active");
  httpm = "PUT";
  id = e.target.parentElement.parentElement.id;
  let selectedMobile = mobiles.filter((m) => {
    return m["id"] == id;
  })[0];
  categoriesEl.value = selectedMobile.categories;
  brandEl.value = selectedMobile.brand;
  seriesEl.value = selectedMobile.series;
  yearEl.value = selectedMobile.year;
  colorEl.value = selectedMobile.color;
  kmEl.value = selectedMobile.km;
  engineCapacityEl.value = selectedMobile.engineCapacity;
  plateEl.value = selectedMobile.plate;
} */
/* categoriesEl.value = 
  brandEl.value = 
  seriesEl.value = 
  yearEl.value = 
  colorEl.value = 
  kmEl.value = 
  engineCapacityEl.value = 
  plateEl.value =  */
function deleteMobile(e) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    plate: "07 EA 678",
  });

  var requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:8001/sellCar", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));

  /*  const plate1 = e.target.parentElement.parentElement.id;

  sendHttpRequest("DELETE", "http://localhost:8001/sellCar", {
    plate: plate1,
  })
    .then((responseData) => {
      console.log(responseData);
    })
    .catch((err) => {
      console.log(err);
    }); */
}
//filters
function myFunction() {}

const searchInput = document.getElementById("myInput");
const searchSelect = document.getElementById("category");
const rows = document.querySelectorAll("tbody tr");
searchInput.addEventListener("keyup", (e) => {
  console.log(e.target.value);
  if (e.target.value) {
    const newCars = cars.filter(function (el) {
      const searchValue = e.target.value.toLowerCase();
      return (
        el.brand.toLowerCase().startsWith(searchValue) ||
        el.plate.toLowerCase().startsWith(searchValue)
      );
    });
    console.log(newCars);

    updateTable(newCars);
  }
});
searchSelect.addEventListener("change", (e) => {
  console.log(e.target.value);
  if (e.target.value.toLowerCase() == "all") {
    updateTable(cars);
  } else if (e.target.value) {
    const newCars = cars.filter(function (el) {
      const searchValue = e.target.value.toLowerCase();
      return el.categories.toLowerCase().startsWith(searchValue);
    });
    if (newCars.length > 0) {
      console.log(newCars);

      updateTable(newCars);
    } else {
      console.log("no data");
      tbody.innerHTML = "<div>Data Cars found <div/>";
    }
  }
});
