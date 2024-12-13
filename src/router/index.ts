import {createRouter, createWebHashHistory} from "vue-router"

const router = createRouter({
    history: createWebHashHistory(),
    routes: [{
        path: '/',
        redirect: '/login',
    }, {
        path: '/login',
        component: () => import('../views/user/Login.vue'),
        meta: {title: '用户登录'}
    }, {
        path: '/register',
        component: () => import('../views/user/Register.vue'),
        meta: {title: '用户注册'}
    }, 
    // {
    //     path: '/editor',
    //     component: () => import('../components/Editor.vue'),
    //     meta: {title: '编辑器'}
    // },
    // {
    //     path: '/table',
    //     component: () => import('../components/Table.vue'),
    //     meta: {title: '表单'}
    // },
    {
        path: '/home',
        component: () => import('../views/Home.vue'),
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: () => import('../views/user/Dashboard.vue'),
                meta: {title: '个人信息'}
            },
            {
                path: '/volunteer',
                name: 'volunteer',
                component: () => import('../views/Home/volunteer.vue'),
                meta: {title: '主页'}
            },
            {
                path: '/volunteerDetail/:id',
                name: 'volunteerDetail',
                component: () => import('../views/Home/volunteerDetail.vue'),
                meta: {title: '详细页面'}
            },
            {
                path: '/edit',
                name: 'edit',
                component: () => import('../views/admin/edit.vue'),
                meta: {
                    title: '管理界面',
                    permission: ['ADMIN']
                }
            },
        ]
    },  
    {
        path: '/404',
        name: '404',
        component: () => import('../views/NotFound.vue'),
        meta: {title: '404'}
    }, {
        path: '/:catchAll(.*)',
        redirect: '/404'
    }]
})

router.beforeEach((to, _, next) => {
    const token: string | null = sessionStorage.getItem('token');
    const role: string | null = sessionStorage.getItem('role')

    if (to.meta.title) {
        document.title = to.meta.title
    }

    // if (token) {
        if (to.meta.permission) {
            if (to.meta.permission.includes(role!)) {
                next()
            } else {
                next('/404')
            }
        } else {
            next()
        }
    // } else {
    //     if (to.path === '/login') {
    //         next();
    //     } else if (to.path === '/register') {
    //         next()
    //     } else {
    //         next('/login')
    //     }
    // }
})

export {router}
