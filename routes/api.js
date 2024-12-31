/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
import { MongoClient, ObjectId, ReturnDocument } from 'mongodb';


const apiRoutes = async function (app) {
  //DB setup
  const mdbClient = new MongoClient(process.env.MONGO_URI);
  const dbName = 'fcc-backend';

  let booksCollection;

  const connectMongoDatabase = async () => {
    await mdbClient.connect();
    console.log('Connected successfully to server');
    const db = mdbClient.db(dbName);
    booksCollection = db.collection('books');

    return;
  }
  await connectMongoDatabase().then(
    () => {
      console.log('DB Connection Established');
    }
  ).catch(
    e => {
      console.error(e);
    }
  );

  app.route('/api/books')
    /*
    response will be array of book objects
    json res format: 
    [
      {
        "_id": bookid, 
        "title": book_title, 
        "commentcount": num_of_comments 
      },
      ...
    ]
    */
    .get(async (req, res) => {
      try {
        const books = [];
        const cursor = await booksCollection.find({});
        for (const book of await cursor.toArray()) {
          const bookRow = {
            _id: book._id,
            title: book.title,
            commentcount: book.comments.length
          }
          books.push(bookRow)
        }
        const sorted = books.sort((a, b) => a.title.toLowerCase() - b.title.toLowerCase());
        res.json(sorted);
        console.log(`${req.path}, ${req.method}, Completed`)
        return;
      } catch (e) {
        console.error(e);
        return;
      }
    })

    //response will contain new book object including atleast _id and title
    .post(async (req, res) => {
      try {
        let title = req.body.title;
        let result;
        const newBook = {
          title,
          comments: []
        };
        if (newBook.title ? false : true) {
          result = { ok: false, out: 'missing required field title' };
        } else {
          await booksCollection.insertOne(newBook).then(
            async (newItem) => {
              await booksCollection.findOne({ _id: newItem.insertedId }).then(
                (item) => {
                  const { title, _id } = item;
                  result = { ok: true, out: { _id, title } };
                }
              ).catch(
                (rejected) => {
                  result = { error: `Unable to locate newly created record: ${rejected}` };
                });
            }).catch(error => { result = { ok: false, out: `New Item Insert Failed: ${error}` } })
        }
        result.ok ? res.json(result.out) : res.send(result.out);
        return;
      } catch (e) {
        console.error(e);
        return;
      }

    })

    //if successful response will be 'complete delete successful'
    .delete(async (req, res) => {
      try {
        let result;
        await booksCollection.countDocuments({}, {}).then(
          async (count) => {
            await booksCollection.deleteMany({}).then(
              rslt => {
                if (count === rslt.deletedCount) {
                  result = 'complete delete successful'
                } else {
                  result = 'complete delete failed'
                }
              }
            ).catch(err => { console.error(err); })
          }).catch(err => { console.error(err); })
        res.send(result);
        return;
      } catch (e) {
        console.error(e);
        return;
      }
    });



  app.route('/api/books/:id')
    /*
    json res format: 
    {
      "_id": bookid, 
      "title": book_title, 
      "comments": [
        comment,
        comment,
        ...
      ]
    }
    */
    .get(async (req, res) => {
      try {
        let bookid = req.params.id;
        const objId = new ObjectId(bookid);

        await booksCollection.findOne(objId).then(rslt => {
          if (rslt === null) {
            res.send('no book exists');
          } else {
            const { _id, title, comments } = rslt;
            res.json({ _id, title, comments });
          }
        });
        return;
      } catch (e) {
        console.error(e);
        return;
      }
    })

    //json res format same as .get
    .post(async (req, res) => {
      try {
        let bookid = req.params.id;
        let comment = req.body.comment;
        const objId = new ObjectId(bookid);
        if (comment) {
          const update = { $push: { comments: comment } };
          await booksCollection.findOneAndUpdate(
            { _id: objId },
            update,
            { includeResultMetadata: true, returnDocument: "after" }
          ).then(rslt => {
            if (rslt.value === null) {
              res.send('no book exists');
            } else if (rslt.ok) {
              const { _id, title, comments } = rslt.value;
              res.json({ _id, title, comments, commentcount: comments.length });
            } else {
              throw new Error(rslt);
            }
          });
        } else {
          res.send('missing required field comment');
        }
        return;
      } catch (e) {
        console.error(e);
        return;
      }
    })

    //if successful response will be 'delete successful'
    .delete(async (req, res) => {
      try {
        let bookid = req.params.id;
        const objId = new ObjectId(bookid);
        const dbResult = await booksCollection.findOneAndDelete({ _id: objId }, { includeResultMetadata: true });
        if (dbResult.value === null) {
          res.send('no book exists');
        } else if (dbResult.ok && dbResult.lastErrorObject.n > 0) {
          res.send('delete successful');
        } else {
          throw new Error(dbResult);
        }
        return;
      } catch (e) {
        console.error(e);
        return;
      }
    });

};

export default { apiRoutes };