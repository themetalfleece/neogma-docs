# Instances

Each Instance of a Model represents a node in the database, with its label, properties etc. matching those in the Model definition.

Instances offer flexible access to a node's properties, as well as operations regarding it, such as updating/deleting the node itself and its relationships.

### Creating an Instance
TODO link to Create, Find
An Instance is returned from various Model operations (such as Create, Find), or a new Instance (which doesn't yet exist in the database) can be created as follows:
```js
    /* --> creates an Instance of the Users model, which still doesn't exist in the database */
    const user = Users.build({
        id: '1',
        name: 'John',
        age: 38,
    });

    /* --> the Instance can be saved to the database. This will run a CREATE operation to create a node to match the Users Model configuration (label etc.) */
    await user.save({
        /* --> (optional, default true) validates that the properties of the Instance are valid, given the schema of the Model definition */
        validate: true,
        /* --> (optional) a session object for this query to run. If empty/null, a new session will be created TODO see more for session */
        session: null,
    });
```

### Updating an Instance
```js
    /* --> given a user Instance, like the one created above, we can change the properties of the Instance */
    user.name = 'Bob';

    /* --> we reflect this change to the database. Since the node already exists in the databse, neogma will automatically run a MATCH-SET operation to update just the name of this node */
    await user.save({
        validate: false,
    });
```
### Accessing the Instance's properties and methods
```js
    /* --> the Instance's properties and methods are accessible by their key */
    console.log(user.id, user.name, user.age); // '1' 'Bob' 38
    /* --> all the instance properties can be taken as follows */
    console.log(user.getDataValues()); // { id: '1', name: 'Bob', age: 38 }
    /* --> the methods, used in the Model definition can be used */
    console.log(user.bar()); // 'The name of this user is: Bob'
```

### Validating the Instance
```js
    user.age = 30;
    /* --> we can validate the properties of the Instance without saving it to the database. The properties of the Instance are valid, so this will not throw an error */
    await user.validate();

    try {
        user.age = -1;
        /* --> the properties of the Instance are invalid, so this will throw an error */
        await user.validate();
    } catch(err) { 
        console.log(err); // NeogmaInstanceValidationError
    }
```

### Creating related nodes
```js
    TODO add a link to Create operations
    /* --> by using the RelatedNodesToAssociate key specified in the Model definition, related nodes can also be created. For more examples, refer to the Create operations, as the same interface is used */
    const userWithOrder = Users.build({
        id: '2',
        name: 'Alex',
        RelatedNodesToAssociate: {
            /* --> the 'Orders' alias will be used, as defined in the 'Users' model */
            Orders: {
                /* --> (optional) create new nodes and associate with them */
                properties: [{
                    /* --> a new Order node will be created with the following properties, and a relationship with the configuration of alias 'Orders' will be created (direction: out, name: CREATES) */
                    id: '3'
                }],
            }
        }
    });
    /* --> when calling the following method, the User node, the Order node and the relationship between them */
    await userWithOrder.save();
```

### More Instance methods
More Instance methods are found at the corresponding documentation, i.e. [Creating Nodes and Relationships](./Creating-Nodes-and-Relationships)

> :ToCPrevNext