<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="主键id" prop="id">
                <el-input
                    v-model="queryParams.id"
                    placeholder="请输入主键id"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input
                    v-model="queryParams.name"
                    placeholder="请输入姓名"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="原因" prop="reason">
                <el-input
                    v-model="queryParams.reason"
                    placeholder="请输入原因"
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
                    type="primary"
                    icon="el-icon-plus"
                    size="mini"
                    @click="handleAdd"
                    v-hasPermi="['lctest:workflowTest:add']"
                >新增
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    :disabled="multiple"
                    @click="handleDelete"
                    v-hasPermi="['lctest:workflowTest:del']"
                >删除
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="success"
                    icon="el-icon-edit"
                    size="mini"
                    :disabled="single"
                    @click="handleUpdate"
                    v-hasPermi="['lctest:workflowTest:edit']"
                >修改
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="warning"
                    icon="el-icon-download"
                    size="mini"
                    @click="handleExport"
                    v-hasPermi="['lctest:workflowTest:export']"
                >导出
                </el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="tableList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"/>
            <!-- <el-table-column label="主键id" align="center" prop="id"/> -->
            <el-table-column label="姓名" align="center" prop="name"/>
            <el-table-column label="原因" align="center" prop="reason"/>
            <el-table-column label="天数" align="center" prop="days"/>
            <el-table-column label="钱数" align="center" prop="money"/>
            <el-table-column label="创建人" align="center" prop="crtuser"/>
            <el-table-column label="创建时间" align="center" prop="crtdate"/>
            <el-table-column label="更新人" align="center" prop="upduser"/>
            <el-table-column label="更新时间" align="center" prop="upddate"/>
            <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                    <div v-if="scope.row.status!=0">
                        {{statusFormat(scope.row)}}
                    </div>
                    <div v-else>
                        {{scope.row.taskName}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button v-if="'1'==scope.row.status || '3'==scope.row.status "
                       size="mini"
                       type="text"
                       icon="el-icon-edit"
                       @click="handleUpdate(scope.row)"
                    >修改
                    </el-button>
                    <el-button v-if="'1'==scope.row.status"
                       size="mini"
                       type="text"
                       icon="el-icon-edit"
                       @click="handleSub(scope.row)"
                    >提交
                    </el-button>
                    <el-button v-if="'1'==scope.row.status || '5'==scope.row.status || '4'==scope.row.status || '7'==scope.row.status"
                       size="mini"
                       type="text"
                       icon="el-icon-edit"
                       @click="handleDelete(scope.row)"
                    >删除
                    </el-button>
                    <el-button v-if="'7' == scope.row.status "
                       size="mini"
                       type="text"
                       icon="el-icon-edit"
                       @click="reSubmit(scope.row)"
                    >重新提交
                    </el-button>

                    <el-button v-if="'1' != scope.row.status "
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="historyFory(scope.row)"
                    >审批详情
                    </el-button>
                    <el-button v-if="'4'==scope.row.status"
                       size="mini"
                       type="text"
                       icon="el-icon-edit"
                       @click="handleEdit(scope.row)"
                    >提交修改
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
        <!-- 查看详细信息话框 -->
        <el-dialog :title="title" :visible.sync="openDetails" width="500px" append-to-body>
            <approvalDetail :processInstanceId="instanceId" v-if="openDetails"/>
            <div slot="footer" class="dialog-footer">
                <el-button @click="openDetails=!openDetails">关闭</el-button>
            </div>
        </el-dialog>

        <!-- 新增弹出框 -->
        <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" :isDrfat="isDraft" label-width="140px">
                <!-- <el-form-item label="主键id" prop="id">
                    <el-input v-model="form.id"/>
                </el-form-item> -->
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="form.name"/>
                </el-form-item>
                <el-form-item label="原因" prop="reason">
                    <el-input v-model="form.reason"/>
                </el-form-item>
                <el-form-item label="天数" prop="days">
                    <el-input v-model="form.days"/>
                </el-form-item>
                <el-form-item label="钱数" prop="money">
                    <el-input v-model="form.money"/>
                </el-form-item>
                <!-- <el-form-item label="创建人" prop="crtuser">
                    <el-input v-model="form.crtuser"/>
                </el-form-item>
                <el-form-item label="创建时间" prop="crtdate">
                    <el-input v-model="form.crtdate"/>
                </el-form-item>
                <el-form-item label="更新人" prop="upduser">
                    <el-input v-model="form.upduser"/>
                </el-form-item>
                <el-form-item label="更新时间" prop="upddate">
                    <el-input v-model="form.upddate"/>
                </el-form-item> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button v-if="true == isDraft" @click="asDraft">暂 存</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 更新弹出框 -->
        <el-dialog :title="title" :visible.sync="openUpdate" width="600px" append-to-body>
            <el-form ref="updateForm" :model="updateForm" :rules="rules" :isDrfat="isDraft" label-width="140px">
                <!-- <el-form-item label="主键id" prop="id">
                    <el-input v-model="updateForm.id"/>
                </el-form-item> -->
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="updateForm.name"/>
                </el-form-item>
                <el-form-item label="原因" prop="reason">
                    <el-input v-model="updateForm.reason"/>
                </el-form-item>
                <el-form-item label="天数" prop="days">
                    <el-input v-model="updateForm.days"/>
                </el-form-item>
                <el-form-item label="钱数" prop="money">
                    <el-input v-model="updateForm.money"/>
                </el-form-item>
                <!-- <el-form-item label="创建人" prop="crtuser">
                    <el-input v-model="updateForm.crtuser"/>
                </el-form-item>
                <el-form-item label="创建时间" prop="crtdate">
                    <el-input v-model="updateForm.crtdate"/>
                </el-form-item>
                <el-form-item label="更新人" prop="upduser">
                    <el-input v-model="updateForm.upduser"/>
                </el-form-item>
                <el-form-item label="更新时间" prop="upddate">
                    <el-input v-model="updateForm.upddate"/>
                </el-form-item> -->
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFormUpdate">确 定</el-button>
                <el-button @click="cancelUpdate">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 提交修改弹出框 -->
        <el-dialog :title="title" :visible.sync="openEdit" width="600px" append-to-body>
            <el-form ref="editForm" :model="editForm" :rules="rules" :isDrfat="isDraft" label-width="140px">
                <!-- <el-form-item label="主键id" prop="id">
                    <el-input v-model="editForm.id"/>
                </el-form-item> -->
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="editForm.name"/>
                </el-form-item>
                <el-form-item label="原因" prop="reason">
                    <el-input v-model="editForm.reason"/>
                </el-form-item>
                <el-form-item label="天数" prop="days">
                    <el-input v-model="editForm.days"/>
                </el-form-item>
                <el-form-item label="钱数" prop="money">
                    <el-input v-model="editForm.money"/>
                </el-form-item>
                <!-- <el-form-item label="创建人" prop="crtuser">
                    <el-input v-model="editForm.crtuser"/>
                </el-form-item>
                <el-form-item label="创建时间" prop="crtdate">
                    <el-input v-model="editForm.crtdate"/>
                </el-form-item>
                <el-form-item label="更新人" prop="upduser">
                    <el-input v-model="editForm.upduser"/>
                </el-form-item>
                <el-form-item label="更新时间" prop="upddate">
                    <el-input v-model="editForm.upddate"/>
                </el-form-item> -->
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFormEdit">确 定</el-button>
                <el-button @click="cancelEdit">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 重新提交弹出框 -->
        <el-dialog :title="title" :visible.sync="openRe" width="600px" append-to-body>
            <el-form ref="reForm" :model="reForm" :rules="rules" :isDrfat="isDraft" label-width="140px">
                <!-- <el-form-item label="主键id" prop="id">
                    <el-input v-model="reForm.id"/>
                </el-form-item> -->
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="reForm.name"/>
                </el-form-item>
                <el-form-item label="原因" prop="reason">
                    <el-input v-model="reForm.reason"/>
                </el-form-item>
                <el-form-item label="天数" prop="days">
                    <el-input v-model="reForm.days"/>
                </el-form-item>
                <el-form-item label="钱数" prop="money">
                    <el-input v-model="reForm.money"/>
                </el-form-item>
                <!-- <el-form-item label="创建人" prop="crtuser">
                    <el-input v-model="reForm.crtuser"/>
                </el-form-item>
                <el-form-item label="创建时间" prop="crtdate">
                    <el-input v-model="reForm.crtdate"/>
                </el-form-item>
                <el-form-item label="更新人" prop="upduser">
                    <el-input v-model="reForm.upduser"/>
                </el-form-item>
                <el-form-item label="更新时间" prop="upddate">
                    <el-input v-model="reForm.upddate"/>
                </el-form-item> -->
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFormRe">确 定</el-button>
                <el-button @click="cancelRe">取 消</el-button>
            </div>
        </el-dialog>

        <approvalForm ref="approvalForm" :businessKey = 'businessKey' :processInstanceId = 'instanceId'/>
    </div>
</template>

<script>
    import api from '@/api/workflow/workflowTest'
    import {getDefinitionsByInstanceId} from '@/api/activiti/definition'
    import approvalForm from "@/views/components/approvalForm";

    export default {
        name: 'WorkflowTest',
        components: {
            approvalForm
        },
        data() {
            return {
                modelVisible: false,
                modelerUrl: '',
                userName: '',
                createName:'',
                businessKey: '',
                instanceId: null,
                //是否显示暂存按钮
                isDraft: false,
                visible: false,
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
                // 表格数据
                tableList: [],
                // 弹出层标题
                title: '',
                // 是否显示弹出层
                open: false,
                openDetails: false,
                openUpdate: false,
                openRe: false,
                openEdit: false,
                // 状态字典
                statusOptions: [],
                // 查询参数
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    id: null,
                    name: null,
                    reason: null,
                    days: null,
                    money: null,
                    crtuser: null,
                    crtdate: null,
                    upduser: null,
                    upddate: null,
                    status: null
                },
                //表单参数
                form: {},
                //更新 表单参数
                updateForm: {},
                //提交修改 表单参数
                editForm: {},
                //重新提交 表单参数
                reForm: {},
                //表单校验 下拉框、日期框时trigger: 'change',值发生改变时校验，输入框trigger: 'blur',失去焦点时校验
                rules: {
                    id: [
                        {required: true, message: 'id不能为空', trigger: 'blur'}
                    ],
                }
            }
        },
        created() {
            this.getList()
            this.getDicts('activiti_flow_type').then(response => {
                this.statusOptions = response.data
            })
        },
        methods: {
            /** 查询列表 */
            getList() {
                this.loading = true
                api.query(this.queryParams).then(response => {
                    this.tableList = response.rows
                    this.total = response.total
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
                    id: null,
                    name: null,
                    reason: null,
                    days: null,
                    money: null,
                    crtuser: null,
                    crtdate: null,
                    upduser: null,
                    upddate: null,
                    status: null
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
                this.ids = selection.map(item => item.id)
                this.single = selection.length !== 1
                this.multiple = !selection.length
            },
            /** 新增按钮操作 */
            handleAdd() {
                this.createName = this.$store.getters.nickName
                if (this.$store.getters.name != "admin") {
                    this.reset()
                    this.isDraft = true
                    this.open = true
                    this.title = '添加'
                } else {
                    this.$alert('管理员不能创建流程', '管理员不能创建流程', {
                        confirmButtonText: '确定',
                    });
                }
            },
            /** 更新按钮操作 */
            handleUpdate(row) {
                let updateId = null
                if(row.id != null){
                    updateId = row.id
                }else{
                    updateId = this.ids[0];
                }
                this.reset()
                api.getOne({ id: updateId }).then(response => {
                    this.updateForm = response.data
                    this.openUpdate = true
                    this.title = '更新'
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
                console.log("this.instanceId ===> "+this.instanceId)
                console.log("this.businessKey ===> "+this.businessKey)
                this.$refs.approvalForm.visible = true
            },
            /** 进度查看 */
            checkTheSchedule(row) {
                getDefinitionsByInstanceId(row.instanceId).then(response => {
                    let data = response.data
                    this.modelerUrl = '/bpmnjs/index.html?type=lookBpmn&instanceId=' + row.instanceId + '&deploymentFileUUID=' + data.deploymentID + '&deploymentName=' + encodeURI(data.resourceName);
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
            /** 提交按钮 */
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
                this.form.title = this.createName + "的" + this.form.type + "申请";
            },
            /** 删除按钮操作 */
            handleDelete(row) {
                let ids = []
                if(row.id == null){
                    ids = this.ids
                }else{
                    ids = [row.id]
                }
                // const ids = row.id || this.ids
                this.$confirm('是否确认删除请假编号为"' + ids + '"的数据项?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    var param = {
                        'ids' : ids
                    };
                    return api.del(param)
                }).then(() => {
                    this.getList()
                    this.msgSuccess('删除成功')
                })
            },
            /** 导出按钮操作 */
            handleExport() {
                const queryParams = this.queryParams
                this.$confirm('是否确认导出所有请假数据项?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    return api.exportExcel(queryParams)
                }).then(response => {
                    this.download(response.message)
                })
            },
        }
    }
</script>
