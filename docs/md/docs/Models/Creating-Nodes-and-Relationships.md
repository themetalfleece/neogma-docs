# Creating Nodes and Relationships

Apart from building and saving an [Instance](./Instances), each model provides functions to directly create nodes and relationships.

# Creating or a single node of the Model
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

# Creating a single node of the Model while relating it with other nodes
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
            properties: [
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
                            properties: [{ id: '10' }]
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
                    /* --> properties can be added to the relationship created by matching the User node with the existing Order nodes */
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
        }
    }
});
```

> :ToCPrevNext