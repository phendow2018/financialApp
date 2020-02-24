import statisticMain from '@/components/Statistic/Statistic/statistic'
import log from '@/components/Statistic/Statistic/log'

const routerStatistic = {
    path: 'statistic',
    meta:{
        title:'统计信息',
        icon:'iconfont icon-shiduan'
    }
}

const routerLog = {
    path: 'log',
    meta:{
        title:'日志信息',
        icon:'icon-liebiao'
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
    },
    {
        path: 'log',
        name: 'log',
        component: log,
        meta:{
            title:'日志信息'
        }
    }
]

export {routerStatistic, routerLog, statisticRouter}