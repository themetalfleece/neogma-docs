# Sessions

All Model and QueryRunner queries use a session in order to run. A session can be created by using the driver, or by using the `getSession` helper to help with running queries in the same session.

All Model queries can accept an existing session as a parameter. If it's given, every query will run in this session. If not, a new session will be created for the queries to run.

All QueryRunner queries require an existing session.

## Getting a session from the driver
```js
/* --> the driver can be obtained by the Neogma instance */
const driver = neogma.getDriver();
/* --> use the driver to create a session */
const session = driver.session();
/* --> this session can be used in more than one Neogma operations */
await Users.createOne(
    {
        id: '1',
        name: 'John'
    },
    {
        session
    }
);
await Users.findAll({
    session
});
// TODO link QueryRunner
/* --> the session can also be used in the QueryRunner. Let 'queryRunner' be a QueryRunner instance */
await queryRunner.run(session, 'MATCH 1 = 1', {});
/* --> closing the session */
await session.close();
```

## Getting a session with the getSession helper
A session can also be obtained with the `getSession` helper. Its first parameter is an existing session: if it's set, it will be used as-is in the callback. Else, a new one will be created. Ιts second parameter is a callback with the session as the first parameter. 

After the callback is done, the session automatically closes.
```js
/* --> no session is passed, so a new one will be created */
await getSession(null, async (session) => {
    /* --> this session can be used in more than one Neogma operations */
    await Users.createOne(
        {
            id: '1',
            name: 'John'
        },
        {
            session
        }
    );

    /* --> let's create a function that takes a session param */
    const myFindUser = (sessionParam) => {
        /* --> this param is used for a getSession. So, if it already exists, it will be used. Else, a new one will be created */
        await getSession(sessionParam, async (sessionToUse) => {
            /* --> we can perform multiple operations with this session */
            await Users.findAll({
                session: sessionToUse
            });
            await Users.findOne({
                session: sessionToUse
            });
            await queryRunner.run(sessionToUse, 'MATCH 1 = 1', {});
        });
    };

    /* --> no session is given, so the operations in 'myFindUser' will run in their own session */
    await myFindUser(null);
    /* --> the existing session is given, so the operations in 'myFindUser' will run using this existing session */
    await myFindUser(session);
});
```
As we can see, this helper is useful when we have to run multiple operations in a single session, but we want to easily allow an existing session to be used.

> :ToCPrevNext