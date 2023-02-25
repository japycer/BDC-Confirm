// 导入模块
const express = require('express')
// 导入路由
const fdcqApi = require('./routers/fdcqApi')
const qlrApi = require('./routers/qlrApi')
const zszmApi = require('./routers/zszmApi')
const hApi = require('./routers/hApi')
const { router: loginApi, mx_auth } = require('./routers/loginApi')

const app = express()

const port = 3000

// 配置解析表单事件的中间件
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 设置请求头格式
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

// 设置登陆路由
app.use(loginApi)
// 设置全局中间件，非loginApi使用
app.use(mx_auth)
app.use(fdcqApi)
app.use(qlrApi)
app.use(zszmApi)
app.use(hApi)

// 开启监听
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// run >> set-ExecutionPolicy RemoteSigned >> nodemon .\mian.js