var a = [{
    FDCQID: '',
    BDCQZH: '',
    hasCommit: false,
    success: false,
    children: [
        {
            fieldName: '',
            fieldNameAlias: '',
            fieldChange: '',
            needRG: 1,
        },
        {
            fieldName: '',
            fieldNameAlias: '',
            fieldChange: '',
            needRG: 1,
            BZ: '',
            changed: false
        }
    ]
}];

var originData = {
    metaData: [
        { name: 'FDCQID' }, { name: 'RG_CHANGE' },
        { name: 'JQ_CHANGE' }, { name: 'RQ' },
        { name: 'BZ_DJLX' }, { name: 'BZ_FDZL' },
        { name: 'BZ_FDCJYJG' }, { name: 'BZ_ZCS' },
        { name: 'BZ_DJSJ' }, { name: 'BZ_ZDDM' },
        { name: 'BZ_YWH' }, { name: 'BZ_QLLX' },
        { name: 'BZ_QXDM' }, { name: 'BZ_QSZT' },
        { name: 'BZ_BDCDYH' }, { name: 'BZ_GHYT' },
        { name: 'BZ_FWXZ' }, { name: 'BZ_GHYTMC' },
        { name: 'BZ_BDCQZHC' }, { name: 'FT_FDZL' },
        { name: 'FT_DJLX' }, { name: 'FT_FDCJYJG' },
        { name: 'FT_FWXZ' }, { name: 'FT_QLLX' },
        { name: 'FT_GHYT' }, { name: 'FT_GHYTMC' },
        { name: 'FT_BDCQZHC' }, { name: 'RG_FDZL' },
        { name: 'RG_DJLX' }, { name: 'RG_FDCJYJG' },
        { name: 'RG_FWXZ' }, { name: 'RG_QLLX' },
        { name: 'RG_GHYT' }, { name: 'RG_GHYTMC' },
        { name: 'RG_BDCQZHC' }, { name: 'USE_FDZL' },
        { name: 'USE_DJLX' }, { name: 'USE_FDCJYJG' },
        { name: 'USE_FWXZ' }, { name: 'USE_QLLX' },
        { name: 'USE_GHYT' }, { name: 'USE_GHYTMC' },
        { name: 'USE_BDCQZHC' }, { name: 'NEED_RG' }
    ],
    rows: [
        [
            '102814CQN_5408436984289FWN_11.001',
            'Ga_1&',
            null,
            1,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            '0829126==>粤房证字第0829126号',
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        ],
        [
            '118558CQN_0158218650613FWN_11.002',
            'Hb_1&Ga_1&',
            null,
            1,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            '==>99',
            null,
            null,
            '0844211==>粤房证字第0844211号',
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            1,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        ],
        [
            '122309CQN_5157157983631FWN_11.001',
            'Gg_2&Ga_1&',
            null,
            1,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            '==>80',
            '-==>其它',
            '0829093==>粤房证字第0829093号',
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        ]
    ]
}

var need_fields = []
var FT_MatchIndexs = []
var RG_MatchIndexs = []

let i = 0;
var index_dict = {}
for (const fieldObj of originData.metaData) {
    index_dict[fieldObj.name] = i;
    if (fieldObj.name.indexOf('FT_') === 0) {
        need_fields.push(fieldObj.name.replace('FT_', ''))
        FT_MatchIndexs.push(i)
    }
    i++;
}

RG_MatchIndexs = need_fields.map(item => index_dict['RG_' + item])

var fieldsNameObj = {
    FDZL: "房地坐落",
    DJLX: "登记类型",
    FDCJYJG: "交易价格",
    FWXZ: "房屋性质",
    QLLX: "权力类型",
    GHYT: "规划用途",
    GHYTMC: "规划用途名称",
    BDCQZHC: "不动产权证号",
};

var recordList = []
for (const row of originData.rows) {
    var recordObj = {}
    recordObj['FDCQID'] = row[0]
    recordObj['children'] = []
    for (let index = 0; index < need_fields.length; index++) {
        const fie = need_fields[index];
        var fieObj = {};
        fieObj['fieldName'] = fie
        fieObj['fieldNameAlias'] = fieldsNameObj[fie]
        fieObj['fieldChange'] = row[FT_MatchIndexs[index]]
        fieObj['needRG'] = row[RG_MatchIndexs[index]] ? 1 : 0;
        recordObj['children'].push(fieObj)
    }
    recordList.push(recordObj)
}

console.log(JSON.stringify(recordList))