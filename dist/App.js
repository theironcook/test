"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const mongoose = require("mongoose");
const PersonRouter_1 = require("./routes/PersonRouter");
const ErrorMiddleware_1 = require("./utils/ErrorMiddleware");
const ResponseMiddleware_1 = require("./utils/ResponseMiddleware");
// import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose';
// import { FilterOperator, createQuery, createCountQuery } from './utils/BulkGet';
// import { convertResponse } from './utils/ResponseConverters';
// import { PersonSchema, PersonModel } from './domain/Person';
const app = express();
const port = 3000;
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
mongoose.connect('mongodb://localhost:27017/local', { useNewUrlParser: true });
// No need for clients to cache responses
app.disable('etag');
app.use(ResponseMiddleware_1.handleBuildResponseWrapper);
app.use(ResponseMiddleware_1.handleStartTimer);
// Set up all routes here
app.get('/', (req, res) => res.send('Hello cool World!'));
app.use('/person', PersonRouter_1.personRouter);
app.use(ErrorMiddleware_1.handleErrors);
app.use(ResponseMiddleware_1.handleResponse);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
