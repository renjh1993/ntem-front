<template>
  <div class="app-container">
    <router-view />
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <!--      <el-form-item label="修订历史" prop="revisionHisPk">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.revisionHisPk"-->
      <!--          placeholder="请输入修订历史"-->
      <!--          clearable-->
      <!--          size="small"-->
      <!--          @keyup.enter.native="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="rg主键" prop="transfRgPk">
        <el-input
          v-model="queryParams.transfRgPk"
          placeholder="请输入rg主键"
          size="small"
          :disabled="true"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="原子服务号" label-width="90px" prop="svcId">
        <el-input
          v-model="queryParams.svcId"
          placeholder="请输入原子服务号"
          clearable
          size="small"
          :disabled="true"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--      <el-form-item label="数据类型" prop="fldtype">-->
      <!--        <el-select v-model="queryParams.fldtype" placeholder="请选择数据类型" @change="handleQuery" clearable size="small">-->
      <!--          <el-option label="0-string" value="0" />-->
      <!--          <el-option label="1-Integer" value="1" />-->
      <!--          <el-option label="2-DOUBLE" value="2" />-->
      <!--          <el-option label="3-自定义对象" value="3" />-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <el-form-item label="节点名" prop="pathbuf">
        <el-input
          v-model="queryParams.pathbuf"
          placeholder="请输入节点名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="变量名" prop="fldname">
        <el-input
          v-model="queryParams.fldname"
          placeholder="请输入变量名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <!--        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
        >导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >生成Java类</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-edit-outline"
          size="mini"
          :disabled="multiple"
          @click="handleEditPid()"
        >调整父节点</el-button>
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="danger"-->
      <!--          icon="el-icon-delete"-->
      <!--          size="mini"-->
      <!--          :disabled="multiple"-->
      <!--          @click="handleDeleteMsgs"-->
      <!--        >批量删除</el-button>-->
      <!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="importExcel"
        >导入Excel</el-button>
      </el-col>
      <el-col v-if="expandAll" :span="1.5">
        <el-button
          icon="el-icon-arrow-right"
          size="mini"
          @click="handleNotExpand()"
        >关闭所有行</el-button>
      </el-col>
      <el-col v-else :span="1.5">
        <el-button
          icon="el-icon-arrow-down"
          size="mini"
          @click="handleExpand()"
        >展开所有行</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table
      v-if="refreshTable"
      ref="refTable"
      v-loading="loading"
      :data="msgList"
      row-key="fmtMsgPk"
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :default-expand-all="expandAll"
      :indent="4"
      @row-click="openRow"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column width="150px" label="节点" align="left" prop="pathbuf" :show-overflow-tooltip="true">
        <template scope="scope">
          <span v-if="rowId === scope.row.fmtMsgPk">
            <el-input :id="'autoInput'+ scope.row.fmtMsgPk" :ref="'autoInput'+ scope.row.fmtMsgPk" v-model="scope.row.pathbuf" name="pathbuf" class="titleInput" />
          </span>
          <span v-else>
            {{ scope.row.pathbuf }}
          </span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="rg表主键" align="center" prop="transfRgPk" :show-overflow-tooltip="true">-->
      <!--        <template scope="scope">-->
      <!--          <span v-if="rowId === scope.row.fmtMsgPk">-->
      <!--            <el-input name="transfRgPk" v-model="scope.row.transfRgPk"/>-->
      <!--          </span>-->
      <!--          <span v-else>-->
      <!--            {{ scope.row.transfRgPk }}-->
      <!--          </span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column label="格式转换脚本号" align="center" prop="fmtsptid" />-->
      <el-table-column label="变量名" align="center" prop="fldname">
        <template scope="scope">
          <span v-if="rowId === scope.row.fmtMsgPk">
            <el-input v-model="scope.row.fldname" name="fldname" />
          </span>
          <span v-else>
            {{ scope.row.fldname }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="数据类型" align="center" prop="fldtype">
        <template scope="scope">
          <span v-if="rowId === scope.row.fmtMsgPk">
            <el-select v-model="scope.row.fldtype" placeholder="数据类型" size="small">
              <el-option
                v-for="dict in fldtypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </span>
          <span v-else>
            {{ scope.row.fldtype | transFldtype }}
          </span>
        </template>
      </el-table-column>
      <el-table-column v-if="form.srcFmtType === 150" label="变长定长" align="center" prop="lenflag">
        <template scope="scope">
          <span v-if="rowId === scope.row.lenflag">
            <el-select v-model="scope.row.lenflag" placeholder="定长变长" size="small">
              <el-option :label="0-变长" :value="0" />
              <el-option :label="1-定长" :value="1" />
            </el-select>
          </span>
          <span v-else>
            {{ scope.row.fldtype | len }}
          </span>
        </template>
      </el-table-column>
      <el-table-column v-if="form.srcFmtType === 150" label="定长域长度" align="center" prop="fldlen" />
      <el-table-column v-if="form.srcFmtType === 150" label="变长域长度" align="center" prop="lenoffldlen" />
      <el-table-column v-if="form.srcFmtType === 120" label="分隔符" align="center" prop="sepchar" />
      <el-table-column label="有无默认值或处理函数" align="center" prop="dealaftflag">
        <template scope="scope">
          <span v-if="rowId === scope.row.fmtMsgPk">
            <el-select v-model="scope.row.dealaftflag" placeholder="请选择有无默认值或处理函数" size="small">
              <el-option label="2-无" :value="2" />
              <el-option label="0-默认值" :value="0" />
              <el-option label="1-处理函数" :value="1" />
            </el-select>
          </span>
          <span v-else>
            {{ scope.row.dealaftflag | laftflag }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="默认值或处理函数" align="center" prop="funname">
        <template scope="scope">
          <span v-if="rowId === scope.row.fmtMsgPk">
            <el-input v-model="scope.row.funname" name="funname" :disabled="scope.row.dealaftflag | isDealaftflag" />
          </span>
          <span v-else>
            {{ scope.row.funname }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="节点层次描述" align="center" prop="ordbuf">
        <template scope="scope">
          <span v-if="rowId === scope.row.fmtMsgPk">
            <el-input v-model="scope.row.ordbuf" name="ordbuf" />
          </span>
          <span v-else>
            {{ scope.row.ordbuf }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="行注释" align="center" prop="linememo">
        <template scope="scope">
          <span v-if="rowId === scope.row.fmtMsgPk">
            <el-input v-model="scope.row.linememo" name="linememo" />
          </span>
          <span v-else>
            {{ scope.row.linememo }}
          </span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="创建人" align="center" prop="usrid" />-->
      <!--      <el-table-column label="用户级别" align="center" prop="userlevel" />-->
      <!--      <el-table-column label="创建日期" align="center" prop="crtDate" width="180">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{ parseTime(scope.row.crtDate, '{y}-{m}-{d}') }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column label="修改人" align="center" prop="modifier" />-->
      <!--      <el-table-column label="最后修改日期" align="center" prop="chgDate" width="180">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{ parseTime(scope.row.chgDate, '{y}-{m}-{d}') }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column v-if="showFmtType" label="是否属性" align="center" prop="isattrflag">
        <template scope="scope">
          <span v-if="rowId === scope.row.fmtMsgPk">
            <!--            <el-input v-model="scope.row.isattrflag"/>-->
            <el-select v-model="scope.row.isattrflag" placeholder="是否属性" size="small">
              <el-option
                v-for="item in isattrflagOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </span>
          <span v-else>
            {{ scope.row.isattrflag | transIsattrflag }}
          </span>
        </template>
      </el-table-column>
      <el-table-column v-if="showFmtType" prop="attrname" label="属性值">
        <template scope="scope">
          <span v-if="rowId === scope.row.fmtMsgPk">
            <el-input v-model="scope.row.attrname" name="attrname" />
          </span>
          <span v-else>
            {{ scope.row.attrname }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="顺序号" align="center" prop="serino">
        <template scope="scope">
          <span v-if="rowId === scope.row.fmtMsgPk">
            <el-input-number v-model="scope.row.serino" name="serino" class="titleInput" controls-position="right" :min="0" />
          </span>
          <span v-else>
            {{ scope.row.serino }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="节点属性标识" align="center" prop="pathattrflag">
        <template scope="scope">
          {{ scope.row.pathattrflag | pathattr }}
        </template>
      </el-table-column>
      <el-table-column label="报文类型" align="center" prop="srcFmtType">
        <template scope="scope">
          {{ scope.row.srcFmtType | fmtType }}
        </template>
      </el-table-column>
      <el-table-column label="原子服务号" align="center" prop="svcId" />
      <el-table-column label="修订历史" align="center" prop="revisionHisPk" />
      <!--      <el-table-column label="转换" align="center" prop="transfRImplCd" />-->
      <!--      <el-table-column label="转换规则实现名称" align="center" prop="transfRImplNm" />-->
      <el-table-column fixed="right" width="120px" label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="rowId !== scope.row.fmtMsgPk"
            :id="'handleEdit' + scope.row.fmtMsgPk"
            :ref="'handleEdit' + scope.row.fmtMsgPk"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleEdit($event,scope.row)"
          >修改</el-button>
          <el-button
            v-else
            size="mini"
            class="operButton"
            type="text"
            icon="el-icon-check"
            @click="handleCheck(scope.row)"
          >确定</el-button>
          <el-divider direction="vertical" />
          <el-dropdown slot="scope" size="small">
            <span class="el-dropdown-link">
              更多<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-edit-outline" @click.native="handleEditPid(scope.row)">
                调整父节点
              </el-dropdown-item>
              <el-dropdown-item icon="el-icon-plus" @click.native="handleAdd(scope.row)">
                添加下级
              </el-dropdown-item>
              <el-dropdown-item icon="el-icon-delete" @click.native="handleDelete(scope.row)">
                删除
              </el-dropdown-item>
              <el-dropdown-item icon="el-icon-document-copy" @click.native="handlePaste(scope)">
                粘贴数据
              </el-dropdown-item>
              <!--              <el-dropdown-item icon="el-icon-copy-document" @click.native="handlePasteCover(scope)">-->
              <!--                粘贴修改数据-->
              <!--              </el-dropdown-item>-->
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改报文格式转换明细对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <!--          <el-col :span="8">-->
          <!--            <el-form-item label="父节点id" prop="parentId">-->
          <!--              <treeselect-->
          <!--                v-model="form.parentId"-->
          <!--                :options="msgOptions"-->
          <!--                :normalizer="normalizer"-->
          <!--                :show-count="true"-->
          <!--                placeholder="选择上级菜单"-->
          <!--              />-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <el-col :span="6">
            <el-form-item label="rg表主键" prop="transfRgPk">
              <el-input v-model="form.transfRgPk" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="修订历史" prop="revisionHisPk">
              <el-input v-model="form.revisionHisPk" placeholder="请输入修订历史" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="格式转换脚本号" prop="fmtsptid">
              <el-input v-model="form.fmtsptid" placeholder="请输入格式转换脚本号" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="父节点" prop="parentId">
              <el-input v-model="form.parentFldname" placeholder="顶级" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="节点名" prop="pathbuf">
              <el-input ref="formBufInput" v-model="form.pathbuf" placeholder="请输入节点变量名" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="节点层次描述" prop="ordbuf">
              <el-input v-model="form.ordbuf" placeholder="请输入节点层次描述" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="报文类型" prop="srcFmtType">
              <el-input v-model="form.srcFmtType" :disabled="true">
                <!--                <el-option label="100-FML" :value=100 />-->
                <!--                <el-option label="110-JSON" :value=110 />-->
                <!--                <el-option label="120-分隔符" :value=120 />-->
                <!--                <el-option label="150-TCP定长" :value=150 />-->
                <!--                <el-option label="160-XML" :value=160 />-->
                <!--                <el-option label="170-MQ" :value=170 />-->
                <!--                <el-option label="180-CSV逗号分隔符" :value=180 />-->
                <!--                <el-option label="190-8583" :value=190 />-->
                {{ form.srcFmtType | fmtType }}
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="变量名" prop="fldname">
              <el-input v-model="form.fldname" placeholder="请输入变量名" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数据类型" prop="fldtype">
              <el-select v-model="form.fldtype" placeholder="请选择数据类型">
                <el-option label="0-String" value="0" />
                <el-option label="1-Integer" value="1" />
                <el-option label="2-DOUBLE" value="2" />
                <el-option label="3-自定义对象" value="3" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="顺序号" prop="serino">
              <el-input-number v-model="form.serino" placeholder="请输入顺序号" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-if="form.srcFmtType === 150" label="定长变长" prop="lenflag">
              <el-select v-model="form.lenflag" placeholder="请选择定长变长">
                <el-option label="0-变长" value="0" />
                <el-option label="1-定长" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-show="form.srcFmtType === 150 && form.lenflag === '1'" label="定长域长度" prop="fldlen">
              <el-input v-model="form.fldlen" placeholder="请输入定长域长度(1-定长时存在)" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-show="form.srcFmtType === 150 && form.lenflag === '0'" label="变长域长度" prop="lenoffldlen">
              <el-input v-model="form.lenoffldlen" placeholder="请输入变长域长度(0-变长时存在)" />
            </el-form-item>
          </el-col>
          <!--          <el-col :span="24">-->
          <!--            <el-form-item label="分隔符" prop="sepchar">-->
          <!--              <el-input v-model="form.sepchar" placeholder="请输入分隔符" />-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <el-col :span="8">
            <el-form-item label="有无默认值或处理函数" prop="dealaftflag">
              <el-radio-group v-model="form.dealaftflag">
                <el-radio :label="2">无</el-radio>
                <el-radio :label="0">默认值</el-radio>
                <el-radio :label="1">处理函数</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="默认值或处理函数" prop="funname">
              <el-input v-model="form.funname" :disabled="form.dealaftflag === 2" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="行注释" prop="linememo">
              <el-input v-model="form.linememo" placeholder="请输入行注释" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-if="form.srcFmtType === 160" label="是否属性" prop="isattrflag">
              <el-radio-group v-model="form.isattrflag">
                <el-radio :label="'0'">否</el-radio>
                <el-radio :label="'1'">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-if="form.srcFmtType === 160" label="属性值" prop="attrname">
              <el-input v-model="form.attrname" :disabled="form.isattrflag === '0'" placeholder="请输入属性值" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="节点属性标识" prop="pathattrflag">
              <el-radio-group v-model="form.pathattrflag">
                <el-radio :label="1">普通域</el-radio>
                <el-radio :label="0">公共域</el-radio>
                <el-radio :label="2">循环域</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="原子服务号" prop="svcId">
              <el-input v-model="form.svcId" placeholder="请输入原子服务号" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="转换（校验）规则实现代码" prop="transfRImplCd">
              <el-input v-model="form.transfRImplCd" placeholder="请输入转换" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="转换规则实现名称" prop="transfRImplNm">
              <el-input v-model="form.transfRImplNm" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 调整父节点对话框 -->
    <el-dialog title="调整父节点" :visible.sync="pidOpen" width="600px" close-on-press-escape append-to-body>
      <el-form ref="pidForm" :model="form">
        <el-form-item label="父节点" label-width="80px">
          <treeselect
            v-model="form.parentId"
            :options="msgOptions"
            :normalizer="normalizer"
            :show-count="true"
            placeholder="选择上级菜单"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPidForm">确 定</el-button>
        <el-button @click="pidCancel">取 消</el-button>
      </div>
    </el-dialog>
    <!--粘贴数据对话框-->
    <el-dialog title="粘贴导入" :visible.sync="pasteOpen" append-to-body @close="resetPasteForm()">
      <el-form ref="pasteForm" :model="pasteForm">
        <el-form-item label="粘贴到">
          <el-radio-group v-model="pasteForm.selectTier">
            <el-radio :label="'currentTier'">当前层级</el-radio>
            <el-radio :label="'child'">子级</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="selectColumn">
          <el-transfer
            v-model="pasteForm.selectedProp"
            :titles="['插入列', '已选择列']"
            :data="pasteData()"
          />
        </el-form-item>
        <el-form-item label="数据" label-width="50px">
          <el-input v-model="pasteForm.pasteText" type="textarea" placeholder="把数据粘贴到这儿" @paste.native="pasting($event)" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPasteForm">确 定</el-button>
        <el-button @click="pasteCancel">取 消</el-button>
      </div>
    </el-dialog>
    <!--粘贴覆盖数据对话框-->
    <el-dialog title="粘贴导入" :visible.sync="pasteCoverOpen" append-to-body @close="resetPasteForm()">
      <el-form ref="pasteCoverForm" :model="pasteForm">
        <el-form-item prop="selectColumn">
          <el-transfer
            v-model="pasteForm.coverSelectedProp"
            :titles="['插入列', '已选择列']"
            :data="pasteCoverData()"
          />
        </el-form-item>
        <el-form-item label="数据" label-width="50px">
          <el-input v-model="pasteForm.pasteText" type="textarea" placeholder="把数据粘贴到这儿" @paste.native="pastingCover($event)" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPasteCoverForm">确 定</el-button>
        <el-button @click="pasteCancel">取 消</el-button>
      </div>
      <div class="el-upload__tip" style="color:red">提示：粘贴数据只在本层级有效果！</div>
    </el-dialog>
    <!-- 导入数据对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-form ref="importForm" :model="importForm" :rules="rules">
        <el-form-item label="rg表主键" prop="transfRgPk">
          <el-input v-model="importForm.transfRgPk" :disabled="true" />
        </el-form-item>
        <el-form-item prop="file">
          <el-upload
            ref="upload"
            :limit="1"
            accept=".txt, .json, .xml"
            :headers="upload.headers"
            :action="upload.url"
            :disabled="upload.isUploading"
            :on-progress="handleFileUploadProgress"
            :on-success="handleFileSuccess"
            :auto-upload="false"
            drag
            :data="importForm"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <div slot="tip" class="el-upload__tip" style="color:red">提示：仅允许导入“txt”或“json”或“xml”格式文件！</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-loading.fullscreen.lock="fullscreenLoading" type="primary" @click="submitFileForm('importForm')">确 定</el-button>
        <el-button @click="uploadCancel">取 消</el-button>
      </div>
    </el-dialog>
    <upload-msg-excel v-if="uploadVisible" ref="uploadMsgExcelRef" :upload-msg-data="uploadMsgData" />
  </div>
</template>

<script>
import { listMsg, getMsg, delMsg, delMsgs, addMsg, updateMsg, addPasteData, batchUpdatePid, newPasteData } from '@/api/configuration/msg'
import { listRg } from '@/api/configuration/rg'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getToken } from '@/utils/auth'
import 'element-ui/packages/table/src/store/tree.js'
import uploadMsgExcel from './uploadMsgExcel'

export default {
  name: 'Msg',
  components: { Treeselect, uploadMsgExcel },
  filters: {
    // 过滤器,将返回的数据类型进行转换
    transFldtype: function(value) {
      if (!value) return ''
      else if (value === '0') return 'string'
      else if (value === '1') return 'Integer'
      else if (value === '2') return 'DOUBLE'
      else return '自定义对象'
    },
    transIsattrflag: function(value) {
      if (!value) return ''
      else if (value === '0') return '否'
      else if (value === '1') return '是'
    },
    laftflag: function(value) {
      if (value === 0) {
        return '默认值'
      } else if (value === 1) {
        return '处理函数'
      } else if (value === 2) {
        return '无'
      }
    },
    fmtType: function(value) {
      if (value === 110) {
        return '110-JSON'
      } else if (value === 150) {
        return '150-TCP定长'
      } else if (value === 160) {
        return '160-XML'
      } else if (value === 170) {
        return '170-MQ'
      } else if (value === 190) {
        return '190-8583'
      }
    },
    isDealaftflag(value) {
      if (value === 2) {
        return true
      } else if (value === 1 || value === 0) {
        return false
      }
    },
    len(value) {
      if (value === '0') {
        return '0-变长'
      } else if (value === '1') {
        return '1-定长'
      }
    },
    pathattr(value) {
      if (value === 0) {
        return '0-公共域'
      } else if (value === 1) {
        return '1-普通域'
      } else if (value === 2) {
        return '2-循环域'
      }
    }
  },
  data() {
    return {
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
      // 非树形表格数据
      msgData: [],
      // 报文格式转换明细表格数据
      msgList: [],
      // 树选项
      msgOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 行号
      rowId: '',
      // 数据类型数据字典
      fldtypeOptions: [],
      // 是否展示属性和属性值
      showFmtType: false,
      // INTF报文转换规则组列表
      rgList: [],
      // INTF报文转换规则值
      rgData: {},
      // 调整父节点弹窗
      pidOpen: false,
      // 查询参数
      queryParams: {
        parentId: null,
        transfRgPk: null,
        revisionHisPk: null,
        fmtsptid: null,
        serino: null,
        fldname: null,
        fldtype: '',
        lenflag: null,
        fldlen: null,
        lenoffldlen: null,
        sepchar: null,
        dealaftflag: null,
        pathbuf: null,
        ordbuf: null,
        funname: null,
        linememo: null,
        usrid: null,
        userlevel: null,
        crtDate: null,
        modifier: null,
        chgDate: null,
        isattrflag: null,
        attrname: null,
        pathattrflag: null,
        srcFmtType: null,
        svcId: null,
        transfRImplCd: null,
        transfRImplNm: null
      },
      // 是否属性选择
      isattrflagOptions: [
        {
          value: '0',
          label: '否'
        },
        {
          value: '1',
          label: '是'
        }
      ],
      // 表单参数
      form: {
        parentFldname: null
      },
      // 表单校验
      rules: {
        pathbuf: [
          { required: true, message: '节点名不能为空', trigger: 'blur' }
        ],
        fldname: [
          { required: true, message: '节点名不能为空', trigger: 'blur' }
        ],
        fldtype: [
          { required: true, message: '变量类型不能为空', trigger: 'blur' }
        ]
      },
      // v-if
      refreshTable: true,
      // 是否展开所以展开行
      expandAll: false,
      // 粘贴窗口数据
      pasteForm: {
        // 选择要粘贴到的层级
        selectTier: 'currentTier',
        // 当前行的索引
        rowIndex: 0,
        // 当前行的pid
        currentRow: undefined,
        // 粘贴的数据
        pasteText: undefined,
        // 已选择的列的index
        selectedProp: ['pathbuf'],
        // 粘贴覆盖的已选择的列
        coverSelectedProp: []
      },
      // 是否打开粘贴数据弹窗
      pasteOpen: false,
      // 是否打开粘贴覆盖数据弹窗
      pasteCoverOpen: false,
      // 粘贴窗口穿梭框数据
      pasteData: null,
      // 粘贴覆盖窗口穿梭框数据
      pasteCoverData: null,
      // 上传参数
      upload: {
        // 上传弹窗
        open: false,
        // 弹窗标题
        title: '上传文件',
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/configuration/msg/importData'
      },
      importForm: {},
      fullscreenLoading: false,
      localSrcFmtType: null,
      uploadVisible: false,
      uploadMsgData: {}
    }
  },
  created() {
    this.rgData = this.$route.query.rgData
    if (this.rgData.srcFormatTypeCd === '100') {
      this.localSrcFmtType = this.rgData.targetFormatTypeCd
    } else {
      this.localSrcFmtType = this.rgData.srcFormatTypeCd
    }
    this.getList()
    this.getDicts('t_fmt_pubfld_fldtype').then(response => {
      this.fldtypeOptions = response.data
    })
    // 初始化穿梭框
    this.pasteData = () => {
      const pasteData = []
      const tableTitles = ['节点名', '变量名', '长度', '数据类型', '是否存在默认值或处理函数', '默认值或处理函数', '是否属性', '属性值', '备注', '排序']
      const prop = ['pathbuf', 'fldname', 'fldlen', 'fldtype', 'dealaftflag', 'funname', 'isattrflag', 'attrname', 'linememo', 'serino']
      tableTitles.forEach((tableTitle, index) => {
        if (this.rgData.targetFormatTypeCd !== '160') {
          pasteData.push({
            label: tableTitle,
            key: prop[index],
            prop: prop[index],
            disabled: index === 0 || index === 6 || index === 7
          })
        } else {
          pasteData.push({
            label: tableTitle,
            key: prop[index],
            prop: prop[index],
            disabled: index === 0
          })
        }
      })
      return pasteData
    }
    // 初始化粘贴覆盖穿梭框
    this.pasteCoverData = () => {
      const pasteCoverData = []
      const tableTitles = ['节点名', '变量名', '长度', '数据类型', '是否默认值', '处理函数', '是否属性', '备注', '排序']
      const prop = ['pathbuf', 'fldname', 'fldlen', 'fldtype', 'dealaftflag', 'funname', 'isattrflag', 'linememo', 'serino']
      tableTitles.forEach((tableTitle, index) => {
        if (this.rgData.targetFormatTypeCd !== '160') {
          pasteCoverData.push({
            label: tableTitle,
            key: prop[index],
            prop: prop[index],
            disabled: index === 6 || index === 7
          })
        } else {
          pasteCoverData.push({
            label: tableTitle,
            key: prop[index],
            prop: prop[index]
          })
        }
      })
      return pasteCoverData
    }
  },
  methods: {
    /** 查询报文格式转换明细列表 */
    getList() {
      this.loading = true
      this.showFmtType = false
      this.queryParams.transfRgPk = this.rgData.transfRgPk
      this.queryParams.svcId = this.rgData.svcId
      listMsg(this.queryParams).then(response => {
        this.msgData = response.rows
        this.msgList = this.handleTree(response.rows, 'fmtMsgPk')
        console.log('msg', this.msgList)
        if (this.rgData.targetFormatTypeCd === '160') {
          this.showFmtType = true
        }
        this.loading = false
      })
    },
    /** 转换数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.fmtMsgPk,
        label: node.pathbuf,
        children: node.children
      }
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      const _this = this
      listMsg(_this.queryParams).then(response => {
        this.msgOptions = []
        const msg = { fmtMsgPk: 0, pathbuf: '顶级', children: [] }
        msg.children = this.handleTree(response.rows, 'fmtMsgPk')
        this.msgOptions.push(msg)
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    idCancel() {
      this.pidOpen = false
    },
    pasteCancel() {
      this.pasteOpen = false
      this.resetPasteForm()
    },
    pasteCoverCancel() {
      this.pasteCoverOpen = false
      this.resetPasteForm()
    },
    // 表单重置
    reset() {
      this.form = {
        fmtMsgPk: null,
        parentId: null,
        transfRgPk: this.rgData.transfRgPk,
        revisionHisPk: this.rgData.revisionHisPk,
        fmtsptid: this.rgData.svcId,
        serino: 0,
        fldname: null,
        fldtype: null,
        lenflag: null,
        fldlen: null,
        lenoffldlen: null,
        sepchar: null,
        dealaftflag: 2,
        pathbuf: null,
        ordbuf: null,
        funname: null,
        linememo: null,
        usrid: null,
        userlevel: null,
        crtDate: null,
        modifier: null,
        chgDate: null,
        isattrflag: '0',
        attrname: null,
        pathattrflag: 1,
        srcFmtType: parseInt(this.localSrcFmtType),
        svcId: this.rgData.svcId,
        transfRImplCd: null,
        transfRImplNm: null
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset()
      var _this = this
      if (row !== null && row.fmtMsgPk) {
        this.title = '添加下级'
        this.form.parentId = row.fmtMsgPk
        this.form.parentFldname = row.pathbuf
      } else {
        this.title = '添加报文格式转换明细'
        this.form.parentId = 0
      }
      // this.getTreeselect()
      setTimeout(function() {
        _this.$refs['formBufInput'].focus()
      }, 1)
      this.open = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const fmtMsgPk = row.fmtMsgPk || this.ids
      getMsg(fmtMsgPk).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改报文格式转换明细'
      })
      this.getTreeselect()
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          addMsg(this.form).then(response => {
            if (response.data === '新增成功') {
              this.msgSuccess('新增成功')
            } else {
              this.msgError(response.data)
            }
            this.open = false
            this.handleQuery()
          })
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const fmtMsgPk = row.fmtMsgPk
      this.$confirm('是否确认删除节点为"' + row.pathbuf + '"以及其子节点的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delMsg(fmtMsgPk)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    },
    handleDeleteMsgs() {
      const fmtMsgPks = this.ids
      this.$confirm('是否删除选中节点', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delMsgs(fmtMsgPks)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    },
    /** 导出按钮操作 */
    // handleExport() {
    //   const queryParams = this.queryParams;
    //   this.$confirm('是否确认导出所有报文格式转换明细数据项?', "警告", {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning"
    //     }).then(function() {
    //       return exportMsg(queryParams);
    //     }).then(response => {
    //       this.download(response.msg);
    //     })
    // },
    // 行内编辑
    handleEdit(event, row) {
      console.log('rowwww', event, row)
      var _this = this
      _this.rowId = row.fmtMsgPk
      this.$nextTick(() => {
        const id = 'autoInput' + row.fmtMsgPk
        document.getElementById(id).focus()
      })
    },
    handleCheck(row) {
      var _this = this
      updateMsg(row).then(response => {
        this.msgSuccess('修改成功')
        this.handleQuery()
        _this.rowId = ''
      })
    },
    /** 查询INTF报文转换规则组列表 */
    getRgList() {
      this.loading = true
      const query = {}
      listRg(query).then(response => {
        this.rgList = response.rows
        this.loading = false
      })
    },
    // 打开调整父节点的弹窗
    handleEditPid(row) {
      if (row) {
        this.ids = []
        this.form = row
        this.ids.push(row.fmtMsgPk)
      }
      this.getTreeselect()
      this.pidOpen = true
    },
    pidCancel() {
      this.pidOpen = false
    },
    // 展开所有行
    handleExpand() {
      this.refreshTable = false
      this.expandAll = true
      this.$nextTick(() => {
        this.refreshTable = true
      })
    },
    // 关闭所有行
    handleNotExpand() {
      this.refreshTable = false
      this.expandAll = false
      this.$nextTick(() => {
        this.refreshTable = true
      })
    },
    // 选择要粘贴的列
    handlePaste(scope) {
      this.resetPasteForm()
      var row = scope.row
      // 获取当前数据的index
      this.pasteForm.rowIndex = this.msgData.findIndex(function(item) {
        return item.fmtMsgPk === row.fmtMsgPk
      })
      this.pasteForm.currentRow = row
      this.pasteOpen = true
    },
    // 重置粘贴表单
    resetPasteForm() {
      this.pasteForm = {
        // 选择要粘贴到的层级
        selectTier: 'currentTier',
        // 当前行的索引
        rowIndex: 0,
        // 粘贴的数据
        pasteText: '',
        // 已选择的列的index
        selectedProp: ['pathbuf'],
        // 粘贴覆盖的已选择的列
        coverSelectedProp: []
      }
      this.resetForm('pasteForm')
    },
    // 粘贴弹窗确定
    submitPasteForm() {
      this.fullscreenLoading = true
      const pasteArr = this.pasteArr
      const selectProps = this.pasteForm.selectedProp
      const currentTransfRgPk = this.pasteForm.currentRow.transfRgPk
      var currentPid = ''
      if (this.pasteForm.selectTier === 'currentTier') {
        currentPid = this.pasteForm.currentRow.parentId
      } else {
        currentPid = this.pasteForm.currentRow.fmtMsgPk
      }
      newPasteData(currentPid, currentTransfRgPk, pasteArr, selectProps).then(response => {
        if (response.data === '粘贴成功') {
          this.msgSuccess('添加成功')
        } else {
          this.msgError(response.data || response)
        }

        this.pasteOpen = false
        this.resetPasteForm()
        this.handleQuery()
      })
      setTimeout(() => {
        this.fullscreenLoading = false
      }, 2000)
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.fmtMsgPk)
      this.multiple = !selection.length
    },
    // 粘贴覆盖
    handlePasteCover(scope) {
      var row = scope.row
      // 获取当前数据的index
      this.pasteForm.rowIndex = this.msgData.findIndex(function(item) {
        return item.fmtMsgPk === row.fmtMsgPk
      })
      this.pasteForm.currentPid = row.parentId
      this.pasteCoverOpen = true
    },
    pastingCover(e) {
      if (e.clipboardData) {
        const arrs = this.processData(e.clipboardData)
        const h = this.$createElement
        if (this.pubfldListData.length - this.pasteForm.rowIndex < arrs.length) {
          this.$notify({
            title: '提示',
            message: h('i', { style: 'color: teal' }, '粘贴条数过长'),
            type: 'error',
            duration: 2000
          })
          setTimeout(this.pasteCancel(), 1.5)
        } else if (this.pasteForm.coverSelectedProp.length !== arrs[0].length) {
          this.$notify({
            title: '提示',
            message: h('i', { style: 'color: teal' }, '粘贴条数与选择列数不匹配'),
            type: 'error',
            duration: 2000
          })
          this.pasteCancel()
        } else {
          for (let i = 0, z = this.pasteForm.rowIndex; i < arrs.length; i++, z++) {
            if (this.pasteForm.coverSelectedProp !== undefined) {
              for (let j = 0; j < this.pasteForm.coverSelectedProp.length; j++) {
                if (this.pubfldListData[z].parentId === this.pasteForm.currentPid) {
                  this.pubfldListData[z][this.pasteForm.coverSelectedProp[j]] = arrs[i][j]
                }
              }
            }
          }
        }
      }
    },
    // 粘贴覆盖弹窗确定
    submitPasteCoverForm() {
      addPasteData(this.msgData).then(response => {
        this.msgSuccess('添加成功')
        this.pasteCoverOpen = false
        this.resetPasteForm()
        this.handleQuery()
      })
    },
    submitPidForm: function() {
      batchUpdatePid(this.form.parentId, this.ids).then(response => {
        if (response.code === 200) {
          this.msgSuccess('修改父节点成功')
        } else {
          console.log(response)
          this.msgError(response)
        }
        this.pidOpen = false
        this.handleQuery()
      })
    },
    /** 导入按钮操作 */
    handleImport() {
      this.resetImForm()
      this.upload.title = '导入数据'
      this.upload.open = true
      this.importForm.transfRgPk = this.rgData.transfRgPk
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
      this.$alert(response.data, '导入结果', { dangerouslyUseHTMLString: true })
      this.getList()
    },
    uploadCancel() {
      this.upload.open = false
      this.$refs.upload.clearFiles()
    },
    resetImForm() {
      this.importForm = {
        pubfldname: '',
        dataType: '0'
      }
      this.resetForm('importForm')
    },
    submitFileForm(fromName) {
      const _this = this
      _this.$confirm('此操作将无法撤回,是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'waring'
      }).then(() => {
        _this.$refs.importForm.validate((valid) => {
          if (valid) {
            _this.$refs.upload.submit()
          } else {
            return false
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消更新'
        })
      })
    },
    // 获取并处理粘贴数据
    processData(clipboardData) {
      this.pasteArr = []
      var data = clipboardData.getData('Text').split('\n')
      for (var i = 0; i < data.length; i++) {
        if (!data[i]) {
          continue
        }
        const bugdetData = data[i].split('\t')
        this.pasteArr.push(bugdetData)
      }
      return this.pasteArr
    },
    pasting(e) {
      if (e.clipboardData) {
        const arrs = this.processData(e.clipboardData)
        const h = this.$createElement
        if (this.pasteForm.selectedProp.length !== arrs[0].length) {
          this.$notify({
            title: '提示',
            message: h('i', { style: 'color: teal' }, '粘贴条数与选择列数不匹配'),
            type: 'error',
            duration: 2000
          })
          this.pasteCancel()
        }
      }
    },
    // 导出 生成Java类
    handleExport() {
      const transfRgPk = this.queryParams.transfRgPk
      const transId = this.queryParams.svcId
      // window.open("http://192.168.31.178/dev-api/generateMsgJava?transId=" + transId + "&transfRgPk=" + transfRgPk)
      window.open(process.env.VUE_APP_BASE_API + '/generateMsgJava?transId=' + transId + '&transfRgPk=' + transfRgPk)
    },
    // 点击一行展开
    openRow(row, column, event) {
      this.$refs.refTable.toggleRowExpansion(row)
    },
    // 导入Excel
    importExcel() {
      this.uploadMsgData = {
        'transfRgPk': this.queryParams.transfRgPk,
        'revisionHisPk': this.rgData.revisionHisPk,
        'svcId': this.rgData.svcId,
        'srcFmtType': parseInt(this.localSrcFmtType)
      }
      this.uploadVisible = true
      this.$nextTick(() => {
        this.$refs.uploadMsgExcelRef.init()
      })
    }
  }
}
</script>

<style scoped>
  .titleInput {
    width: 100px;
  }
  .el-button.operButton:hover {
    color: #ffffff;
    background-color: #00afff;
  }
  .el-button.operButton:focus {
    color: #ffffff;
    background-color: #00afff;
  }
  .el-dropdown-link {
    font-size: 12px;
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
