<template>
  <el-card>
    <my-bread level1="订单管理" level2="订单列表"></my-bread><br>
    <!-- 表格 -->
    <el-table :data="list" style="width: 100%">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="订单编号" prop="order_number"></el-table-column>
      <el-table-column label="订单价格" prop="order_price"></el-table-column>
      <el-table-column label="是否付款" prop="order_pay">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.order_pay === '0'">已付款</el-tag>
          <el-tag type="danger" v-if="scope.row.order_pay === '1'"
            >未付款</el-tag 
          >
        </template>
      </el-table-column>
      <el-table-column label="是否发货" prop="is_send"></el-table-column>
      <el-table-column label="下单时间">
        <template slot-scope="scope">{{
          scope.row.created_time | formatdate
        }}</template>
      </el-table-column>
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
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <el-dialog title="修改订单地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="省市区" :label-width="formLabelWidth">
          <el-cascader
            expand-trigger="hover"
            clearable
            :options="options"
            v-model="selectedOptions"
            @change="handleChange"
          ></el-cascader>
          
        </el-form-item>
        <el-form-item label="详细地址" :label-width="formLabelWidth">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import myBread from "../custom/myBread.vue";
import { regionData, CodeToText} from "element-china-area-data"
export default {
  data() {
    return {
        list:[],
        dialogFormVisible: false,
        formLabelWidth: "120px",
        form:{
            address:""
        },
        options: regionData,
        selectedOptions:[]
    };
  },
  components: { myBread },
  created(){
      this.getData()
  },
  methods:{
      async getData(){
          const res = await this.$http.get(`orders?pagenum=1&pagesize=10`)
          this.list = res.data.data.goods
      },
      showEdit(){
        //   this.options = options
          this.dialogFormVisible = true
      },
      handleChange() {
      var loc = "";
      for (let i = 0; i < this.selectedOptions.length; i++) {
        loc += CodeToText[this.selectedOptions[i]];
      }
    }

  }
};
</script>

<style>
</style>