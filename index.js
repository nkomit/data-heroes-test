"use strict";
const fs = require("fs");
const pg = require("pg");
const format = require('pg-format')
const fetch = require('node-fetch');
// const {performance} = require('perf_hooks');


const config = {
    connectionString:
        "postgres://candidate:62I8anq3cFq5GYh2u4Lh@rc1b-r21uoagjy1t7k77h.mdb.yandexcloud.net:6432/db1",
    ssl: {
        rejectUnauthorized: true,
        ca: fs
            .readFileSync("/home/nkomit/.postgresql/root.crt")
            .toString(),
    },
};

const conn = new pg.Client(config);

conn.connect()
.then(console.log('connected'))
.catch(e => console.error(e.message))

conn.query('CREATE TABLE nkomit (id SERIAL PRIMARY KEY NOT NULL, name TEXT, data JSONB)')

fetch('https://rickandmortyapi.com/api/character')
    .then((response) => response.json())
    .then((data) => {
        const values = data.results.map(result => [result.id, result.name, result])
        return values
    })
    .then((values) => {
        const text = 'INSERT INTO nkomit(id, name, data) VALUES %L'
        const query = conn.query(format(text, values))
        conn.end()
    })
    .catch((e) =>
        console.error(e.message)
    )

