<script setup>
import { ref } from 'vue'
import avatar from '../assets/leaves.webp'
import { useUserInfoStore } from '@/stores/user.js';
import { useTokenStore } from '@/stores/token.js';
const tokenStore =useTokenStore();
const userInfoStore = useUserInfoStore()
const uploadRef=ref()
const imgUrl= ref(userInfoStore.info.photo)
const uploadSuccess=(result)=>{
    imgUrl.value = result.data
}
import {userAvatarUpdataService} from '../api/User.js'
import { ElMessage } from 'element-plus';
const updataAvatar = async ()=>{
    console.log(imgUrl.value)
    let result = await userAvatarUpdataService(imgUrl.value)
    ElMessage.success(result.msg?result.msg:'修改成功')
    userInfoStore.info.photo=imgUrl.value
}
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>更新头像</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-upload
                    ref="uploadRef"
                    :show-file-list="false"
                    :auto-upload="true"
                    action="/api/upload"
                    name="file"
                    :headers="{'Authorization':tokenStore.token}"
                    :on-success="uploadSuccess"
                >
                    <img v-if="imgUrl" :src="imgUrl" class="avatar"/>
                    <img v-else :src="avatar" width="278">
                </el-upload>
                <br />
                <el-button type="primary" size="large" @click="uploadRef.$el.querySelector('input').click()">选择图片</el-button>
                <el-button type="success" size="lage" @click="updataAvatar">上传图片</el-button>
            </el-col>
        </el-row>
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
}
.avatar {
    width: 300px;
    height: 300px;
}
</style>