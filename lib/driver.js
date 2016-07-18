const redis = require('redis');
const EventEmitter = require('events');
const util = require('util');

/**
 * Redis driver constructor
 * @param {String} name of the key.
 */
function RedisDriver(name, options) {
  var _this = this;
  _this.name = name || '';
  _this.client = redis.createClient(options);
  EventEmitter.call(this);
  _this.client.on('error', (err) => _this.emit('error', err))
}

util.inherits(RedisDriver, EventEmitter);

/**
 * Sets the value of the instance key.
 * @param {String} value can also be an object.
 */
RedisDriver.prototype.set = function (value) {
  if (typeof value === 'object')
    value = JSON.stringify(value);

  this.client.set(this.name, value);
};

/**
 * Gets the value of the current instance.
 * @param  {Function} callback the result with the possible error.
 */
RedisDriver.prototype.get = function (callback) {
  this.client.get(this.name, function (err, result) {
    var isObj = false;
    if (err) return callback(err);

    try {
      result = JSON.parse(result);
      isObj = true;
    } catch (e) {
      result = result;
    }

    callback(null, result, isObj);
  });
};

/**
 * If the target is an object sets a new key.
 * @param {String}   key      the name of the field.
 * @param {Object}   value    value of the field
 * @param {Function} callback result function.
 */
RedisDriver.prototype.addKeyToObject = function (key, value, callback) {
  var _this = this;
  _this.get((err, result, isObj) => {
    if (err) return callback(err);
    if (!isObj || !result) return callback('The value should be an object.');
    result[key] = value;
    _this.set(result);
    if (callback) callback(null, result);
  });
};

/**
 * If the target is an object it returns the value of the specified key.
 * @param  {String}   key      name of the field.
 * @param  {Function} callback result function.
 */
RedisDriver.prototype.getValueFromKey = function (key, callback) {
  this.get((err, result, isObj) => {
    if (err) return callback(err);
    if (!isObj || !result) return callback('The value should be an object.');

    callback(null, result[key]);
  });
};

/**
 * Gets the values for the given keys.
 * @param  {Array}   keys     array of strings.
 * @param  {Function} callback the result with the possible error.
 */
RedisDriver.getMultiple = function (keys, callback) {
  this.client.mget(keys, function (err, results) {
    if (err) return callback(err);

    var result = keys.map(function (key, index) {
      var value = results[index] ? results[index].toString() : null;
      try {
        value = JSON.parse(value);
      } catch (e) {}

      return {
        name: key,
        value: value,
      };
    });

    callback(null, result);
  });
};

/**
 * Binds the kill function to the drivers quit one.
 */
RedisDriver.prototype.kill = () => this.client.quit;

module.exports = RedisDriver;
