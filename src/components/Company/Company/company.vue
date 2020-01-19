<template>
  <div class="big-container">
    <div class="company-search " :class="{'init-status': !isSearched, 'animation': isSearched}">
      <div>
        <span class="company-search-title">企业查询：</span>
        <el-autocomplete
          ref="searchInput"
          v-model="queryString"
          :fetch-suggestions="suggestionSearch"
          placeholder="请输入企业名称或缩写"
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
    </div>
    <div class="company-container" v-if="companyList.length > 0">
      <vue-scroll :ops="ops" ref="globel-scroll">
        <div class="company-main">
          <template v-for="(item, idx) in companyList">
            <div class="company-item" @click="linkToCompany(item)" title="点击跳转到企业财务管理" :key="idx">
                  <div class= 'name' v-html="item.Name"></div>
                  <div class="number">{{item.CompanyNumber}}</div>
            </div>
          </template>
        </div>
      </vue-scroll>
    </div>
  </div>
</template>

<script>
const preCls = "company";
import mixin from "$mixin/mixin.js";
export default {
  mixins: [mixin],
  data() {
    return {
      preCls,
      company: "",
      queryString: "",
      companyLoading: false,
      companyList: [],
      isSearched: false
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
        .get(
          `${this.preApiName}/financial/company-manage/companies?FuzzyQuery=${qString}&Page=1&PerPage=20`
        )
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
        let _ = this
      if (item.id == "-1" || item.value == "") {
        _.queryString = "";
        return;
      }
      if (!!item.id && item.id != "") {
        _.$router.push(
          `${_.preName}/company/companyEdit?companyId=${item.id}`
        );
      } else {
          this.isSearched = true
        _.http
          .get(
            `${_.preApiName}/financial/company-manage/companies?FuzzyQuery=${item.value}&Page=1&PerPage=20`
          )
          .then(res => {
            _.companyList = res.status == 200 ? res.data.data : [];
          });
      }
    },
    getCompanyData() {
      return;
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

<style lang="less" scoped>

</style>