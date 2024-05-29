<script setup>
import { onMounted, onUnmounted } from 'vue';
onMounted(() => {
    document.body.style.height='100%'
    getUserInf()    
});
onUnmounted(() => {
    document.body.style.background = '';
});
import { ref } from 'vue'
const activeNames = ref(['1'])
const handleChange = (val) => {
    console.log(val)
}
import {userInfoGetService} from '../api/User.js'
import {useUserInfoStore} from '../stores/user.js'
const userInfoStore = useUserInfoStore();
const getUserInf = async ()=>{
    let result = await userInfoGetService();    
    userInfoStore.info =result.data;
}
import {useRouter} from 'vue-router'
import {ElMessage,ElMessageBox} from 'element-plus'
import { useTokenStore } from '@/stores/token.js'
const router = useRouter()
const tokenStore = useTokenStore()
const handleCommand = (command) => {
    if (command === 'logout') {
        //退出登录
        ElMessageBox.confirm(
            '你确认退出登录码？',
            '温馨提示',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
            .then(async () => {
                userInfoStore.info={}
                tokenStore.token=''
                router.push('/login')
            })
            .catch(() => {
                ElMessage({
                    type: 'info',
                    message: '取消退出',
                })
            })
    } else {
        router.push('/user/' + command)
    }
}
</script>   
<template>
    <div class="common-layout">
        <el-container>
              <el-aside class="Aside">
                <div class="AsideTop1">DJhhh'</div>
                <div class="AsideTop2">博客后台管理系统</div>
                <div class="AsideBox">
                    <el-menu
                      default-active="2"
                      router
                    >
                        <el-sub-menu>
                            <template #title>
                              <span>用户管理</span>
                            </template>
                            <el-menu-item index="/user/info">个人信息</el-menu-item>
                            <el-menu-item index="/user/password">重置密码</el-menu-item>
                            <el-menu-item index="/user/avatar">更新头像</el-menu-item>
                        </el-sub-menu>
                        <el-menu-item index="/essay">
                            <span>文章管理</span>
                        </el-menu-item>
                        <el-menu-item index="/addessay">
                            <span>添加文章</span>
                        </el-menu-item>
                        <el-menu-item index="/category">
                            <span>分类管理</span>
                        </el-menu-item>
                        <el-menu-item index="/message">
                            <span>公告管理</span>
                        </el-menu-item>
                    </el-menu>
                </div>
        </el-aside>
        <el-container>
        <el-header class="Header">
            <div class="HeaderText">欢迎用户:{{ userInfoStore.info.nickname ? userInfoStore.info.nickname : userInfoStore.info.name }}</div>
            <el-dropdown :hide-on-click="false"  class="HeaderAva" placement="bottom-end" @command="handleCommand">
                <span> 
                    <el-avatar size="large" :src="userInfoStore.info.photo ? userInfoStore.info.photo:avatar"/>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>  
                    <el-dropdown-item command="info">个人资料</el-dropdown-item>
                    <el-dropdown-item command="avatar">更新头像</el-dropdown-item>
                    <el-dropdown-item command="password">重置密码</el-dropdown-item>
                    <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </el-header>
        <el-main class="Main">  
            <router-view></router-view>
        </el-main>
        </el-container>
    </el-container>
    </div>
</template>
<style>
.el-sub-menu{
    background: url(../assets/01.webp);
    border-top: solid;
    border-width: 1px;
}
.el-menu-item{
    background: url(../assets/01.webp);
    border-top: solid;
    border-width: 1px;
}
.el-menu-item:hover {
    background: url();
    background-color: #f5f5f5;
}
.common-layout {
    position: relative;
}
.Aside {
    height: 98vh;
    width: 15em;
    background: url(../assets/01.webp);
    border-right: solid;
    border-width: 1px;
}
.AsideBox{
    margin-top: 5em;
}
.AsideTop1{
    margin-top: 1em;
    margin-left: 0.5em;
    font-size: 2.5em;
    color:#0000FF;
	animation:swing 3s infinite;
}
@keyframes swing{
    0%,100%,20%,50%,80%{
	   -webkit-transform:translateY(0);
	}40%{
	   -webkit-transform:translateY(15px);
	}60%{
	   -webkit-transform:translateY(5px);
	}
    0%,100%{ color:#fff;text-shadow:0 0 10px #0000FF,0 0 10px #0000FF; }
	50%{ text-shadow:0 0 10px #0000FF,0 0 40px #0000FF; }
}
.AsideTop2{
    display: inline-block;
    font-size: 1.05em;
    margin-left: 1.5em;
	transform:skew(-10deg);
}
.Header{
    height: 8vh;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
}
.Header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 2px;
  background-color: red;
  animation: move 6s infinite;
}
@keyframes move {
  0% {
    left: 0;
  }
  50% {
    left: calc(100% - 50px);
  }
  100% {
    left: 0;
  }
}
.HeaderText{
    font-size: 2em; 
}
.HeaderAva{ 
    margin-right: 2em;
}
.Main{
    height: 82vh;
    border-top: solid;
    border-width:2px;
    background: url(../assets/watercolor.webp);
}
</style>