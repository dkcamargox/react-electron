const knex = require('knex');
const { attachPaginate } = require('knex-paginate');
const config = require('./knexfile');


const connection = knex(config.development);
attachPaginate();
module.exports = connection;