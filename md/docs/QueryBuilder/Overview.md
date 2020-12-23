# The Query Builder

The `QueryBuilder` class can be used to easily generate cypher using objects. It supports all Neo4j clauses, and automatically uses a Bind Parameter for the given values.

## Creating a QueryBuilder instance

After a QueryBuilder instance is created, parameters can be added to it by using the parameter methods.
More info about them can be found in [Clauses](./Clauses)
```js
const queryBuilder = new QueryBuilder()
    .match({
        identifier: 'p1'
    })
    .return('p1');

/* --> additional parameters can be added at any point */
queryBuilder.limit(1);
```

An existing BindParam instance can be used:
```js
const myBindParam = new BindParam();
const queryBuilder = new QueryBuilder(null, { bindParam: myBindParam });
```

## Adding parameters by using an array of parameter objects

A QueryBuilder instance can be created by using an array of the `QueryBuilderParameters['ParameterI']` type (details on [Clauses](./Clauses)).

```js
const queryBuilder = new QueryBuilder(
    [
        {
            match: {
                identifier: 'p1'
            }
        }
    ],
    {
        /* --> an existing BindParam instance can be used */
        bindParam: null,
    }
);
```

Additional parameters can be added using the `addParams` method of the `QueryBuilder` instance. The parameters are the same as in the constructor.

```js
// --> create the QueryBuilder instance using some initial parameters
const queryBuilder = new QueryBuilder([
    {
        match: {
            identifier: 'p1'
        }
    }
]);

// --> add more parameters (using an array)
queryBuilder.addParams([
    {
        match: '(n)'
    }
]);

// --> add more parameters (using comma-separated objects)
queryBuilder.addParams(
    {
        limit: 2
    },
    {
        return: 'p1'
    }
);
```

## Getting the statement from a QueryBuilder instance

The cypher statement of a `QueryBuilder` instance can be taken by using the `getStatement` method.

```js
const queryBuilder = new QueryBuilder().match({
    identifier: 'p1'
});

console.log(queryBuilder.getStatement()); // MATCH (p1)
```

The `BindParam` of a `QueryBuilder` instance can be taken by using the `getBindParam` method.

```js
const queryBuilder = new QueryBuilder().match({
    identifier: 'p1',
    where: {
        id: '1'
    }
});

console.log(queryBuilder.getStatement()); // MATCH (p1 { id: $id })
const bindParam = queryBuilder.getBindParam();
console.log(bindParam.get()); // { id: '1' }
```

In case a `BindParam` instance is used on the constructor, it will be used.

```js
const existingBindParam = new BindParam({
    id: false,
});

const queryBuilder = new QueryBuilder(
    [
        {
            match: {
                identifier: 'p1',
                where: {
                    id: '1'
                }
            }
        }
    ],
    {
        bindParam: existingBindParam
    }
);

console.log(queryBuilder.getStatement()); // MATCH (p1 { id: $id__aaaa })
const bindParam = queryBuilder.getBindParam();
console.log(bindParam === existingBindParam); // true
console.log(bindParam.get()); // { id: false, id__aaaa: '1' }
```

> :ToCPrevNext