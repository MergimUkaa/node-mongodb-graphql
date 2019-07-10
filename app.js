const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const graphqlSchema = require('./graphql/schema/index');
const graphqlResolver = require('./graphql/resolvers/index');

const app = express();


app.use(bodyParser.json());
app.use(
    '/graphql',
    graphqlHttp({
        schema: graphqlSchema,
        rootValue: graphqlResolver,
        graphiql: true
    })
);

mongoose
    .connect("mongodb+srv://mergim:BR6ssmu71Puapi4b@cluster0-i7hex.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true}
    )
    .then(() => {
        console.log('success');
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });



