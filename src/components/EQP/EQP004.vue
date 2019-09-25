<template>
  <div>
    <div>
      <el-row>
        <el-col :span="24" class="warp-breadcrum">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item style="font-size: 20px">作业类型</el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
      </el-row>

      <!--主页面搜索-->
      <el-col :span="18" :class="this.Global.pageToolBarClass" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.PROCESS_CODE" placeholder="作业类型编码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-tooltip effect="dark" content="查询" placement="top">
              <el-button type="primary" circle icon="el-icon-search" v-on:click="f_Search"></el-button>
            </el-tooltip>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6"  :class="this.Global.pageToolBarClass" style="padding-bottom: 0px; text-align: right;">
        <el-form :inline="true">
          <el-form-item>
            <el-button type="success" plain round @click.prevent="handleExp2XLSData()">导出</el-button>
            <el-button type="primary" plain round @click.prevent="SaveData()">保存</el-button>
            <el-button type="primary" plain round @click.prevent="addRow()">新增</el-button>
            <el-button type="danger" plain round @click="batchRemove">批量删除</el-button>
            <!--https://cloud.tencent.com/developer/section/1489868 按钮基础用法-->
          </el-form-item>
        </el-form>
      </el-col>

      <el-col :span="24" style="padding-bottom: 0px;">
        <el-table
          :data="dataList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
          ref="table"
          tooltip-effect="dark"
          border
          stripe
          style="width: 95%"
          :header-cell-style="this.Global.headerCellStyle" :cell-style="this.Global.cellStyle"
          @selection-change='selectRow'>
        <el-table-column type="selection" width="45" align="center"></el-table-column>
        <el-table-column label="序号" type="index" width="60" align="center">
          <template slot-scope="scope"> {{ scope.row.ID }} </template>
        </el-table-column>
        <el-table-column prop="PROCESS_CODE" label="作业类型编码" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.PROCESS_CODE"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="PROCESS_NAME" label="名称" align="center" min-width="100">
          <template slot-scope="scope">
            <el-input v-model="scope.row.PROCESS_NAME"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="REMARK" label="描述" align="center" min-width="100">
          <template slot-scope="scope">
            <el-input v-model="scope.row.REMARK"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="CREATOR" label="创建人" align="center" min-width="100">
          <template slot-scope="scope">
            <el-input v-model="scope.row.CREATOR"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="CREATE_DATE" label="创建时间" align="center" min-width="100">
          <template slot-scope="scope"> {{ scope.row.CREATE_DATE }} </template>
        </el-table-column>
      </el-table>
      </el-col>

      <!--分页工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[15, 30, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="currentTotal"
          style="float:right;">
        </el-pagination>
      </el-col>

    </div>
  </div>
</template>

<script>
  export default {
    name: "EQP004",
    data() {
      return {

        //导出到excel的标题
        tableTitleData: [
          {
            label: '序号',
            prop: 'ID'
          },
          {
            label: '作业类型编码',
            prop: 'PROCESS_CODE'
          },
          {
            label: '名称',
            prop: 'PROCESS_NAME'
          },
          {
            label: '描述',
            prop: 'REMARK'
          },
          {
            label: '维护人',
            prop: 'CREATOR'
          },
          {
            label: '维护时间',
            prop: 'CREATE_DATE'
          }
        ],

        ///查询条件
        filters: {
          PROCESS_CODE: ''
        },

        ///分页
        currentPage: 1,
        pageSize: 15,
        currentTotal: 0,

        dataList: [],
        selectlistRow: [],
        deleteRow:[]
      }
    },
    mounted: function () {
      this.showDatas()
    },
    methods: {

      handleExp2XLSData() {
        // 导出表格的表头设置
        let allColumns = this.tableTitleData
        var columnNames = []
        var columnValues = []
        for (var i = 0; i < allColumns.length; i++) {
          columnNames[i] = allColumns[i].label
          columnValues[i] = allColumns[i].prop
        }
        require.ensure([], () => {
          const { export_json_to_excel } = require('exportdata/Export2Excel')
          const tHeader = columnNames
          const filterVal = columnValues

          const list = this.dataList
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '作业类型')
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },

      //分页
      handleSizeChange(val) {
        this.pageSize = val;
        console.log(`每页 ${val} 条`);
      },
      //分页
      handleCurrentChange(val) {
        this.currentPage = val;
        console.log(`当前页: ${val}`);
      },

      // 获取表格选中时的数据
      selectRow(val) {
        this.selectlistRow = val
      },

      // 增加行
      addRow() {
        var list = {
          ID:'',
          PROCESS_CODE: '',
          PROCESS_NAME: '',
          REMARK:'',
          CREATOR:'',
          CREATE_DATE:''
        }
        this.dataList.unshift(list)
      },

      // 批量删除选中行
      batchRemove() {
        if (this.selectlistRow.length == 0) {
          this.$message({
            message: '没有可选择的数据删除！',
            type: 'warning'
          });
          return;
        }

        this.$confirm('确认删除记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          for (let i = 0; i < this.selectlistRow.length; i++) {
            let self = this;
            let val = self.selectlistRow
            val.forEach(function (val, index) {
              self.dataList.forEach(function (v, i) {
                if (val.ID == v.ID) {
                  self.dataList.splice(i, 1)
                  self.deleteRow.unshift(val)
                }
              })
            })
          };

          // 删完数据后清除勾选框
          this.$refs.dataList.clearSelection()

          this.$message({
            message: '删除成功',
            type: 'success'
          });
        }).catch(() => {
        });
      },

      // 删除选中行
      delData() {
        for (let i = 0; i < this.selectlistRow.length; i++) {
          let self = this;
          let val = self.selectlistRow
          val.forEach(function (val, index) {
            self.dataList.forEach(function (v, i) {
              if (val.ID == v.ID) {
                self.dataList.splice(i, 1)
                self.deleteRow.unshift(val)
              }
            })
          })
        }
        // 删完数据后清除勾选框
        self.$refs.dataList.clearSelection()
      },

      SaveData: function () {
        let self = this
        self.$ajax.get('eqpapi/S_EQP004', {
            params:{
              EQP004DataS:JSON.stringify(self.dataList),
              DelEQP004S:JSON.stringify(self.deleteRow)
            }
          }
        ).then(
          function (res) {
            self.showDatas();
          }
        )
      },

      showDatas: function () {
        let self = this
        self.$ajax.get('eqpapi/Q_EQP004').then(
          function (response) {
            self.dataList = response.data['list'];
            selft.currentTotal = self.dataList.length;
          }
        )
      }
    }
  }
</script>

<style scoped>

</style>
