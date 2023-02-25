const express = require('express')
const { loadjson } = require('../utils/jsonUtils')
const jwt = require('jsonwebtoken')

const router = express.Router()
const SECRET = 'sda67sds8sfbcy8'

userInfos = loadjson('./users.json')

router.post('/api/login', (req, res) => {
    let username = req.body.username
    let password = req.body.password
    if (req.body.username) {
        let isFind = false
        for (const item of userInfos) {
            if (item.username === username && item.password === password) {
                isFind = true
                break
            }
        }
        if (isFind) {
            const token = jwt.sign({
                _id: String(username)
            }, SECRET)
            res.send({
                token,
                data: {},
                meta: {
                    status: 200,
                    msg: '登陆成功'
                }
            })
        }
        else {
            res.send({
                data: {},
                meta: {
                    status: 422,
                    msg: '用户名或密码错误'
                }
            })
        }
    }
    else {
        res.send({
            data: {},
            meta: {
                status: 422,
                msg: '用户名或密码错误'
            }
        })
    }
})

function mx_auth(req, res, next) {
    const token = req.headers['x-auth-token']
    jwt.verify(token, SECRET, function (err, data) {
        if (err) return res.send({
            data: {},
            meta: {
                status: 401,
                msg: '未知用户访问错误'
            }
        })
        let username = data._id
        let userIndex = userInfos.map(item => item.username).indexOf(username)
        if (userIndex < 0) return res.send({
            data: {},
            meta: {
                status: 401,
                msg: '未知用户访问错误'
            }
        })
        req.username = username
        next()
    })
}

module.exports = {
    router,
    mx_auth
}