<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon
      ></el-alert>
      <el-row class="cat_opt">
        <el-col
          ><span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectdCateKeys"
            :options="catelist"
            expand-trigger="hover"
            :props="cateProps"
            @change="handleChanged"
            clearable
            change-on-select
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            size="mini"
            type="primary"
            @click="addDialogVisible = true"
            :disabled="isBtnDisabled"
          >
            添加参数
          </el-button>
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(it, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, scope.row)"
                  >{{ it }}
                </el-tag>
                <!--输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            size="mini"
            type="primary"
            @click="addDialogVisible = true"
            :disabled="isBtnDisabled"
          >
            添加属性
          </el-button>
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(it, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, scope.row)"
                  >{{ it }}</el-tag
                >
                <!--输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >
                  编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams"> 确 定 </el-button>
      </span>
    </el-dialog>
    <!-- 修改参数的对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 添加参数的对话框 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ],
      },
      editForm: {},
      editDialogVisible: false,
      //动态参数的数据
      manyTableData: [],
      //静态参数的数据
      onlyTableData: [],
      activeName: 'many',
      //级联选择框绑定到的数组
      selectdCateKeys: [],
      //级联选择框的对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      //商品分类列表
      catelist: [],
      addDialogVisible: false,
      //添加参数的表单数据
      addForm: {
        attr_name: '',
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    //控制按钮是否禁用
    isBtnDisabled() {
      if (this.selectdCateKeys.length !== 3) {
        return true
      }
      return false
    },
    //当前选中的三级分类id
    cateId() {
      if (this.selectdCateKeys.length === 3) {
        return this.selectdCateKeys[2]
      }
      return null
    },
    //动态计算标题文本
    titleText() {
      if (this.activeName === 'many') return '动态参数'
      return '静态属性'
    },
  },
  methods: {
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    },
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_vals: row.attr_vals.join(' '),
          attr_sel: row.attr_sel,
        }
      )
      if (res.meta.status !== 200) return this.$message.error('新增属性失败')
    },
    //点击按钮展示文本输入框
    showInput(row) {
      row.inputVisible = true
      //$nextTick方法的作用就是当页面上元素被重新渲染后，才会指定回调函数中的代码
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    //文本框失去焦点或按下了enter键都会触发
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      //发起请求保存此次操作
      this.saveAttrVals(row)
      //this.getParamsData()
    },
    //根据id删除参数
    async removeParams(attr_id) {
      const confirmresult = await this.$confirm(
        '此操作将永久删除该参数，是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmresult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      )
      if (res.meta.status !== 200)
        return this.$message.error('删除商品参数失败')
      this.getParamsData()
    },
    //重置修改表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //点击按钮展示修改对话框
    async showEditDialog(attr_id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        { params: { attr_sel: this.activeName } }
      )
      if (res.meta.status !== 200)
        return this.$message.error('获取商品列表失败')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    //添加参数
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          { attr_name: this.addForm.attr_name, attr_sel: this.activeName }
        )
        if (res.meta.status !== 201)
          return this.$message.error('获取参数列表失败')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    //监听添加参数关闭
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    //tab页签点击的处理函数
    handleTabClick() {
      this.getParamsData()
    },
    //级联选择框变化会触发这个函数
    handleChanged() {
      this.getParamsData()
    },
    //获取参数列表数据
    async getParamsData() {
      //证明选中的不是三级分类
      if (this.selectdCateKeys.length !== 3) {
        this.selectdCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      //根据所选父类的id和当前所处的面板，获取对应的参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      )
      if (res.meta.status !== 200)
        return this.$message.error('获取参数列表失败')
      res.data.forEach((it) => {
        it.attr_vals = it.attr_vals ? it.attr_vals.split(' ') : []
        //控制文本框的显示和隐藏
        it.inputVisible = false
        //文本框中输入的值
        it.inputValue = ''
      })

      //将获取到的数据分配到正确的表格中
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    //获取所有的数据列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200)
        return this.$message.error('获取商品列表失败')
      this.catelist = res.data
    },
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        )
        if (res.meta.status !== 200) return this.$message.error('修改参数失败')
        this.editDialogVisible = false
        this.getParamsData()
      })
    },
  },
}
</script>

<style scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 5px;
}
.input-new-tag {
  width: 120px;
}
</style>