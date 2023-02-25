<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>信息复核</el-breadcrumb-item>
      <el-breadcrumb-item>房地产权</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 数据提取选项区域 -->
      <el-row :gutter="1">
        <el-col :span="18">
          <el-checkbox-group v-model="fieldCheckList">
            <el-checkbox
              :label="field"
              v-for="(field, index) in allFields"
              :key="index"
            ></el-checkbox>
          </el-checkbox-group>
        </el-col>
        <el-col :span="3">
          <el-select v-model="selectedYear" placeholder="请选择年份">
            <el-option
              v-for="item in yearOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-select v-model="selectedNum" placeholder="数量">
            <el-option
              v-for="item in numOptions"
              :key="item.value"
              :label="item + ''"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" @click="releaseAndGetData">提交</el-button>
        </el-col>
      </el-row>

      <!-- 表格展示数据区域 -->
      <el-table
        :data="currentRecords"
        :row-class-name="rowClassName"
        border
        stripe
        height="550px"
      >
        <el-table-column type="expand">
          <template slot-scope="{ row }">
            <el-row
              class="one-record"
              v-for="(item, index) in row.children"
              :key="index"
              v-show="item.needRG === 1"
            >
              <el-col :span="1"></el-col>
              <el-col :span="4"
                >{{ item["fieldName"] }}({{ item["fieldNameAlias"] }})</el-col
              >
              <el-col :span="6"
                ><h4>{{ item["fieldChange"] }}</h4></el-col
              >
              <el-col :span="2">
                <el-tag type="success" effect="dark" v-if="item['needRG'] === 1"
                  >需人工</el-tag
                >
                <el-tag type="info" effect="dark" v-else>不需人工</el-tag>
              </el-col>
              <el-col :span="11" class="field-operation"
                ><el-row :gutter="15"
                  ><el-col :span="16"
                    ><el-input
                      v-model="item['BZ']"
                      placeholder="请输入内容"
                      @input="item['changed'] = true"
                    ></el-input></el-col
                  ><el-col :span="8"
                    ><el-tag
                      type="success"
                      @click="
                        item['BZ'] = '正确';
                        item['changed'] = true;
                      "
                      >正确</el-tag
                    >
                    <el-tag
                      type="info"
                      @click="
                        item['BZ'] = '待定';
                        item['changed'] = true;
                      "
                      >待定</el-tag
                    >
                    <el-tag
                      type="danger"
                      @click="
                        item['BZ'] = '错误';
                        item['changed'] = true;
                      "
                      >错误</el-tag
                    ></el-col
                  ></el-row
                >
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="房地产权ID" prop="FDCQID"></el-table-column>
        <el-table-column label="不动产单元编号" prop="BDCQZH"></el-table-column>
        <el-table-column label="操作" width="500px">
          <template slot-scope="{ row }">
            <el-button
              size="mini"
              :type="row['hasCommit'] ? 'info' : 'primary'"
              icon="el-icon-edit"
              @click="commitConfirmResult(row)"
              >提交</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="commitConfirmResult(row, true)"
              >完成编辑</el-button
            >
            <el-button
              size="mini"
              type="warning"
              @click="getRecordInfo(row['FDCQID'], 'self')"
              >完整信息</el-button
            >
            <el-button
              size="mini"
              type="warning"
              @click="getRecordInfo(row['FDCQID'], 'h')"
              >H</el-button
            >
            <el-button
              size="mini"
              type="warning"
              @click="getRecordInfo(row['FDCQID'], 'zdjbxx')"
              >ZDJBXX</el-button
            >
            <el-button
              size="mini"
              type="warning"
              @click="getRecordInfo(row['FDCQID'], 'zrz')"
              >ZRZ</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部按钮功能区域 -->
      <el-row class="el-row-buttom">
        <el-button type="primary" @click="successAndClear"
          >完成并清空</el-button
        >
        <el-button type="primary" @click="releaseAndGetData">下一批</el-button>
      </el-row>
    </el-card>

    <!-- 查询信息的对话框 -->
    <el-dialog
      :title="currentFindTable.toUpperCase() + '表基本信息'"
      :visible.sync="setFindDialogVisible"
      width="50%"
    >
      <!-- 信息展示框 -->
      <el-descriptions
        class="margin-top"
        title="带边框列表"
        :column="3"
        border
        size="small"
      >
        <el-descriptions-item
          :label="keyV"
          v-for="(val, keyV, i) in findData"
          :key="i"
        >
          {{ val }}
        </el-descriptions-item>
      </el-descriptions>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setFindDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setFindDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fdcqMixin } from "../../mixins/fdcq";

