<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus';

import { onMounted, onUnmounted } from 'vue';
onMounted(() => {
    document.body.style.background = 'linear-gradient(to right, black, white)';
});
onUnmounted(() => {
    document.body.style.background = '';
});

const value = ref(true)

const loginForm = ref({
  username: '',
  password: '',
});
 
const RegisterForm = ref({
  username: '',
  password: '',
  Repassword:''
});

const checkRepassword =(rule,value,callback)=>{
  if(value === ''){
    callback(new Error("请再次确认密码"))
  }else if(value !== RegisterForm.value.password){
    callback(new Error("两次密码不相同"))
  }else{
    callback()
  }
}

const rules = {
  username:  [
    {required:true,message:'请输入用户名',trigger:'blur'},
    {min:5,max:16,message:'长度为5-16位非空字符',trigger:'blur'}
  ],
  password:  [
    {required:true,message:'请输入密码',trigger:'blur'},
    {min:5,max:16,message:'长度为5-16位非空字符',trigger:'blur'}
  ],
  Repassword:  [
    {validator:checkRepassword,trigger:'blur'}
  ]
}

import {userRegisterService} from '../api/User.js'
const register = async()=>{
  let result = await userRegisterService(RegisterForm.value)
  ElMessage.success(result.message?result.message:"注册成功")
}

import {userLoginService} from '../api/User.js'
import {useRouter} from 'vue-router'
import {useTokenStore} from '../stores/token.js'
const router = useRouter()
const tokenStore =useTokenStore()
const login= async()=>{
  let result = await userLoginService(loginForm.value)
  ElMessage.success(result.message?result.message:"登录成功")
  tokenStore.setToken(result.data)
  router.push('/')
}
</script>

<template>    
    <div class="mainBox">
        <el-container class="container">
            <el-aside width="30em" class="leftbox"></el-aside>
            <Transition name="Login">
                <el-main class="rightbox" v-show="value">
                    <div class="rightbox-top1">Login</div>
                    <div class="rightbox-top2">Please login to continue</div>
                    <el-form
                        :model="loginForm"
                        label-position="top"
                        size="large"
                        :rules="rules"
                    >
                      <el-form-item label="Username" prop="username">
                        <el-input v-model="loginForm.username" placeholder="Please input" style="width: 18em; height: 2.3em; font-size: 1.5em;"/>
                      </el-form-item>
                      <el-form-item label="Password" prop="password">
                        <el-input v-model="loginForm.password" placeholder="Please input" show-password style="width: 18em; height: 2.3em; font-size: 1.5em;"/>
                      </el-form-item> 
                    </el-form>
                    <el-button class="loginbth" @click="login">登录</el-button>
                </el-main>
            </Transition>
            <Transition name="Register">
                <el-main class="rightbox" v-show="!value">
                    <div class="Register-rightbox-top1">Register</div>
                    <div class="Register-rightbox-top2">Please Register to continue</div>
                    <el-form
                        :model="RegisterForm"
                        label-position="top"
                        size="large"
                        :rules="rules"
                    >
                      <el-form-item label="Username" prop="username">
                        <el-input v-model="RegisterForm.username" placeholder="Please input" style="width: 18em; height: 2.3em; font-size: 1.5em;"/>
                      </el-form-item>
                      <el-form-item label="Password" prop="password">
                        <el-input v-model="RegisterForm.password" placeholder="Please input" show-password style="width: 18em; height: 2.3em; font-size: 1.5em;"/>
                      </el-form-item> 
                      <el-form-item label="RePassword" prop="Repassword">
                        <el-input v-model="RegisterForm.Repassword" placeholder="Please input" show-password style="width: 18em; height: 2.3em; font-size: 1.5em;"/>
                      </el-form-item> 
                    </el-form>
                    <el-button class="Register-loginbth" @click="register">注册</el-button>
                </el-main>
            </Transition>
            <el-switch
              v-model="value"
              class="switch"
              inline-prompt
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              active-text="Login"
              inactive-text="Register"
              size="large"
            />
        </el-container>
    </div>
</template>

<style scoped>
.mainBox {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 60em;
    height: 36em;
    transition: 1s;
}
.container {
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    height: 100%;
}
.leftbox { 
    background-image: url(../assets/flowers.jpg);
    background-size: cover;
}
.rightbox{
    z-index: -1;
    position: relative;
    background-image: url(../assets/leaves.webp);
}
.Register-rightbox-top1 {
    font-size: 4em;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.Register-rightbox-top2 {
    font-size: 1em;
    margin-bottom: 1em;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.rightbox-top1 {
    margin-top: 20%;
    font-size: 4em;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.rightbox-top2 {
    font-size: 1em;
    margin-bottom: 1em;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.loginbth{
    display: block;
    position: relative;
    overflow: hidden;
    margin-top: 1em;
    width: 17em;
    height: 2em;
    font-size: 1.4em;
    color: black;
    background-color: #E5EAF3;
}
.loginbth::before {
    content: "Login>";
    display: flex;
    justify-content: center;
    align-items: center; 
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:  radial-gradient(circle at 100%, #333, #333 50%, #eee 75%, #333 75%);
    transform: translateX(-100%);
    transition: 0.5s;
}
.loginbth:hover::before {
    transform: translateX(0);
}
.Register-loginbth{
    display: block;
    position: relative;
    overflow: hidden;
    margin-top: 1em;
    width: 17em;
    height: 2em;
    font-size: 1.4em;
    color: black;
    background-color: #E5EAF3;
}
.Register-loginbth::before {
    content: "Register>";
    display: flex;
    justify-content: center;
    align-items: center; 
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:  radial-gradient(circle at 100%, #333, #333 50%, #eee 75%, #333 75%);
    transform: translateX(-100%);
    transition: 0.5s;
}
.Register-loginbth:hover::before {
    transform: translateX(0);
}
.switch{
    position: absolute;
    bottom: 3%;
    right: 5%;
    transform: scale(1.5);
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.Login-enter-active,
.Login-leave-active {
  transition: all 0.3s ease;
}

.Login-enter-from,
.Login-leave-to {
  transform: scale(0);
}

.Register-enter-active,
.Register-leave-active {
  transition: all 0.3s ease;
}

.Register-enter-from,
.Register-leave-to {
  transform: scale(0);
}

</style>    
