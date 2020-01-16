<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.username"
        clearable
        placeholder="用户名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>

      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        新建
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" align="center" width="100" />
      <el-table-column label="用户名" prop="username" />
      <el-table-column label="呢称" prop="nickname" />
      <el-table-column label="角色" prop="roles">
        <template slot-scope="{ row }">
          <el-tag
            v-for="role in row.roles"
            :key="role.id"
            type="info"
            style="margin-right: 10px;"
          >
            {{ role.name }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            size="mini"
            plain
            @click="handleUpdate(row)"
          >
            修改
          </el-button>

          <span>
            <el-button
              size="mini"
              type="success"
              plain
              @click="opdendrawer(row)"
            >
              设置角色
            </el-button>
          </span>

          <el-popconfirm title="确定删除？" @onConfirm="handleDelete(row)">
            <el-button slot="reference" size="mini" type="danger" plain>
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="dialogStatus === 'create' ? rules : updateRules"
        :model="temp"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="呢称" prop="nickname">
          <el-input v-model="temp.nickname" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="password_confirmation">
          <el-input v-model="temp.password_confirmation" type="password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-drawer
      v-if="drawer"
      :visible.sync="drawer"
      :with-header="true"
      size="40%"
      title="角色配置"
    >
      <el-tabs class="role-box" type="border-card">
        <el-tab-pane label="选择角色">
          <roles :row="activeRow" />
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </div>
</template>

<script>
import { fetchUsers, createUser, updateUser, deleteUser } from '@/api/user'
import { fetchRoles } from '@/api/role'
import Roles from './components/roles'

import Pagination from '@/components/Pagination' // secondary package based on el-pagination
const model = {
  id: undefined,
  username: '',
  nickname: '',
  password: '',
  password_confirmation: '',
  roles: []
}
export default {
  name: 'UserTable',
  components: { Pagination, Roles },

  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        username: ''
      },

      temp: Object.assign({}, model),
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新建'
      },

      rules: {
        username: [{ required: true, message: '不能为空', trigger: 'blur' }],
        nickname: [{ required: true, message: '不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '不能为空', trigger: 'blur' }],
        password_confirmation: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      updateRules: {
        username: [{ required: true, message: '不能为空', trigger: 'blur' }],
        nickname: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      roles: [],

      drawer: false,
      activeRow: {}
    }
  },
  computed: {
    searchQuery() {
      return {
        query: `username:${this.listQuery.username}:like`,
        page: this.listQuery.page,
        limit: this.listQuery.limit
      }
    }
  },
  created() {
    this.getList()
    fetchRoles({ page: 1, limit: 999 })
      .then(res => {
        console.log(res)
        this.roles = res.data.map(role => {
          delete role['menus']
          delete role['apis']
          return role
        })
      })
      .catch(err => console.log(err))
  },
  methods: {
    opdendrawer(row) {
      this.drawer = true
      this.activeRow = row
    },
    getList() {
      this.listLoading = true
      fetchUsers(this.searchQuery).then(response => {
        this.list = response.data
        this.total = response.pagination.total_record
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },

    resetTemp() {
      this.temp = Object.assign({}, model)
    },

    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createUser(this.temp)
            .then(response => {
              const user = response.data.user
              user.roles = []
              this.list.unshift(user)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
            .catch(err => console.log(err))
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateUser(tempData)
            .then(() => {
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    handleDelete(row) {
      this.deleteData(row)
    },
    deleteData(row) {
      deleteUser(row)
        .then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
        .catch(() => {
          this.$notify({
            title: '失败',
            message: '删除失败',
            type: 'error',
            duration: 2000
          })
        })
    }
  }
}
</script>
