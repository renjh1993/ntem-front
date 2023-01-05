<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="姓名" prop="name">
                <el-input
                    v-model="queryParams.name"
                    placeholder="请输入姓名"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
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
                    v-hasPermi="['emuser:tEmUser:add']"
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
                    v-hasPermi="['emuser:tEmUser:del']"
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
                    v-hasPermi="['emuser:tEmUser:edit']"
                >修改
                </el-button>
            </el-col>

            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table  :data="tableList" @selection-change="handleSelectionChange">

            <el-table-column label="姓名" align="center" prop="name"/>
       
       
            <el-table-column label="身份证号" align="center" prop="idcard"/>
            <el-table-column label="性别 （0：女  1：男）" align="center" prop="gender"/>
            <el-table-column label="手机号" align="center" prop="tel"/>
            <el-table-column label="最高学历毕业院校" align="center" prop="zgbyyx"/>
            <el-table-column label="最高学历专业" align="center" prop="zgxlzy"/>
            <el-table-column label="最高学历" align="center" prop="zgxl"/>
            <el-table-column label="证书编号" align="center" prop="zsbh"/>
            <el-table-column label="技能" align="center" prop="skills"/>
            <el-table-column label="入职日期" align="center" prop="entrydate"/>
            <el-table-column label="最高学历毕业日期" align="center" prop="zgxlbyrq"/>
            <el-table-column label="离职日期" align="center" prop="godate"/>
            <el-table-column label="base地" align="center" prop="basearea"/>
            <el-table-column label="状态（0：离职 1：在职）" align="center" prop="status"/>
            <el-table-column label="创建者" align="center" prop="crtuser"/>
            <el-table-column label="创建日期" align="center" prop="crtdate"/>
            <el-table-column label="修改者" align="center" prop="upduser"/>
            <el-table-column label="修改日期" align="center" prop="upddate"/>
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
    </div>
</template>

<script>
export default {

}
</script>

<style>

</style>