require("dotenv").config();

module.exports.encryptedString  = async (string) => {
    const encryptedString = btoa(string)
    // console.log(encryptedString)
    return encryptedString
};

module.exports.decryptedString  = async (hash) => {
    var bytes  = atob(hash);
    return bytes
};