import crypto from 'crypto';

/**
 * Compares an input password with a stored hashed password (SHA1)
 * @param {string} password - The input password to verify
 * @param {string} hashedPassword - The stored hashed password (SHA1)
 * @returns {boolean} - Whether the password is correct
 */
function verifyPasswordSHA1(password, hashedPassword) {
  const hash = crypto.createHash('sha1');
  hash.update(password);
  const hashedInputPassword = hash.digest('hex');
  console.log(hashedInputPassword, hashedPassword);
  return hashedInputPassword == hashedPassword;
}

// Example usage
const inputPassword = 'walaa'; // Password entered by the user during login
const storedHashedPassword = 'b4d6329910b8443ff23a3b98e8fb00e0e7471097'; // Retrieved from your database

const isMatch = verifyPasswordSHA1(inputPassword, storedHashedPassword);

if (isMatch) {
  console.log('Password is correct');
} else {
  console.log('Password is incorrect');
}
