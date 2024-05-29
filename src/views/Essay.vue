<script setup>
import { ref } from 'vue'

//文章分类数据模型
const categorys = ref('')

//用户搜索时选中的分类id
const categoryId=ref('')

//用户搜索时选中的发布状态
const state=ref('')

//文章列表数据模型
const articles = ref('')

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(10)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    getArticles()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    getArticles()
}

import { CategoryListService } from '@/api/Category.js'
const getArticleCategoryList = async () => {
    //获取所有分类
    let resultC = await CategoryListService();
    categorys.value = resultC.data
}
//文章列表查询
import { EssayList } from '@/api/Essay.js'
const getArticles = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        category_id: categoryId.value ? categoryId.value : null,
        state: state.value ? state.value : null
    }
    let result = await EssayList(params);
    articles.value = result.data.data
    for(let i=0;i<articles.value.length;i++){
        let article = articles.value[i];
        for(let j=0;j<categorys.value.length;j++){
            if(articles.value[i].category_id==categorys.value[j].id){
                article.categoryName=categorys.value[j].name
            }
        }
    }
    total.value=result.data.total
}
getArticleCategoryList();
getArticles()
//控制抽屉是否显示
const visibleDrawer = ref(false)
const visibleUpdate = ref(false)
//添加表单数据模型
const articleModel = ref({
    name: '',
    text:'',
    message:'',
    category_id: '',
    photo: '',
    state:''
})
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { useTokenStore } from '@/stores/token.js';
const tokenStore = useTokenStore()
const uploadSuccess=(result)=>{
    articleModel.value.photo=result.data
}
import {EssayAdd} from '@/api/Essay.js'
import { ElMessage } from 'element-plus';
const addEssay=async(stateNow)=>{
    articleModel.value.state=stateNow
    console.log(articleModel)
    let result =EssayAdd(articleModel)
    ElMessage.success(result.value?result.value:"成功添加文章")
    visibleDrawer.value=false
    getArticles()
}
import {EssayUpdate} from '@/api/Essay.js'
const updataEssay=async(stateNow)=>{
    articleModel.value.state=stateNow
    let result =EssayUpdate(articleModel)
    ElMessage.success(result.value?result.value:"成功修改文章")
    visibleUpdate.value=false
    getArticles()
}
import {EssayDelete} from '@/api/Essay.js'
import {ElMessageBox} from 'element-plus'
const deleteEssay= (row)=>{
    ElMessageBox.confirm(
        '你确认删除该文章吗？',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
    .then(async() => {
        //用户点击了确认
        let result = await EssayDelete(row.id)
        ElMessage({
            type: 'success',
            message: '删除成功',
        })
        getArticles()
    })
    .catch(() => {
        //用户点击了取消
        ElMessage({
            type: 'info',
            message: '取消删除',
        })
    })
}
const update=(row)=>{
    articleModel.value = Object.assign({}, row);
}
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>文章管理</span>
                <div class="extra">
                    <el-button type="primary" @click="visibleDrawer=true">添加文章</el-button>
                </div>
            </div>
        </template>
        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item label="文章分类：">
                <el-select placeholder="请选择" v-model="categoryId" style="width: 200px;">
                    <el-option 
                        v-for="c in categorys" 
                        :key="c.id" 
                        :label="c.name"
                        :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="发布状态：">
                <el-select placeholder="请选择" v-model="state" style="width: 200px;">
                    <el-option label="已发布" value="已发布"></el-option>
                    <el-option label="草稿" value="草稿"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getArticles()">搜索</el-button>
                <el-button  @click="categoryId='';state=''">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 文章列表 -->
        <el-table :data="articles" style="width: 100%">
            <el-table-column label="文章标题" width="400" prop="name"></el-table-column>
            <el-table-column label="分类" prop="categoryName"></el-table-column>
            <el-table-column label="发表时间" prop="create_time"> </el-table-column>
            <el-table-column label="最后修改时间" prop="lastup_time"> </el-table-column>
            <el-table-column label="状态" prop="state"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button circle plain type="primary" @click="update(row);visibleUpdate=true">🐕</el-button>
                    <el-button circle plain type="danger" @click="deleteEssay(row)">x</el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5 ,10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
    </el-card>
    <!-- 抽屉 1-->
    <el-drawer v-model="visibleDrawer" title="添加文章" direction="rtl" size="30%">
        <!-- 添加文章表单 -->
        <el-form :model="articleModel" label-width="100px" >
            <el-form-item label="文章标题" >
                <el-input v-model="articleModel.name" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="文章分类">
                <el-select placeholder="请选择" v-model="articleModel.category_id">
                    <el-option v-for="c in categorys" :key="c.id" :label="c.name" :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="文章封面">
                <el-upload class="avatar-uploader" 
                    ref="uploadRef"
                    :show-file-list="false"
                    :auto-upload="true"
                    action="/api/upload"
                    name="file"
                    :headers="{'Authorization':tokenStore.token}"
                    :on-success="uploadSuccess"
                >
                    <img v-if="articleModel.photo" :src="articleModel.photo" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"></el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="文章内容">
                <div class="editor">
                    <quill-editor
                        theme="snow"
                        v-model:content="articleModel.text"
                        contentType="html"
                    >
                    </quill-editor>
                </div>
            </el-form-item>
            <el-form-item label="文章简介" >
                <el-input v-model="articleModel.message" placeholder="文章简介"></el-input>
            </el-form-item>
            <el-form-item label="状态选择">
                <el-button type="primary" @click="addEssay('已发布')">发布</el-button>
                <el-button type="info" @click="addEssay('草稿')">草稿</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
    <!-- 抽屉 2-->
    <el-drawer v-model="visibleUpdate" title="修改文章" direction="rtl" size="30%">
        <!-- 添加文章表单 -->
        <el-form :model="articleModel" label-width="100px" >
            <el-form-item label="文章标题" >
                <el-input v-model="articleModel.name" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="文章分类">
                <el-select placeholder="请选择" v-model="articleModel.category_id">
                    <el-option v-for="c in categorys" :key="c.id" :label="c.name" :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="文章封面">
                <el-upload class="avatar-uploader" 
                    ref="uploadRef"
                    :show-file-list="false"
                    :auto-upload="true"
                    action="/api/upload"
                    name="file"
                    :headers="{'Authorization':tokenStore.token}"
                    :on-success="uploadSuccess"
                >
                    <img v-if="articleModel.photo" :src="articleModel.photo" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"></el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="文章内容">
                <div class="editor">
                    <quill-editor
                        theme="snow"
                        v-model:content="articleModel.text"
                        contentType="html"
                    >
                    </quill-editor>
                </div>
            </el-form-item>
            <el-form-item label="文章简介" >
                <el-input v-model="articleModel.message" placeholder="文章简介"></el-input>
            </el-form-item>
            <el-form-item label="状态选择">
                <el-button type="primary" @click="updataEssay('已发布')">发布</el-button>
                <el-button type="info" @click="updataEssay('草稿')">草稿</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>
<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
}
    /* 抽屉样式 */
.avatar-uploader {
:deep() {
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .el-upload {
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
        border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        text-align: center;
    }
}
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>