<template>
  <div class="app-container">
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
        >修改经历信息
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
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

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
      <el-table-column label="最高学历" align="center" prop="zgxl" min-width="160" />
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

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 查看详细信息话框 -->
    <el-dialog :title="title" :visible.sync="openDetails" width="500px" append-to-body>
      <approvalDetail v-if="openDetails" :process-instance-id="instanceId" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="openDetails=!openDetails">关闭</el-button>
      </div>
    </el-dialog>
    <!--项目经历对话框-->
    <el-dialog :title="title" :visible.sync="programDialog" width="65%" append-to-body>
      <el-table v-loading="loading" :data="programList" style="width: 100%" @selection-change="handleSelectionChange">
        <!--        <el-table-column type="selection" width="55" align="center"/>-->
        <!-- <el-table-column label="id" align="center" prop="userid"/>  -->
        <el-table-column label="项目名称" align="center" prop="programName" min-width="120" />
        <el-table-column label="甲方名称" align="center" prop="firstPartyName" min-width="200" />
        <el-table-column label="项目规模" align="center" prop="programInfo" min-width="80" />
        <el-table-column label="项目角色" align="center" prop="staffRole" min-width="200" />
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="programDialog=!programDialog">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 新增弹出框 -->
    <el-dialog :title="title" :visible.sync="open" width="70%" :destroy-on-close="true">
      <div class="score-lock">
        <el-form ref="form" :model="form" :rules="rules" :is-drfat="isDraft" label-width="140px">
          <span style="color: #1a1a1a;font-size: medium"><b>基础信息</b></span>
          <el-row style="padding-top: 1%">
            <el-col :span="12">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份证号" prop="idcard">
                <el-input v-model="form.idcard" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="性别 " prop="gender">
                <el-select v-model="form.gender" placeholder="请选择性别">
                  <el-option label="女" value="0" />
                  <el-option label="男" value="1" />
                </el-select>

              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号" prop="tel">
                <el-input v-model="form.tel" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="最高学历毕业院校" prop="zgbyyx">
                <el-input v-model="form.zgbyyx" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最高学历专业" prop="zgxlzy">

                <el-input v-model="form.zgxlzy" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
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
            <el-col :span="12">
              <el-form-item label="毕业证编号" prop="zsbh">
                <el-input v-model="form.zsbh" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="技能" prop="skills">
                <el-input v-model="form.skills" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
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
            <el-col :span="12">
              <el-form-item label="最高学历毕业日期" prop="zgxlbyrq">
                <el-date-picker
                  v-model="form.zgxlbyrq"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                />

              </el-form-item>
            </el-col>
            <el-col :span="12">
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
            <el-col :span="12">
              <el-form-item label="base地(在职地)" prop="basearea">
                <el-input v-model="form.basearea" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-select v-model="form.status" placeholder="请选择状态">
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
            :prop="'jnList.' + index + '.value'"
            style="padding-top: 1%"
          >
            <el-input
              v-model="domain.skillname"
              style="width: 20%"
              placeholder="技能名称"
            />
            <el-select v-model="domain.skillstatus" placeholder="掌握水平" style="margin-left: 10px">
              <el-option label="熟练" value="0" />
              <el-option label="熟悉" value="1" />
              <el-option label="了解" value="2" />
            </el-select>
            <el-button
              type="danger"
              style="margin-left: 10px"
              @click.prevent="removeDomain(domain)"
            >删除
            </el-button>
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
                  @click.prevent="removeygxms(ygxm)"
                >删除
                </el-button>
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
        <el-button v-if="true === isDraft" @click="asDraft">暂 存</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 更新弹出框 -->
    <el-dialog :title="title" :visible.sync="openUpdate" width="1200px" append-to-body>
      <el-form ref="updateForm" :model="updateForm" :rules="rules" :is-drfat="isDraft" label-width="140px">

        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="updateForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idcard">
              <el-input v-model="updateForm.idcard" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别 " prop="gender">
              <el-select v-model="updateForm.gender" placeholder="请选择性别">
                <el-option label="男" value="0" />
                <el-option label="女" value="1" />
              </el-select>

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="tel">
              <el-input v-model="updateForm.tel" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="最高学历毕业院校" prop="zgbyyx">
              <el-input v-model="updateForm.zgbyyx" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最高学历专业" prop="zgxlzy">

              <el-input v-model="updateForm.zgxlzy" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="最高学历" prop="zgxl">
              <el-select v-model="updateForm.zgxl" placeholder="请选择学历">
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
            <el-form-item label="毕业证编号" prop="zsbh">
              <el-input v-model="updateForm.zsbh" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="技能" prop="skills">
              <el-input v-model="updateForm.skills" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职日期" prop="entrydate">
              <el-date-picker
                v-model="updateForm.entrydate"
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
                v-model="updateForm.zgxlbyrq"
                type="date"
                placeholder="选择日期"
              />

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="离职日期" prop="godate">
              <el-date-picker
                v-model="updateForm.godate"
                type="date"
                placeholder="选择日期"
              />

            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="base地(入职地)" prop="basearea">
              <el-input v-model="updateForm.basearea" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态(是否在职)" prop="status">
              <el-select v-model="updateForm.status" placeholder="请选择状态">
                <el-option label="离职" value="0" />
                <el-option label="在职" value="1" />
              </el-select>

            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormUpdate">确 定</el-button>
        <el-button @click="cancelUpdate">取 消</el-button>
      </div>
    </el-dialog>
    <!--修改技能信息-->
    <el-dialog :title="title" :visible.sync="openUpdate2" width="1200px" append-to-body>
      <el-form ref="updateForm" :model="updateForm" :rules="rules" :is-drfat="isDraft" label-width="140px">

        <el-row>

          <el-col>
            <el-form-item label="掌握技能" />
          </el-col>
        </el-row>

        <el-form-item
          v-for="(domain, index) in updateForm"
          :key="domain.key"
          :label="'专业技能' + index"
          :prop="'jnList.' + index + '.value'"
        >
          <el-input
            v-model="domain.skillname"
            style="width: 20%"
            placeholder="技能名称"
          />
          <el-select v-model="domain.skillstatus" placeholder="掌握水平" style="margin-left: 10px">
            <el-option label="熟练" value="0" />
            <el-option label="熟悉" value="1" />
            <el-option label="了解" value="2" />
          </el-select>
          <el-button
            type="danger"
            style="margin-left: 10px"
            @click.prevent="removeDomainjn(domain)"
          >删除
          </el-button>
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

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormUpdate">确 定</el-button>
        <el-button @click="cancelUpdate">取 消</el-button>
      </div>
    </el-dialog>
    <!--修改经历信息信息-->
    <el-dialog :title="title" :visible.sync="openUpdate3" width="1200px" append-to-body>
      <el-form ref="updateForm" :model="updateForm" :rules="rules" :is-drfat="isDraft" label-width="140px">

        <el-row>

          <el-col>
            <el-form-item label="掌握技能" />
          </el-col>
        </el-row>

        <el-form-item
          v-for="(ygxm, index) in form.ygxms"
          :key="ygxm.key"
          :label="'项目经历' + index"
          :prop="'ygxms.' + index + '.value'"
        >
          <el-input
            v-model="ygxm.xmmc"
            style="width: 20%"
            placeholder="项目名称"
          />
          <el-input
            v-model="ygxm.xmmc"
            style="width: 20%"
            placeholder="项目名称"
          />
          <el-select v-model="ygxm.xmjs" placeholder="项目角色" style="margin-left: 10px">
            <el-option label="开发" value="0" />
            <el-option label="测试" value="1" />
            <el-option label="项目经理" value="2" />
          </el-select>
          <el-select v-model="ygxm.xmjs" placeholder="项目规模" style="margin-left: 10px">
            <el-option label="大型" value="0" />
            <el-option label="小型" value="1" />
            <el-option label="中型" value="2" />
          </el-select>

          <el-date-picker
            v-model="ygxm.xmdate"
            style="margin-left: 10px"
            type="daterange"

            range-separator="至"
            start-placeholder="项目开始日期"
            end-placeholder="结束日期"
          />
          <el-date-picker
            v-model="ygxm.ygdate"
            style="margin-top: 10px"
            type="daterange"

            range-separator="至"
            start-placeholder="参与时间"
            end-placeholder="结束日期"
          />
          <el-button
            type="danger"
            style="margin-left: 10px"
            @click.prevent="removeygxmsup(domain)"
          >删除
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            style="margin-top: 10px"
            @click="addygxmsup"
          >新增
          </el-button>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormUpdate">确 定</el-button>
        <el-button @click="cancelUpdate">取 消</el-button>
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
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
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
      @cancel="cancelUpload"
      @submit="submitUpload"
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

