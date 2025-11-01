
(function () {
  const registrationForm = document.getElementById('pizza-form');
  const formStatusLiveRegion = document.getElementById('form-status');
  const acceptedMessage = document.getElementById('accepted');

  const nameInput = document.getElementById('name');
  const yearOfBirthInput = document.getElementById('yob');
  const livesInUnitedStatesCheckbox = document.getElementById('in-us');
  const zipcodeFieldWrapper = document.getElementById('zipcode-wrap');
  const zipcodeInput = document.getElementById('zipcode');
  const passwordInput = document.getElementById('password');

  const errorName = document.getElementById('error-name');
  const errorYearOfBirth = document.getElementById('error-yob');
  const errorZipcode = document.getElementById('error-zipcode');
  const errorPassword = document.getElementById('error-password');
  const errorPizza = document.getElementById('error-pizza');

  const resetButton = document.getElementById('reset-btn');

  // Show/hide zipcode depending on checkbox
  function toggleZipcodeVisibility() {
    if (livesInUnitedStatesCheckbox.checked) {
      zipcodeFieldWrapper.hidden = false;
      zipcodeInput.setAttribute('required', 'required');
    } else {
      zipcodeFieldWrapper.hidden = true;
      zipcodeInput.removeAttribute('required');
      zipcodeInput.value = '';
      errorZipcode.textContent = '';
    }
  }

  livesInUnitedStatesCheckbox.addEventListener('change', toggleZipcodeVisibility);
  toggleZipcodeVisibility(); // initialize

  // Utility: trim string safely
  function trimStringSafely(value) {
    const stringified = String(value || '');
    return stringified.trim();
  }

  function validateName() {
    const valueStr = trimStringSafely(nameInput.value);

    if (!valueStr) {
      return 'Name is required.';
    }

    if (valueStr.length < 3) {
      return 'Name must be at least 3 characters.';
    }

    return '';
  }

  function validateYearOfBirth() {
    const rawValue = trimStringSafely(yearOfBirthInput.value);

    if (!rawValue) {
      return 'Year of birth is required.';
    }

    if (!/^-?\d+$/.test(rawValue)) {
      return 'Year of birth must be an integer number.';
    }

    const yearNumber = Number(rawValue);

    if (!Number.isInteger(yearNumber)) {
      return 'Year of birth must be an integer number.';
    }

    const currentYear = new Date().getFullYear();

    if (yearNumber <= 1900) {
      return 'Year of birth must be greater than 1900.';
    }

    if (yearNumber >= currentYear) {
      return 'Year of birth must be smaller than the current year.';
    }

    return '';
  }

  function validateZipcode() {
    if (!livesInUnitedStatesCheckbox.checked) {
      return '';
    }

    const zipcodeValue = trimStringSafely(zipcodeInput.value);

    if (!zipcodeValue) {
      return 'Zipcode is required for US residents.';
    }

    if (!/^\d{5}$/.test(zipcodeValue)) {
      return 'Zipcode must be exactly 5 digits.';
    }

    return '';
  }

  function validatePassword() {
    const passwordValue = trimStringSafely(passwordInput.value);

    if (!passwordValue) {
      return 'Password is required.';
    }

    if (passwordValue.length < 8) {
      return 'Password must be at least 8 characters.';
    }

    return '';
  }

  function validatePizzaPreference() {
    const selected = registrationForm.querySelector('input[name="pizza"]:checked');

    if (!selected) {
      return 'Please select a preferred type of pizza.';
    }

    return '';
  }

  function clearAllErrorsAndStatus() {
    const errorElements = [errorName, errorYearOfBirth, errorZipcode, errorPassword, errorPizza];

    for (const element of errorElements) {
      element.textContent = '';
    }

    formStatusLiveRegion.textContent = '';
    acceptedMessage.hidden = true;
  }

  registrationForm.addEventListener('submit', function (event) {
    event.preventDefault();
    clearAllErrorsAndStatus();

    const validationResults = {
      name: validateName(),
      yearOfBirth: validateYearOfBirth(),
      zipcode: validateZipcode(),
      password: validatePassword(),
      pizza: validatePizzaPreference(),
    };

    // Print errors under each field
    errorName.textContent = validationResults.name;
    errorYearOfBirth.textContent = validationResults.yearOfBirth;
    errorZipcode.textContent = validationResults.zipcode;
    errorPassword.textContent = validationResults.password;
    errorPizza.textContent = validationResults.pizza;

    // Focus first error field if any
    const firstErrorKey = Object.keys(validationResults).find(function (key) {
      return Boolean(validationResults[key]);
    });

    if (firstErrorKey) {
      formStatusLiveRegion.textContent = 'There are validation errors. Please review the form.';

      if (firstErrorKey === 'name') {
        nameInput.focus();
      } else if (firstErrorKey === 'yearOfBirth') {
        yearOfBirthInput.focus();
      } else if (firstErrorKey === 'zipcode') {
        zipcodeInput.focus();
      } else if (firstErrorKey === 'password') {
        passwordInput.focus();
      } else if (firstErrorKey === 'pizza') {
        const firstPizzaRadio = registrationForm.querySelector('input[name="pizza"]');
        if (firstPizzaRadio) {
          firstPizzaRadio.focus();
        }
      }

      return;
    }

    // If no errors
    formStatusLiveRegion.textContent = 'Form submitted successfully.';
    acceptedMessage.hidden = false;
  });

  resetButton.addEventListener('click', function () {
    // Clear messages on reset
    setTimeout(function () {
      clearAllErrorsAndStatus();
      toggleZipcodeVisibility();
    }, 0);
  });
})();
