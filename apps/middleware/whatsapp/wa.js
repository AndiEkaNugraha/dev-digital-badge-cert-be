const axios = require("axios");

module.exports.notifWa = (phoneNumber, statusFpb) => {

    const token = 'ddJ36fQ93xJiSi3eki8YVO8Mj6B4NDECwMeff6m6QwtgjXbZRFnhcWN7yE2Lu2XA'
    const urlDomain = 'https://jogja.wablas.com/api/send-message'

    const config = {
        method: "POST",
        headers: {
            authorization: token,
        },
        url: urlDomain,
    };


    var message = ''
    if (statusFpb === 0) {
        var message = 'Email notifikasi create FPB from maker'
    }

    const requestBody = {
        phone: phoneNumber,
        message: message
    }

    axios.post(urlDomain, requestBody, config)
        .then(res => {
            console.log(res)
            return false
        })
        .catch(err => {
            if (err !== "") {
                console.log(err)
            }
        });
};
