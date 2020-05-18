# Running Arbitrary Queries

A `QueryRunner` instance can be used to run arbitrary/raw queries, by using the neo4j driver of the given session.

```js
/* --> let 'queryRunner' be a QueryRunner instance and 'session' and already-created session */
const result = await queryRunner.run(
    /* --> a session that's already created */
    session, 
    /* --> albitrary Cypher */
    `MATCH (u:Users) WHERE u.id = $id RETURN u`,
    /* --> bind parameter for the statement */
    {
        id: '1'
    }
);

/* --> the result is the QueryResult from the neo4j driver */
console.log(result.records.map((v) => v.get('u').properties));
```

> :ToCPrevNext