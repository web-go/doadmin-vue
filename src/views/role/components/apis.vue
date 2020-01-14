<template>
  <div>
    <div class="clearflex">
      <el-button
        class="fl-right"
        size="small"
        type="primary"
        @click="authApiEnter"
      >
        确 定
      </el-button>
    </div>
    <el-tree
      ref="apiTree"
      :data="apiTreeData"
      :default-checked-keys="apiTreeIds"
      :props="apiDefaultProps"
      default-expand-all
      highlight-current
      node-key="id"
      show-checkbox
    />
  </div>
</template>
<script>
import { fetchApis, addRoleApis } from '@/api/api'
export default {
  name: 'Apis',
  props: {
    row: {
      default: function() {
        return {}
      },
      type: Object
    }
  },
  data() {
    return {
      apiTreeData: [],
      apiTreeIds: [],
      apiDefaultProps: {
        children: 'children',
        label: 'description'
      }
    }
  },

  async created() {
    // 获取api并整理成树结构
    try {
      const res = await fetchApis({ limit: 9999 })
      const apis = res.data
      this.apiTreeData = this.buildApiTree(apis)
      this.row.apis.map(api => this.apiTreeIds.push(api.id))
    } catch (error) {
      console.log(error)
    }
  },

  methods: {
    // 创建api树方法
    buildApiTree(apis) {
      const apiObj = {}
      apis &&
        apis.map(item => {
          if (apiObj.hasOwnProperty(item.group)) {
            apiObj[item.group].push(item)
          } else {
            Object.assign(apiObj, { [item.group]: [item] })
          }
        })
      const apiTree = []
      for (const key in apiObj) {
        const treeNode = {
          ID: key,
          description: key.toUpperCase() + '组',
          children: apiObj[key]
        }
        apiTree.push(treeNode)
      }
      return apiTree
    },
    // 关联关系确定
    async authApiEnter() {
      // const checkArr = this.$refs.apiTree.getCheckedKeys(true)
      const checkArr = this.$refs.apiTree.getCheckedNodes(true, true)
      console.log(checkArr)
      const res = await addRoleApis(this.row.id, {
        apis: checkArr
      })
      if (res.apis) {
        this.$message({
          type: 'success',
          message: 'API添加成功!'
        })
      }
      this.$set(this.row, 'apis', res.apis)
      console.log(res)
    }
  }
}
</script>
<style lang="scss"></style>
