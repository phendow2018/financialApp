<template>
  <div :class="[preCls]">
    <div :class="[preCls + '-header']">
      <div :class="[preCls + '-header-filter']">
        <div :class="[preCls + '-header-filter-left']">
          <el-radio v-model="dateRange" label="today">今天</el-radio>
          <el-radio v-model="dateRange" label="yesterday">昨天</el-radio>
          <el-radio v-model="dateRange" label="custom">日期选择</el-radio>
          <el-date-picker
            v-model="customDate"
            align="right"
            type="date"
            :clearable="false"
            :editable="false"
            :disabled="dateRange != 'custom'"
            placeholder="选择日期"
            @change="handleDateChangeSearch"
            :picker-options="pickerOptions"
          ></el-date-picker>
          <div :class="[preCls + '-header-filter-left-searchInput']">
            <type-select :menuList="menuList" @on-type-changed="onTypeChanged"></type-select>
            <!-- <div class="search-type" @mouseenter="showTypeSelect = true" @mouseleave="showTypeSelect = false">
              <span v-html="curSearchType == 'FuzzyOrderNumber' ? '订单编号' : '企业名称'"></span>
              <span class="el-icon-caret-bottom"></span>
              <div class="search-container" v-show="showTypeSelect">
                <div class="select-item" :class="{'active': curSearchType == 'FuzzyOrderNumber'}" @click="onClickItem('FuzzyOrderNumber')">订单编号</div>
                <div class="select-item" :class="{'active': curSearchType != 'FuzzyOrderNumber'}" @click="onClickItem('FuzzyCompanyName')">企业名称</div>
              </div>
            </div> -->
            <el-autocomplete
              ref="autoInput"
              v-model="queryString"
              :fetch-suggestions="orderSearch"
              :placeholder="searchPlaceholder"
              @select="handleSelect"
              @clear="getOrderData()"
              value-key="name"
              prefix-icon="el-icon-search"
              clearable
            >
              <template slot-scope="{ item }">
                <div class="name" v-if="item.id != '-1'" v-html="reFormatString(item.name)"></div>
                <div style="color: red;" v-else>{{item.name}}</div>
                <div
                  class="order-number"
                  style="font-size: 14px;color:#aaa;line-height: 20px;"
                  v-if="item.id != '-1'"
                  v-html="reFormatString(item.id)"
                ></div>
              </template>
            </el-autocomplete>
          </div>
          <el-checkbox v-model="onlyMe" label="custom" style="margin-left: 20px;" :disabled="$root.rights.findIndex(vv => vv == 'order_1_2') < 0" @change="searchQueryString(false)">只看我的</el-checkbox>
        </div>
        <div :class="[preCls + '-header-filter-right']"></div>
      </div>
    </div>
    <div :class="[preCls + '-content']">
      <div :class="[preCls + '-content-tabs']">
        <div :class="[preCls + '-content-tabs-modeArea']">
          <div @click="changeShowMode(showMode.ALL)" :class="showModeSelectClass(showMode.ALL)">
            <span>&nbsp;全部&nbsp;</span>
          </div>
          <div @click="changeShowMode(showMode.NEW)" :class="showModeSelectClass(showMode.NEW)">
            <i class="order-status-info" style="background-color:rgb(215, 219, 226)"></i>
            <span>新增</span>
          </div>
          <div @click="changeShowMode(showMode.ASSIGN)" :class="showModeSelectClass(showMode.ASSIGN)">
            <i class="order-status-info" style="background-color:rgb(180, 184, 191)"></i>
            <span>已指派</span>
          </div>
          <div @click="changeShowMode(showMode.DEFAULT)":class="showModeSelectClass(showMode.DEFAULT)">
            <i class="order-status-info" style="background-color:rgb(144, 147, 153)"></i>
            <span>未提交</span>
          </div>
          <div @click="changeShowMode(showMode.SUBMIT)" :class="showModeSelectClass(showMode.SUBMIT)">
            <i class="order-status-info" style="background-color:rgb(32, 160, 255)"></i>
            <span>已提交</span>
          </div>
          <div @click="changeShowMode(showMode.AUDIT)" :class="showModeSelectClass(showMode.AUDIT)">
            <i class="order-status-info" style="background-color:rgb(19, 206, 102)"></i>
            <span>已发送</span>
          </div>
          <div @click="changeShowMode(showMode.CANCELED)" :class="showModeSelectClass(showMode.CANCELED)">
            <i class="order-status-info" style="background-color:rgb(255, 73, 73)"></i>
            <span>已取消</span>
          </div>
          <div class="title-info">
            <span class="total-count-show">共<span style="color:#409EFF;">{{totalCount}}</span>个订单</span>
          </div>
        </div>
        <div :class="[preCls + '-content-tabs-cutLine']"></div>
      </div>
      <div :class="[preCls + '-content-showArea']" v-loading="isLoading" ref="showArea">
        <!-- <vue-scroll :ops="ops" ref='globel-scroll'  @handle-scroll="onScroll"> -->
        <div class="list-header">
          <div class="list-header-item list-header-item1">#</div>
          <div class="list-header-item list-header-item2" title="状态">状态</div>
          <div class="list-header-item list-header-item3" title="订单编号">订单编号</div>
          <div class="list-header-item list-header-item4" title="类型">类型</div>
          <div class="list-header-item list-header-item5" title="企业名称">企业名称</div>
          <div class="list-header-item list-header-item6" title="制单人">制单人</div>
          <div class="list-header-item list-header-item6" title="下单时间">下单时间</div>
          <div class="list-header-item list-header-item7" title="修改时间">修改时间</div>
          <div class="list-header-item list-header-item8">操作</div>
        </div>
        <div class="infinite-list-wrapper" style="overflow:auto">
          <div
            class="list list-container"
            v-infinite-scroll="searchQueryString"
            infinite-scroll-disabled="disabled"
          >
            <div v-for="(item, idx) in orderList" class="list-content">
              <div class="list-content-item">{{ idx + 1 }}</div>
              <div class="list-content-item">
                <i class="order-status" :style="statusStyle(item)"></i>
              </div>
              <div class="list-content-item" :title="item.OrderNumber">
                <a
                  href="javascript:void(0);"
                  class="list-content-text"
                  @click="onLinkToEdit(item)"
                >{{item.OrderNumber}}</a>
              </div>
              <div class="list-content-item">{{ item.Type == 1 ? '大数': '详财' }}</div>
              <div class="list-content-item" :title="item.CompanyName"> 
                <a
                  href="javascript:void(0);"
                  class="list-content-text"
                  @click="onLinkToEdit(item)"
                >{{item.CompanyName}}</a>
              </div>
              <div class="list-content-item" :title="item.Editor">{{item.Editor}}</div>
              <div class="list-content-item" :title="item.CreateTime">{{item.CreateTime}}</div>
              <div class="list-content-item" :title="item.LastModifyTime">{{item.LastModifyTime}}</div>
              <div class="list-content-item" >
                <!-- <el-button
                  type="text"
                  icon="el-icon-edit"
                  size="mini"
                  @click="onLinkToEdit(item)"
                >编辑</el-button> -->
                <el-button 
                    slot="reference"
                    type="text"
                    icon="el-icon-thumb"
                    v-show="item.Status == 0"
                    size="mini"
                    @click="onAssignTo(item)"
                  >指派给
                </el-button>
                
                <el-button
                  slot="reference"
                  type="text"
                  icon="el-icon-refresh-left"
                  v-show="item.Status == 1"
                  style="color:red;margin-left: 0px;width: 76px;"
                  size="mini"
                  @click="onCancelAssignTo(item)"
                >取消指派</el-button>
              </div>
            </div>
          </div>
          <div class="isLoading" v-if="loading">正在加载中，请稍后...</div>
          <div class="isLoading" v-if="noMore">没有更多了~~</div>
        </div>
        <!-- </vue-scroll> -->
      </div>
    </div>
    <div></div>
    <el-dialog
      title="订单指派"
      :visible.sync="dialogVisible"
      width="400px">
      <el-select v-model="assignUser" placeholder="请选择要指派的人员" style="width: 330px;margin-left: 20px;margin-bottom: 30px;">
        <el-option
          v-for="item in usersList"
          :key="item.Name"
          :label="item.Name"
          :value="item.Name">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="assignOrder">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const preCls = "orderMain";
