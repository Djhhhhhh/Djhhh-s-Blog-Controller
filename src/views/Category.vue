<script setup>
import { ref } from 'vue'
const categorys = ref()
//控制添加分类弹窗
const dialogVisible = ref(false)
//弹窗标题
const title=ref('')

//添加分类数据模型
const categoryModel = ref({
    name: '',
})
//添加分类表单校验
const rules = {
    categoryName: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
    ]
}
import { CategoryListService } from '@/api/Category.js'
import {AddCategoryService} from '@/api/Category.js'
import {ElMessage} from 'element-plus'
const getAllCategory = async () => {
    let result = await CategoryListService(categoryModel.value);
    categorys.value = result.data;
}
getAllCategory()
const addCategory= async()=>{
    let result = await AddCategoryService(categoryModel.value)
    ElMessage.success(result.msg?result.msg:'添加成功')
    getAllCategory()
    dialogVisible.value=false
}
import {UpdataCategoryService} from '@/api/Category.js'
const updeCategory=async()=>{
    let result = await UpdataCategoryService(categoryModel.value)
    ElMessage.success(result.msg?result.msg:'修改成功')
    getAllCategory()
    dialogVisible.value=false
}
const showDiglog=(row)=>{
    dialogVisible.value=true
    title.value='编辑分类'
    categoryModel.value.name=row.name
    categoryModel.value.id=row.id
}
const clearDate=()=>{
    categoryModel.value.name=''
}
import {ElMessageBox} from 'element-plus'
import {DeleteCategoryService} from '@/api/Category.js'
const deleteCategory = (row) => {
    ElMessageBox.confirm(
        '你确认删除该分类信息吗？',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
    .then(async() => {
        //用户点击了确认
        let result = await DeleteCategoryService(row.id)
        ElMessage({
            type: 'success',
            message: '删除成功',
        })
        getAllCategory()
    })
    .catch(() => {
        //用户点击了取消
        ElMessage({
            type: 'info',
            message: '取消删除',
        })
    })
}
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>文章分类</span>
                <div class="extra">
                    <el-button type="primary" @click="dialogVisible=true;title='添加分类';clearDate()">添加分类</el-button>
                </div>
            </div>
        </template>
        <el-table :data="categorys" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="分类名称" prop="name"></el-table-column>
            <el-table-column label="分类创建时间" prop="create_time"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button circle plain type="primary" @click="showDiglog(row)">🐕</el-button>
                    <el-button circle plain type="danger" @click="deleteCategory(row)">x</el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="title" width="30%">
        <el-form :model="categoryModel" :rules="rules" label-width="100px" style="padding-right: 30px">
            <el-form-item label="分类名称" prop="name">
                <el-input v-model="categoryModel.name" minlength="1" maxlength="10"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="title=='添加分类'?addCategory():updeCategory()"> 确认 </el-button>
            </span>
        </template>
    </el-dialog>
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
</style>