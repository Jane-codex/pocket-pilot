          // Variables
     let budget = parseFloat(localStorage.getItem('budget')) || 0;
    let totalExpenses = parseFloat(localStorage.getItem('totalExpenses')) || 0;
     let expenses = JSON.parse(localStorage.getItem('expenses')) || [];


        document.addEventListener("DOMContentLoaded", () => {

              // Dom Element
     const greetingElement = document.getElementById('greeting');

     const changeNameBtn = document.getElementById('change-name-btn');

     const budgetInput = document.getElementById('budget-input');

     const setBudgetBtn = document.getElementById('set-budget-btn');

     const budgetDisplay = document.getElementById('budget-display');

     const budgetAlert = document.getElementById('budget-alert');

     const totalExpensesDisplay = document.getElementById('total-expenses');

     const expenseNameInput = document.getElementById('expense-name');

     const expenseAmountInput = document.getElementById('expense-amount');

     const expenseCategoryInput = document.getElementById('expense-category');

     const expenseDateInput = document.getElementById('expense-date');

     const addExpenseBtn = document.getElementById('add-expense-btn');

     const expensesContainer = document.getElementById('expenses-container');

     const expensesChartCanvas = document.getElementById('expenses-chart');

     const ctx = expensesChartCanvas.getContext('2d');

     const exportCsvBtn = document.getElementById('export-csv-btn');

      const themeToggleBtn = document.getElementById('theme-toggle-btn');

      


          // Functions
          function saveToLocalStorage() {
          localStorage.setItem('budget', budget);
         localStorage.setItem('totalExpenses', totalExpenses);
         localStorage.setItem('expenses', JSON.stringify(expenses));
       }

         function checkBudgetStatus() {
         if (budget > 0 && totalExpenses > budget) {
         budgetAlert.textContent = "⚠️ You've exceeded your budget!";
        } else {
          budgetAlert.textContent = '';
       }
    }

         function renderExpenses() {
         expensesContainer.innerHTML = '';
         expenses.forEach(exp => createExpenseCard(exp));
       }

          function createExpenseCard(exp) {
          const card = document.createElement('div');
          card.classList.add('expense-card');
         card.innerHTML = `
          <h3>${exp.name}</h3>
          <p>Amount: ${exp.amount}</p>
          <p>Category: ${exp.category}</p>
          <p>Date: ${exp.date}</p>
          <div class="actions">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
           </div>
            `;
         expensesContainer.appendChild(card);

         card.querySelector('.delete-btn').addEventListener('click', () => {
          totalExpenses -= exp.amount;
         totalExpensesDisplay.textContent = totalExpenses;
         expenses = expenses.filter(e => e !== exp);
         saveToLocalStorage();
         checkBudgetStatus();
         renderExpenses();
        });

          card.querySelector('.edit-btn').addEventListener('click', () => {
             expenseNameInput.value = exp.name;
             expenseAmountInput.value = exp.amount;
             expenseCategoryInput.value = exp.category;
             expenseDateInput.value = exp.date;

            totalExpenses -= exp.amount;
             totalExpensesDisplay.textContent = totalExpenses;
            expenses = expenses.filter(e => e !== exp);
            saveToLocalStorage();
            checkBudgetStatus();
            renderExpenses();
        });
    }

             // Event Listeners
              setBudgetBtn.addEventListener('click', () => {
               const inputBudget = parseFloat(budgetInput.value);
               if (!isNaN(inputBudget) && inputBudget > 0) {
               budget = inputBudget;
              budgetDisplay.textContent = budget;
              saveToLocalStorage();
              checkBudgetStatus();
               budgetInput.value = '';
               } else {
                alert('Please enter a valid budget amount.');
            }
       });

      addExpenseBtn.addEventListener('click', () => {
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value.trim());
    const category = expenseCategoryInput.value.trim();
    const date = expenseDateInput.value;

    if (!name || isNaN(amount) || !category || !date) {
        alert('Please fill in all expense details.');
        return;
    }

    const expense = { name, amount, category, date };
    expenses.push(expense);
    totalExpenses += amount;
    totalExpensesDisplay.textContent = totalExpenses;

    saveToLocalStorage();
    checkBudgetStatus();
    renderExpenses();
    renderChart();

    expenseNameInput.value = '';
    expenseAmountInput.value = '';
    expenseCategoryInput.value = '';
    expenseDateInput.value = '';
     });

     exportCsvBtn.addEventListener('click', () => {
    if (expenses.length === 0) {
        alert('No expenses to export.');
        return;
    }
    let csvContent = 'Name,Amount,Category,Date\n';
    expenses.forEach(exp => {
        csvContent += `${exp.name},${exp.amount},${exp.category},${exp.date}\n`;
    });
    downloadCSV(csvContent, 'expenses.csv');
       });

        function downloadCSV(content, filename) {
         const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
         const url = URL.createObjectURL(blob);
         const link = document.createElement('a');
        link.setAttribute('href', url);
       link.setAttribute('download', filename);
       document.body.appendChild(link);
        link.click();
          document.body.removeChild(link);
       }

        function renderChart() {
          ctx.clearRect(0, 0, expensesChartCanvas.width, expensesChartCanvas.height);
          if (expenses.length === 0) {
        ctx.fillText('No data to display', 180, 150);
        return;
    }
    const categoryTotals = {};
    expenses.forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const categories = Object.keys(categoryTotals);
    const values = Object.values(categoryTotals);
    let barWidth = 50;
    let gap = 60;
    let startX = 50;
    let chartHeight = expensesChartCanvas.height - 50;
    let maxValue = Math.max(...values);

         categories.forEach((category, i) => {
            let barHeight = (values[i] / maxValue) * chartHeight;
            let x = startX + i * (barWidth + gap);
            let y = expensesChartCanvas.height - barHeight - 20;

        ctx.fillStyle = 'green';
        ctx.fillRect(x, y, barWidth, barHeight);
        ctx.fillStyle = 'black';
        ctx.fillText(values[i], x + 5, y - 5);
        ctx.fillText(category, x, expensesChartCanvas.height - 5);
           });
        }


           // Greeting
         function getUserName() {
         let userName = localStorage.getItem('userName');

       if (!userName) {
        userName = prompt("What's your name?");
        if (userName) {
            localStorage.setItem('userName', userName);
        }
    }

    return userName;
    }   
       
          changeNameBtn.addEventListener('click', () => {
         const newName = prompt("Enter your new name:");
          if (newName) {
        localStorage.setItem('userName', newName);
        displayGreeting();
    }
    });
 
          function getUserName() {
    let userName = localStorage.getItem('userName');

    if (!userName) {
        userName = prompt("What's your name?");
        if (userName) {
            localStorage.setItem('userName', userName);
        }
    }

    return userName;
    }

         function displayGreeting() {
    const now = new Date();
    const hour = now.getHours();

    let greetingTime = '';

    if (hour < 12) {
        greetingTime = '😊 Good Morning';
    } else if (hour < 18) {
        greetingTime = '😊 Good Afternoon';
    } else {
        greetingTime = '😊 Good Evening';
    }

    let userName = localStorage.getItem('userName');

    if (!userName) {
        userName = prompt("😊 Welcome! What's your name?");
        if (userName) {
            localStorage.setItem('userName', userName);
        }
    }

    if (userName) {
        greetingElement.textContent = `${greetingTime}, ${userName}!`;
    } else {
        greetingElement.textContent = `${greetingTime}!`;
    }
     }

          displayGreeting();

                function setTheme(mode) {
    document.body.classList.toggle('light-mode', mode === 'light');
    localStorage.setItem('theme', mode);
    themeToggleBtn.textContent = mode === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode';
           }


              
         /// Load theme on page load
           window.addEventListener('DOMContentLoaded', () => {
          const savedTheme = localStorage.getItem('theme') || 'dark';
          setTheme(savedTheme);
           });

              // Toggle theme on button click
             themeToggleBtn.addEventListener('click', () => {
        const newTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
             setTheme(newTheme);
             });

             themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            }); 
        });
        
           
       