const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const addBtn = document.getElementById("addBtn");
const expenseTable = document.getElementById("expenseTable");
const totalAmountEl = document.getElementById("totalAmount");
const filterCategory = document.getElementById("filterCategory");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let editIndex = null;

function renderExpenses(filter = "All") {
  expenseTable.innerHTML = "";
  let total = 0;

  expenses
    .filter(exp => filter === "All" || exp.category === filter)
    .forEach((exp, index) => {
      total += parseFloat(exp.amount);

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${exp.name}</td>
        <td>$${parseFloat(exp.amount).toFixed(2)}</td>
        <td>${exp.category}</td>
        <td>${exp.date}</td>
        <td>
          <button class="edit-btn" onclick="editExpense(${index})">Edit</button>
          <button class="delete-btn" onclick="deleteExpense(${index})">Delete</button>
        </td>
      `;
      expenseTable.appendChild(row);
    });

  totalAmountEl.textContent = total.toFixed(2);
}

function addExpense() {
  const name = nameInput.value.trim();
  const amount = parseFloat(amountInput.value.trim());
  const category = categoryInput.value;
  const date = dateInput.value;

  if (!name || isNaN(amount) || !date) {
    alert("Please fill all fields correctly!");
    return;
  }

  const expense = { name, amount, category, date };

  if (editIndex === null) {
    expenses.push(expense);
  } else {
    expenses[editIndex] = expense;
    editIndex = null;
    addBtn.textContent = "Add Expense";
    addBtn.style.backgroundColor = "#28a745";
  }

  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderExpenses(filterCategory.value);
  clearInputs();
}

function deleteExpense(index) {
  if (confirm("Are you sure you want to delete this expense?")) {
    expenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderExpenses(filterCategory.value);
  }
}

function editExpense(index) {
  const exp = expenses[index];
  nameInput.value = exp.name;
  amountInput.value = exp.amount;
  categoryInput.value = exp.category;
  dateInput.value = exp.date;
  editIndex = index;
  addBtn.textContent = "Update Expense";
  addBtn.style.backgroundColor = "#007bff";
}

function clearInputs() {
  nameInput.value = "";
  amountInput.value = "";
  categoryInput.value = "Food";
  dateInput.value = "";
}

addBtn.addEventListener("click", addExpense);
filterCategory.addEventListener("change", () => renderExpenses(filterCategory.value));
renderExpenses();
