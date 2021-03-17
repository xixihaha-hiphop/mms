<template>
  <div>
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread><br />
    <!-- 提示信息 -->
    <el-alert title="添加商品信息" type="success" center show-icon></el-alert>
    <!-- 步骤条 -->
    <el-steps
      :active="1 * active"
      finish-status="success"
      simple
      style="margin-top: 20px"
    >
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <br />
    <!-- Tabs标签页 -->
    <el-form label-position="top" label-width="80px" :model="form">
      <el-tabs @tab-click="tabChange()" v-model="active" tab-position="left">
        <el-tab-pane
          name="1"
          label="基本信息"
          style="height: 450px; overflow: auto"
        >
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- 级联选择器 -->
            <el-cascader
              v-model="selectedOptions"
              :options="options"
              :props="defaultProp"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <el-form-item
            :label="item1.attr_name"
            :key="i"
            v-for="(item1, i) in arrDyparams"
          >
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox
                v-for="(item2, i) in item1.attr_vals"
                :key="i"
                :label="item2"
                border
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性"
          style="height: 450px; overflow: auto"
        >
          <el-form-item
            :label="item.attr_name"
            v-for="(item, i) in arrStaparams"
            :key="i"
          >
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <el-form-item label="">
          <el-upload
            action="http://localhost:8888/api/private/v1/upload"
            :headers="headers"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <el-form-item>
            <el-button type="primary" @click="addGoods()">添加商品</el-button>
            <!-- 富文本编辑器 -->
            <quill-editor v-model="form.goods_introduce"></quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <!-- 基本信息表单 -->
  </div>
</template>

<script>
import myBread from "../custom/myBread.vue";
// 富文本相关插件
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import {quillEditor} from 'vue-quill-editor'
export default {
  data() {
    return {
      active: "1",
      form: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        goods_cat: "",
        pics: [],
        attrs: [],
      },
      // 级联选择器绑定的数据
      selectedOptions: [1, 3, 6],
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
      headers:{
        Authorization: localStorage.getItem('token')
      }
    };
  },
  components: { myBread,quillEditor },
  created() {
    this.getGoodsCate();
  },
  methods: {
    // 获取三级分类的信息
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3`);
      this.options = res.data.data;
    },
    // 点击不同的tab时
    tabChange() {
      // 点击第二个tab时
      if (this.active === "2") {
        if (this.selectedOptions.length !== 3) {
          this.$message.warning("请先选择商品的三级分类");
          return;
        }
        // 获取数据
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
      } else if (this.active === "3") {
        if (this.selectedOptions.length !== 3) {
          this.$message.warning("请先选择商品的三级分类");
          return;
        }
        this.$http
          .get(`categories/${this.selectedOptions[2]}/attributes?sel=only`)
          .then((res) => {
            this.arrStaparams = res.data.data;
          });
      }
    },
    // 图片上传时的相关方法
    handlePreview(file){
     
    },
    handleRemove(file){
      let Index = this.form.pics.findIndex((item)=>{
        return item.pic === file.response.data.tmp_path
      })
      this.form.pics.splice(Index,1)
      console.log(this.form.pics);
    },
    handleSuccess(file){
      this.form.pics.push({
        pic:file.data.tmp_path
      })
    },
    // 添加商品 - 发送请求
    addGoods(){
      this.form.goods_cat = this.selectedOptions.join(',')
      // 动态参数数组
      let arr1 = this.arrDyparams.map(item=>{
        return {attr_id: item.attr_id,attr_value: item.attr_vals}
      })
      // 静态参数数组
      let arr2 = this.arrStaparams.map(item=>{
        return {attr_id: item.attr_id,attr_value: item.attr_vals}
      })
      this.form.attrs = [...arr1,...arr2]
      this.$http.post(`goods`,this.form).then(res=>{
        this.$router.push({name:'goods'})
      })
    }
  },
};
</script>

<style>
.ql-editor{
  min-height: 250px;
}
</style>