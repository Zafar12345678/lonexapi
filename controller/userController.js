const User = require("../models/userModel");
const bcryptjs = require("bcrypt");
const config = require("../config/config"); // Corrected the path to the config file.
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const { options } = require("../routes/userRoute");

const create_token = async (id)=> {
  try {
    const token = await jwt.sign({ _id: id }, config.secret_jwt);
    return token;
  } catch (error) {
    return null; // Return null or handle the error as needed
  }
};

const securePassword = async (password) => {
  try {
    const passwordHash = await bcryptjs.hash(password, 10);
    return passwordHash;
  } catch (error) {
    return null; // Return null or handle the error as needed
  }
};

const register_user = async (req, res) => {
  try {
    const spassword = await securePassword(req.body.password);
    const photo = req.file.filename;
    const userData = await User.findOne({ email: req.body.email });

    if (userData) {
      return res
        .status(400)
        .send({ success: false, message: "This email already exists" });
    } else {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: spassword,
        mobile: req.body.mobile,
        image: photo,
        type: req.body.type,
      });

      const user_data = await user.save();
      return res.status(200).send({ success: true, data: user_data });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
//login 
const user_login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userData = await User.findOne({ email: email });
    if (userData) {
      const passwordMatch = await bcryptjs.compare(password, userData.password);
      if (passwordMatch) {
        const tokenData = await create_token(userData._id);
        const userResult = {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          mobile: userData.mobile,
          image: userData.image,
          type: userData.type,
          token: tokenData,
        };
        const response = {
          success: true,
          message: "User details",
          data: userResult,
        };
        return res.status(200).send(response);
      } else {
        return res
          .status(401)
          .send({ success: false, message: "Invalid email or password" });
      }
    } else {
      return res
        .status(401)
        .send({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message });
  }
};
//update password 
const update_password = async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const password = req.body.password;
    const data = await User.findOne({ _id: user_id });
    if (data) {
      const newPassword = await securePassword(password);
      const userData = await User.findByIdAndUpdate(
        { _id: user_id },
        { $set: { password: newPassword } }
      );
      return res
        .status(200)
        .send({ success: true, message: "Your password is updated" });
    } else {
      return res
        .status(404)
        .send({ success: false, message: "User ID not found" });
    }
  } catch (error) {
    return res
      .status(400)
      .send({ success: false, message: "User ID not found" });
  }
};
//forgate_password

const sendResetPasswordMail = async(name,email,token)=>{
  try {
    const transport = nodemailer.createTransport({
      host:'smtp.gmail.com',
      port:587,
      secure:false,
      requireTLS:true,
      auth:{
        user:config.emailUser,
        pass:config.emailPassword
      }
    });
    const mailOption = {
      from :config.emailUser,
      to:email,
      subject:'for reset password',
      html: '<p> Hii '+name+' plz copy the link and <a href ="http://localhost:3000/user/reset_password?token='+token+'" > and reset your password</a>  '
    }
    transporter.sendMail(mailOptions,function(error,infor){
      if (error) {
        console.log(error);
        
      }
       else {
        console.log("mail has been send :-",(info.response))
        
      }
    })
    
  } catch (error) {
    res.status(200).send({success:false,message:error.message});

    
  }
}
const forgate_password = async(req,res)=>{

  try {
    const email = req.body.email;
    const userData  = await User.findOne({email:email});
    if (userData) {
      const randomstring = randomstring.generate();
     const data = await User.updateOne({email:email},{$set:{token:randomstring}});
     sendResetPasswordMail(userData.name,userData.email,randomstring);
     res.status(200).send({success:true,message:"plz chek your inbox of mail"})
      
      
    } else {
      res.status(200).send({success:false,message:error.message});

      
    }
    
  } catch (error) {
    res.status(400).send({success:true,message:"this email note exist"});
    
  }
}


module.exports = {
  register_user,
  user_login,
  update_password,
  forgate_password, // Use underscore instead of hyphen
};
