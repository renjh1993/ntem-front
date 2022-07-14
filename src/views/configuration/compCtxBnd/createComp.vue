<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        <el-steps :active="currentTab" align-center finish-status="success">
          <el-step title="系统" />
          <el-step title="场景" />
          <el-step title="协议地址" />
          <!--<el-step title="规格设置" />-->
        </el-steps>
      </div>
      <el-form ref="formValidate" :model="formValidate">
        <el-row v-show="currentTab === 0" :gutter="24">
          <el-table :data="compList"  @row-click="clickComp" highlight-current-row>
            <el-table-column label="系统ID" align="center" prop="compId" />
            <el-table-column label="系统名称" align="center" prop="nameCn" />
            <el-table-column label="系统缩写" align="center" prop="nameEn" />
            <el-table-column label="描述" align="center" prop="sdesc" />
            <el-table-column label="系统类型" align="center" prop="compType" >
              <template scope="scope">
                {{ scope.row.compTypeCd + "-" + scope.row.compTypeNm }}
              </template>
            </el-table-column>
            <el-table-column label="版本号" align="center" prop="revisionHisPk" />
          </el-table>
          <pagination
            v-show="total0>0"
            :total="total0"
            :page.sync="queryParams0.pageNum"
            :limit.sync="queryParams0.pageSize"
            @pagination="getCompList"
          />
        </el-row>
        <el-row v-show="currentTab === 1">
          <el-table :data="ctxList" @row-click="clickCtx" highlight-current-row>
            <el-table-column label="场景ID" align="center" prop="svcCtxId" />
            <el-table-column label="场景字段" align="center" prop="elmPath" />
            <el-table-column label="版本号" align="center" prop="revisionHisPk" />
            <el-table-column label="场景描述" prop="sdesc" />
            <el-table-column label="场景类型" align="center" prop="svcCtxType">
              <template scope="scope">
                {{ scope.row.svcCtxTypeCd + "-" + scope.row.svcCtxTypeNm }}
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total1>0"
            :total="total1"
            :page.sync="queryParams1.pageNum"
            :limit.sync="queryParams1.pageSize"
            @pagination="getCtxList"
          />
        </el-row>
        <el-row v-show="currentTab === 2">
          <el-table :data="bndList" @row-click="clickBnd" highlight-current-row>
            <el-table-column label="主键" align="center" prop="bndAttrPk" />
            <el-table-column label="修订历史" align="center" prop="revisionHisPk" />
            <el-table-column label="协议类型" align="center" prop="profileType" />
            <el-table-column label="主机地址" align="center" prop="host" />
            <el-table-column label="端口号" align="center" prop="port" />
            <el-table-column label="url" align="center" prop="url" />
            <el-table-column label="请求体" align="center" prop="requestbody" />
            <el-table-column label="http请求类型" align="center" prop="httpMethod" />
            <el-table-column label="http url参数" align="center" prop="httpUrlVariables" />
            <el-table-column label="http头数据" align="center" prop="httpHeaders" />
            <el-table-column label="是否需要代理" align="center" prop="httpNeedProxy" />
            <el-table-column label="代理IP" align="center" prop="httpProxyIp" />
            <el-table-column label="代理端口" align="center" prop="httpProxyPort" />
            <el-table-column label="tcp编码器类" align="center" prop="tcpEncoder" />
            <el-table-column label="tcp解码器类" align="center" prop="tcpDecoder" />
            <el-table-column label="超时时间" align="center" prop="timeOut" />
            <el-table-column label="描述" align="center" prop="sdesc" />
          </el-table>
          <pagination
            v-show="total2>0"
            :total="total2"
            :page.sync="queryParams2.pageNum"
            :limit.sync="queryParams2.pageSize"
            @pagination="getBndList"
          />
        </el-row>
        <el-form-item>
          <el-button v-show="currentTab > 0" type="primary" class="submission" @click="handleSubmitUp">上一步</el-button>
          <el-button v-show="currentTab < 2" type="primary" class="submission" @click="handleSubmitNest()">下一步</el-button>
          <el-button v-show="currentTab === 2" type="primary" class="submission" @click="handleSubmit('formValidate')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { listComp } from "@/api/configuration/comp";
import { listCtx } from "@/api/configuration/ctx";
import { listAttr } from "@/api/configuration/attr"
import { addCompCtxBnd } from "@/api/configuration/compCtxBnd";

