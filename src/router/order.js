import orderMain from '@/components/Order/main/order'
import orderEdit from '@/components/Statements/Statements/statements'

const routerOrder = {
    path: 'order',
    meta:{
        title:'订单管理',
        icon:'iconfont icon-asterisks'
    }
}

const orderRouter = [
    {
        path: 'order',
        name: 'orderMain',
        component: orderMain,
        meta:{
            title:'订单管理'
        }
    },
    {
        path: 'order/orderEdit',
        name: 'orderEdit',
        component: orderEdit,
        meta:{
            title:'订单编辑'
        }
    }
]

export {routerOrder, orderRouter}