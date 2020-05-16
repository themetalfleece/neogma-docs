# Deleting Nodes

A `QueryRunner` instance can be used for deleting nodes from Objects. A label and a where parameter can be used.

```js
/* --> let 'queryRunner' be a QueryRunner instance and 'session' and already-created session */
const result = await queryRunner.delete(
    /* --> a session that's already created */
    session,
    {
        /* --> (optional) label(s) of the nodes to be matched. Multiple labels like 'User:Person' can also be used */
        label: 'User',
        /* --> (optional) the where clause for the nodes to be matched. A param object or a Where instance can be used */
        where: { // @see [Where](../Where-Parameters)
            /* --> the identifier needs to be used as a key */
            u: {
                id: {
                    $in: ['1', '2']
                }
            }
        },
        /* --> (optional) the identifier of the nodes for the query. Is needed for parsing the results. Default is the value of 'QueryRunner.identifiers.default' */
        identifier: 'u',
        /* --> (optional) adds the DETACH keyword to the delete statement, also deleting the relationships of the node(s) */
        detach: true,
    }
);

/* --> the result is the QueryResult from the neo4j driver */
console.log(result.summary.counters.updates().nodesDeleted);
```

> :ToCPrevNext