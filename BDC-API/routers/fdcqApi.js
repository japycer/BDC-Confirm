const express = require('express')
const fs = require('fs')
const orclUtils = require('../utils/orclUtils')
const path = require('path')

const {
    getFDCQSqlInfos,
    getFDCQSqlDataByIds,
    getFDCQSqlSetOnUse,
    getFDCQAllInfos,
    getFDCQSqlRelatedTableInfos,
    getFDCQSqlCommit
} = require('../utils/queryBuilder')

const {
    changeUserStatus,
    changeUserRecordBZ,
    deleteOneUse,
    clearBufferByUser,
    getCurrentFields,
    getCurrentIds,
    getCurrentYear,
    addOneRecord } = require('../utils/recordUtils')

const defaultFields = ['FDZL', 'DJLX', 'FDCJYJG', 'FWXZ', 'QLLX', 'GHYT', 'GHYTMC', 'BDCQZHC']
// 获取数据库连接
const configStr = fs.readFileSync(path.join(__dirname, '../dbInfo.json'), 'utf-8')
const configObj = eval('(' + configStr + ')')

const router = express.Router()
orclUtils.init(configObj)

router.get('/api/FDCQ', function (req, res) {
    res.send({
        data: defaultFields,
        meta: {
            status: 200,
            msg: '获取可操作字段成功',
        }
    })
})

router.post('/api/FDCQ/data', async (req, res) => {
    let body = req.body
    let num = body.number
    let fields = body.fields
    let period = body.period
    if (!fields || fields.length === 0) {
        fields = defaultFields
    }

    let sqlInfo = getFDCQSqlInfos(fields, period, num)
    let idDatas = await orclUtils.execute(sqlInfo)

    // 有状态属性代表未查询成功
    if (idDatas instanceof Object && idDatas.hasOwnProperty('status')) {
        return res.send(idDatas)
    }
    let data = {
        data: idDatas,
        meta: {
            msg: '请求需要修改数据成功',
            status: 200
        }
    }
    // 数据请求成功则将这些数据列为正在使用
    let fdcqids = idDatas.rows.map(item => item[0])
    let sqlSetUse = getFDCQSqlSetOnUse(fields, fdcqids, 1)
    let setRes = await orclUtils.execute(sqlSetUse)
    if (setRes instanceof Object && setRes.hasOwnProperty('status')) {
        return res.send({
            status: -1,
            msg: "设置记录正在使用中时发生错误",
            detail: '执行execute发生未知错误'
        })
    }

    // 请求数据已经成功,先将当前用户状态记录下来
    let fids = idDatas.rows.map(rows[0])
    changeUserStatus(req.username, 'FDCQ2', fids, fields)
    res.send(data)
})

router.post('/api/FDCQ/total', async (req, res) => {
    let fdcqid = req.body.fdcqid
    let year = req.body.year
    let sql = getFDCQAllInfos(fdcqid, year)
    let idDatas = await orclUtils.execute(sql)

    if (idDatas instanceof Object && idDatas.hasOwnProperty('status')) {
        return res.send(idDatas)
    }
    let data = {
        data: idDatas,
        meta: {
            msg: '请求记录全部信息成功',
            status: 200
        }
    }
    res.send(data)
})

router.post('/api/FDCQ/ralated', async function (req, res) {
    let tableName = req.body.tableName
    let fdcqid = req.body.fdcqid
    let year = req.body.year

    let fdcq_key = ''
    let related_key = ''
    switch (tableName) {
        case 'h':
            fdcq_key = 'bdcdyid'
            related_key = 'hid'
            break;
        case 'zrz':
            fdcq_key = 'zrzid'
            related_key = 'zrzid'
            break;
        case 'zdjbxx':
            fdcq_key = 'zdid'
            related_key = 'zdid'
            break;
        default:
            break;
    }
    if (fdcq_key === '') res.send({
        status: -1,
        msg: "请求未知表格数据",
        detail: '请求未知表格数据错误'
    })

    let sql = getFDCQSqlRelatedTableInfos(fdcqid, tableName, year, fdcq_key, related_key)
    let resSql = await orclUtils.execute(sql)

    if (resSql instanceof Object && resSql.hasOwnProperty('status')) {
        return res.send(resSql)
    }
    let data = {
        data: resSql,
        meta: {
            msg: '请求记录相关表格信息成功',
            status: 200
        }
    }
    res.send(data)
})

router.post('/api/FDCQ/commit', async (req, res) => {
    let fdcqid = req.body.fdcqid
    let fields = req.body.fields
    let vals = req.body.vals

    let sql = getFDCQSqlCommit(fdcqid, fields, vals)
    let sqlRes = await orclUtils.execute(sql)
    if (sqlRes instanceof Object && sqlRes.hasOwnProperty('status')) {
        return res.send({
            status: -1,
            msg: "设置记录正在使用中时发生错误",
            detail: '执行execute发生未知错误'
        })
    }
    // NEW
    // 提交成功
    changeUserRecordBZ(req.username, 'FDCQ2', fdcqid, vals, fields)
    addOneRecord(req.username, 'FDCQ2', fdcqid, fields)
    res.send({
        data: [],
        meta: {
            status: 200,
            msg: '复核提交成功'
        }
    })
})

router.post('/api/FDCQ/success', async (req, res) => {
    let fdcqids = req.body.fdcqids
    let fields = req.body.fields

    let onUseFields = getCurrentFields(req.username, 'FDCQ2')
    if (onUseFields) fields = onUseFields
    let sqlSetUse = getFDCQSqlSetOnUse(fields, fdcqids, 0)
    let setRes = await orclUtils.execute(sqlSetUse)
    if (setRes instanceof Object && setRes.hasOwnProperty('status')) {
        return res.send({
            status: -1,
            msg: "设置记录正在使用中时发生错误",
            detail: '执行execute发生未知错误'
        })
    }
    // 更新使用状态字段为空
    if (fdcqids.length === 1) {
        deleteOneUse(req.username, 'FDCQ2', fdcqids[0])
    }
    else {
        clearBufferByUser(req.username, 'FDCQ2')
    }
    res.send({
        data: [],
        meta: {
            status: 200,
            msg: '成功将记录设置为未在使用状态'
        }
    })
})

// NEW EDIT
router.get('/api/FDCQ/restore', async (req, res) => {
    let restoreIds = getCurrentIds(req.username, 'FDCQ2');
    let restoreFields = getCurrentFields(req.username, 'FDCQ2');
    if (restoreIds.length === 0 || restoreFields.length === 0) {
        return {
            data: {},
            meta: {
                status: 200,
                msg: '无未完成的缓冲区数据',
                currentYear: '1'
            }
        }
    }
    let sqlStr = getFDCQSqlDataByIds(restoreFields, restoreFields)

    let sqlRes = await orclUtils.execute(sqlStr)
    if (sqlRes instanceof Object && sqlRes.hasOwnProperty('status')) {
        return res.send({
            data: {},
            meta: {
                status: -1,
                msg: "获取用户历史遗留数据失败",
                detail: '执行execute发生未知错误'
            }
        })
    }
    // 成功
    return {
        data: sqlRes,
        meta: {
            msg: '请求缓冲区数据成功',
            currentYear: getCurrentYear(req.username, 'FDCQ2'),
            status: 200
        }
    }
})

module.exports = router