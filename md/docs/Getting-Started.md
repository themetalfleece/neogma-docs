# Getting Started

## Installing

> :Tabs
> > :Tab title=npm
> > ```bash
> > npm i neogma
> > ```
>
> > :Tab title=yarn
> > ```bash
> > yarn add neogma
> > ```
## Importing

The used classes and functions can be imported as follows:

> :Tabs
> > :Tab title=require
> > ```js
> > const { BindParam, ModelFactory, Neogma, QueryRunner, Where, getSession } = require('neogma');
> > ```
>
> > :Tab title=import
> > ```ts
> > import { BindParam, ModelFactory, Neogma, QueryRunner, Where, getSession } from 'neogma';
> > // importing types
> > import { ModelRelatedNodesI, NeogmaInstance } from 'neogma';
> > ```

## Initializing
To get started, a Neogma instance needs to be initialized
```js
const neogma = new Neogma(
    {
        url: 'bolt://localhost:7687',
        username: 'neo4j',
        password: 'password',
    },
    {
        /* --> (optional) logs every query that Neogma runs, using the given function */
        logger: console.log, 
        /* --> any driver configuration can be used */
        encrypted: true,
    }
);
```
> :Buttons
> > :CopyButton

This instance must be used when defining [Models](./Models/Overview).

## Utilities
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