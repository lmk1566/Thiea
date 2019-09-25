<template>
  <section>

    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item style="font-size: 20px">维保方案配置</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <!--主页面搜索-->
    <el-col :span="18" :class="this.Global.pageToolBarClass" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-select v-model="filters.MAINT_CONF_CODE" placeholder="请选择方案编码" clearable filterable>
            <el-option
              v-for="item in maintTypeAllList"
              :key="item.id"
              :label="item.MAINT_CONF_CODE + ' # ' + item.MAINT_CONF_NAME"
              :value="item.MAINT_CONF_CODE">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          维护时间：
          <el-date-picker
            v-model="filters.CREATE_DATE"
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
      <el-table-column prop="MAINT_CONF_CODE" label="方案编码"
                       min-width="180"  show-overflow-tooltip  header-align="center"
                       align="center" sortable>
        <template slot-scope="scope" style="color: #409EFF; cursor: pointer;" @click="f_View(scope.$index, scope.row)">
          {{ scope.row.MAINT_CONF_CODE }}
        </template>
      </el-table-column>
      <el-table-column prop="MAINT_CONF_NAME" label="方案名称" min-width="180" show-overflow-tooltip   header-align="center"  align="left">
        <template slot-scope="scope" style="color: #409EFF; cursor: pointer;" @click="f_View(scope.$index, scope.row)">
          {{ scope.row.MAINT_CONF_NAME }}
        </template>
      </el-table-column>
      <el-table-column prop="maint_id" label="维保分类"  header-align="center"  align="center" v-if="false">
        <template slot-scope="scope" style="color: #409EFF; cursor: pointer;"> {{ scope.row.maint_id }} </template>
      </el-table-column>
      <el-table-column prop="MAINT_NAME" label="维保分类" min-width="180" show-overflow-tooltip   header-align="center"  align="left">
        <template slot-scope="scope" style="color: #409EFF; cursor: pointer;" @click="f_View(scope.$index, scope.row)">
          {{ scope.row.MAINT_NAME }}
        </template>
      </el-table-column>
      <el-table-column prop="STATUS" label="状态" min-width="70"  header-align="center"  align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.STATUS==0">
            <el-tag type="info" size="medium">草稿</el-tag><!--size="small" size="mini"-->
          </div>
          <div v-else-if="scope.row.STATUS==1">
            <el-tag type="success" size="medium">启用</el-tag>
          </div>
          <div v-else>
            <el-tag type="warning"  size="medium">停用</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="CREATOR" label="维护人" min-width="80" show-overflow-tooltip   header-align="center"  align="center">
        <template slot-scope="scope" style="color: #409EFF; cursor: pointer;">
          {{ scope.row.CREATOR }}
        </template>
      </el-table-column>
      <el-table-column prop="CREATE_DATE" label="维护时间"  min-width="150"
                       header-align="center"  align="center" sortable>
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.CREATE_DATE | moment }}</span>
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
               style="margin:-20px 0px -20px 0px; border:#DCDFE6 1px solid; height: 450px;overflow-y:auto;overflow-x:hidden;">
        <el-tab-pane label="基本信息" name="tabedit">
              <span slot="label"><i class="el-icon-tickets"></i> 基本信息</span>
              <el-form :model="editForm" label-width="180px" :rules="editFormRules" ref="editForm" style="margin:-20px -20px -20px -20px; border:#DCDFE6 1px solid;">
                <el-form-item  prop="id" v-if="false">
                    <el-input v-model="editForm.id" v-if="false"></el-input>
                </el-form-item>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="维保方案编码" prop="maintConfCode" :inline-message="true" style="margin-top: 10px;">
                      <el-input v-model="editForm.maintConfCode"
                                placeholder="维保方案编码" maxlength="100" :disabled="editForm.id != 0"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="方案名称" prop="maintConfName" :inline-message="true" style="margin-top: 10px;">
                      <el-input v-model="editForm.maintConfName" placeholder="方案名称" maxlength="100" ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item  prop="maint_id" v-if="false">
                      <el-input v-model="editForm.maint_id" v-if="false"></el-input>
                    </el-form-item>
                    <el-form-item label="维保分类" prop="maintName" :inline-message="true" style="margin-top:10px;width:230px;">
                      <el-input v-model.trim="editForm.maintName"
                                placeholder="请选择维保分类" maxlength="30"
                                style="width:230px;"
                                :disabled="true">
                        <el-button slot="append" icon="el-icon-search" @click.native="f_DataSelectMaintType"></el-button>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="状态" prop="status" :inline-message="true" style="margin-top: 10px;width: 270px">
                      <template slot-scope="scope">
                        <div v-if="editForm.status==0">
                          <el-tag type="info" size="medium">草稿</el-tag><!--size="small" size="mini"-->
                        </div>
                        <div v-else-if="editForm.status==1">
                          <el-tag type="success" size="medium">启用</el-tag>
                        </div>
                        <div v-else>
                          <el-tag type="warning"  size="medium">停用</el-tag>
                        </div>
                      </template>
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
                    <el-form-item label="维护人" prop="creator" :inline-message="true" style="margin-top: 10px;">
                      <el-input v-model="editForm.creator" placeholder="请输入维护人" maxlength="100" ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" style="width: auto">
                    <el-form-item label="维护日期" prop="createDate" :inline-message="true" style="margin-top: 10px;">
                      <el-date-picker
                        v-model="editForm.createDate"
                        type="datetime"
                        placeholder="选择日期" :clearable="false" style="width: 230px" :disable="false">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
          </el-tab-pane>
        <el-tab-pane label="维保方案明细" name="tablist">
          <span slot="label"><i class="el-icon-circle-plus"></i> 维保方案明细</span>
          <div style="text-align: left; height: 40px; margin-top: 0px; padding-right: 0px;">
            <el-button type="primary" round size="mini" icon="el-icon-plus" @click="fun_DetailAddRow">新增</el-button>
            <!--<el-button type="danger" round size="mini" icon="el-icon-minus" @click="f_ProductAdd">批量删除</el-button>-->
            <!--https://www.cnblogs.com/grt322/p/8531885.html ICON图标大全-->
          </div>
          <el-table :data="maintDetailData" highlight-current-row  border v-loading="listLoading"
                    style="width: 100%; "  :height="350" :cell-style="this.Global.cellStyle">
            <el-table-column type="selection" width="45" align="center"></el-table-column>
            <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
            <el-table-column prop="id" label="id" width="1px" align="center" v-if="false">
              <template slot-scope="scope"> {{ scope.row.id }} </template>
            </el-table-column>
            <el-table-column prop="creator" label="creator" width="1px" align="center" v-if="false">
              <template slot-scope="scope"> {{ scope.row.creator }} </template>
            </el-table-column>
            <el-table-column prop="proj_name" label="事项名称"  min-width="100"  show-overflow-tooltip
                             header-align="center" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.proj_name"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="maint_pos" label="维保部位" min-width="100" show-overflow-tooltip
                             header-align="center"  align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.maint_pos"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="maint_method" label="维保方法" min-width="150"
                             header-align="center"  align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.maint_method"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="maint_std" label="维保要求" min-width="130"  header-align="center"  align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.maint_std"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="ref_limit" label="参考下限" min-width="150"  header-align="center"  align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.ref_limit"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="ref_upper" label="参考上限" min-width="150"  header-align="center"  align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.ref_upper"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="stand_hours" label="标准工时" min-width="130"  header-align="center"  align="center">
              <template slot-scope="scope">
                <!--
                <el-input-number v-model="scope.row.Puprice" controls-position="right" :precision="2" :step="1" :min="0" :max="100000"
                                 @change="f_Pucount(scope.row)" style="width:130px;"></el-input-number>
                -->
                <el-input v-model="scope.row.stand_hours"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="60"  align="center">
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
        <i class="fa fa-th-large" aria-hidden="true" style="margin-right: 10px;"></i>维保方案查看
      </div>
      <el-tabs v-model="activeTabName" type="border-card" style="margin:-20px 0px -20px 0px; border:#DCDFE6 1px solid; height: 450px;">
        <el-tab-pane label="基本信息" name="tabedit">
          <span slot="label"><i class="el-icon-tickets"></i> 基本信息</span>
          <el-form :model="editForm" label-width="180px" :rules="editFormRules" ref="editForm" style="margin:-20px -20px -20px -20px; border:#DCDFE6 1px solid;">
            <!--<el-form-item><div style="height: 30px;"></div></el-form-item>-->
            <el-form-item  prop="id" v-if="false">
              <el-input v-model="editForm.id" v-if="false"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="8">
                <el-form-item label="维保方案编码" prop="maintConfCode" :inline-message="true" style="margin-top: 10px;">
                  <el-input v-model="editForm.maintConfCode" placeholder="维保方案编码" maxlength="100" :disabled="true">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="方案名称" prop="maintConfName" :inline-message="true" style="margin-top: 10px;">
                  <el-input v-model="editForm.maintConfName" placeholder="方案名称" maxlength="100"  :disabled="true"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item  prop="maint_id" v-if="false">
                  <el-input v-model="editForm.maint_id" v-if="false"></el-input>
                </el-form-item>
                <el-form-item label="维保分类" prop="maintName" :inline-message="true" style="margin-top:10px;width:230px;">
                  <el-input v-model.trim="editForm.maintName"
                            placeholder="请选择维保分类" maxlength="30"
                            style="width:230px;"
                            :disabled="true">
                    <el-button slot="append" icon="el-icon-search"
                               @click.native="f_DataSelectMaintType" :disabled="true">
                    </el-button>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="状态" prop="status" :inline-message="true" style="margin-top: 10px;width: 270px">
                  <template slot-scope="scope">
                    <div v-if="editForm.status==0">
                      <el-tag type="info" size="medium">草稿</el-tag><!--size="small" size="mini"-->
                    </div>
                    <div v-else-if="editForm.status==1">
                      <el-tag type="success" size="medium">启用</el-tag>
                    </div>
                    <div v-else>
                      <el-tag type="warning"  size="medium">停用</el-tag>
                    </div>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="描述" prop="desc" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="16">
                <el-input type="textarea" v-model="editForm.desc"
                          placeholder="请输入描述" maxlength="4000" :rows="4"  :disabled="true">
                </el-input>
              </el-col>
            </el-form-item>
            <el-row>
              <el-col :span="8" style="width: auto">
                <el-form-item label="维护人" prop="creator" :inline-message="true" style="margin-top: 10px;">
                  <el-input v-model="editForm.creator" placeholder="请输入维护人" maxlength="100"  :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" style="width: auto">
                <el-form-item label="维护日期" prop="createDate" :inline-message="true" style="margin-top: 10px;">
                  <el-date-picker
                    v-model="editForm.createDate"
                    type="datetime"
                    placeholder="选择日期" :clearable="false" style="width: 230px" :disable="true">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="维保方案明细" name="tablist">
          <span slot="label"><i class="el-icon-circle-plus"></i> 维保方案明细</span>
          <el-table :data="maintDetailData" highlight-current-row  border v-loading="listLoading"
                    style="width: 100%; "  :height="350" :cell-style="this.Global.cellStyle">
            <el-table-column type="selection" width="45" align="center"></el-table-column>
            <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
            <el-table-column prop="id" label="id" width="60" align="center" v-if="false">
              <template slot-scope="scope"> {{ scope.row.id }} </template>
            </el-table-column>
            <el-table-column prop="creator" label="creator" width="1px" align="center" v-if="false">
              <template slot-scope="scope"> {{ scope.row.creator }} </template>
            </el-table-column>
            <el-table-column prop="create_date" label="create_date" width="1px" align="center" v-if="false">
              <template slot-scope="scope"> {{ scope.row.create_date }} </template>
            </el-table-column>
            <el-table-column prop="proj_name" label="事项名称"  min-width="100"  show-overflow-tooltip
                             header-align="center" align="center">
              <template slot-scope="scope"> {{ scope.row.proj_name }}</template>
            </el-table-column>
            <el-table-column prop="maint_pos" label="维保部位" min-width="100" show-overflow-tooltip
                             header-align="center"  align="center">
              <template slot-scope="scope"> {{ scope.row.maint_pos }}</template>
            </el-table-column>
            <el-table-column prop="maint_method" label="维保方法" min-width="150"
                             header-align="center"  align="center">
              <template slot-scope="scope"> {{ scope.row.maint_method }}</template>
            </el-table-column>
            <el-table-column prop="maint_std" label="维保要求" min-width="130"  header-align="center"  align="center">
              <template slot-scope="scope"> {{ scope.row.maint_std }}</template>
            </el-table-column>
            <el-table-column prop="ref_limit" label="参考下限" min-width="150"  header-align="center"  align="center">
              <template slot-scope="scope"> {{ scope.row.ref_limit }}</template>
            </el-table-column>
            <el-table-column prop="ref_upper" label="参考上限" min-width="150"  header-align="center"  align="center">
              <template slot-scope="scope"> {{ scope.row.ref_upper }}</template>
            </el-table-column>
            <el-table-column prop="stand_hours" label="标准工时" min-width="130"  header-align="center"  align="center">
              <template slot-scope="scope"> {{ scope.row.stand_hours }}</template>
            </el-table-column>
            <el-table-column label="操作" width="60"  align="center">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <el-button size="mini" type="danger" icon="el-icon-delete"
                             circle @click="" :disabled="true"></el-button>
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

    <!--维保分类选择-->
    <el-dialog  :visible.sync="dataSelectMaintVisible"  width="60%"  v-dialogDrag :close-on-click-modal="false">
      <div slot="title" style="font-size: 14px; font-weight: bold; color: #606266;" >
        <i class="fa fa-th-large" aria-hidden="true" style="margin-right: 10px;"></i>维保分类选择
      </div>
      <!--搜索-->
      <div style="margin-top: -10px;">
        <el-form :inline="true" :model="maintTypeFilters">
          <el-form-item>
            <el-input v-model="maintTypeFilters.MAINT_CODE" placeholder="维保分类码" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" v-on:click="f_DataSelecMainTSearch">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--列表-->
      <el-table :data="MaintTypeList.slice((maintpage-1)*15,maintpage*15)"
                highlight-current-row  border style="width: 100%;" height="300"
                @row-click="f_DataSelectMaintTypeClick" 
                @row-dblclick="f_DataSelectMaintTypeDbClick" 
                :header-cell-style="this.Global.headerCellStyle" :cell-style="this.Global.cellStyle">
        <el-table-column type="index" width="60"  label="序号"  header-align="center" align="center">
        </el-table-column>
        <el-table-column prop="ID" label="id"  min-width="200"
                         header-align="center"  align="center"
                         show-overflow-tooltip  v-if="false">
          <template slot-scope="scope"> {{ scope.row.ID }}</template>
        </el-table-column>
        <el-table-column prop="MAINT_CODE" label="维保分类码"  min-width="200"  header-align="center"  align="center"  show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="MAINT_NAME" label="维保分类名称" min-width="200"  header-align="center"  show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="REMARK" label="描述" min-width="200"  header-align="center"  show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div style="margin-top: 10px;">
        <el-pagination
          background
          @current-change="handleMainTypeCurrentChange"
          :current-page="maintpage"
          :page-size="15"
          layout="total, prev, pager, next, jumper"
          :total="mainTypeTotal" style="float:right;">
        </el-pagination>
      </div>
      <!--按钮-->
      <div slot="footer" style="text-align: center;">
        <el-button type="primary" @click.native="f_DataSelectMaintTypeChoose" :loading="editLoading" size="medium">选择</el-button>
        <el-button @click.native="f_DataSelectMaintTypeClose" size="medium">取消</el-button>
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
        //列表界面
        filters: {
          id: '',
          MAINT_CONF_CODE: '',
          MAINT_CONF_NAME:'',
          CREATE_DATE:'',
        },
        resultData: [],
        listLoading: false,

        //主页面分页
        currentPage: 1,
        pageSize: 15,
        currentTotal: 0,

        //编辑界面
        maintDetailData:[],
        activeTabName:'tabedit',
        editTitle: '',
        editFormVisible: false,
        editLoading: false,
        editFormRules: {
          maintName:[
            {required: true, message: '维保分类不能为空', trigger: 'blur'}
          ],
          maintConfCode: [
            {required: true, message: '维保方案编码不能为空', trigger: 'blur'}
          ],
          maintConfName: [
            {required: true, message: '维保方案名称不能为空', trigger: 'blur'}
          ],
        },
        editForm: {                //主表数据集
          id:0,                    //本单据ID
          maintConfCode:'',         //维保方案编码
          maintConfName:'',         //维保方案名称
          status:0,                 //单据状态
          desc:'',                  //描述
          creator:'',               //维护人
          createDate:new Date(),    //维护时间
          maint_id:0,                //维保分类ID
          maintName:'',             //维保分类名称
        },
        detailData: [],              //明细表数据集
        //查看界面
        viewFormVisible: false,

        //维保弹出界面
        maintpage: 1,
        mainTypeTotal:0,
        MaintTypeList:[],              //维保分类列表
        dataSelectMaintVisible:false,
        dataSelectMaintLoading:false,
        maintTypeFilters: {
          MAINT_CODE: '',
        },
        maintTypeRow:{},//维保分类选择行

        //资源
        maintTypeAllList:[], //分类码下拉框，搜索用
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
        this.editFormVisible=true;
        this.editTitle='新增维保方案';
        this.editForm = {
          id:0,                     //本单据ID
          maintConfCode:'',         //维保方案编码
          maintConfName:'',         //维保方案名称
          status:0,                 //单据状态
          desc:'',                  //描述
          creator:'',               //维护人
          createDate:mydate,        //维护时间
          maint_id:0,                //维保分类ID
          maintName:'',             //维保分类名称
        };
        this.maintTypeRow={};       //维保分类选中行
        this.maintDetailData=[];
      },
      //显示编辑界面
      f_Edit: function (index, row) {
        this.editFormVisible = true;
        this.editTitle = '维保方案编辑';
        this.editForm = Object.assign({}, row);
        this.maintDetailData=[];
        this.maintTypeRow={};
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
        this.$httpGet('eqpapi/V_EQP012M',pars).then((res)=> {
          if(res['msg'] =='success') {
          _this.editForm = res['m_data'];
          _this.maintDetailData = res['d_data'];
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
      //查看明细
      f_View:function(index,row){
        this.$router.push({
          path: '/purchase/PurchaseDetailList',
          query: {
            purchaseId: row.Purchaseid,
          },
        });
      },
      //编辑界面点保存，提交事件
      f_EditSubmit:function () {
        let _this=this;
        this.$refs.editForm.validate((valid) => {
          if (valid == false) {
            if(_this.editForm.maintConfCode == null ||_this.editForm.maintConfCode.length<=0) {
              this.$alert('维保方案编码不能为空！', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              });
            };
            if(_this.editForm.maintConfName == null ||_this.editForm.maintConfName.length<=0) {
              this.$alert('方案名称不能为空！', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              });
            }
          } else {
            _this.editLoading = true;
            let pars = {
              baseInfo: _this.editForm,
              DetailInfo:JSON.stringify(_this.maintDetailData), //不封装URL就变成DetailInfo[]=...加了才是DetailInfo=[...]
              Operators:(_this.editForm.id != 0) ? 'U':'I'
            };
            _this.$httpGet('eqpapi/S_EQP012M', pars).then((res) => {
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
          proj_name:'',
          maint_pos:'',
          maint_method:'',
          maint_std:'',
          ref_upper:'',
          ref_limit:'',
          stand_hours:'',
          remark:'',
          creator:''
        }
        this.maintDetailData.unshift(list)
      },
      //编辑页面明细行选择批量删除
      f_DetailDelete:function(index, row) {
        if (index > -1) {
          this.maintDetailData.splice(index, 1);
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
            _this.maintDetailData.splice(index, 1);
          }

        let pars= {
          row_id: row.id,
          op_flag:op_flag,
          baseInfo:JSON.stringify(row)
        };
        _this.$httpGet('eqpapi/D_EQP012M',pars).then((res)=> {
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
        this.editTitle = '维保方案编辑';
        this.editForm = Object.assign({}, row);
        this.maintTypeRow={};
        this.activeTabName='tabedit';
        this.f_EditGetDetail(row.id);
      },
      f_ViewClose:function(index,row){
        this.viewFormVisible=false;
      },
      //===============================================================
      //维保分类选择事件
      f_DataSelectMaintType:function() {
        this.dataSelectMaintVisible = true;
      },
      //维保分类搜索
      f_DataSelecMainTSearch:function(){
        this.dataSelectMaintLoading = true;
        let pars= {
          page: this.maintpage,
          size: this.size,
          MAINT_CODE: this.maintTypeFilters.MAINT_CODE,
        };
        let _this = this;
        this.$httpGet('eqpapi/Qry007Std',pars).then((res)=> {
          if(res['msg'] == 'success') {
            _this.MaintTypeList = res['list'];
            _this.mainTypeTotal=_this.MaintTypeList.length;
            _this.dataSelectMaintLoading = false;
          } else {
            _this.dataSelectMaintLoading = false;
          }
        }).catch(function (error) {
          _this.$message.error('数据错误！');
          _this.dataSelectMaintLoading = false;
        });

      },
      //维保分类分页
      handleMainTypeCurrentChange(val) {
        this.maintpage = val;
      },
      //维保分类单击事件
      f_DataSelectMaintTypeClick:function(row, event, column){
        this.maintTypeRow = row;
      },
      //维保分类双击事件
      f_DataSelectMaintTypeDbClick:function(row, event, column){
        this.maintTypeRow = row;
        this.f_DataSelectMaintTypeChoose();
      },
      //维保分类选择事件
      f_DataSelectMaintTypeChoose:function(){
        this.dataSelectMaintVisible=false;
        if (this.Global.isNullOrEmpty(this.maintTypeRow.MAINT_CODE)) {
          this.$alert('请选择数据', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });
        }
        else{
          this.editForm.maint_id   = this.maintTypeRow.ID;
          this.editForm.maintName = this.maintTypeRow.MAINT_NAME;
        }
      },
      //维保分类选择关闭
      f_DataSelectMaintTypeClose:function(){
        this.dataSelectMaintVisible=false;
      },


      //===============================================================
      //数据资源加载
      f_ConfigLoad:function(){
        let _this=this;

        //this.$httpPost('eqpapi/Q_EQP012Z/',{}).then((res)=> {
        //注意POST和GET的URL，后面要加'/'
        this.$httpGet('eqpapi/Q_EQP012M',{}).then((res)=> {
          if(res['msg'] == 'success') {
            _this.maintTypeAllList = res['list']
            _this.resultData       = res['list']
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
        let strCreateDate = 'between (\'' + this.filters.CREATE_DATE + '\')'.replace(',', '\') and (\'');
        let _this=this;
        let params = {
          MAINT_CONF_CODE: this.filters.MAINT_CONF_CODE,
          CREATE_DATE:strCreateDate,//this.filters.CREATE_DATE,
        };

        _this.listLoading = true;

        _this.$httpGet('eqpapi/Qry012MStd', params).then((res) => {
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
