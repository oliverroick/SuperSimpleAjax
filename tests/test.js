if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

describe('SuperSimpleAjax', function() {
    beforeEach(function() {
        this.http_request = sinon.useFakeXMLHttpRequest();

        this.requests = [];

        this.http_request.onCreate = function (xhr) {
            this.requests.push(xhr);
        }.bind(this);
    });

    afterEach(function () {
        this.http_request.restore();
    });

    describe('GET', function() {
        it('should parse fetched data as JSON', function(done) {
            var response = {
                'id': 1,
                'text': 'Blah'
            }

            var success = function (result) {
                chai.expect(result.text).to.equal('Blah');
                chai.expect(result.id).to.equal(1);
                done();
            }

            SuperSimpleAjax.get('/posts/1', success, null);

            this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify(response));
        });

        it('should return error object', function(done) {
            var response = {
                "error": "Post not found"
            }
            var error = function (error) {
                chai.expect(error.status).to.equal(404);
                chai.expect(error.statusText).to.equal("Not Found");
                chai.expect(error.error_detail).to.equal('{"error":"Post not found"}');
                done();
            }

            SuperSimpleAjax.get('/posts/1', null, error);

            this.requests[0].respond(404, { 'Content-Type': 'text/json' }, JSON.stringify(response));
        });
    });

    describe('POST', function() {
        it('should parse fetched data as JSON', function(done) {
            var data = {
                title: 'foo',
                body: 'bar',
                userId: 1
            }

            var success = function (result) {
                chai.expect(result.title).to.equal('foo');
                chai.expect(result.body).to.equal('bar');
                chai.expect(result.userId).to.equal(1);
                done();
            }

            SuperSimpleAjax.post('/posts/', success, null, data);

            this.requests[0].respond(201, { 'Content-Type': 'text/json' }, JSON.stringify(data));
        });

        it('should return error object', function(done) {
            var data = {
                title: 'foo',
                body: 'bar',
                userId: 1
            }

            var error = function (error) {
                chai.expect(error.status).to.equal(404);
                chai.expect(error.statusText).to.equal("Not Found");
                done();
            }

            SuperSimpleAjax.post('/posts/', null, error, data);

            this.requests[0].respond(404, { 'Content-Type': 'text/json' }, JSON.stringify({}));
        });
    });

    describe('PATCH', function() {
        it('should parse fetched data as JSON', function(done) {
            var data = {
                title: 'foo',
                body: 'bar',
                userId: 1
            }

            var success = function (result) {
                chai.expect(result.title).to.equal('foo');
                chai.expect(result.body).to.equal('bar');
                chai.expect(result.userId).to.equal(1);
                done();
            }

            SuperSimpleAjax.patch('/posts/1', success, null, data);

            this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify(data));
        });

        it('should return error object', function(done) {
            var data = {
                title: 'foo',
                body: 'bar',
                userId: 1
            }

            var error = function (error) {
                chai.expect(error.status).to.equal(404);
                chai.expect(error.statusText).to.equal("Not Found");
                chai.expect(error.error_detail).to.equal('{"error":"Post not found"}');
                done();
            }

            SuperSimpleAjax.patch('/posts/', null, error, data);

            this.requests[0].respond(404, { 'Content-Type': 'text/json' }, JSON.stringify({"error": "Post not found"}));
        });
    });

    describe('PUT', function() {
        it('should parse fetched data as JSON', function(done) {
            var data = {
                title: 'foo',
                body: 'bar',
                userId: 1
            }

            var success = function (result) {
                chai.expect(result.title).to.equal('foo');
                chai.expect(result.body).to.equal('bar');
                chai.expect(result.userId).to.equal(1);
                done();
            }

            SuperSimpleAjax.put('/posts/1', success, null, data);

            this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify(data));
        });

        it('should return error object', function(done) {
            var data = {
                title: 'foo',
                body: 'bar',
                userId: 1
            }

            var error = function (error) {
                chai.expect(error.status).to.equal(404);
                chai.expect(error.statusText).to.equal("Not Found");
                chai.expect(error.error_detail).to.equal('{"error":"Post not found"}');
                done();
            }

            SuperSimpleAjax.put('/posts/', null, error, data);

            this.requests[0].respond(404, { 'Content-Type': 'text/json' }, JSON.stringify({"error": "Post not found"}));
        });
    });

    describe('DELETE', function() {
        it('should parse fetched data as JSON', function(done) {
            var success = function (result) {
                console.log(result)
                chai.expect(result).to.equal(null);
                done();
            }

            SuperSimpleAjax.del('/posts/1', success, null);

            this.requests[0].respond(204, { 'Content-Type': 'text/json' }, '');
        });

        it('should return error object', function(done) {
            var response = {
                "error": "Post not found"
            }
            var error = function (error) {
                chai.expect(error.status).to.equal(404);
                chai.expect(error.statusText).to.equal("Not Found");
                chai.expect(error.error_detail).to.equal('{"error":"Post not found"}');
                done();
            }

            SuperSimpleAjax.del('/posts/1', null, error);

            this.requests[0].respond(404, { 'Content-Type': 'text/json' }, JSON.stringify(response));
        });
    });
});
