const $ = document;
const phoneError = $.getElementById("phone-error");
const phoneAlert = $.getElementById("form-alert");
const loginButton = $.getElementById("login-btn");
const loginForm = $.getElementById("login-form");
const phoneInput = $.getElementById("phone-input");
const phoneContainer = $.getElementById("phone-container");
const otpContainer = $.getElementById("otp-container");
const otpInputs = $.querySelectorAll(".otp-input-box");
const submitButton = $.getElementById("submit-btn");

// Function to convert Persian digits to English digits
function convertPersianToEnglish(input) {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  let output = input;
  for (let i = 0; i < persianDigits.length; i++) {
    const regex = new RegExp(persianDigits[i], "g");
    output = output.replace(regex, englishDigits[i]);
  }

  return output;
}

// Convert Persian digits to English digits
phoneInput.addEventListener("input", () => {
  phoneInput.value = convertPersianToEnglish(phoneInput.value);
});

otpInputs.forEach((input) => {
  input.addEventListener("input", () => {
    input.value = convertPersianToEnglish(input.value);
  });
});

// submit login form
loginForm.addEventListener("submit", () => {
  alert('d')
  const phoneRegex =
    /^(0|98)?([ ]|-|[()]){0,2}9[0-4|9]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}$/;

  const isValidPhone = phoneRegex.test(phoneInput.value);

  phoneError.classList.toggle("hidden", isValidPhone);
  phoneError.classList.toggle("block", !isValidPhone);

  if (!phoneInput.value.length) {
    phoneError.textContent = "افزودن شماره موبایل ضروری است.";
  } else if (!isValidPhone) {
    phoneError.textContent = "لطفا یک شماره موبایل معتبر وارد کنید.";
  } else {
    fetch("http://localhost:4000/otp/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: phoneInput.value,
      }),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            Toastify({
              text: `کد تائید: ${data.verifyCode}`,
              duration: 3000,
              close: true,
              gravity: "top",
              position: "right",
              backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
            }).showToast();

            phoneAlert.textContent = `کد تایید برای شماره ${phoneInput.value} پیامک شد`;
            loginButton.classList.add("hidden");
            submitButton.classList.remove("hidden");

            // Hide phone input with animation
            phoneContainer.classList.add(
              "translate-y-8",
              "opacity-0",
              "pointer-events-none",
              "absolute"
            );

            // Show OTP input with animation
            otpContainer.classList.remove(
              "translate-y-8",
              "opacity-0",
              "pointer-events-none",
              "absolute"
            );

            otpContainer.firstElementChild.focus();
          });
        } else {
          return response.json().then((errorData) => {
            throw new Error(errorData.message || "An error occurred");
          });
        }
      })
      // when we encounter error in sending phone number to API
      .catch((error) => {
        console.log(error);
        phoneError.classList.remove("hidden");
        phoneError.textContent = error;
      });
  }
});

otpInputs.forEach((input, index) => {
  input.addEventListener("input", (e) => {
    const currentInput = e.target;

    checkInputs();

    if (isNaN(currentInput.value)) {
      currentInput.value = currentInput.value.slice(0, -1);
    } else if (currentInput.value && currentInput.nextElementSibling) {
      currentInput.nextElementSibling.focus();
    }
  });

  input.addEventListener("keydown", (e) => {
    const currentInput = e.target;

    if (e.key === "Backspace" && !currentInput.value) {
      if (currentInput.previousElementSibling) {
        currentInput.previousElementSibling.focus();
        currentInput.previousElementSibling.value = "";
      }
    }

    if (
      e.key !== "Backspace" &&
      currentInput.previousElementSibling &&
      currentInput.previousElementSibling.value === ""
    ) {
      e.preventDefault();
      currentInput.previousElementSibling.focus();
    }
  });

  input.addEventListener("focus", (e) => {
    const currentInput = e.target;

    // Select the input value when focused
    currentInput.select();

    if (
      currentInput.previousElementSibling &&
      currentInput.previousElementSibling.value === ""
    ) {
      currentInput.previousElementSibling.focus();
    }
  });

  input.addEventListener("paste", (event) => {
    const paste = event.clipboardData.getData("text");
    const digits = paste.split("").filter((char) => !isNaN(char));

    if (digits.length === otpInputs.length) {
      otpInputs.forEach((input, i) => {
        input.value = digits[i];
      });

      otpInputs.forEach((input) => input.blur());
      checkInputs();
    }

    event.preventDefault();
  });
});

checkInputs();

function checkInputs() {
  // Check if all inputs are filled
  const allFilled = Array.from(otpInputs).every((input) => input.value !== "");
  // Enable or disable the submit button
  submitButton.disabled = !allFilled;
}

// Submit button event listener
submitButton.addEventListener("click", () => {
  if (!submitButton.disabled) {
    const otpValue = Array.from(otpInputs)
      .map((input) => input.value)
      .join("");

    fetch("http://localhost:4000/otp/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: phoneInput.value,
        verifyCode: otpValue,
      }),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            Toastify({
              text: data.message,
              duration: 3000,
              close: true,
              gravity: "top",
              position: "right",
              backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
            }).showToast();
          });
        } else {
          return response.json().then((errorData) => {
            throw new Error(errorData.message || "An error occurred");
          });
        }
      })
      .catch((error) => {
        Toastify({
          text: error,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          backgroundColor: "linear-gradient(to right, #FF5F6D, #FFC371)",
        }).showToast();
      });
  }
});


