<template>
  <vue-scroll :ops="ops">
    <div :class="['small-container']">
      <div :class="[preCls + '-header']">
        <aom-header parentTitle="角色管理" :mainTitle="isEdit ? '角色编辑' : '新建角色'" @aom-go-back="backPath"></aom-header>
        <div class="main-header-nav">
          <aom-edit-tips editTipsName="角色编辑" :editItemName="currentItemName"></aom-edit-tips>
        </div>
      </div>

      <div :class="[preCls + '-content']">
        <div :class="['edit-object-title']">角色信息</div>
        <div :class="[preCls + '-content-form']">
          <el-form :model="currentInfo" label-width="100px" :rules="rules" ref="ruleForm">
            <el-form-item label="角色名称" prop="Name">
              <el-input
                type="text"
                autocomplete="off"
                placeholder="请输入角色名称"
                v-model="currentInfo.Name"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="管理员" prop="ParentId">
              <el-radio-group v-model="currentInfo.IsAdmin">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item> -->
            <el-form-item label="描述" prop="Description">
              <el-input type="textarea" v-model="currentInfo.Description" placeholder="请输入描述信息"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div :class="['edit-object-title']">角色权限</div>
        <div :class="[preCls + '-content-main']">
          <div class="treelist-item" v-for="(item, key) in allRightList">
            <div class="treelist-self">
              <div class="treelist-item-left">
                <div class="treelist-item-left-icon" @click="clickIcon(item)">
                  <i :class="['iconfont', item.isOpen ? 'icon-down' : 'icon-right']"></i>
                </div>
                <div
                  class="treelist-item-left-circle"
                  :style="{backgroundColor: circleBcgArr[key > 6 ? key - 7 : key]}"
                >{{item.Name[0]}}</div>
                <div class="treelist-item-left-info">{{item.Name}}</div>
              </div>
              <div class="treelist-item-right">
                <el-switch
                  class="module-switch"
                  v-model="item.isEnabled"
                  active-color="#1296db"
                  inactive-color="#8a8a8a"
                  @change="moduleRightChange(item)"
                  :width="60"
                ></el-switch>
              </div>
            </div>
            <div class="treelist-child" v-if="item.Functions.length > 0 && item.isOpen">
              <div class="treelist-item" v-for="(Functions, index) in item.Functions">
                <div class="treelist-self">
                  <div class="treelist-item-left">
                    <div
                      class="treelist-item-left-circle"
                      :style="{backgroundColor: circleBcgArr[index > 6 ? index % 7 : index]}"
                    >{{Functions.label[0]}}</div>
                    <div class="treelist-item-left-info">{{Functions.label}}</div>
                  </div>
                  <div class="treelist-item-right">
                    <div class="right-switch" v-for="node in Functions.functions">
                      <el-switch
                        v-model="node.checked"
                        active-color="#1296db"
                        inactive-color="#8a8a8a"
                        @change="onRightChanged(item, Functions, node, $event)"
                        :width="40"
                        :disabled="!item.isEnabled"
                      ></el-switch>
                      <div class="right-name">{{node.label}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="aom-common-footer">
        <aom-common-buttons @parentSave="save" @parentCancel="backPath"></aom-common-buttons>
      </div>
    </div>
  </vue-scroll>
</template>

<script>
import mixin from "$mixin/mixin";
import AomHeader from "$packages/frame/aom-header";
import AomEditTips from "$packages/frame/aom-edit-tips";
import AomCommonButtons from "$packages/frame/aom-common-buttons";

const circleBcgArr = [
  "#E8EAF6",
  "#E3F2FD",
  "#E0F2F1",
  "#F3E5F5",
  "#FBE9E7",
  "#FFEBEE",
  "#EEEEEE"
];
const preCls = "roleEdit";
export default {
  name: "roleEdit",
  mixins: [mixin],
  components: { AomHeader, AomEditTips, AomCommonButtons },
  data() {
    var validName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入角色名称！"));
      } else {
        callback();
      }
    };
    return {
      preCls,
      isEdit: true,
      currentItemName: "",
      currentInfo: {
        Name: "",
        IsAdmin: 0,
        Description: ""
      },
      rules: {
        Name: [{ required: true, validator: validName, trigger: "blur" }]
      },
      isAdmin: true,
      circleBcgArr,
      rightList: [],
      copyRight: [],
      allRightList: [], //所有的权限列表
      roleInfo: {},
      editContentName: "",
    };
  },
  created() {
    let id,
      _ = this
    let roleId = (id = this.$route.query.id);
    if (id) {
      this.http.get(`${this.preApiName}/financial/platform/roles?Id=${id}`)
        .then(res => {
          let item = res.data.data.length > 0 ? res.data.data[0] : _.currentInfo
          _.currentItemName = _.currentInfo.Name = item.Name
          _.currentInfo.Description = item.Description
          _.currentInfo.IsAdmin = item.IsAdmin
          _.isEdit = true

          //权限处理
          let data = res.data.data;
          data.length > 0 ? (_.roleInfo = res.data.data[0]) : _.showMessage(`该角色不存在，请重新查询`, "error")

          _.allRightList = Object.assign(_.allRightList, _.roleInfo.Rights)
          _.editContentName = _.roleInfo.Name
        })
        .catch(({ response }) => {
          this.showMessage( `获取角色信息失败，原因：${response.data.error}！`, "error")
        })
    } else {
      this.isEdit = false
    }

    _.http.get(`${this.preApiName}/financial/platform/modules`).then(res => {
      let rights = res.status == 200 ? res.data.data : []
      rights.forEach(v => {
        v.Functions = JSON.parse(v.Functions);
        v.isEnabled = false

        v.Functions.map(vv => {
            vv.functions.map(vvv => {
                vvv.checked = false
            })
        })

        v.isOpen = false
      });

      _.allRightList = Object.assign(rights, _.roleInfo.Rights)
    })
  },
  methods: {
    save() {
      if (this.getValidateStatus()) {
        this.editInfo()
      }
    },
    async editInfo() {
      let isEdit = this.isEdit
      let currentInfo = this.currentInfo
      let item = {
        Name: this.myTrim(currentInfo.Name),
        Description: this.myTrim(currentInfo.Description),
        Rights: "",
        IsAdmin: currentInfo.IsAdmin,
        CreateUser: this.$root.account
      };
      try {
        let result = await this.http[isEdit ? "put" : "post"](`${this.preApiName}/financial/platform/roles${
            isEdit ? `?Id=${this.$route.query.id}` : ""
          }`,
          item
        );

        this.saveRight(result.data.Id);
      } catch (e) {
        this.showMessage(e.response.data.error, "error");
      }
    },
    backPath() {
      this.$router.go(-1)
    },
    getInfo() {
      this.getValidateStatus();
    },
    getValidateStatus() {
      let validStatus = false;
      this.$refs["ruleForm"].validate(valid => {
        validStatus = valid;
      });
      return validStatus;
    },
    saveRight(id) {
      let roleInfo = this.roleInfo
      if (!roleInfo.Id) roleInfo.Id = id
      this.http.put(`${this.preApiName}/financial/platform/roles?Id=${roleInfo.Id}`, {
          Rights: this.allRightList
        }).then(res => {
          this.showMessage(!this.isEdit ? '新建角色成功' : `更新角色成功！`, "success")
          this.backToMain()
        })
        .catch(({ response }) => {
          this.showMessage(
            this.isEdit ? `更新权限失败，原因：${response.data.error}！`: '新建角色失败',
            "error"
          )
        })
    },
    clickIcon(item) {
      item.isOpen = !item.isOpen
    },
    getFormatRights() {
      let rightArr = []
      this.copyRight.map(item => {
        if (!item.isEnabled) return;
        let node = {}
        node.Type = item.Type
        node.UrlPrefix = item.UrlPrefix
        node.Sort = item.Sort
        let nodeRight = []
        item.Functions.map(res => {
          let rightStringArr = []
          let rights = res.right
          Object.keys(rights).map(sr => {
            rights[sr] ? rightStringArr.push(sr) : null
          });
          let rightString = rightStringArr.toString()
          if (rightString) {
            nodeRight.push({
              Method: rightString,
              Name: res.Name,
              Url: res.Url
            })
          }
        });
        node.Functions = nodeRight
        rightArr.push(node)
      })

      return rightArr
    },
    getRightName(node) {
      const name = {
        POST: "新建",
        DELETE: "删除",
        PUT: "更新",
        GET: "查询"
      };
      return name[node];
    },
    moduleRightChange(item) {
      item.Functions = typeof item.Functions == "string" ? JSON.parse(item.Functions) : item.Functions;
      item.Functions.forEach(r => {
        let functions = r.functions;
        r.checked = item.isEnabled;
        for (let o in functions) {
          functions[o].checked = item.isEnabled;
        }
      });
    },
    onRightChanged(item, Func, node, checked) {
      let allRights = this.deepCopy(this.allRightList);

      let m_module = allRights.find(
        v => v.id == item.id && v.Flag == item.Flag
      );

      let m_Func = m_module.Functions.find(v => v.id == Func.id);

      let m_node = m_Func.functions.find(v => v.id == node.id);

      m_node.checked = checked;

      this.allRightList = allRights;
    }
  }
};
</script>

