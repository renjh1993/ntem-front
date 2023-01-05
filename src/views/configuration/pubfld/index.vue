<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="(当前)报文名" prop="pubfldname">
        <el-select v-model="queryParams.pubfldname" filterable placeholder="报文" size="small" @change="handleQuery">
          <el-option
            v-for="dict in pubOptions"
            :key="dict"
            :label="dict"
            :value="dict"
            @click="handleQuery"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="节点名" prop="pathbuf">
        <el-input
          v-model="queryParams.pathbuf"
          placeholder="请输入节点名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="数据类型" prop="fldtype">
        <el-select v-model="queryParams.fldtype" placeholder="数据类型" clearable size="small" @change="handleQuery">
          <el-option
            v-for="dict in fldtypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
          @click="handleAdd(pubfldList)"
        >新增节点
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
        >导入
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >生成Java类
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-edit-outline"
          size="mini"
          :disabled="multiple"
          @click="handleEditPid()"
        >调整父节点
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="importExcel"
        >导入Excel
        </el-button>
      </el-col>
      <el-col v-if="expandAll" :span="1.5">
        <el-button
          icon="el-icon-arrow-right"
          size="mini"
          @click="handleNotExpand()"
        >关闭所有行
        </el-button>
      </el-col>
      <el-col v-else :span="1.5">
        <el-button
          icon="el-icon-arrow-down"
          size="mini"
          @click="handleExpand()"
        >展开所有行
        </el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table
      v-if="refreshTable"
      ref="refTable"
      v-loading="loading"
      :data="pubfldList"
      row-key="fmtPubfldPk"
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :default-expand-all="expandAll"
      :indent="4"
      @row-click="openRow"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="pathbuf" width="150px" label="节点" :show-overflow-tooltip="true">
        <template scope="scope">
          <span v-if="rowId === scope.row.fmtPubfldPk">
            <el-input
              :ref="'autoInput'+ scope.row.fmtPubfldPk"
              v-model="scope.row.pathbuf"
              name="pathbuf"
              class="titleInput"
            />
          </span>
          <span v-else>
            {{ scope.row.pathbuf }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="fldname" label="变量名" :show-overflow-tooltip="true">
        <template scope="scope">
          <span v-if="rowId === scope.row.fmtPubfldPk">
            <el-input v-model="scope.row.fldname" name="fldname" />
          </span>
          <span v-else>
            {{ scope.row.fldname }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="fldlen" label="长度">
        <template scope="scope">
          <span v-if="rowId === scope.row.fmtPubfldPk">
            <el-input v-model="scope.row.fldlen" name="fldlen" />
          </span>
          <span v-else>
            {{ scope.row.fldlen }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="fldtype" label="数据类型" :formatter="fldtypeFormat" :show-overflow-tooltip="true">
        <template scope="scope">
          <span v-if="rowId === scope.row.fmtPubfldPk">
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
      <el-table-column prop="dealaftflag" label="有无默认值或处理函数" :show-overflow-tooltip="true">
        <template scope="scope">
          <span v-if="rowId === scope.row.fmtPubfldPk">
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
      <el-table-column prop="funname" label="默认值或处理函数" :show-overflow-tooltip="true">
        <template scope="scope">
          <span v-if="rowId === scope.row.fmtPubfldPk">
            <el-input v-model="scope.row.funname" name="funname" :disabled="scope.row.dealaftflag | isDealaftflag" />
          </span>
          <span v-else>
            {{ scope.row.funname }}
          </span>
        </template>
      </el-table-column>
      <el-table-column v-if="showFmtType" prop="isattrflag" label="是否属性">
        <template scope="scope">
          <span v-if="rowId === scope.row.fmtPubfldPk">
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
          <span v-if="rowId === scope.row.fmtPubfldPk">
            <el-input v-model="scope.row.attrname" name="attrname" />
          </span>
          <span v-else>
            {{ scope.row.attrname }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="linememo" label="备注">
        <template scope="scope">
          <span v-if="rowId === scope.row.fmtPubfldPk">
            <el-input v-model="scope.row.linememo" name="linememo" />
          </span>
          <span v-else>
            {{ scope.row.linememo }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="serino" label="排序" width="60px">
        <template scope="scope">
          <span v-if="rowId === scope.row.fmtPubfldPk">
            <el-input-number
              v-model="scope.row.serino"
              name="serino"
              class="titleInput"
              controls-position="right"
              :min="0"
            />
          </span>
          <span v-else>
            {{ scope.row.serino }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="rowId !== scope.row.fmtPubfldPk"
            size="mini"
            class="operButton"
            type="text"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
          >修改
          </el-button>
          <el-button
            v-else
            size="mini"
            class="operButton"
            type="text"
            icon="el-icon-check"
            @click="handleCheck(scope.row)"
          >确定
          </el-button>
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

    <!-- 添加或  菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="85px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="报文名" prop="pubfldname">
              <el-input
                ref="formInput"
                v-model="form.pubfldname"
                placeholder="请输入报文名"
                :disabled="pubDisabled"
                @blur="pubfldnameLeave(form.pubfldname)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报文类型" prop="srcFmtType">
              <el-radio-group v-model="form.srcFmtType">
                <el-radio :disabled="sftDisabled" :label="180">JSON</el-radio>
                <el-radio :disabled="sftDisabled" :label="150">XML</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.srcFmtType === 150" label="是否属性" prop="isattrflag">
              <el-radio-group v-model="form.isattrflag">
                <el-radio :label="'1'">是</el-radio>
                <el-radio :label="'0'">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="上级节点">
              <el-input v-model="form.parentFldname" placeholder="顶级" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="数据类型" prop="fldtype">
              <el-radio-group v-model="form.fldtype">
                <el-radio :label="'0'">string</el-radio>
                <el-radio :label="'1'">Integer</el-radio>
                <el-radio :label="'2'">DOUBLE</el-radio>
                <el-radio :label="'3'">自定义对象</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="节点名称" prop="pathbuf">
              <el-input ref="pathbufInput" v-model="form.pathbuf" placeholder="请输入节点名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="变量名称" prop="fldname">
              <el-input v-model="form.fldname" placeholder="请输入变量名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="serino">
              <el-input-number v-model="form.serino" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有无默认值或处理函数" prop="dealaftflag">
              <el-radio-group v-model="form.dealaftflag">
                <el-radio :label="2">无</el-radio>
                <el-radio :label="0">默认值</el-radio>
                <el-radio :label="1">处理函数</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="默认值或处理函数" prop="funname">
              <el-input v-model="form.funname" :disabled="form.dealaftflag === 2" />
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
            :options="pubfldOptions"
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
    <!-- 导入数据对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" modal-append-to-body width="400px" append-to-body>
      <el-form ref="importForm" :model="importForm" :rules="rules">
        <el-form-item label="报文名" prop="pubfldname">
          <el-input ref="importPubfldname" v-model="importForm.pubfldname" />
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
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
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
        <el-button type="primary" @click="submitFileForm('importForm')">确 定</el-button>
        <el-button @click="uploadCancel">取 消</el-button>
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
          <el-input
            v-model="pasteForm.pasteText"
            type="textarea"
            placeholder="把数据粘贴到这儿"
            @paste.native="pasting($event)"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPasteForm">确 定</el-button>
        <el-button @click="pasteCancel">取 消</el-button>
      </div>
    </el-dialog>
    <upload-excel v-if="uploadVisible" ref="uploadExcelRef" />
    <!--粘贴覆盖数据对话框-->
    <!--    <el-dialog title="粘贴导入" :visible.sync="pasteCoverOpen"  @close="resetPasteForm()" append-to-body>-->
    <!--      <el-form ref="pasteCoverForm" :model="pasteForm">-->
    <!--        <el-form-item prop="selectColumn">-->
    <!--          <el-transfer-->
    <!--            v-model="pasteForm.coverSelectedProp"-->
    <!--            :titles="['插入列', '已选择列']"-->
    <!--            :data="pasteCoverData()"-->
    <!--          ></el-transfer>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="数据" label-width="50px">-->
    <!--          <el-input @paste.native="pastingCover($event)" type="textarea" placeholder="把数据粘贴到这儿" v-model="pasteForm.pasteText"></el-input>-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->
    <!--      <div slot="footer" class="dialog-footer">-->
    <!--        <el-button type="primary" @click="submitPasteCoverForm">确 定</el-button>-->
    <!--        <el-button @click="pasteCancel">取 消</el-button>-->
    <!--      </div>-->
    <!--      <div class="el-upload__tip" style="color:red">提示：粘贴数据只在本层级有效果！</div>-->
    <!--    </el-dialog>-->
  </div>
</template>

<script>
import {
  listPubfld,
  addPubfld,
  delPubfld,
  updatePubfld,
  getPubfld,
  listPub,
  isExistPub,
  newPasteData,
  addPasteData,
  batchUpdatePid
} from '@/api/configuration/pubfld'
import Treeselect from '@riophae/vue-treeselect'
import { getToken } from '@/utils/auth'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import uploadExcel from './uploadExcel'

export default {
  name: 'Pubfld',
  components: { Treeselect, uploadExcel },
  filters: {
    // 过滤器,将返回的数据类型进行转换
    transFldtype: function(value) {
      if (!value) {
        return ''
      } else if (value === '0') {
        return 'string'
      } else if (value === '1') {
        return 'Integer'
      } else if (value === '2') {
        return 'DOUBLE'
      } else {
        return '自定义对象'
      }
    },
    transIsattrflag: function(value) {
      if (!value) {
        return ''
      } else if (value === '0') {
        return '否'
      } else if (value === '1') return '是'
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
    isDealaftflag(value) {
      if (value === 2) {
        return true
      } else if (value === 1 || value === 0) {
        return false
      }
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      pubfldList: [],
      // 非树形表格数据
      pubfldListData: [],
      // 行号
      rowId: '',
      // 树选项
      pubfldOptions: [],
      // 公共域列表
      pubOptions: [],
      // 默认公共域
      defaultPub: undefined,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 显示状态数据字典
      visibleOptions: [],
      // 数据类型数据字典
      fldtypeOptions: [],
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
      // 查询参数
      queryParams: {
        pubfldname: null,
        pathbuf: null,
        fldtype: null,
        parentId: null
      },
      // 表单参数
      form: {
        // 上级节点名字
        parentFldname: null,
        dealaftflag: 0
      },
      // 是否属性输入框展示
      // isAttr: false,
      // 调整父节点弹窗
      pidOpen: false,
      importForm: {},
      // 报文名是否禁止修改
      pubDisabled: true,
      // 报文类型是否禁止修改
      sftDisabled: true,
      // 非多个禁用
      multiple: true,
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
        url: process.env.VUE_APP_BASE_API + '/system/fmtPubfld/importData'
      },
      // 是否打开粘贴数据弹窗
      pasteOpen: false,
      // 是否打开粘贴覆盖数据弹窗
      pasteCoverOpen: false,
      // 粘贴窗口穿梭框数据
      pasteData: null,
      // 粘贴覆盖窗口穿梭框数据
      pasteCoverData: null,
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
      // 粘贴处理
      costList: [],
      // 粘贴板数据
      pasteArr: [],
      // 复选框选中的数据的id集合
      ids: [],
      // 表单校验
      rules: {
        pathbuf: [
          { required: true, message: '节点名不能为空', trigger: 'blur' }
        ],
        serino: [
          { required: true, message: '顺序不能为空', trigger: 'blur' }
        ],
        pubfldname: [
          { required: true, message: '报文名不能为空', trigger: 'blur' }
        ]
      },
      // v-if
      refreshTable: true,
      // 是否展开所以展开行
      expandAll: false,
      // 是否展示属性和属性值
      showFmtType: false,
      // 是否可以修改默认值或者处理函数
      ifDealaftflag: false,
      // 报文类型
      sfmtType: null,
      // 上传dia
      uploadVisible: false,
      fileList: 0
    }
  },
  created() {
    this.getList()
    // 初始化穿梭框
    this.pasteData = () => {
      const pasteData = []
      const tableTitles = ['节点名', '变量名', '长度', '数据类型', '是否默认值', '处理函数', '是否属性', '属性值', '备注', '排序']
      const prop = ['pathbuf', 'fldname', 'fldlen', 'fldtype', 'dealaftflag', 'funname', 'isattrflag', 'attrname', 'linememo', 'serino']
      tableTitles.forEach((tableTitle, index) => {
        pasteData.push({
          label: tableTitle,
          key: prop[index],
          prop: prop[index],
          disabled: index === 0
        })
      })
      return pasteData
    }
    // 初始化粘贴覆盖穿梭框
    // this.pasteCoverData = () =>{
    //   const pasteCoverData = [];
    //   const tableTitles = ['节点名', '变量名', '长度', '数据类型', '是否存在默认值或处理函数', '默认值或处理函数', '是否属性', '属性值', '备注', '排序'];
    //   const prop = ['pathbuf', 'fldname', 'fldlen', 'fldtype', 'dealaftflag', 'funname', 'isattrflag', 'attrname','linememo', 'serino'];
    //   tableTitles.forEach((tableTitle, index) => {
    //     if (150 !== this.pubfldListData[0].srcFmtType){
    //       pasteCoverData.push({
    //         label: tableTitle,
    //         key: prop[index],
    //         prop: prop[index],
    //         disabled: index === 6 || index === 7
    //       });
    //     } else {
    //       pasteCoverData.push({
    //         label: tableTitle,
    //         key: prop[index],
    //         prop: prop[index],
    //       });
    //     }
    //   });
    //   return pasteCoverData;
    // }
    this.getDicts('sys_show_hide').then(response => {
      this.visibleOptions = response.data
    })
    this.getDicts('t_fmt_pubfld_fldtype').then(response => {
      this.fldtypeOptions = response.data
    })
  },
  methods: {
    /** 初始查询列表 */
    getList(queryParams) {
      this.loading = true
      var _this = this
      let returnData = []
      // 获取公共域列表
      listPub().then(response => {
        this.pubOptions = response.data
        _this.queryParams.pubfldname = this.pubOptions[0]
        listPubfld(_this.queryParams).then(response => {
          this.pubfldListData = response.data
          this.pubfldList = this.handleTree(response.data, 'fmtPubfldPk')
          if (this.pubfldList[0].srcFmtType === 150) {
            this.showFmtType = true
          }
          this.loading = false
          returnData = this.pubfldListData
          return returnData
        })
      })
      return returnData
    },
    /** 转换数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.fmtPubfldPk,
        label: node.pathbuf,
        children: node.children
      }
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      const _this = this
      listPubfld(_this.queryParams).then(response => {
        this.pubfldOptions = []
        const fmtPubfld = { fmtPubfldPk: 0, pathbuf: '顶级', children: [] }
        fmtPubfld.children = this.handleTree(response.data, 'fmtPubfldPk')
        this.pubfldOptions.push(fmtPubfld)
      })
    },
    // 节点数据类型字典翻译
    fldtypeFormat(row, column) {
      return this.selectDictLabel(this.fldtypeOptions, row.fldtype)
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.sftDisabled = true
      this.reset()
    },
    uploadCancel() {
      this.upload.open = false
      this.$refs.upload.clearFiles()
    },
    pidCancel() {
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
        fmtPubfldPk: undefined,
        parentId: 0,
        fldname: undefined,
        fldtype: '0',
        serino: 0,
        fldlen: 0,
        pubfldname: undefined,
        parentFldname: undefined,
        srcFmtType: this.pubfldList[0].srcFmtType,
        isattrflag: '0',
        dealaftflag: 2
      }
      this.resetForm('form')
      // this.isAttr = false
    },
    resetImForm() {
      this.importForm = {
        pubfldname: '',
        dataType: '0'
      }
      this.resetForm('importForm')
    },
    resetPasteForm() {
      this.pasteForm = {
        // 选择要粘贴到的层级
        selectTier: 'currentTier',
        // 当前行的索引
        rowIndex: 0,
        // 粘贴的数据
        pasteText: '',
        // 已选择的列的index
        selectedProp: ['fldname'],
        // 粘贴覆盖的已选择的列
        coverSelectedProp: []
      }
      this.resetForm('pasteForm')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      listPubfld(this.queryParams).then(response => {
        this.loading = true
        this.showFmtType = false
        this.pubfldListData = response.data
        this.pubfldList = this.handleTree(response.data, 'fmtPubfldPk')
        if (response.data.length !== 0 && this.pubfldList[0].srcFmtType === 150) {
          this.showFmtType = true
        }
        this.loading = false
        listPub().then(response => {
          this.pubOptions = response.data
        })
      })
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      var _this = this
      // this.$refs.pubfldname.focus
      this.reset()
      if (row !== null && row.fmtPubfldPk) {
        _this.form.pubfldname = this.pubfldList[0].pubfldname
        _this.pubDisabled = true
        _this.form.parentFldname = row.pathbuf
        _this.form.parentId = row.fmtPubfldPk
        _this.title = '添加下级'
        setTimeout(function() {
          _this.$refs['pathbufInput'].focus()
        }, 1)
      } else {
        _this.pubDisabled = false
        _this.form.pubfldname = this.pubfldList[0].pubfldname
        _this.form.parentId = 0
        _this.title = '新增节点'
        setTimeout(function() {
          _this.$refs['formInput'].focus()
        }, 1)
      }
      this.open = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const _this = this
      this.reset()
      getPubfld(row.fmtPubfldPk).then(response => {
        _this.form = response.data
        this.open = true
        this.title = '修改'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          addPubfld(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess('新增成功')
            } else {
              this.msgError('新增节点失败, 名称已存在')
            }
            this.open = false
            this.handleQuery()
          })
        }
      })
    },
    submitPidForm: function() {
      batchUpdatePid(this.form.parentId, this.ids).then(response => {
        if (response.code === 200) {
          this.msgSuccess('修改父节点成功')
        } else {
          this.msgError(response)
        }
        this.pidOpen = false
        this.handleQuery()
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除节点为"' + row.pathbuf + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delPubfld(row.fmtPubfldPk)
      }).then(() => {
        this.handleQuery()
        this.msgSuccess('删除成功')
      })
    },
    /** 导入按钮操作 */
    handleImport() {
      const _this = this
      this.resetImForm()
      this.upload.title = '导入数据'
      this.upload.open = true
      setTimeout(function() {
        _this.$refs['importPubfldname'].focus()
      }, 1)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    handleFileChange(file, fileList) {
      this.fileList = fileList.length
    },
    handleFileRemove(file, fileList) {
      this.fileList = fileList.length
    },
    // submitFileForm(fromName) {
    //   let _this = this;
    //   _this.$confirm('此操作将无法撤回,是否继续', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'waring'
    //   }).then(() =>{
    //     _this.$refs.importForm.validate((valid) =>{
    //       if (valid) {
    //         _this.$refs.upload.submit()
    //       }else {
    //         return false
    //       }
    //     })
    //   }).catch(() =>{
    //     this.$message({
    //       type: 'info',
    //       message: '已取消更新'
    //     })
    //   })
    // },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.$alert(response.data, '导入结果', { dangerouslyUseHTMLString: true })
      this.fileList = 0
      this.getList()
    },
    // 提交上传文件
    submitFileForm() {
      if (this.fileList === 0) {
        this.$message({
          type: 'warning',
          message: '请先上传文件'
        })
      } else if (this.importForm.pubfldname === '') {
        this.$message({
          type: 'warning',
          message: '请先输入报文名'
        })
      } else {
        this.$refs.upload.submit()
      }
    },
    // 生成Java类
    handleExport() {
      const pubfldname = this.queryParams.pubfldname
      window.open(process.env.VUE_APP_BASE_API + '/generatePubJava?pubfldname=' + pubfldname)
    },
    // 行内编辑
    handleEdit(row) {
      var _this = this
      _this.rowId = row.fmtPubfldPk
      setTimeout(function() {
        _this.$refs['autoInput' + row.fmtPubfldPk].focus()
      }, 1)
    },
    handleCheck(row) {
      var _this = this
      updatePubfld(row).then(response => {
        this.msgSuccess('修改成功')
        this.handleQuery()
        _this.rowId = ''
      })
    },
    // 新增节点时鼠标离开新增报文名的事件
    pubfldnameLeave(pubfldname) {
      var _this = this
      if (pubfldname !== '') {
        isExistPub(pubfldname).then(response => {
          const data = response.data
          if (data) {
            this.form.srcFmtType = data
            _this.sftDisabled = true
          } else {
            setTimeout(function() {
              _this.sftDisabled = false
            }, 0.5)
          }
          _this.pubDisabled = true
        })
      }
    },
    // 打开调整父节点的弹窗
    handleEditPid(row) {
      if (row) {
        this.ids = []
        this.form = row
        this.ids.push(row.fmtPubfldPk)
      }
      this.getTreeselect()
      this.pidOpen = true
    },
    // 选择要粘贴的列
    handlePaste(scope) {
      this.pasteData = () => {
        const pasteData = []
        const tableTitles = ['节点名', '变量名', '长度', '数据类型', '是否默认值', '处理函数', '是否属性', '属性值', '备注', '排序']
        const prop = ['pathbuf', 'fldname', 'fldlen', 'fldtype', 'dealaftflag', 'funname', 'isattrflag', 'attrname', 'linememo', 'serino']
        tableTitles.forEach((tableTitle, index) => {
          if (this.pubfldListData[0].srcFmtType !== 150) {
            pasteData.push({
              label: tableTitle,
              key: prop[index],
              prop: prop[index],
              disabled: index === 0 || index === 6
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
      var row = scope.row
      // 获取当前数据的index
      this.pasteForm.rowIndex = this.pubfldListData.findIndex(function(item) {
        return item.fmtPubfldPk === row.fmtPubfldPk
      })
      this.pasteForm.currentRow = row
      this.pasteOpen = true
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
    // 粘贴弹窗确定
    submitPasteForm() {
      const pasteArr = this.pasteArr
      const selectProps = this.pasteForm.selectedProp
      const currentPubfldName = this.pasteForm.currentRow.pubfldname
      var currentPid = ''
      if (this.pasteForm.selectTier === 'currentTier') {
        currentPid = this.pasteForm.currentRow.parentId
      } else {
        currentPid = this.pasteForm.currentRow.fmtPubfldPk
      }
      newPasteData(currentPid, currentPubfldName, pasteArr, selectProps).then(response => {
        this.msgSuccess('添加成功')
        this.pasteOpen = false
        this.resetPasteForm()
        this.handleQuery()
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.fmtPubfldPk)
      this.multiple = !selection.length
    },
    // 粘贴覆盖
    handlePasteCover(scope) {
      var row = scope.row
      // 获取当前数据的index
      this.pasteForm.rowIndex = this.pubfldListData.findIndex(function(item) {
        return item.fmtPubfldPk === row.fmtPubfldPk
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
            if (this.pasteForm.coverSelectedProp) {
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
      addPasteData(this.pubfldListData).then(response => {
        this.msgSuccess('添加成功')
        this.pasteCoverOpen = false
        this.resetPasteForm()
        this.handleQuery()
      })
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
    // 点击一行展开
    openRow(row, column, event) {
      this.$refs.refTable.toggleRowExpansion(row)
    },
    // 打开导入Excel弹窗
    importExcel() {
      this.uploadVisible = true
      this.$nextTick(() => {
        this.$refs.uploadExcelRef.init()
      })
    }
  }
}
</script>
<style scoped="scoped">
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

.demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
