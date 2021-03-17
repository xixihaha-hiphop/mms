<template>
  <div>
    <el-card>
      <!-- 1.面包屑 -->
      <my-bread level1="权限管理" level2="权限列表"></my-bread><br><br>
      <!-- 2.表格 -->
      <el-table
      stripe
      height="500px"
      :data="privilegeList"
      style="width: 100%">
      <el-table-column
        type="index"
        label="#"
        width="100">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径">
      </el-table-column>
      <el-table-column
        prop="level"
        label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level==='0'">一级</span>
          <span v-if="scope.row.level==='1'">二级</span>
          <span v-if="scope.row.level==='2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
    </el-card>
  </div>
</template>

<script>
import myBread from "../custom/myBread.vue";
export default {
  data() {
    return {
      privilegeList: [],
    };
  },
  components: { myBread },
  created() {
    this.getPrivilegeList();
  },
  methods: {
    getPrivilegeList() {
      

      this.$http.get(`rights/list`).then((res) => {
        // console.log(res);
        this.privilegeList = res.data.data
      });
    },
  },
};
</script>

<style>
</style>