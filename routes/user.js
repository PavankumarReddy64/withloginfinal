var express = require('express'),
http = require('http'),
path = require('path');
var app = express();
var mysql= require('mysql');
var bodyParser=require("body-parser");
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
const nodemailer = require("nodemailer");


exports.signup = function(req, res){
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var username = post.username;
      var password = post.password;
      var fname= post.first_name;
      var lname= post.last_name;
      var signup_email= post.signup_email;
      if(signup_email!=''){
         var sql2 = "SELECT signup_email FROM users WHERE signup_email ='"+signup_email+"'";
         db.query(sql2,function(err,results,field){
            if(results.length){
               req.session.signup_email=results.signup_email;
               req.session.user=results.user;
               message='account already exists'
               res.render('login.ejs', {message:message})
            }
            else if(username !='' && password!='' && fname !="" && lname !="" && signup_email !="") {
               var sql = "INSERT INTO `users`(`first_name`,`last_name`,`signup_email`,`username`, `password`) VALUES ('" + fname + "','" + lname + "','" + signup_email + "','" + username + "','" + password + "')";
         
               var query = db.query(sql, function(err, result) {
                 message = "Your account has been created succesfully.";
                 res.render('signup.ejs',{message: message});
               });
            }
            else {
               message = "Username and password is mandatory field.";
               res.render('signup.ejs',{message: message});
            } 
         })}
	   
     

      

   }
   else {
      res.render('signup');
   }
};
 
exports.login = function(req, res){
   //console.log(__dirname);
   var message = '';
   var sess = req.session; 

   if(req.method == "POST"){
      var post  = req.body;
      var username = post.username;
      var password= post.password;
     
      var sql="SELECT  first_name, last_name, username FROM `users` WHERE `username`='"+username+"' and password = '"+password+"'";                           
      db.query(sql, function(err, results){       
         if(results.length){
            req.session.username = results.username;
            req.session.user = results;
            //console.log(results.username);
            console.log("success");
            //res.sendFile(path.join(__dirname, '../views', 'index.html'));
            res.redirect('/home');

         }
         else{
            message = 'You have entered invalid username or password.';
            res.render('login.ejs',{message: message});
         }
                 
      });
   } else {
      res.render('login.ejs',{message: message});
   }
           
};

           
// // exports.dashboard = function(req, res, next){
           
// //    var user =  req.session.user,
// //    username = req.session.username;
// //    console.log('ddd='+username);
// //    if(username == null){
// //       res.redirect("/login");
// //       return;
// //    }

//    var sql="SELECT * FROM `users` WHERE `username`='"+username+"'";

//    db.query(sql, function(err, results){
//       res.render('dashboard.ejs', {data:results});    
//    });       
// };

// exports.profile = function(req, res){

//    var username = req.session.username;
//    if(username == null){
//       res.redirect("/login");
//       return;
//    }

//    var sql="SELECT * FROM `users` WHERE `username`='"+username+"'";          
//    db.query(sql, function(err, result){  
//       res.render('profile.ejs',{data:result});
//    });
// };

// exports.logout=function(req,res){
//    req.session.destroy(function(err) {
//       res.redirect("/login");
//    })
