
(function () {
  const form = document.getElementById('pizza-form');
  const status = document.getElementById('form-status');
  const accepted = document.getElementById('accepted');

  const nameInput = document.getElementById('name');
  const yobInput = document.getElementById('yob');
  const inUS = document.getElementById('in-us');
  const zipcodeWrap = document.getElementById('zipcode-wrap');
  const zipcodeInput = document.getElementById('zipcode');
  const passwordInput = document.getElementById('password');

  const errName = document.getElementById('error-name');
  const errYob = document.getElementById('error-yob');
  const errZip = document.getElementById('error-zipcode');
  const errPwd = document.getElementById('error-password');
  const errPizza = document.getElementById('error-pizza');

  const resetBtn = document.getElementById('reset-btn');

  // Show/hide zipcode depending on checkbox
  function toggleZipcode() {
    if (inUS.checked) {
      zipcodeWrap.hidden = false;
      zipcodeInput.setAttribute('required', 'required');
    } else {
      zipcodeWrap.hidden = true;
      zipcodeInput.removeAttribute('required');
      zipcodeInput.value = '';
      errZip.textContent = '';
    }
  }
  inUS.addEventListener('change', toggleZipcode);
  toggleZipcode(); // initialize

  // Utility: trim string safely
  function s(value) {
    return String(value || '').trim();
  }

  function validateName() {
    const v = s(nameInput.value);
    if (!v) return 'Name is required.';
    if (v.length < 3) return 'Name must be at least 3 characters.';
    return '';
  }

  function validateYob() {
    const raw = s(yobInput.value);
    if (!raw) return 'Year of birth is required.';
    if (!/^-?\d+$/.test(raw)) return 'Year of birth must be an integer number.';
    const year = Number(raw);
    // Ensure integer
    if (!Number.isInteger(year)) return 'Year of birth must be an integer number.';
    const currentYear = new Date().getFullYear();
    if (year <= 1900) return 'Year of birth must be greater than 1900.';
    if (year >= currentYear) return 'Year of birth must be smaller than the current year.';
    return '';
  }

  function validateZip() {
    if (!inUS.checked) return ''; // not applicable
    const z = s(zipcodeInput.value);
    if (!z) return 'Zipcode is required for US residents.';
    if (!/^\d{5}$/.test(z)) return 'Zipcode must be exactly 5 digits.';
    return '';
  }

  function validatePassword() {
    const v = s(passwordInput.value);
    if (!v) return 'Password is required.';
    if (v.length < 8) return 'Password must be at least 8 characters.';
    return '';
  }

  function validatePizza() {
    const selected = form.querySelector('input[name="pizza"]:checked');
    if (!selected) return 'Please select a preferred type of pizza.';
    return '';
  }

  function clearErrors() {
    [errName, errYob, errZip, errPwd, errPizza].forEach(el => el.textContent = '');
    status.textContent = '';
    accepted.hidden = true;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    const errors = {
      name: validateName(),
      yob: validateYob(),
      zip: validateZip(),
      pwd: validatePassword(),
      pizza: validatePizza(),
    };

    // Print errors under each field
    errName.textContent = errors.name;
    errYob.textContent = errors.yob;
    errZip.textContent = errors.zip;
    errPwd.textContent = errors.pwd;
    errPizza.textContent = errors.pizza;

    // Focus first error field if any
    const firstErrorKey = Object.keys(errors).find(k => errors[k]);
    if (firstErrorKey) {
      status.textContent = 'There are validation errors. Please review the form.';
      switch (firstErrorKey) {
        case 'name': nameInput.focus(); break;
        case 'yob': yobInput.focus(); break;
        case 'zip': zipcodeInput.focus(); break;
        case 'pwd': passwordInput.focus(); break;
        case 'pizza': form.querySelector('input[name="pizza"]').focus(); break;
      }
      return;
    }

    // If no errors
    status.textContent = 'Form submitted successfully.';
    accepted.hidden = false;

    // Optionally, here you could actually submit the form or reset it
    // For the assignment, we just show "Accepted".
    // form.reset(); toggleZipcode();
  });

  resetBtn.addEventListener('click', function () {
    // Clear messages on reset
    setTimeout(() => { // wait for native reset to clear inputs
      clearErrors();
      toggleZipcode();
    }, 0);
  });
})();
