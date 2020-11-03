# Set
`QueryBuilderParameters['SetI']`

## Set by using a literal string
A literal string will be used as is.

```js
const queryBuilder = new QueryBuilder([
    {
        /* --> literal string to use */
        set: 'a.id = 5',
    },
]);

console.log(queryBuilder.getStatement()); // SET a.id = 5
console.log(queryBuilder.getBindParam().get()); // {}
```

## Set by using an object
A SET statement can be generated using an object with an identifier and properties.

```js
const queryBuilder = new QueryBuilder([
    {
        /* --> literal string to use */
        set: {
            /* --> identifier whose properties will be set */
            identifier: 'n',
            /* --> properties to set */
            properties: {
                name: 'John',
                age: 28,
            },
        },
    },
]);

console.log(queryBuilder.getStatement()); // SET n.name = $name AND n.age = $age
console.log(queryBuilder.getBindParam().get()); // { name: 'John', age: 28 }
```
