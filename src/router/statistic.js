import statisticMain from '@/components/Statistic/Statistic/statistic'

const routerStatistic = {
    path: 'statistic',
    redirect: 'statistic',
    meta:{
        title:'统计信息',
        icon:'iconfont icon-shiduan'
    }
}

const statisticRouter = [
    {
        path: 'statistic',
        name: 'statisticMain',
        component: statisticMain,
        meta:{
            title:'统计信息'
        }
    }
]

export {routerStatistic, statisticRouter}