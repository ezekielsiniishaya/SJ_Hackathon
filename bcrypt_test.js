const bcrypt = require("bcryptjs");

const hashedPassword =
  "$2a$10$iUiCh1zL2oBsBwUwD2dxseW1Hrmqw63pvJyqgKjsGX7cFqm1nMImq";
const passwordToCheck = "1234";

bcrypt
  .compare(passwordToCheck, hashedPassword)
  .then((isMatch) => {
    console.log("Password match:", isMatch); // Should print true
  })
  .catch((err) => {
    console.error(err);
  });

const passwordToHash = "1234"; // Password you want to hash
bcrypt.hash(passwordToHash, 10, (err, hashedPassword) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("Hashed Password:", hashedPassword); // Compare this with the hash in the database
});
