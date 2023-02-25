const oracledb = require("oracledb");

oracledb.autoCommit = true
let connection = null;
let firstInit = true;

async function init(config) {
    if (!firstInit) {
        firstInit = false;
        return
    }
    try {
        oracledb.createPool({
            _enableStats: true,
            ...config,
            poolAlias: "jap"
        }).then(async (data) => {
            connection = await oracledb.getPool('jap').getConnection();
            // NEW
            console.log("oracle数据库连接成功");
        })
    } catch (ex) {
        console.log("oracle数据库连接出错");
    }
}

function execute(sql) {
    return new Promise(function (resolve, reject) {
        try {
            if (!connection) {
                return resolve({
                    status: -1,
                    msg: "connection为空,是否已经初始化",
                    detail: '执行execute发生未知错误'
                })
            }
            connection.execute(
                sql,
                function (err, result) {
                    if (err) {
                        console.log(err.message)
                        resolve({
                            status: -1,
                            msg: '执行sql语句失败',
                            detail: err.message
                        })
                        return
                    }
                    resolve(result)
                });
        } catch (ex) {
            console.log('执行execute出错')
            resolve({
                status: -1,
                msg: "执行sql语句出错",
                detail: ex + '执行execute发生未知错误'
            })
        }
    })
}

function close() {
    if (connection) {
        connection.close(
            function (err) {
                if (err) {
                    console.log(err.message)
                    return
                }
                console.log('oracle数据库断开成功')
            });
    }
}


module.exports = {
    init,
    execute,
    close
}