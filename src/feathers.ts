import feathers from '@feathersjs/feathers';
import rest from '@feathersjs/rest-client';

const client = feathers();

const restClient = rest('https://bootstrap-demo4-zaginureeq-uw.a.run.app');

client.configure(restClient.fetch(window.fetch));

export default client;
