<template>
  <div class="app-container">
    <!-- 查询区 -->
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true">
      <!--        <el-form-item label="id" prop="userid">
                <el-input
                  v-model="queryParams.userid"
                  placeholder="请输入id"
                  clearable
                  size="small"
                  style="width: 240px"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>-->
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份证号" prop="idcard">
        <el-input
          v-model="queryParams.idcard"
          placeholder="请输入身份证号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态(是否在职)" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small" style="width: 240px">
          <el-option
            v-for="element in statusOptions"
            :key="element.key"
            :label="element.label"
            :value="element.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 按钮区 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['emuser:tEmUser:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['emuser:tEmUser:del']"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['emuser:tEmUser:edit']"
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdatejn"
        >修改技能信息
        </el-button>
        <el-button
          v-hasPermi="['emuser:tEmUser:edit']"
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdatejl"
        >修改项目履历
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['emuser:tEmUser:export']"
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出
        </el-button>
      </el-col>
      <el-dropdown @command="handleExportResume">
        <el-button size="mini" type="primary">
          导出简历<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu v-slot:default>
          <el-dropdown-item command="abc">农行简历</el-dropdown-item>
          <el-dropdown-item command="hf">恒丰简历</el-dropdown-item>
          <el-dropdown-item command="bai">备案信息表</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:tEmUser:import']"
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
        >导入
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:tEmUser:import']"
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleProImport"
        >项目履历导入
        </el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>
    <!-- 数据展示区 -->
    <el-table v-loading="loading" :data="tableList" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="expand">
        <template v-slot="props">
          <el-form label-position="left" inline class="demo-table-expand">

            <el-container width="100%">
              <el-aside width="80%">
                <el-form-item label="技能掌握程度" />
                <el-row>
                  <el-col>
                    <el-form-item label="熟练">
                      <span>{{ props.row.sl }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col>
                    <el-form-item label="熟悉">
                      <span>{{ props.row.sx }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col>
                    <el-form-item label="了解">
                      <span>{{ props.row.lj }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-aside>
            </el-container>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="id" align="center" prop="userid"/>  -->
      <el-table-column label="姓名" align="center" prop="name" min-width="120" />
      <el-table-column label="身份证号" align="center" prop="idcard" min-width="200" />
      <el-table-column label="性别" align="center" prop="gender" min-width="80">
        <template v-slot="{row}">
          <span v-if="row.gender==='0'">女</span>
          <span v-else-if="row.gender==='1'">男</span>
          <span v-else>{{ row.gender }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" prop="tel" min-width="150" />
      <el-table-column label="最高学历毕业院校" align="center" prop="zgbyyx" min-width="200" />
      <el-table-column label="最高学历专业" align="center" prop="zgxlzy" min-width="200" />
      <el-table-column label="最高学历" align="center" prop="zgxl" min-width="160">
        <template v-slot="{row}">
          <span v-if="row.zgxl==='0'">博士</span>
          <span v-else-if="row.zgxl==='1'">研究生</span>
          <span v-else-if="row.zgxl==='2'">本科</span>
          <span v-else-if="row.zgxl==='3'">大专</span>
          <span v-else-if="row.zgxl==='4'">高中</span>
          <span v-else-if="row.zgxl==='5'">其他</span>
          <span v-else>{{ row.zgxl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="毕业证编号" align="center" prop="zsbh" min-width="200" />
      <el-table-column label="技能" align="center" prop="skills" min-width="200" />
      <el-table-column label="入职日期" align="center" prop="entrydate" min-width="150" />
      <el-table-column label="最高学历毕业日期" align="center" prop="zgxlbyrq" min-width="150" />
      <el-table-column label="离职日期" align="center" prop="godate" min-width="150" />
      <el-table-column label="base地(入职地)" align="center" prop="basearea" min-width="160" />
      <el-table-column label="状态(是否在职)" align="center" prop="status" min-width="120">
        <template v-slot="{row}">
          <span v-if="row.status==='0'">离职</span>
          <span v-else-if="row.status==='1'">在职</span>
          <span v-else>{{ row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建者" align="center" prop="crtuser" min-width="120" />
      <el-table-column label="创建日期" align="center" prop="crtdate" min-width="150" />
      <el-table-column label="修改者" align="center" prop="upduser" min-width="120" />
      <el-table-column label="修改日期" align="center" prop="upddate" min-width="150" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" min-width="120">
        <template v-slot="{row}">
          <el-button-group>
            <el-tooltip placement="bottom" content="项目履历">
              <el-button
                size="medium"
                type="text"
                icon="el-icon-document"
                @click="handleProgram(row)"
              />
            </el-tooltip>
            <el-tooltip placement="bottom" content="上传附件">
              <el-button
                v-hasPermi="['emuser:tEmUser:edit']"
                size="medium"
                type="text"
                icon="el-icon-upload"
                @click="attachment(row)"
              />
            </el-tooltip>
            <el-tooltip placement="bottom" content="编辑">
              <el-button
                size="medium"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(row)"
              />
            </el-tooltip>
            <el-tooltip placement="bottom" content="删除">
              <el-button
                size="medium"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(row)"
              />
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 查看详细信息话框 -->
    <!--    <el-dialog :title="title" :visible.sync="openDetails" width="500px" append-to-body>
          <approvalDetail v-if="openDetails" :process-instance-id="instanceId" />
          <div slot="footer" class="dialog-footer">
            <el-button @click="openDetails=!openDetails">关闭</el-button>
          </div>
        </el-dialog>-->
    <!-- 新增弹出框 -->
    <el-dialog :title="title" :visible.sync="addDialog" width="70%" @close="closeDialogBefore('addForm')">
      <div class="score-lock">
        <el-form
          ref="addForm"
          :model="form"
          :rules="rules"
          label-width="30%"
          :inline-message="false"
        >
          <span style="color: #1a1a1a;font-size: medium"><b>基础信息</b></span>
          <el-row style="padding-top: 1%">
            <el-col :span="11">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="身份证号" prop="idcard" required>
                <el-input v-model="form.idcard" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="性别 " prop="gender">
                <el-select v-model="form.gender" placeholder="请选择性别">
                  <el-option label="女" value="0" />
                  <el-option label="男" value="1" />
                </el-select>

              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="手机号" prop="tel" required>
                <el-input v-model="form.tel" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="最高学历毕业院校" prop="zgbyyx">
                <el-input v-model="form.zgbyyx" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="最高学历专业" prop="zgxlzy">

                <el-input v-model="form.zgxlzy" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="11">
              <el-form-item label="最高学历" prop="zgxl">
                <el-select v-model="form.zgxl" placeholder="请选择学历">
                  <el-option label="博士" value="0" />
                  <el-option label="研究生" value="1" />
                  <el-option label="本科" value="2" />
                  <el-option label="大专" value="3" />
                  <el-option label="高中" value="4" />
                  <el-option label="其他" value="5" />
                </el-select>

              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="毕业证编号" prop="zsbh" required>
                <el-input v-model="form.zsbh" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="技能" prop="skills">
                <el-input v-model="form.skills" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="入职日期" prop="entrydate">
                <el-date-picker
                  v-model="form.entrydate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                />

              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="最高学历毕业日期" prop="zgxlbyrq">
                <el-date-picker
                  v-model="form.zgxlbyrq"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                />

              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="离职日期" prop="godate">
                <el-date-picker
                  v-model="form.godate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                />

              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="base地(在职地)" prop="basearea">
                <el-input v-model="form.basearea" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="状态" prop="status">
                <el-select v-model="form.status" placeholder="请选择状态" disabled>
                  <el-option label="离职" value="0" />
                  <el-option label="在职" value="1" />
                </el-select>

              </el-form-item>
            </el-col>
          </el-row>
          <hr>
          <el-row>
            <span style="color: #1a1a1a;font-size: medium;"><b>掌握技能</b></span>
          </el-row>
          <el-form-item
            v-for="(domain, index) in form.jnList"
            :key="domain.key"
            :label="'专业技能' + (index+1)"
            style="padding-top: 1%"
            required
            label-width="10%"
          >
            <el-row :span="24">
              <el-col :span="7">
                <el-form-item
                  :prop="'jnList.' + index + '.skillname'"
                  :rules="{
                    required: true, message: '技能名称不能为空', trigger: 'blur'
                  }"
                >
                  <el-input
                    v-model="domain.skillname"
                    style="width: 100%"
                    placeholder="技能名称"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item
                  label-width="0px"
                  :prop="'jnList.' + index + '.skillstatus'"
                  :rules="{
                    required: true, message: '掌握水平不能为空', trigger: 'blur'
                  }"
                >
                  <el-select v-model="domain.skillstatus" placeholder="掌握水平" style="margin-left: 10px;width: 95%">
                    <el-option label="熟练" value="0" />
                    <el-option label="熟悉" value="1" />
                    <el-option label="了解" value="2" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item
                  label-width="0px"
                >
                  <el-button
                    type="danger"
                    style="margin-left: 10px"
                    @click.prevent="removeDomain(domain)"
                  >删除
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              style="margin-top: 10px"
              @click="addDomain"
            >新增
            </el-button>
          </el-form-item>
          <hr>
          <el-row><span style="color: #1a1a1a;font-size: medium;"><b>项目履历</b></span>
          </el-row>
          <el-form-item
            v-for="(ygxm, index) in form.ygxms"
            :key="ygxm.key"
            :label="'项目经历' + (index+1)"
            style="padding-top: 1%"
            label-width="10%"
            required=""
          >
            <el-row :span="24">
              <el-col :span="6">
                <el-form-item
                  label-width="0px"
                  :prop="'ygxms.' + index + '.programName'"
                  :rules="{
                    required: true, message: '项目名称不能为空', trigger: 'blur'
                  }"
                >
                  <el-input
                    v-model="ygxm.programName"
                    style="width: 95%"
                    placeholder="项目名称"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label-width="10px"
                  :prop="'ygxms.' + index + '.firstPartyName'"
                  :rules="{
                    required: true, message: '甲方名称不能为空', trigger: 'blur'
                  }"
                >
                  <el-input
                    v-model="ygxm.firstPartyName"
                    style="width: 91%"
                    placeholder="甲方名称"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label-width="0px"
                  :prop="'ygxms.' + index + '.staffRole'"
                  :rules="{
                    required: true, message: '项目角色不能为空', trigger: 'blur'
                  }"
                >
                  <el-select v-model="ygxm.staffRole" placeholder="项目角色" style="width: 90%">
                    <el-option label="开发" value="0" />
                    <el-option label="测试" value="1" />
                    <el-option label="项目经理" value="2" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label-width="0px"
                  :prop="'ygxms.' + index + '.programInfo'"
                  :rules="{
                    required: true, message: '项目规模不能为空', trigger: 'blur'
                  }"
                >
                  <el-select v-model="ygxm.programInfo" placeholder="项目规模" style="width: 95%">
                    <el-option label="大型" value="0" />
                    <el-option label="中型" value="1" />
                    <el-option label="小型" value="2" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :span="24" style="padding-top: 2%">
              <el-col :span="5">
                <el-form-item
                  label-width="3%"
                  :prop="'ygxms.' + index + '.programStartTime'"
                  :rules="{
                    required: true, message: '项目开始日期不能为空', trigger: 'blur'
                  }"
                >
                  <el-date-picker
                    v-model="ygxm.programStartTime"
                    type="date"
                    placeholder="项目开始日期"
                    style="width: 95%"
                    value-format="yyyy-MM-dd"
                  />
                </el-form-item>
              </el-col>
              <!--              <el-col style="width: 1%">
               <span>—</span>
              </el-col>-->
              <el-col :span="5">
                <el-form-item
                  label-width="0px"
                  :prop="'ygxms.' + index + '.programEndTime'"
                  :rules="{
                    required: true, message: '项目结束日期不能为空', trigger: 'blur'
                  }"
                >
                  <el-date-picker
                    v-model="ygxm.programEndTime"
                    type="date"
                    placeholder="项目结束日期"
                    value-format="yyyy-MM-dd"
                    style="width: 95%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item
                  label-width="10px"
                  :prop="'ygxms.' + index + '.staffStartTime'"
                  :rules="{
                    required: true, message: '参与项目开始日期不能为空', trigger: 'blur'
                  }"
                >
                  <el-date-picker
                    v-model="ygxm.staffStartTime"
                    type="date"
                    placeholder="参与项目开始日期"
                    style="width: 95%"
                    value-format="yyyy-MM-dd"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item
                  label-width="0px"
                  :prop="'ygxms.' + index + '.staffEndTime'"
                  :rules="{
                    required: true, message: '参与项目结束日期不能为空', trigger: 'blur'
                  }"
                >
                  <el-date-picker
                    v-model="ygxm.staffEndTime"
                    type="date"
                    placeholder="参与项目结束日期"
                    style="width: 95%"
                    value-format="yyyy-MM-dd"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item
                  label-width="10px"
                >
                  <el-button
                    type="danger"
                    @click.prevent="removeygxms(ygxm)"
                  >删除
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              style="margin-top: 10px"
              @click="addygxms"
            >新增
            </el-button>
          </el-form-item>

        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <!--        <el-button v-if="true === isDraft" @click="asDraft">暂 存</el-button>-->
        <el-button type="primary" @click="submitAddForm">确 定</el-button>
        <el-button @click="addCancel">取 消</el-button>
      </div>
    </el-dialog>
    <!--项目履历对话框展示区-->
    <el-dialog :title="title" :visible.sync="programDialog" width="75%" append-to-body>
      <div style="height: 50vh;overflow: auto">
        <el-table v-loading="loading" :data="programList" style="width: 100%">
          <el-table-column label="项目名称" align="center" prop="programName" min-width="120" />
          <el-table-column label="甲方名称" align="center" prop="firstPartyName" min-width="200" />
          <el-table-column label="项目规模" align="center" prop="programInfo" min-width="80">
            <template slot-scope="{row}">
              <span v-if="row.programInfo==='0'">大型</span>
              <span v-else-if="row.programInfo==='1'">中型</span>
              <span v-else-if="row.programInfo==='2'">小型</span>
              <span v-else>{{ row.programInfo }}</span>
            </template>
          </el-table-column>
          <el-table-column label="项目角色" align="center" prop="staffRole" min-width="200">
            <template slot-scope="{row}">
              <span v-if="row.staffRole==='0'">开发</span>
              <span v-else-if="row.staffRole==='1'">测试</span>
              <span v-else-if="row.staffRole==='2'">项目经理</span>
              <span v-else>{{ row.staffRole }}</span>
            </template>
          </el-table-column>
          <el-table-column label="项目起始时间" align="center" prop="programStartTime" min-width="150" />
          <el-table-column label="项目结束时间" align="center" prop="programEndTime" min-width="200" />
          <el-table-column label="员工参与起始时间" align="center" prop="staffStartTime" min-width="200" />
          <el-table-column label="员工参与结束时间" align="center" prop="staffEndTime" min-width="160" />
        </el-table>
        <pagination
          v-show="programerTotal>0"
          :total="programerTotal"
          :page.sync="programeParams.pageNum"
          :limit.sync="programeParams.pageSize"
          @pagination="handleProgram()"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="programDialog=!programDialog">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 基础信息更新弹出框 -->
    <el-dialog :title="title" :visible.sync="baseUpdateDialog" width="65%" append-to-body @close="closeDialogBefore('updateBaseForm')">
      <el-form ref="updateBaseForm" :model="updateBaseForm" :rules="rules" :is-drfat="isDraft" label-width="140px">

        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="updateBaseForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idcard" required>
              <el-input v-model="updateBaseForm.idcard" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别 " prop="gender">
              <el-select v-model="updateBaseForm.gender" placeholder="请选择性别">
                <el-option label="男" value="0" />
                <el-option label="女" value="1" />
              </el-select>

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="tel" required>
              <el-input v-model="updateBaseForm.tel" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="最高学历毕业院校" prop="zgbyyx">
              <el-input v-model="updateBaseForm.zgbyyx" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最高学历专业" prop="zgxlzy">

              <el-input v-model="updateBaseForm.zgxlzy" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="最高学历" prop="zgxl">
              <el-select v-model="updateBaseForm.zgxl" placeholder="请选择学历">
                <el-option label="博士" value="0" />
                <el-option label="研究生" value="1" />
                <el-option label="本科" value="2" />
                <el-option label="大专" value="3" />
                <el-option label="高中" value="4" />
                <el-option label="其他" value="5" />
              </el-select>

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="毕业证编号" prop="zsbh" required>
              <el-input v-model="updateBaseForm.zsbh" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="技能" prop="skills">
              <el-input v-model="updateBaseForm.skills" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职日期" prop="entrydate">
              <el-date-picker
                v-model="updateBaseForm.entrydate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              />

            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="最高学历毕业日期" prop="zgxlbyrq">
              <el-date-picker
                v-model="updateBaseForm.zgxlbyrq"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              />

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="离职日期" prop="godate">
              <el-date-picker
                v-model="updateBaseForm.godate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              />

            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="base地(入职地)" prop="basearea">
              <el-input v-model="updateBaseForm.basearea" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态(是否在职)" prop="status">
              <el-select v-model="updateBaseForm.status" placeholder="请选择状态" disabled>
                <el-option label="离职" value="0" />
                <el-option label="在职" value="1" />
              </el-select>

            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitBaseFormUpdate">确 定</el-button>
        <el-button @click="baseUpdateDialog=!baseUpdateDialog">取 消</el-button>
      </div>
    </el-dialog>
    <!--修改技能信息-->
    <el-dialog :title="title" :visible.sync="skillUpdateDialog" width="50%" append-to-body @close="closeDialogBefore('skillUpdateForm')">
      <div style="height: 50vh;overflow: auto">
        <el-form ref="skillUpdateForm" :model="skillUpdateForm" :is-drfat="isDraft" label-width="30%">
          <el-form-item
            v-for="(domain, index) in skillUpdateForm.jnList"
            :key="domain.key"
            style="width: 100%"
            :label="'专业技能' + (index+1)"
            required
          >
            <el-row :span="24">
              <el-col :span="7">
                <el-form-item
                  :prop="'jnList.' + index + '.skillname'"
                  :rules="{
                    required: true, message: '技能名称不能为空', trigger: 'blur'
                  }"
                >
                  <el-input
                    v-model="domain.skillname"
                    placeholder="技能名称"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item
                  label-width="0px"
                  :prop="'jnList.' + index + '.skillstatus'"
                  :rules="{
                    required: true, message: '掌握水平不能为空', trigger: 'blur'
                  }"
                >
                  <el-select v-model="domain.skillstatus" clearable placeholder="掌握水平" style="margin-left: 10px">
                    <el-option label="熟练" value="0" />
                    <el-option label="熟悉" value="1" />
                    <el-option label="了解" value="2" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item
                  label-width="0px"
                >
                  <el-button
                    type="danger"
                    style="margin-left: 10px"
                    @click.prevent="removeDomainjn(domain)"
                  >删除
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              style="margin-top: 10px"
              @click="addDomainjn"
            >新增
            </el-button>
          </el-form-item>

        </el-form>
      </div>
      <hr>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormUpdateSkill">确 定</el-button>
        <el-button @click="skillUpdateDialog=!skillUpdateDialog">取 消</el-button>
      </div>
    </el-dialog>
    <!--修改项目履历信息-->
    <el-dialog :title="title" :visible.sync="programUpdateDialog" width="65%" append-to-body @close="closeDialogBefore('programUpdateForm')">
      <div style="height: 50vh;overflow: auto">
        <el-form ref="programUpdateForm" :model="programUpdateForm" label-width="140px">
          <el-form-item
            v-for="(ygxm, index) in programUpdateForm.ygxms"
            :key="ygxm.key"
            :label="'项目履历' + (index+1)"
            style="padding-top: 1%"
            label-width="10%"
            required=""
          >
            <el-row :span="24">
              <el-col :span="6">
                <el-form-item
                  label-width="0px"
                  :prop="'ygxms.' + index + '.programName'"
                  :rules="{
                    required: true, message: '项目名称不能为空', trigger: 'blur'
                  }"
                >
                  <el-input
                    v-model="ygxm.programName"
                    style="width: 95%"
                    placeholder="项目名称"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label-width="10px"
                  :prop="'ygxms.' + index + '.firstPartyName'"
                  :rules="{
                    required: true, message: '甲方名称不能为空', trigger: 'blur'
                  }"
                >
                  <el-input
                    v-model="ygxm.firstPartyName"
                    style="width: 91%"
                    placeholder="甲方名称"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label-width="0px"
                  :prop="'ygxms.' + index + '.staffRole'"
                  :rules="{
                    required: true, message: '项目角色不能为空', trigger: 'blur'
                  }"
                >
                  <el-select v-model="ygxm.staffRole" placeholder="项目角色" style="width: 90%">
                    <el-option label="开发" value="0" />
                    <el-option label="测试" value="1" />
                    <el-option label="项目经理" value="2" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label-width="0px"
                  :prop="'ygxms.' + index + '.programInfo'"
                  :rules="{
                    required: true, message: '项目规模不能为空', trigger: 'blur'
                  }"
                >
                  <el-select v-model="ygxm.programInfo" placeholder="项目规模" style="width: 95%">
                    <el-option label="大型" value="0" />
                    <el-option label="中型" value="1" />
                    <el-option label="小型" value="2" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :span="24" style="padding-top: 2%">
              <el-col :span="5">
                <el-form-item
                  label-width="3%"
                  :prop="'ygxms.' + index + '.programStartTime'"
                  :rules="{
                    required: true, message: '项目开始日期不能为空', trigger: 'blur'
                  }"
                >
                  <el-date-picker
                    v-model="ygxm.programStartTime"
                    type="date"
                    placeholder="项目开始日期"
                    style="width: 95%"
                    value-format="yyyy-MM-dd"
                  />
                </el-form-item>
              </el-col>
              <!--              <el-col style="width: 1%">
                             <span>—</span>
                            </el-col>-->
              <el-col :span="5">
                <el-form-item
                  label-width="0px"
                  :prop="'ygxms.' + index + '.programEndTime'"
                  :rules="{
                    required: true, message: '项目结束日期不能为空', trigger: 'blur'
                  }"
                >
                  <el-date-picker
                    v-model="ygxm.programEndTime"
                    type="date"
                    placeholder="项目结束日期"
                    value-format="yyyy-MM-dd"
                    style="width: 95%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item
                  label-width="10px"
                  :prop="'ygxms.' + index + '.staffStartTime'"
                  :rules="{
                    required: true, message: '参与项目开始日期不能为空', trigger: 'blur'
                  }"
                >
                  <el-date-picker
                    v-model="ygxm.staffStartTime"
                    type="date"
                    placeholder="参与项目开始日期"
                    style="width: 95%"
                    value-format="yyyy-MM-dd"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item
                  label-width="0px"
                  :prop="'ygxms.' + index + '.staffEndTime'"
                  :rules="{
                    required: true, message: '参与项目结束日期不能为空', trigger: 'blur'
                  }"
                >
                  <el-date-picker
                    v-model="ygxm.staffEndTime"
                    type="date"
                    placeholder="参与项目结束日期"
                    style="width: 95%"
                    value-format="yyyy-MM-dd"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item
                  label-width="10px"
                >
                  <el-button
                    type="danger"
                    @click.prevent="removeDomainjl(ygxm)"
                  >删除
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <!--          <el-form-item
            v-for="(ygxm, index) in programUpdateForm.ygxms"
            :key="ygxm.key"
            :label="'项目经历' + (index+1)"
            :prop="'ygxms.' + index + '.value'"
            style="padding-top: 1%"
          >
            <el-row>
              <el-col>
                <el-input
                  v-model="ygxm.programName"
                  style="width: 20%"
                  placeholder="项目名称"
                />
                <el-input
                  v-model="ygxm.firstPartyName"
                  style="width: 20%;padding-left: 10px"
                  placeholder="甲方名称"
                />
                <el-select v-model="ygxm.staffRole" placeholder="项目角色" style="margin-left: 10px">
                  <el-option label="开发" value="0" />
                  <el-option label="测试" value="1" />
                  <el-option label="项目经理" value="2" />
                </el-select>
                <el-select v-model="ygxm.programInfo" placeholder="项目规模" style="margin-left: 10px">
                  <el-option label="大型" value="0" />
                  <el-option label="中型" value="1" />
                  <el-option label="小型" value="2" />
                </el-select>
              </el-col>
            </el-row>
            <el-row>
              <el-col style="padding-top: 1%">
                <el-date-picker
                  v-model="ygxm.programStartTime"
                  type="date"
                  placeholder="项目开始日期"
                  style="width: 20%"
                  value-format="yyyy-MM-dd"
                />
                <span style="padding-left: 2px;padding-right: 2px">-</span>
                <el-date-picker
                  v-model="ygxm.programEndTime"
                  type="date"
                  placeholder="项目结束日期"
                  value-format="yyyy-MM-dd"
                />
                <el-date-picker
                  v-model="ygxm.staffStartTime"
                  type="date"
                  placeholder="参与项目开始日期"
                  style="margin-left: 10px;width: 18%"
                  value-format="yyyy-MM-dd"
                />
                <span style="padding-left: 2px;padding-right: 2px">-</span>
                <el-date-picker
                  v-model="ygxm.staffEndTime"
                  type="date"
                  placeholder="结束日期"
                  style="width: 18%"
                  value-format="yyyy-MM-dd"
                />

                <el-button
                  type="danger"
                  style="margin-left: 10px"
                  @click.prevent="removeDomainjl(ygxm)"
                >删除
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>-->
          <el-form-item>
            <el-button
              type="primary"
              style="margin-top: 10px"
              @click="addDomainjl"
            >新增
            </el-button>
          </el-form-item>

        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormUpdateProgram">确 定</el-button>
        <el-button @click="programUpdateDialog=!programUpdateDialog">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 提交修改弹出框 -->
    <el-dialog :title="title" :visible.sync="openEdit" width="1200px" append-to-body>
      <el-form ref="editForm" :model="editForm" :rules="rules" :is-drfat="isDraft" label-width="140px">

        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="editForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idcard">
              <el-input v-model="editForm.idcard" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别 " prop="gender">
              <el-select v-model="editForm.gender" placeholder="请选择性别">
                <el-option label="男" value="0" />
                <el-option label="女" value="1" />
              </el-select>

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="tel">
              <el-input v-model="editForm.tel" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="最高学历毕业院校" prop="zgbyyx">
              <el-input v-model="editForm.zgbyyx" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最高学历专业" prop="zgxlzy">

              <el-input v-model="editForm.zgxlzy" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="最高学历" prop="zgxl">
              <el-select v-model="editForm.zgxl" placeholder="请选择学历">
                <el-option label="博士" value="0" />
                <el-option label="研究生" value="1" />
                <el-option label="本科" value="2" />
                <el-option label="大专" value="3" />
                <el-option label="高中" value="4" />
                <el-option label="其他" value="5" />
              </el-select>

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证书编号" prop="zsbh">
              <el-input v-model="editForm.zsbh" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="技能" prop="skills">
              <el-input v-model="editForm.skills" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职日期" prop="entrydate">
              <el-date-picker
                v-model="editForm.entrydate"
                type="date"
                placeholder="选择日期"
              />

            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="最高学历毕业日期" prop="zgxlbyrq">
              <el-date-picker
                v-model="editForm.zgxlbyrq"
                type="date"
                placeholder="选择日期"
              />

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="离职日期" prop="godate">
              <el-date-picker
                v-model="editForm.godate"
                type="date"
                placeholder="选择日期"
              />

            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="base地" prop="basearea">
              <el-input v-model="editForm.basearea" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="editForm.status" placeholder="请选择状态">
                <el-option label="离职" value="0" />
                <el-option label="在职" value="1" />
              </el-select>

            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormEdit">确 定</el-button>
        <el-button @click="cancelEdit">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div slot="tip" class="el-upload__tip">
          <el-checkbox v-model="upload.updateSupport" />
          是否更新已经存在的用户数据
          <el-link type="info" style="font-size:12px" @click="importTemplate()">下载模板</el-link>
        </div>
        <div slot="tip" class="el-upload__tip" style="color:red">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 重新提交弹出框 -->
    <el-dialog :title="title" :visible.sync="openRe" width="1200px" append-to-body>
      <el-form ref="reForm" :model="reForm" :rules="rules" :is-drfat="isDraft" label-width="140px">

        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="reForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idcard">
              <el-input v-model="reForm.idcard" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别 " prop="gender">
              <el-select v-model="reForm.gender" placeholder="请选择性别">
                <el-option label="男" value="0" />
                <el-option label="女" value="1" />
              </el-select>

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="tel">
              <el-input v-model="reForm.tel" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="最高学历毕业院校" prop="zgbyyx">
              <el-input v-model="reForm.zgbyyx" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最高学历专业" prop="zgxlzy">

              <el-input v-model="reForm.zgxlzy" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="最高学历" prop="zgxl">
              <el-select v-model="reForm.zgxl" placeholder="请选择学历">
                <el-option label="博士" value="0" />
                <el-option label="研究生" value="1" />
                <el-option label="本科" value="2" />
                <el-option label="大专" value="3" />
                <el-option label="高中" value="4" />
                <el-option label="其他" value="5" />
              </el-select>

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证书编号" prop="zsbh">
              <el-input v-model="reForm.zsbh" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="技能" prop="skills">
              <el-input v-model="reForm.skills" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职日期" prop="entrydate">
              <el-date-picker
                v-model="reForm.entrydate"
                type="date"
                placeholder="选择日期"
              />

            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="最高学历毕业日期" prop="zgxlbyrq">
              <el-date-picker
                v-model="reForm.zgxlbyrq"
                type="date"
                placeholder="选择日期"
              />

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="离职日期" prop="godate">
              <el-date-picker
                v-model="reForm.godate"
                type="date"
                placeholder="选择日期"
              />

            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="base地" prop="basearea">
              <el-input v-model="reForm.basearea" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="reForm.status" placeholder="请选择状态">
                <el-option label="离职" value="0" />
                <el-option label="在职" value="1" />
              </el-select>

            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormRe">确 定</el-button>
        <el-button @click="cancelRe">取 消</el-button>
      </div>
    </el-dialog>
    <attachment-upload-dialog
      ref="attachmentDialog"
      v-model="uploadDialog.show"
      :items="uploadDialog.items"
      :title="uploadDialog.title"
      :uploading="uploadDialog.loading"
      :user-id="uploadDialog.userId"
      @cancel="cancelUpload"
    />
    <approvalForm ref="approvalForm" :business-key="businessKey" :process-instance-id="instanceId" />
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import api from '@/api/em/tEmUser'
import { getDefinitionsByInstanceId } from '@/api/activiti/definition'
import approvalForm from '@/views/components/approvalForm'
import attachmentUploadDialog from '@/views/yggl/leave/components/AttachmentUploadDialog.vue'
import request from '@/utils/request'
import { validateIdCard, validatePhone, validategraduateNumber } from '../../../utils/validateUtils'

