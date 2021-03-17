<template>
  <el-card>
    <!-- 1.面包屑 -->
    <my-bread level1="权限管理" level2="角色列表"></my-bread><br />
    <el-row>
      <el-col> <el-button>添加角色</el-button><br /> </el-col>
    </el-row>
    <!-- 2.表格 -->
    <el-table stripe height="500px" :data="roleList" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="(item1, i) in scope.row.children" :key="i">
            <el-col :span="4">
              <!-- 传角色id 和 权限id -->
              <el-tag @close="cancelPrivilege(scope.row, item1.id)" closable>{{
                item1.authName
              }}</el-tag>
              <i class="el-icon-right" style="color: lightblue"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2, i) in item1.children" :key="i">
                <el-col :span="4">
                  <el-tag
                    @close="cancelPrivilege(scope.row, item2.id)"
                    type="success"
                    closable
                    >{{ item2.authName }}</el-tag
                  >
                  <i class="el-icon-right" style="color: lightgreen"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    @close="cancelPrivilege(scope.row, item3.id)"
                    v-for="(item3, i) in item2.children"
                    :key="i"
                    type="warning"
                    closable
                    >{{ item3.authName }}</el-tag
                  >
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <span v-if="scope.row.children.length === 0">该角色暂未分配权限</span>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="100"> </el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180">
      </el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
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
    <!-- 修改权限的对话框 -->
    <el-dialog title="修改权限" :visible.sync="dialogFormVisiblePri">
      <el-tree
        ref="tree"
        :data="treeList"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="arrcheck"
        :props="defaultProps"
      >
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisiblePri = false">取 消</el-button>
        <el-button type="primary" @click="setPrivilege()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      dialogFormVisiblePri: false,
      // 树形结构（修改权限）的数据
      treeList: [],
      defaultProps: {
        label: "authName",
        children: "children",
      },
      arrcheck: [],
      currRoleId: -1,
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    // 获取角色列表中的数据
    getRoleList() {
      this.$http.get(`roles`).then((res) => {
        // console.log(res);
        this.roleList = res.data.data;
      });
    },
    // 取消权限
    cancelPrivilege(role, rightId) {
      this.$http.delete(`roles/${role.id}/rights/${rightId}`).then((res) => {
        // console.log(res);
        // 更新当前角色的权限
        role.children = res.data.data;
      });
    },
    // 修改权限 - 打开对话框
    setPrivilegeDia(role) {
      // 给currRoleId赋值
      this.currRoleId = role.id;
      // 获取树形结构权限的数据
      this.$http.get(`rights/tree`).then((res) => {
        console.log(res);
        this.treeList = res.data.data;
        // 获取当前角色的权限id
        let arrtemp = [];
        role.children.forEach((item1) => {
          // arrtemp.push(item1.id)
          role.children.forEach((item2) => {
            // arrtemp.push(item2.id)
            role.children.forEach((item3) => {
              arrtemp.push(item3.id);
            });
          });
        });
        // 将获取到的权限id赋值给arrcheck
        this.arrcheck = arrtemp;
      });
      this.dialogFormVisiblePri = true;
    },
    // 修改权限 - 发送请求
    setPrivilege() {
      // 获取全选的id的数组
      let arr1 = this.$refs.tree.getCheckedKeys();
      // 获取半选的id的数组
      let arr2 = this.$refs.tree.getHalfCheckedKeys();
      let arr = [...arr1, ...arr2];
      this.$http
        .post(`roles/${this.currRoleId}/rights`, { rids: arr.join(",") })
        .then((res) => {
          // 更新视图
          this.getRoleList();
          // 关闭对话框
          this.dialogFormVisiblePri = false;
        });
    },
  },
};
</script>

<style>
</style>