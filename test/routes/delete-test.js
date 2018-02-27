const {assert} = require('chai');
const request = require('supertest');
const app = require('../../app');
const Item = require('../../models/item');
const {buildItemObject} = require('../test-utils');
const {connectDatabaseAndDropData, disconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /items/:id/delete', () => {

    const itemToCreate = buildItemObject();
    beforeEach(connectDatabaseAndDropData);
    afterEach(disconnectDatabase);

    describe('GET', () => {
        it('returns a 404 status code', async () => {
            const item = await Item.create(itemToCreate);

            const response = await request(app)
                .get(`/items/${item._id}/delete`)
                .send();

            assert.equal(response.status, 404);
        });
    });

    describe('POST', () => {
        it('removes an item from the database', async () => {
            const item = await Item.create(itemToCreate);

            await request(app)
                .post(`/items/${item._id}/delete`)
                .type('form')
                .send();

            const removedItem = await Item.findById(item._id);

            assert.isNull(removedItem, 'Item was not removed from the database');

        });

        it('redirects to / after deletion', async () => {
            const item = await Item.create(itemToCreate);
            const response = await request(app)
                .post(`/items/${item._id}/delete`)
                .type('form')
                .send();

            assert.equal(response.status, 302);
            assert.equal(response.headers.location, '/');
        });
    });

});
