import express = require('express');

import * as mongoose from 'mongoose';
import { personRouter } from './routes/PersonRouter';
import { handleErrors } from './utils/ErrorMiddleware';
import { handleBuildResponseWrapper, handleResponse, handleStartTimer } from './utils/ResponseMiddleware';

import { PersonModel } from './domain/Person';
import { generateFakeData } from './utils/FakeData'

// import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose';
// import { FilterOperator, createQuery, createCountQuery } from './utils/BulkGet';
// import { convertResponse } from './utils/ResponseConverters';
// import { PersonSchema, PersonModel } from './domain/Person';


const app = express();


// test typegoose basic connection
// (async () => {
//   await mongoose.connect('mongodb://localhost:27017/local', { useNewUrlParser: true });
  
//   const filter = 'dog.name~=Spot';
//   //const filter = 'dog.name->["Fido", "Spot"]';
//   //const filter = 'id==5d9cbb9b031d809634220a5f';
//   //const filter = 'id->["5d9cbb9b031d809634220a5f"]';
//   //const filter = 'firstName~=john';
//   const responseFields = 'age firstName dog.name';
//   let lastId = null;
//   let hasMore = true;

//   // How to do pagination on a filter with response fields
//   while(hasMore){
//     const possibleCount = await createCountQuery(PersonSchema, PersonModel, {filter, lastId}).countDocuments().exec();
//     console.log(`{meta: {resultsCount: ${possibleCount}}}`);
//     let data =  await createQuery(PersonSchema, PersonModel, {filter, lastId, responseFields}).exec();
//     console.log('data\n', convertResponse(PersonSchema, data));

//     lastId = data[data.length - 1]._id;
//     hasMore = data.length < possibleCount; 
//   }
// })();


//mongoose.connect('mongodb://localhost:27017/local', { useNewUrlParser: true });
mongoose.connect('mongodb://dbusr:D5JkSr4KkD@ds233228.mlab.com:33228/heroku_zlhlm2nm', { useNewUrlParser: true });

// generate fake data
//generateFakeData(PersonModel);


// No need for clients to cache responses
app.disable('etag');
app.use(handleBuildResponseWrapper);

app.use(handleStartTimer);
// Set up all routes here
app.get('/', (req, res) => res.send('Hello cool World!'));
app.use('/person', personRouter);

app.use(handleErrors); 
app.use(handleResponse);

const port = 3000;
app.listen(port, () => console.log(`Example api listening on port ${port}!`));