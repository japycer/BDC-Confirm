const fs = require('fs')
const path = require('path')
/* 判断文件是否存在的函数
*@path_way, 文件路径
 */
function isFileExisted(path_way) {
    if (fs.existsSync(path_way)) return;
    fs.appendFileSync(path_way, '{}', 'utf-8');
};

// 用户请求核查数据时触发
function changeUserStatus(username, tableName, ids, fields, currentYear) {
    let filePath = '../record/' + username + '.json'
    filePath = path.join(__dirname, filePath)
    isFileExisted(filePath)

    let hcObj = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    let hc_infos = { currentYear }
    hc_infos['fields'] = fields
    let emptyArr = fields.map(item => '')
    hc_infos['records'] = []
    ids.forEach(item => {
        let itemObj = {}
        itemObj['id'] = item
        itemObj['BZS'] = emptyArr
        hc_infos['records'].push(itemObj)
    });

    hcObj[tableName] = hc_infos
    fs.writeFileSync(filePath, JSON.stringify(hcObj));
}

// 当用户提交结束或退出按钮时，触发
function clearBufferByUser(username, tableName) {
    let filePath = '../record/' + username + '.json'
    filePath = path.join(__dirname, filePath)

    let hcObj = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    hcObj[tableName] = {
        "fields": [],
        "records": [],
        'currentYear': ''
    }
    fs.writeFileSync(filePath, JSON.stringify(hcObj))
}

// 当用户完成一条记录时触发
function deleteOneUse(username, tableName, id) {
    let filePath = '../record/' + username + '.json'
    filePath = path.join(__dirname, filePath)

    let hcObj = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    hcObj[tableName].records = hcObj[tableName].records.filter(item => item['id'] != id)
    fs.writeFileSync(filePath, JSON.stringify(hcObj))
}

// 当用户提交信息时，触发
function changeUserRecordBZ(username, tableName, id, bzs, fields = null) {
    let filePath = '../record/' + username + '.json'
    filePath = path.join(__dirname, filePath)

    let hcObj = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    let records = hcObj[tableName]['records']
    for (const r of records) {
        if (r.id === id) {
            if (fields === null)
                r.BZS = bzs
            else {
                totalFields = records[tableName].fields
                for (let i = 0; i < fields.length; i++) {
                    const fie = fields[i];
                    const val = bzs[i];
                    r.BZS[totalFields.indexOf(fie)] = val
                }
            }
        }
    }
    fs.writeFileSync(filePath, JSON.stringify(hcObj));
}

// 用户提交复核结果时触发,记录复核日志
// Like >>> addOneRecord('bdc-user10', 'FDCQ2', '734683gjfgjd.110', ['正确', '错误', ''], ['FWLX', 'FWXZ', 'DJLX'])
async function addOneRecord(username, tableName, id, bzs, fields) {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    let day = currentDate.getDate();

    let text = currentDate.toLocaleDateString() + '&&' + tableName + '&&' + id + '&&' + JSON.stringify(fields) + '&&' + JSON.stringify(bzs) + '\n'
    let logFile = '../log/' + username + '_log_' + year + month + day + '.txt'
    logFile = path.join(__dirname, logFile)
    if (fs.existsSync(logFile)) {
        fs.appendFile(logFile, text, (err) => { })
    }
    else {
        fs.writeFile(logFile, text, (err) => { })
    }
}

function getCurrentFields(username, tableName) {
    let filePath = '../record/' + username + '.json'
    filePath = path.join(__dirname, filePath)

    let hcObj = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    let fields = hcObj[tableName]['fields']
    return fields
}

function getCurrentIds(username, tableName) {
    let filePath = '../record/' + username + '.json'
    filePath = path.join(__dirname, filePath)

    let hcObj = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    return hcObj[tableName].records.map(item => item[0])
}

function getCurrentYear(username, tableName) {
    let filePath = '../record/' + username + '.json'
    filePath = path.join(__dirname, filePath)

    let hcObj = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    return hcObj[tableName].currentYear
}

module.exports = {
    changeUserStatus,
    changeUserRecordBZ,
    deleteOneUse,
    clearBufferByUser,
    addOneRecord,
    getCurrentFields,
    getCurrentIds,
    getCurrentYear
}