<template>
    <div>
        <div>
            <h2>{{ this.processInstName }}</h2>
            <div style="margin-right:300px;margin-top: 10px;">
                <el-upload disabled=true :file-list="fileList1" action='' :on-preview="handlePreview"
                    :with-credentials="true">
                    <el-tag style="margin-right:200px">借款企业情况</el-tag>
                </el-upload>
            </div>
            <div style="margin-right:300px;margin-top: 10px;">
                <el-upload disabled="true" :on-preview="handlePreview" :file-list="fileList2" action=''
                    :auto-upload="false">
                    <el-tag style="margin-right:200px">转贷申请表</el-tag>
                </el-upload>
            </div>
            <div style="margin-right:300px;margin-top: 10px;">
                <el-upload disabled="true" :file-list="fileList3" action='' :on-preview="handlePreview"
                    :with-credentials="true" :auto-upload="false">
                    <el-tag style="margin-right:200px">基础资料扫描原件</el-tag>
                </el-upload>
            </div>
            <div style="margin-right:300px;margin-top: 10px;">
                <el-upload disabled="true" :file-list="fileList4" action='' :on-preview="handlePreview"
                    :with-credentials="true" :auto-upload="false">
                    <el-tag style="margin-right:200px">传借款人背景资料</el-tag>

                </el-upload>
            </div>
            <div style="margin-right:300px;margin-top: 10px;">
                <el-upload disabled="true" :file-list="fileList5" action='' :on-preview="handlePreview"
                    :with-credentials="true" :auto-upload="false">
                    <el-tag style="margin-right:200px">其他资料</el-tag>
                </el-upload>
            </div>
            <div v-if="this.fileList6.length > 0" style="margin-right:300px;margin-top: 10px;">
                <el-upload disabled="true" :file-list="fileList6" action='' :on-preview="handlePreview"
                    :with-credentials="true" :auto-upload="false">
                    <el-tag style="margin-right:200px">《银行承诺函》</el-tag>

                </el-upload>
            </div>
            <div v-if="this.fileList7.length > 0" style="margin-right:300px;margin-top: 10px;">
                <el-upload disabled="true" :file-list="fileList7" action='' :on-preview="handlePreview"
                    :with-credentials="true" :auto-upload="false">
                    <el-tag style="margin-right:200px">尽调报告</el-tag>
                </el-upload>
            </div>
        </div>
        <el-form ref="form" :model="form" :rules="rules" label-width="140px">
            <el-form-item v-if="this.$store.getters.roles.indexOf('SX-JBG') != -1 && this.showUpload && isApproval"
                label="银行承诺函(提交省级平台前上传)" prop="fileList8">
                <el-upload :file-list="fileList8" accept=".pdf" :before-upload="beforeUpload"
                    :on-remove="(file, fileList) => { handleRemove(file, fileList, 8) }" action=''
                    :on-change="(file, fileList) => { handleChange(file, fileList, 8) }" multiple
                    :on-preview="handlePreview1" :with-credentials="true" :on-exceed="handleExceed"
                    :auto-upload="false">
                    <el-button style="margin-right:10px;margin-top: 10px;" slot="trigger" size="mini" type="primary">
                        点击选择文件</el-button>
                    <el-button style="margin-right:40px;margin-top: 10px;" size="mini" type="success"
                        @click="submitUpload(8)">确定上传</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item v-if="this.$store.getters.roles.indexOf('SX-FXGLG') != -1 && this.showUpload && isApproval"
                label="尽调报告(由风险管理岗上传)" prop="fileList9">
                <span>
                    <el-upload :file-list="fileList9" accept=".pdf" :before-upload="beforeUpload"
                        :on-remove="(file, fileList) => { handleRemove(file, fileList, 9) }" action=''
                        :on-change="(file, fileList) => { handleChange(file, fileList, 9) }" multiple
                        :on-preview="handlePreview1" :with-credentials="true" :on-exceed="handleExceed"
                        :auto-upload="false">
                        <el-button style="margin-right:10px;margin-top: 10px;" slot="trigger" size="mini"
                            type="primary">点击选择文件</el-button>
                        <el-button style="margin-right:40px;margin-top: 10px;" size="mini" type="success"
                            @click="submitUpload(9)">确定上传</el-button>
                    </el-upload>
                </span>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button v-if="this.$store.getters.roles.indexOf('SX-JBG') != -1 && isApproval" :loading="buttonLoading"
                size="mini" type="primary" @click="submitForm">提交省级平台
            </el-button>
            <el-button v-if="this.$store.getters.roles.indexOf('SX-JBG') == -1 && isApproval" :loading="buttonLoading"
                size="mini" type="primary" @click="submitForm">审批
            </el-button>
            <el-button v-if="isApproval" @click="cancel">取 消</el-button>
        </div>
        <verify ref="verifyRef" :taskId="taskId" :businessKey='businessKey' @callSubmit="callSubmit"
            :taskVariables="taskVariables"></verify>
    </div>
