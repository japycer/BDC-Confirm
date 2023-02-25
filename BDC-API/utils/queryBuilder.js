// 通过字段名构建select语句字段集合
function getStrByFields(fields = [], prefix = '', span = ',') {
    if (prefix instanceof Array) {
        let totalStrs = []
        prefix.forEach(item => {
            let temStr = fields.map(field => item + field).join(span)
            totalStrs.push(temStr)
        })
        return totalStrs.join(span)
    }
    return fields.map(field => prefix + field).join(span)
}

// 通过字段名构建select where语句的需要人工修改字段限制
// Like: RG_FDZL = 1 and BZ_FDZL IS NULL or RG_DJLX = 1 and BZ_DJLX IS NULL
function getSqlNeedRGConstraintStr(fields = []) {
    let res = fields.map(item => 'RG_' + item + ' = 1 and BZ_' + item + ' IS NULL').join(' or ')
    return '(' + res + ')'
}

// Like: USE_FDZL <> 1 and USE_DJLX <> 1
function getSqlOnUseConstraintStr(fields = []) {
    return fields.map(item => 'USE_' + item + ' <> 1').join(' and ')
}

// Like: ('102814CQN_5408436984289FWN_11.001', '118558CQN_0158218650613FWN_11.002')
function getSqlArrayStr(vals = []) {
    return '(' + vals.map(item => "'" + item + "'").join(',') + ')'
}

// -------------------------------------------------FDCQ----------------------------------------
// 构建获取需要核查的信息的SQL
function getFDCQSqlInfos(fields, period, num = 5) {
    let res = `
    select FDCQID,${getStrByFields(fields, ['RG_', 'FT_'])}
        from HC_FDCQ2 where
            RQ=${period} and rownum <=${num} and ${getSqlNeedRGConstraintStr(fields)} and ${getSqlOnUseConstraintStr(fields)}
    `
    return res
}

// 按照ID获取当前查询的记录
function getFDCQSqlDataByIds(fields, ids) {
    let res = `
    select FDCQID,${getStrByFields(fields, ['RG_', 'FT_'])}
        from HC_FDCQ2 where
            FDCQID IN ${getSqlArrayStr(ids)}
    `
}

// 将这些记录设置为正在使用
function getFDCQSqlSetOnUse(fields, fdcqids, status = 1) {
    let temStr = fields.map(item => `USE_${item}=${status}`).join(',')
    let res = `
        update HC_FDCQ2 set ${temStr} 
            where FDCQID IN ${getSqlArrayStr(fdcqids)}
    `
    return res
}

// 获取表的全部信息
function getFDCQAllInfos(fdcqid, year) {
    let res = `select * from cy_fdcq2_${year} where FDCQID = '${fdcqid}'`
    return res
}

// 获取相关表的信息
function getFDCQSqlRelatedTableInfos(fdcqid, relatedTableName, year, fdcq_key, related_key) {
    let res = `select b.* from cy_fdcq2_${year} a, cy_${relatedTableName}_${year} b where a.FDCQID = '${fdcqid}' and b.${related_key} = a.${fdcq_key}`
    return res
}

// 提交更改
function getFDCQSqlCommit(fdcqid, fields, vals) {
    let strList = []
    for (let index = 0; index < fields.length; index++) {
        const field = fields[index];
        const value = vals[index]
        let temStr = `BZ_${field}='${value}'`
        strList.push(temStr)
    }
    let res = `
    update HC_FDCQ2 set ${strList.join(',')} where FDCQID = '${fdcqid}'
    `
    return res
}


// -------------------------------------------------QLR----------------------------------------
// 构建获取需要核查的信息的SQL
function getQLRSqlInfos(fields, period, num = 5) {
    let res = `
    select QLRID,${getStrByFields(fields, ['RG_', 'FT_'])}
        from HC_QLR where
            RQ=${period} and rownum <=${num} and ${getSqlNeedRGConstraintStr(fields)} and ${getSqlOnUseConstraintStr(fields)}
    `
    return res
}

