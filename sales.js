const salesForm = document.getElementById("salesForm");

const quantityInput = document.getElementById("quantity");
const rateInput = document.getElementById("rate");

const totalAmount = document.getElementById("totalAmount");

const amountReceivedInput =
  document.getElementById("amountReceived");

const salesTableBody =
  document.getElementById("salesTableBody");

const clearSales =
  document.getElementById("clearSales");


// Today's date

document.getElementById("saleDate").value =
  new Date().toISOString().split("T")[0];


// Calculate total

function calculateTotal() {

  const quantity =
    Number(quantityInput.value) || 0;

  const rate =
    Number(rateInput.value) || 0;

  const total = quantity * rate;

  totalAmount.textContent =
    "₹" + total.toLocaleString("en-IN");
}


// Quantity change

quantityInput.addEventListener(
  "input",
  calculateTotal
);


// Rate change

rateInput.addEventListener(
  "input",
  calculateTotal
);


// Save Sale

salesForm.addEventListener("submit", function(event) {

  event.preventDefault();


  const customer =
    document.getElementById("customerName").value;

  const phone =
    document.getElementById("customerPhone").value;

  const scrap =
    document.getElementById("scrapType").value;

  const quantity =
    Number(quantityInput.value);

  const rate =
    Number(rateInput.value);

  const date =
    document.getElementById("saleDate").value;

  const status =
    document.getElementById("paymentStatus").value;

  const received =
    Number(amountReceivedInput.value) || 0;


  const total = quantity * rate;

  const pending =
    Math.max(total - received, 0);


  const sale = {

    id: Date.now(),

    customer,

    phone,

    scrap,

    quantity,

    rate,

    total,

    received,

    pending,

    status,

    date

  };


  // Existing sales

  const sales =
    JSON.parse(
      localStorage.getItem("sales")
    ) || [];


  sales.push(sale);


  // Save sales

  localStorage.setItem(
    "sales",
    JSON.stringify(sales)
  );


  alert("✅ Sale saved successfully!");


  salesForm.reset();


  document.getElementById("saleDate").value =
    new Date().toISOString().split("T")[0];


  totalAmount.textContent = "₹0";


  loadSales();

});


// Load Sales History

function loadSales() {

  const sales =
    JSON.parse(
      localStorage.getItem("sales")
    ) || [];


  salesTableBody.innerHTML = "";


  sales.forEach(sale => {

    const row =
      document.createElement("tr");


    row.innerHTML = `

      <td>${sale.date}</td>

      <td>${sale.customer}</td>

      <td>${sale.scrap}</td>

      <td>${sale.quantity} KG</td>

      <td>
        ₹${sale.rate.toLocaleString("en-IN")}
      </td>

      <td>
        ₹${sale.total.toLocaleString("en-IN")}
      </td>

      <td>
        ₹${sale.received.toLocaleString("en-IN")}
      </td>

      <td>
        ₹${sale.pending.toLocaleString("en-IN")}
      </td>

    `;


    salesTableBody.appendChild(row);

  });

}


// Clear Sales

clearSales.addEventListener(
  "click",
  function() {

    if (
      confirm(
        "Are you sure you want to clear all sales?"
      )
    ) {

      localStorage.removeItem("sales");

      loadSales();

    }

  }
);


// Initial load

loadSales();