Mongo.Collection.prototype.autoFields = function (fields) {
  let collection = this;

  collection.before.insert(function (userId, doc) {
    for (let functionName of Object.keys(fields)) {
      doc[functionName] = fields[functionName](doc, userId);
    }
  });

  collection.before.update(function (userId, doc, fieldNames, modifier) {
    modifier.$set = modifier.$set || {};
    try {
      // Use minimongo package to simulate transform of the object
      Package.minimongo.LocalCollection._modify(doc, modifier);
    } catch (err) {

    }
    for (let functionName of Object.keys(fields)) {
      modifier.$set[functionName] = fields[functionName](doc, userId);
    }
  });
};
