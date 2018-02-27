const Item = require('../../models/item');
const {assert} = require('chai');
const {mongoose, databaseUrl, options} = require('../../database');

describe('Model: Item', () => {
    beforeEach(async () => {
        await mongoose.connect(databaseUrl, options);
        await mongoose.connection.db.dropDatabase();
    });

    afterEach(async () => {
        await mongoose.disconnect();
    });

    describe('#title', () => {
        it('is a String', () => {
            const titleAsNumber = 1;
            const item = new Item({title: titleAsNumber});
            assert.strictEqual(item.title, titleAsNumber.toString());
        });
    });

    describe('#description', () => {
        it('is a String', () => {
            const descriptionAsNumber = 1;
            const item = new Item({title: descriptionAsNumber});
            assert.strictEqual(item.title, descriptionAsNumber.toString());
        });
    });

    describe('#imageUrl', () => {
        it('is a String', () => {
            const imageUrlAsNumber = 1;
            const item = new Item({title: imageUrlAsNumber});
            assert.strictEqual(item.title, imageUrlAsNumber.toString());
        });
    });

});
