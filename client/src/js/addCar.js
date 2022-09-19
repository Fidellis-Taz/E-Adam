class FormValidator {
  constructor(form, fields) {
    this.form = form;
    this.fields = fields;
  }

  initialize() {
    this.validateOnEntry();
    this.validateOnSubmit();
  }

  validateOnSubmit() {
    let self = this;

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      let data = {};

      self.fields.forEach((field) => {
        let input = document.querySelector(`#${field}`);
        self.validateFields(input);

        const fieldValue = input.value.toUpperCase();

        data[field] = fieldValue;
      });
      //send data
      //console.log("dtaaa to be sent ", data);
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "http://localhost:8001/saveCar", true);
      xhr.setRequestHeader("Content-type", "application/json");

      xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          if (xhr.responseText == JSON.stringify({ status: "success" })) {
            window.location = "/client/index.html";
          } else {
            alert("Error Occured");
          }
        }
      };
      xhr.send(JSON.stringify(data));
    });
  }

  validateOnEntry() {
    let self = this;
    this.fields.forEach((field) => {
      const input = document.querySelector(`#${field}`);

      input.addEventListener("input", (event) => {
        self.validateFields(input);
      });
    });
  }

  validateFields(field) {
    // Check presence of values
    if (field.value.trim() === "") {
      this.setStatus(
        field,
        `${field.previousElementSibling.innerText} cannot be blank`,
        "error"
      );
    } else {
      this.setStatus(field, null, "success");
    }

    // check for a valid year
    if (field.name === "year") {
      if (isNaN(field.value)) {
        this.setStatus(field, "Year should be a number", "error");
      } else if (field.value.length < field.maxLength) {
        this.setStatus(field, "Please enter valid year", "error");
      } else {
        field.value = field.value.slice(0, field.maxLength);
      }
    }
    // check for a engine Capacity
    if (field.name === "engineCapacity") {
      if (isNaN(field.value)) {
        this.setStatus(field, "Year should be a number", "error");
      }
    }

    // check for a valid km
    if (field.name === "km") {
      if (isNaN(field.value)) {
        this.setStatus(field, "KM should be a number", "error");
      }
    }

    //check for plate
    if (field.name === "plate") {
      const re = /^07 EA \d{3}/;
      if (re.test(field.value)) {
        this.setStatus(field, null, "success");
      } else {
        this.setStatus(
          field,
          "Please enter valid Plate for example 07 EA 233",
          "error"
        );
      }
    }
  }

  setStatus(field, message, status) {
    const successIcon = field.parentElement.querySelector(".icon-success");
    const errorIcon = field.parentElement.querySelector(".icon-error");
    const errorMessage = field.parentElement.querySelector(".error-message");

    if (status === "success") {
      if (errorIcon) {
        errorIcon.classList.add("hidden");
      }
      if (errorMessage) {
        errorMessage.innerText = "";
      }
      successIcon.classList.remove("hidden");
      field.classList.remove("input-error");
    }

    if (status === "error") {
      if (successIcon) {
        successIcon.classList.add("hidden");
      }
      field.parentElement.querySelector(".error-message").innerText = message;
      errorIcon.classList.remove("hidden");
      field.classList.add("input-error");
    }
  }
}

const form = document.querySelector(".form");
const fields = [
  "categories",
  "brand",
  "series",
  "year",
  "color",
  "km",
  "engineCapacity",
  "plate",
];

const validator = new FormValidator(form, fields);
validator.initialize();
