<template>
  <div class="big-container">
    <div class="company-search" :style="{'margin-top': isSearched ? '0px' : '50px', top: isSearched? '80px' : '130px'}">
      <div>
        <el-button style="float: left;margin-right: 10px;" @click="onFresh"><i class="el-icon-refresh"></i>刷新最新</el-button>
        <type-select :menuList="menuList" @on-type-changed="onTypeChanged"></type-select>
        <el-autocomplete
          ref="searchInput"
          v-model="queryString"
          :fetch-suggestions="suggestionSearch"
          :placeholder="searchPlaceholder"
          @select="handleSelect"
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

    <div class="company-totalcount" :style="{'margin-top': isSearched ? '0px' : '80px', top: isSearched? '80px' : '160px', right: isSearched ? '20px' : 'calc(50vw - 150px)'}">
      共 <span style="color: #409EFF;font-size: 20px;"><ICountUp :delay="10" :endVal="TotalCompanyCount" :options="options"/> </span> 个企业
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
            <div>操作</div>
          </div>
          <div></div>
          <template v-for="(item, idx) in companyList">
            <div></div>
            <div  class="company-item company-items-item">
              <div>{{((currentPage - 1) * 100 + idx + 1)}}</div>
              <div class="name" :style="{'font-size': item.Name.length > 20 ? '16px' : '18px'}" v-html="item.Name" @click="linkToCompany(item)" :title="item.Name"></div>
              <div class="number" @click="linkToCompany(item)" title="点击跳转到企业管理页面">{{item.CompanyNumber}}</div>
              <div class="company-reports-list">
                <div class="company"  v-for="report in item.Statements">
                  <div class="year">{{report.Year}}</div>
                  <div class="item">
                    <template v-for="ii in report.Reports" ><span :key="ii">{{getLabel(ii).substring(0, 1)}}</span></template>
                  </div>
                </div> 
              </div>
              <div>
                <el-button type="default" v-show="$root.rights.includes('company_1_2')" @click="onEdit(item)" size="small">编辑</el-button>
                <el-button type="danger" v-show="$root.rights.includes('company_1_3')" @click="onDelete(item)" size="small">删除</el-button>
              </div>
            </div>
            <div></div>
          </template>
          <div></div>
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="100"
            layout="total, prev, pager, next"
            :total="curSearchCount">
          </el-pagination>
        </div>
      </vue-scroll>
    </div>
    <el-dialog :title="isEdit ? '修改企业名称' : '添加新企业'" :visible.sync="addCompanyWndVisible" width="500px" @opened="$refs['Name'].focus();">
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
          <el-input v-model="addCompanyForm.CompanyNumber" :disabled="isEdit"></el-input>
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
import TypeSelect from '$packages/others/searchType.vue'
import ICountUp from "vue-countup-v2";
export default {
  name: 'company',
  mixins: [mixin],
  components: {
    TypeSelect, ICountUp
  },
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
      } else if(value.length > 18) {
        callback(new Error("企业的统一社会信用代码不能超过18个字符"));
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
      isEdit: false,
      TotalCompanyCount: 0,
      curSearchCount: 0,
      currentPage: 1,
      options: {
        useEasing: true,
        useGrouping: true,
        separator: ",",
        decimal: ".",
        prefix: "",
        suffix: "",
        duration: 2
      },
      addCompanyForm: {
        Name: '',
        CompanyNumber:'',
        Description: '',
        Operator: '',
      },
      addCompanyWndVisible: false,
      rules: {
        Name: [{ required: true, validator: NameCheck, trigger: "blur" }],
        CompanyNumber: [{ required: true, validator: NumberCheck, trigger: "blur" }],
      },
      errOccured: true,
      ErrMsg: '',
      menuList: [{
        Id: 'FuzzyName',
        Name: '企业名称'
      }, {
        Id: 'FuzzyCompanyNumber',
        Name: '信用代码'
      }],
      curSearchType: "FuzzyName",
      searchPlaceholder: '请输入企业名称',
    };
  },
  mounted() {
    let _ = this
    _.http.get(`${_.preApiName}/financial/statistics/company-count`).then(res => {
      if(res.status === 200) {
        _.TotalCompanyCount = res.data.Count
      }
    })
  },
  methods: {
    suggestionSearch(qString, cb) {
      if (qString == "") {
        cb([]);
        return;
      }
      qString = decodeURIComponent(qString);
      this.http.get(`${this.preApiName}/financial/company-manage/companies?${this.curSearchType}=${qString}&Page=1&PerPage=20`)
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
        _.getCompaniesByPage(1, this.curSearchType, item.value)
      }
    },
    onAddCompany(){
      this.isEdit = false
      this.addCompanyWndVisible = true
      this.$refs["ruleForm"].resetFields()
      this.addCompanyForm = {
        Name: '',
        CompanyNumber:'',
        Description: '',
      }
    },
    addCompanyAction() {
      let _ = this
      if(!_.getValidateStatus()) return

       _.isEdit ? _.http.put(`${this.preApiName}/financial/company-manage/companies?CompanyNumber=${_.addCompanyForm.CompanyNumber}`, {
           Name: _.addCompanyForm.Name,
           Operator: localStorage.getItem('UserName'),
         
       }).then(res => {
         if(res.status == 201) {
           _.errOccured = false
           _.addCompanyWndVisible = false
           let idx = _.companyList.findIndex(v => {
             return v.CompanyNumber == _.addCompanyForm.CompanyNumber
           })
           if(idx >= 0) _.companyList[idx].Name = _.addCompanyForm.Name
           _.showMessage(`修改企业名称成功！`, 'success')
         }
       }) :
       _.http.post(`${this.preApiName}/financial/company-manage/companies`, {..._.addCompanyForm, Operator: localStorage.getItem('UserName')})
        .then(res => {
          if (res.status == 201) {
            _.errOccured = false
            _.addCompanyWndVisible = false
            this.$router.push(`${this.preName}/company/companyEdit?companyId=${_.addCompanyForm.CompanyNumber}`)
            _.isSearched = true;
            _.TotalCompanyCount++
          }
        })
        .catch(err => {
          if(err.response.status == 422) {
            _.errOccured = true
            _.ErrMsg = err.response.data.Message
          }
        });
    },
    getValidateStatus() {
      let validStatus = false
      this.$refs["ruleForm"].validate(valid => {
        validStatus = valid
      })
      return validStatus
    },
    reFormatString(name) {
      return name.replace(
        this.queryString,
        `<span style="color:#409EFF">${this.queryString}</span>`
      );
    },
    linkToCompany(item) {
      this.$router.push(`${this.preName}/company/companyEdit?companyId=${item.CompanyNumber}`)
    },
    onTypeChanged(searchType) {
      this.curSearchType = searchType
      this.searchPlaceholder = searchType == 'FuzzyCompanyNumber' ? '请输入统一信用社会代码' : '请输入企业名称'
      this.queryString = ''
      this.$refs.searchInput.focus()
    },
    onFresh() {
      this.getCompaniesByPage(1)
    },
    getCompaniesByPage(page, searchType = undefined, queryString = undefined) {
      let _ = this,
          query = searchType == undefined ? `?Page=${page}&PerPage=100` : `?${searchType}=${queryString}&Page=${page}&PerPage=100`
      _.http.get(`${_.preApiName}/financial/company-manage/companies/detail${query}`)
        .then(res => {
          _.companyList = res.status == 200 ? res.data.data : [];
          this.curSearchCount = res.data.totalCount
          _.isSearched = true;
        })
    },
    onEdit(item) {
      this.isEdit = true
      this.addCompanyWndVisible = true
      this.addCompanyForm = this.deepCopy(item)
    },
    onDelete(item) {
      this.$confirm(`将删除企业的所有财务信息，确定删除企业[${item.Name}]吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.http.delete(`${this.preApiName}/financial/company-manage/companies?CompanyNumber=${item.CompanyNumber}`).then(res => {
            if(res.status === 204) {
              let idx = this.companyList.findIndex(v => {
                return v.CompanyNumber == item.CompanyNumber
              })
              idx >= 0 && this.companyList.splice(idx, 1)
              this.TotalCompanyCount--
              this.showMessage(`删除企业成功！`, 'success')
            } else {
              this.showMessage('删除企业失败！', 'error', 5000)
            }
          })
        })
    },
    handleCurrentChange() {
      this.getCompaniesByPage(this.currentPage, this.curSearchType, this.queryString)
    },
  }
};
</script>