const generateDefaultList = function() {
  return [
    { name: '2吋证件照', type: 'TOINPHOTO', value: null },
    { name: '身份证正面照片', type: 'IDCARDZM', value: null },
    { name: '身份证反面照片', type: 'IDCARDFM', value: null },
    { name: '毕业证', type: 'DIPLOMA', value: null },
    { name: '学位证', type: 'XWZ', value: null },
    { name: '学信网学历证明', type: 'XXWZMXM', value: null },
    { name: '学信网学位证明', type: 'XXWZM', value: null },
    {
      name: '体检报告',
      type: 'TJBG',
      value: null,
      extra: { name: '体检时间', type: 'TJSJ', comp: 'date', value: null, placeholder: '请选择体检日期' }
    },
    {
      name: '征信报告',
      type: 'ZXBG',
      value: null,
      extra: { name: '征信导出时间', type: 'ZXSJ', comp: 'date', value: null, placeholder: '请选择导出日期' }
    },
    {
      name: '社保证明',
      type: 'SBZM',
      value: null,
      extra: { name: '社保时间范围', type: 'SBSJ', comp: 'daterange', value: null, placeholder: '请选择时间范围' }
    },
    { name: '其他证书1(可选)', type: 'QTZS1', value: null },
    { name: '其他证书2(可选)', type: 'QTZS2', value: null },
    { name: '其他证书3(可选)', type: 'QTZS3', value: null }
  ]
}

