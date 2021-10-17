const axios = require('axios')
const crypto = require('crypto')

class KRitel {
    constructor(_self) {
        Object.assign(this, _self)
        this._url = {
            register: 'https://renstore.my.id/regsms.php',
            login: 'https://renstore.my.id/apisms.php',
            sender: 'https://renstore.my.id/sendsms.php',
        }
        this.email = ''
        this.token = null

        this.generateEmail()
            .then(res => {
                let url = `${this._url.sender}?token=${res?.token}&tujuan=${this?.tujuan}&pesan=${this?.pesan}`
                this.token = res?.token
                axios.get(url)
                    .then(v => {
                        console.log(
                            JSON.stringify(
                                Object.assign(v.data, {
                                    email: this.email,
                                    token: res?.token,
                                    data: {
                                        pesan: this?.pesan,
                                        tujuan: this?.tujuan
                                    }
                                })
                            , null, '\t')
                        )
                    }).catch(e => {})
            }).catch(e => console.log(e))
    }

    register(email) {
        return new Promise((resolve, reject) => {
            var url = `${this._url.register}?num=${email}&submit=gass`
            axios.get(url)
                .then(res => {
                    resolve({...res?.data})
                })
                .catch(e => reject(e.response))
        })
    }

    login(email) {
        return new Promise(async (resolve, reject) => {
            await this.register(email)
            var url = `${this._url.login}?num=${email}&submit=gass`
            axios.get(url)
                .then(res => {
                    resolve({...res?.data})
                })
                .catch(e => reject(e.response))
        })
    }

    generateEmail() {
        return new Promise(async resolve => {
            var str = crypto.randomBytes(15).toString('hex')
            this.email = `${str}@mail.to`
            var _token = ''
            try {
                var key = await this.login(this.email)
                _token = key?.apikey
            } catch (e) {
                reject(e)
            } finally {
                this.token = _token
                resolve({ token: _token })
            }
        })
    }
}

let text = process.argv.splice(2).join` `

class Conn {
    sendMessage(num, message) {
        new KRitel({
            tujuan: num,
            pesan: message
        })
        return 
    }
}

module.exports = Conn