<style lang="less" scoped>
@preCls: ~"roleEdit";

.fontBlodStyle() {
  font-family: ~"微软雅黑 Bold", ~"微软雅黑 Regular", ~"微软雅黑";
  font-weight: 700;
  font-style: normal;
  font-size: 20px;
  color: #515151;
}

.@{preCls} {
  padding: 20px 30px;

  &-header {
    border-bottom: 1px solid #ebeef5;
    margin-bottom: 20px;
    &-title {
      .fontBlodStyle();
      font-size: 20px;
      font-weight: 700;
      padding-bottom: 15px;
      &-left {
        color: #aeaeae;
      }
      &-right {
        color: #545454;
      }
    }
  }

  &-content {
    &-title {
      width: max-content;
      .fontBlodStyle();
      font-size: 18px;
      border-bottom: 3px solid #409eff;
      line-height: 30px;
      margin-bottom: 20px;
    }

    &-form {
      padding: 0 100px;

      &-container {
        height: 100px;
        width: 100%;
        padding: 10px 20px;
        border: 1px solid #e4e4e4;
        font-size: 18px;
      }

      .container-right {
        font-weight: 800;
      }

      .el-select {
        width: 100%;
      }
    }
  }
  &-content {
    &-main {
      padding: 0 100px;
    }
  }
}
.aom-common-footer {
  margin: 30px 0 60px 0;
}