export default {
  name: 'TEmUser',
  components: {
    approvalForm,
    attachmentUploadDialog
  },
  data() {
    return {
      // 新增弹出框
      addDialog: false,
      // 新增请求参数
      form: {
        name: null,
        idcard: null,
        gender: null,
        tel: null,
        zgbyyx: null,
        zgxlzy: null,
        zgxl: null,
        zsbh: null,
        skills: null,
        entrydate: null,
        zgxlbyrq: null,
        godate: null,
        basearea: null,
        status: '1',
        jnList: [{
          skillname: '',
          skillstatus: ''
        }],
        ygxms: [{
          programName: '',
          firstPartyName: '',
          staffRole: '',
          programInfo: '',
          programStartTime: '',
          programEndTime: '',
          staffStartTime: '',
          staffEndTime: ''
        }]

      },
      // 新增字段校验
      rules: {
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        idcard: [
          { validator: validateIdCard, trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '性别不能为空', trigger: 'blur' }
        ],
        tel: [
          { validator: validatePhone, trigger: 'blur' }
        ],
        zgbyyx: [
          { required: true, message: '最高学历毕业院校不能为空', trigger: 'blur' }
        ],
        zgxlzy: [
          { required: true, message: '最高学历专业不能为空', trigger: 'blur' }
        ],
        zsbh: [
          { validator: validategraduateNumber, trigger: 'blur' }
        ],
        zgxl: [
          { required: true, message: '最高学历不能为空', trigger: 'blur' }
        ],
        skills: [
          { required: true, message: '技能不能为空', trigger: 'blur' }
        ],
        entrydate: [
          { required: true, message: '入职日期不能为空', trigger: 'blur' }
        ],
        zgxlbyrq: [
          { required: true, message: '最高学历毕业日期不能为空', trigger: 'blur' }
        ],
        basearea: [
          { required: true, message: 'base地(在职地)不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ]

      },
      // 项目履历弹出标志
      programDialog: false,
      // 履历信息条数
      programerTotal: 0,
      // 履历信息查询参数
      programeParams: {
        pageNum: 1,
        pageSize: 10,
        staffId: null
      },
      // 基础信息更新弹出框
      baseUpdateDialog: false,
      // 基础信息更新请求参数
      updateBaseForm: {
        name: '',
        idcard: '',
        gender: '',
        tel: '',
        zgbyyx: '',
        zgxlzy: '',
        zgxl: '',
        zsbh: '',
        skills: '',
        entrydate: '',
        zgxlbyrq: '',
        godate: '',
        basearea: '',
        status: '1'
      },
      // 技能修改展示框
      skillUpdateDialog: false,
      // 技能修改请求参数
      skillUpdateForm: {
        jnList: [{
          skillname: '',
          skillstatus: ''
        }]
      },
      // 修改项目履历弹出框
      programUpdateDialog: false,
      // 项目履历请求参数
      programUpdateForm: {
        ygxms: [{
          programName: '',
          firstPartyName: '',
          staffRole: '',
          programInfo: '',
          programStartTime: '',
          programEndTime: '',
          staffStartTime: '',
          staffEndTime: ''
        }]
      },
      uploadDialog: {
        show: false,
        userId: null,
        title: '上传附件',
        loading: false,
        items: generateDefaultList()
      },
      modelVisible: false,
      modelerUrl: '',
      userName: '',
      createName: '',
      businessKey: '',
      instanceId: null,
      // 是否显示暂存按钮
      isDraft: false,
      visible: false,
      // 用户信息
      user: {},
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      tableList: [],
      // 弹出层标题
      title: '',
      open: false,
      // 项目经历数据
      programList: null,
      openDetails: false,
      openUpdate: false,
      // 技能显示框
      openUpdate2: false,
      // 经历显示框
      openUpdate3: false,
      openRe: false,
      openEdit: false,
      // 在职状态
      statusOptions: [
        { label: '离职', key: '0' },
        { label: '在职', key: '1' }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userid: null,
        name: null,
        idcard: null,
        gender: null,
        tel: null,
        zgbyyx: null,
        zgxlzy: null,
        zgxl: null,
        zsbh: null,
        skills: null,
        entrydate: null,
        zgxlbyrq: null,
        godate: null,
        basearea: null,
        status: null,
        crtuser: null,
        crtdate: null,
        upduser: null,
        upddate: null
      },
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/emuser/tEmUser/importData'
      },
      // 表单参数
      // form: {
      // },
      // 更新技能 接收参数
      updateForm: [],
      // 提交修改 表单参数
      editForm: {},
      // 重新提交 表单参数
      reForm: {}
      // 表单校验 下拉框、日期框时trigger: 'change',值发生改变时校验，输入框trigger: 'blur',失去焦点时校验

    }
  },
  watch: {
    'form.godate': {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.form.status = '0'
        } else {
          this.form.status = '1'
        }
      }
    },
    'updateBaseForm.godate': {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.form.status = '0'
        } else {
          this.form.status = '1'
        }
      }
    }
  },
  created() {
    this.getList()
    /* this.getDicts('activiti_flow_type').then(response => {
      this.statusOptions = response.data
    })*/
  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 查询列表 */
    getList() {
      this.loading = true
      api.query(this.queryParams).then(response => {
        this.tableList = response.rows
        this.total = response.total
        for (let i = 0; i < this.tableList.length; i++) {
          this.tableList[i]['sl'] = ''
          this.tableList[i]['sx'] = ''
          this.tableList[i]['lj'] = ''

          for (let j = 0; j < this.tableList[i].jnList.length; j++) {
            if (this.tableList[i].jnList[j].skillstatus === '0') {
              this.tableList[i].sl = this.tableList[i].sl + this.tableList[i].jnList[j].skillname + '  '
            }
            if (this.tableList[i].jnList[j].skillstatus === '1') {
              this.tableList[i].sx = this.tableList[i].sx + this.tableList[i].jnList[j].skillname + '  '
            }
            if (this.tableList[i].jnList[j].skillstatus === '2') {
              this.tableList[i].lj = this.tableList[i].lj + this.tableList[i].jnList[j].skillname + '  '
            }
          }
        }
      }).finally(() => {
        this.loading = false
      })
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.createName = this.$store.getters.nickName
      if (this.$store.getters.name !== 'admins') {
        // this.reset()
        this.isDraft = true
        this.addDialog = true
        this.title = '添加'
      } else {
        this.$alert('管理员不能创建流程', '管理员不能创建流程', {
          confirmButtonText: '确定'
        })
      }
    },
    /** 新增提交按钮 */
    submitAddForm() {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          this.form.businessRoute = this.$route.name
          api.add(this.form).then(response => {
            this.msgSuccess('新增成功')
            this.addDialog = false
            this.getList()
          })
        }
      })
    },
    /** 新增对话框取消按钮 */
    addCancel() {
      this.addDialog = false
    },
    /** 员工技能信息信息删除 */
    removeDomain(item) {
      var index = this.form.jnList.indexOf(item)
      if (index !== -1) {
        this.form.jnList.splice(index, 1)
      }
    },
    /** 员工技能信息增加 */
    addDomain() {
      this.form.jnList.push({
        skillname: '',
        skillstatus: ''
      })
    },
    /** 项目履历删除 */
    removeygxms(item) {
      var index = this.form.ygxms.indexOf(item)
      if (index !== -1) {
        this.form.ygxms.splice(index, 1)
      }
    },
    /** 项目履历增加 */
    addygxms() {
      this.form.ygxms.push({
        programName: '',
        firstPartyName: '',
        staffRole: '',
        programInfo: '',
        programStartTime: '',
        programEndTime: '',
        staffStartTime: '',
        staffEndTime: ''
      })
    },
    /** 项目履历查询 */
    handleProgram(row) {
      this.title = row.name + '-项目履历'
      this.programDialog = true
      this.loading = true
      this.programeParams.staffId = row.userid
      api.programDetails(this.programeParams).then((response) => {
        this.programList = response.rows
        this.programerTotal = response.total
      }).finally(() => {
        this.loading = false
      })
    },
    /** 基础信息更新按钮操作 */
    handleUpdate(row) {
      let updateId = null
      if (row.userid != null) {
        updateId = row.userid
      } else {
        updateId = this.ids[0]
      }
      // this.reset()
      api.getOne({ userid: updateId }).then(response => {
        this.updateBaseForm = response.data
        this.baseUpdateDialog = true
        this.title = '更新'
      })
    },
    /** 基础信息更新确定 */
    submitBaseFormUpdate() {
      this.$refs['updateBaseForm'].validate(valid => {
        if (valid) {
          this.form.businessRoute = this.$route.name
          api.update(this.updateBaseForm).then(response => {
            this.msgSuccess('更新成功')
            this.baseUpdateDialog = false
            this.getList()
          })
        }
      })
    },
    /** 修改技能按钮操作 */
    handleUpdatejn(row) {
      let updateId = null
      if (row.userid != null) {
        updateId = row.userid
      } else {
        updateId = this.ids[0]
      }
      api.getOnejn({ userid: updateId }).then(response => {
        this.skillUpdateForm.jnList = response.data
        this.skillUpdateDialog = true
        this.title = '技能修改'
      })
    },
    /** 修改技能页面删除 */
    removeDomainjn(item) {
      if (item.skillid) {
        api.delSkill(item).then(response => {
          this.msgSuccess('删除成功')
          const index = this.skillUpdateForm.jnList.indexOf(item)
          if (index !== -1) {
            this.skillUpdateForm.jnList.splice(index, 1)
          }
        })
      } else {
        const index = this.skillUpdateForm.jnList.indexOf(item)
        if (index !== -1) {
          this.skillUpdateForm.jnList.splice(index, 1)
        }
        this.$message.success('删除成功')
      }
    },
    /** 修改技能页面添加 */
    addDomainjn() {
      this.skillUpdateForm.jnList.push({
        userid: this.ids[0],
        skillname: '',
        skillstatus: ''
      })
    },
    /** 技能确定更新 */
    submitFormUpdateSkill() {
      this.$refs['skillUpdateForm'].validate(valid => {
        if (valid) {
          // this.form.businessRoute = this.$route.name
          api.updateSkill({ jnList: this.skillUpdateForm.jnList }).then(response => {
            this.msgSuccess('更新成功')
            this.skillUpdateDialog = false
            this.getList()
          })
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      let ids = null
      if (row.userid) {
        ids = [row.userid]
      } else {
        ids = this.ids
      }
      this.$confirm('是否确认删除选择的员工数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return api.del({ ids: ids })
      }).then(() => {
        this.handleQuery()
        this.msgSuccess('删除成功')
      })
    },
    /** 修改项目经历按钮操作 */
    handleUpdatejl(row) {
      api.getOnejl({ staffId: this.ids[0] }).then(response => {
        this.programUpdateForm.ygxms = response.data
        this.programUpdateDialog = true
        this.title = '履历修改'
      })
    },
    /** 修改项目履历页面删除 */
    removeDomainjl(ygxm) {
      if (ygxm.id) {
        api.delProgram(ygxm).then(response => {
          this.msgSuccess('删除成功')
          const index = this.programUpdateForm.ygxms.indexOf(ygxm)
          if (index !== -1) {
            this.programUpdateForm.ygxms.splice(index, 1)
          }
        })
      } else {
        const index = this.programUpdateForm.ygxms.indexOf(ygxm)
        if (index !== -1) {
          this.programUpdateForm.ygxms.splice(index, 1)
        }
        this.$message.success('删除成功')
      }
    },
    /** 修改项目履历页面添加 */
    addDomainjl() {
      this.programUpdateForm.ygxms.push({
        staffId: this.ids[0],
        programName: '',
        firstPartyName: '',
        staffRole: '',
        programInfo: '',
        programStartTime: '',
        programEndTime: '',
        staffStartTime: '',
        staffEndTime: ''
      })
    },
    /** 修改项目履历确定更新 */
    submitFormUpdateProgram() {
      this.$refs['programUpdateForm'].validate(valid => {
        if (valid) {
          // this.form.businessRoute = this.$route.name
          api.updateProgram({ programList: this.programUpdateForm.ygxms }).then(response => {
            this.msgSuccess('更新成功')
            this.programUpdateDialog = false
            this.getList()
          })
        }
      })
    },
    closeDialogBefore(formName) {
      this.$refs[formName].resetFields()
    },
    // 修改经历移除
    removeygxmsup(item) {
      var index = this.updateForm.indexOf(item)
      if (index !== -1) {
        this.updateForm.splice(index, 1)
      }
    },

    // 修改经历添加
    addygxmsup() {
      this.updateForm.push({
        xmmc: '',
        xmgm: '',
        xmdate: '',
        ygdate: '',
        xmjs: ''
      })
    },

    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },

    cancelUpdate() {
      this.openUpdate = false
      this.openUpdate2 = false
      this.openUpdate3 = false
      this.reset()
    },
    cancelRe() {
      this.openRe = false
      this.reset()
    },
    cancelEdit() {
      this.openEdit = false
      this.reset()
    },

    // 表单重置
    reset() {
      this.form = {
        userid: null,
        name: null,
        idcard: null,
        gender: null,
        tel: null,
        zgbyyx: null,
        zgxlzy: null,
        zgxl: null,
        zsbh: null,
        skills: null,
        entrydate: null,
        zgxlbyrq: null,
        godate: null,
        basearea: null,
        status: null,
        crtuser: null,
        crtdate: null,
        upduser: null,
        upddate: null,
        jnList: [{
          skillname: null,
          skillstatus: null
        }],
        ygxms: [{
          programName: '',
          firstPartyName: '',
          staffRole: '',
          programInfo: '',
          programStartTime: '',
          programEndTime: '',
          staffStartTime: '',
          staffEndTime: ''
        }]

      }
      this.resetForm('form')
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userid)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },

    /** 附件按钮操作 */
    async attachment(row) {
      this.uploadDialog.userId = row.userid
      const data = await api.queryAttachment(row.userid)
      console.log(data)
      this.uploadDialog.items.forEach(item => {
        const attachment = data.data.items.find(o => {
          return o.type === item.type
        })
        if (attachment != null) {
          item.value = request.defaults.baseURL + `/profile/attachment/${this.uploadDialog.userId}/` + attachment.value
          if (item.extra) {
            if (attachment.extra.value.indexOf(',') === -1) {
              item.extra.value = attachment.extra.value.toString()
            } else {
              item.extra.value = attachment.extra.value.split(',')
            }
          }
        }
      })
      this.uploadDialog.show = true
    },
    /* 取消上传，重置表单 */
    cancelUpload() {
      this.$refs.attachmentDialog.clear()
      this.uploadDialog.show = false
      this.uploadDialog.items = generateDefaultList()
    },

    /** 提交修改按钮操作 */
    handleEdit(row) {
      this.reset()
      api.getOne({ id: row.id }).then(response => {
        this.editForm = response.data
        this.editForm.instanceId = row.instanceId
        this.openEdit = true
        this.title = '提交修改'
      })
    },
    /** 重新提交 */
    reSubmit(row) {
      this.reset()
      api.getOne({ id: row.id }).then(response => {
        this.reForm = response.data
        this.openRe = true
        this.title = '重新提交'
      })
    },
    /** 审批详情 */
    historyFory(row) {
      this.instanceId = row.instanceId
      this.businessKey = row.id
      this.$refs.approvalForm.visible = true
    },
    /** 进度查看 */
    checkTheSchedule(row) {
      getDefinitionsByInstanceId(row.instanceId).then(response => {
        const data = response.data
        this.modelerUrl = '/bpmnjs/index.html?type=lookBpmn&instanceId=' + row.instanceId + '&deploymentFileUUID=' + data.deploymentID + '&deploymentName=' + encodeURI(data.resourceName)
        this.modelVisible = true
      })
    },
    handleSub(row) {
      row.businessRoute = this.$route.name
      api.add(row).then(response => {
        this.msgSuccess('提交成功')
        this.getList()
      })
    },
    /** 基础信息更新确定 */
    submitFormUpdate() {
      this.$refs['updateForm'].validate(valid => {
        if (valid) {
          this.form.businessRoute = this.$route.name
          api.update(this.updateForm).then(response => {
            this.msgSuccess('更新成功')
            this.openUpdate = false
            this.getList()
          })
        }
      })
    },
    submitFormRe() {
      this.$refs['reForm'].validate(valid => {
        if (valid) {
          this.form.businessRoute = this.$route.name
          api.add(this.reForm).then(response => {
            this.msgSuccess('重新提交成功')
            this.openRe = false
            this.getList()
          })
        }
      })
    },
    submitFormEdit() {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.form.businessRoute = this.$route.name
          this.form.instanceId = this.instanceId
          api.edit(this.editForm).then(response => {
            this.msgSuccess('提交修改成功')
            this.openEdit = false
            this.getList()
          })
        }
      })
    },
    /** 暂存按钮 */
    asDraft() {
      this.$refs['form'].validate(valid => {
        api.draft(this.form).then(response => {
          this.msgSuccess('暂存成功')
          this.open = false
          this.getList()
        })
      })
    },
    chooseMedicine() {
      this.form.title = this.createName + '的' + this.form.type + '申请'
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return api.exportExcel(queryParams)
      }).then(response => {
        this.download(response.message)
      })
    },
    /** 导出按钮操作 */
    handleExportResume(command) {
      if (this.ids.length === 0) {
        this.$message.warning('请先选择需要导出的员工')
        return
      }
      this.$confirm('是否确认导出?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return api.exportResume(command, this.ids.join(','))
      })
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = '用户导入'
      this.upload.open = true
    },
    /** 项目履历导入按钮操作 */
    handleProImport() {
      this.upload.title = '项目履历导入'
      this.upload.open = true
    },
    /** 下载模板操作 */
    importTemplate() {
      const title = this.upload.title
      if (title === '用户导入') {
        api.importTemplate().then(response => {
          this.download(response.message)
        })
      }
      if (title === '项目履历导入') {
        api.importProgramTemplate().then(response => {
          this.download(response.message)
        })
      }
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.$alert(response.msg, '导入结果', { dangerouslyUseHTMLString: true })
      this.getList()
    },
    // 提交上传文件
    submitFileForm() {
      const title = this.upload.title
      if (title === '用户导入') {
        this.$refs.upload.submit()
      }
      if (title === '项目履历导入') {
        this.upload.url = process.env.VUE_APP_BASE_API + '/emuser/tEmProgram/importData'
        this.$refs.upload.submit()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.score-lock {
  height: 70vh;
  overflow: auto;
}

.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 120px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
</style>
