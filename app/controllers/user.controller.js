const { users, sequelize } = require("../models");
const db = require("../models");
const Users = db.user;
const Op = db.Sequelize.Op;
const { where, and } = require("sequelize");
const { DB } = require("../config/db.config");
var bcrypt = require('bcryptjs');
const myArray = new Array();
//get all users
// exports.get_users=(req,res)=>{
//   const page = req.params.id;
//   sequelize.query("select * from users where role = 'ADMIN' AND is_blocked = 'false' ORDER BY id DESC").then(data => {
//     const pages=Math.ceil(data[0].length/10);
//     myArray['pages']=pages;
// });
// if(myArray['pages']==null){
//   sequelize.query("select * from users where role = 'ADMIN' AND is_blocked = 'false' ORDER BY id DESC LIMIT 10 OFFSET 1").then(data=>{
//     res.status(200).send({lastPage:myArray['pages'],currentPage:1,data:data[0]});
//   })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving Users."
//       });
//     });
// }else{
//   sequelize.query("select * from users where role = 'ADMIN' AND is_blocked = 'false' ORDER BY id DESC LIMIT 10 OFFSET "+page+";").then(data=>{
//     res.status(200).send({lastPage:myArray['pages'],currentPage:page,data:data[0]});
//   })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving Users."
//       });
//     });
//   }
//    }
exports.get_users=(req,res)=>{
  const page = req.params.id;
  sequelize.query("select * from users where role = 'ADMIN' AND is_blocked = 'false' ORDER BY id DESC").then(data => {
    // const pages=Math.ceil(data[0].length/10);
    res.status(200).send({data:data[0]});
    // myArray['pages']=pages;
});
   }
   //search users by

  exports.search_user = (req,res)=>{
    const full_name = req.params.id;
    Users.findAll({where:{full_name:{[Op.like]:'%'+full_name+'%'}} , where:{email:{[Op.like]:'%'+full_name+'%'}}}).then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Users."
      });
    });;
  }
  //login
  
  exports.login = (req,res)=>{
    // console.log(req.body.email);
    sequelize.query("select * from users where email = '"+req.body.email+"'").then(data => {
      // const pages=Math.ceil(data[0].length/10);
      // res.status(200).send({data:data[0]});
      myArray['pages']=data[0];
  });
    // const user=Users.findAll({where:{email:'hr@polymateria.com'} });
    // console.log(user);
    console.log((myArray['pages']));
// if(myArray['pages'][0].email){
//   // console.log('hello');
//   var passwordIsValid = bcrypt.compare(req.body.password, myArray['pages'][0].password);
//   console.log(passwordIsValid);
// }else{
//   res.status(500).send({
//     message:
//       err.message || "No user found."
//   });
// }
// console.log('h?ello');
    // res.send({data:myArray['pages'][0]});
    // Users.findOne({where :{email: req.body.email} }, function (err, user) {

    //   if (err) return res.status(500).send('Error on the server.');
    //   if (!user) return res.status(404).send('No user found.');
      
    //   var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    //   if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
      
    //   var token = jwt.sign({ id: user._id }, config.secret, {
    //     expiresIn: 86400 // expires in 24 hours
    //   });
    //   // console.log(token);
    //   res.status(200).send({ auth: true, token: token });
    // });
  }
