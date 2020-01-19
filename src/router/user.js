import user from '@/components/User/User/user'
import userDetail from '@/components/User/User/userDetail'
import userEdit from '@/components/User/User/userEdit'

import role from '@/components/User/Role/role'
import roleDetail from '@/components/User/Role/roleDetail'
import roleEdit from '@/components/User/Role/roleEdit'
import editRight from '@/components/User/Role/editRight'

import organization from '@/components/User/Organization/organization'
import organizationDetail from '@/components/User/Organization/organizationDetail'
import organizationEdit from '@/components/User/Organization/organizationEdit'

const routeUser = {
    path: 'user',
    name: 'user',
    component: user,
    meta: {
        title: '用户信息',
        icon:'iconfont icon-yonghu'
    }
}

const routerRole = {
    path: 'role',
    name: 'role',
    component: role,
    meta: {
        title: '角色信息',
        icon:'iconfont icon-quanxianguanli'
    }
}

const routerOrganization = {
    path: 'organization',
    name: 'organization',
    component: organization,
    meta: {
        title: '组织结构',
        icon:'iconfont icon-zuzhijiagou'
    }
}

const userRouter = [
    routeUser,
    {
        path: 'user/userDetail',
        name: 'userDetail',
        component: userDetail,
        meta: {
            title: '用户详情'
        }
    },
    {
        path: 'user/userEdit',
        name: 'userEdit',
        component: userEdit,
        meta: {
            title: '用户编辑'
        }
    },
    routerRole,
    {
        path: 'role/roleDetail',
        name: 'roleDetail',
        component: roleDetail,
        meta: {
            title: '角色详情'
        }
    },
    {
        path: 'role/roleEdit',
        name: 'roleEdit',
        component: roleEdit,
        meta: {
            title: '角色编辑'
        }
    },
    {
        path: 'role/editRight',
        name: 'editRight',
        component: editRight,
        meta: {
            title: '角色权限'
        }
    },
    routerOrganization,
    {
        path: 'organization/organizationDetail',
        name: 'organizationDetail',
        component: organizationDetail,
        meta: {
            title: '结构详情'
        }
    },
    {
        path: 'organization/organizationEdit',
        name: 'organizationEdit',
        component: organizationEdit,
        meta: {
            title: '结构编辑'
        }
    },
]

export {routeUser, routerRole, routerOrganization, userRouter}
