<template>
  <el-card>
    <my-bread level1="商品管理" level2="分类参数"></my-bread><br />
    <el-alert title="只允许为第三级分类设置参数" type="error"></el-alert><br />
    <el-form label-position="left" label-width="80px">
      <el-form-item label="商品分类">
        <!-- 级联选择器 -->
        <el-cascader
          :show-all-levels="false"
          v-model="selectedOptions"
          :options="options"
          :props="defaultProp"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <!--  -->
    <el-tabs v-model="active" type="card" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="1">
      <el-button type="danger">设置动态参数</el-button>
      <!-- 动态参数表格 -->
      <el-table :data="arrDyparams" style="width: 100%">
        <el-table-column type="expand" label="#">
          <template slot-scope="scope">
            <el-tag
              :key="tag"
              v-for="tag in scope.row.attr_vals"
              closable
              :disable-transitions="false"
              @close="handleClose(scope.row.attr_vals,scope.row.attr_id,scope.row.attr_name,tag)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(scope.row.attr_vals,scope.row.attr_id,scope.row.attr_name)"
              @blur="handleInputConfirm(scope.row.attr_vals,scope.row.attr_id,scope.row.attr_name)"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              type="success"
              @click="showInput"
              >添加标签</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="属性名称" prop="attr_name"> </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              plain
              type="primary"
              icon="el-icon-edit"
              circle
              @click="showEdit(scope.row)"
            ></el-button>
            <el-button
              size="mini"
              plain
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteUser(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="2">
          <el-button type="danger">设置静态参数</el-button>
          <!-- 静态参数表格 -->
          <el-table :data="arrStaparams" style="width: 100%">
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
        <el-table-column label="属性值" prop="attr_vals"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              plain
              type="primary"
              icon="el-icon-edit"
              circle
              @click="showEdit(scope.row)"
            ></el-button>
            <el-button
              size="mini"
              plain
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteUser(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import myBread from "../custom/myBread.vue";
export default {
  data() {
    return {
      active: "1",
      // 级联选择器绑定的数据
      selectedOptions: [],
      options: [],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
        expandTrigger: "hover",
      },
      // 动态参数的数据数组
      arrDyparams: [],
      // 静态参数的数据数组
      arrStaparams: [],
      //tag标签相关
      inputVisible: false,
      inputValue: "",
    };
  },
  components: { myBread },
  created() {
    this.getGoodsCate();
  },
  methods: {
    // el-tag标签相关方法
    // 关闭标签
    handleClose(attr_vals,attr_id,attr_name,tag) {
      attr_vals.splice(attr_vals.indexOf(tag), 1);
      let putData = {attr_name:attr_name,attr_sel:'many',attr_vals:attr_vals.join(',')}
      this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${attr_id}`,putData).then(res=>{
          console.log(res);
      })
    },
    // 点击新建标签
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
     // 点击新建标签后 回车或失去焦点
    handleInputConfirm(attr_vals,attr_id,attr_name) {
      let inputValue = this.inputValue;
      if (inputValue) {
        attr_vals.push(inputValue);
        let putData = {attr_name:attr_name,attr_sel:'many',attr_vals:attr_vals.join(',')}
      this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${attr_id}`,putData).then(res=>{
          console.log(res);
      })
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    // tab切换时
    handleClick() {
      if (this.active === "2") {
        // 获取静态参数数据
        if (this.selectedOptions.length === 3) {
          this.$http
          .get(`categories/${this.selectedOptions[2]}/attributes?sel=only`)
          .then((res) => {
            this.arrStaparams = res.data.data;
          });
        }
      }
    },
     //级联选择器改变
    handleChange() {
      if (this.selectedOptions.length === 3) {
        // 获取动态参数
        this.$http
          .get(`categories/${this.selectedOptions[2]}/attributes?sel=many`)
          .then((res) => {
            this.arrDyparams = res.data.data;
            this.arrDyparams.forEach((item) => {
              item.attr_vals =
                item.attr_vals.length === 0
                  ? []
                  : item.attr_vals.trim().split(",");
            });
          });
      }
    },
    // 获取三级分类的信息
    getGoodsCate() {
      this.$http.get(`categories?type=3`).then(res=>{
        this.options = res.data.data;
      })
      
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>