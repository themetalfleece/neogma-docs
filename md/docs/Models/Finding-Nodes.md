# Finding Nodes

Neogma provides some basic functionality for matching, filtering, limiting and ordering nodes. For more complex find statements, one can use the driver for running a raw query.

## Finding Many Nodes

```js
/* --> finds Users Nodes and returns an array of Users Instances */
const users = await Users.findMany({
    /* --> the where param for matching the Nodes */
    where: {
        /* --> the name property of the User Nodes must be 'John' and their id must be in: ('1', '2') */
        name: 'John',
        id: { $in: ['1', '2'] },
    },
    /* --> (optional) the limit of this query */
    limit: 3,
    /* --> (optional) the order of this query, in this case by: age DESC, id ASC */
    order: [['age', 'DESC'], ['id', 'ASC']],
    /* --> (optional) */
    session: null,
});

console.log(users[0].bar()); // "The name of this user is: John"
console.log(users[0].age, users[0].id); // 45 "2"
console.log(users[1].age, users[1].id); // 45 "3"
console.log(users[2].age, users[2].id); // 38 "1"
```

## Finding a single Node

```js
/* --> finds a User Node and returns a Users Instances */
const user = await Users.findOne({
    /* --> the where param for matching the Node */
    where: {
        /* --> the name property of the User Node must be 'John' */
        name: 'John',
    },
    /* --> (optional) the order of this query, in this case by: id ASC */
    order: [['id', 'ASC']],
    /* --> (optional) */
    session: null,
});

console.log(user.bar()); // "The name of this user is: John"
console.log(user.id, user.age); // "1" 38
```

> :ToCPrevNext