</template>

<script>
import api from '@/api/workflow/workflowZdlc';
import processAip from "@/api/workflow/processInst";
import verify from "@/components/Process/Verify";
import { boolean } from "yargs";
export default {
    name: "WorkflowZdlcForm",
    props: {
        businessKey: String, // 业务唯一标识
        taskId: String, // 业务唯一标识
        isApproval: boolean //是否显示审批按钮
    },
    components: {
        verify
    },
    data() {
        var validate1 = (rule, value, callback) => {
            if (this.valid1) {
                callback();
            } else {
                callback(new Error('附件不能为空'));
            }
        };
        var validate2 = (rule, value, callback) => {
            if (this.valid2) {
                callback();
            } else {
                callback(new Error('附件不能为空'));
            }
        };
        return {
            fileList1: [],
            fileList2: [],
            fileList3: [],
            fileList4: [],
            fileList5: [],
            fileList6: [],
            fileList7: [],
            fileList8: [],
            fileList9: [],
            valid1: false,
            valid2: false,
            showUpload: true,//是否显示上传文件组件
            // 按钮loading
            buttonLoading: false,
            // 遮罩层
            loading: true,
            // 业务表格数据
            tableList: [],
            // 表单参数
            form: {},
            //流程实例名称
            processInstName: null,
            // 表单校验
            rules: {
                fileList8: [
                    { required: true, validator: validate1, message: '附件不能为空' }
                ],
                fileList9: [
                    { required: true, validator: validate2, message: '附件不能为空' }
                ],
            },
            taskVariables: null
        };
    },
    watch: {
        businessKey: {
            immediate: true, // 很重要
            handler(newVal) {
                if (newVal) {
                    this.getById()
                }
            }
        }
    },
    methods: {
        handlePreview(file) {
            console.log(file.url)
            if (file.url != null) {
                console.log("下载文件开始")
                window.open(this.$imgbaseurl + file.url)
            }
        },
        handlePreview1(file) {
            console.log(file.raw)
            window.open(URL.createObjectURL(file.raw))
        },
        beforeUpload(file, fileList, index) {
            console.log(fileList, index)
            const isPDF = file.name.substring(file.name.lastIndexOf("."), file.name.length) === ('.pdf' || '.PDF');
            //const isLt2M = file.size / 1024 / 1024 < 2;
            console.log(file.name.substring(file.name.lastIndexOf("."), file.name.length))
            if (!isPDF) {
                this.$message.error('上传附件只能是 PDF 格式!');
                fileList.pop()
            }
            // if (!isLt2M) {
            //   this.$message.error('上传头像图片大小不能超过 2MB!');
            // }
            return isPDF;
        },
        handleRemove(file, fileList, index) {
            console.log(index)
            if (index == 8) {
                this.fileList8 = fileList
                this.valid1 = (this.fileList8.length > 0)
            } else {
                this.fileList9 = fileList
                this.valid2 = (this.fileList9.length > 0)
            }
        },
        // 表单重置
        reset() {

            this.fileList1 = []
            this.fileList2 = []
            this.fileList3 = []
            this.fileList4 = []
            this.fileList5 = []
            this.fileList6 = []
            this.fileList7 = []
        },
        handleChange(file, fileList, index) {
            var isPDF = this.beforeUpload(file, fileList, index)
            console.log('路径====' + URL.createObjectURL(file.raw))
            if (isPDF) {
                if (index == 8) {
                    this.fileList8 = fileList
                    if (this.fileList8.length > 0) {
                        this.valid1 = true
                    }
                } else {
                    this.fileList9 = fileList
                    if (this.fileList9.length > 0) {
                        this.valid2 = true
                    }
                }
            } else {
                return;
            }
            console.log(fileList)
        },
        // 取消按钮
        cancel() {
            this.$emit("closeForm")
        },
        callSubmit() {
            this.$emit("closeForm")
        },
        async getById() {
            this.reset()
            const { data } = await api.getOne({ id: this.businessKey })
            if (!!data.jkqyqk) {
                this.fileList(this.fileList1, data.jkqyqk.split(","))
            }
            if (!!data.zdsqb) {
                this.fileList(this.fileList2, data.zdsqb.split(","))
            }
            if (!!data.jczlsmyj) {
                this.fileList(this.fileList3, data.jczlsmyj.split(","))
            }
            if (!!data.jkrbjzl) {
                this.fileList(this.fileList4, data.jkrbjzl.split(","))
            }
            if (!!data.qtzl) {
                this.fileList(this.fileList5, data.qtzl.split(","))
            }
            if (!!data.yhcnh) {
                this.fileList(this.fileList6, data.yhcnh.split(","))
            }
            if (!!data.jdbg) {
                this.fileList(this.fileList7, data.jdbg.split(","))
            }
            processAip.getProcessInstByBusinessKey(this.businessKey).then(response => {
                this.processInstName = data.name;
            })
        },
        /** 回显文件列表 */
        fileList(fileList, filePaths) {
            for (let i = 0; i < filePaths.length; i++) {
                fileList.push({
                    name: filePaths[i].split('/')[filePaths[i].split('/').length - 1],
                    url: filePaths[i]
                })
            }
        },
        /** 提交按钮 */
        submitForm() {
            if (this.$store.getters.roles.indexOf('SX-JBG') != -1
                || this.$store.getters.roles.indexOf('SX-FXGLG') != -1) {
                if ( (this.$store.getters.roles.indexOf('SX-JBG') != -1 && this.fileList6.length > 0)
                    || (this.$store.getters.roles.indexOf('SX-FXGLG') != -1 && this.fileList7.length > 0)) {
                    console.log(this.businessKey)
                    api.getOne({ id: this.businessKey }).then(response => {
                        this.taskVariables = {
                            entity: data,
                        };
                    });
                    this.$refs.verifyRef.visible = true
                }
                else {
                    this.$message.error('请上传附件!');
                    return
                }
            } else {
                api.getOne({ id: this.businessKey }).then(response => {
                    this.taskVariables = {
                        entity: data,
                    };
                });
                this.$refs.verifyRef.visible = true
            }
        },
        reset() {
            this.fileList1 = []
            this.fileList2 = []
            this.fileList3 = []
            this.fileList4 = []
            this.fileList5 = []
            this.fileList6 = []
            this.fileList7 = []
        },
        //上传文件按钮
        submitUpload(index) {
            if (index == 8) {
                if (!this.valid1) {
                    this.$message.error('上传文件列表不能为空!');
                    return
                }
            }
            if (index == 9) {
                if (!this.valid2) {
                    this.$message.error('上传文件列表不能为空!');
                    return
                }
            }


            var formData = new FormData() //  用FormData存放上传文件

            this.fileList8.forEach(file => {
                console.log('我是yhcnh', file)
                // 此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上
                formData.append('yhcnh', file.raw, file.raw.name)

            })
            this.fileList9.forEach(file => {
                console.log('我是jdbg', file)
                // 此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上
                formData.append('jdbg', file.raw, file.raw.name)

            })
            formData.append('id', this.businessKey)
            api.update(formData).then(response => {
                this.msgSuccess('上传成功')
                this.showUpload = false
                this.reset()
                this.getById()


            })

        },

    }
};
</script>
<style >
.el-upload-list__item-name {
    color: #606266;
    /* display: block; */
    margin-right: 40px;
    overflow: visible;
    padding-left: 4px;
    text-overflow: ellipsis;
    -webkit-transition: color .3s;
    transition: color .3s;
    white-space: nowrap;
}


.el-upload-list__item .el-icon-upload-success {
    display: none;
}
</style>
