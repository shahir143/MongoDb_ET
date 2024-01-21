const sib = require("sib-api-v3-sdk"); //brevo or sendin blue
const uuid=require("uuid");//generate a unique string
const bcrypt=require('bcrypt');//one time encryption hashing and salt algorithm 

const forgetPass=require('../model/reset');
const User=require('../model/login');
const axios=require('axios');

let defaultClient=sib.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey=process.env.BREVO_FORGET_API_KEY;

let apiInstance=new sib.TransactionalEmailsApi();

exports.forgetPassword = async (req,res)=>{
try{
    const {email}=req.body;
    const user = await User.findOne({ where: { userEmail:email } });
    if(user){
      const uuidToken=uuid.v4();
      const tokenactive=await forgetPass.create({uuid:uuidToken,isActive:true,userId:user.id});
      
      const sender = new sib.SendSmtpEmailSender();
      sender.email = "hr@recur.com";
      sender.name = "HR";

      const to = [new sib.SendSmtpEmailTo()];
      to[0].email = email;

      const SendSmtpEmail=new sib.SendSmtpEmail();
      SendSmtpEmail.sender=sender;
      SendSmtpEmail.to=to;
      SendSmtpEmail.subject='reset password'
      SendSmtpEmail.textContent=`click the following link to reset http://3.110.88.166:4000/password/resetpassword/${uuidToken}`;
      
      const emailResponse=await apiInstance.sendTransacEmail(SendSmtpEmail);
      console.log(emailResponse)
      res.status(201).json({success:true,message:"email send successfully"})
    }else{
      res.status(500).json({success:false,message:"wrong email"})
    }
    
    }catch(error){
        console.log(error);
        res.status(400).json({success:false,message:"failed to send email", error:error});
    }
}
exports.resetPassword = async (req, res) => {
  const id = req.params.id;
  try {
    const resetReq = await forgetPass.findOne({ where: { uuid: id } });

    if (resetReq.isActive) {
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>ET-reset</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
          <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.6.2/axios.min.js" integrity="sha512-b94Z6431JyXY14iSXwgzeZurHHRNkLt9d6bAHt7BZT38eqV+GyngIi/tVye4jBKPYQ2lBdRs0glww4fmpuLRwA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        </head>
        <body>
          <div class="container mt-5">
            <div class="row justify-content-center">
              <div class="col-md-5">
                <h2 class="mb-4">ET-FORGET PASSWORD</h2>
                <form id="myForm">
                  <div class="form-group">
                    <input type="text" class="form-control" id="password1" placeholder="Enter new password" required>
                    <input type="text" class="form-control" id="password2" placeholder="re-enter new password" required>
                  </div>
                  <button type="submit" id="submit" class="btn btn-success btn-block">Reset Password</button>
                </form>
                <hr>
                <h5 class="text-center">Back to <a href="../login/login.html" class="text-primary">Login</a></h5>
              </div>
            </div>
          </div>

          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
          <script>
            const myForm = document.getElementById('myForm');
            const password1 = document.getElementById('password1');
            const password2 = document.getElementById('password2');


            myForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const Password1 = password1.value;
            const Password2 = password2.value;
            const id = "${id}";
            if(Password1===Password2){
              try {
                const response = await axios.post("http://3.110.88.166:4000/password/resetpassword/" + id, { password: Password1 })
  
                if (response.status === 200) {
                  window.location.href = "../../Login/login.html";
                }
              } catch (error) {
                console.error("Error resetting password:", error);
              }
            }else{
              alert('Please enter same password)
            }
            
          });

          </script>
        </body>
        </html>
      `);
    } else {
      res.status(404).json({ success: false, message: "Invalid reset request or request is not active" });
    }

  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to reset", error: error });
  }
}

exports.updatePassword = async (req, res) => {
  try {
    console.log("--------",req.params,req.body)
    const id = req.params.id;
    const { password } = req.body;

    const resetReq = await forgetPass.findOne({ where: { uuid: id } });
    console.log(resetReq);
    const user = await User.findOne({ where: { id: resetReq.userId } });
    console.log(user);
    if (resetReq.isActive) {
      const hash = bcrypt.hashSync(password, 10);

      await user.update({
        userPassword: hash,
      });

      await resetReq.update({
        isActive: false,
      });

      res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
      
    }else{
      return res.status(400).json({
        success: false,
        message: "Invalid reset request or password already updated",
      });
    }
    
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({
      success: false,
      message: "Error updating password",
      error: error,
    });
  }
};
