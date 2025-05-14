const { updateExistingDocuments } = require("./setup/user");

module.exports = (db) => {
  updateExistingDocuments(db)
    .then(() => {
      console.log("User documents updated");
    })
    .catch((err) => {
      console.error("Error updating User documents:", err);
    });
};
