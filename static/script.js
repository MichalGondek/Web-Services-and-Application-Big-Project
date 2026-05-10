const form = document.getElementById('expense-form');
const expenseIDInput = document.getElementById('expense-id');
const titleInput = document.getElementById('title');
const categoryInput = document.getElementById('category');
const expenseDateInput = document.getElementById('expense-date');
const tableBody = document.getElementById('expenses-table-body');
const formTitle = document.getElementById('form-title');
const cancelEditBtn = document.getElementById('cancel-edit');

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
        await fetch(`/api/expenses/${expenseId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expenseData)
        });
    } else {
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

async function editExpense(id) {
    const response = await fetch(`/api/expenses/${id}`);
    const expense = await response.json();

    expenseIDInput.value = expense.id;
    titleInput.value = expense.title;
    amountInput.value = expense.amount;
    categpryInput.value = expense.category;
    expenseDateInput.value = expense.expense_date;

    formTitle.textContent = 'Edit Expense';
    cancelEditBtn.ckassList.remove('hidden');

}

async function deleteExpense(id) {
    const confirmed = confirm('Are you sure you want to delete this expense?');
    if (!confirmed) return;

    await fetch(`/api/expenses/${id}`, {
        method: 'DELETE'
    });
    loadExpenses();
}

function resetForm() {
    form.reset();
    expenseIDInput.value = '';
    formTitle.textContent = 'Add Expense';
    cancelEditBtn.classList.add('hidden');
}

cancelEditBtn.addEventListener('click', resetForm);

loadExpenses();

