const stockTableBody =
  document.getElementById("stockTableBody");

const totalStockElement =
  document.getElementById("totalStock");

const stockValueElement =
  document.getElementById("stockValue");

const totalPurchasedElement =
  document.getElementById("totalPurchased");

const totalSoldElement =
  document.getElementById("totalSold");

const movementContainer =
  document.getElementById("movementContainer");

const refreshStock =
  document.getElementById("refreshStock");


// Scrap types

const scrapTypes = [
  "Iron",
  "Copper",
  "Aluminium",
  "Plastic",
  "Steel",
  "Other"
];


// Load purchases

function getPurchases() {

  return JSON.parse(
    localStorage.getItem("purchases")
  ) || [];

}


// Load sales

function getSales() {

  return JSON.parse(
    localStorage.getItem("sales")
  ) || [];

}


// Calculate stock

function calculateStock() {

  const purchases = getPurchases();
  const sales = getSales();

  const stockData = {};

  scrapTypes.forEach(type => {

    stockData[type] = {
      purchased: 0,
      sold: 0,
      purchaseValue: 0
    };

  });


  // PURCHASES

  purchases.forEach(purchase => {

    if (!stockData[purchase.scrap]) {

      stockData[purchase.scrap] = {
        purchased: 0,
        sold: 0,
        purchaseValue: 0
      };

    }


    stockData[purchase.scrap].purchased +=
      Number(purchase.quantity) || 0;


    stockData[purchase.scrap].purchaseValue +=
      Number(purchase.total) || 0;

  });


  // SALES

  sales.forEach(sale => {

    if (!stockData[sale.scrap]) {

      stockData[sale.scrap] = {
        purchased: 0,
        sold: 0,
        purchaseValue: 0
      };

    }


    stockData[sale.scrap].sold +=
      Number(sale.quantity) || 0;

  });


  return stockData;

}


// Display stock

function loadStock() {

  const stockData = calculateStock();


  stockTableBody.innerHTML = "";


  let totalPurchased = 0;
  let totalSold = 0;
  let totalCurrentStock = 0;
  let totalStockValue = 0;


  Object.keys(stockData).forEach(type => {

    const data = stockData[type];


    const currentStock =
      data.purchased - data.sold;


    const averageRate =
      data.purchased > 0
        ? data.purchaseValue / data.purchased
        : 0;


    const currentValue =
      Math.max(currentStock, 0) * averageRate;


    totalPurchased += data.purchased;

    totalSold += data.sold;

    totalCurrentStock += currentStock;

    totalStockValue += currentValue;


    let status = "";

    if (currentStock <= 0) {

      status =
        `<span class="stock-empty">
          Out of Stock
        </span>`;

    } else if (currentStock < 100) {

      status =
        `<span class="stock-low">
          Low Stock
        </span>`;

    } else {

      status =
        `<span class="stock-positive">
          In Stock
        </span>`;

    }


    const row =
      document.createElement("tr");


    row.innerHTML = `

      <td><strong>${type}</strong></td>

      <td>
        ${data.purchased.toLocaleString("en-IN")} KG
      </td>

      <td>
        ${data.sold.toLocaleString("en-IN")} KG
      </td>

      <td>
        <strong>
          ${currentStock.toLocaleString("en-IN")} KG
        </strong>
      </td>

      <td>
        ₹${averageRate.toLocaleString("en-IN", {
          maximumFractionDigits: 2
        })}
      </td>

      <td>
        ₹${currentValue.toLocaleString("en-IN", {
          maximumFractionDigits: 2
        })}
      </td>

      <td>${status}</td>

    `;


    stockTableBody.appendChild(row);

  });


  totalStockElement.textContent =
    totalCurrentStock.toLocaleString("en-IN") + " KG";


  totalPurchasedElement.textContent =
    totalPurchased.toLocaleString("en-IN") + " KG";


  totalSoldElement.textContent =
    totalSold.toLocaleString("en-IN") + " KG";


  stockValueElement.textContent =
    "₹" +
    totalStockValue.toLocaleString("en-IN", {
      maximumFractionDigits: 2
    });


  loadMovement();

}


// Stock movement

function loadMovement() {

  const purchases = getPurchases();
  const sales = getSales();


  const movements = [];


  purchases.forEach(item => {

    movements.push({

      date: item.date,

      type: "Purchase",

      scrap: item.scrap,

      quantity: item.quantity,

      party: item.supplier

    });

  });


  sales.forEach(item => {

    movements.push({

      date: item.date,

      type: "Sale",

      scrap: item.scrap,

      quantity: item.quantity,

      party: item.customer

    });

  });


  movements.sort(
    (a, b) =>
      new Date(b.date) -
      new Date(a.date)
  );


  movementContainer.innerHTML = "";


  if (movements.length === 0) {

    movementContainer.innerHTML =
      "<p>No stock movement available yet.</p>";

    return;

  }


  movements.slice(0, 10).forEach(item => {

    const div =
      document.createElement("div");


    const icon =
      item.type === "Purchase"
        ? "📥"
        : "📤";


    const sign =
      item.type === "Purchase"
        ? "+"
        : "-";


    div.className =
      "movement-item";


    div.innerHTML = `

      <div>

        <strong>
          ${icon} ${item.type} - ${item.scrap}
        </strong>

        <small>
          ${item.party} • ${item.date}
        </small>

      </div>

      <strong>
        ${sign}${item.quantity} KG
      </strong>

    `;


    movementContainer.appendChild(div);

  });

}


// Refresh

refreshStock.addEventListener(
  "click",
  loadStock
);


// Initial load

loadStock();