<template>
  <el-card>
    <!-- 1.面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 2.搜索框 -->
    <el-row>
      <el-col>
        <div style="margin: 15px 0">
          <el-input
            @clear="loadGoodsList()"
            placeholder="请输入内容"
            v-model="searchValue"
            class="inputSerach"
            clearable
          >
            <el-button
              @click="handleSearch()"
              slot="append"
              icon="el-icon-search"
            ></el-button> </el-input
          >&nbsp;&nbsp;
          <el-button
            @click="$router.push({ name: 'goodsadd' })"
            type="success"
            plain
            >添加商品</el-button
          >
        </div>
      </el-col>
    </el-row>
    <!-- 3.表格 -->
    <el-table stripe height="500px" :data="list" style="width: 100%">
      <el-table-column type="index" label="#" width="50"> </el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="220">
      </el-table-column>
      <el-table-column prop="goods_price" label="商品价格（元)">
      </el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"> </el-table-column>
      <el-table-column label="创建日期">
        <template slot-scope="scope">{{
          scope.row.add_time | formatdate
        }}</template>
      </el-table-column>
      <el-table-column prop="level" label="操作">
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
          <el-button
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
            circle
            @click="setPrivilegeDia(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 4.分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[6, 8, 10]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </el-card>
</template>

<script>
import myBread from "../custom/myBread.vue";
export default {
  data() {
    return {
      list: [],
      searchValue: "",
      total: -1,
      pagenum: 1, //当前页码
      pagesize: 6, //显示的条数
    };
  },
  components: { myBread },
  created() {
    this.getGoodsList();
  },
  methods: {
    // 搜索
    handleSearch() {
      this.getGoodsList();
    },
    // 清空搜索框后 重新获取数据
    loadGoodsList() {
      this.getGoodsList();
    },
    // 获取商品列表的请求
    async getGoodsList() {
      const res = await this.$http.get(
        `goods?query=${this.searchValue}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      console.log(res);
      // 解构赋值
      const {
        meta: { status, msg },
        data: { goods, total },
      } = res.data;
      if (status === 200) {
        // 给表格数据赋值
        this.list = goods;
        // 给total赋值
        this.total = total;
        // 提示
        // this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
    },
    // 每页显示条数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.pagenum = 1;
      this.getGoodsList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getGoodsList();
    },
  },
};
</script>

<style>
</style>