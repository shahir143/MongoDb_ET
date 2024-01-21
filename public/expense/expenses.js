const form = document.querySelector("#expense-button");
const itemList = document.querySelector("#user-list");
const userExpenses = document.getElementById('expenses');
const userDescription = document.getElementById('description');
const userCategory = document.getElementById('category');
const incomeAmount = document.getElementById('income-amount');
const incomeDecr = document.getElementById('income-description')
const incomeBtn = document.getElementById('add-income')
const premiumBtn = document.getElementById('premium-button');
const premiumDiv = document.getElementById('premium-div');
const manageBtn=document.getElementById('manage');
const logoutBtn = document.getElementById('logout');
const closeBtn = document.getElementById('closeModal');
const premiumText = document.getElementById('leaderBtn');

const leaderBoardBtn = document.getElementById('showLeaderboard');
const downloadListBtn = document.getElementById('Downloadboard');
const showleaderBtn = document.getElementById('leaderboardModal');
const boardList = document.getElementById('leaderboardList');
const home=document.getElementById('Home');
const API_BASE_URL = 'http://3.110.88.166:4000';

window.addEventListener('DOMContentLoaded', displayData);
form.addEventListener('click', saveData);
incomeBtn.addEventListener('click', addIncome);
premiumBtn.addEventListener("click", premium);
logoutBtn.addEventListener("click", serverOut);
leaderBoardBtn.addEventListener("click", showBoard);
downloadListBtn.addEventListener('click', showDownloadList);
closeBtn.addEventListener('click', closeList);
manageBtn.addEventListener('click',managePage);

home.addEventListener('click', function() {
    alert('You are in home page')
});
async function displayData() {
    try {
        const { data } = await axios.get(`${API_BASE_URL}/expense/Expenses`, { headers: { 
            Authorization: localStorage.getItem('token') 
        } });
        console.log(data);
        const premiumStatus = data.premium;
        localStorage.setItem("premium", premiumStatus);
        console.log(data.userLogin)
        if (localStorage.getItem("premium")==='false') {
            showleaderBtn.style.display = "none";
            alert('You are not premium member!')
        } else {
            premiumDiv.innerHTML = `<h4 id="premium_user">Premium User</h4>`;
            premiumBtn.removeEventListener("click", premiumRazor);
            premiumBtn.disabled = true;
            showleaderBtn.style.display = "none";
            alert('HELLO!, Enjoy the features')
        }
        const usersData = data.data;
        console.log(usersData)
        for (let i = 0; i < usersData.length; i++) {
            displayExpenses(usersData[i]);
        }
    } catch (error) {
        console.error(error);
    }
}
async function addIncome(e){
    e.preventDefault();
    const token = localStorage.getItem('token');
    const obj = { incomeDecription: incomeDecr.value, income: incomeAmount.value };
    try {
        const { data } = await axios.post(`${API_BASE_URL}/expense/addIncome`, obj, {
             headers: { Authorization: token } 
            });
            console.log(data);
    } catch (error) {
        console.error('Error in saving form', error);
    }
}
async function saveData(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const obj = { Expenses: userExpenses.value, Description: userDescription.value, Category: userCategory.value };
    try {
        const { data } = await axios.post(`${API_BASE_URL}/expense/addExpense`, obj, {
             headers: { Authorization: token } 
            });
        displayExpenses(data.data);
    } catch (error) {
        console.error('Error in saving form', error);
    }
}

function displayExpenses(data) {
    console.log(data);
    let li = document.createElement('li');
    li.className = "list-group-item";
    li.textContent = `${data.Expenses} - ${data.Category} - ${data.Description} -`;

    let deleteBtn = createButton("DELETE", "btn btn-danger");
    deleteBtn.textContent="DELETE"
    let editBtn = createButton("Edit", "btn btn-info");
    editBtn.id = 'edit';
    editBtn.textContent="EDIT";

    li.appendChild(deleteBtn);
    li.appendChild(editBtn);

    deleteBtn.onclick = async (e) => {
        const target = e.target.parentElement;
        const id = data.id;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${API_BASE_URL}/expense/delExpense/${id}`, {
                headers: {
                    Authorization: token
                }
            });
            itemList.removeChild(target);
        } catch (error) {
            console.log(error, "error in deleting ");
        }
    };

    editBtn.onclick = async (e) => {
        userExpenses.value = data.Expenses;
        userDescription.value = data.Description;
        userCategory.value = data.Category;
        const target = e.target.parentElement;
        const id = data.id;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${API_BASE_URL}/expense/delExpense/${id}`, {
                headers: {
                    Authorization: token
                }
            });
            itemList.removeChild(target);
        } catch (error) {
            console.log(error, "error in deleting ");
        }
    };

    itemList.appendChild(li);
}