const generateDefaultList = function() {
  return [
    { name: '2吋证件照', type: 'TOINPHOTO', value: null },
    { name: '身份证正面照片', type: 'IDCARDZM', value: null },
    { name: '身份证反面照片', type: 'IDCARDFM', value: null },
    { name: '毕业证', type: 'DIPLOMA', value: null },
    { name: '学位证', type: 'XWZ', value: null },
    { name: '学信网学历证明', type: 'XXWZMXM', value: null },
    { name: '学信网学位证明', type: 'XXWZM', value: null },
    { name: '体检报告', type: 'TJBG', value: null },
    { name: '征信报告', type: 'ZXBG', value: null },
    { name: '社保证明', type: 'SBZM', value: null },
    { name: '其他证书1(可选)', type: 'QTZS_1', value: null },
    { name: '其他证书2(可选)', type: 'QTZS_2', value: null },
    { name: '其他证书3(可选)', type: 'QTZS_2', value: null }
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
      form: {
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
      uploadDialog: {
        show: false,
        userId: null,
        title: '上传附件',
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
      // 是否显示弹出层
      open: false,
      // 项目经历弹出标志
      programDialog: false,
      // 项目经历数据
      programList: null,
      openDetails: false,
      openUpdate: false,
      openUpdate2: false,
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
      programerTotal: 0,
      // 履历信息查询参数
      programeParams: {
        pageNum: 1,
        pageSize: 10,
        staffId: null
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
        url: process.env.VUE_APP_BASE_API + '/system/user/importData'
      },
      // 表单参数
      // form: {
      // },
      // 更新 表单参数
      updateForm: {},
      // 提交修改 表单参数
      editForm: {},
      // 重新提交 表单参数
      reForm: {},
      // 表单校验 下拉框、日期框时trigger: 'change',值发生改变时校验，输入框trigger: 'blur',失去焦点时校验
      rules: {
        id: [
          { required: true, message: 'id不能为空', trigger: 'blur' }
        ]
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
    // 员工基础信息移除
    removeDomain(item) {
      var index = this.form.jnList.indexOf(item)
      if (index !== -1) {
        this.form.jnList.splice(index, 1)
      }
    },
    // 技能页面修改
    removeDomainjn(item) {
      var index = this.updateForm.indexOf(item)
      if (index !== -1) {
        this.updateForm.splice(index, 1)
      }
    },
    // 员工基础信息添加
    addDomain() {
      this.form.jnList.push({
        skillname: '',
        skillstatus: ''
      })
    },
    // 技能添加
    addDomainjn() {
      this.updateForm.push({
        skillname: '',
        skillstatus: ''
      })
    },
    // 经历移除
    removeygxms(item) {
      var index = this.form.ygxms.indexOf(item)
      if (index !== -1) {
        this.form.ygxms.splice(index, 1)
      }
    },

    // 修改经历移除
    removeygxmsup(item) {
      var index = this.updateForm.indexOf(item)
      if (index !== -1) {
        this.updateForm.splice(index, 1)
      }
    },

    // 经历添加
    addygxms() {
      this.form.ygxms.push({
        xmmc: '',
        xmgm: '',
        xmdate: '',
        ygdate: '',
        xmjs: ''
      })
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
    // 项目经历查询
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
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
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
          xmmc: null,
          xmgm: null,
          xmdate: null,
          ygdate: null,
          xmjs: null
        }]

      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
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
    /** 新增按钮操作 */
    handleAdd() {
      this.createName = this.$store.getters.nickName
      if (this.$store.getters.name !== 'admins') {
        this.reset()
        this.isDraft = true
        this.open = true
        this.title = '添加'
      } else {
        this.$alert('管理员不能创建流程', '管理员不能创建流程', {
          confirmButtonText: '确定'
        })
      }
    },
    /** 附件按钮操作 */
    attachment(row) {
      console.log(row)
      this.uploadDialog.userId = row.userid
      console.log(this.uploadDialog.items)
      this.uploadDialog.show = true
    },
    /* 取消上传，重置表单 */
    cancelUpload() {
      this.$refs.attachmentDialog.clear()
      this.uploadDialog.show = false
      this.uploadDialog.items = generateDefaultList()
    },
    /* 提交上传，重置表单 */
    submitUpload() {
      try {
        console.log(this.uploadDialog.items)
        console.log('submitUpload')
        this.$refs.attachmentDialog.clear()
      } catch (e) {
        console.error(e)
        this.$message.error('提交失败，请重试或联系管理员')
      } finally {
        this.uploadDialog.show = false
        this.uploadDialog.items = generateDefaultList()
      }
    },
    /** 更新按钮操作 */
    handleUpdate(row) {
      let updateId = null
      if (row.userid != null) {
        updateId = row.userid
      } else {
        updateId = this.ids[0]
      }
      this.reset()
      api.getOne({ userid: updateId }).then(response => {
        this.updateForm = response.data
        this.openUpdate = true
        this.title = '更新'
      })
    },
    /** 更新技能按钮操作 */
    handleUpdatejn(row) {
      let updateId = null
      if (row.userid != null) {
        updateId = row.userid
      } else {
        updateId = this.ids[0]
      }
      this.reset()
      api.getOnejn({ userid: updateId }).then(response => {
        this.updateForm = response.data
        this.openUpdate2 = true
        this.title = '技能修改'
      })
    },
    /** 更新经历按钮操作 */
    handleUpdatejl(row) {
      let updateId = null
      if (row.id != null) {
        updateId = row.id
      } else {
        updateId = this.ids[0]
      }
      this.reset()
      api.getOnejn({ userid: updateId }).then(response => {
        this.updateForm = response.data
        this.openUpdate3 = true
        this.title = '经历修改'
      })
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
    /** 新增提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            api.update(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            this.form.businessRoute = this.$route.name
            api.add(this.form).then(response => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    // 技能更新增加
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
    submitFormUpdatejn() {
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
    /** 删除按钮操作 */
    handleDelete(row) {
      let ids = []
      if (row.userid == null) {
        ids = this.ids
      } else {
        ids = [row.userid]
      }
      // const ids = row.id || this.ids
      this.$confirm('是否确认删除员工编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        var param = {
          'ids': ids
        }
        return api.del(param)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
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
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = '用户导入'
      this.upload.open = true
    },
    /** 下载模板操作 */
    importTemplate() {
      api.importTemplate().then(response => {
        this.download(response.message)
      })
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
      this.$refs.upload.submit()
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
