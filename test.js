const { Rating } = require('./index');
const Rates = new Rating();

const testRate = Rates.test();
console.log(testRate);