// 将这些记录设置为正在使用
function getQLRSqlSetOnUse(fields, qlrids, status = 1) {
    let temStr = fields.map(item => `USE_${item}=${status}`).join(',')
    let res = `
        update HC_QLR set ${temStr} 
            where QLRID IN ${getSqlArrayStr(qlrids)}
    `
    return res
}

// 获取表的全部信息
function getQLRAllInfos(qlrid, year) {
    let res = `select * from cy_qlr_${year} where QLRID = '${qlrid}'`
    return res
}

// 提交更改
function getQLRSqlCommit(qlrid, fields, vals) {
    let strList = []
    for (let index = 0; index < fields.length; index++) {
        const field = fields[index];
        const value = vals[index]
        let temStr = `BZ_${field}='${value}'`
        strList.push(temStr)
    }
    let res = `
    update HC_QLR set ${strList.join(',')} where QLRID = '${qlrid}'
    `
    return res
}

// ---------------------------------------------H----------------------------------------
// 构建获取需要核查的信息的SQL
function getHSqlInfos(fields, period, num = 5) {
    let res = `
    select HID,${getStrByFields(fields, ['RG_', 'FT_'])}
        from HC_H where
            RQ=${period} and rownum <=${num} and ${getSqlNeedRGConstraintStr(fields)} and ${getSqlOnUseConstraintStr(fields)}
    `
    return res
}

// 将这些记录设置为正在使用
function getHSqlSetOnUse(fields, hids, status = 1) {
    let temStr = fields.map(item => `USE_${item}=${status}`).join(',')
    let res = `
        update HC_H set ${temStr} 
            where HID IN ${getSqlArrayStr(hids)}
    `
    return res
}

// 获取表的全部信息
function getHAllInfos(hid, year) {
    let res = `select * from cy_h_${year} where HID = '${hid}'`
    return res
}

// 提交更改
function getHSqlCommit(hid, fields, vals) {
    let strList = []
    for (let index = 0; index < fields.length; index++) {
        const field = fields[index];
        const value = vals[index]
        let temStr = `BZ_${field}='${value}'`
        strList.push(temStr)
    }
    let res = `
    update HC_H set ${strList.join(',')} where HID = '${hid}'
    `
    return res
}

// --------------------------------------------ZSZM--------------------------------------
// 构建获取需要核查的信息的SQL
function getZSZMSqlInfos(fields, period, num = 5) {
    let res = `
    select QLZID,${getStrByFields(fields, ['RG_', 'FT_'])}
        from HC_ZSZM where
            RQ=${period} and rownum <=${num} and ${getSqlNeedRGConstraintStr(fields)} and ${getSqlOnUseConstraintStr(fields)}
    `
    return res
}

// 将这些记录设置为正在使用
function getZSZMSqlSetOnUse(fields, qlzid, status = 1) {
    let temStr = fields.map(item => `USE_${item}=${status}`).join(',')
    let res = `
        update HC_ZSZM set ${temStr} 
            where QLZID IN ${getSqlArrayStr(qlzid)}
    `
    return res
}

// 获取表的全部信息
function getZSZMAllInfos(qlzid, year) {
    let res = `select * from cy_zszm_${year} where QLZID = '${qlzid}'`
    return res
}

// 提交更改
function getZSZMSqlCommit(qlzid, fields, vals) {
    let strList = []
    for (let index = 0; index < fields.length; index++) {
        const field = fields[index];
        const value = vals[index]
        let temStr = `BZ_${field}='${value}'`
        strList.push(temStr)
    }
    let res = `
    update HC_ZSZM set ${strList.join(',')} where QLZID = '${qlzid}'
    `
    return res
}


module.exports = {
    getFDCQSqlInfos,
    getFDCQSqlDataByIds,
    getFDCQSqlSetOnUse,
    getFDCQAllInfos,
    getFDCQSqlRelatedTableInfos,
    getFDCQSqlCommit,
    getQLRSqlInfos,
    getQLRSqlSetOnUse,
    getQLRAllInfos,
    getQLRSqlCommit,
    getHSqlInfos,
    getHSqlSetOnUse,
    getHAllInfos,
    getHSqlCommit,
    getZSZMSqlInfos,
    getZSZMSqlSetOnUse,
    getZSZMAllInfos,
    getZSZMSqlCommit
}