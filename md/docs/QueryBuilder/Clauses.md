# Clauses

The `QueryBuilder` class supports all Neo4j clauses. They are used when adding parameters to the `QueryBuilder` instance, in order to generate the intended statement.

Each of them is an attribute of the `QueryBuilderParameters` type. A union of them is the `QueryBuilderParameters['ParameterI']` type.

The final statement will consist of all the given clauses, in the order they appear in the array.

example:
```js
const queryBuilder = new QueryBuilder([
    {
        match: {
            identifier: 'n',
            label: 'MyLabel',
            where: {
                status: 'active'
            }
        },
    },
    {
        orderBy: {
            identifier: 'n',
            property: 'age',
            direction: 'DESC'
        }
    },
    {
        return: 'a'
    }
]);

console.log(queryBuilder.getStatement()); // MATCH (n:A { status: $status }) ORDER BY n.age DESC RETURN n
console.log(queryBuilder.getBindParam().get()); // { status: 'active' }
```

### Match
`QueryBuilderParameters['MatchI']`

#### Match by using a literal string
A literal string will be used as is.

```js
const queryBuilder = new QueryBuilder([
    {
        /* --> literal string to use */
        match: '(a:A)',
    },
]);

console.log(queryBuilder.getStatement()); // MATCH (a:A)
console.log(queryBuilder.getBindParam().get()); // {}
```

#### Match by using a literal object
This has the benefit of being able to make the match `optional`.

```js
const queryBuilder = new QueryBuilder([
    {
        match: {
            /* --> literal string to use */
            literal: '(a:A)',
            /* --> (optional) whether this match will be "optional" */
            optional: true,
        },
    },
]);

console.log(queryBuilder.getStatement()); // OPTIONAL MATCH (a:A)
console.log(queryBuilder.getBindParam().get()); // {}
```

#### Match a node by using an object
An object can be used to easily match a node with an identifier, label, where.

```js
const queryBuilder = new QueryBuilder([
    {
        match: {
            /* --> (optional) the identifier of the node */
            identifier: 'n',
            /* --> (optional) the label of the node */
            label: 'MyLabel',
            /* --> (optional) where parameters for matching this node. They are of the "WhereParamsI" type */
            where: { // @see [Where Parameters](../Where-Parameters.md)
                id: '20',
            },
            /* --> (optional) whether this match will be "optional" */
            optional: true,
        },
    },
]);

console.log(queryBuilder.getStatement()); // OPTIONAL MATCH (n:MyLabel { id: $id })
console.log(queryBuilder.getBindParam().get()); // { id: '20' }
```
All those attributes are optional. The matching node will use every attribute which is given. If none of them are given, the statement will equal to `MATCH ()`.

A `Model` can be used instead of the `label` attribute. In this case, the Model's label will be used.
```js
const queryBuilder = new QueryBuilder([
    {
        match: {
            /* --> (optional) */
            identifier: 'n',
            /* --> (optional) the Model whose label will be used */
            model: MyModel,
        },
    },
]);

/* --> assuming MyModel.getLabel() returns `MyModelLabel` */
console.log(queryBuilder.getStatement()); // MATCH (n:`MyModelLabel`)
console.log(queryBuilder.getBindParam().get()); // { }
```

#### Match multiple nodes
By using the `multiple` attribute and an array of nodes, multiple nodes can be matched. 

```js
const queryBuilder = new QueryBuilder([
    {
        match: {
            multiple: [
                /* --> each entry has the same type as matching with a single object, like in the examples above */
                {
                    identifier: 'a',
                    model: ModelA,
                    where: {
                        id: '20',
                    },
                },
                {
                    identifier: 'b',
                },
            ],
        },
    },
]);

/* --> assuming MyModel.getLabel() returns `MyModelLabel` */
console.log(queryBuilder.getStatement()); // MATCH (a:`MyModelLabel` { id: $id }), (b)
console.log(queryBuilder.getBindParam().get()); // { id: '20' }
```

#### Match nodes and relationships
By using the `related` attribute and an array of alternating node-relationship objects, a match between them is created.