function createButton(text, className) {
    const button = document.createElement('button');
    button.type = "button";
    button.className = className;
    button.textContent = text;
    return button;
}


async function premium(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
        const { data } = await axios.get(`${API_BASE_URL}/purchase/premiumMember`, { 
            headers: { Authorization: token } 
        });
        await premiumRazor(data);
    } catch (error) {
        console.error(error);
    }
}

const premiumRazor = async (data) => {
    const token = localStorage.getItem('token');
    try {
        const options = { 
            key: data.key_id, 
            order_Id: data.orderData.orderId, 
            handler: async (response) => {
                const updateData = await axios.post(`${API_BASE_URL}/purchase/updatedTransactionstatus`, {
                    order_id: data.orderData.orderId,
                    payment_id: response.razorpay_payment_id,}, 
                    { headers: { Authorization: token } });
                const premiumData = updateData.data.data.Premium;
                localStorage.setItem("premium", premiumData);
                        if (localStorage.getItem('premium')==='true') {
                            premiumDiv.innerHTML = `<h4 id="premium_user">Premium User</h4>`;
                            premiumBtn.removeEventListener("click", premiumRazor);
                            premiumBtn.disabled = true;
                            }
                    alert(" congrats!You are a premium user");
            } 
        };
        const rzpl = new window.Razorpay(options);
        await rzpl.open();
        rzpl.on('payment.failed', async(failedData) => {
            console.log(failedData.error.metadata)
            const data = await axios.post(`${API_BASE_URL}/purchase/failedTransaction`, failedData.error.metadata, {
				headers: { Authorization: token },
			});
            alert(":) Sorry! payment  failed try again")
        })
    } catch (error) {
        console.error(error);
    }
};
async function managePage(e){
    try{
        if(localStorage.getItem('premium')==='true'){
            window.location.href="./manage.html"
        }else{
            alert("Please purchase premium for manage");
        }
    }catch(e){
        console.log(e)
    }
}


async function showBoard() {
    if(localStorage.getItem('premium')==='true'){
    showleaderBtn.style.display = "block";
    displayLeaderboard();
    }else{
        alert("Please purchase premium for leaderBoard");
    }
}

function closeList() {
    showleaderBtn.style.display = "none";
    boardList.innerHTML = "";
}
async function showDownloadList() {
    try{
    const token =localStorage.getItem('token');
    if(localStorage.getItem('premium')==='true'){
        const response=await axios.get(`${API_BASE_URL}/expense/download`,{
            headers:{
                Authorization:token,
            }
        })
        if(response.status==200){
            const a = document.createElement("a");
				a.href = response.data.fileURL.Location;
				a.download = "myExpense.txt";
				a.click();
        }
    }else{
        alert("Please purchase premium for Downloading expenses");
    }
    }catch(err){
        console.log(err)
    }
}

async function displayLeaderboard() {
    try {
        const { data } = await axios.get(`${API_BASE_URL}/premium/leaderboard`, { headers: { Authorization: localStorage.getItem('token') } });
        boardList.innerHTML = "";
        data.leaderBoard.forEach((item) => {
            if (item.premium) {
                const li = document.createElement('li');
                li.textContent = `Name : ${item.userName}- Expenses: Rs.${item.totalexpenses} - Income:${item.income}`;
                boardList.appendChild(li);
            }
        });
    } catch (error) {
        console.error(error,"error at download");
    }
}

async function serverOut(e) {
    e.preventDefault();
    localStorage.clear();
    const logout = confirm("Are you sure you want to logout?");
    if (logout) {
        window.location.href = '../login/login.html';
    }
}
