const {assert} = require('chai');
const {connectDatabaseAndDropData, disconnectDatabase} = require('../setup-teardown-utils');
const {parseTextFromHTML, findImageElementBySource, buildItemObject, seedItemToDatabase} = require('../test-utils');

describe('User visits /items/:id/update', () => {

    let itemToUpdate;

    beforeEach(async () => {
        connectDatabaseAndDropData();
        itemToUpdate = await seedItemToDatabase();
    });

    afterEach(disconnectDatabase);

    describe('updates an item', () => {
        it('item is rendered after update', () => {
            const itemUpdateVales = {
                title: 'Test Title',
                description: 'Test Description',
                imageUrl: 'http://testimage.jpg'
            };

            browser.url(`/items/${itemToUpdate._id}/update`);

            browser.setValue('#title-input', itemUpdateVales.title);
            browser.setValue('#description-input', itemUpdateVales.description);
            browser.setValue('#imageUrl-input', itemUpdateVales.imageUrl);
            browser.click('#submit-button');

            assert.include(browser.getText('body'), itemUpdateVales.title);
            assert.include(browser.getText('body'), itemUpdateVales.description);
            assert.include(browser.getAttribute('#item-image', 'src'), itemUpdateVales.imageUrl);
        });
    });
});