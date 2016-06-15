// Reference: http://wiki.openstreetmap.org/wiki/Mercator

var R_MAJOR = 3963.190592;
var R_MINOR = 3949.902764;

function deg_rad(ang) {
  return ang * (Math.PI/180.0)
}

function merc_x(lon) {
  return R_MAJOR * deg_rad(lon);
}

function merc_y(lat) {
  if (lat > 89.5) {
    lat = 89.5;
  }
  if (lat < -89.5) {
    lat = -89.5;
  }
  var temp = R_MINOR / R_MAJOR;
  var es = 1.0 - (temp * temp);
  var eccent = Math.sqrt(es);
  var phi = deg_rad(lat);
  var sinphi = Math.sin(phi);
  var con = eccent * sinphi;
  var com = .5 * eccent;
  con = Math.pow((1.0 - con) / (1.0 + con), com);
  var ts = Math.tan(0.5 * (Math.PI * 0.5 - phi)) / con;
  var y = 0 - R_MAJOR * Math.log(ts);
  return y;
}

module.exports = {
  x: merc_x,
  y: merc_y
};