```js
const queryBuilder = new QueryBuilder([
    {
        match: {
            related: [
                /* --> each even entry is a "node" object, as defined above */
                {
                    identifier: 'a',
                    model: ModelA,
                    where: {
                        nodeProp: '20',
                    },
                },
                /* --> each odd entry is a "relationship" object */
                {
                    /* --> the direction of the relationship, from the node above towards the one below */
                    direction: 'out', // --> 'out' or 'in' or 'none'
                    /* --> (optional) name of the relationship */
                    name: 'RelationshipName',
                    /* --> (optional) identifier of the relationship */
                    identifier: 'r',
                    /* --> (optional) where parameters for matching this relationship. They are of the "WhereParamsI" type */
                    where: {
                        relProp: 1,
                    },
                },
                /* --> the final entry must be a node */
                {
                    identifier: 'b'
                }
            ],
        },
    },
]);

/* --> assuming MyModel.getLabel() returns `MyModelLabel` */
// MATCH (a:`MyModelLabel` { nodeProp: $nodeProp })-[r:RelationshipName { relProp: $relProp }]->(b)
console.log(queryBuilder.getStatement());
// { nodeProp: '20', relProp: 1 }
console.log(queryBuilder.getBindParam().get());
```

A more elaborate example:
```js
const queryBuilder = new QueryBuilder([
    {
        match: {
            related: [
                {
                    identifier: 'a',
                    model: ModelA,
                    where: {
                        nodeProp: '20',
                    },
                },
                /* --> The static `getRelationshipByAlias` of a model can be used as a shortcut. */
                ModelA.getRelationshipByAlias('Relationship1'),
                {
                    identifier: 'b'
                },
                {
                    direction: 'in'
                },
                {
                    ...ModelA.getRelationshipByAlias('Relationship2'),
                    identifier: 'r2'
                    where: {
                        relProp: 2
                    }
                },
                {}
            ],
        },
    },
]);

/* --> assuming MyModel.getLabel() returns `MyModelLabel` */
/* --> assuming 'Relationship1' has configuration: direction: 'out', name: 'Relationship1Name' */
/* --> assuming 'Relationship1' has configuration: direction: 'in', name: 'Relationship2Name' */
// --> MATCH (a:`MyModelLabel` { nodeProp: $nodeProp })-[:Relationship1Name]->(b)<-[r2:Relationship2Name { relProp: $relProp }]-()
console.log(queryBuilder.getStatement());
// --> { nodeProp: '20', relProp: 2 }
console.log(queryBuilder.getBindParam().get());
```

For expected behavior, the first and last elements must be a node object.

### Create
`QueryBuilderParameters['Create']`

#### Create a node by using a literal string
A literal string will be used as is.

```js
const queryBuilder = new QueryBuilder([
    {
        /* --> literal string to use */
        create: '(a:A { id: 1 })',
    },
]);

console.log(queryBuilder.getStatement()); // CREATE (a:A { id: 1 })
console.log(queryBuilder.getBindParam().get()); // {}
```

#### Create a node by using an object
An object can be used to easily create a node with an identifier, label, properties.

```js
const queryBuilder = new QueryBuilder([
    {
        create: {
            /* --> (optional) the identifier of the node */
            identifier: 'n',
            /* --> (optional) the label of the node */
            label: 'MyLabel',
            /* --> (optional) the properties of thie node */
            properties: { 
                id: '20',
            },
        },
    },
]);

console.log(queryBuilder.getStatement()); // CREATE (n:MyLabel { id: $id })
console.log(queryBuilder.getBindParam().get()); // { id: '20' }
```

A `Model` can be used instead of the `label` attribute. In this case, the Model's label will be used.
```js
const queryBuilder = new QueryBuilder([
    {
        match: {
            /* --> (optional) */
            identifier: 'n',
            /* --> (optional) the Model whose label will be used */
            model: MyModel,
        },
    },
]);

/* --> assuming MyModel.getLabel() returns `MyModelLabel` */
console.log(queryBuilder.getStatement()); // CREATE (n:`MyModelLabel`)
console.log(queryBuilder.getBindParam().get()); // {}
```

#### Create multiple nodes
By using the `multiple` attribute and an array of nodes, multiple nodes can be created. 

```js
const queryBuilder = new QueryBuilder([
    {
        match: {
            multiple: [
                /* --> each entry has the same type as creating with a single object, like in the examples above */
                {
                    identifier: 'a',
                    model: ModelA,
                    properties: {
                        id: '20',
                    },
                },
                {
                    label: 'LabelB',
                },
            ],
        },
    },
]);

/* --> assuming MyModel.getLabel() returns `MyModelLabel` */
console.log(queryBuilder.getStatement()); // CREATE (a:`MyModelLabel` { id: $id }), (:LabelB)
console.log(queryBuilder.getBindParam().get()); // { id: '20' }
```

#### Create nodes and relationships
By using the `related` attribute and an array of alternating node-relationship objects, a create between them is created.

