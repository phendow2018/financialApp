const router = require('koa-router')()

//software
const status = require('./status');
const stop = require('./stop');
router.use('/software/get', status.routes(), status.allowedMethods());
router.use('/software/stop', stop.routes(), stop.allowedMethods());

//platform
const platform_users = require('./platform/users');
const platform_userPassword = require('./platform/user-password');
const platform_loginUser = require('./platform/login-user');
const platform_logs = require('./platform/logs');
// const platform_rc = require('./platform/related-customers')
router.use('/financial-management/api/v1/platform/users', platform_users.routes(), platform_users.allowedMethods());
router.use('/financial-management/api/v1/platform/user-password', platform_userPassword.routes(), platform_userPassword.allowedMethods());
router.use('/financial-management/api/v1/platform/login-user', platform_loginUser.routes(), platform_loginUser.allowedMethods());
router.use('/financial-management/api/v1/platform/logs', platform_logs.routes(), platform_logs.allowedMethods());
// router.use('/financial-management/api/v1/platform/related-customers', platform_rc.routes(), platform_rc.allowedMethods());

//order-manage
const om_orders = require('./order-manage/orders');
const om_orders_save = require('./order-manage/orders_save');
const om_orders_commit = require('./order-manage/orders_commit');
const om_orders_send = require('./order-manage/orders_send');
const om_orders_cancel = require('./order-manage/orders_cancel');
router.use('/financial-management/api/v1/order-manage/orders', om_orders.routes(), om_orders.allowedMethods());
router.use('/financial-management/api/v1/order-manage/orders/save-operation', om_orders_save.routes(), om_orders_save.allowedMethods());
router.use('/financial-management/api/v1/order-manage/orders/commit-operation', om_orders_commit.routes(), om_orders_commit.allowedMethods());
router.use('/financial-management/api/v1/order-manage/orders/send-operation', om_orders_send.routes(), om_orders_send.allowedMethods());
router.use('/financial-management/api/v1/order-manage/orders/cancel-operation', om_orders_cancel.routes(), om_orders_cancel.allowedMethods());

//company-manage
const cm_companies = require('./company-manage/companies');
const cm_statements = require('./company-manage/statements');
const cm_statements_batch = require('./company-manage/statements_batch');
router.use('/financial-management/api/v1/company-manage/companies', cm_companies.routes(), cm_companies.allowedMethods());
router.use('/financial-management/api/v1/company-manage/statements', cm_statements.routes(), cm_statements.allowedMethods());
router.use('/financial-management/api/v1/company-manage/statements/batch-operation', cm_statements_batch.routes(), cm_statements_batch.allowedMethods());

//apis
// const test = require('./apis/common/test');
// router.use('/apis/v1/test', test.routes(), test.allowedMethods());
const qichacha_orders = require('./apis/qichacha/orders');
router.use('/apis/v1/qichacha/orders', qichacha_orders.routes(), qichacha_orders.allowedMethods());

module.exports = router
