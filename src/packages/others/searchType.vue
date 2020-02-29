<template>
  <div class="search-type" @mouseenter="showTypeSelect = true" @mouseleave="showTypeSelect = false">
    <span v-html="curSearchTypeName"></span>
    <span class="el-icon-caret-bottom"></span>
    <div class="search-container" v-show="showTypeSelect">
      <div
        v-for="item in menuList"
        :key="item.Id"
        class="select-item"
        :class="{'active': curSearchType == item.Id}"
        @click="onClickItem(item.Id, item.Name)"
      >{{item.Name}}</div>
    </div>
  </div>
</template>

<script>
export default {
    props: {
        menuList: {
            type: Array,
            default() {
                return []
            }
        }
    },
    data() {
        return {
            curSearchTypeName: "",
            curSearchType: "",
            showTypeSelect: false,
        }
    },
    created() {
        this.curSearchTypeName = this.menuList.length > 0 ? this.menuList[0].Name : ''
        this.curSearchType= this.menuList.length > 0 ? this.menuList[0].Id : ''
    },
    methods: {
        onClickItem(Id, Name) {
            this.showTypeSelect = false
            this.curSearchType = Id
            this.curSearchTypeName = Name
            this.$emit('on-type-changed', Id)
        }
    },
};
</script>

<style lang="less" scoped>
.search-type {
  position: relative;
  display: block;
  text-align: center;
  font-size: 14px;
  width: 90px;
  border: 1px solid #dcdfe6;
  height: 38px;
  line-height: 35px;
  margin-right: -6px;
  float: left;
  border-radius: 5px 0 0 5px;

  .search-container {
    position: absolute;
    top: 38px;
    width: 84px;
    height: 90px;
    border: 1px solid #dcdfe6;
    border-radius: 0 0 5px 5px;
    z-index: 1000;
    background: #fff;

    .select-item {
      height: 40px;
      line-height: 40px;
      text-align: center;
      background-color: #fff;
      &:hover {
        background-color: #409eff;
        color: white;
        cursor: pointer;
      }
    }
    .select-item.active {
      background-color: #409eff;
      color: white;
    }
  }
}

</style>