function generateCertificateNumber() {
  // Get current date and time
  let now = new Date();

  // Extract year, month, and date
  let year = now.getFullYear();
  let month = ("0" + (now.getMonth() + 1)).slice(-2); // Months are zero-based
  let day = ("0" + now.getDate()).slice(-2); // Add leading zero if needed

  // Generate a random number (e.g., between 1000 and 9999)
  let randomNumber = Math.floor(1000 + Math.random() * 9999);

  // Combine into the certificate number format
  let certificateNumber = `${year}${month}${day}${randomNumber}`;

  return certificateNumber;
}

module.exports = generateCertificateNumber;
