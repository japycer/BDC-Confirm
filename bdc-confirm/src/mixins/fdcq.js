export const fdcqMixin = {
    methods: {
        formatConfirmData(originData) {
            if (Object.keys(originData).length === 0) return []
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
                recordObj['BDCQZH'] = ''
                recordObj['hasCommit'] = false
                recordObj['success'] = false
                recordObj['children'] = []
                for (let index = 0; index < need_fields.length; index++) {
                    const fie = need_fields[index];
                    var fieObj = {};
                    fieObj['fieldName'] = fie
                    fieObj['BZ'] = ''
                    fieObj['fieldNameAlias'] = fieldsNameObj[fie]
                    fieObj['fieldChange'] = row[FT_MatchIndexs[index]]
                    fieObj['needRG'] = row[RG_MatchIndexs[index]] ? 1 : 0;
                    fieObj['changed'] = false
                    recordObj['children'].push(fieObj)
                }
                recordList.push(recordObj)
            }
            return recordList
        }
    },
}