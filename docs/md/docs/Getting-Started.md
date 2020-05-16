# Getting Started

First of all, a Neogma instance needs to be initialized
```js
const neogma = new Neogma(
    {
        url: 'neo4j connection url',
        username: 'neo4j connection username',
        password: 'neo4j connection password',
    },
    {
        /* --> (optional) logs every query that Neogma runs, using the given function */
        logger: console.log, 
    }
);
```

This instance must be used when defining [Models](./Models/Overview).

It also has the neo4j Driver and a [QueryRunner](./QueryRunner/Overview) instance. For more information about how to run your own queries and other non-model operations, refer to its documentation.

```js
/* --> gets the neo4j driver */
const driver = neogma.getDriver();
/* --> gets the QueryRunner instance used by this neogma instance */
const queryRunner = neogma.getQueryRunner();
/* --> wrapper for getSession */
const getSession = neogma.getSession; // @see [Sessions](./Sessions)
/* --> the defined Models by their names */
const modelsByName = neogma.modelsByName; // @see [Defining a Model](./Models/Defining-a-Model)
```

> :ToCPrevNext