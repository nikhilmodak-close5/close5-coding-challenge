/**
 * ListingController
 *
 * @description :: Server-side logic for managing listings
 */

module.exports = {

  /**
   * @description Override default find action to call Listing.findWithRange
   */
  find: function (req, resp) {
    Listing.findWithRange(req.query, function (err, results) {
      if (err) {
        resp.status(500).send('Something broke!');
      } else {
        resp.json(results);
      }
    });
  }
};