```js
const queryBuilder = new QueryBuilder([
    {
        create: {
            related: [
                /* --> each even entry is a "node" object, as defined above */
                {
                    identifier: 'a',
                    model: ModelA,
                    properties: {
                        nodeProp: '20',
                    },
                },
                /* --> each odd entry is a "relationship" object */
                {
                    /* --> the direction of the relationship, from the node above towards the one below */
                    direction: 'out', // --> 'out' or 'in' or 'none'
                    /* --> (optional) name of the relationship */
                    name: 'RelationshipName',
                    /* --> (optional) identifier of the relationship */
                    identifier: 'r',
                    /* --> (optional) where parameters for matching this relationship. They are of the "WhereParamsI" type */
                    properties: {
                        relProp: 1,
                    },
                },
                /* --> the final entry must be a node */
                {
                    identifier: 'b'
                }
            ],
        },
    },
]);

/* --> assuming MyModel.getLabel() returns `MyModelLabel` */
// CREATE (a:`MyModelLabel` { nodeProp: $nodeProp })-[r:RelationshipName { relProp: $relProp }]->(b)
console.log(queryBuilder.getStatement());
// { nodeProp: '20', relProp: 1 }
console.log(queryBuilder.getBindParam().get());
```

A more elaborate example:
```js
const queryBuilder = new QueryBuilder([
    {
        create: {
            related: [
                {
                    identifier: 'a',
                    model: ModelA,
                    properties: {
                        nodeProp: '20',
                    },
                },
                /* --> The static `getRelationshipByAlias` of a model can be used as a shortcut. */
                ModelA.getRelationshipByAlias('Relationship1'),
                {
                    identifier: 'b'
                },
                {
                    direction: 'in'
                },
                {
                    ...ModelA.getRelationshipByAlias('Relationship2'),
                    identifier: 'r2'
                    properties: {
                        relProp: 2
                    }
                },
                {}
            ],
        },
    },
]);

/* --> assuming MyModel.getLabel() returns `MyModelLabel` */
/* --> assuming 'Relationship1' has configuration: direction: 'out', name: 'Relationship1Name' */
/* --> assuming 'Relationship1' has configuration: direction: 'in', name: 'Relationship2Name' */
// --> CREATE (a:`MyModelLabel` { nodeProp: $nodeProp })-[:Relationship1Name]->(b)<-[r2:Relationship2Name { relProp: $relProp }]-()
console.log(queryBuilder.getStatement());
// --> { nodeProp: '20', relProp: 2 }
console.log(queryBuilder.getBindParam().get());
```

For expected behavior, the first and last elements must be a node object.

### Merge
`QueryBuilderParameters['MergeI']`

Merge has identical typings and behavior as `create`. Just replace the `create` attributy with `merge`.

For example:

```js
const queryBuilder = new QueryBuilder([
    {
        merge: {
            identifier: 'n',
            label: 'MyLabel',
            properties: { 
                id: '20',
            },
        },
    },
]);

console.log(queryBuilder.getStatement()); // MERGE (n:MyLabel { id: $id })
console.log(queryBuilder.getBindParam().get()); // { id: '20' }
```

### Where
`QueryBuilderParameters['MergeI']`

#### Where using a literal string
A literal string will be used as is.

```js
const queryBuilder = new QueryBuilder([
    {
        /* --> literal string to use */
        where: 'a.id = 5',
    },
]);

console.log(queryBuilder.getStatement()); // WHERE a.id = 5
console.log(queryBuilder.getBindParam().get()); // {}
```

#### Where using a parameters object

An object of the type `WhereParamsByIdentifierI` can be used.

```js
const queryBuilder = new QueryBuilder([
    {
        where: {
            identifier1: {
                id: '20'
            },
            identifier2: {
                id: '21',
                age: 28
            }
        },
    },
]);

console.log(queryBuilder.getStatement()); // WHERE identifier1.id = $id AND identifier2.id = $id__aaaa AND identifier2.age = $age
console.log(queryBuilder.getBindParam().get()); // { id: '20', id__aaaa: '21', age: 28 }
```

#### Where using an instance of the Where class
A [Where](../Where-Parameters.md) instance can be used. In this case, the return value of its `.getStatement('text')` method will be used.

```js
const existingWhereInstance = new Where({
    identifier1: {
        id: '20'
    },
    identifier2: {
        id: '21',
        age: 28
    }
});
const queryBuilder = new QueryBuilder(
    [
        {
            where: existingWhereInstance,
        },
    ],
    {
        /* --> for expected behavior, the Where instance and the QueryBuilder instance should use the same BindParam */
        bindParam: existingWhereInstance.getBindParam(),
    }
);

console.log(queryBuilder.getStatement()); // WHERE identifier1.id = $id AND identifier2.id = $id__aaaa AND identifier2.age = $age
console.log(queryBuilder.getBindParam().get()); // { id: '20', id__aaaa: '21', age: 28 }
```

