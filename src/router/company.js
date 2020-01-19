import company from '@/components/Company/Company/Company'
import companyEdit from '@/components/Statements/Statements/statements'

const routerCompany =  {
    path: 'company',
    name: 'company',
    component: company,
    meta: {
        title: '企业管理',
        icon:'iconfont icon-shiduan',
    }
}

 
const companyRouter =  [
    routerCompany,
    {
        path: 'company/companyEdit',
        name: 'companyEdit',
        component: companyEdit,
        meta:{
            title:'企业财务编辑'
        }
    }
]

export {routerCompany, companyRouter}

