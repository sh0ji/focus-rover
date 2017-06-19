/* global Rover, fixture */
const page = 'list.html';

describe('defaults', () => {
    let rover;
    let elements;

    function keyDown(code, shiftKey) {
        const event = new KeyboardEvent('keydown', { code, shiftKey });
        document.activeElement.dispatchEvent(event);
    }

    before(() => {
        fixture.setBase('test/fixture');
        fixture.load(page);
        elements = fixture.el.querySelectorAll('li>a');
        rover = new Rover(elements);
        elements[0].focus();
    });

    after(() => {
        fixture.cleanup();
    });

    describe('#elements', () => {
        it('should have four elements', () => {
            rover.elements.should.have.lengthOf(4);
        });
    });

    describe('initial state', () => {
        it('activeElement should be the first element', () => {
            document.activeElement.should.equal(elements[0]);
        });
    });

    describe('wrap with ArrowDown', () => {
        beforeEach(() => {
            keyDown('ArrowDown');
        });

        it('activeElement should be the second element', () => {
            document.activeElement.should.equal(elements[1]);
        });

        it('activeElement should be the third element', () => {
            document.activeElement.should.equal(elements[2]);
        });

        it('activeElement should be the fourth element', () => {
            document.activeElement.should.equal(elements[3]);
        });

        it('activeElement should be the first element again', () => {
            document.activeElement.should.equal(elements[0]);
        });
    });

    describe('wrap with ArrowRight', () => {
        before(() => {
            for (let i = 0; i < 5; i += 1) {
                keyDown('ArrowRight');
            }
        });

        it('activeElement should be the second element', () => {
            document.activeElement.should.equal(elements[1]);
        });
    });

    describe('wrap backwards with ArrowUp', () => {
        before(() => {
            keyDown('ArrowUp');
            keyDown('ArrowUp');
        });

        it('activeElement should wrap to the last element', () => {
            document.activeElement.should.equal(elements[rover.lastIndex]);
        });
    });
});
