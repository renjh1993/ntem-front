<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="ID" prop="id">
                <el-input
                    v-model="queryParams.id"
                    placeholder="请输入ID"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="配资申请表" prop="pzsqb">
                <el-input
                    v-model="queryParams.pzsqb"
                    placeholder="请输入配资申请表"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="转贷申请表" prop="zdsqb">
                <el-input
                    v-model="queryParams.zdsqb"
                    placeholder="请输入转贷申请表"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
                    <el-option
                        v-for="dict in statusOptions"
                        :key="dict.dictValue"
                        :label="dict.dictLabel"
                        :value="dict.dictValue"
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
                    type="warning"
                    icon="el-icon-download"
                    size="mini"
                    @click="handleExport"
                    v-hasPermi="['zdlc:workflowZdlc:export']"
                >导出
                </el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="tableList" >
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="ID" align="center" prop="id"/>
            <el-table-column label="配资申请表" align="center" prop="pzsqb"/>
            <el-table-column label="转贷申请表" align="center" prop="zdsqb"/>
            <el-table-column label="基础资料扫描原件" align="center" prop="jczlsmyj"/>
            <el-table-column label="借款人背景资料" align="center" prop="jkrbjzl"/>
            <el-table-column label="其他资料" align="center" prop="qtzl"/>
            <el-table-column label="创建人" align="center" prop="crtuser"/>
            <el-table-column label="创建时间" align="center" prop="crtdate"/>
            <el-table-column label="更新人" align="center" prop="upduser"/>
            <el-table-column label="更新时间" align="center" prop="upddate"/>

            <el-table-column label="状态" align="center" prop="state" :formatter="stateFormat"/>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="historyFory(scope.row)"
                    >审批详情
                    </el-button>
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

        <approvalForm ref="approvalForm" :businessKey = 'businessKey' :processInstanceId = 'instanceId'/>
    </div>
</template>

<script>
    import api from '@/api/workflow/workflowZdlc'
    import approvalForm from "@/views/components/approvalForm";

    export default {
        name: 'WorkflowZdlcAll',
        components:{
            approvalForm
        },
        data() {
            return {
                businessKey:'',
                //用户信息
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
                // 请假表格数据
                tableList: [],
                // 弹出层标题
                title: '',
                // 是否显示弹出层
                open: false,
                // 状态字典
                stateOptions: [],
                // 查询参数
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    id: null,
                    pzsqb: null,
                    zdsqb: null,
                    jczlsmyj: null,
                    jkrbjzl: null,
                    qtzl: null,
                    crtuser: null,
                    crtdate: null,
                    upduser: null,
                    upddate: null,
                    status: null
                },
            }
        },
        created() {
            this.getList()
            this.getDicts('activiti_flow_type').then(response => {
                this.stateOptions = response.data
            })
        },
        methods: {
            /** 查询请假列表 */
            getList() {
                this.loading = true
                api.query(this.queryParams).then(response => {
                    this.tableList = response.rows
                    this.total = response.total
                    this.loading = false
                })
            },
            // 状态字典翻译
            stateFormat(row, column) {
                return this.selectDictLabel(this.stateOptions, row.state)
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
            /** 审批详情 */
            historyFory(row) {
                this.instanceId = row.instanceId
                this.businessKey = row.id
                console.log(this.instanceId)
                this.$refs.approvalForm.visible = true
            },
            /** 导出按钮操作 */
            handleExport() {
                const queryParams = this.queryParams
                this.$confirm('是否确认导出所有请假数据项?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function() {
                    return api.exportExcel(queryParams)
                }).then(response => {
                    this.download(response.message)
                })
            },
        }
    }
</script>