export default {
  name: 'CreateComp',
  data() {
    return {
      // 遮罩层
      loading: true,
      currentTab: 0,
      formValidate: {},
      // 系统数据
      compList: [],
      // 场景数据
      ctxList: [],
      // 协议地址参数
      bndList: [],
      // 总条数
      total0: 0,
      total1: 0,
      total2: 0,
      // 是否选中系统参数
      isSelectedComp: false,
      // 是否选中场景
      isSelectedCtx: false,
      // 是否选中协议
      isSelectedBnd: false,
      // 查询参数
      queryParams0: {
        pageNum: 1,
        pageSize: 10
      },
      queryParams1: {
        pageNum: 1,
        pageSize: 10
      },
      queryParams2: {
        pageNum: 1,
        pageSize: 10
      },
      // 新增提供方组件对象
      compCtxBnd: {
        revisionHisPk: null,
        compId: null,
        compDesc: null,
        svcCtxId: null,
        bndAttrPk: null,
        intfSeq: null,
        optSeq: null,
        ctxDesc: null,
        respcdeXpath: null,
        respmsgXpath: null,
        custMsgType: null,
        srvrMsgType: null
      }
    }
  },
  created() {
    this.getCompList()
    this.getCtxList()
    this.getBndList()
  },
  filters: {
    transIsProxy: function(value) {
      if (value === 0) {
        return '否'
      } else if (value === 1) {
        return '是'
      }
    }
  },
  methods: {
    handleSubmitUp(){
      // this.currentTab --
      if (this.currentTab-- <0) this.currentTab = 0;
    },
    handleSubmitNest(){
      if (this.currentTab === 0){
        if (this.isSelectedComp) {
          this.currentTab += 1
        } else {
          this.$alert('请先选择系统', '提示', {
            confirmButtonText: '确定',
            type: 'warning',
            callback: action => {
              this.$message({
                type: 'warning',
                message: `还未选择系统`
              });
            }
          });
        }
      } else if (this.currentTab === 1) {
        if (this.isSelectedCtx) {
          this.currentTab += 1
        } else {
          this.$alert('请先选择场景', '提示', {
            confirmButtonText: '确定',
            type: 'warning',
            callback: action => {
              this.$message({
                type: 'warning',
                message: `还未选择场景`
              });
            }
          });
        }
      }
    },
    // 提交
    handleSubmit () {
      if (this.isSelectedBnd) {
        addCompCtxBnd(this.compCtxBnd).then(response => {
          if (response.data === 'success') {
            this.msgSuccess("新增成功");
          } else {
            this.msgError(response.data)
          }
        })
        if (this.currentTab === 2) {this.currentTab = 0}
        // 关闭当前页面
        this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1)
        this.$router.push(this.$store.state.tagsView.visitedViews[this.$store.state.tagsView.visitedViews.length-1].path)
      } else {
        this.$alert('请先选择协议', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
          callback: action => {
            this.$message({
              type: 'warning',
              message: `还未选择协议`
            });
          }
        });
      }
    },
    getCompList() {
      this.loading = true;
      listComp(this.queryParams0).then(response => {
        this.compList = response.data.data;
        this.total0 = response.data.total;
        this.loading = false;
      });
    },
    getCtxList() {
      this.loading = true;
      listCtx(this.queryParams1).then(response => {
        this.ctxList = response.data.data;
        this.total1 = response.data.total;
        this.loading = false;
      });
    },
    getBndList() {
      this.loading = true;
      listAttr(this.queryParams2).then(response => {
        this.bndList = response.data.data;
        this.total2 = response.data.total;
        this.loading = false;
      });
    },
    // 选中系统
    clickComp(row, event, column) {
      this.compCtxBnd.intfSeq = row.compId
      this.compCtxBnd.optSeq = row.compId
      this.compCtxBnd.compId = row.compId
      this.compCtxBnd.compDesc = row.sdesc
      this.compCtxBnd.revisionHisPk = row.revisionHisPk
      this.isSelectedComp = true
    },
    // 选中场景
    clickCtx(row, event, column) {
      this.compCtxBnd.svcCtxId = row.svcCtxId
      this.compCtxBnd.ctxDesc = row.svcCtxTypeCd
      this.isSelectedCtx = true
    },
    // 选中协议
    clickBnd(row, event, column) {
      console.log(row)
      this.compCtxBnd.bndAttrPk = row.bndAttrPk
      this.isSelectedBnd = true
      console.log(this.compCtxBnd)
    }
  }
}
</script>

<style scoped>

</style>
