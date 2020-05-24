# Defining a Model

## Using ModelFactory
To define a Model, the information presented at [Overview](./Overview) must be provided.

For the schema, [revalidator](https://github.com/flatiron/revalidator) is used. Its documentation is applied as-is for defining validating the properties of the nodes of this Model.

A sample Model definition with all configuration options is the following. Note that when using Typescript, to enable proper typing, some interfaces need to be provided.

> :Tabs
> > :Tab title=Javascript
> > ```js
> > const Users = ModelFactory({
> >     /* --> the label that the nodes of this Model have. For multiple nodes, an array can be provided like ['User', 'New'] */
> >     label: 'User',
> >     /* --> The properties of the nodes of this Model and the validation for them. This follows the revalidator schema configuration */
> >     schema: {
> >         name: {
> >             type: 'string',
> >             minLength: 3,
> >             required: true
> >         },
> >         age: {
> >             type: 'number',
> >             minimum: 0,
> >         },
> >         id: {
> >             type: 'string',
> >             required: true,
> >         }
> >     },
> >     /* --> all the possible relationships (with other Models or itself), for relationship-related functions to work properly */
> >     relationships: [
> >         {
> >             /* --> reference to the Orders Model. For reference to this model, the value 'self' can be used */
> >             model: Orders,
> >             /* --> the direction of the relationship. Valid values are 'in' | 'out' | 'none' */
> >             direction: 'out',
> >             /* --> the name of this relationship */
> >             name: 'CREATES',
> >             /* --> an arbitrary alias to be used for identifying this relationship when using the relationship-related functions */
> >             alias: 'Orders',
> >         },
> >     ],
> >     /* --> arbitrary keys to indicate that data is about creating related nodes or relationship values. More information can be found on the Create functions */
> >     relationshipCreationKeys: {
> >         /* --> the key to be used for creating related nodes (and automatically associating with them) */
> >         RelatedNodesToAssociate: 'RelatedNodesToAssociate',
> >         /* --> the key to be used for creating relationship values (adding properties to relationships) */
> >         RelationshipValuesToCreate: 'RelationshipValuesToCreate',
> >     },
> >     /* --> (optional) the key to be used as a unique identifier, which enables some Instance methods */
> >     primaryKeyField: 'id',
> >     /* --> (optional) statics to be added to the Model. In this example, can be called using `Users.foo()` */
> >     statics: {
> >         foo: () => {
> >             return 'foo';
> >         }
> >     },
> >     /* --> (optional) methods to be added to the Instance of this Model. In this example, they can be called on a Users Instance using `user.bar()` */
> >     methods: {
> >         bar: function() {
> >             /* --> returns the id of this node */
> >             return this.id;
> >         }
> >     }
> > }, neogma); // <-- the neogma instance is used
> > ```
>
> > :Tab title=Typescript
> > ```ts
> > 
> > /* --> the interface of the attributes of the Instance (properties of the node). They match the schema definition */
> > interface UserAttributesI {
> >     name: string,
> >     age?: number,
> >     id: string,
> > }
> >
> > /* --> arbitrary keys to indicate that data is about creating related nodes or relationship values. More information can be found on the Create functions */
> > const relationshipCreationKeys = {
> >     /* --> the key to be used for creating related nodes (and automatically associating with them) */
> >     RelatedNodesToAssociate: 'RelatedNodesToAssociate',
> >     /* --> the key to be used for creating relationship values (adding properties to relationships) */
> >     RelationshipValuesToCreate: 'RelationshipValuesToCreate',
> > } as const;
> > 
> > /* --> the interface for the related Models. The keys are the arbitrary aliases of the relationships */
> > interface UsersRelatedNodesI {
> >     'Orders': ModelRelatedNodesI<
> >         /* --> the related Model */
> >         typeof Orders,
> >         /* --> the type of the Instance of the related Model. It should have a definition to correspond to `UsersInstance`, as defined below */
> >         OrdersInstance,
> >         /* --> the name of the key for creating relationship values. It should match the one defined above, like this: */
> >         typeof relationshipCreationKeys.RelationshipValuesToCreate,
> >         /* --> (optional) the interface of the relationship values */
> >         {
> >             rating: number
> >         }
> >      >
> > }
> >
> > /* --> (optional) types for the methods of the Instance. This has to be defined only if methods are used */
> > interface MethodsI {
> >     /* --> 'this' needs to be cast as the Instance of this Model (in this example, it is defined a few lines below) */
> >     bar: (this: UsersInstance) => string
> > }
> >
> > /* --> (optional) types for the statics of the Model. This has to be defined only if statics are used */
> > interface StaticsI {
> >     foo: () => string
> > }
> >
> > /* --> the type of the Instance of this Model. Its generics are interfaces that are defined in this file */
> > type UsersInstance = NeogmaInstance<UserAttributesI, UsersRelatedNodesI, MethodsI>;
> >
> > const Users = ModelFactory<
> >     UserAttributesI,
> >     UsersRelatedNodesI,
> >     typeof relationshipCreationKeys.RelatedNodesToAssociate,
> >     typeof relationshipCreationKeys.RelationshipValuesToCreate,
> >     StaticsI, // --> optional, needed only if they are defined
> >     MethodsI // --> optional, needed only if they are defined
> >     > (
> >     {
> >     /* --> the label that the nodes of this Model have. For multiple nodes, an array can be provided like ['User', 'New'] */
> >     label: 'User',
> >     /* --> The properties of the nodes of this Model and the validation for them. This follows the revalidator schema configuration */
> >     schema: {
> >         name: {
> >             type: 'string',
> >             minLength: 3,
> >             required: true
> >         },
> >         age: {
> >             type: 'number',
> >             minimum: 0,
> >         },
> >         id: {
> >             type: 'string',
> >             required: true,
> >         }
> >     },
> >     /* --> all the possible relationships (with other Models or itself), for relationship-related functions to work properly */
> >     relationships: [
> >         {
> >             /* --> reference to the Orders Model. For reference to this model, the value 'self' can be used */
> >             model: Orders,
> >             /* --> the direction of the relationship. Valid values are 'in' | 'out' | 'none' */
> >             direction: 'out',
> >             /* --> the name of this relationship */
> >             name: 'CREATES',
> >             /* --> an arbitrary alias to be used for identifying this relationship when using the relationship-related functions */
> >             alias: 'Orders',
> >         },
> >     ],
> >     /* --> this variable is already defined */
> >     relationshipCreationKeys,
> >     /* --> (optional) the key to be used as a unique identifier, which enables some Instance methods */
> >     primaryKeyField: 'id',
> >     /* --> (optional) statics to be added to the Model. In this example, can be called using `Users.foo()` */
> >     statics: {
> >         foo: () => {
> >             return 'foo';
> >         }
> >     },
> >     /* --> (optional) methods to be added to the Instance of this Model. In this example, they can be called on a Users Instance using `user.bar()` */
> >     methods: {
> >         bar: function() {
> >             /* --> returns the name of this node with a friendly text */
> >             return 'The name of this user is: ' + this.name;
> >         }
> >     }
> > }, neogma); // <-- the neogma instance is used
> > ```
> >

> :Buttons
> > :CopyButton

## Using the Model's helpers
The created Model provides functions for database operations, as well as the following helpers
```js
    /* --> gets the relationshipCreationKeys provided when defining the Model */
    Users.getRelationshipCreationKeys();  // --> { RelatedNodesToAssociate: 'RelatedNodesToAssociate', RelationshipValuesToCreate: 'RelationshipValuesToCreate' }
    /* --> by providing an alias, gets the relationship configuration (model, direction, name) */
    Users.getRelationshipByAlias('Orders'); // --> { model: Orders, direction: 'out', name: 'CREATES' }
    /* --> gets the primaryKeyField provided when defining the Model */
    Users.getPrimaryKeyField(); // --> id
    /* --> gets a name which is generated by the Model labels */
    Users.getModelName(); // --> Users
    /* --> getting a Model by its name by using the neogma instance */
    neogma.modelsByName['Users'];
```

> :ToCPrevNext