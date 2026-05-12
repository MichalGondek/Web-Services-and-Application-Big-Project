// Get elements from the HTML page
const form = document.getElementById('expense-form');
const expenseIDInput = document.getElementById('expense-id');
const titleInput = document.getElementById('title');
const categoryInput = document.getElementById('category');
const expenseDateInput = document.getElementById('expense_date');
const tableBody = document.getElementById('expense-table-body');
const formTitle = document.getElementById('form-title');
const cancelEditBtn = document.getElementById('cancel-edit');

// Load all expenses from the Flask API
async function loadExpenses() {
    const response = await fetch('/api/expenses');
    const expenses = await response.json();
    tableBody.innerHTML = '';
    expenses.forEach(expense => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${expense.title}</td>
            <td>${Number(expense.amount).toFixed(2)}</td>
            <td>${expense.category}</td>
            <td>${expense.expense_date}</td>
            <td>
                <button class="edit-btn" data-id="${expense.id}">Edit</button>
                <button class="delete-btn" data-id="${expense.id}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Handle add/edit form submission
form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const expenseData = {
        title: titleInput.value,
        amount: parseFloat(document.getElementById('amount').value),
        category: categoryInput.value,
        expense_date: expenseDateInput.value
    };

    const expenseId = expenseIDInput.value;

    if (expenseId) {
        // Put request updates an existing expense
        await fetch(`/api/expenses/${expenseId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expenseData)
        });
    } else {
        // POST request creates a new expense
        await fetch('/api/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expenseData)
        });
    }

    resetForm();
    loadExpenses();
});

// Load an expense into the form for editing
async function editExpense(id) {
    const response = await fetch(`/api/expenses/${id}`);
    const expense = await response.json();

    expenseIDInput.value = expense.id;
    titleInput.value = expense.title;
    amountInput.value = expense.amount;
    categoryInput.value = expense.category;
    expenseDateInput.value = expense.expense_date;

    formTitle.textContent = 'Edit Expense';
    cancelEditBtn.classList.remove('hidden');

}

// Delete an expense
async function deleteExpense(id) {
    const confirmed = confirm('Are you sure you want to delete this expense?');
    if (!confirmed) return;

    await fetch(`/api/expenses/${id}`, {
        method: 'DELETE'
    });
    loadExpenses();
}

// Reset the form back to add mode
function resetForm() {
    form.reset();
    expenseIDInput.value = '';
    formTitle.textContent = 'Add Expense';
    cancelEditBtn.classList.add('hidden');
}

// Cancel edit mode
cancelEditBtn.addEventListener('click', resetForm);

// Load expenses when page first opens
loadExpenses();

