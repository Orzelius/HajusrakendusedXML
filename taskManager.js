const axios = require('axios')
module.exports = taskManager;

class taskManager {
    constructor(name, password){
        this.user.name = name;
        this.user.password = password;
    }

    getUser(user){
        axios.post('http://demo2.z-bit.ee/users/get-token', {
            // user.name,
            // user.password
        })
        .then((res) => {
            inspect(`statusCode: ${res.statusCode}`);
            inspect(res.data);
        })
        .catch((error) => {
            inspect(error);
        })
    
        res.end();
    }
}

class User{
    constructor(name, )
}