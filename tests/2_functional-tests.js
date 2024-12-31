/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/
'use strict'

import * as chai from "chai";
import chaiHttp from "chai-http";
import server from '../server.js';
import { suite, test } from "mocha";

chai.use(chaiHttp);

const assert = chai.assert;

suite('Functional Tests', function () {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  suite('example test', () => {
    test('#example Test GET /api/books', function (done) {
      chai.request(server).keepOpen()
         .get('/api/books')
         .end((err, res) => {
           assert.equal(res.status, 200, 'Response Should be 200');
           assert.typeOf(res.body, 'Array', 'response should be an array');
           assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
           assert.property(res.body[0], 'title', 'Books in array should contain title');
           assert.property(res.body[0], '_id', 'Books in array should contain _id');
           //done();
         });
    });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */
  suite('Routing tests', function () {


    suite('POST /api/books with title => create book object/expect book object', function () {

      test('Test POST /api/books with title', function (done) {
        assert.equal(true, true, 'Temp Test');
        done();
      });

      test('Test POST /api/books with no title given', function (done) {
        assert.equal(true, true, 'Temp Test');
        done();
      });

    });


    suite('GET /api/books => array of books', function () {

      test('Test GET /api/books', function (done) {
        assert.equal(true, true, 'Temp Test');
        done();
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function () {

      test('Test GET /api/books/[id] with id not in db', function (done) {
        assert.equal(true, true, 'Temp Test');
        done();
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        assert.equal(true, true, 'Temp Test');
        done();
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function () {

      test('Test POST /api/books/[id] with comment', function (done) {
        assert.equal(true, true, 'Temp Test');
        done();
      });

      test('Test POST /api/books/[id] without comment field', function (done) {
        assert.equal(true, true, 'Temp Test');
        done();
      });

      test('Test POST /api/books/[id] with comment, id not in db', function (done) {
        assert.equal(true, true, 'Temp Test');
        done();
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function () {

      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        assert.equal(true, true, 'Temp Test');
        done();
      });

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        assert.equal(true, true, 'Temp Test');
        done();
      });

    });

  });

});
