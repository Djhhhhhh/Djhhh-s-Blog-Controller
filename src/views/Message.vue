<script setup>
import { ref } from 'vue'
const messages = ref()
//控制添加分类弹窗
const dialogVisible = ref(false)
//弹窗标题
const title=ref('')

//添加分类数据模型
const messageModel = ref({
    name: '',
    text:'',
})
//添加分类表单校验
const rules = {
    messageName: [
        { required: true, message: '请输入公告名称', trigger: 'blur' },
    ]
}
import { MessageListService,AddMessageService,UpdataMessageService,DeleteMessageService } from '@/api/Message.js'
import {ElMessage} from 'element-plus'
const getAllMessage = async () => {
    let result = await MessageListService(messageModel.value);
    messages.value = result.data;
}
getAllMessage()
const addMessage= async()=>{
    let result = await AddMessageService(messageModel.value)
    ElMessage.success(result.msg?result.msg:'添加成功')
    getAllMessage()
    dialogVisible.value=false
}
const updeMessage=async()=>{
    let result = await UpdataMessageService(messageModel.value)
    ElMessage.success(result.msg?result.msg:'修改成功')
    getAllMessage()
    dialogVisible.value=false
}
const showDiglog=(row)=>{
    dialogVisible.value=true
    title.value='编辑公告'
    messageModel.value.name=row.name
    messageModel.value.id=row.id
    messageModel.value.text=row.text
}
const clearDate=()=>{
    messageModel.value.name=''
    messageModel.value.text=''
}
import {ElMessageBox} from 'element-plus'
const deleteCategory = (row) => {
    ElMessageBox.confirm(
        '你确认删除该公告吗？',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
    .then(async() => {
        //用户点击了确认
        let result = await DeleteMessageService(row.id)
        ElMessage({
            type: 'success',
            message: '删除成功',
        })
        getAllMessage()
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
                <span>公告信息</span>
                <div class="extra">
                    <el-button type="primary" @click="dialogVisible=true;title='添加公告';clearDate()">添加公告</el-button>
                </div>
            </div>
        </template>
        <el-table :data="messages" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="公告名称" prop="name"></el-table-column>
            <el-table-column label="公告内容" prop="text"></el-table-column>
            <el-table-column label="公告创建时间" prop="updata_time"></el-table-column>
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
        <el-form :model="messageModel" :rules="rules" label-width="100px" style="padding-right: 30px">
            <el-form-item label="公告名称" prop="name">
                <el-input v-model="messageModel.name" minlength="1" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="公告内容" prop="name">
                <el-input v-model="messageModel.text" minlength="1" maxlength="10"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="title=='添加公告'?addMessage():updeMessage()"> 确认 </el-button>
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