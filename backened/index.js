const express = require('express')
const axios = require('axios');
require('dotenv').config()
const app = express()
const cors = require('cors')

const port = 5000;

var access_token, refresh_token;

const getTokens = async () => {
    const response = await axios.post("http://192.46.214.215/api/v1/security/login", {
        "password": process.env.USER_PASSWORD,
        "provider": "db",
        "refresh": true,
        "username": process.env.USER_NAME
    })

    if (response) {
        var tokens = response.data;
        console.log(tokens)
        access_token = tokens.access_token;
        refresh_token = tokens.refresh_token
    }

}

const refreshAccessToken = async () => {
    const response = await axios.post(" http://192.46.214.215/api/v1/security/refresh", "", {
        headers: {
            authorization: `Bearer ${refresh_token}`
        }
    })

    if (response) {
        console.log(response.data)
        access_token = response.data.access_token
    }
}

const interval = setInterval(() => {
    access_token = refreshAccessToken()
}, 120 * 1000)


getTokens()



const getGuestToken = async () => {

    const response = await axios.post(' http://192.46.214.215/api/v1/security/guest_token/',
        {

            "user": {
                "username": "rshukla",
                "first_name": "roshni",
                "last_name": "shukla"
            },
            "resources": [{
                "type": "dashboard",
                "id": "5"
            }],
            "rls": [
            ]
        },
        {
            headers: {
                authorization: `Bearer ${access_token}`
            }
        }
    )

    if (response) {
        console.log(response.data)
        return response?.data?.token
    }

}


/****************************************GET REQUEST*********************************************    */


app.get('/get',cors(), async (req, res) => {
    const guest_token = await getGuestToken()
    if(guest_token)
        res.status(200).send(guest_token)
    else 
        res.status(500).send("Internal Server error")
})




app.listen(`${port}`)