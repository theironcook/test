// Generate test data
const randVal = function(vals){
  return vals[Math.floor(Math.random() * vals.length)];
};

const randVals = function(vals){
  const rand = [];
  for(let val of vals){
    if(Math.random() > .5){
      rand.push(val);
    }
  }
  return rand;
};

const randNum = function(){
  return randVal([0,1,2,3,4,5,6,7,8,9]);
};

const randPhone = function(){
  let phone = '';
  for(let i = 0; i < 10; i++){
    phone += randNum();
    if(i == 2 || i == 5){
      phone += ' ';
    }
  }
  return phone;
};

const randDate = function(){
  return `${randVal([1,2,3,4,5,6,7,8,9,10,11,12])}/${randVal([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])}/${randVal(years)}`;
};

const ages = [];
for(let i = 9; i < 76; i++){ages.push(i)};
const guitarNames = ['Strat', 'Ibanez', 'Tele', 'Gibson'];
const years = [];
for(let i = 1972; i < 2014; i++){years.push(i)};
const locations = ['California', 'Memphis', 'Houston', 'Lehi', 'Cedar Hills'];


//Generate some random data
export const generateFakeData = function(modelClass){
  for(let i = 0; i < 200; i++){
    modelClass.create({ firstName: `John ${i}`, 
                          lastName: `Doe ${i}`, 
                          age: randVal(ages), 
                          phone: randPhone(),
                          dob: randDate(),
                          dog: {
                            name: `Spot ${i}`,
                            smell: randVal(['great', 'good', 'bad'])
                          },
                          guitars: [{name: randVal(guitarNames), year: randVal(years), locations: randVals(locations)}] });
  }
};