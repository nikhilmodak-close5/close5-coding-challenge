module.exports = function dummyDataHook(sails) {
  return {
    initialize: function (cb) {
      sails.on('hook:orm:loaded', function () {
        if (sails.config.dummyData) {
          Listing.find().exec(function (err, records) {
            if (records.length === 0) {
              Listing.create(require('./dummy-listings')).exec(cb);
            } else {
              cb();
            }
          });
        } else {
          cb();
        }
      });
    }
  }
}