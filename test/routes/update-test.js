const {assert} = require('chai');
const request = require('supertest');
const app = require('../../app');
const Item = require('../../models/item');
const {parseTextFromHTML, findImageElementBySource, seedItemToDatabase} = require('../test-utils');
const {connectDatabaseAndDropData, disconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /items/:id/update', () => {

    let itemToUpdate;

    beforeEach(async () => {
        connectDatabaseAndDropData();
        itemToUpdate = await seedItemToDatabase();
    });

    afterEach(disconnectDatabase);

    describe('GET', () => {
        it('renders item values in input fields', async () => {
            const response = await request(app).get(`/items/${itemToUpdate._id}/update`);

            assert.equal(parseTextFromHTML(response.text, '#title-input'), itemToUpdate.title);
            assert.equal(parseTextFromHTML(response.text, '#description-input'), itemToUpdate.description);
            assert.equal(parseTextFromHTML(response.text, '#imageUrl-input'), itemToUpdate.imageUrl);
        });

        it('renders image preview', async () => {
            const response = await request(app).get(`/items/${itemToUpdate._id}/update`);
            assert.exists(findImageElementBySource(response.text, itemToUpdate.imageUrl));
        });
    });

    describe('POST', () => {
        it('updates item in the database', async () => {
            const itemUpdate = {
                title: 'Testing Title Update',
                description: 'Test Description',
                imageUrl: 'http://test.test'
            };

            await request(app)
                .post(`/items/${itemToUpdate._id}/update`)
                .type('form')
                .send(itemUpdate);

            const updatedItem = await Item.findById(itemToUpdate._id);

            assert.equal(updatedItem.title, itemUpdate.title);
        });

        it('returns an error if item is missing a title', async () => {
            const invalidItemUpdate = {
                title: '',
                description: 'Test Description',
                imageUrl: 'http://'
            };

            const response = await request(app)
                .post(`/items/${itemToUpdate._id}/update`)
                .type('form')
                .send(invalidItemUpdate);

            assert.equal(response.status, 400);
            assert.include(parseTextFromHTML(response.text, 'form'), 'title is required');
        });

        it('returns an error if item is missing a description', async () => {
            const invalidItemUpdate = {
                title: 'Test Title',
                description: '',
                imageUrl: 'http://'
            };

            const response = await request(app)
                .post(`/items/${itemToUpdate._id}/update`)
                .type('form')
                .send(invalidItemUpdate);

            assert.equal(response.status, 400);
            assert.include(parseTextFromHTML(response.text, 'form'), 'description is required');
        });

        it('returns an error if item is missing an imageUrl', async () => {
            const invalidItemUpdate = {
                title: 'Test Title',
                description: 'Test Description',
                imageUrl: ''
            };

            const response = await request(app)
                .post(`/items/${itemToUpdate._id}/update`)
                .type('form')
                .send(invalidItemUpdate);

            assert.equal(response.status, 400);
            assert.include(parseTextFromHTML(response.text, 'form'), 'imageUrl is required');
        });

        it('redirects to /item/:id after update', async () => {
            const itemUpdate = {
                title: 'Testing Title Update',
                description: 'Test Description',
                imageUrl: 'http://test.test'
            };

            const response = await request(app)
                .post(`/items/${itemToUpdate._id}/update`)
                .type('form')
                .send(itemUpdate);

            assert.equal(response.status, 302);
            assert.equal(response.headers.location, `/items/${itemToUpdate._id}`);
        });
    });

});
