```javascript
const purchaseForm = document.getElementById("purchaseForm");

const quantityInput = document.getElementById("quantity");
const rateInput = document.getElementById("rate");

const totalAmount = document.getElementById("totalAmount");

const amountPaidInput = document.getElementById("amountPaid");

const purchaseTableBody =
  document.getElementById("purchaseTableBody");

const clearPurchases =
  document.getElementById("clearPurchases");


// Set today's date

document.getElementById("purchaseDate").value =
  new Date().toISOString().split("T")[0];


// Calculate total

function calculateTotal() {

  const quantity = Number(quantityInput.value) || 0;
  const rate = Number(rateInput.value) || 0;

  const total = quantity * rate;

  totalAmount.textContent =
    "₹" + total.toLocaleString("en-IN");
}


// Recalculate when quantity/rate changes

quantityInput.addEventListener(
  "input",
  calculateTotal
);

rateInput.addEventListener(
  "input",
  calculateTotal
);


// Save purchase

purchaseForm.addEventListener("submit", function(event) {

  event.preventDefault();


  const supplier =
    document.getElementById("supplierName").value;

  const phone =
    document.getElementById("supplierPhone").value;

  const scrap =
    document.getElementById("scrapType").value;

  const quantity =
    Number(quantityInput.value);

  const rate =
    Number(rateInput.value);

  const date =
    document.getElementById("purchaseDate").value;

  const status =
    document.getElementById("paymentStatus").value;

  const paid =
    Number(amountPaidInput.value) || 0;

  const total = quantity * rate;

  const pending = Math.max(total - paid, 0);


  const purchase = {

    id: Date.now(),

    supplier,

    phone,

    scrap,

    quantity,

    rate,

    total,

    paid,

    pending,

    status,

    date

  };


  // Get previous purchases

  const purchases =
    JSON.parse(
      localStorage.getItem("purchases")
    ) || [];


  purchases.push(purchase);


  // Save

  localStorage.setItem(
    "purchases",
    JSON.stringify(purchases)
  );


  alert("✅ Purchase saved successfully!");


  purchaseForm.reset();

  document.getElementById("purchaseDate").value =
    new Date().toISOString().split("T")[0];

  totalAmount.textContent = "₹0";

  loadPurchases();

});


// Display purchase history

function loadPurchases() {

  const purchases =
    JSON.parse(
      localStorage.getItem("purchases")
    ) || [];


  purchaseTableBody.innerHTML = "";


  purchases.forEach(purchase => {

    const row =
      document.createElement("tr");


    row.innerHTML = `

      <td>${purchase.date}</td>

      <td>${purchase.supplier}</td>

      <td>${purchase.scrap}</td>

      <td>${purchase.quantity} KG</td>

      <td>₹${purchase.rate.toLocaleString("en-IN")}</td>

      <td>₹${purchase.total.toLocaleString("en-IN")}</td>

      <td>₹${purchase.paid.toLocaleString("en-IN")}</td>

      <td>₹${purchase.pending.toLocaleString("en-IN")}</td>

    `;


    purchaseTableBody.appendChild(row);

  });

}


// Clear demo/local purchases

clearPurchases.addEventListener(
  "click",
  function() {

    if (
      confirm(
        "Are you sure you want to clear all purchases?"
      )
    ) {

      localStorage.removeItem("purchases");

      loadPurchases();

    }

  }
);


// Initial load

loadPurchases();
```
