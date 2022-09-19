let tbody = document.querySelector("tbody");

const searchInput = document.getElementById("myInput");
const searchCategories = document.getElementById("category");

let url = "http://localhost:8001";

let cars = [];

let id = null;

let data = {};

//requests
const sendHttpRequest = (method, url, data) => {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);

    xhr.responseType = "json";

    //add headers
    if (data) {
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Accept", "application/json");
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

/* function clearForm() {
  categoriesEl.value = null;
  brandEl.value = null;
  seriesEl.value = null;
  yearEl.value = null;
  colorEl.value = null;
  kmEl.value = null;
  engineCapacityEl.value = null;
  plateEl.value = null;
}
 */

//GET Cars
function getCars() {
  sendHttpRequest("GET", `${url}/getCars`).then((responseData) => {
    console.log(responseData);
    cars = responseData;
    updateTable(cars);
  });
}

getCars();

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
                         <td><button class="btn btn-danger" onclick="deleteCar(event)">Sell Car</button></td>   
                     </tr>`;
    }

    tbody.innerHTML = data;
  }
}

//delete Car
async function deleteCar(e) {
  const plate1 = e.target.parentElement.parentElement.id;

  if (confirm("Do you really want to sell the car") == true) {
    sendHttpRequest("DELETE", `${url}/sellCar`, {
      plate: plate1,
    })
      .then((responseData) => {
        console.log(responseData);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
//CAR FILTERS

//search By brand or Plate
searchInput.addEventListener("keyup", (e) => {
  // console.log(e.target.value);
  if (e.target.value) {
    const newCars = cars.filter(function (el) {
      const searchValue = e.target.value.toLowerCase();
      return (
        el.brand.toLowerCase().startsWith(searchValue) ||
        el.plate.toLowerCase().startsWith(searchValue)
      );
    });
    //console.log(newCars);

    updateTable(newCars);
  } else {
    updateTable(cars);
  }
});

//search Categories
searchCategories.addEventListener("change", (e) => {
  //console.log(e.target.value);
  if (e.target.value.toLowerCase() == "all") {
    updateTable(cars);
  } else if (e.target.value) {
    const newCars = cars.filter(function (el) {
      const searchValue = e.target.value.toLowerCase();
      return el.categories.toLowerCase().startsWith(searchValue);
    });
    if (newCars.length > 0) {
      //console.log(newCars);

      updateTable(newCars);
    } else {
      //console.log("no data");
      tbody.innerHTML = `<div class="no-cars-found">No Cars found<div/>`;
    }
  }
});

// SOCIAL PANEL JS
const floating_btn = document.querySelector(".floating-btn");
const close_btn = document.querySelector(".close-btn");
const social_panel_container = document.querySelector(
  ".social-panel-container"
);

floating_btn.addEventListener("click", () => {
  social_panel_container.classList.toggle("visible");
});

close_btn.addEventListener("click", () => {
  social_panel_container.classList.remove("visible");
});
