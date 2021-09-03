import newman from 'newman';
import fs from 'fs';

const rawdata = fs.readFileSync('nodejs-api.postman_collection.json');
const api = JSON.parse(rawdata);

newman.run({
  collection: api,
  reporters: 'cli',
});