const showMode = {
  ALL: "-2",
  NEW: "0",
  ASSIGN: "1",
  DEFAULT: "5",
  SUBMIT: "10",
  AUDIT: "20",
  CANCELED: "-1"
};
import mixin from "$mixin/mixin.js";
import TypeSelect from '$packages/others/searchType.vue'
export default {
  name: "orderMain",
  mixins: [mixin],
  components: { TypeSelect },
  data() {
    return {
      preCls,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "前天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 2);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      customDate: "",
      dateRange: "today",
      pageCount: 0,
      totalCount: 0,
      loading: false,
      showMode,
      queryString: "",
      noMore: false,
      isLoading: false,
      currentShowMode: showMode.ALL,
      orderList: [],
      isNoMoreData: false,
      currentPageInfo: {
        pageSize: 30,
        pageNum: 0
      },
      creatorLoading: false,
      creator: "",
      creatorrList: [],
      onlyMe: false,
      usersList: [],
      assignUser: '',
      dialogVisible: false,
      assignOrderNumber: '',
      menuList: [{
        Id: 'FuzzyOrderNumber',
        Name: '订单编号'
      }, {
        Id: 'FuzzyCompanyName',
        Name: '企业名称'
      }],
      showTypeSelect: false,
      curSearchType: 'FuzzyOrderNumber',
      searchPlaceholder: '',
    };
  },

  methods: {
    statusStyle(item) {
      let statusColor = "rgb(144, 147, 153)";
      switch (item.Status) {
        case -1: //已取消
        case "-1":
          statusColor = "rgb(255, 73, 73)";
          break;
        case 0: //新增
        case "0":
          statusColor = "rgb(215, 219, 226)";
          break;
        case 1: //已指派
        case "1":
          statusColor = "rgb(180, 184, 191)";
          break;
        case 5: //未提交;
        case "5":
          statusColor = "rgb(144, 147, 153)";
          break;
        case 10: //已提交
        case "10":
          statusColor = "rgb(32, 160, 255)";
          break;
        case 20: //已完成
        case "20":
          statusColor = "rgb(19, 206, 102)";
          break;
      }
      return {
        //蓝色：rgb(32, 160, 255) 橙色：rgb(230, 162, 60) 红色：rgb(255, 73, 73) 灰色：rgb(144, 147, 153) 绿色 rgb(19, 206, 102)
        "background-color": statusColor
      };
    },
    onLinkToEdit(item) {
      this.$router.push(
        `${this.preName}/order/orderEdit?type=${item.Type}&orderId=${item.OrderNumber}&companyId=${item.CompanyNumber}`
      );
    },
    onLinkToCompanyEdit(item) {
      this.$router.push(`${this.preName}/company/companyEdit?companyId=${item.CompanyNumber}`)
    },
    handleDateChangeSearch() {
      this.searchQueryString(false);
    },
    searchQueryString(isInitSearch = true) {
      this.currentPageInfo.pageNum = isInitSearch ? this.currentPageInfo.pageNum + 1 : 1
      this.getOrderData()
    },
    getOrderData() {
      let _ = this;
      this.isLoading = true;
      let qString = decodeURIComponent(this.queryString)
   
      let date = this.getSearchDate()
      let page = this.currentPageInfo

      this.http.get(`${this.preApiName}/financial/order-manage/orders?${this.curSearchType}=${qString}${
            this.currentShowMode == -2 ? `` : `&Status=${this.currentShowMode}`}${
            (this.$root.rights.findIndex(vv => vv == 'order_1_2') < 0  || this.onlyMe) ? `&Editor=${localStorage.getItem('UserName')}` :``
          }&OrderDate=${date}&Page=${page.pageNum}&PerPage=${page.pageSize}`
        )
        .then(res => {
          if (res.status !== 200) {
            _.isLoading = false;
            _.showMessage(`查询订单失败，原因：${res.data.error}！`, "error");
            return;
          }
          _.totalCount = res.data.totalCount;
          if (page.pageNum == 1) {
            _.orderList = res.data.data;
          } else {
            _.orderList = _.orderList.concat(res.data.data);
          }

          _.$nextTick(() => {
            _.isLoading = false;
          });
          // this.loading = false
          //阅读element源码得知suggestions
          this.$refs.autoInput.suggestions = [];
        })
        .catch(({ response }) => {
          this.loading = false;
          this.showMessage(
            `查询订单失败，原因：${response.data.error}！`,
            "error"
          );
          this.isLoading = false;
        });
    },
    handleSelect(item) {
      if (item.id == "-1") {
        this.queryString = ''
        return;
      }
      this.isLoading = true;
      this.http
        .get(
          `${this.preApiName}/financial/order-manage/orders?OrderNumber=${item.id}`
        )
        .then(res => {
          this.orderList = res.data.data;
          this.$nextTick(() => {
            this.isLoading = false;
          });
          //阅读element源码得知suggestions
          this.$refs.autoInput.suggestions = [];
        });
    },
    orderSearch(qString, cb) {
      if (qString == "") {
        cb([]);
        return
      }
      qString = decodeURIComponent(qString);

      let date = this.getSearchDate();
      this.http
        .get( `${this.preApiName}/financial/order-manage/orders?${this.curSearchType}=${qString}${
            this.currentShowMode == -2 ? `` : `&Status=${this.currentShowMode}`
          }${this.onlyMe ? `&Editor=${localStorage.getItem('UserName')}` : ``}&Page=1&PerPage=20`
        )
        .then(res => {
          let list = [];
          for (let item of res.data.data) {
            list.push({
              name: item.CompanyName,
              id: item.OrderNumber,
              createTime: item.CreateTime
            });
          }
          if (res.data.totalCount > 20) {
            list.push({
              name: `查询结果超过20个，超出不予显示`,
              id: "-1"
            });
          }
          cb(list);
        });
    },
    showModeSelectClass(mode) {
      return [
        preCls + "-content-tabs-item",
        {
          [preCls + "-content-tabs-item-select"]: mode == this.currentShowMode
        }
      ];
    },
    changeShowMode(mode) {
      this.currentShowMode = mode;
    },
    getSearchDate() {
      let currentTime = new Date();
      switch (this.dateRange) {
        case "today":
          return currentTime.Format("yyyy-MM-dd");
        case "yesterday":
          return this.addDays(currentTime, -1).Format("yyyy-MM-dd");
        case "custom":
          return this.customDate.Format("yyyy-MM-dd");
        case "":
          return "";
      }
    },
    getSearchTimeRange() {
      let currentTime = new Date();
      let tomorrow = new Date();
      tomorrow.setDate(currentTime.getDate() + 1);

      let yeterday = new Date();
      yeterday.setDate(currentTime.getDate() - 1);

      let EndDate;
      let StartDate;
      switch (this.dateRange) {
        case "today":
          StartDate = currentTime.Format("yyyy-MM-dd");
          EndDate = tomorrow.Format("yyyy-MM-dd");
          break;
        case "yesterday":
          StartDate = yeterday.Format("yyyy-MM-dd");
          EndDate = currentTime.Format("yyyy-MM-dd");
          break;
        case "custom":
          StartDate = currentTime.Format("yyyy-MM-dd");
          break;
        case "":
          StartDate = "";
          EndDate = "";
          break;
      }

      return { StartCreateTime: StartDate, EndCreateTime: EndDate };
    },
    onScroll(info) {
      if (info.process > 0.9 && !this.isLoading && !this.isNoMoreData) {
        this.addMoreData();
      }
    },
    addMoreData() {
      this.currentPageInfo.pageNum++;
      this.getOrderData();
    },
    reFormatString(name) {
      return name.replace(this.queryString, `<span style="color:#409EFF">${this.queryString}</span>`)
    },
    onAssignTo(item) {
      this.assignUser = ''
      this.assignOrderNumber = item.OrderNumber
      this.dialogVisible = true
    },
    assignOrder() {
      let _ = this
      let param = {
        Editor: this.assignUser,
        Operator: localStorage.getItem('UserName'),
        Orders: [{OrderNumber: this.assignOrderNumber}]
      }
      
      _.http.post(`${_.preApiName}/financial/order-manage/orders/assign-operation`, param).then(res => {
        if(res.status == 201) {
          _.orderList.map(v => {
            if(v.OrderNumber == _.assignOrderNumber){
              v.Status = 1
              v.Editor = _.assignUser
              v.visible = false
            }
          })
          _.dialogVisible = false
          _.showMessage(`指派订单成功！`, 'success', 1000)
        } else {
          _.showMessage(`指派失败`, 'error')
        }

        _.assignOrderNumber = ''
      })
    },
    onCancelAssignTo(item) {
      let _ = this
      _.$confirm(`确定取消指派订单给用户 ${item.Editor} 吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            OrderNumber: item.OrderNumber,
            Operator: localStorage.getItem('UserName')
          }
          _.http.delete(`${this.preApiName}/financial/order-manage/orders/assign-operation?OrderNumber=${item.OrderNumber}&Operator=${localStorage.getItem('UserName')}`, {data: param})
          .then(res => {
            if(res.status == 204) {
              _.showMessage(`取消指派订单成功！`, 'success', 1000)
              item.Status = 0
              item.Editor = ""
            } else {
              _.showMessage(`取消指派订单失败！`, 'error')
            }
          }).catch(err => {
            _.showMessage(`取消指派订单失败！`, 'error')
          })
        })
    },
    getUserList() {
      let _ = this
      _.http.get(`${this.preApiName}/financial/platform/users`).then(res => {
        if(res.status == 200) {
          let users = res.data.data.filter(v => {
            return v.Account != 'admin'
          })
          _.usersList = users
        }
      })
    },
    onClickItem(searchType) {
      this.curSearchType = searchType
      this.showTypeSelect = false
      this.searchPlaceholder = this.curSearchType == 'FuzzyOrderNumber' ? '请输入订单编号' : '请输入企业名称'
      this.queryString = ''
      this.$refs.autoInput.focus()
    },
    onTypeChanged(searchType) {
      this.curSearchType = searchType
      this.searchPlaceholder = this.curSearchType == 'FuzzyOrderNumber' ? '请输入订单编号' : '请输入企业名称'
      this.queryString = ''
      this.$refs.autoInput.focus()
    },
    createRandomOrder() {
      let _this = this;
      let lastType = 1;
      let year = 2020;
      let idx = 1;
      let type = 1;
      this.timer = setInterval(() => {
        let report1 = Math.ceil(Math.random() * 4)
        let report2 = Math.ceil(Math.random() * 4)
        if(report1 == report2) {
          report2 = report1 + 1 > 4 ? 3 : report1 + 1;
        }
        let data = {
          CompanyName: `长沙德鑫企业管理有限公司${idx}`,
          CompanyNumber: `ADEGDW457G54878${Math.floor(Math.random() * 1000)}`,
          Type: lastType,
          ReportingNeeds: `${year}_${report1},${year}_${report2}`
        };
        lastType = lastType == 1 ? 2 : 1;
        idx++;
        year = Math.floor(Math.random() * 10) % 2 == 0 ? 2019 : 2020;
        _this.http
          .post(`${this.preApiName}/financial/order-manage/orders`, data)
          .then(res => {
            console.log(res);
          });
      }, 100);
    }
  },
  created() {
    this.searchPlaceholder = this.curSearchType == 'FuzzyOrderNumber' ? '请输入订单编号' : '请输入企业名称'
    // this.createRandomOrder()
    this.getUserList()
    this.onlyMe = this.$root.rights.findIndex(vv => vv == 'order_1_2') < 0
  },
  watch: {
    currentShowMode() {
      this.queryString = "";
      this.searchQueryString(false);
    },
    dateRange() {
      this.queryString = "";
      if (this.dateRange !== "custom") {
        this.searchQueryString(false);
      }
    },
  },
  computed: {
    disabled() {
      return this.loading || this.noMore;
    },
  },
  destroyed() {
    clearInterval(this.timer)
  }
};
</script>

<style lang="less">
</style>
