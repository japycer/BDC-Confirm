<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>信息复核</el-breadcrumb-item>
      <el-breadcrumb-item>权利人</el-breadcrumb-item>
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
          <el-button type="primary" @click="getConfirmData">提交</el-button>
        </el-col>
      </el-row>

      <!-- 表格展示数据区域 -->
      <el-table :data="currentRecords" border stripe height="450px">
        <el-table-column type="expand">
          <template slot-scope="{ row }">
            <el-row
              class="one-record"
              v-for="(item, index) in row.children"
              :key="index"
              v-show="item.needRG === 1"
            >
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
              <el-col :span="12" class="field-operation"
                ><el-row :gutter="15"
                  ><el-col :span="16"
                    ><el-input
                      v-model="item['BZ']"
                      placeholder="请输入内容"
                    ></el-input></el-col
                  ><el-col :span="8"
                    ><el-tag type="success" @click="item['BZ'] = '正确'"
                      >正确</el-tag
                    >
                    <el-tag type="info" @click="item['BZ'] = '待定'"
                      >待定</el-tag
                    >
                    <el-tag type="danger" @click="item['BZ'] = '错误'"
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
        <el-table-column label="权利人ID" prop="qlrid"></el-table-column>
        <el-table-column label="权利人姓名" prop="BDCQZH"></el-table-column>
        <el-table-column label="操作" width="500px">
          <template slot-scope="{ row }">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="commitConfirmResult(row)"
              >提交</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="commitConfirmResult(row)"
              >完成编辑</el-button
            >
            <el-button
              size="mini"
              type="warning"
              @click="getRecordInfo(row['qlrid'])"
              >完整信息</el-button
            >
          </template>
        </el-table-column>
      </el-table>
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
import { qlrMixin } from "../../mixins/qlr";

export default {
  name: "QlrUI",
  mixins: [qlrMixin],
  data() {
    return {
      allFields: [],
      fieldCheckList: [],
      selectedYear: "1",
      yearOptions: [
        { value: "1", label: "1987" },
        { value: "2", label: "1988_2003" },
        { value: "3", label: "2004_2015" },
        { value: "4", label: "2016_2020" },
      ],
      selectedNum: 5,
      numOptions: [5, 6, 7, 8, 9, 10],
      currentRecords: [],
      // 查询信息显示的数据
      findData: {},
      currentFindTable: "",
      //  查询信息显示框可见性
      setFindDialogVisible: false,
    };
  },
  methods: {
    async getConfirmData() {
      var fieldsNameObj = {
        权利人类型: "QLRLX",
        证件种类: "ZJZL",
        权利人名称: "QLRMC",
        证件号: "ZJH",
      };
      var selectedFields = this.fieldCheckList.map(
        (item) => fieldsNameObj[item]
      );
      var data = {
        metaData: [
          { name: "qlrid" },
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
        // 测试数据
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
      this.currentRecords = this.formatConfirmData(data);
    },
    async getRecordInfo(qlrid, tableName = "self") {
      this.currentFindTable = tableName;
      var year_dict = {
        1: "1987",
        2: "1988_2003",
        3: "2004_2015",
        4: "2016_2020",
      };
      var { data: res } = await this.$http.post("/QLR/total", {
        qlrid: qlrid,
        year: year_dict[this.selectedYear],
      });
      var resData = {};
      var temp_dict = {};
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
      this.setFindDialogVisible = true;
    },
    async commitConfirmResult(row) {
      var qlrid = row["qlrid"];
      var fields = [];
      var vals = [];
      row.children.forEach((fieldObj) => {
        if (fieldObj["needRG"] === 1 && fieldObj["BZ"].length > 0) {
          fields.push(fieldObj["fieldName"]);
          vals.push(fieldObj["BZ"]);
        }
      });

      if (vals.length === 0) return this.$message.error("提交未更改数据");
      const { data: res } = await this.$http.post("/QLR/commit", {
        qlrid,
        fields,
        vals,
      });
      if (res.hasOwnProperty("meta") && res.meta === 200) {
        return this.$message.success(res.meta.msg);
      }
      this.$message.error("提交失败");
    },
  },
  async created() {
    var fieldsNameObj = {
      QLRLX: "权利人类型",
      ZJZL: "证件种类",
      QLRMC: "权利人名称",
      ZJH: "证件号",
    };
    var { data: res } = await this.$http.get("/QLR");
    if (res.hasOwnProperty("meta") && res.meta.status === 200) {
      this.allFields = res.data.map((item) => {
        this.fieldCheckList.push(fieldsNameObj[item]);
        return fieldsNameObj[item];
      });
      this.$message.success(res.meta.msg);
    }
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
</style>