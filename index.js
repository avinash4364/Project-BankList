'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Shah Rukh Khan',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-11-18T21:31:17.178Z',
    '2022-12-23T07:42:02.383Z',
    '2022-01-28T09:15:04.904Z',
    '2023-04-01T10:17:24.185Z',
    '2023-05-08T14:11:59.604Z',
    '2023-05-27T17:01:17.194Z',
    '2023-06-09T23:36:17.929Z',
    '2023-06-11T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Salman Khan',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2022-01-25T14:18:46.235Z',
    '2022-02-05T16:33:06.386Z',
    '2022-04-10T14:43:26.374Z',
    '2023-06-09T23:36:17.929Z',
    '2023-06-10T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Ram Charan',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2021-11-01T13:15:33.035Z',
    '2021-11-30T09:48:16.867Z',
    '2021-12-25T06:04:23.907Z',
    '2022-01-25T14:18:46.235Z',
    '2022-02-05T16:33:06.386Z',
    '2022-04-10T14:43:26.374Z',
    '2023-06-09T23:36:17.929Z',
    '2023-06-10T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'en-IN',
};

const account4 = {
  owner: 'Ranveer Kapoor',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2021-11-01T13:15:33.035Z',
    '2021-11-30T09:48:16.867Z',
    '2022-01-25T14:18:46.235Z',
    '2023-06-09T23:36:17.929Z',
    '2023-06-10T10:51:36.790Z',
  ],
  currency: 'RUB',
  locale: 'ru-RU',
};

const accounts = [account1, account2, account3, account4];

// Selecting all the necessary Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// * IMPLEMENT THE CURRENCY FORMAT FUNCTIONALITY
const formattedCurrency = function (acc, value) {
  return new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(value);
};

// * IMPLEMENT THE DATE FUNCTIONALITY
const formatMovementDate = function (dates, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 24 * 60));

  const daysPassed = calcDaysPassed(new Date(), dates);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const [year, month, date] = [
    //   dates.getFullYear(),
    //   `${dates.getMonth() + 1}`.padStart(2, 0),
    //   `${dates.getDate()}`.padStart(2, 0),
    // ];
    // return `${date}/${month}/${year}`;

    return new Intl.DateTimeFormat(locale).format(dates);
  }
};

