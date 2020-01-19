<template>
    <div :class="[preCls]">
        <div :class="[preCls + '-item']" v-for="(item, key) in copyTreeData">
            <div :class="[preCls + '-self']" @dblclick="showIcon && clickIcon(item)">
                <div :class="[preCls + '-item-left']">
                    <div :class="[preCls + '-item-left-icon']"  v-if="showIcon" @click=" item[childTreeName] && item[childTreeName].length > 0 && clickIcon(item)">
                        <i :class="['iconfont', item.isOpen ? 'icon-down' : 'icon-right', item[childTreeName] && item[childTreeName].length > 0 ? '' : 'icon-line']"></i>
                    </div>
                    <slot name="leftIcon">
                        <div :class="[preCls + '-item-left-circle']" :style="{backgroundColor: circleBcgArr[item.randomIndex]}">
                            {{item.Name ? funSubstring(item.Name) : funSubstring(item.Type)}}
                        </div>
                    </slot>    
                    <div :class="[preCls + '-item-left-info']">
                        <div :class="[preCls + '-item-left-info-name']">
                            <span @click="clickName(item)" :class="['span-msg-skip', noLink ? 'no-link' : '']" :title="item.Name ? item.Name : item.Type">{{item.Name ? item.Name : item.Type}}</span>
                            <slot name="afterName" :item="item"></slot>
                        </div>
                        <div :class="[preCls + '-item-left-info-describe']">
                            <slot name="description" :item="item" :title="item.Description || item.Memo || item.AreaName">{{item.Description || item.Memo || item.AreaName}}</slot>
                        </div>
                    </div>
                </div>
                <div :class="[preCls + '-item-right']">
                    <slot name="beforeButton" :item="item"></slot>
                    <el-button :class="[preCls + '-item-right-button']" v-if="showEdit(item)" @click="editItem(item)">编辑</el-button>
                    <el-button type="danger" :class="[preCls + '-item-right-button']" v-if="showDelete(item)" :disabled="sortDelete && key != copyTreeData.length - 1" @click="deleteItem(item)">删除</el-button>
                </div>
            </div>
            <div :class="[preCls + '-child']" v-if="item[childTreeName] && item[childTreeName].length > 0 && item.isOpen">
                <treelist :showIcon="showIcon" :noLink="noLink" @clickName="clickName" :childTreeName="childTreeName" :showEdit="showEdit" :open="open" :treeListData="item[childTreeName]" @editItem="editItem" @deleteItem="deleteItem">
                    <template v-for="slot in Object.keys($scopedSlots)" :slot="slot" slot-scope="scope"><slot :name="slot" v-bind="scope"/></template>
                </treelist>    
            </div>
        </div>
    </div>
</template>

<script>
    import mixin from '$mixin/mixin.js'
    import treelist from './treelist'
    
    const circleBcgArr = [
        '#E8EAF6',
        '#E3F2FD',
        '#E0F2F1',
        '#F3E5F5',
        '#FBE9E7',
        '#FFEBEE',
        '#EEEEEE',
    ]
    const preCls = 'treelist'

    export default {
        name: 'treelist',
        mixins: [mixin],
        components: {
            treelist,
        },
        props: {
            treeListData: {
                type: Array,
                default() {
                    return []
                }
            },
            showIcon: {
                type: Boolean,
                default() {
                    return true
                }
            },
            sortDelete: {
                type: Boolean,
                default() {
                    return false
                }
            },
            childTreeName: {
                type: String,
                default() {
                    return 'ChildAreas'
                }
            },
            open: {
                type: Boolean,
                default() {
                    return false
                }
            },
            showDelete: {
                type: Function,
                default() {
                    return ()=>{
                        return true
                    }
                }
            },
            showEdit: {
                type: Function,
                default() {
                    return ()=>{
                        return true
                    }
                }
            },
            noLink: {
                type: Boolean,
                default() {
                    return false
                }
            }
        },
        data () {
            return {
                preCls,
                copyTreeData: [],
                circleBcgArr
            }
        },
        watch: {
            treeListData: {
                handler(n) {
                    this.copyTreeData = this.deepCopy(n)
                    this.copyTreeData.forEach( item => {
                        this.$set(item, 'randomIndex', Math.floor(Math.random() * this.circleBcgArr.length))
                        this.$set(item, 'isOpen', this.open)
                    })
                },
                immediate: true,
                deep: true
            }
        },
        methods: {
            clickIcon(item) {
                if(item.isOpen == undefined){
                    this.$set(item, 'isOpen', true)
                }else{
                    item.isOpen = !item.isOpen
                }
            },
            editItem(item) {
                this.$emit('editItem', item)
            },
            deleteItem(item) {
                this.$emit('deleteItem', item)
            },
            clickName(item) {
                this.$emit('clickName', item)
            },
            funSubstring(name){
                let newName;
                if(!!name){
                    name = $.trim(name);
                    newName = name.substring(1,0);
                }
                return newName;
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    @preCls: ~'treelist';

    .@{preCls}{
        width: 100%;
        @itemHeight: 70px;

        .flex() {
            display: flex;
            align-items: center;
            align-content: center;
            justify-content: space-between;
        }

        .no-link:hover{
            cursor: default !important;
            border-bottom: none !important;
        }

        &-self{
            height: @itemHeight;
            .flex();
            border-bottom: 1px solid #ebeef5;
        }

        &-child{
            padding-left: 110px;
        }

        &-child {
            .@{preCls}-item:last-child{
                border-bottom: none;
            }
        }

        &-item{
            width: 100%;
            // padding-top: 10px;
            
            @marginRight: 10px;
            &-left{
                .flex();
                height: 100%;
                line-height: @itemHeight;
                width: calc(100% - 400px);
                justify-content: flex-start;
                &-icon{
                    height: 100%;
                    line-height: @itemHeight;
                    text-align: center;
                    cursor: pointer;
                    margin-right: @marginRight;

                    .iconfont{
                        font-size: 28px;
                    }
                }

                &-circle{
                    font-size: 14px;
                    display: inline-block;
                    width: 44px;
                    height: 44px;
                    line-height: 44px;
                    text-align: center;
                    border-radius: 50%;
                    margin-right: @marginRight;
                }

                &-info{
                    text-align: left;
                    height: 70px;
                    width: calc(100% - 54px);
                    &-name{
                        // height: 40px;
                        // line-height: 45px;
                        // font-weight: 700;
                        // // font-family: ~'微软雅黑 Bold', ~'微软雅黑 Regular', ~'微软雅黑';
                        // cursor: pointer;
                        max-width: calc(100% - 20px);
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                        font-size: 16px;
                        font-weight: 700;
                        height: 40px;
                        line-height: 50px;
                    }
                    &-name > span:first-child:hover{
                        cursor: pointer;
                        border-bottom: solid 1px black;
                    }

                    &-describe{
                        height: 25px;
                        line-height: 20px;
                        font-size: 14px;
                        color: #999999;
                        max-width: calc(100% - 20px);
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                }
            }

            &-right{
                .flex();

                &-button{
                    width: 100px;
                }
                .el-button--danger {
                    background-color: rgb(204, 0, 0);
                }
            }
        }
    }
</style>
