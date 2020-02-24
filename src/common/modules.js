//模块功能，用于写入module表,修改时，不要轻易改变其中的Flag和id值，否则会导致之前配置的权限错乱
let order = {
    Flag: 'order',
    Name: '订单管理',
    Sort: 1,
    Functions: [{
        id: 1,
        label: '首页',
        functions: [{
            label: '分配订单',
            id: 1
        }, {
            label: '查询所有订单',
            id: 2
        }, {
            label: '仅查询个人订单',
            id: 3
        }]
    }, {
        id: 2,
        label: '订单编辑',
        functions: [{
            label: '增加报表',
            id: 1
        }, {
            label: '保存',
            id: 2
        }, {
            label: '提交',
            id: 3
        }, {
            label: '发送',
            id: 4
        }, {
            label: '取消',
            id: 5
        }, {
            label: '撤销',
            id: 6
        }]
    }]
}

let company = {
    Flag: 'company',
    Name: '企业管理',
    Sort: 2,
    Functions: [{
        id: 1,
        label: '首页',
        functions: [{
            label: '添加企业',
            id: 1
        },{
            label: '修改企业',
            id: 2
        },{
            label: '删除企业',
            id: 3
        }],
    }, {
        id: 2,
        label: '企业编辑',
        functions: [{
            label: '增加报表',
            id: 1
        }, {
            label: '保存',
            id: 2
        }, {
            label: '报表删除',
            id: 3
        }]
    }]
}

let user = {
    Flag: 'user',
    Name: '用户管理',
    Sort: 3,
    Functions: [{
        id: 1,
        label: '首页',
        functions: [{
            label: '添加用户',
            id: 1
        }, {
            label: '编辑用户',
            id: 2
        }, {
            label: '删除用户',
            id: 3
        }]
    }]
}

let role = {
    Flag: 'role',
    Name: '角色管理',
    Sort: 4,
    Functions: [{
        id: 1,
        label: '首页',
        functions: [{
            label: '添加角色',
            id: 1
        }, {
            label: '编辑角色',
            id: 2
        }, {
            label: '删除角色',
            id: 3
        }]

    }]
}

export var statistic = {
    Flag: 'statistic',
    Name: '统计信息',
    Sort: 5,
    Functions: [{
        id: 1,
        label: '首页',
        functions: [{
            label: '统计所有订单',
            id: 1
        }, {
            label: '仅本人订单',
            id: 2
        }]
    }]
}

export default { order, company, user, role, statistic }