<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col
          ><el-button type="primary" @click="showAddCateDialog">
            添加分类
          </el-button></el-col
        >
      </el-row>
      <!-- 表格 -->
      <tree-table
        class="treeTable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 第一个模板为是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color: lightgreen"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <!-- 第二个模板为排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-if="scope.row.cat_level === 2"
            >三级</el-tag
          >
        </template>
        <!-- 第三个模板为操作 -->
        <template slot="mode">
          <el-button size="mini" type="primary" icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed()"
    >
      <el-form
        :model="addcateFrom"
        :rules="addCateFromRules"
        ref="addcateFromRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addcateFrom.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options为数据源  -->
          <el-cascader
            v-model="selectdKeys"
            :options="parentCateList"
            props.expandTrigger="hover"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
            props.checkStrictly
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      //选中的父级分类的id数组
      selectdKeys: [],
      //指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      //父级分类列表
      parentCateList: [],
      //添加表单的数据对象
      addcateFrom: {
        //新增分类名称
        cat_name: '',
        //新增分类的父id
        cat_pid: 0,
        //新增分类的等级，默认一级
        cat_level: 0,
      },
      //添加表单验证规则的对象
      addCateFromRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      //控制添加分类对话框的显示和隐藏
      addCateDialogVisible: false,
      //商品分类的数据列表
      catelist: [],
      //查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //数据条数
      total: 0,
      //为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          //定义当前列为模板列
          type: 'template',
          //当前一列使用模板名称
          template: 'isok',
        },
        {
          label: '排序',
          //等级
          type: 'template',
          template: 'order',
        },
        {
          label: '操作',
          //操作
          type: 'template',
          template: 'mode',
        },
      ],
    }
  },
  created() {
    //获取商品分类数据
    this.getCateList()
  },
  methods: {
    //监听对话框的关闭事件。重载表单数据
    addCateDialogClosed() {
      this.$refs.addcateFromRef.resetFields()
      this.selectdKeys = []
      this.addcateFrom.cat_level = 0
      this.addcateFrom.cat_pid = 0
    },
    //点击按钮添加新的分类
    addCate() {
      this.$refs.addcateFromRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addcateFrom
        )
        if (res.meta.status !== 201) return this.$message.error('添加分类失败')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    //选择项发生变化触发
    parentCateChanged() {
      //如果selectedKeys数组中的length大于9，证明选中父级分类
      //反之说明没有选中任何父级分类
      if (this.selectdKeys.length > 0) {
        //父级分类的id
        this.addcateFrom.cat_pid = this.selectdKeys[this.selectdKeys.length - 1]
        //当前分类的等级赋值
        this.addcateFrom.cat_level = this.selectdKeys.length
        return
      } else {
        //父级分类的id
        this.addcateFrom.cat_pid = 0
        //当前分类的等级赋值
        this.addcateFrom.cat_level = 0
      }
    },
    //获得父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取父级分类列表失败')
      this.parentCateList = res.data
    },
    //点击按钮显示，添加分类对话框
    showAddCateDialog() {
      //先获得父级分类的数据列表
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    //监听pagenum发生变化
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    },
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.querInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表数据失败')
      }
      //把数据列表赋值为catelist
      this.catelist = res.data.result
      this.total = res.data.total
    },
  },
}
</script>

<style scoped>
.treeTable {
  margin-top: 15px;
}
</style>