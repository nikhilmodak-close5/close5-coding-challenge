var SortedArray = function (compare) {

  if (!compare) {
    compare = function (x, y) {
      if (!x || !y) return 0;
      return x - y;
    }
  }

  var array = [];

  function locationOf(key, start, end) {
    if (array.length === 0) {
      return -1;
    }

    var start = start || 0;
    var end = end || array.length - 1;

    //check boundaries before calculating pivot for faster reterival
    if (compare(key, array[start].key) === 0) {
      return start;
    } else if (compare(key, array[end].key) >= 0) {
      return end;
    } else if (compare(key, array[start].key) < 0) {
      return start - 1;
    }

    var pivot = parseInt(start + (end - start) / 2, 10);

    if (end - start <= 1 || compare(array[pivot].key, key) === 0) {
      return pivot;
    } else if (compare(array[pivot].key, key) < 0) {
      return locationOf(key, pivot, end);
    } else {
      return locationOf(key, start, pivot);
    }
  }

  return {
    insert: function(key, value) {
      if (array.length == 0) {
        array.push({
          key: key,
          values: [value]
        });
        return this;
      }
      var loc = locationOf(key);
      if (loc >= 0) {
        var item = array[loc];
        if (compare(item.key, key) === 0) {
          item.values.push(value);
          return this;
        }
      }
      array.splice(loc + 1, 0, {
        key: key,
        values: [value]
      });
      return this;
    },
    search: function (key) {
      if (array.length == 0) {
        return [];
      }
      var loc = locationOf(key);
      var item = array[loc];
      if (compare(item.key, key) === 0) {
        return item.values;
      } else {
        return [];
      }
    },
    searchRange: function (min, max, desc) {
      if (array.length == 0) {
        return [];
      }
      var locMin = locationOf(min);
      var locMax = locationOf(max, locMin, array.length - 1);

      if (compare(array[locMin].key, min) < 0) {
        locMin = locMin + 1;
      }

      var results = [];
      array.slice(locMin, locMax + 1).forEach(function (item) {
        if (desc) {
          Array.prototype.unshift.apply(results, item.values);
        } else {
          Array.prototype.push.apply(results, item.values);
        }
      });
      return results;
    },
    all: function (desc) {
      var results = [];
      array.forEach(function (item) {
        if (desc) {
          Array.prototype.unshift.apply(results, item.values);
        } else {
          Array.prototype.push.apply(results, item.values);
        }
      });
      return results;
    }
  };
}

module.exports = SortedArray;
