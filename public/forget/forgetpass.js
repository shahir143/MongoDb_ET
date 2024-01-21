const myform=document.getElementById('my-Form');
const userEmail=document.getElementById('Email');
const API_BASE_URL = 'http://3.110.88.166:4000';

myform.addEventListener('submit', resetPass);

async function resetPass(e){
    e.preventDefault();
    try{
        const reset={
            email:userEmail.value,
        }
        const response=await axios.post(`${API_BASE_URL}/password/forgetPassword`,reset);
        console.log(response.data);
        if(response.status===201){
            alert("check your mail");
        }
    }catch(e){
        console.log(e);
    }
}