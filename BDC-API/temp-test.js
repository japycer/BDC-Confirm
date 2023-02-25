const express = require('express')
const jwt = require('jsonwebtoken')
const { loadjson } = require('./utils/jsonUtils')

const app = express()
const port = 3000

const SECRET = 'sda67sds8sfbcy8'
userInfos = loadjson('./users.json')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.all("*", function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type,X-Auth-Token");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options') {
        res.sendStatus(200);  //让options尝试请求快速结束}
    }
    else {
        next();
    }
})

app.post('/api/login', (req, res) => {
    let username = req.body.username
    let password = req.body.password
    let headers = req.headers
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


app.post('/api/test', (req, res) => {
    const token = req.headers['x-auth-token']
    jwt.verify(token, SECRET, function (err, data) {
        if (!err) return {
            data: {},
            meta: {
                status: 401,
                msg: '未知用户访问错误'
            }
        }
        let username = data._id
        let userIndex = userInfos.map(item => item.username).indexOf(username)
        if (userIndex < 0) return {
            data: {},
            meta: {
                status: 401,
                msg: '未知用户访问错误'
            }
        }
        next()
    })
    res.send({
        data: {},
        meta: {
            status: 200,
            msg: '测试接口'
        }
    })
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

