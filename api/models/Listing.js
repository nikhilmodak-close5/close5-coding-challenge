/**
 * Listing.js
 *
 * @description Listing for close5
 */

module.exports = {

  attributes: {
    id: {
      type: 'string',
      primaryKey: true,
      required: true
    },
    loc: {
      type: 'array',
      isPoint: true,
      required: true
    },
    userId: {
      type: 'string',
      required: true
    },
    description: {
      type: 'text'
    },
    price: {
      type: 'integer',
      required: true,
      defaultsTo: -1
    },
    status: {
      type: 'string',
      enum: ['removed', 'tos'],
      required: true
    },
    createdAt: {
      type: 'datetime',
      required: true
    }
  },

  types: {
    isPoint: function(value){
      return _.isArray(value) && value.length == 2 &&
      _.isNumber(value[0]) && _.isNumber(value[1]) &&
      value[0] !== Infinity && value[0] !== -Infinity &&
      value[1] !== Infinity && value[1] !== -Infinity;
    }
  },

  afterCreate: function (record, cb) {
    LocationIndexService.insert(record.id, record.loc);
    cb();
  },

  afterDestroy: function (values, cb) {
    LocationIndexService.remove(record.id, record.loc);
    cb();
  },

  findWithRange: function(opts, cb) {
    if (opts && opts.loc && opts.range) {
      
      var newOpts = _.cloneDeep(opts);
      
      // Create new set of options using ids reterived, that satisfy the supplied range.
      newOpts.id = LocationIndexService.searchRange(opts.loc, opts.range);
      delete(newOpts.loc);
      delete(newOpts.range);

      this.find(newOpts).exec(cb);
    } else {
      this.find(opts).exec(cb);
    }
  }
};

