const expenseForm =
  document.getElementById("expenseForm");

const expenseTableBody =
  document.getElementById("expenseTableBody");

const clearExpenses =
  document.getElementById("clearExpenses");

const totalExpenses =
  document.getElementById("totalExpenses");

const transportTotal =
  document.getElementById("transportTotal");

const labourTotal =
  document.getElementById("labourTotal");

const otherTotal =
  document.getElementById("otherTotal");


// Today's date

document.getElementById("expenseDate").value =
  new Date().toISOString().split("T")[0];


// Load expenses

function getExpenses() {

  return JSON.parse(
    localStorage.getItem("expenses")
  ) || [];

}


// Save expense

expenseForm.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();


    const category =
      document.getElementById("category").value;

    const amount =
      Number(
        document.getElementById("amount").value
      );

    const paidTo =
      document.getElementById("paidTo").value;

    const paymentMethod =
      document.getElementById("paymentMethod").value;

    const date =
      document.getElementById("expenseDate").value;

    const description =
      document.getElementById("description").value;


    const expense = {

      id: Date.now(),

      category,

      amount,

      paidTo,

      paymentMethod,

      date,

      description

    };


    const expenses = getExpenses();

    expenses.push(expense);


    localStorage.setItem(
      "expenses",
      JSON.stringify(expenses)
    );


    alert("✅ Expense saved successfully!");


    expenseForm.reset();


    document.getElementById("expenseDate").value =
      new Date().toISOString().split("T")[0];


    loadExpenses();

  }
);


// Display expenses

function loadExpenses() {

  const expenses = getExpenses();


  expenseTableBody.innerHTML = "";


  let total = 0;
  let transport = 0;
  let labour = 0;
  let other = 0;


  expenses.forEach(expense => {

    total += Number(expense.amount) || 0;


    if (expense.category === "Transport") {

      transport += Number(expense.amount) || 0;

    }


    if (expense.category === "Labour") {

      labour += Number(expense.amount) || 0;

    }


    if (
      expense.category !== "Transport" &&
      expense.category !== "Labour"
    ) {

      other += Number(expense.amount) || 0;

    }


    const row =
      document.createElement("tr");


    row.innerHTML = `

      <td>${expense.date}</td>

      <td>${expense.category}</td>

      <td>${expense.description || "-"}</td>

      <td>${expense.paidTo || "-"}</td>

      <td>${expense.paymentMethod}</td>

      <td>
        ₹${Number(expense.amount).toLocaleString("en-IN")}
      </td>

    `;


    expenseTableBody.appendChild(row);

  });


  totalExpenses.textContent =
    "₹" + total.toLocaleString("en-IN");


  transportTotal.textContent =
    "₹" + transport.toLocaleString("en-IN");


  labourTotal.textContent =
    "₹" + labour.toLocaleString("en-IN");


  otherTotal.textContent =
    "₹" + other.toLocaleString("en-IN");

}


// Clear expenses

clearExpenses.addEventListener(
  "click",
  function() {

    if (
      confirm(
        "Are you sure you want to clear all expenses?"
      )
    ) {

      localStorage.removeItem("expenses");

      loadExpenses();

    }

  }
);


// Initial load

loadExpenses();