# Helpers

The `QueryRunner` class also provides some helpers for custom Cypher queries.

## Building and running a QueryBuilder

Suppose we want to create a [QueryBuilder](../QueryBuilder/Overview) instance just to run it.

One way to do it is by creating the instance, then calling `queryRunner.run()` with its statement and bindParam.

The `buildAndRun` method of a `QueryRunner` instance can be used, to run the queryBuilder straight away.

```js
const queryBuilder = new QueryBuilder([
    {
        match: '(n)'
    }
]);

// --> let queryRunner be a QueryRunner instance
await queryRunner.run(
    queryBuilder.getStatement(),
    queryBuilder.getBindParam().get()
);

/* --> this is equivalent */
await queryRunner.buildAndRun(queryBuilder);
```

Moreover, the `buildAndRun` method can be used to run a query straight away, without having to create a QueryBuilder instance. The example above is equivalent to this:

```js
await queryRunner.buildAndRun([
    {
        match: '(n)'
    }
]);
```

In case we want to use an existing `BindParam` instance of Session/Transaction:

```js
const existingBindParam = new BindParam({
    x: 1
});

await queryRunner.buildAndRun(
    [
        {
            match: {
                identifier: 'n',
                where: {
                    x: '20'
                }
            }
        }
    ],
    {
        /* --> using an existing BindParam instance */
        bindParam: existingBindParam,
        /* --> using an existing Session or Transaction */
        session: null,
    }
);

console.log(bindParam.get()); // { x: 1, x__aaaa: '20' }
```

## Getting the properties from a QueryResult
The properties of nodes can be easily fetched
```js
const queryResult = await queryRunner.run(
    `MATCH (n:User {id: $id}) RETURN n`,
    { id: 1 },
);

/* --> get the properties of the node with the alias 'n' */
const properties = QueryRunner.getResultProperties(queryResult, 'n');
console.log(properties[0].id); // 1
```

## Getting how many nodes where deleted, from a QueryResult
```js
const res = await queryRunner.delete({
    where: {
        name: 'John'
    },
});

const nodesDeleted = QueryRunner.getNodesDeleted(res);
console.log(nodesDeleted); // 5
```

## Default QueryRunner identifiers
`QueryRunner` exposes the default identifiers which are used in the queries.

```js
/* --> general purpose default identifier */
console.log(QueryRunner.identifiers.default);
/* --> default identifiers for createRelationship */
console.log(QueryRunner.createRelationship);
/* default identifier for the source node */
console.log(QueryRunner.createRelationship.source);
/* default identifier for the target node */
console.log(QueryRunner.createRelationship.target);
```

> :ToCPrevNext