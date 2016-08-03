Redis Driver
=============================

Utility module that provides an easy way to store and retreive data from redis. when creating and instance it binds to and specific key using it to retreive and storage values. When using its static version it is posible to get multiple values from redis.

### Test
```sh
$ npm test
```

### Usage

**Basic:**
```javascript
var RedisDriver = requrie('redis-driver');
var driver = new RedisDriver('some-name', {
  prefix: '',
  redis: {
    port: ,
    host: '',
    auth: '',
  },
});
```
**Set value:**
```javascript
driver.set('foo bar', 30); //value, expired time in seconds.

var obj = {
	country: 'USA',
	name: 'Foo bar'
};

//sending an object as value.
driver.set(obj, 30);
```
**Get value:**
```javascript
driver.get(function (err, value, isObj) {
	console.log(err, value, isObj);
}) 
```
**Get multiple:**
```javascript
var arrayOfKeys = ['foo', 'bar']
RedisDriver.getMultiple(arrayOfKeys, function (err, results) {
	results.forEach(function(result) {
		console.log(); //{name: 'foo', value: 'value'};
	});
});
```
