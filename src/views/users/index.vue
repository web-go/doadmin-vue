<template>
  <div class="app-container">
    <d2-crud
      ref="d2Crud"
      :columns="columns"
      :data="data"
      add-title="添加"
      :add-template="addTemplate"
      :form-options="formOptions"
      @dialog-open="handleDialogOpen"
      @row-add="handleRowAdd"
      @row-edit="handleRowEdit"
      @dialog-cancel="handleDialogCancel"
    >
      <el-button slot="header" style="margin-bottom: 5px" @click="addRow">
        新增
      </el-button>
      <el-button
        type="primary"
        slot="header"
        style="margin-bottom: 5px"
        @click="addRowWithNewTemplate"
      >
        新建
      </el-button>
      <el-button
        slot="header"
        style="margin-bottom: 5px"
        @click="editRowWithNewTemplate"
      >
        使用自定义模板编辑第三行
      </el-button>
    </d2-crud>
  </div>
</template>

<script>
import { getUsers } from '@/api/users'
export default {
  data() {
    return {
      columns: [
        {
          title: 'ID',
          key: 'id'
        },
        {
          title: '用户名',
          key: 'username'
        },
        {
          title: '呢称',
          key: 'nickname'
        }
      ],
      data: [],
      addTemplate: {
        username: {
          title: '用户名',
          value: ''
        },

        nickname: {
          title: '呢称',
          value: ''
        },
        password: {
          title: '密码',
          value: '',
          type: 'password'
        },
        password_confirmation: {
          title: '确认密码',
          value: '',
          type: 'password'
        }
      },
      formOptions: {
        labelWidth: '80px',
        labelPosition: 'left',
        saveLoading: false
      }
    }
  },
  methods: {
    handleDialogOpen({ mode }) {
      this.$message({
        message: '打开模态框，模式为：' + mode,
        type: 'success'
      })
    },
    // 普通的新增
    addRow() {
      this.$refs.d2Crud.showDialog({
        mode: 'add'
      })
    },
    // 传入自定义模板的新增
    addRowWithNewTemplate() {
      this.$refs.d2Crud.showDialog({
        mode: 'add',
        template: {
          name: {
            title: '姓名',
            value: ''
          },
          value1: {
            title: '新属性1',
            value: ''
          },
          value2: {
            title: '新属性2',
            value: ''
          }
        }
      })
    },
    handleRowAdd(row, done) {
      this.formOptions.saveLoading = true
      setTimeout(() => {
        console.log(row)
        this.$message({
          message: '保存成功',
          type: 'success'
        })

        // done可以传入一个对象来修改提交的某个字段
        done({
          address: '我是通过done事件传入的数据！'
        })
        this.formOptions.saveLoading = false
      }, 300)
    },
    handleDialogCancel(done) {
      this.$message({
        message: '取消保存',
        type: 'warning'
      })
      done()
    }
  },
  created() {
    getUsers()
      .then(res => {
        this.data = res.data
        console.log(this.data)
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>
