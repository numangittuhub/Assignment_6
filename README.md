1) Difference between var, let, and const
 var is function-scoped, can be re-declared, and is hoisted with undefined.

 let is block-scoped, cannot be re-declared in the same scope, and is hoisted but not initialized.

const is block-scoped like let, but once assigned, the value cannot be changed.


2) Difference between map(), forEach(), and filter()
map() creates a new array by transforming each element.

forEach() just loops through elements to perform side effects like logging, but doesn’t return a new array.

filter() creates a new array with only the elements that pass a condition.

4) Destructuring assignment in ES6
This allows you to pull values out of arrays or objects into variables directly.

5) Template literals in ES6
Template literals use backticks instead of quotes. They allow variable interpolation with ${}, support multi-line strings, and are cleaner than string concatenation.