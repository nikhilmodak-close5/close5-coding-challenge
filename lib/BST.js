var BST = function (compare) {

  if (!compare) {
    compare = function (x, y) {
      if (!x || !y) return 0;
      return x - y;
    }
  }

  var Node = function (key, value, parent) {
    this.key = key;
    this.values = [value];
    //this.parent = parent === undefined ? null : parent;
    this.leftChild = null;
    this.rightChild = null;
    this.min = key;
    this.max = key;
  };

    
  Node.prototype.insert = function (key, value) {
    if (key === undefined || key == null) return;
    if (this.key == null) {
      this.key = key;
      this.values = [value];
    } else if (compare(this.key, key) === 0) {
      this.values.push(value);
    } else if (compare(this.key, key) > 0) {
      if (compare(this.min, key) > 0) {
        this.min = key;
      }
      if (this.leftChild) {
        this.leftChild.insert(key, value);
      } else {
        this.leftChild = new Node(key, value, this);
      }
    } else {
      if (compare(this.max, key) < 0) {
        this.max = key;
      }
      if (this.rightChild) {
        this.rightChild.insert(key, value);
      } else {
        this.rightChild = new Node(key, value, this);
      }
    }
  };

  Node.prototype.search = function(key) {
    if (this.key == null) {
      return [];
    } else if (compare(this.key, key) === 0) {
      return this.values;
    } else if (compare(this.key, key) > 0) {
      if (this.leftChild) {
        return this.leftChild.search(key);
      } else {
        return [];
      }
    } else {
      if (this.rightChild) {
        return this.rightChild.search(key);
      } else {
        return [];
      }
    }
  }
    
  /*
  Node.prototype.remove = function(key) {
  }
  */
    
  Node.prototype.searchRange = function(results, min, max, desc) {
    if (compare(this.max, min) < 0 || compare(this.min, max) > 0) {
      return;
    }
    if (this.leftChild) {
      this.leftChild.searchRange(results, min, max, desc);
    }
    if (compare(this.key, min) >= 0 && compare(this.key, max) <= 0) {
      if (desc) {
        Array.prototype.unshift.apply(results, this.values);
      } else {
        Array.prototype.push.apply(results, this.values);
      }
    }
    if (this.rightChild) {
      this.rightChild.searchRange(results, min, max, desc);
    }    
  }
    
  var root = new Node();

  this.insert = function (key, value) {
    root.insert(key, value);
    return this;
  }

  this.search = function (key) {
    return root.search(key);
  }

  this.searchRange = function (min, max, desc) {
    var results = [];
    root.searchRange(results, min, max, desc);
    return results;
  }

  this.all = function (desc) {
    var results = [];
    root.searchRange(results, null, null, desc);
    return results;
  }
}

module.exports = BST;