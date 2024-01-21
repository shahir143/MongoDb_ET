const myForm=document.getElementById('my-Form');
const useremail=document.getElementById('Email');
const userPassword=document.getElementById('Password');
const API_BASE_URL = 'http://3.110.88.166:4000';

myForm.addEventListener('submit',async(e)=>{
    e.preventDefault();
    try{
        const loginData={
            email:useremail.value,
            password:userPassword.value
        }
        const login=await axios.post(`${API_BASE_URL}/login`,loginData);
        alert(login.data.message);
        localStorage.setItem('token',login.data.token);
        window.location.href='../expense/expense.html'
        console.log(loginData)
    }catch(err){
        console.log(err);
    }
})