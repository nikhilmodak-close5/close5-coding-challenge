/**
 * LocationIndexService.js
 *
 * @description Service to index listings based on locations and performe range search
 */

var tree = require('../../utils/rbush')(16, undefined, '.tmp/locationIndex.json');
var merc = require('../../utils/mercatorProjection.js');

module.exports = {
  
  /**
   * @description Inserts location in the rtree
   */
  insert: function (id, loc) {
    var item = [
      merc.x(loc[0]),
      merc.y(loc[1]),
      merc.x(loc[0]), 
      merc.y(loc[1]),
      id
    ];
    tree.insert(item);
  },

  /**
   * @description Removes location in the rtree
   */
  remove: function (id, loc) {
    var item = [
      merc.x(loc[0]),
      merc.y(loc[1]),
      merc.x(loc[0]), 
      merc.y(loc[1]),
      id
    ];
    tree.remove(item);
  },

  /**
   * @description Search items for given location and range
   */
  searchRange: function (loc, range) {
    var loc;
    if (_.isArray(loc)) {
      loc = [merc.x(Number(loc[0])), merc.y(Number(loc[1]))];
    } else if (_.isString(loc) && loc.indexOf(',') > -1) {
      loc = loc.split(',');
      loc = [merc.x(Number(loc[0])), merc.y(Number(loc[1]))];
    }
    var range = Number(range);
    return tree.searchRange(loc, range).map(function (result) {
      return result[4];
    });
  }
}