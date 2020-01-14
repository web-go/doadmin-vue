<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        clearable
        placeholder="显示标题"
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
      default-expand-all
      row-key="id"
      :tree-props="{ children: 'children' }"
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" align="center" width="100" />
      <el-table-column label="显示标题" prop="title" />
      <el-table-column label="菜单路径" prop="path" />
      <el-table-column label="组件名称" prop="name" />
      <el-table-column label="组件路径" prop="component" />
      <el-table-column label="图标" prop="icon" />
      <el-table-column label="排序" prop="position" />
      <!-- <el-table-column label="隐藏" prop="hidden" /> -->
      <!-- <el-table-column label="parent_id" prop="parent_id" /> -->

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
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="菜单路径" prop="path">
          <el-input v-model="temp.path" />
        </el-form-item>
        <el-form-item label="菜单标题" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component">
          <el-input v-model="temp.component" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="temp.icon" />
        </el-form-item>
        <el-form-item label="排序" prop="position">
          <el-input-number v-model="temp.position" />
        </el-form-item>
        <!-- <el-form-item label="隐藏" prop="hidden">
          <el-checkbox v-model="temp.hidden" />
        </el-form-item> -->
        <el-form-item label="上级" prop="parent_id">
          <el-select v-model="temp.parent_id" placeholder="请选择" clearable>
            <el-option
              v-for="item in selectList.filter(i => i.id != temp.id)"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
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
import { fetchMenus, createMenu, updateMenu, deleteMenu } from '@/api/menu'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const model = {
  id: undefined,
  name: '',
  path: '',
  title: '',
  component: '',
  icon: '',
  position: 100,
  hidden: false,
  parent_id: 0
}

export default {
  name: 'MenuTable',
  components: { Pagination },

  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        title: '',
        page: 1,
        limit: 50
      },

      temp: Object.assign({}, model),
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新建'
      },

      rules: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        path: [{ required: true, message: '不能为空', trigger: 'blur' }],
        title: [{ required: true, message: '不能为空', trigger: 'blur' }],
        component: [{ required: true, message: '不能为空', trigger: 'blur' }],
        // icon: [{ required: true, message: '不能为空', trigger: 'blur' }],
        position: [{ required: true, message: '不能为空', trigger: 'blur' }]
        // hidden: [{ required: true, message: '不能为空', trigger: 'blur' }]
        // parent_id: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    searchQuery() {
      return {
        query: `title:${this.listQuery.title}:like`,
        page: this.listQuery.page,
        limit: this.listQuery.limit
      }
    },
    selectList() {
      const list = this.list.slice()
      list.unshift({ id: 0, title: '无上级' })
      return list
      // return list
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true

      fetchMenus(this.searchQuery).then(response => {
        console.log(response, 'response')
        this.list = response.menus
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
          createMenu(this.temp)
            .then(response => {
              console.log(response)
              // this.list.unshift(response.data.menu)
              this.getList()
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
          updateMenu(tempData)
            .then(() => {
              // for (const v of this.list) {
              //   if (v.id === this.temp.id) {
              //     const index = this.list.indexOf(v)
              //     this.list.splice(index, 1, this.temp)
              //     break
              //   }
              // }
              this.getList()
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
      deleteMenu(row)
        .then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          // const index = this.list.indexOf(row)
          // this.list.splice(index, 1)
          this.getList()
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
