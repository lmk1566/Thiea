<template>
  <section>

    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item style="font-size: 20px">备件归还</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <!--主页面搜索-->
    <el-col :span="18" :class="this.Global.pageToolBarClass" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-select v-model="filters.form_num" placeholder="请选择归还单号" clearable filterable>
            <el-option
              v-for="item in recieveAllList"
              :key="item.id"
              :label="item.form_num"
              :value="item.form_num">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          归还时间：
          <el-date-picker
            v-model="filters.return_date"
            type="daterange"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"  @change="f_CooperdateArray" >
          </el-date-picker>
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
          <el-tooltip effect="dark" content="新增" placement="top">
            <el-button type="primary" plain round @click.prevent="f_Add">新增</el-button>
          </el-tooltip>
        </el-form-item>
      </el-form>
    </el-col>

    <!--主页面列表-->
    <el-table :data="resultData" highlight-current-row  border v-loading="listLoading"
              style="width: 100%;font-size: 18px;" :height="tableHeight"
              :header-cell-style="this.Global.headerCellStyle" :cell-style="this.Global.cellStyle">
      <el-table-column type="selection" width="45" align="center"></el-table-column>
      <el-table-column prop="id" width="50"  label="id"  header-align="center"  align="center" v-if="false">
        <template slot-scope="scope" style="color: #409EFF; cursor: pointer;"> {{ scope.row.id }} </template>
      </el-table-column>
      <el-table-column prop="form_num" label="归还单号"
                       min-width="180"  show-overflow-tooltip  header-align="center"
                       align="center" sortable>
        <template slot-scope="scope" style="color: #409EFF; cursor: pointer;">
          {{ scope.row.form_num }}
        </template>
      </el-table-column>
      <el-table-column prop="returner" label="归还人"
                       min-width="180" show-overflow-tooltip header-align="center"  align="left">
        <template slot-scope="scope" style="color: #409EFF; cursor: pointer;">
          {{ scope.row.returner }}
        </template>
      </el-table-column>
      <el-table-column prop="return_date" label="归还日期"
                       min-width="180" show-overflow-tooltip  header-align="center"  align="left">
        <template slot-scope="scope" style="color: #409EFF; cursor: pointer;">
          {{ scope.row.return_date }}
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="描述" min-width="80" show-overflow-tooltip   header-align="center"  align="center">
        <template slot-scope="scope" style="color: #409EFF; cursor: pointer;">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180"  align="center">
        <template slot-scope="scope">
          <div>
            <el-tooltip class="item" effect="dark" content="查看" placement="top">
              <el-button size="mini" type="info" icon="el-icon-view" circle  @click="f_ViewEdit(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top"  v-show="scope.row.Isinstock!='Y'">
              <el-button size="mini" type="primary" icon="el-icon-edit" circle   @click="f_Edit(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="f_Delete(scope.$index, scope.row)"></el-button>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!--主页面分页-->
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

    <!--编辑界面-->
    <el-dialog :title="editTitle"  :visible.sync="editFormVisible"  width="60%"
               :close-on-click-modal="false" v-dialogDrag>
      <div slot="title" style="font-size: 14px; font-weight: bold; color: #606266; " >
        <i class="fa fa-th-large" aria-hidden="true" style="margin-right: 10px;"></i>{{editTitle}}
      </div>
      <el-tabs v-model="activeTabName" type="border-card"
               style="margin:-20px 0px -20px 0px; border:#DCDFE6 1px solid; height: 450px;overflow-y:auto;overflow-x:auto;">
        <el-tab-pane label="基本信息" name="tabedit">
          <span slot="label"><i class="el-icon-tickets"></i> 基本信息</span>
          <el-form :model="editForm" label-width="180px" :rules="editFormRules" ref="editForm" style="margin:-20px -20px -20px -20px; border:#DCDFE6 1px solid;">
            <el-form-item  prop="id" v-if="false">
              <el-input v-model="editForm.id" v-if="false"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="8">
                <el-form-item label="归还单号" prop="form_num" :inline-message="true" style="margin-top: 10px;">
                  <el-input v-model="editForm.form_num"
                            placeholder="归还单号" maxlength="100" :disabled="editForm.id != 0"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="描述" prop="desc" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="16">
                <el-input type="textarea" v-model="editForm.desc" placeholder="请输入描述" maxlength="4000" :rows="4" ></el-input>
              </el-col>
            </el-form-item>
            <el-row>
              <el-col :span="8" style="width: auto">
                <el-form-item label="归还人" prop="returner" :inline-message="true" style="margin-top: 10px;">
                  <el-input v-model="editForm.returner" placeholder="请输入归还人" maxlength="100" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" style="width: auto">
                <el-form-item label="归还日期" prop="return_date" :inline-message="true" style="margin-top: 10px;">
                  <el-date-picker
                    v-model="editForm.return_date"
                    type="datetime"
                    placeholder="选择日期" :clearable="false" style="width: 230px" :disable="false">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="归还明细" name="tablist">
          <span slot="label"><i class="el-icon-circle-plus"></i> 归还明细</span>
          <div style="text-align: left; height: 40px; margin-top: 0px; padding-right: 0px;">
            <el-button type="primary" round plain
                       size="mini" icon="el-icon-plus" @click="fun_DetailAddRow">新增</el-button>
            <!--https://www.cnblogs.com/grt322/p/8531885.html ICON图标大全-->
          </div>
          <el-table :data="DetailData" highlight-current-row  border v-loading="listLoading"
                    style="width: 100%; "  :height="350" :cell-style="this.Global.cellStyle">
            <el-table-column type="selection" width="45" align="center"></el-table-column>
            <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
            <el-table-column prop="id" label="id" align="center" v-if="false">
              <template slot-scope="scope"> {{ scope.row.id }} </template>
            </el-table-column>
            <el-table-column prop="creator" label="creator" align="center" v-if="false">
              <template slot-scope="scope"> {{ scope.row.creator }} </template>
            </el-table-column>
            <el-table-column prop="patrs_num" label="备件编号"
                             width="260px;" header-align="center" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.patrs_num" placeholder="请选择备件编号" ref="patrs_num" :disabled="true">
                  <el-button slot="append" size="mini" icon="el-icon-search"
                             @click.native="f_DataSelectPatrsNum(scope.$index)" :disabled="false">
                  </el-button>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column prop="patrs_name" label="备件名称" ref="patrs_name"
                             width="260px;" header-align="center"  align="center">
              <template slot-scope="scope">{{ scope.row.patrs_name }}</template>
            </el-table-column>
            <el-table-column prop="patrs_fmt" label="规格型号"
                             width="260px;" header-align="center"  align="center">
              <template slot-scope="scope">{{ scope.row.patrs_fmt }}</template>
            </el-table-column>
            <el-table-column prop="patrs_code" label="备件分类"
                             width="260px;" header-align="center"  align="center">
              <template slot-scope="scope">{{ scope.row.patrs_code }}</template>
            </el-table-column>
            <el-table-column prop="lot_sn" label="Lot/SN"
                             width="260px;" header-align="center"  align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.lot_sn"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="unit" label="单位"
                             width="160px;" header-align="center"  align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.unit"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="qty" label="归还数量"
                             width="200px;" header-align="center"  align="center">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.qty" controls-position="right"
                                 :precision="2" :step="1" :min="0" :max="9999"
                                 style="width:130px;"></el-input-number><!--@change="f_Pucount(scope.row)" -->
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="删除" placement="top" >
                  <el-button size="mini" type="danger" icon="el-icon-delete" circle
                             @click="f_Delete(scope.$index, scope.row, 'D')"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" style="text-align: center; ">
        <el-button type="primary" @click.native="f_EditSubmit" :loading="editLoading" size="medium">保存</el-button>
        <el-button @click.native="f_EditClose" size="medium">取消</el-button>
      </div>
    </el-dialog>

    <!--查看界面-->
    <el-dialog :title="editTitle"  :visible.sync="viewFormVisible"  width="65%"
               :close-on-click-modal="false" v-dialogDrag>
      <div slot="title" style="font-size: 14px; font-weight: bold; color: #606266; " >
        <i class="fa fa-th-large" aria-hidden="true" style="margin-right: 10px;"></i>归还单详情
      </div>
      <el-tabs v-model="activeTabName" type="border-card" style="margin:-20px 0px -20px 0px; border:#DCDFE6 1px solid; height: 450px;">
        <el-tab-pane label="基本信息" name="tabedit">
          <span slot="label"><i class="el-icon-tickets"></i> 基本信息</span>
          <el-form :model="editForm" label-width="180px" :rules="editFormRules" ref="editForm" style="margin:-20px -20px -20px -20px; border:#DCDFE6 1px solid;">
            <el-form-item  prop="id" v-if="false">
              <el-input v-model="editForm.id" v-if="false"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="8">
                <el-form-item label="归还单号" prop="form_num" :inline-message="true" style="margin-top: 10px;">
                  <el-input v-model="editForm.form_num"
                            placeholder="归还单号" maxlength="100" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="描述" prop="desc" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="16">
                <el-input type="textarea" v-model="editForm.desc"
                          placeholder="请输入描述" maxlength="4000" :rows="4" :disabled="true"></el-input>
              </el-col>
            </el-form-item>
            <el-row>
              <el-col :span="8" style="width: auto">
                <el-form-item label="归还人" prop="returner" :inline-message="true" style="margin-top: 10px;">
                  <el-input v-model="editForm.returner"
                            placeholder="请输入归还人" maxlength="100" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" style="width: auto">
                <el-form-item label="归还日期" prop="return_date" :inline-message="true" style="margin-top: 10px;">
                  <el-date-picker
                    v-model="editForm.return_date"
                    type="datetime"
                    placeholder="选择日期" :clearable="false" style="width: 230px" :disabled="true">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="归还明细" name="tablist">
          <span slot="label"><i class="el-icon-circle-plus"></i> 归还明细</span>
          <el-table :data="DetailData" highlight-current-row  border v-loading="listLoading"
                    style="width: 100%; "  :height="350" :cell-style="this.Global.cellStyle">
            <el-table-column type="selection" width="45" align="center"></el-table-column>
            <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
            <el-table-column prop="id" label="id" align="center" v-if="false">
              <template slot-scope="scope"> {{ scope.row.id }} </template>
            </el-table-column>
            <el-table-column prop="creator" label="creator" align="center" v-if="false">
              <template slot-scope="scope"> {{ scope.row.creator }} </template>
            </el-table-column>
            <el-table-column prop="patrs_num" label="备件编号"
                             width="260px;" header-align="center" align="center">
              <template slot-scope="scope"> {{ scope.row.patrs_num }} </template>
            </el-table-column>
            <el-table-column prop="patrs_name" label="备件名称" ref="patrs_name"
                             width="260px;" header-align="center"  align="center">
              <template slot-scope="scope">{{ scope.row.patrs_name }}</template>
            </el-table-column>
            <el-table-column prop="patrs_fmt" label="规格型号"
                             width="260px;" header-align="center"  align="center">
              <template slot-scope="scope">{{ scope.row.patrs_fmt }}</template>
            </el-table-column>
            <el-table-column prop="patrs_code" label="备件分类"
                             width="260px;" header-align="center"  align="center">
              <template slot-scope="scope">{{ scope.row.patrs_code }}</template>
            </el-table-column>
            <el-table-column prop="lot_sn" label="Lot/SN"
                             width="260px;" header-align="center"  align="center">
              <template slot-scope="scope"> {{ scope.row.lot_sn }} </template>
            </el-table-column>
            <el-table-column prop="unit" label="单位"
                             width="160px;" header-align="center"  align="center">
              <template slot-scope="scope"> {{ scope.row.unit }} </template>
            </el-table-column>
            <el-table-column prop="qty" label="归还数量"
                             width="200px;" header-align="center"  align="center">
              <template slot-scope="scope"> {{ scope.row.qty }} </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="删除" placement="top" :disabled="true">
                  <el-button size="mini" type="danger" icon="el-icon-delete" circle :disabled="true"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" style="text-align: center; ">
        <el-button @click.native="f_ViewClose" size="medium">取消</el-button>
      </div>
    </el-dialog>

    <!--备件选择-->
    <el-dialog  :visible.sync="dataSelectMaintVisible"  width="60%"  v-dialogDrag :close-on-click-modal="false">
      <div slot="title" style="font-size: 14px; font-weight: bold; color: #606266;" >
        <i class="fa fa-th-large" aria-hidden="true" style="margin-right: 10px;"></i>备件选择
      </div>
      <!--搜索-->
      <div style="margin-top: -10px;">
        <el-form :inline="true" :model="patrsFilters">
          <el-form-item>
            <el-input v-model="patrsFilters.patrs_num" placeholder="备件编码" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" circle icon="el-icon-search" v-on:click="f_DataSelecPatrsSearch"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--列表-->
      <el-table :data="searchDataList.slice((searchPage-1)*15,searchPage*15)"
                highlight-current-row  border style="width: 100%;" height="300"
                @row-click="f_DataSelectPatrsNumClick"
                @row-dblclick="f_DataSelectPatrsNumDbClick"
                :header-cell-style="this.Global.headerCellStyle" :cell-style="this.Global.cellStyle">
        <el-table-column type="index" width="60"  label="序号"  header-align="center" align="center">
        </el-table-column>
        <el-table-column prop="id" label="id" v-if="false">
          <template slot-scope="scope"> {{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column prop="patrs_num" label="备件编码"  min-width="200"  header-align="center"  align="center"  show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="patrs_name" label="备件名称" min-width="200"  header-align="center"  show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="patrs_fmt" label="备件规格" min-width="200"  header-align="center"  show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="patrs_code" label="备件分类" min-width="200"  header-align="center"  show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div style="margin-top: 10px;">
        <el-pagination
          background
          @current-change="handleSearchCurrentChange"
          :current-page="searchPage"
          :page-size="15"
          layout="total, prev, pager, next, jumper"
          :total="searchDataTotal" style="float:right;">
        </el-pagination>
      </div>
      <!--按钮-->
      <div slot="footer" style="text-align: center;">
        <el-button type="primary" @click.native="f_DataSelectPatrsNumChoose" :loading="editLoading" size="medium">选择</el-button>
        <el-button @click.native="f_DataSelectPatrsNumClose" size="medium">取消</el-button>
      </div>
    </el-dialog>

  </section>
</template>

<script>
  export default {
    data() {
      return {
        //表格高度
        tableHeight:this.Global.pagetableHeight,

        //主页面搜索
        filters: {
          form_num: '',
          return_date:'',
        },
        resultData: [],
        listLoading: false,

        //主页面分页
        currentPage: 1,
        pageSize: 15,
        currentTotal: 0,

        //编辑界面
        activeTabName:'tabedit',
        editTitle: '',
        editFormVisible: false,
        editLoading: false,
        editFormRules: {
          form_num:[
            {required: true, message: '归还单号不能为空', trigger: 'blur'}
          ],
        },
        editForm: {                //主表数据集
          id:0,                    //本单据ID
          form_num:'',
          returner:'',
          return_date:new Date(),
          status:0,
          desc:'',
        },
        DetailData: [],              //明细表数据集
        detailSelCurRow:0,           //明细表当前选择行
        //查看界面
        viewFormVisible: false,

        //备件选择弹出界面
        searchPage: 1,
        searchDataTotal:0,
        searchDataList:[],
        dataSelectMaintVisible:false,
        dataSelectMaintLoading:false,
        patrsFilters: {
          patrs_num: '',
        },
        patrsNumRow:{},//备件选择选择行

        //资源
        recieveAllList:[], //分类码下拉框，搜索用
      }
    },
    methods: {
      //日期选择改变事件
      f_CooperdateArray: function () {
        if(this.filters.CooperdateArray==null){
          this.filters.startDate = null;
          this.filters.endDate = null;
        }
        else {
          this.filters.startDate = this.filters.CooperdateArray[0];
          this.filters.endDate = this.filters.CooperdateArray[1];
        }
      },

      //主页面分页
      handleSizeChange(val) {
        this.pageSize = val;
        console.log(`每页 ${val} 条`);
      },
      //主页面分页
      handleCurrentChange(val) {
        this.currentPage = val;
        console.log(`当前页: ${val}`);
      },

      //主界面点新增，弹出编辑界面
      f_Add: function () {
        var mydate = new Date();
        mydate.setHours(mydate.getHours());
        mydate.setMinutes(mydate.getMinutes());
        mydate.setSeconds(mydate.getSeconds());

        this.editFormVisible=true;
        this.editTitle='新增归还单';
        this.editForm = {
          id:0,                    //本单据ID
          form_num:'',
          returner:'',
          return_date:mydate,
          status:0,
          desc:'',
        };
        this.patrsNumRow={};       //备件选择选中行
        this.DetailData=[];
      },
      //显示编辑界面
      f_Edit: function (index, row) {
        this.editFormVisible = true;
        this.editTitle = '归还单编辑';
        this.editForm = Object.assign({}, row);
        this.DetailData=[];
        this.patrsNumRow={};
        this.activeTabName='tabedit';
        this.f_EditGetDetail(row.id);
      },
      //编辑
      f_EditGetDetail:function(pkid){
        this.listLoading=true;
        let pars= {
          master_id: pkid,
        };
        let _this=this;
        this.$httpGet('eqpapi/V_EQP036M',pars).then((res)=> {
          if(res['msg'] =='success') {
          _this.editForm = res['m_data'];
          _this.DetailData = res['d_data'];
          _this.listLoading = false;
        }
      else {
          _this.listLoading = false;
        }
      }).catch(function (error) {
          _this.$message.error('数据错误！');
          _this.listLoading = false;
        });
      },

      //编辑界面点保存，提交事件
      f_EditSubmit:function () {
        let _this=this;
        this.$refs.editForm.validate(() => {
          if(this.Global.isNullOrEmpty(_this.editForm.form_num)) {
          this.$alert('归还单号不能为空！', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });
        } else {
          _this.editLoading = true;
          let pars = {
            baseInfo: _this.editForm,
            DetailInfo:JSON.stringify(_this.DetailData), //不封装URL就变成DetailInfo[]=...加了才是DetailInfo=[...]
            Operators:(_this.editForm.id != 0) ? 'U':'I'
          };
          _this.$httpGet('eqpapi/S_EQP036M', pars).then((res) => {
            if (res['msg'] == 'success') {
            _this.editLoading = false;
            _this.$message({
              showClose: true,
              message: '保存成功',
              type: 'success'
            });
            _this.editFormVisible = false;
            _this.f_ConfigLoad();
          } else {
            _this.$message({
              showClose: true,
              message: '保存失败',
              type: 'warning'
            });
            _this.editLoading = false;
          }
        }).catch(function (error) {
            _this.$message.error('数据错误！');
            _this.editLoading = false;
          });
        }
      });
      },

      //编辑界面点取消，提交取消事件
      f_EditClose:function () {
        this.$refs['editForm'].resetFields();
        this.editFormVisible = false;
      },
      // 编辑界面明细页面增加行
      fun_DetailAddRow() {
        var list = {
          id:0,
          patrs_num:'',
          lot_sn:'',
          unit:'',
          qty:0,
          patrs_name:'',
          patrs_fmt:'',
          patrs_code:'',
        }
        this.DetailData.unshift(list)
      },
      //编辑页面明细行选择批量删除
      f_DetailDelete:function(index, row) {
        if (index > -1) {
          this.DetailData.splice(index, 1);
          this.detailData.unshift(row)
        }
      },
      //删除主表数据，或者删除从表数据
      f_Delete: function (index, row, op_flag = 'M') {
        let _this=this;
        this.$confirm('确定删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.listLoading = true;
        if (op_flag != 'M'){
          _this.DetailData.splice(index, 1);
        }

        let pars= {
          row_id: row.id,
          op_flag:op_flag,
          baseInfo:JSON.stringify(row)
        };
        _this.$httpGet('eqpapi/D_EQP036M',pars).then((res)=> {
          _this.listLoading = false;
        if(res['msg']=='success') {
          _this.listLoading = false;
          _this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          });
          if (op_flag == 'M') {
            _this.f_Search();
          }
        }
        else {
          _this.$message({
            showClose: true,
            message: '删除失败',
            type: 'error'
          });
          _this.listLoading = false;
        }
      }) .catch(function (error) {
          _this.$message.error('数据错误！');
          _this.listLoading = false;
        });
      }).catch(() => {});
      },

      //===============================================================
      //查看维保方案详细信息
      f_ViewEdit:function(index,row){
        this.viewFormVisible=true;
        this.editTitle = '归还单详情';
        this.editForm = Object.assign({}, row);
        this.patrsNumRow={};
        this.activeTabName='tabedit';
        this.f_EditGetDetail(row.id);
      },
      f_ViewClose:function(index,row){
        this.viewFormVisible=false;
      },
      //===============================================================
      //备件选择选择事件
      f_DataSelectPatrsNum:function(index) {
        this.dataSelectMaintVisible = true;
        this.detailSelCurRow = index;
      },
      //备件选择搜索
      f_DataSelecPatrsSearch:function(){
        this.dataSelectPatrsLoading = true;
        let pars= {
          page: this.searchPage,
          size: this.size,
          patrs_num: this.patrsFilters.patrs_num,
        };
        let _this = this;
        this.$httpGet('eqpapi/Q_EQP036Find',pars).then((res)=> {
          if(res['msg'] == 'success') {
          _this.searchDataList = res['list'];
          _this.searchDataTotal=_this.searchDataList.length;
          _this.dataSelectPatrsLoading = false;
        } else {
          _this.dataSelectPatrsLoading = false;
        }
      }).catch(function (error) {
          _this.$message.error('数据错误！');
          _this.dataSelectPatrsLoading = false;
        });

      },
      //备件选择分页
      handleSearchCurrentChange(val) {
        this.searchPage = val;
      },
      //备件选择单击事件
      f_DataSelectPatrsNumClick:function(row, event, column){
        this.patrsNumRow = row;
      },
      //备件选择双击事件
      f_DataSelectPatrsNumDbClick:function(row, event, column){
        this.patrsNumRow = row;
        this.f_DataSelectPatrsNumChoose();
      },
      //备件选择选择事件
      f_DataSelectPatrsNumChoose:function(){
        this.dataSelectMaintVisible=false;
        if (this.Global.isNullOrEmpty(this.patrsNumRow.patrs_num)) {
          this.$alert('请选择数据', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });
        } else {
          //this.$refs.patrs_num.value = this.patrsNumRow.patrs_num;
          //this.$set()和Vue.set()本质方法一样，前者可以用在methods中使用。set方法调用时，可以触发页面全部重新渲染。
          //https://www.cnblogs.com/macq/p/9047668.html
          //this.$set(this.DetailData[this.detailSelCurRow], 'patrs_num', this.patrsNumRow.patrs_num);
          //this.$set(this.DetailData[this.detailSelCurRow], 'patrs_name', this.patrsNumRow.patrs_name);

          var SelRow = this.DetailData[this.detailSelCurRow];
          SelRow.patrs_num = this.patrsNumRow.patrs_num;
          SelRow.patrs_name = this.patrsNumRow.patrs_name;
          SelRow.patrs_code = this.patrsNumRow.patrs_code;
          SelRow.patrs_fmt = this.patrsNumRow.patrs_fmt;

          this.$set(this.DetailData,this.detailSelCurRow,SelRow);
        }
      },
      //备件选择选择关闭
      f_DataSelectPatrsNumClose:function(){
        this.dataSelectMaintVisible=false;
      },


      //===============================================================
      //数据资源加载
      f_ConfigLoad:function(){
        let _this=this;

        //this.$httpPost('eqpapi/Q_EQP012Z/',{}).then((res)=> {
        //注意POST和GET的URL，后面要加'/'
        this.$httpGet('eqpapi/Q_EQP036M',{}).then((res)=> {
          if(res['msg'] == 'success') {
          _this.recieveAllList = res['list']
          _this.resultData     = res['list']
        } else {
          _this.$message.warnings('没有符合条件的数据！');
        }
      }).catch(function (error) {
          _this.$message.error('数据错误！');
        });
      },

      //搜索
      f_Search: function () {
        //url参数
        let _this=this;
        let params = {
          form_num: this.filters.form_num,
          return_date:this.filters.return_date
        };

        _this.listLoading = true;

        _this.$httpGet('eqpapi/Qry036MStd', params).then((res) => {
          if (res['msg']== 'success') {
          _this.resultData = res['list'];
          _this.listLoading = false;
        } else {
          _this.listLoading = false;
        }
      }).catch(function (error) {
          _this.$message.error('获取数据出错！');
          _this.listLoading = false;
        });
      },
    },
    mounted() {
      this.listLoading = true;
      this.f_ConfigLoad(); //资源加载
      this.listLoading = false; //控制v-loading属性
    },
  }
</script>

<style>
</style>
