const user=require('../model/login');

exports.showLeaderBoard = async (req, res) => {
    try {
        const allUsers = await user.find({}, 'userName totalexpenses premium income')
        .sort({ totalexpenses: -1 }).exec();

        res.status(200).json({ success: true, leaderBoard: allUsers });
    } catch (err) {
        res.status(500).json({ success: false, message: "Loading failed in leaderBoard && Unauthorized - please relogin'" });
    }
};

exports.showdash = async(req,res)=>{
    
    try{
          const data = await user.findById(req.user._id, 'income totalexpenses').exec();
  if (!data) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.status(200).json({ success: true, data: data });
    }catch(err){
        res.status(500).json({success:false,err});
    }
}