export default {
  name: "FdcqUI",
  mixins: [fdcqMixin],
  data() {
    return {
      // RG_FDZL, RG_DJLX, RG_FDCJYJG, RG_FWXZ, RG_QLLX, RG_GHYT, RG_GHYTMC, RG_BDCQZHC
      allFields: [],
      fieldCheckList: [],
      selectedYear: "1",
      yearOptions: [
        { value: "1", label: "1987" },
        { value: "2", label: "1988_2003" },
        { value: "3", label: "2004_2015" },
        { value: "4", label: "2016_2020" },
      ],
      currentYear: "1",
      selectedNum: 5,
      numOptions: [5, 6, 7, 8, 9, 10],
      currentRecords: [],
      // 查询信息显示的数据
      findData: {},
      currentFindTable: "",
      //  查询信息显示框可见性
      setFindDialogVisible: false,
      // 最后一次请求数据所用的字段集合
      sucFieldCheckList: [],
    };
  },
  computed: {
    rowClassName(row) {
      if (row["success"]) {
        return "success-row";
      }
      return "";
    },
  },
  methods: {
    releaseAndGetData() {
      this.successAndClear();
      this.getConfirmData();
    },
    async getConfirmData() {
      var fieldsNameObj = {
        房地坐落: "FDZL",
        登记类型: "DJLX",
        交易价格: "FDCJYJG",
        房屋性质: "FWXZ",
        权力类型: "QLLX",
        规划用途: "GHYT",
        规划用途名称: "GHYTMC",
        不动产权证号: "BDCQZHC",
      };
      var selectedFields = this.fieldCheckList.map(
        (item) => fieldsNameObj[item]
      );
      //   var { data: res } = await this.$http.post("/FDCQ/data", {
      //     number: this.selectedNum,
      //     fields: selectedFields,
      //     period: this.selectedYear,
      //   });
      var data = {
        metaData: [
          { name: "FDCQID" },
          { name: "RG_CHANGE" },
          { name: "JQ_CHANGE" },
          { name: "RQ" },
          { name: "BZ_DJLX" },
          { name: "BZ_FDZL" },
          { name: "BZ_FDCJYJG" },
          { name: "BZ_ZCS" },
          { name: "BZ_DJSJ" },
          { name: "BZ_ZDDM" },
          { name: "BZ_YWH" },
          { name: "BZ_QLLX" },
          { name: "BZ_QXDM" },
          { name: "BZ_QSZT" },
          { name: "BZ_BDCDYH" },
          { name: "BZ_GHYT" },
          { name: "BZ_FWXZ" },
          { name: "BZ_GHYTMC" },
          { name: "BZ_BDCQZHC" },
          { name: "FT_FDZL" },
          { name: "FT_DJLX" },
          { name: "FT_FDCJYJG" },
          { name: "FT_FWXZ" },
          { name: "FT_QLLX" },
          { name: "FT_GHYT" },
          { name: "FT_GHYTMC" },
          { name: "FT_BDCQZHC" },
          { name: "RG_FDZL" },
          { name: "RG_DJLX" },
          { name: "RG_FDCJYJG" },
          { name: "RG_FWXZ" },
          { name: "RG_QLLX" },
          { name: "RG_GHYT" },
          { name: "RG_GHYTMC" },
          { name: "RG_BDCQZHC" },
          { name: "USE_FDZL" },
          { name: "USE_DJLX" },
          { name: "USE_FDCJYJG" },
          { name: "USE_FWXZ" },
          { name: "USE_QLLX" },
          { name: "USE_GHYT" },
          { name: "USE_GHYTMC" },
          { name: "USE_BDCQZHC" },
          { name: "NEED_RG" },
        ],
        rows: [
          [
            "102814CQN_5408436984289FWN_11.001",
            "Ga_1&",
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
            "0829126==>粤房证字第0829126号",
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
            null,
          ],
          [
            "118558CQN_0158218650613FWN_11.002",
            "Hb_1&Ga_1&",
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
            "==>99",
            null,
            null,
            "0844211==>粤房证字第0844211号",
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
            null,
          ],
          [
            "122309CQN_5157157983631FWN_11.001",
            "Gg_2&Ga_1&",
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
            "==>80",
            "-==>其它",
            "0829093==>粤房证字第0829093号",
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
            null,
          ],
        ],
      };
      // 如果请求成功
      this.sucFieldCheckList = selectedFields;
      this.currentYear = this.selectedYear;
      this.currentRecords = this.formatConfirmData(data);
    },
    async getRecordInfo(fdcqid, tableName = "self") {
      this.currentFindTable = tableName;
      switch (tableName) {
        case "self":
          var year_dict = {
            1: "1987",
            2: "1988_2003",
            3: "2004_2015",
            4: "2016_2020",
          };
          var { data: res } = await this.$http.post("/FDCQ/total", {
            fdcqid: fdcqid,
            year: year_dict[this.currentYear],
          });
          var resData = {};
          var temp_dict = {};
          if (res.hasOwnProperty("meta") && res.meta.status === 200) {
            resData = res.data instanceof Object ? res.data : res.data[0];
            if (resData.rows.length === 0) {
              this.findData = {
                Message: "未查询到数据",
              };
              return;
            }
            var fieNames = resData.metaData.map((item) => item.name);
            for (let index = 0; index < fieNames.length; index++) {
              const fieName = fieNames[index];
              const value = resData.rows[0][index];
              temp_dict["fieldName"] = fieName;
              temp_dict["value"] = value;
            }
            this.findData = temp_dict;
            return;
          }
          this.findData = {
            Message: "查询失败",
          };
          break;
        case "h":
        case "zdjbxx":
        case "zrz":
          var year_dict = {
            1: "1987",
            2: "1988_2003",
            3: "2004_2015",
            4: "2016_2020",
          };
          var { data: res } = await this.$http.post("/FDCQ/ralated", {
            tableName: tableName,
            fdcqid: fdcqid,
            year: year_dict[this.currentYear],
          });
          if (res.hasOwnProperty("meta") && res.meta.status === 200) {
            resData = res.data instanceof Object ? res.data : res.data[0];
            if (resData.rows.length === 0) {
              this.findData = {
                Message: "未查询到数据",
              };
              this.setFindDialogVisible = true;
              return;
            }
            var fieNames = resData.metaData.map((item) => item.name);
            for (let index = 0; index < fieNames.length; index++) {
              const fieName = fieNames[index];
              const value = resData.rows[0][index];
              temp_dict["fieldName"] = fieName;
              temp_dict["value"] = value;
            }
            this.findData = temp_dict;
            this.setFindDialogVisible = true;
            return;
          }
          this.findData = {
            Message: "查询失败",
          };
          break;
        default:
          break;
      }
      this.setFindDialogVisible = true;
    },
    // 提交一条记录
    async commitConfirmResult(row, hasSuccess = false) {
      var fdcqid = row["FDCQID"];
      var fields = [];
      var vals = [];
      var needChanegStatusFieObj = [];
      row.children.forEach((fieldObj) => {
        if (
          fieldObj["needRG"] === 1 &&
          fieldObj["BZ"].trim().length > 0 &&
          fieldObj["changed"]
        ) {
          fields.push(fieldObj["fieldName"]);
          vals.push(fieldObj["BZ"]);
          needChanegStatusFieObj.push(fieldObj);
        }
      });

      if (vals.length === 0) return this.$message.error("提交未更改数据");
      const { data: res } = await this.$http.post("/FDCQ/commit", {
        fdcqid,
        fields,
        vals,
      });
      // 提交成功则更改字段和记录状态
      if (res.hasOwnProperty("meta") && res.meta.status === 200) {
        row["hasCommit"] = true;
        if (hasSuccess) {
          let { data: sucRes } = await this.$http.post("/FDCQ/success", {
            fdcqids: [fdcqid],
            fields: this.sucFieldCheckList,
          });
          if (sucRes.hasOwnProperty("meta") && sucRes.meta.status === 200)
            row["success"] = true;
          else this.$message.error("使用状态更新失败");
        }
        needChanegStatusFieObj.forEach((item) => (item["changed"] = false));
        return this.$message.success(res.meta.msg);
      }
      this.$message.error("提交更改信息失败");
    },

    // 提交全部并清空表格
    async successAndClear() {
      if (this.currentRecords.length === 0) return;
      let successCount = 0;
      let needSummitCount = 0;
      let unSuccessIds = [];
      // 1、获取未提交的记录和字段并提交
      this.currentRecords.forEach(async (row) => {
        // 如果已经完成的数据，则跳过
        if (!row["success"]) unSuccessIds.push(row["FDCQID"]);
        if (!row["hasCommit"] && !row["success"]) {
          needSummitCount++;
          var fdcqid = row["FDCQID"];
          var fields = [];
          var vals = [];
          var needChanegStatusFieObj = [];
          row.children.forEach((fieldObj) => {
            if (
              fieldObj["needRG"] === 1 &&
              fieldObj["BZ"].trim().length > 0 &&
              fieldObj["changed"]
            ) {
              fields.push(fieldObj["fieldName"]);
              vals.push(fieldObj["BZ"]);
              needChanegStatusFieObj.push(fieldObj);
            }
          });
          if (vals.length != 0) {
            const { data: res } = await this.$http.post("/FDCQ/commit", {
              fdcqid,
              fields,
              vals,
            });
            // 提交成功则更改字段和记录状态
            if (res.hasOwnProperty("meta") && res.meta === 200) {
              row["hasCommit"] = true;
              row["success"] = true;
              needChanegStatusFieObj.forEach(
                (item) => (item["changed"] = false)
              );
              successCount++;
            }
          }
        }
        row["success"] = true;
      });
      // 2、输出提交数据信息
      this.$message.info(`成功提交：${successCount}/${needSummitCount}`);
      // 3、所有记录的正在使用状态清空
      this.currentRecords = [];
      try {
        if (unSuccessIds) {
          const { data: setunUesRes } = await this.$http.post("/FDCQ/success", {
            fdcqids: unSuccessIds,
            fields: this.sucFieldCheckList,
          });
          if (setunUesRes.hasOwnProperty("status")) {
            this.$message.error(`设置记录的未使用状态失败`);
          } else {
            this.$message.success(`已全部提交成功`);
          }
        }
      } catch (error) {
        console.log(error);
        this.$message.error(error);
      }
    },
  },
  async created() {
    // 1、获取可配置字段
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
    var { data: res } = await this.$http.get("/FDCQ");
    if (res.hasOwnProperty("meta") && res.meta.status === 200) {
      this.allFields = res.data.map((item) => {
        this.fieldCheckList.push(fieldsNameObj[item]);
        return fieldsNameObj[item];
      });
      this.$message.success(res.meta.msg);
    }

    // 2、获取是否有缓冲区未完成的数据
    var { data: res } = await this.$http.get("/FDCQ/restore");
    if (res.meta.status != 200) return;
    this.currentRecords = this.formatConfirmData(data);
    this.currentYear = res.meta.currentYear;
  },
};
</script>

<style lang="less" scoped>
.el-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.field-operation .el-tag {
  margin-right: 10px;
}

.one-record {
  border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
}

.el-row-buttom {
  margin-top: 15px;
  display: flex;
  justify-content: right;
}
</style>