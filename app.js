var express = require('express'),
routes = require('./routes'),
user = require('./routes/user'),
http = require('http'),
path = require('path');
var session = require('express-session');
var app = express();
var mysql= require('mysql');
var bodyParser=require("body-parser");
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
const nodemailer = require("nodemailer");
var connection = mysql.createConnection({host:'database-1.cgb5oajsfoff.ap-south-1.rds.amazonaws.com',user:'pavan_rds',password:'Pavan1234',database:'final_project'});

app.use(express.static(path.join(__dirname, 'public')));

connection.connect((err)=> {
  if(!err)
  console.log('Connection Established');
  else
  console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
  });
 
global.db = connection;
 
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(session({
              secret: 'keyboard cat',
              resave: false,
              saveUninitialized: true,
              cookie: { maxAge: 60000 }
            }))
 

app.get('/', routes.index);
app.get('/signup', user.signup);
app.post('/signup', user.signup);
app.get('/login', routes.index);
app.post('/login', user.login);
//console.log(path.join(__dirname, '../views', 'index.html'));
app.get('/home',(req, res) => {     
  //console.log("in home")   
 // console.log(__dirname);
  //console.log(path.join(__dirname, '../views', 'index.html'));
  res.sendFile(path.join(__dirname, './views', 'index.html'));
});


  



//app.get('/home/logout', user.logout);
//app.get('/home/profile',user.profile);

// app.get('/', (req, res) => {        //get requests to the root ("/") will route here
//   res.sendFile('index.html', {root: __dirname});      //server responds by sending the index.html file to the client's browser
//                                                    //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
// });


app.post('/create', (req, res) => {
  console.log(req.body.name);
    const Customer_name = req.body.name
    const Customer_contact_num=req.body.phone_number
    const Customer_email_address=req.body.email
    const Customer_address=req.body.address1
    const pincode=req.body.pincode
   // const payment_mode=req.body.payment_mode

    //const order_status=req.body.order_status

    db.query(
        "INSERT INTO Customer_order_details (Customer_name,Customer_contact_num,Customer_address,pincode,Customer_email_address) VALUES (?,?,?,?,?)",
        [Customer_name,Customer_contact_num,Customer_address,pincode,Customer_email_address],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Details Inserted")
            
          }
          
        }
      );

})


//Mail
app.post('/',(req, res)=>{
 // console.log(req.body)

  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'shopee.com2022@gmail.com',
          pass: 'qwerty2022'
      }
  })
  const mailOptions = {
      from: 'shopee.com2022@gmail.com',
      to: req.body.email ,
      subject: 'Thanks for subscribing',
      text: 'Thanks for subscribing to our newsletter. Stay tuned for more correspondance'
  }


  var email=req.body.email;
  var sql1=    "SELECT Customer_email FROM Customer_details WHERE Customer_email= '"+email+"'";

  db.query(sql1,function(err, results,field)  {
    if(results.length===0) {
        console.log(results)
         transporter.sendMail(mailOptions, (error, info)=>{
          if(error){
            console.log('error');
            res.send('error');
          }
          else{

            console.log('Email sent:' + info.response);
            res.send('success');
            db.query(
              "INSERT INTO Customer_details (Customer_email,Customer_name) VALUES (?,?)",
              [req.body.email,req.body.subscriberName],
              (err, results) => {
                if (err) {
                  console.log(err);
                } else {
                    console.log('values inserted');
                }
                
              })
          }
        })
      }
      else{
        console.log('email already exists');
        res.send('error');
        console.log(results)
      }
    }
  )
})
app.listen(8080)
