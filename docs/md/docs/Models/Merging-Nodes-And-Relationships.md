# Merging Nodes and Relationships

Merging nodes and relationships happens with the same functions as creating nodes and relationships, by passing the appropriate params. Therefore, it is recommended that [Creating Nodes and Relationships](./Creating-Nodes-and-Relationships) is known well.

## Merging a single or many nodes of a Model

For merging a single node, `createOne` can be used with the `merge` param set to true.
```js
/* --> merge a User node and get the Instance */
const user = await Users.createOne(
    /* --> the properties of the User node to be merged */
    {
        id: '1',
        name: 'John',
        age: 38,
    },
    {
        /* --> by setting this to true, a MERGE query instead of a CREATE one will run */
        merge: true,
        /* --> (optional, default true) validates the properties of the node */
        validate: true,
        /* --> (optional) */
        session: null,
    }
);

/* --> we can use the Instance as usual */
console.log(user.name); // "John"
```

For merging many nodes, `createMany` can be used with the `merge` param set to true.
```js
const users = await Users.createMany(
    [
        {
            id: '1',
            name: 'John',
        },
        {
            id: '2',
            name: 'Alex',
        }
    ],
    {
        /* --> by setting this to true, a MERGE query instead of a CREATE one will run */
        merge: true,
        /* --> (optional, default true) validates all nodes */
        validate: true,
        /* --> (optional) */
        session: null,
    }
);

console.log(usersWithOrders[0].id); // "1"
console.log(usersWithOrders[1].bar()); // "The name of this user is: Alex"
```

## Creating/Merging nodes and merging relationships with other nodes

When automatically associating with other nodes (either by creating them or by matching them), a MERGE instead of a CREATE can be used.

The following example uses `createMany`, but the same interface applies on `createOne` and instance save (when it doesn't exist in the database).

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
            /* --> associate with other nodes. The appropriate key (i.e. 'RelatedNodesToAssociate') can be taken like this */
            [Users.getRelationshipCreationKeys().RelatedNodesToAssociate]: {
                /* --> the Orders alias will be used, as defined in the Users model */
                Orders: {
                    /* --> (optional) configuration regarding what aspects of the 'attributes' property to merge instead of create */
                    attributesMergeConfig: {
                        /* --> (optional) the created (Order) nodes will be merged, instead of created */
                        nodes: true,
                        /* --> (optional) the relationship between User and Order nodes will be merged, instead of created */
                        relationship: true,
                    },
                    /* --> (optional) merge new nodes (as attributesMergeConfig.nodes is true) and associate with them */
                    attributes: [
                        /* --> creates the following 2 Order nodes, and creates a relationship with each one of them using the configuration of the Orders alias  */
                        {
                            id: '2'
                        },
                        {
                            id: '3',
                            items: 5,
                            /* --> the relationship is merged (as attributesMergeConfig.relationship is true) with the following properties. The appropriate key (i.e. 'RelationshipValuesToCreate') can be taken like this */
                            [Users.getRelationshipCreationKeys().RelationshipValuesToCreate]: {
                                createdAt: '2020-02-02'
                            },
                            /* --> can create (or merge) nodes and associate them with this Order node. The alias and configuration is that of the Orders model */
                            [Orders.getRelationshipCreationKeys().RelatedNodesToAssociate]: {
                                /* --> the 'Critics' alias will be used, as defined in the 'Orders' model */
                                Critics: {
                                    attributesMergeConfig: {
                                        /* --> by setting this to false (or omitting it in the first place), the Critics nodes will be created, not merged */
                                        nodes: false,
                                        /* --> by setting this to false (or omitting it in the first place), the relationship between the Orders and the Critics nodes will be created, not merged */
                                        relationship: false,
                                    },
                                    attributes: [{ id: '10' }]
                                }
                            }
                        }
                    ],
                    /* --> (optional) also associates the User node with existing Order nodes */
                    where: [
                        {
                            /* --> (optional) the relationship between the created User nodes and the matched Order nodes will be merged, instead of being created */
                            merge: true,
                            /* --> the Where clause find matching the existing Nodes */
                            params: {
                                id: '3'
                            },
                            /* --> (optional) properties can be added to the relationship merged by matching the User node with the existing Order nodes */
                            [Users.getRelationshipCreationKeys().RelationshipValuesToCreate]: {
                                createdAt: '2020-01-01',
                            }
                        },
                        {
                            /* --> another object can be used for matching the User node with the Order nodes of this where independently */
                            params: {
                                items: 3,
                            },
                            /* --> the realtionship of this match can be created, not merged */
                            merge: false,
                        }
                    ]
                },
                /* --> other aliases can be used here, to associate the User node with those of other Models */
            }
        }
    ],
    {
        /* --> merges the root-level nodes (the Users - 'John', 'Alex') */
        merge: true,
        /* --> (optional, default true) validates all nodes */
        validate: true,
        /* --> (optional) */
        session: null,
    }
);
```

> :ToCPrevNext