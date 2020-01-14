<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input
        v-model="listQuery.path"
        clearable
        placeholder="路径"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      /> -->

      <el-input
        v-model="listQuery.description"
        clearable
        placeholder="简介"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-button
        v-waves
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
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" align="center" width="100" />
      <el-table-column label="路径" prop="path" />
      <el-table-column label="方法" prop="method" />
      <el-table-column label="分组" prop="group" />
      <el-table-column label="简介" prop="description" />

      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            size="mini"
            plain
            @click="handleUpdate(row)"
          >
            修改
          </el-button>

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
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="路径" prop="path">
          <el-input v-model="temp.path" />
        </el-form-item>
        <el-form-item label="方法" prop="method">
          <el-select v-model="temp.method" placeholder="请选择">
            <el-option
              v-for="item in methods"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="简介" prop="description">
          <el-input v-model="temp.description" />
        </el-form-item>
        <el-form-item label="分组" prop="group">
          <el-input v-model="temp.group" />
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
  </div>
</template>

<script>
import { fetchApis, createApi, updateApi, deleteApi } from '@/api/api'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const methodTypeOptions = [
  { key: 'GET', display_name: 'GET' },
  { key: 'POST', display_name: 'POST' },
  { key: 'PUT', display_name: 'PUT' },
  { key: 'DELETE', display_name: 'DELETE' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const methodTypeKeyValue = methodTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ApiIndex',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return methodTypeKeyValue[type]
    }
  },

  data() {
    return {
      tableKey: 0,
      methods: methodTypeOptions,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        description: ''
      },

      temp: {
        id: undefined,
        name: '',
        paht: '',
        method: '',
        group: '',
        description: '',
        hidden: false
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新建'
      },

      rules: {
        path: [{ required: true, message: '路径必填', trigger: 'blur' }],
        method: [{ required: true, message: '方法必填' }],
        group: [{ required: true, message: '分组必填', trigger: 'blur' }],
        description: [{ required: true, message: '简介必填', trigger: 'blur' }]
      },

      drawer: false,
      activeRow: {}
    }
  },
  computed: {
    searchQuery() {
      return {
        query: `description:${this.listQuery.description}:like`,
        page: this.listQuery.page,
        limit: this.listQuery.limit
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    opdendrawer(row) {
      this.drawer = true
      this.activeRow = row
    },
    getList() {
      this.listLoading = true

      fetchApis(this.searchQuery).then(response => {
        console.log(response)
        this.list = response.data
        this.total = response.pagination.total_record
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },

    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        menus: [],
        apis: []
      }
    },

    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
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
          createApi(this.temp)
            .then(response => {
              this.list.unshift(response.data.api)
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
          delete tempData['menus']
          delete tempData['apis']
          updateApi(tempData)
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
      deleteApi(row)
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
<style lang="scss">
.api-box .el-tabs__content {
  height: calc(100vh - 100px);
  overflow: auto;
}
</style>
