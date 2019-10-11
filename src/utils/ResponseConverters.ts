import * as _ from 'lodash';

const convertAliases = function(schemaClass, data){
  const convertedData = data.toObject();
  if(schemaClass.propAliases){
    for(let dataKey of Object.keys(convertedData)){
      if(schemaClass.propAliases[dataKey]){
        const value = convertedData[dataKey];
        delete convertedData[dataKey];
        convertedData[schemaClass.propAliases[dataKey]] = value;
      }
    }
  }

  return convertedData;
};


// call after converting aliases
const convertValues = function(schemaClass, data){
  if(schemaClass.dataConverters && schemaClass.dataConverters.fromDB){
    for(let dataKey of Object.keys(data)){      
      if(schemaClass.dataConverters.fromDB[dataKey]){
        data[dataKey] = schemaClass.dataConverters.fromDB[dataKey](data);
      }
    }
  }
};


export const convertData = function(schemaClass, data){
  // convert prop name aliases at the root domain level
  let convertedData;

  if(_.isArray(data)){ 
    convertedData = [];
    for(let item of data){
      const converted = convertAliases(schemaClass, item);
      convertValues(schemaClass, converted);
      convertedData.push(converted);
    }
  }
  else {
    convertedData = convertAliases(schemaClass, data);
    convertValues(schemaClass, convertedData);
  }  

  return convertedData;
};