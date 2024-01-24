const Expense=require('../model/expense');
const reports=require('../model/report');
const AWS=require('aws-sdk');

const s3=new AWS.S3({
    accessKeyId:process.env.AWS_ACCESS_KEY,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
})

exports.downloadReport=async(req,res)=>{
    try{
        const usersData=await Expense.find({ user: req.user._id });
        const StringifedData=JSON.stringify(usersData);
        const fileName=`Expenses_${req.user._id}_${new Date()}.txt`;
        const fileURL=await uploadToS3(StringifedData,fileName)
        console.log("fileurl:",fileURL);
        await reports.create({
			fileUrl: fileURL.Location,
			userId: req.user._id,
		});
        console.log('fileurl-----',fileURL)
        res.status(200).json({fileURL,sucess:true})
    }catch(err){
        res.status(500).json({message:err,sucess:false})
    }
}

function uploadToS3(data,name){
    const BUCKET_NAME=process.env.BUCKET_NAME;
    const AWS_ACCESS=process.env.AWS_BUCKET_ACCESS;
    const params={
        Bucket:BUCKET_NAME,
        Key:name,
        Body:data,
        ACL:AWS_ACCESS
    }
    return new Promise((resolve, reject) => {
		s3.upload(params, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}
exports.getDownlist=async(req,res)=>{
    console.log("req.user",req.user)
    try{
        
        const reportData = await reports.find({ user: req.user._id }, "fileUrl").exec();
        res.status(200).json({sucess:true, message:"sucessfully get previous reports", data: reportData});
    }catch(err){
        res.status(500).json({sucess:false, message:"failed to get previous reports"});
    }
}