import statisticMain from '@/components/Statistic/Statistic/statistic'

const routerStatistic = {
    path: 'statistic',
    redirect: 'statistic/main',
    meta:{
        title:'统计信息',
        icon:'iconfont icon-shiduan'
    }
}

const statisticRouter = [
    routerStatistic,
    {
        path: 'statistic/main',
        name: 'statisticMain',
        component: statisticMain,
        meta:{
            title:'统计信息'
        }
    }
]

export {routerStatistic, statisticRouter}