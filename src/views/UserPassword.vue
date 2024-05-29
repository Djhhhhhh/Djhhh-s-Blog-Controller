<script setup>
import { ref } from 'vue'
import { useUserInfoStore } from '@/stores/user.js';
const userInfoStore = useUserInfoStore()
const newpassword = ref({
  oldpassword: '',
  nowpassword: '',
  Repassword:''
});
const checkRepassword =(rule,value,callback)=>{
  if(value === ''){
    callback(new Error("请再次确认密码"))
  }else if(value !== newpassword.value.nowpassword){
    callback(new Error("两次密码不相同"))
  }else{
    callback()
  }
}
const checkpassword=(rule,value,callback)=>{
    if(value===''){
        callback(new Error("请输入旧密码"))
    }else if(value != userInfoStore.info.password){
        callback(new Error("与原密码不相同"))
    }else {
        callback()
    }
}
const rules = {
    oldpassword:[
    {required:true,validator:checkpassword,trigger:'blur'}
    ],
    nowpassword:  [
        {required:true,message:'请输入密码',trigger:'blur'},
        {min:5,max:16,message:'长度为5-16位非空字符',trigger:'blur'}
    ],
    Repassword:  [
        {required:true,validator:checkRepassword,trigger:'blur'},
        {min:5,max:16,message:'长度为5-16位非空字符',trigger:'blur'}
    ]
}
import {userInfoUpdatePwdService} from '../api/User.js'
import { ElMessage } from 'element-plus';
const updateUserInfo= async()=>{
    let result = await userInfoUpdatePwdService(newpassword)
    ElMessage.success(result.message? result.message:'修改成功')
    userInfoStore.info.password=newpassword.value.nowpassword
}
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>更新密码</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form  
                    :rules="rules" 
                    label-width="10em" 
                    size="large"
                    :model="newpassword"
                >
                    <el-form-item label="原密码" prop="oldpassword">
                        <el-input show-password v-model="newpassword.oldpassword"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="nowpassword">
                        <el-input show-password v-model="newpassword.nowpassword"></el-input>
                    </el-form-item>
                    <el-form-item label="重新输入密码" prop="Repassword">
                        <el-input show-password v-model="newpassword.Repassword"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateUserInfo">提交修改</el-button>
                    </el-form-item>
                </el-form>
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
</style>