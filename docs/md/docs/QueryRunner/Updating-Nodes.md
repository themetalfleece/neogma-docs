# Updating Nodes

A `QueryRunner` instance can be used for editing nodes from Objects. The node properties to update, a label, and a where param are needed.

```js
/* --> let 'queryRunner' be a QueryRunner instance and 'session' and already-created session */
await queryRunner.update(
    /* --> a session that's created */
    session,
    {
        /* --> label(s) of the created nodes. Multiple labels like 'User:Person' can also be used */
        label: 'User',
        /* --> the matched nodes will be updated with the following values */
        data: {
            name: 'Alex',
            age: 30,
        },
        /* --> (optional) the where clause for the nodes to be matched */
        where: {
            id: {
                $in: ['1', '2']
            }
        },
        /* --> (optional) the identifier of the nodes for the query. Is needed for parsing the results. Default is the value of 'QueryRunner.defaultIdentifier' */
        identifier: 'u',
        /* --> (optional) whether to return the nodes */
        return: true
    }
);

/* --> the result is the QueryResult from the neo4j driver */
console.log(result.records.map((v) => v.get('u').properties));
```

> :ToCPrevNext