.treelist-item {
  width: 100%;
  padding-top: 10px;
}
.treelist-self {
  height: 60px;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: space-between;
  border-bottom: 1px solid #dbdbdb;
}
.treelist-child {
  padding-left: 110px;
}
.treelist-item-left {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: space-between;
  height: 100%;
  line-height: 60px;
}
.treelist-item-right {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: space-between;
}
.module-switch {
  margin-right: 10px;
  .el-switch__core {
    height: 30px;
    border-radius: 15px;
  }
  .el-switch__core::after {
    width: 25px;
    height: 26px;
  }
  &.is-checked .el-switch__core::after {
    margin-left: -25px;
  }
}
.right-switch {
  margin-right: 15px;
  .el-switch__core {
    border-radius: 5px;
  }
}
.treelist-item-left-icon {
  height: 100%;
  line-height: 60px;
  text-align: center;
  cursor: pointer;
  margin-right: 10px;

  .iconfont {
    font-size: 28px;
  }
}
.treelist-item-left-circle {
  width: 44px;
  height: 44px;
  line-height: 44px;
  border-radius: 22px;
  color: #000000;
  margin-right: 10px;
  text-align: center;
}
.treelist-item-left-info {
  text-align: left;
  line-height: 60px;
  .fontBlodStyle();
  font-size: 16px;
}
.right-name {
  text-align: center;
}
</style>