### Set
`QueryBuilderParameters['SetI']`

#### Set by using a literal string
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

#### Set by using an object
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

### Remove
`QueryBuilderParameters['RemoveI']`

#### Remove by using a literal string
A literal string will be used as is.

```js
const queryBuilder = new QueryBuilder([
    {
        /* --> literal string to use */
        remove: 'a.name',
    },
]);

console.log(queryBuilder.getStatement()); // REMOVE a.name
console.log(queryBuilder.getBindParam().get()); // {}
```

#### Remove properties by using an object
The properties of an identifier can be removed by using an object.

```js
const queryBuilder = new QueryBuilder([
    {
        remove: {
            identifier: 'a',
            properties: ['name', 'age']
        },
    },
]);

console.log(queryBuilder.getStatement()); // REMOVE a.name, a.age
console.log(queryBuilder.getBindParam().get()); // {}
```

#### Remove labels by using an object
The labels of an identifier can be removed by using an object.

```js
const queryBuilder = new QueryBuilder([
    {
        remove: {
            identifier: 'a',
            labels: ['Label1', 'Label2']
        },
    },
]);

console.log(queryBuilder.getStatement()); // REMOVE a:Label1:Label2
console.log(queryBuilder.getBindParam().get()); // {}
```

### Delete
`QueryBuilderParameters['DeleteI']`

#### Delete by using a literal string
A literal string will be used as is.

```js
const queryBuilder = new QueryBuilder([
    {
        /* --> literal string to use */
        delete: 'a, b',
    },
]);

console.log(queryBuilder.getStatement()); // DELETE a, b
console.log(queryBuilder.getBindParam().get()); // {}
```

#### Delete by using a literal object
This has the benefit of being able to use `detach` delete.

```js
const queryBuilder = new QueryBuilder([
    {
        delete: {
            /* --> literal string to use */
            literal: 'a, b',
            /* --> (optional) whether this delete will be "detach" */
            detach: true,
        },
    },
]);

console.log(queryBuilder.getStatement()); // DETACH DELETE a, b
console.log(queryBuilder.getBindParam().get()); // {}
```

#### Delete by using an array of identifiers
```js
const queryBuilder = new QueryBuilder([
    {
        delete: {
            /* --> the identifiers to be deleted */
            identifiers: ['a', 'b'],
            /* --> (optional) whether this delete will be "detach" */
            detach: false,
        },
    },
]);

console.log(queryBuilder.getStatement()); // DELETE a, b
console.log(queryBuilder.getBindParam().get()); // {}
```

### Unwind
`QueryBuilderParameters['UnwindI']`

#### Unwind by using a literal string
A literal string will be used as is.

```js
const queryBuilder = new QueryBuilder([
    {
        /* --> literal string to use */
        unwind: '[1, 2, 3] as arr',
    },
]);

console.log(queryBuilder.getStatement()); // UNWIND [1, 2, 3] as arr
console.log(queryBuilder.getBindParam().get()); // {}
```

#### Unwind by using an object
Unwind using an object with the value to unwind, and what to unwind as
```js
const queryBuilder = new QueryBuilder([
    {
        unwind: {
            /* --> unwind this value */
            value: 'x',
            /* --> as this */
            as: 'y'
        }
    },
]);

console.log(queryBuilder.getStatement()); // UNWIND x as y
console.log(queryBuilder.getBindParam().get()); // {}
```


### With
`QueryBuilderParameters['WithI']`

#### With by using a literal string
A literal string will be used as is.

```js
const queryBuilder = new QueryBuilder([
    {
        /* --> literal string to use */
        with: 'a, b',
    },
]);

console.log(queryBuilder.getStatement()); // WITH a, b
console.log(queryBuilder.getBindParam().get()); // {}
```

#### With by using an array of strings
An array of strings can be used, which will be joined with a comma.

```js
const queryBuilder = new QueryBuilder([
    {
        with: ['x', '{ y: x }']
    },
]);

console.log(queryBuilder.getStatement()); // WITH x, { y: x }
console.log(queryBuilder.getBindParam().get()); // {}
```

### Order By

#### Order by, by using a literal string
A literal string will be used as is.

```js
const queryBuilder = new QueryBuilder([
    {
        /* --> literal string to use */
        orderBy: 'a ASC, b',
    },
]);

console.log(queryBuilder.getStatement()); // ORDER BY a ASC, b
console.log(queryBuilder.getBindParam().get()); // {}
```

