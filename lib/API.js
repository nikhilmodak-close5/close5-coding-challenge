var _ = require('lodash');
var SortedArray = require('./SortedArray');
var RBush = require('./Rbush');
var BST = require('./BST');
var merc = require('./MercatorProjection');

/* Using key value pairs for accessing items with id in O(1) */
var primaryKeyIndex = new Object();

/* Using a sorted array to store the created time.
 * Motivation behind this is, inserts should be done in O(1) almost all the time.
 * A new date will be added at the end of the array, since it will be greater than created 
 * date of previous item.
 * Using binary search for lookup, but this could be optimized by adding a weight to the pivot
 * to find recent items faster. 
 */
var createdAtIndex = new SortedArray();

/* Using binary search tree to store the prices, assuming the prices of items entered 
 * will be random and evenly distributed.
 * Average case complexity will be O(n) for insert and search
 */
var priceIndex = new BST();

/* Using RTree algorithm from https://github.com/mourner/rbush
 * The algorithm worked only for rectangles, where as we needed range search from a location
 * i.e. we needed to search circles.
 * Added the necessary functionality.
 */
var locationIndex = new RBush(16);

/* Using key values pairs for accessing items with userId in O(1) */
var userIndex = new Object();


/* Callbacks for sort */
var Sorts = {
  'createdAt': function () {
    return createdAtIndex.all();
  },
  'createdAt asc': function () {
    return createdAtIndex.all();
  },
  'createdAt desc': function () {
    return createdAtIndex.all(true);
  },
  'price': function () {
    return priceIndex.all();
  },
  'price asc': function () {
    return priceIndex.all();
  },
  'price desc': function () {
    return priceIndex.all(true);
  }
};

/* Callbacks for filters */
var Filters = {
  'loc': function (options) {
    var loc = options.loc;
    var range = options.range;
    if (!loc || !range) {
      return [];
    }
    if (_.isArray(loc)) {
      loc = [merc.x(Number(loc[0])), merc.y(Number(loc[1]))];
    } else if (_.isString(loc) && loc.indexOf(',') > -1) {
      loc = loc.split(',');
      loc = [merc.x(Number(loc[0])), merc.y(Number(loc[1]))];
    }
    var range = Number(range);
    return locationIndex.searchRange(loc, range).map(function (result) {
      return result[4];
    });
  },
  'userId': function (options) {
    var userIds = _.isArray(options.userId) ? options.userId : options.userId.split(',');
    var ids = [];
    userIds.forEach(function (userId) {
      Array.prototype.push.apply(ids, userIndex[userId]);
    });
    return ids;
  },
  'id': function (options) {
    return _.isArray(options.id) ? options.id : options.id.split(',');
  }
}

/* Read listings from the file and populate the indexes */
require('../data/listings').forEach(function (record) {
  var id = record.id;
  var loc = record.loc;
  var userId = record.userId;
  var price = record.price;
  var createdAt = new Date(record.createdAt).getTime();

  primaryKeyIndex[id] = record;
  createdAtIndex.insert(createdAt, id);
  priceIndex.insert(price, id);
  locationIndex.insertPoint(merc.x(loc[0]), merc.y(loc[1]), id);
  if (userIndex[userId]) {
    userIndex[userId].push(id);
  } else {
    userIndex[userId] = [id];
  }
});

module.exports = {

  /* @parameter options: query parameters
   * @parameter cb: callback to pass results and/or error
   */
  select: function (options, cb) {
    try {
      var ids;
      
      // process sort first
      if (options.sort && Sorts[options.sort]) {
        ids = Sorts[options.sort]();
      }

      Object.getOwnPropertyNames(options).forEach(function (option) {
        
        // process all filters
        if (Filters[option] && option !== 'sort') {
          var ids2 = Filters[option](options);
          
          if (ids) {
            // if ids is already created then use intersection of ids and ids2
            ids = ids.filter(function (id) {
              return ids2.indexOf(id) > -1;
            });
          } else {
            ids = ids2;
          }
        }
      });

      // if no options passed return empty array
      var results = (ids ? ids : []).map(function (id) {
        return primaryKeyIndex[id];
      }).filter(function (item) {
        return item != null;
      });
      cb(null, results);
    } catch(err) {
      console.log(err.stack);
      cb(err, {});
    }
  }
};