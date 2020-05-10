# Creating Nodes and Relationships

Apart from building and saving an [Instance](./Instances), each model provides functions to directly create nodes and relationships.

## Creating or a single node of the Model
```js
/* --> create a User node and get the Instance */
const user = await Users.createOne(
    /* --> the properties of the User node to be created */
    {
        id: '1',
        name: 'John',
        age: 38,
    },
    {
        /* --> (optional, default true) validates the properties of the node */
        validate: true,
        /* --> (optional) a session object for this query to run. If empty/null, a new session will be created TODO see more for session */
        session: null,
    }
);

/* --> we can use the Instance as usual */
console.log(user.name); // 'John'
```

## Creating a single node of the Model while relating it with other nodes
TODO link where
Neogma provides functionality for creating other nodes while creating a given node, and associating them automatically. Instead of creating the associated nodes, they can also be matched by a where clause. Everything runs in a single statement.
```js
const userWithOrder = await Users.createOne({
    id: '1',
    name: 'Alex',
    /* --> associate with other nodes. The appropriate key (i.e. 'RelatedNodesToAssociate') can be taken like this */
    [Users.getRelationshipCreationKeys().RelatedNodesToAssociate]: {
        /* --> the Orders alias will be used, as defined in the Users model */
        Orders: {
            /* --> (optional) create new nodes and associate with them */
            attributes: [
                /* --> creates the following 2 Order nodes, and creates a relationship with each one of them using the configuration of the Orders alias  */
                {
                    id: '2'
                },
                {
                    id: '3',
                    items: 5,
                    /* --> the relationship is created with the following properties. The appropriate key (i.e. 'RelationshipValuesToCreate') can be taken like this */
                    [Users.getRelationshipCreationKeys().RelationshipValuesToCreate]: {
                        createdAt: '2020-02-02'
                    },
                    /* --> can create nodes and associate them with this Order node. The alias and configuration is that of the Orders model */
                    [Orders.getRelationshipCreationKeys().RelatedNodesToAssociate]: {
                        /* --> the 'Critics' alias will be used, as defined in the 'Orders' model */
                        Critics: {
                            attributes: [{ id: '10' }]
                        }
                    }
                }
            ],
            /* --> (optional) also associates the User node with existing Order nodes */
            where: [
                {
                    // TODO link to Where
                    /* --> the Where clause find matching the existing Nodes */
                    params: {
                        id: '3'
                    },
                    /* --> (optional) properties can be added to the relationship created by matching the User node with the existing Order nodes */
                    [Users.getRelationshipCreationKeys().RelationshipValuesToCreate]: {
                        createdAt: '2020-01-01',
                    }
                },
                {
                    /* --> another object can be used for matching the User node with the Order nodes of this where independently */
                    params: {
                        items: 3,
                    }
                }
            ]
        },
        /* --> other aliases can be used here, to associate the User node with those of other Models */
    }
});

console.log(userWithOrder.id); // '1'
```

## Creating many nodes
For creating many nodes, the function `createMany` can be used, with identical parameters as `createOne`, with the only difference that the first param is an array of objects, instead of a plain object.
```js
const usersWithOrders = await Users.createMany(
    [
        {
            id: '1',
            name: 'John',
        },
        {
            id: '2',
            name: 'Alex',
            [Users.getRelationshipCreationKeys().RelatedNodesToAssociate]: {
                /* --> same interface as createOne, which will apply only to this node */
            }
        }
    ],
    {
        /* --> (optional, default true) validates all nodes */
        validate: true,
        /* --> (optional) */
        session: null,
    }
);

console.log(usersWithOrders[0].id); // '1'
console.log(usersWithOrders[1].bar()); // 'The name of this user is: Alex'
```

## Creating relationships via the Model static
Relationships can be created via a Model static, by specifying params for both source and target nodes.

The following example created a relationship with the configuration of the alias `Orders` between the User nodes with name `'John'` and the Order nodes with the id `'2'`.

```js
await Users.relateTo(
    {
        /* --> the alias of the relationship, as provided in the Model definition */
        alias: 'Orders',
        /* --> where parameters for the source and target nodes. Refer to the Where section for more information */
        where: {
            /* --> where parameters for the source node(s) */
            source: {
                name: 'John'
            },
            /* --> where parameters for the target node(s) */
            target: {
                id: '2',
            },
        },
        /* --> properties of the relationship to be created */
        values: {
            createdAt: '2020-02-02'
        }
    },
    {
        /* --> (optional) throws an error if the created relationships are not equal to this number */
        assertCreatedRelationships: 2,
        /* --> (optional) */
        session: null
    }
);
```

## Creating relationships via the Instance method
Relationships can be created via an Instance method, by specifying params for just the target nodes. The source node will always be the one that corresponds to the instance, and its primary key field must be set.

The method `relateTo` is identical to the static, with the only difference being the `where` parameter, which now only refers to the target nodes.

```js
/* --> let 'user' be a Users instance */
await user.relateTo(
    {
        /* --> the alias of the relationship, as provided in the Model definition */
        alias: 'Orders',
        /* --> where parameters for target node(s) */
        where: {
            id: '2',
        },
        /* --> properties of the relationship to be created */
        values: {
            createdAt: '2020-02-02'
        }
    },
    {
        /* --> (optional) throws an error if the created relationships are not equal to this number */
        assertCreatedRelationships: 2,
        /* --> (optional) */
        session: null
    }
);
```

> :ToCPrevNext