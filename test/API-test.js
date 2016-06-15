var api = require('../lib/API');
var fs = require('fs');

var tests = 0, passed = 0;;

function test (testing, options, expectedFile) {
  var expectedString = JSON.stringify(require('./results/' + expectedFile));
  api.select(options, function (err, results) {
    var resultString = JSON.stringify(results);
    if (resultString === expectedString) {
      console.log(testing + ' - ' + ' PASSED!\n');
      passed++;
    } else {
      console.log(testing + ' - ' + ' FAILED! ');
      console.log('Expected: ' + expectedString);
      console.log('Actual: ' + resultString + '\n');
    }
    tests++;
  });
}

test('Testing sort by createdAt', { sort: 'createdAt'}, 'createdAtAsc');
test('Testing sort by createdAt asc', { sort: 'createdAt asc'}, 'createdAtAsc');
test('Testing sort by createdAt desc', { sort: 'createdAt desc'}, 'createdAtDesc');
test('Testing sort by price', { sort: 'price'}, 'priceAsc');
test('Testing sort by price asc', { sort: 'price asc'}, 'priceAsc');
test('Testing sort by price desc', { sort: 'price desc'}, 'priceDesc');
test('Testing filter by id', { id: '53fbb9b6456e74467b000004'}, 'id');
test('Testing filter by invalid id', { id: '111notFound1111111111111'}, 'idNotFound');
test('Testing filter by userId', { userId: '53f6c9c96d1944af0b00000b'}, 'userId');
test('Testing filter by invalid userId', { userId: '111notFound1111111111111'}, 'userIdNotFound');
test('Testing multiple options', { 
  loc: [36.1665407118837763, -115.1408087193642729],
  range: 50}, 'loc');
test(
  'Testing multiple sort and search', 
  {
    sort: 'createdAt desc',
    userId: '53f6c9c96d1944af0b00000b',
    loc: [ 
      36.1665407118837763, 
      -115.1408087193642729
    ],
    range: 50
  },
  'multipleOptions'
);
console.log(passed + ' of ' + tests + ' tests passed');
if (passed != tests) process.exit(1);

