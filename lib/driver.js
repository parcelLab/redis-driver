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

  client.set(this.name, value);
};

/**
 * Gets the value of the current instance.
 * @param  {Function} callback the result with the possible error.
 */
RedisDriver.prototype.get = function (callback) {
  client.get(this.name, function (err, result) {
    if (err) return callback(err);

    try {
      result = JSON.parse(result);
    } catch (e) {
      result = result;
    }

    callback(null, result);
  });
};

/**
 * Gets the values for the given keys.
 * @param  {Array}   keys     array of strings.
 * @param  {Function} callback the result with the possible error.
 */
RedisDriver.getMultiple = function (keys, callback) {
  client.mget(keys, function (err, results) {
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
RedisDriver.prototype.kill = client.quit;

module.exports = RedisDriver;
