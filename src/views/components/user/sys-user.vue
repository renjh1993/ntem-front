<template>
  <el-dialog v-if="visible" title="用户" :visible.sync="visible" width="60%" append-to-body :close-on-click-modal="false">
    <div class="app-container">
      <el-row :gutter="20">
        <!--部门数据-->
        <el-col :span="4" :xs="24">
          <div class="head-container">
            <el-input
              v-model="deptName"
              placeholder="请输入部门名称"
              clearable
              size="mini"
              prefix-icon="el-icon-search"
              style="margin-bottom: 20px"
            />
          </div>
          <div class="head-container">
            <el-tree
              ref="tree"
              :data="deptOptions"
              :props="defaultProps"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              default-expand-all
              @node-click="handleNodeClick"
            />
          </div>
        </el-col>
        <!--用户数据-->
        <el-col :span="20" :xs="24">
          <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" size="mini" label-width="68px">
            <el-form-item label="用户名称" prop="userName">
              <el-input
                v-model="queryParams.userName"
                placeholder="请输入用户名称"
                clearable
                style="width: 240px"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input
                v-model="queryParams.phonenumber"
                placeholder="请输入手机号码"
                clearable
                style="width: 240px"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>

          <el-row :gutter="10" class="mb8">
            <right-toolbar :show-search.sync="showSearch" :columns="columns" @queryTable="getList" />
          </el-row>

          <el-table ref="multipleTable" v-loading="loading" :data="userList" :row-key="getRowKey" @selection-change="handleSelectionChange">
            <el-table-column type="selection" :reserve-selection="true" width="50" align="center" />
            <el-table-column v-if="columns[0].visible" key="userId" label="用户编号" align="center" prop="userId" />
            <el-table-column v-if="columns[1].visible" key="userName" label="用户名称" align="center" prop="userName" :show-overflow-tooltip="true" />
            <el-table-column v-if="columns[2].visible" key="nickName" label="用户昵称" align="center" prop="nickName" :show-overflow-tooltip="true" />
            <el-table-column v-if="columns[3].visible" key="deptName" label="部门" align="center" prop="dept.deptName" :show-overflow-tooltip="true" />
            <el-table-column v-if="columns[4].visible" key="phonenumber" label="手机号码" align="center" prop="phonenumber" width="120" />
            <el-table-column v-if="columns[5].visible" label="创建时间" align="center" prop="createTime" width="160">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
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
        </el-col>
      </el-row>
    </div>
    <!-- 选中的用户 -->
    <div>
      <el-tag
        v-for="user in chooseUserList"
        :key="user.userId"
        style="margin:2px"
        closable
        @close="handleCloseTag(user)"
      >{{ user.userName }} </el-tag>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="confirmUser">确认</el-button>
      <el-button size="small" @click="visible=false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getWorkflowUserListByPage } from '@/api/workflow/workflowUser'
import { treeselect } from '@/api/system/dept'

export default {
  name: 'User',
  props: {
    // 是否多选
    multiple: {
      type: Boolean,
      default: true
    },
    // 回显的数据
    propUserList: {
      type: Array,
      default: () => []
    }
  },
  dicts: ['sys_user_sex'],
  data() {
    return {
      // 遮罩层
      loading: true,
      visible: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: [],
      // 部门树选项
      deptOptions: [],
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        deptId: undefined,
        type: 'person',
        ids: []
      },
      // 列信息
      columns: [
        { key: 0, label: `用户编号`, visible: true },
        { key: 1, label: `用户名称`, visible: true },
        { key: 2, label: `用户昵称`, visible: true },
        { key: 3, label: `部门`, visible: true },
        { key: 4, label: `手机号码`, visible: true },
        { key: 5, label: `创建时间`, visible: true }
      ],
      getRowKey(row) {
        return row.userId
      },
      // 保存选择的用户
      chooseUserList: [],
      flag: false
    }
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val)
    },
    propUserList(val) {
      if (val.length > 0) {
        this.queryParams.ids = val
        this.getList()
        this.flag = true
      } else {
        this.chooseUserList = []
      }
    }
  },
  created() {
    this.getList()
    this.getTreeselect()
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true
      getWorkflowUserListByPage(this.queryParams).then(response => {
        const res = response.data.page
        // response.rows
        this.userList = res.rows
        // res;
        this.total = res.total
        // response.total;
        // 反选
        if (this.flag && response.data.list) {
          this.chooseUserList = response.data.list
          response.data.list.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row, true)
          })
        }
        this.loading = false
      })
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data
      })
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id
      this.getList()
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.flag = false
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.deptId = ''
      this.queryParams.phonenumber = ''
      this.queryParams.userName = ''
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(val) {
      if (this.multiple === true) {
        this.chooseUserList = val
      } else {
        this.chooseUserList = val
        if (val.length > 1) {
          const delRow = val.shift()
          this.$refs.multipleTable.toggleRowSelection(delRow, false)
        }
        if (val.length === 0) {
          this.chooseUserList = null
        }
      }
    },
    // 删除tag
    handleCloseTag(user) {
      this.chooseUserList.splice(this.chooseUserList.indexOf(user), 1)
      this.$refs.multipleTable.toggleRowSelection(user, false)
      this.userList.forEach((row, index) => {
        if (user.userId === row.userId) {
          this.$refs.multipleTable.toggleRowSelection(this.userList[index], false)
        }
      })
    },
    // 确认
    confirmUser() {
      if (this.chooseUserList.length > 0) {
        this.$emit('confirmUser', this.chooseUserList)
      } else {
        this.$message.warning('请选择人员！')
      }
    }
  }
}
</script>