#### Order by, by using an array of literal strings
The literal strings will be joined with a comma.

```js
const queryBuilder = new QueryBuilder([
    {
        /* --> literal strings to use */
        orderBy: ['a ASC', 'b'],
    },
]);

console.log(queryBuilder.getStatement()); // ORDER BY a ASC, b
console.log(queryBuilder.getBindParam().get()); // {}
```

#### Order by, by using an object
An object with an identifier, and an optional property and direction can be used.

```js
const queryBuilder = new QueryBuilder([
    {
        orderBy: {
            /* --> identifier/name to use for ordering */
            identifier: 'a',
            /* --> (optional) the property of the identifier to order by */
            property: 'name',
            /* --> (optional) the direction to orde by */
            direction: 'DESC', // --> 'ASC' or 'DESC'
        }
    },
]);

console.log(queryBuilder.getStatement()); // ORDER BY a.name DESC
console.log(queryBuilder.getBindParam().get()); // {}
```

#### Order by, by using an array of anything
An array can be used with any combination of: a string literal, an array with identifier/direction, and an object.

```js
const queryBuilder = new QueryBuilder([
    {
        orderBy: [
            /* --> literal string */
            'a',
            /* --> identifier/direction tuple */
            ['b', 'DESC'], // -> 'ASC' or 'DESC',
            {
                /* --> an object, as defined above */
                identifier: 'c',
                property: 'age',
            }
        ]
    },
]);

console.log(queryBuilder.getStatement()); // ORDER BY a, b DESC, c.age
console.log(queryBuilder.getBindParam().get()); // {}
```

### Return

#### Return by using a literal string
A literal string will be used as is.

```js
const queryBuilder = new QueryBuilder([
    {
        /* --> literal string to use */
        return: 'a, b.p1',
    },
]);

console.log(queryBuilder.getStatement()); // RETURN a, b.p1
console.log(queryBuilder.getBindParam().get()); // {}
```

#### Return by using an array of literal strings
The literal strings will be joined with a comma.

```js
const queryBuilder = new QueryBuilder([
    {
        /* --> literal strings to use */
        return: ['a', 'b.p1'],
    },
]);

console.log(queryBuilder.getStatement()); // RETURN a, b.p1
console.log(queryBuilder.getBindParam().get()); // {}
```

#### Order by, by using an object array
An array of objects with an identifier/name, and an optional property.

```js
const queryBuilder = new QueryBuilder([
    {
        return: [
            {
                /* --> identifier/name to return */
                identifier: 'a',
                /* --> (optional) the property of the identifier to return */
                property: 'name',
            }
            {
                identifier: 'b'
            }
        ]
    },
]);

console.log(queryBuilder.getStatement()); // RETURN a.name, b
console.log(queryBuilder.getBindParam().get()); // {}
```

### Limit

#### Limit by using a literal string
A literal string will be used as is.

```js
const queryBuilder = new QueryBuilder([
    {
        /* --> literal string to use */
        limit: 'toInteger(3 * rand()) + 1',
    },
]);

console.log(queryBuilder.getStatement()); // LIMIT toInteger(3 * rand()) + 1
console.log(queryBuilder.getBindParam().get()); // {}
```

#### Limit by using a number
That way, a Bind Parameter is used

```js
const queryBuilder = new QueryBuilder([
    {
        limit: 5,
    },
]);

console.log(queryBuilder.getStatement()); // LIMIT $limit
console.log(queryBuilder.getBindParam().get()); // { limit: 5 }
```

### Skip

#### Skip by using a literal string
A literal string will be used as is.

```js
const queryBuilder = new QueryBuilder([
    {
        /* --> literal string to use */
        skip: 'toInteger(3 * rand()) + 1',
    },
]);

console.log(queryBuilder.getStatement()); // SKIP toInteger(3 * rand()) + 1
console.log(queryBuilder.getBindParam().get()); // {}
```

#### Skip by using a number
That way, a Bind Parameter is used

```js
const queryBuilder = new QueryBuilder([
    {
        skip: 5,
    },
]);

console.log(queryBuilder.getStatement()); // SKIP $skip
console.log(queryBuilder.getBindParam().get()); // { skip: 5 }
```

### Raw
In case the intended statement cannot be added by using the above clauses, a raw string can be included in the parameters.

```js
const queryBuilder = new QueryBuilder([
    {
        raw: 'MATCH (a:A) RETURN a',
    },
]);

console.log(queryBuilder.getStatement()); // MATCH (a:A) RETURN a
console.log(queryBuilder.getBindParam().get()); // { }
```

> :ToCPrevNext