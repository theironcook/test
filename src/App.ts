import express = require('express');
import * as parser from 'body-parser';

import * as mongoose from 'mongoose';
import { personRouter } from './routes/PersonRouter';
import { handleErrors } from './utils/ErrorMiddleware';
import { handleBuildResponseWrapper, handleResponse, handleStartTimer } from './utils/ResponseMiddleware';
const app = express();


mongoose.connect('mongodb://localhost:27017/local', { useNewUrlParser: true });
//mongoose.connect('mongodb://dbusr:D5JkSr4KkD@ds233228.mlab.com:33228/heroku_zlhlm2nm', { useNewUrlParser: true });

// generate fake data
//generateFakeData(PersonModel);


// Middleware layers - order is important here
// No need for clients to cache responses
app.use(parser.json({ limit: 10 * 1024 * 1024 }));
app.disable('etag');

// handle JWT security here - just fake it for now
app.use((req: any, resp: any, next: any) => {
  req.orgId = '123'; // use this as a fake org id for now in local dev
  next();
})

app.use(handleBuildResponseWrapper);
app.use(handleStartTimer);

// Set up all api routes here
app.use('/person', personRouter);

app.use(handleErrors); 
app.use(handleResponse);

const port = 3002;
app.listen(port, () => console.log(`Example api listening on port ${port}!`));