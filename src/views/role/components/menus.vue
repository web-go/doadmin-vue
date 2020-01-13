<template>
  <div>
    <div class="clearflex">
      <el-button class="fl-right" size="small" type="primary" @click="relation">
        确 定
      </el-button>
    </div>
    <el-tree
      ref="menuTree"
      :data="menuTreeData"
      :default-checked-keys="menuTreeIds"
      :props="menuDefaultProps"
      default-expand-all
      highlight-current
      node-key="id"
      show-checkbox
    />
  </div>
</template>
<script>
import { fetchMenus, addRoleMenus } from '@/api/menu'
export default {
  name: 'Menus',
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
      menuTreeData: [],
      menuTreeIds: [5, 8],
      menuDefaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },

  async created() {
    // 获取所有菜单树
    const res = await fetchMenus({ limit: 9999 })
    console.dir(res)
    this.menuTreeData = res.menus

    const menus = this.row.menus
    const arr = []
    menus.map(item => {
      // 防止直接选中父级造成全选
      if (!menus.some(same => same.parent_id === item.id)) {
        arr.push(Number(item.id))
      }
    })
    this.menuTreeIds = arr
  },

  methods: {
    // 关联树 确认方法
    async relation() {
      const checkArr = this.$refs.menuTree.getCheckedNodes(false, true)
      // const checkArr = this.$refs.menuTree.getCheckedKeys()
      console.log(checkArr)
      const res = await addRoleMenus(this.row.id, {
        menus: checkArr
      })
      if (res.menus) {
        this.$message({
          type: 'success',
          message: '添加成功!'
        })
      }
      this.$set(this.row, 'menus', res.menus)
      console.log(res)
    }
  }
}
</script>
