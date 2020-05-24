# Helpers

The `QueryRunner` class also provides some helpers for custom Cypher queries.

## Getting normalized labels
`QueryRunner.getNormalizedLabels` returns a single string to be used in a query.
```js
const { getNormalizedLabels } = QueryRunner;

console.log(getNormalizedLabels('Users')); // `Users`

console.log(getNormalizedLabels('Important Users')); // "`Important Users`"

console.log(getNormalizedLabels(['Users', 'Active'])); // "`Users:Active`"

console.log(getNormalizedLabels(['Users', 'Active'], 'or')); // "`Users|Active`"

console.log(getNormalizedLabels(['Users', 'Active', 'Old'])); // "`Users:Active:Old`"
```

## Getting an identifier with a label
`QueryRunner.getIdentifierWithLabel` returns a string to be used in a query, regardless if any of the identifier or label are null
```js
const { getIdentifierWithLabel } = QueryRunner;

console.log(getIdentifierWithLabel('MyIdentifier', 'MyLabel')); // "MyIdentifier:MyLabel"

console.log(getIdentifierWithLabel('MyIdentifier', 'MyLabel')); // "MyIdentifier"

console.log(getIdentifierWithLabel('MyIdentifier', 'MyLabel')); // ":MyLabel"
```

## Getting a relationship direction with its name
`QueryRunner.getRelationshipDirectionAndName` returns a string for a relationship direction and name, to be used in a query.
```js
const { getRelationshipDirectionAndName } = QueryRunner;

console.log(getRelationshipDirectionAndName({
    direction: 'out',
    name: 'HAS',
    identifier: 'r'
})); // "-[r:HAS]->"

console.log(getRelationshipDirectionAndName({
    direction: 'in',
    name: 'HAS',
    identifier: 'r'
})); // "<-[r:HAS]-"

console.log(getRelationshipDirectionAndName({
    direction: 'none',
    name: 'HAS',
    identifier: 'r'
})); // "-[r:HAS]-"

console.log(getRelationshipDirectionAndName({
    direction: 'out',
    name: 'HAS',
    // --> in any of the above cases, the identifier can be skipped
})); // "-[:HAS]->"
```

## Getting parts for a SET operation
`QueryRunner.getSetParts` returns the parts and the statement for a SET operation.
```js
const { getSetParts } = QueryRunner;

const existingBindParam = new BindParam({});
const result = getSetParts({
    /* --> the data to set */
    data: {
        x: 5,
        y: 'foo'
    },
    /* --> BindParam instance to be used */
    bindParam: existingBindParam, // @see [Bind Paramters](../Bind-Parameters)
    /* --> the identifier to use */
    identifier: 'node'
});
console.log(result.parts); // ["node.x = $x", "node.y = $y"]
console.log(result.statement); // "SET node.x = $x, node.y = $y"
console.log(bindParam.get()); // { x: 5, y: 'foo' }

const existingBindParam = new BindParam({
    x: 'irrelevant'
});
const result = getSetParts({
    data: {
        x: 5,
        y: 'foo'
    },
    bindParam: existingBindParam,
    identifier: 'node'
});
console.log(result.parts); // ["node.x = $x__aaaa", "node.y = $y"]
console.log(result.statement); // "SET node.x = $x__aaaa, node.y = $y"
console.log(bindParam.get()); // { x: 'irrelevant', x_aaaa: 5, y: 'foo' }
```

## Getting properties with query param values

`QueryRunner` exposes a `getPropertiesWithParams` function which returns an object in a string format to be used in queries, while replacing its values with bind params.

```js
/* --> an existing BindParam instance, could have existing values */
const bindParam = new BindParam({
    x: 4,
});
const result = QueryRunner.getPropertiesWithParams(
    /* --> the object to use */
    {
        x: 5,
        y: 'foo'
    },
    /* --> an existing bindParam must be passed */
    bindParam
);

/* --> the result gives us the needed object, while replacing its values with the appropriate bind param */
console.log(result); // "{ x: $x__aaaa, y: $y }"
console.log(bindParam.get()); // { x: 4, x__aaaa: 5, y: 'foo' }
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