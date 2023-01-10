const express = require("express");

// facilitiesRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /facilities.
const facilityRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// This section will help you get a list of all the facilities.
facilityRoutes.route("/facility").get(function (req, res) {
  let db_connect = dbo.getDb("employees");
  db_connect
    .collection("facilities")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you get a single facilities by id
facilityRoutes.route("/facility/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("facilities").findOne(myquery, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

// This section will help you create a new facilities.
facilityRoutes.route("/facility/add").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
    name: req.body.name,
    status: req.body.status,
    lga: req.body.lga,
  };
  db_connect.collection("facilities").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// This section will help you update a facilities by id.
facilityRoutes.route("/facility/update/:id").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  let newvalues = {
    $set: {
      name: req.body.name,
      status: req.body.status,
      lga: req.body.lga,
    },
  };
  db_connect
    .collection("facilities")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated!");
      response.json(res);
    });
});

// This section will help you delete a facilities
facilityRoutes.route("/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("facilities").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
});

module.exports = facilityRoutes;
