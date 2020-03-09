const router = require('koa-router')()

//software
const status = require('./status');
const stop = require('./stop');
router.use('/software/get', status.routes(), status.allowedMethods());
router.use('/software/stop', stop.routes(), stop.allowedMethods());

//platform
const platform_modules = require('./platform/modules');
const platform_users = require('./platform/users');
const platform_users_roles = require('./platform/users_roles');
const platform_userPassword = require('./platform/user-password');
const platform_roles = require('./platform/roles');
const platform_roles_users = require('./platform/roles_users');
const platform_loginUser = require('./platform/login-user');
const platform_rights = require('./platform/rights');
const platform_logs = require('./platform/logs');
// const platform_rc = require('./platform/related-customers')
router.use('/financial-management/api/v1/platform/modules', platform_modules.routes(), platform_modules.allowedMethods());
router.use('/financial-management/api/v1/platform/users', platform_users.routes(), platform_users.allowedMethods());
router.use('/financial-management/api/v1/platform/users/roles', platform_users_roles.routes(), platform_users_roles.allowedMethods());
router.use('/financial-management/api/v1/platform/user-password', platform_userPassword.routes(), platform_userPassword.allowedMethods());
router.use('/financial-management/api/v1/platform/roles', platform_roles.routes(), platform_roles.allowedMethods());
router.use('/financial-management/api/v1/platform/roles/users', platform_roles_users.routes(), platform_roles_users.allowedMethods());
router.use('/financial-management/api/v1/platform/login-user', platform_loginUser.routes(), platform_loginUser.allowedMethods());
router.use('/financial-management/api/v1/platform/rights', platform_rights.routes(), platform_rights.allowedMethods());
router.use('/financial-management/api/v1/platform/logs', platform_logs.routes(), platform_logs.allowedMethods());
// router.use('/financial-management/api/v1/platform/related-customers', platform_rc.routes(), platform_rc.allowedMethods());

//order-manage
const om_orders = require('./order-manage/orders');
const om_orders_assign = require('./order-manage/orders_assign');
const om_orders_save = require('./order-manage/orders_save');
const om_orders_commit = require('./order-manage/orders_commit');
const om_orders_send = require('./order-manage/orders_send');
const om_orders_cancel = require('./order-manage/orders_cancel');
router.use('/financial-management/api/v1/order-manage/orders', om_orders.routes(), om_orders.allowedMethods());
router.use('/financial-management/api/v1/order-manage/orders/assign-operation', om_orders_assign.routes(), om_orders_assign.allowedMethods());
router.use('/financial-management/api/v1/order-manage/orders/save-operation', om_orders_save.routes(), om_orders_save.allowedMethods());
router.use('/financial-management/api/v1/order-manage/orders/commit-operation', om_orders_commit.routes(), om_orders_commit.allowedMethods());
router.use('/financial-management/api/v1/order-manage/orders/send-operation', om_orders_send.routes(), om_orders_send.allowedMethods());
router.use('/financial-management/api/v1/order-manage/orders/cancel-operation', om_orders_cancel.routes(), om_orders_cancel.allowedMethods());

//company-manage
const cm_companies = require('./company-manage/companies');
const companies_detail = require('./company-manage/companies_detail');
const cm_statements = require('./company-manage/statements');
const cm_statements_batch = require('./company-manage/statements_batch');
const cm_company_explain = require('./company-manage/company-explain');
router.use('/financial-management/api/v1/company-manage/companies', cm_companies.routes(), cm_companies.allowedMethods());
router.use('/financial-management/api/v1/company-manage/companies/detail', companies_detail.routes(), companies_detail.allowedMethods());
router.use('/financial-management/api/v1/company-manage/statements', cm_statements.routes(), cm_statements.allowedMethods());
router.use('/financial-management/api/v1/company-manage/statements/batch-operation', cm_statements_batch.routes(), cm_statements_batch.allowedMethods());
router.use('/financial-management/api/v1/company-manage/company-explain', cm_company_explain.routes(), cm_company_explain.allowedMethods());

//statistics
const sc_count = require('./statistics/company_count');
const so_count_by_status = require('./statistics/order_count-by-status');
const so_count_by_yearstatus = require('./statistics/order_count-by-year_status');
const so_count_by_quarterstatus = require('./statistics/order_count-by-quarter_status');
const so_count_by_monthstatus = require('./statistics/order_count-by-month_status');
const so_count_by_datestatus = require('./statistics/order_count-by-date_status');
const so_ratio = require('./statistics/ratio');
const so_ratios_of_change = require('./statistics/ratios_of_change');
router.use('/financial-management/api/v1/statistics/company-count', sc_count.routes(), sc_count.allowedMethods());
router.use('/financial-management/api/v1/statistics/order-count', so_count_by_status.routes(), so_count_by_status.allowedMethods());
router.use('/financial-management/api/v1/statistics/order-count/groupby-year', so_count_by_yearstatus.routes(), so_count_by_yearstatus.allowedMethods());
router.use('/financial-management/api/v1/statistics/order-count/groupby-quarter', so_count_by_quarterstatus.routes(), so_count_by_quarterstatus.allowedMethods());
router.use('/financial-management/api/v1/statistics/order-count/groupby-month', so_count_by_monthstatus.routes(), so_count_by_monthstatus.allowedMethods());
router.use('/financial-management/api/v1/statistics/order-count/groupby-date', so_count_by_datestatus.routes(), so_count_by_datestatus.allowedMethods());
router.use('/financial-management/api/v1/statistics/financial-ratios-of-change', so_ratios_of_change.routes(), so_ratios_of_change.allowedMethods());
router.use('/financial-management/api/v1/statistics/financial-ratio', so_ratio.routes(), so_ratio.allowedMethods());

//apis
// const test = require('./apis/common/test');
// router.use('/apis/v1/test', test.routes(), test.allowedMethods());
const qichacha_orders = require('./apis/qichacha/orders');
router.use('/apis/v1/qichacha/orders', qichacha_orders.routes(), qichacha_orders.allowedMethods());

module.exports = router
