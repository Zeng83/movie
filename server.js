'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: 8080, host: 'localhost' });

server.register(require('inert'), (err) => {
  if (err) {
    throw err;
  }

  server.route({
    method: 'GET',
    path: '/style/main.css',
    handler: function (request, reply) {
      reply.file('./style/main.css');
    }
  });
});

server.register(require('inert'), (err) => {
  if (err) {
    throw err;
  }

  server.route({
    method: 'GET',
    path: '/js/main.js',
    handler: function (request, reply) {
      reply.file('./js/main.js');
    }
  });
});

server.register(require('inert'), (err) => {
  if (err) {
    throw err;
  }

  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      reply.file('./index.html');
    }
  });
});

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log(`Server running at: ${server.info.uri}`);
});
