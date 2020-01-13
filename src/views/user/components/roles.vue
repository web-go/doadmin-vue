<template>
  <div class="clearflex">
    <el-button size="small" type="primary" @click="relation">
      确 定
    </el-button>
    <el-checkbox-group v-model="checkList">
      <div style="margin: 5px">
        <el-checkbox v-for="item in roles" :key="item.id" :label="item">
          {{ item.name }}
        </el-checkbox>
      </div>
    </el-checkbox-group>
  </div>
</template>
<script>
import { fetchRoles } from '@/api/role'
import { addUserRoles } from '@/api/user'
export default {
  name: 'UserRoles',
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
      roles: [],
      checkList: []
    }
  },

  async created() {
    // 获取所有菜单树
    const res = await fetchRoles({ limit: 9999 })
    console.dir(res)
    this.roles = res.data.map(item => {
      delete item['menus']
      delete item['apis']
      this.row['roles'].map(role => {
        if (role.id === item.id) {
          this.checkList.push(item)
        }
      })
      return item
    })
    console.log(this.row['roles'])
  },

  methods: {
    async relation() {
      const checkArr = this.checkList
      console.log(checkArr)
      const res = await addUserRoles(this.row.id, {
        roles: checkArr
      })
      if (res.roles) {
        this.$message({
          type: 'success',
          message: '设置成功!'
        })
      }
      this.$set(this.row, 'roles', res.roles)
      console.log(res)
    }
  }
}
</script>
