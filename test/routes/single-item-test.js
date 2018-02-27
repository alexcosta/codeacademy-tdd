const {assert} = require('chai');
const request = require('supertest');
const app = require('../../app');
const {parseTextFromHTML, findImageElementBySource, seedItemToDatabase} = require('../test-utils');
const {connectDatabaseAndDropData, disconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /items/:id', () => {

    let itemToUpdate;

    beforeEach(async () => {
        connectDatabaseAndDropData();
        itemToUpdate = await seedItemToDatabase();
    });

    afterEach(disconnectDatabase);

    describe('GET', () => {
        it('renders the item title', async () => {
            const response = await request(app).get(`/items/${itemToUpdate._id}`);
            assert.include(parseTextFromHTML(response.text, '#item-title'), itemToUpdate.title);
        });

        it('renders the item description', async () => {
            const response = await request(app).get(`/items/${itemToUpdate._id}`);
            assert.include(parseTextFromHTML(response.text, '#item-description'), itemToUpdate.description);
        });

        it('renders the item image', async () => {
            const response = await request(app).get(`/items/${itemToUpdate._id}`);
            assert.exists(findImageElementBySource(response.text, itemToUpdate.imageUrl));
        });

        it('renders an update link', async () => {
            const response = await request(app).get(`/items/${itemToUpdate._id}`);
            assert.exists(parseTextFromHTML(response.text, '#update-button'), );
        });

        it('renders a back link', async () => {
            const response = await request(app).get(`/items/${itemToUpdate._id}`);
            assert.exists(parseTextFromHTML(response.text, '#back-button'), );
        });
    });

});
