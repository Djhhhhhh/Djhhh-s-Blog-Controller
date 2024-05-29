import {createRouter,createWebHistory} from 'vue-router'
import LoginVue from '../views/Login.vue'
import LayoutVue from '../views/Layout.vue'
import UserInfoVue from '../views/UserInfo.vue'
import UserPasswordVue from '../views/UserPassword.vue'
import UserAvatarVue from '../views/UserAvatar.vue'
import EssayVue from '../views/Essay.vue'
import CategoryVue from '../views/Category.vue'
import MessageVue from '../views/Message.vue'
import AddEssay from '../views/AddEssay.vue'

const routes = [
    {path:'/login',component:LoginVue},
    {
        path:'/',
        component:LayoutVue ,
        children:[
            {path:'/user/info',component: UserInfoVue},
            {path:'/user/password',component: UserPasswordVue},
            {path:'/user/avatar',component: UserAvatarVue},
            {path:'/category',component: CategoryVue},
            {path:'/essay',component: EssayVue},
            {path:'/addessay',component: AddEssay},
            {path:'/message',component: MessageVue}
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes:routes
})

export default router