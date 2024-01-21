const user=require('../model/login');

exports.showLeaderBoard=async (req,res)=>{
    try{
        const allUsers=await user.findAll({
            attributes:['userName','totalexpenses','premium',"income"],
            order:[['totalexpenses','DESC']],
        })
        res.status(200).json({success:true,leaderBoard:allUsers})
    }catch(err){
        res.status(500).json({success:false,message:"loading failed in leaderBoard && Unauthorized - please relogin'"});
    }
}

exports.showdash = async(req,res)=>{
    
    try{
        const data = await user.findByPk(req.user.id, {
            attributes: ['income', 'totalexpenses']
        });
        res.status(200).json({success:true,data:data.dataValues});
    }catch(err){
        res.status(500).json({success:false,err});
    }
}