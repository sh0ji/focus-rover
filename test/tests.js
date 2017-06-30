/* global Rover, expect, __html__ */
describe('Rover', () => {
    const fixturePath = 'test/fixture/list.html';
    const keypresses = 4;
    let rover;
    let elements;

    beforeEach(() => {
        document.body.innerHTML = __html__[fixturePath];
    });

    afterEach(() => {
        document.body.innerHTML = '';
        elements = null;
        rover = null;
    });

    describe('empty instance', () => {
        beforeEach(() => {
            rover = new Rover();
        });

        describe('instance', () => {
            it('should be a Rover instance', () => {
                expect(rover).to.be.instanceof(Rover);
            });
        });

        describe('#elements', () => {
            it('should have no elements', () => {
                expect(rover.elements).to.have.lengthOf(0);
            });

            it('should add elements', () => {
                rover.elements = document.querySelectorAll('li>a');
                expect(rover.elements).to.have.lengthOf(4);
            });
        });

        describe('#config', () => {
            it('should have the default values', () => {
                expect(rover.config).to.deep.equal(rover.default);
            });
        });

        describe('#backward', () => {
            it('should have two values', () => {
                expect(rover.backward).to.have.lengthOf(2);
            });
            it('should include the left arrow code', () => {
                expect(rover.backward).to.include('ArrowLeft');
            });
            it('should include the up arrow code', () => {
                expect(rover.backward).to.include('ArrowUp');
            });
        });

        describe('#forward', () => {
            it('should have two values', () => {
                expect(rover.forward).to.have.lengthOf(2);
            });
            it('should include the right arrow code', () => {
                expect(rover.forward).to.include('ArrowRight');
            });
            it('should include the down arrow code', () => {
                expect(rover.forward).to.include('ArrowDown');
            });
        });

        describe('#validKeys', () => {
            it('should have four values', () => {
                expect(rover.validKeys).to.have.lengthOf(4);
            });
            it('should include the right arrow code', () => {
                expect(rover.validKeys).to.include('ArrowRight');
            });
            it('should include the down arrow code', () => {
                expect(rover.validKeys).to.include('ArrowDown');
            });
            it('should include the left arrow code', () => {
                expect(rover.validKeys).to.include('ArrowLeft');
            });
            it('should include the up arrow code', () => {
                expect(rover.validKeys).to.include('ArrowUp');
            });
        });
    });

    describe('list instance', () => {
        function keyDown(code, count = 1) {
            if (count > 0) {
                const event = new KeyboardEvent('keydown', { code });
                document.activeElement.dispatchEvent(event);
                keyDown(code, count - 1);
            }
            return true;
        }

        function keyDownTest(code, config = { reverse: false, wrap: true, count: keypresses }) {
            describe(code, () => {
                let keypress = 0;
                beforeEach(() => {
                    keypress += 1;
                    keyDown(code, keypress);
                });
                for (let i = 0; i < config.count; i += 1) {
                    it(`should move focus ${i} times`, () => {  // eslint-disable-line
                        let k = keypress;
                        if (config.wrap) {
                            const mod = keypress % rover.elements.length;
                            k = (config.reverse) ?
                                (rover.elements.length - mod) % rover.elements.length :
                                mod;
                        } else {
                            if (keypress > rover.lastIndex) k = rover.lastIndex;
                            if (config.reverse) k = 0;
                        }
                        expect(document.activeElement).to.equal(rover.elements[k]);
                        // expect(rover.currentElement).to.equal(rover.elements[k]);
                    });
                }
            });
        }

        describe('defaults', () => {
            beforeEach(() => {
                elements = document.querySelectorAll('li>a');
                rover = new Rover(elements);
                rover.elements[0].focus();
            });

            describe('#elements', () => {
                it('should have four elements', () => {
                    expect(rover.elements).to.have.lengthOf(4);
                });
            });

            describe('#lastIndex', () => {
                it('should be the last element', () => {
                    expect(rover.lastIndex).to.equal(elements.length - 1);
                });
            });

            describe('#currentElement', () => {
                it('should be the first element', () => {
                    expect(rover.currentElement).to.equal(elements[0]);
                });
            });

            describe('initial state', () => {
                it('activeElement should be the first element', () => {
                    expect(document.activeElement).to.equal(elements[0]);
                });
            });

            describe('keydown', () => {
                keyDownTest('ArrowDown');
                keyDownTest('ArrowRight');
                keyDownTest('ArrowUp', { reverse: true });
                keyDownTest('ArrowLeft', { reverse: true });
            });
        });

        describe('{ wrap: false }', () => {
            beforeEach(() => {
                elements = document.querySelectorAll('li>a');
                rover = new Rover(elements, { wrap: false });
                elements[0].focus();
            });

            describe('keydown', () => {
                keyDownTest('ArrowDown', { reverse: false, wrap: false });
                keyDownTest('ArrowRight', { reverse: false, wrap: false });
                keyDownTest('ArrowUp', { reverse: true, wrap: false });
                keyDownTest('ArrowLeft', { reverse: true, wrap: false });
            });
        });

        describe('non-focusable elements', () => {
            beforeEach(() => {
                elements = document.querySelectorAll('li');
                elements.forEach(el => el.firstChild.removeAttribute('href'));
                rover = new Rover(elements);
                elements[0].focus();
            });

            describe('keydown', () => {
                keyDownTest('ArrowDown');
                keyDownTest('ArrowRight');
                keyDownTest('ArrowUp', { reverse: true });
                keyDownTest('ArrowLeft', { reverse: true });
            });
        });
    });
});
