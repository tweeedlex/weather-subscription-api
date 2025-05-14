const { updateExistingDocuments } = require("./setup/subscriptions");

module.exports = (db) => {
  updateExistingDocuments(db)
    .then(() => {
      console.log("Subscription documents updated");
    })
    .catch((err) => {
      console.error("Error updating User documents:", err);
    });
};
