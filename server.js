const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const session = require('express-session') 
const fs = require('fs');
const bodyParser = require('body-parser');


app.use(express.static(path.join(__dirname, '/views/index.html'), {
  index: false
}));

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
  key: 'user_sid',
  secret: 'somerandonstuffs',
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: 600000
  }
}));


app.use(express.static('views'))

app.use(bodyParser.urlencoded({ extended: true })); 

module.exports = app;

router.get('/index',function(req,res){
  if(req.session.id)
  {
    res.sendFile(path.join(__dirname+'/views/index.html'));
  }
  else
  {
    res.redirect('/login');
  }
});

router.get('/login',function(req,res){
  res.sendFile(path.join(__dirname+'/views/login.html'));
  //__dirname : It will resolve to your project folder.
});

router.post('/login',function(req,res){

//var data = require('./data.json');
var username = req.body.username;
var pass = req.body.pass;
req.session.name = req.body.username;
fs.readFile('./data.json', (err, data) => {
      if (err) throw err;
      let Users = JSON.parse(data);
      console.log(Users);
      var length = Object.keys(Users).length;
      var found = 0;
    for(var i=0;i<length;i++)
    {
      if((username == Users[i].UserName)&&(pass == Users[i].Password))
      {
        found = 1;
       
        break;
      }
    }

    if(found == 1)
    {
      req.session.id = "1";
      
      res.redirect('/index');
      //res.send(`Found a user named:${Users[i].Name} and Email ${Users[i].Email} .`);
      
    }
    else{
      
      res.redirect('/login?Err=1');
      //res.send(`not found.`);

    }


});

console.log('This is after the read call');


 
});


// // route for handling 404 requests(unavailable routes)
// app.use(function (req, res, next) {
//   res.status(404).send("Sorry can't find that!")
// });


//add the router
app.use('/', router);
app.use('views/', router);

app.listen(process.env.port || 3000);

console.log('Running at Port 3000');