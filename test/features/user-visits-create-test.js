const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('User visits /item/create', () => {
    describe('posts a new item', () => {
        it('item is rendered at root', () => {
            const item = buildItemObject();

            browser.url('/items/create');
            browser.setValue('#title-input', item.title);
            browser.setValue('#description-input', item.description);
            browser.setValue('#imageUrl-input', item.imageUrl);
            browser.click('#submit-button');

            assert.include(browser.getText('body'), item.title);
            assert.include(browser.getAttribute('body img', 'src'), item.imageUrl);
        });


        it('item can be viewed singularly', () => {
            const item = buildItemObject();

            browser.url('/items/create');
            browser.setValue('#title-input', item.title);
            browser.setValue('#description-input', item.description);
            browser.setValue('#imageUrl-input', item.imageUrl);
            browser.click('#submit-button');

            browser.click('.item-card a');
            assert.include(browser.getText('body'), item.description);
        });
    });
});
