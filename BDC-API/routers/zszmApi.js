const express = require('express')
const fs = require('fs')
const orclUtils = require('../utils/orclUtils')
const path = require('path')

const {
    getZSZMSqlInfos,
    getZSZMSqlSetOnUse,
    getZSZMAllInfos,
    getZSZMSqlCommit
} = require('../utils/queryBuilder')

const defaultFields = ['GYFS']
// 获取数据库连接
const configStr = fs.readFileSync(path.join(__dirname, '../dbInfo.json'), 'utf-8')
const configObj = eval('(' + configStr + ')')

const router = express.Router()
orclUtils.init(configObj)

router.get('/api/ZSZM', function (req, res) {
    res.send({
        data: defaultFields,
        meta: {
            status: 200,
            msg: '获取可操作字段成功',
        }
    })
})

router.post('/api/ZSZM/raw', async function (req, res) {
    let body = req.body
    let num = body.number
    let fields = body.fields
    let period = body.period

    if (!fields || fields.length === 0) {
        fields = defaultFields
    }

    let sqlInfo = getZSZMSqlInfos(fields, period, num)
    let idDatas = await orclUtils.execute(sqlInfo)

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
    let qlrids = idDatas.rows.map(item => item[0])
    let sqlSetUse = getZSZMSqlSetOnUse(fields, qlrids, 1)
    let setRes = await orclUtils.execute(sqlSetUse)
    if (setRes instanceof Object && setRes.hasOwnProperty('status')) {
        res.send({
            status: -1,
            msg: "设置记录正在使用中时发生错误",
            detail: ex || '执行execute发生未知错误'
        })
    }
    res.send(data)
})

router.post('/api/ZSZM/total', async (req, res) => {
    let qlzid = req.body.qlzid
    let year = req.body.year
    let sql = getZSZMAllInfos(qlzid, year)
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

router.post('/api/ZSZM/commit', async (req, res) => {
    let qlzid = req.body.qlzid
    let fields = req.body.fields
    let vals = req.body.vals

    let sql = getZSZMSqlCommit(qlzid, fields, vals)
    let sqlRes = await orclUtils.execute(sql)
    if (sqlRes instanceof Object && sqlRes.hasOwnProperty('status')) {
        res.send({
            status: -1,
            msg: "设置记录正在使用中时发生错误",
            detail: ex || '执行execute发生未知错误'
        })
    }
    res.send({
        data: [],
        meta: {
            status: 200,
            msg: '复核提交成功'
        }
    })
})

router.post('/api/ZSZM/success', async (req, res) => {
    let qlzids = req.body.qlzids
    let fields = req.body.fields

    let sqlSetUse = getFDCQSqlSetOnUse(fields, qlzids, 0)
    let setRes = await orclUtils.execute(sqlSetUse)
    if (setRes instanceof Object && setRes.hasOwnProperty('status')) {
        res.send({
            status: -1,
            msg: "设置记录正在使用中时发生错误",
            detail: ex || '执行execute发生未知错误'
        })
    }
    res.send({
        data: [],
        meta: {
            status: 200,
            msg: '成功将记录设置为未在使用状态'
        }
    })
})

module.exports = router