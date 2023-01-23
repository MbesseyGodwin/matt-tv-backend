const express = require("express");

// videoRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /video.
const videoRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// This section will help you get a list of all the videos.
videoRoutes.route("/video").get(function (req, res) {
  let db_connect = dbo.getDb("matt-tv");
  db_connect
    .collection("video")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you get a single video by id
videoRoutes.route("/video/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("video").findOne(myquery, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

// This section will help you create a new video.
videoRoutes.route("/video/add").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
    videoId: req.body.videoId,
    videoName: req.body.videoName,
    owner: req.body.owner,
  };
  db_connect.collection("video").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// This section will help you update a video by id.
videoRoutes.route("/update/:id").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  let newvalues = {
    $set: {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    },
  };
  db_connect
    .collection("video")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    });
});

// This section will help you delete a video
videoRoutes.route("/video/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("video").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
});

module.exports = videoRoutes;
