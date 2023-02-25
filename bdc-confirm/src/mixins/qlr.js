export const qlrMixin = {
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
                QLRLX: "权利人类型",
                ZJZL: "证件种类",
                QLRMC: "权利人名称",
                ZJH: "证件号",
            };

            var recordList = []
            for (const row of originData.rows) {
                var recordObj = {}
                recordObj['QLRID'] = row[0]
                recordObj['QLRMC'] = ''
                recordObj['children'] = []
                for (let index = 0; index < need_fields.length; index++) {
                    const fie = need_fields[index];
                    var fieObj = {};
                    fieObj['fieldName'] = fie
                    fieObj['BZ'] = ''
                    fieObj['fieldNameAlias'] = fieldsNameObj[fie]
                    fieObj['fieldChange'] = row[FT_MatchIndexs[index]]
                    fieObj['needRG'] = row[RG_MatchIndexs[index]] ? 1 : 0;
                    recordObj['children'].push(fieObj)
                }
                recordList.push(recordObj)
            }
            return recordList
        }
    },
}