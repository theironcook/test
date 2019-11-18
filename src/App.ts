import express = require('express');
import * as parser from 'body-parser';

import * as mongoose from 'mongoose';
import { personRouter } from './routes/PersonRouter';
import { handleErrors } from './utils/ErrorMiddleware';
import { handleBuildResponseWrapper, handleResponse, handleStartTimer } from './utils/ResponseMiddleware';
const app = express();


//mongoose.connect('mongodb://localhost:27017/local', { useNewUrlParser: true });
mongoose.connect('mongodb://dbusr:D5JkSr4KkD@ds233228.mlab.com:33228/heroku_zlhlm2nm', { useNewUrlParser: true });


// generate fake data
//import { generateFakeData } from './utils/FakeData';
//import {PersonModel} from './domain/Person';
//generateFakeData(PersonModel);

console.warn(`Started ${__dirname}`, new Date());
//app.use(express.static(path.join(__dirname, 'public'), {etag: false}));
app.use(express.static(`${__dirname}/public`));

// Middleware layers - order is important here67
// No need for clients to cache responses
app.use(parser.json({ limit: 10 * 1024 * 1024 }));
app.disable('etag');

// How to generate pub / private pem files
// openssl genrsa -des3 -out private.pem 512
// rsa -in private.pem -outform PEM -pubout -out public.pem

app.post('/account/weblogin', (req: any, resp: any, next: any) => {
  console.log('fashizzlze');
  resp.send('cool');
});

const emailRegex = /^\w{3,}([\.-]?\w+)*@\w{3,}([\.-]?\w+)*(\.\w{2,3})+$/;

const isValidPassword = function(password: string): boolean{
  const hasNumber = /\d+/;
  const hasUppercase = /[A-Z]+/;
  return password.length >= 6 && hasNumber.test(password) && hasUppercase.test(password);
}

app.post('/account/create', (req: any, resp: any, next: any) => {
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password){
    resp.status(400).send('The email and password must both be specified');
  }
  else {
    if( ! isValidPassword(password)){ // todo - stricter password constraints
      resp.status(400).send('The password should be at least 6 letters long, have at least 1 number and at least 1 upper case letter.')
    }
    else if( ! emailRegex.test(email)){
      resp.status(400).send('The email does not look like a valid email address.')
    }
    else {
      // todo - check for the email address is already in the db
      

      resp.send('created the account');
    }
  }
  
});

// todo - /login/apilogin - basically same but shows the jwt explicitly  


// handle JWT security here - just fake it for now
app.use((req: any, resp: any, next: any) => {
  req.orgId = '123'; // use this as a fake org id for now in local dev
  next();
})


/*
  // create new jobDef (can include tasks, steps)
  PUT jobDef/123

  // create a new taskDef
  POST jobDef/123/taskDef

  // update taskDef
  PUT jobDef/123/taskDef/456

  // create a new stepDef
  POST jobDef/123/taskDef/456/stepDef

  // update stepDef
  PUT jobDef/123/taskDef/456/stepDef/789
  

*/

app.use(handleBuildResponseWrapper);
app.use(handleStartTimer);

// Set up all api routes here
app.use('/person', personRouter);

app.use(handleErrors); 
app.use(handleResponse);

const port = 3002;
app.listen(port, () => console.log(`Example api listening on port ${port}!`));