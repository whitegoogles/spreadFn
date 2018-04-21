# Spread
I got tired of having to upgrade node or write polyfills on random CI servers/docker images because node < `v8.2.1` didn't have object rest/spread properties. I also didn't want to have to install a transpiler just so I could use simple spread syntax. This is a generic polyfill that covers the array/object spread use cases with a function instead of the `...` operator.
# Installation
`npm install --save spread-function`
# Usage
```javascript
const spread = require('spread-function');

spread([1,2],[3,4],5,6); //equivalent to [...[1,2],...[3,4],5,6]
spread({a:"b"},{c:"d"}); //equivalent to {...{a:"b"},...{c:"d"}}
```
### Edge Cases
Spread as a function innately allows for incorrect syntax sometimes:
```javascript
spread({a:"b"},1); //equivalent to {...{a:"b"},...1}
```
To handle these edge cases, `spread` will perform an `object spread` only if the first argument is an object, and it will throw an exception if all the other arguments are not also objects.

In all other cases, it will perform an `array spread`.
# Examples
```javascript
spread() === undefined
spread([]) === []
spread({}) === {}
spread([1,2,3],[4,5,6],7,8,9) === [1,2,3,4,5,6,7,8,9]
spread({"a":"b"},{"c":"d"}) === {"a":"b","c":"d"}
spread(1,2,[3,4],{"josh":"test"}) === [1,2,3,4,{"josh":"test"}]
spread([1,2],[3,4],["josh","asdf"]) === [1,2,3,4,"josh","asdf"]
spread(1,2,3,"josh",5,9.45) === [1,2,3,"josh",5,9.45]
spread({"xd":"xdddd"},{"a":1,"b":45}) === {"xd":"xdddd","a":1,"b":45}
spread({"a":"32"},1,2) === new Error("Can't spread mixed types into an object. Either use all objects or make the first argument not an object")
spread({"a":32},[1,2]) === new Error("Can't spread mixed types into an object. Either use all objects or make the first argument not an object")
```
