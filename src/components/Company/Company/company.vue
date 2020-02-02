<template>
  <div class="big-container">
    <div
      class="company-search":style="{'margin-top': isSearched ? '0px' : '50px', top: isSearched? '80px' : '130px'}">
      <div>
        <span class="company-search-title">企业查询：</span>
        <el-autocomplete
          ref="searchInput"
          v-model="queryString"
          :fetch-suggestions="suggestionSearch"
          placeholder="请输入企业名称、缩写或统一编号"
          @select="handleSelect"
          @clear="getCompanyData()"
          :select-when-unmatched="true"
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
      <el-button type="primary" @click="onAddCompany" v-show="$root.rights.includes('company_1_1')">添加新企业</el-button>
    </div>
    <div class="company-container" v-if="companyList.length > 0">
      <vue-scroll :ops="ops" ref="globel-scroll">
        <div class="company-main">
          <div></div>
          <div class="company-item company-items-title">
            <div>#</div>
            <div>名称</div>
            <div>统一社会信用代码</div>
            <div>报表列表</div>
          </div>
          <div></div>
          <template v-for="(item, idx) in companyList">
            <div></div>
            <div  class="company-item company-items-item" @click="linkToCompany(item)" title="点击跳转到企业管理页面">
              <div>{{idx + 1}}</div>
              <div class="name" v-html="item.Name" ></div>
              <div class="number">{{item.CompanyNumber}}</div>
              <div class="company-reports-list">
                <div class="company"  v-for="report in item.Statements">
                  <div class="year">{{report.Year}}</div>
                  <div class="item">
                    <template v-for="ii in report.Reports" ><span :key="ii">{{getLabel(ii).substring(0, 1)}}</span></template>
                  </div>
                </div> 
              </div>
            </div>
            <div></div>
          </template>
          <div></div>
          <div class="more-company-info" v-if="moreThan100">结果超过100个，请修改条件进行更精确的查询</div>
        </div>
      </vue-scroll>
    </div>
    <el-dialog title="添加新企业" :visible.sync="addCompanyWndVisible" width="500px" @opened="$refs['Name'].focus();">
      <el-form
        :model="addCompanyForm"
        ref="ruleForm"
        :rules="rules"
        label-width="110px"
        class="demo-dynamic"
      >
        <el-form-item label="企业名称" prop="Name">
          <el-input v-model="addCompanyForm.Name" ref="Name"></el-input>
        </el-form-item>
        <el-form-item label="社会信用代码" prop="CompanyNumber">
          <el-input v-model="addCompanyForm.CompanyNumber"></el-input>
        </el-form-item>
      </el-form>
      <div class="error" style="color: red; padding-left: 30px;"  v-show="errOccured">{{ErrMsg}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addCompanyAction">确 定</el-button>
        <el-button @click="addCompanyWndVisible = false;errOccured = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const preCls = "company";
import mixin from "$mixin/mixin.js";
export default {
  name: 'company',
  mixins: [mixin],
  data() {
    var NameCheck = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入企业名称"));
      }
      callback();
    };
    var NumberCheck = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入企业的统一社会信用代码"));
      }
      callback();
    };
    return {
      preCls,
      company: "",
      queryString: "",
      companyLoading: false,
      companyList: [],
      isSearched: false,
      moreThan100: false,
      addCompanyForm: {
        Name: '',
        CompanyNumber:'',
        Description: ''
      },
      addCompanyWndVisible: false,
      rules: {
        Name: [{ required: true, validator: NameCheck, trigger: "blur" }],
        CompanyNumber: [{ required: true, validator: NumberCheck, trigger: "blur" }],
      },
      errOccured: true,
      ErrMsg: '',
    };
  },
  mounted() {
    this.$refs["searchInput"].focus();
  },
  methods: {
    suggestionSearch(qString, cb) {
      if (qString == "") {
        cb([]);
        return;
      }
      qString = decodeURIComponent(qString);
      this.http
        .get(`${this.preApiName}/financial/company-manage/companies?FuzzyQuery=${qString}&Page=1&PerPage=20`)
        .then(res => {
          let list = [];
          for (let item of res.data.data) {
            list.push({
              name: item.Name,
              id: item.CompanyNumber
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
    handleSelect(item) {
      let _ = this;
      if (item.id == "-1" || item.value == "") {
        _.queryString = "";
        return;
      }
      if (!!item.id && item.id != "") {
        _.$router.push(`${_.preName}/company/companyEdit?companyId=${item.id}`);
      } else {
        _.http
          .get(
            `${_.preApiName}/financial/company-manage/companies/detail?FuzzyQuery=${item.value}&Page=1&PerPage=100`
          )
          .then(res => {
            _.companyList = res.status == 200 ? res.data.data : [];
            this.moreThan100 = res.data.totalCount > 100
            _.isSearched = true;
          });
      }
    },
    onAddCompany(){
      this.addCompanyWndVisible = true
      this.$refs["ruleForm"].resetFields()
    },
    addCompanyAction() {
      let _ = this
      if(!_.getValidateStatus()) return

       _.http
        .post(`/financial/company-manage/companies`, _.addCompanyForm)
        .then(res => {
          if (res.status == 201) {
            _.errOccured = false
            _.addCompanyWndVisible = false
            _.companyList.unshift({..._.addCompanyForm})
            _.isSearched = true;
          }
        })
        .catch(err => {
          if(err.response.status == 422) {
            _.errOccured = true
            _.ErrMsg = err.response.data.Message
          }
        });
    },
    getCompanyData() {
      return;
    },
    getValidateStatus() {
      let validStatus = false;
      this.$refs["ruleForm"].validate(valid => {
        validStatus = valid;
      });
      return validStatus;
    },
    reFormatString(name) {
      return name.replace(
        this.queryString,
        `<span style="color:#409EFF">${this.queryString}</span>`
      );
    },
    linkToCompany(item) {
      this.$router.push(
        `${this.preName}/company/companyEdit?companyId=${item.CompanyNumber}`
      );
    }
  }
};
</script>