/* global Rover */
describe('properties', () => {
    let rover;

    before(() => {
        rover = new Rover([]);
    });

    describe('instance', () => {
        it('should be a Rover instance', () => {
            rover.should.be.instanceof(Rover);
        });
    });

    describe('#elements', () => {
        it('should have no elements', () => {
            rover.elements.should.have.lengthOf(0);
        });
    });

    describe('#config', () => {
        it('should have the default values', () => {
            rover.config.should.deep.equal(rover.default);
        });
    });

    describe('#backward', () => {
        it('should have two values', () => {
            rover.backward.should.have.lengthOf(2);
        });
        it('should include the left arrow code', () => {
            rover.backward.should.include('ArrowLeft');
        });
        it('should include the up arrow code', () => {
            rover.backward.should.include('ArrowUp');
        });
    });

    describe('#forward', () => {
        it('should have two values', () => {
            rover.forward.should.have.lengthOf(2);
        });
        it('should include the right arrow code', () => {
            rover.forward.should.include('ArrowRight');
        });
        it('should include the down arrow code', () => {
            rover.forward.should.include('ArrowDown');
        });
    });

    describe('#validKeys', () => {
        it('should have four values', () => {
            rover.validKeys.should.have.lengthOf(4);
        });
        it('should include the right arrow code', () => {
            rover.validKeys.should.include('ArrowRight');
        });
        it('should include the down arrow code', () => {
            rover.validKeys.should.include('ArrowDown');
        });
        it('should include the left arrow code', () => {
            rover.validKeys.should.include('ArrowLeft');
        });
        it('should include the up arrow code', () => {
            rover.validKeys.should.include('ArrowUp');
        });
    });
});
