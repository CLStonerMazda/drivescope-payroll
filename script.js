// Helper functions for LocalStorage
function getDealerships() {
  return JSON.parse(localStorage.getItem('dealerships') || '[]');
}
function getFixedExpenses() {
  return JSON.parse(localStorage.getItem('fixedExpenses') || '[]');
}
function getOneTimeExpenses() {
  return JSON.parse(localStorage.getItem('oneTimeExpenses') || '[]');
}
function saveDealerships(list) {
  localStorage.setItem('dealerships', JSON.stringify(list));
}
function saveFixedExpenses(list) {
  localStorage.setItem('fixedExpenses', JSON.stringify(list));
}
function saveOneTimeExpenses(list) {
  localStorage.setItem('oneTimeExpenses', JSON.stringify(list));
}

// Add dealership form handler
if (document.getElementById('dealershipForm')) {
  document.getElementById('dealershipForm').onsubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById('dealerName').value;
    const monthly = parseFloat(document.getElementById('monthlyCharge').value);
    const trial = parseInt(document.getElementById('trialPeriod').value);
    const setup = parseFloat(document.getElementById('setupFee').value);
    const list = getDealerships();
    list.push({ name, monthly, trial, setup, start: new Date().toISOString() });
    saveDealerships(list);
    alert('Dealership added!');
    this.reset();
  }
}

// Add fixed expense handler
if (document.getElementById('fixedExpenseForm')) {
  document.getElementById('fixedExpenseForm').onsubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById('expenseName').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const list = getFixedExpenses();
    list.push({ name, amount });
    saveFixedExpenses(list);
    alert('Fixed Expense added!');
    this.reset();
  }
}

// Add one-time expense handler
if (document.getElementById('oneTimeExpenseForm')) {
  document.getElementById('oneTimeExpenseForm').onsubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById('oneTimeExpenseName').value;
    const amount = parseFloat(document.getElementById('oneTimeExpenseAmount').value);
    const list = getOneTimeExpenses();
    list.push({ name, amount });
    saveOneTimeExpenses(list);
    alert('One-Time Expense added!');
    this.reset();
  }
}

// Dashboard calculation
if (document.getElementById('dashboard')) {
  // Calculate months since Jan 1 of current year
  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  const now = new Date();
  const months = now.getMonth() + 1;
  
  // Revenue
  const dealerships = getDealerships();
  let revenue = 0;
  dealerships.forEach(d => {
    // months billed = months - trial period, can't be less than 0
    const monthsBilled = Math.max(0, months - d.trial);
    revenue += (d.monthly * monthsBilled) + d.setup;
  });

  // Expenses
  const fixedExpenses = getFixedExpenses();
  let expenses = 0;
  fixedExpenses.forEach(e => {
    expenses += e.amount * months;
  });
  const oneTimeExpenses = getOneTimeExpenses();
  oneTimeExpenses.forEach(e => {
    expenses += e.amount;
  });

  // Profit before salary/tax
  let profit = revenue - expenses;
  // Corp tax (21%)
  let corpTax = Math.max(0, profit * 0.21);
  // Salary (95% of remaining profit)
  let salaryPaid = Math.max(0, (profit - corpTax) * 0.95);
  // Salary tax (15%)
  let salaryTax = salaryPaid * 0.15;

  // Fill UI
  document.getElementById('revenue').textContent = revenue.toFixed(2);
  document.getElementById('expenses').textContent = expenses.toFixed(2);
  document.getElementById('corpTaxes').textContent = corpTax.toFixed(2);
  document.getElementById('salaryPaid').textContent = salaryPaid.toFixed(2);
  document.getElementById('salaryTaxes').textContent = salaryTax.toFixed(2);
}
