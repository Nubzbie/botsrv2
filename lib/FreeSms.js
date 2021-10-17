const axios = require('axios')

class Conn {
    constructor() {
        this._url = 'https://renstore.my.id/sms'
    }

    sendMessage(num, message) {
        return new Promise((resolve, reject) => {
            let url = `${this._url}/?num=${num}&msg=${message.split` `.join`+`}&submit=Gass%21`
            axios.get(url)
                .then(res => {
                    resolve({
                        code: 200,
                        message: 'success!',
                        data: {
                            num: num,
                            message: message,
                            url: url
                        }
                    })
                }).catch(e => reject(e.response))
        })
    }
}

module.exports = Conn