// * Implementing the display of movements of money on main page in website.
// Instead of using global variable, start passing the data the function needs directly in the function
const displayMovements = function (acc, sort = false) {
  // first empty the movements container
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach((movement, i) => {
    // * WE CAN ALSO DO THIS USING TEMPLATE LITERALS (instead of creating new elements and appending them)
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const dates = new Date(acc.movementsDates[i]);

    const displayDate = formatMovementDate(dates, acc.locale);

    // * formatted currency using INTERNATIONALIZATION API
    const formattedMov = formattedCurrency(acc, movement);

    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
    </div>
`;
    // here we are inserting the html string right after the parent element begins (as we want each new element to be added before the previous one)
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Create a username for each of the accounts
const createUserNames = function (allAccounts) {
  allAccounts.forEach((account) => {
    let user = '';
    account.owner.split(' ').forEach((name) => {
      user += name.charAt(0).toLowerCase();
    });
    account.userName = user;
  });
};

createUserNames(accounts);

// Find the total balance of the movements
// *  Here we are explicitly passing 0 to the initialValue even though it is optional, because we don't want an error to be thrown if the array to be reduced is empty. As accumulator points to element at the index 0 of the array to be reduced if no initialValue is used.
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce(
    (accum, current) => accum + current,
    0
  );
  labelBalance.textContent = formattedCurrency(account, account.balance);
};

const calcDisplaySummary = function (account) {
  const movements = account.movements;
  const incomes = movements
    .filter((movement) => movement > 0)
    .reduce((accum, movement) => accum + movement, 0);
  labelSumIn.textContent = formattedCurrency(account, incomes);

  const out = movements
    .filter((movement) => movement < 0)
    .reduce((accum, movement) => accum + movement, 0);
  labelSumOut.textContent = formattedCurrency(account, Math.abs(out));

  const interest = movements
    .filter((movement) => movement > 0)
    .map((movement) => (movement * account.interestRate) / 100)
    .filter((movement) => movement > 1)
    .reduce((accum, movement) => accum + movement);
  labelSumInterest.textContent = formattedCurrency(account, interest);
};

const updateUI = (account) => {
  // DISPLAY MOVEMENTS
  displayMovements(account);

  // DISPLAY BALANCE
  calcDisplayBalance(account);

  // DISPLAY SUMMARY
  calcDisplaySummary(account);
};

//
// * IMPLEMENTING THE LOGOUT FEATURE USING TIMERS
// The user will be automatically logged out after a certain time of inactivity.

const startLogOutTimer = function () {
  // Setting the time for 10 minutes
  let time = 100;

  // Call the timer every second
  const tick = function () {
    // When 0 seconds is reached, stop timer and log out the user.
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    const min = `${Math.trunc(time / 60)}`.padStart(2, 0);
    const second = `${time % 60}`.padStart(2, 0);

    // In each function call, print the remaining time to the user interface
    labelTimer.textContent = `${min}:${second}`;

    // Decrease 1s
    time--;
  };
  tick(); // first call the tick immediately and then call it every 1 second
  const timer = setInterval(tick, 1000);

  // ! If without logging out we LOGIN to another account we can see that there are two timers which is getting displayed in the labeltimer. And if any one of the timer ends both of the user will be logged out.

  // * SOLUTION : This is happening because we don't have a separate timers for separate users. We only have one timer functionality implemented to all the users. We can check if a timer is already running then we can stop it. But first we have to return the timer and store it as a global variable to stop it during different logins.
  return timer;
};

//
// * IMPLEMENTING THE LOGIN FEATURE - VERY IMPORTANT
//

let currentAccount, timer;
btnLogin.addEventListener('click', (event) => {
  // this will stop our page from reloading whenever we click the login button(As this is the default behavior of button declared inside a form element - prevent form from submitting)
  event.preventDefault();

  // * CHECK ACCOUNT
  currentAccount = accounts.find(
    (account) => account.userName === inputLoginUsername.value
  );

  // * CHECK PASSWORD (but only check password if the account exists)
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // If the account and the password matches then display UI and a welcome message.
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100; // this will display the UI

    // * DISPLAYING CURRENT DATE AND TIME

    // * INTERNATIONALIZATION API
    // This api can be used to format dates according to different countries where the date is displayed.
    const now = new Date();
    // labelDate.textContent = new Intl.DateTimeFormat('en-US').format(now); // date formatted according to ISO standards of US.
    // the options object is used to further format the date and time.
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    // const locale = navigator.language; // this prints the browser language in which the website is running
    // console.log(locale);
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now); // date formatted according to the standards of India.

    // const [year, month, date, hour, minute] = [
    //   now.getFullYear(),
    //   `${now.getMonth() + 1}`.padStart(2, 0),
    //   `${now.getDate()}`.padStart(2, 0),
    //   `${now.getHours()}`.padStart(2, 0),
    //   `${now.getMinutes()}`.padStart(2, 0),
    // ];

    // labelDate.textContent = `${date}/${month}/${year}, ${hour}:${minute}`;

    // CLEAR THE INPUT FIELDS AND REMOVE FOCUS FROM THE INPUT FIELDS
    inputLoginUsername.value = inputLoginPin.value = '';
    // blur() is a DOM method which removes keyboard focus from the current element.
    inputLoginPin.blur();

    // START THE TIMER
    // delete the old timer if it exists and create a new timer.
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // DISPLAY THE UI
    updateUI(currentAccount);
  }
});

//
// * IMPLEMENTING MONEY TRANSFER
//

btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (account) => account.userName === inputTransferTo.value
  );

  // CLEAR THE INPUT FIELDS AFTER STORING THEIR VALUES;
  inputTransferAmount.value = inputTransferTo.value = '';

  // TRANSFER IS ONLY POSSIBLE IN THESE CASES :
  // 1. if the account which will recieve money exists
  // 2. if the transfer amount is greater than 0
  // 3. if we have enough balance to transfer
  // 4. we shouldn't be able to transfer money to ourselves

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.userName !== currentAccount.userName
  ) {
    // * FINALLY UPDATE THE UI

    // DOING THE TRANSFER
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // ADD TRANSFER DATE AND TIME TO BOTH SENDER AND RECIEVER
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // UPDATE THE UI
    updateUI(currentAccount);

    // RESET TIMER
    // (as this is an user activity)
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

//
// * LOAN FEATURE (loan is only granted if there is one deposit with at least 10% of the requested loan amount in the current account)
//

btnLoan.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = Math.floor(Number(inputLoanAmount.value));

  if (
    amount > 0 &&
    currentAccount.movements.some((movement) => movement >= amount * 0.1)
  ) {
    // ADD THE CURRENT DEPOSIT TO CURRENT ACCOUNT AND UPDATE THE UI AFTER 2 SECONDS
    setTimeout(() => {
      currentAccount.movements.push(amount);

      // ADD THE DATE
      currentAccount.movementsDates.push(new Date().toISOString());

      updateUI(currentAccount);

      // RESET TIMER
      // (as this is an user activity)
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2000);
  }

  // CLEAR THE INPUT FIELDS
  inputLoanAmount.value = '';
});

//
// * SORTING MONEY IN THE ACCOUNT (only on the first click)
//

let sorted = false;
btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  // change the sorted variable so that we are not able to sort again (the money goes back to its original position)
  sorted = !sorted;
});

//
// * CLOSING ACCOUNT
//

btnClose.addEventListener('click', (e) => {
  e.preventDefault();
  const username = inputCloseUsername.value;
  const password = Number(inputClosePin.value);

  // EMPTY THE INPUT FIELDS
  inputCloseUsername.value = inputClosePin.value = '';

  // IF THE PASSWORD AND THE ACCOUNT MATCHES THEN CLOSE THE ACCOUNT(DELETE THE ACCOUNT FROM ORIGINAL ACCOUNTS ARRAY)
  if (username === currentAccount.userName && password === currentAccount.pin) {
    const accountIndex = accounts.findIndex(
      (account) => account.userName === currentAccount.userName
    );
    accounts.splice(accountIndex, 1);

    // LOG OUT THE USER - HIDE THE UI
    containerApp.style.opacity = 0;
  }
});
