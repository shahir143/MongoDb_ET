const logoutButton = document.getElementById("logout");
const itemperPage = document.getElementById('per-page');
const userList = document.getElementById('list-group');
const pagination = document.getElementById("pagination-div");
const income = document.getElementById('dash-income');
const expense = document.getElementById('dash-expense');
const savings = document.getElementById('dash-savings');
const API_BASE_URL = 'http://3.110.88.166:4000';

itemperPage.addEventListener("change", setLimit);
window.addEventListener('DOMContentLoaded', loadPage);
logoutButton.addEventListener('click', serverOut);

async function loadPage(e) {
    e.preventDefault();
    const premium = localStorage.getItem('premium');
    const limit = localStorage.getItem('limit');
    itemperPage.value = limit;
    const defaultPage = 1;
    await getpagination(defaultPage);
    if (premium) {
        if (limit) {
            itemperPage.value = limit;
        } else {
            itemperPage.value = "3";
        }
    }
    getpreviousDownloads();
    updateDashBoard();
}

async function getpreviousDownloads() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/expense/getprevList`, { headers: { Authorization: token } });
        for (let i = 0; i < response.data.data.length; i++) {
            const data = {
                url: response.data.data[i].fileUrl,
                date: response.data.data[i].createdAt.slice(0, 10)
            };
            const existingLinks = document.getElementById("dashboard-list").childElementCount;
            if (existingLinks < 5) {
                createLink(data);
            }
        }
    } catch (err) {
        console.error('Error in getpreviousDownloads:', err);
    }
}

async function createLink(data) {
    const container = document.getElementById("dashboard-list");
    const li = document.createElement('li');
    li.innerHTML = `Report on ${data.date} -<a href="${data.url}">Download</a>`;
    container.appendChild(li);
}

async function updateDashBoard() {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${API_BASE_URL}/premium/showdashboard`, { headers: { Authorization: token } });
        const expenseData = {
            income: response.data.data.income,
            expense: response.data.data.totalexpenses
        };
        income.textContent = `Income this month: ${expenseData.income}`;
        expense.innerText = `Expense this month: ${expenseData.expense}`;
        const savingsValue = expenseData.income - expenseData.expense;
        savings.innerText = `Savings this month: ${savingsValue}`;
        if (savingsValue < 1000) {
            savings.style.backgroundColor = "red";
            savings.style.color = "white";
        } else if (savingsValue > 1000 && savingsValue <= 20000) {
            savings.style.backgroundColor = "orange";
            savings.style.color = "white";
        } else {
            savings.style.backgroundColor = "green";
            savings.style.color = "white";
        }
    } catch (error) {
        console.log("Error updating dashboard:", error);
    }
}

async function setLimit(e) {
    e.preventDefault();
    const limit = itemperPage.value;
    localStorage.setItem('limit', limit);
    const defaultPage = 1;
    await getpagination(defaultPage);
}

async function getpagination(page) {
    try {
        const currentPage = page;
        const token = localStorage.getItem('token');
        const count = localStorage.getItem('limit');
        userList.innerHTML = "";
        const response = await axios.get(`${API_BASE_URL}/expense/paginationExpense?count=${count}&page=${currentPage}`, {
            headers: { Authorization: token }
        });
        await showPage(response.data.data);
        await sendData(response.data.data.pageData);
    } catch (err) {
        console.log("Error in getpagination:", err);
    }
}

async function showPage(data) {
    const { currentPage, nextPage, previousPage, hasPrevious, hasNext, totalPage } = data;
    pagination.innerHTML = "";
    if (hasPrevious) {
        const previousBtn = document.createElement("button");
        previousBtn.textContent = "Previous";
        previousBtn.className = "prevButton";
        previousBtn.setAttribute("type", "button");
        previousBtn.id = "prevButton";
        previousBtn.addEventListener("click", async () => {
            await getpagination(previousPage);
        });
        pagination.appendChild(previousBtn);
    }

    const currBtn = document.createElement("button")
    currBtn.textContent = "Current";
    currBtn.className = "currBtn";
    currBtn.setAttribute("type", "button");
    currBtn.id = "currButton";
    currBtn.addEventListener("click", async () => {
        if (currentPage == totalPage) {
            await getpagination(1);
        }
    });
    pagination.appendChild(currBtn);

    if (hasNext) {
        const nextBtn = document.createElement("button");
        nextBtn.textContent = "Next";
        nextBtn.className = "nextButton";
        nextBtn.setAttribute("type", "button");
        nextBtn.id = "nextButton";
        nextBtn.addEventListener("click", async () => {
            await getpagination(nextPage);
        });
        pagination.appendChild(nextBtn);
    }
}

async function sendData(data) {
    for (let i = 0; i < data.length; i++) {
        displayExpenses(data[i]);
    }
}

function displayExpenses(data) {
    let li = document.createElement('li');
    li.className = "list-group-item";
    li.textContent = `${data.Expenses} - ${data.Category} - ${data.Description} -`;

    let deleteBtn = document.createElement('button');
    deleteBtn.className="btn btn-danger";
    deleteBtn.id='deleteBtn';
    deleteBtn.textContent = "DELETE";

    li.appendChild(deleteBtn);

    deleteBtn.onclick = async (e) => {
        const target = e.target.parentElement;
        const id = data.id;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${API_BASE_URL}/expense/delExpense/${id}`, {
                headers: { Authorization: token }
            });
            userList.removeChild(target);
        } catch (error) {
            console.log("Error in deleting:", error);
        }
    };

    userList.appendChild(li);
}


async function serverOut(e) {
    e.preventDefault();
    localStorage.clear();
    const logout = confirm("Are you sure you want to logout?");
    if (logout) {
        window.location.href = '../login/login.html';
    }
}
