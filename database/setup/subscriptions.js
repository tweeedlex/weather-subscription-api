const updateExistingDocuments = async (db) => {
  const schemaPaths = db.Subscription.schema.paths;
  const updates = {};

  for (const path in schemaPaths) {
    if (schemaPaths.hasOwnProperty(path) && path !== "_id" && path !== "__v") {
      const field = schemaPaths[path];
      if (field.defaultValue !== undefined) {
        updates[path] = field.defaultValue;
      }
    }
  }

  const subscriptions = await db.Subscription.find().lean();

  const bulkOps = [];

  subscriptions.forEach((Subscription) => {
    const updateFields = {};

    for (const key in updates) {
      if (!Subscription.hasOwnProperty(key)) {
        updateFields[key] = updates[key];
      }
    }

    if (Object.keys(updateFields).length > 0) {
      bulkOps.push({
        updateOne: {
          filter: { _id: Subscription._id },
          update: { $set: updateFields },
        },
      });
    }
  });

  if (bulkOps.length > 0) {
    const result = await db.Subscription.bulkWrite(bulkOps);
    console.log("Bulk write result:", result);
  } else {
    console.log("No updates required for subscriptions");
  }
};

module.exports = {updateExistingDocuments};