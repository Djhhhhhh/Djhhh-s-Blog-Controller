<script setup>
import { ref } from 'vue'
//文章分类数据模型
const categorys = ref('')
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
</script>
<template>
    <el-card class="page-container">
        <template #header>添加文章</template>
        <!-- 抽屉 1-->
        <div class="form-container">
            <div class="left-side">
                <el-form :model="articleModel" label-width="100px">
                    <el-form-item label="文章标题">
                        <el-input v-model="articleModel.name" placeholder="请输入标题"></el-input>
                    </el-form-item>
                    <el-form-item label="文章分类">
                        <el-select placeholder="请选择" v-model="articleModel.category_id">
                            <el-option v-for="c in categorys" :key="c.id" :label="c.name" :value="c.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="文章简介" >
                        <el-input v-model="articleModel.message" placeholder="文章简介"></el-input>
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
                            style="display: block;"
                        >
                            <img v-if="articleModel.photo" :src="articleModel.photo" class="avatar" />
                            <el-icon v-else class="avatar-uploader-icon"></el-icon>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="状态选择">
                        <el-button type="primary" @click="addEssay('已发布')">发布</el-button>
                        <el-button type="info" @click="addEssay('草稿')">草稿</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="right-side">
                <el-form-item label="文章内容"> 
                    <div class="editor">
                        <quill-editor
                            theme="snow"
                            v-model:content="articleModel.text"
                            contentType="html"
                            toolbar="full"
                            style="height: 600px;"
                        >
                        </quill-editor>
                    </div>
                </el-form-item>
            </div>
        </div>
    </el-card>
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
    
    .form-container {
        display: flex;
        justify-content: space-between;
        
        .left-side {
            flex: 1;
            margin-right: 20px;
        }
        
        .right-side {
            flex: 2;
        }
    }
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
}
</style>
