const {assert} = require('chai');
const request = require('supertest');
const app = require('../../app');
const Item = require('../../models/item');
const {parseTextFromHTML, buildItemObject} = require('../test-utils');
const {connectDatabaseAndDropData, disconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /items/create', () => {

    beforeEach(connectDatabaseAndDropData);
    afterEach(disconnectDatabase);

    describe('GET', () => {
        it('renders empty input fields', async () => {
            const response = await request(app).get('/items/create');

            assert.equal(parseTextFromHTML(response.text, '#title-input'), '');
            assert.equal(parseTextFromHTML(response.text, '#imageUrl-input'), '');
            assert.equal(parseTextFromHTML(response.text, '#description-input'), '');
        });
    });

    describe('POST', () => {
        it('inserts a new item in the database', async () => {
            const itemToCreate = buildItemObject();
            await request(app)
                .post('/items/create')
                .type('form')
                .send(itemToCreate);

            const createdItem = await Item.findOne(itemToCreate);

            assert.isNotNull(createdItem, 'Item was not inserted into the database');

        });

        it('title is required', async () => {
            const item = new Item({
                title: '',
                description: 'Test Description',
                imageUrl: 'http://'
            });
            item.validateSync();
            assert.equal(item.errors.title.message, 'title is required');
        });

        it('description is required', async () => {
            const item = new Item({
                title: 'Test 1',
                description: '',
                imageUrl: 'http://'
            });
            item.validateSync();
            assert.equal(item.errors.description.message, 'description is required');
        });

        it('imageUrl is required', async () => {
            const item = new Item({
                title: 'Test 1',
                description: 'Test Description',
                imageUrl: ''
            });
            item.validateSync();
            assert.equal(item.errors.imageUrl.message, 'imageUrl is required');
        });

        it('returns an error if item is missing a title', async () => {
            const invalidItemToCreate = {
                title: '',
                description: 'test',
                imageUrl: 'https://www.placebear.com/200/300'
            };

            const response = await request(app)
                .post('/items/create')
                .type('form')
                .send(invalidItemToCreate);

            const allItems = await Item.find({});

            assert.equal(allItems.length, 0);
            assert.equal(response.status, 400);
            assert.include(parseTextFromHTML(response.text, 'form'), 'title is required');
        });

        it('returns an error if item is missing a description', async () => {
            const invalidItemToCreate = {
                title: 'Test 1',
                description: '',
                imageUrl: 'https://www.placebear.com/200/300'
            };

            const response = await request(app)
                .post('/items/create')
                .type('form')
                .send(invalidItemToCreate);

            const allItems = await Item.find({});

            assert.equal(allItems.length, 0);
            assert.equal(response.status, 400);
            assert.include(parseTextFromHTML(response.text, 'form'), 'description is required');
        });

        it('returns an error if item is missing an imageUrl', async () => {
            const invalidItemToCreate = {
                title: 'Test 1',
                description: 'test',
                imageUrl: ''
            };

            const response = await request(app)
                .post('/items/create')
                .type('form')
                .send(invalidItemToCreate);

            const allItems = await Item.find({});

            assert.equal(allItems.length, 0);
            assert.equal(response.status, 400);
            assert.include(parseTextFromHTML(response.text, 'form'), 'imageUrl is required');
        });

        it('redirects to / after submission', async () => {
            const itemToCreate = buildItemObject();
            const response = await request(app)
                .post('/items/create')
                .type('form')
                .send(itemToCreate);

            assert.equal(response.status, 302);
            assert.equal(response.headers.location, '/');
        });
    });

});
