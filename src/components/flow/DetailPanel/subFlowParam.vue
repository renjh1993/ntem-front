<template>
  <!-- 添加或修改组件参数配置对话框 -->
  <el-dialog title="子流程组件参数" :visible.sync="open" width="800px" append-to-body>
    <el-form ref="form" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="修订历史" prop="revisionHisPk">
        <el-select style="width: 100%" v-model="form.revisionHisPk" placeholder="请选择修订历史版本">
          <el-option v-for="item in hisList" :key="item.revisionHisPk" :label="item.revisionNbr + '-' + item.markNm" :value="item.revisionHisPk"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="组件主键" prop="cmpPk">
        <el-input v-model="form.cmpPk" :disabled="true"/>
      </el-form-item>
      <el-form-item label="参数变量名" prop="paramVarName">
        <el-input v-model="form.paramVarName" placeholder="请输入参数变量名"/>
      </el-form-item>
      <el-form-item label="参数变量-英文" prop="paramVar">
        <el-select style="width: 100%" filterable v-model="form.paramVar" clearable>
          <el-option v-for="item in pubPropList" :key="item.propVar" :label="item.propVar" :value="item.propVar"></el-option>
        </el-select>
        <el-input v-model="form.paramVar" class="para-var" placeholder="请选择或输入参数变量"></el-input>
      </el-form-item>
      <el-form-item label="描述-中文" prop="sdesc">
        <el-input v-model="form.sdesc" placeholder="请输入描述-中文" />
      </el-form-item>
      <el-form-item label="参数类型代码" prop="paramTypeCd">
        <el-select style="width: 100%" v-model="form.paramTypeCd" @change="typeSelect(form.paramTypeCd)" placeholder="请选择参数类型代码">
          <el-option v-for="item in paraTypeDict" :key="item.dictValue" :label="item.dictLabel + '-' + item.dictValue" :value="item.dictValue"></el-option>
        </el-select>
      </el-form-item>
<!--      <el-form-item label="参数类型名称" prop="paramTypeNm">-->
<!--        <el-input disabled v-model="form.paramTypeNm" placeholder="请输入参数类型名称" />-->
<!--      </el-form-item>-->
      <el-form-item label="是否必输项" prop="isRequired">
        <el-radio-group v-model="form.isRequired">
          <el-radio :label="'1'">否</el-radio>
          <el-radio :label="'0'">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="展现控件类型" prop="showType">
        <el-select v-model="form.showType" placeholder="请选择展现控件类型">
          <el-option label="文本框-1" value="1" />
          <el-option label="下拉框-2" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="展现值范围" prop="showValue">
        <el-input v-model="form.showValue" placeholder="请输入展现值范围" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { listHis } from "@/api/configuration/his";
  import { addPramConfig } from "@/api/configuration/pramConfig";
  import { listCmpPubProp } from "@/api/configuration/cmpPubProp";
  import eventBus from '../../../utils/flow/eventBus'
  import item from '../ItemPanel/item'
  export default {
    name: 'SubFlowParam',
    // props: ['subCmpPk'],
    data() {
      return {
        // 表单参数
        form: {},
        hisList: [],
        open: false,
        // 代码类型字典
        paraTypeDict : [],
        // 公共属性表
        pubPropList: [],
        // 表单校验
        rules: {
          revisionHisPk: [
            { required: true, message: "修订历史不能为空", trigger: "blur" }
          ],
        }
      }
    },
    created() {
      this.init()
      this.getHisList()
      this.getDicts("parp_type_cd").then(response => {
        this.paraTypeDict = response.data;
      });
    },
    methods: {
      init() {
        eventBus.$on('getSubCmpPk', item => {
          this.form.cmpPk = item.target
        })
      },
      // 获取版本号列表
      getHisList() {
        listHis().then(response => {
          this.hisList = response.data.data
        })
      },
      // 获取公共属性
      getPubProp() {
        listCmpPubProp().then(response => {
          this.pubPropList = response.rows
        })
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          cmpParaPk: null,
          revisionHisPk: null,
          cmpPk: null,
          paramVar: null,
          paramVarName: null,
          sdesc: null,
          paramTypeCd: null,
          isRequired: '1',
          paramTypeNm: null,
          showType: '1',
          showValue: null,
          createTime: null,
          createBy: null,
          updateTime: null,
          updateBy: null
        };
        this.resetForm("form");
      },
      openDia() {
        this.reset()
        this.open = true
        // this.form.cmpPk = this.subCmpPk
      },
      // 类型代码跟随类型编号
      typeSelect(paramTypeCd) {
        if (paramTypeCd === '01') {
          this.form.paramTypeNm = '入参'
        } else if (paramTypeCd === '02') {
          this.form.paramTypeNm = '出参'
        } else if (paramTypeCd === '03') {
          this.form.paramTypeNm = '属性'
        }
      },
      submitForm() {
        addPramConfig(this.form).then(response => {
          this.msgSuccess("新增成功");
          this.open = false;
          // 调用父组件方法
          this.$parent.getSubCmpParams()
        });
      },
    }
  }
</script>

<style scoped>
  .el-form-item{
    position: relative;
  }
  .el-form-item .para-var.el-input {
    position: absolute;
    top: 1px;
    left: 1px;
    bottom: 1px;
    width: 525px;
  }
  .el-form-item .para-var>>>.el-input__inner {
    height: 34px;
    line-height: 34px;
    border: 0;
  }
</style>
