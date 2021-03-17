<template>
  <div>
    <el-card class="box-card">
      <!-- 1.面包屑 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 2.搜索框 -->
      <el-row>
        <el-col>
          <div style="margin: 15px 0">
            <el-input
              @clear="loadUserList()"
              placeholder="请输入内容"
              v-model="query"
              class="inputSerach"
              clearable
            >
              <el-button
                @click="searchInfo()"
                slot="append"
                icon="el-icon-search"
              ></el-button> </el-input
            >&nbsp;&nbsp;
            <el-button @click="showAdd()" type="success" plain
              >添加用户</el-button
            >
          </div>
        </el-col>
      </el-row>
      <!-- 3.表格 -->
      <el-table :data="userList" height="450" border style="width: 100%">
        <el-table-column type="index" label="序号" width="50" align="center">
        </el-table-column>
        <el-table-column prop="username" label="姓名" width="120" align="center">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="200" align="center">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="180" align="center">
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="140" align="center">
          <template slot-scope="scope">{{
            scope.row.create_time | formatdate
          }}</template>
        </el-table-column>
        <el-table-column prop="mg_state" label="用户状态" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="changeState(scope.row)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
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
              @click="showRole(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 4.分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[4, 6, 8]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 添加用户的对话框 -->
      <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
        <el-form :model="form">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="form.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input v-model="form.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth">
            <el-input v-model="form.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" :label-width="formLabelWidth">
            <el-input v-model="form.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
          <el-button type="primary" @click="addUser()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑用户的对话框 -->
      <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
        <el-form :model="form">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input
              v-model="form.username"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth">
            <el-input v-model="form.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" :label-width="formLabelWidth">
            <el-input v-model="form.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
          <el-button type="primary" @click="editUser()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分配角色的对话框 -->
      <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
        <el-form :model="form">
          <el-form-item label="用户名" label-width="100px">{{currUsername}}
          </el-form-item>
          <el-form-item label="角色" label-width="100px">
            {{currRoleId}}
            <el-select v-model="currRoleId">
              <el-option label="请选择" :value="-1"></el-option>
              <el-option :label="item.roleName" :value="item.id" v-for="(item,i) in roles" :key="i"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
          <el-button type="primary" @click="setRole()"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      userList: [],
      total: -1,
      pagenum: 1, //当前页码
      pagesize: 4, //显示的条数
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      formLabelWidth: "120px",
      form: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 分配角色
      currRoleId: -1,
      currUserId: -1,
      currUsername: '',
      roles: []
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 搜索
    searchInfo() {
      this.getUserList();
    },
    // 清空搜索框后 重新获取数据
    loadUserList() {
      this.getUserList();
    },
    // 添加用户 显示对话框
    showAdd() {
      this.form = {};
      this.dialogFormVisibleAdd = true;
    },
    // 添加用户 发送请求
    addUser() {
      this.$http.post(`users`, this.form).then((res) => {
        console.log(res);
        const {
          meta: { status, msg },
          data,
        } = res.data;
        if (status === 201) {
          // 提示成功
          this.$message.success(msg);
          // 关闭对话框
          (this.dialogFormVisibleAdd = false),
            // 更新视图
            this.getUserList();
          // 清空文本框
          this.form = {};
        } else {
          this.$message.warning(msg);
        }
      });
    },
    // 修改用户状态
    changeState(user) {
      // 发送请求
      this.$http.put(`users/${user.id}/state/${user.mg_state}`).then((res) => {
        console.log(res);
      });
    },
    // 编辑用户 显示对话框
    showEdit(user) {
      // 获取用户数据
      this.form = user;
      this.dialogFormVisibleEdit = true;
    },
    // 编辑用户 发送请求
    editUser() {
      this.$http.put(`users/${this.form.id}`, this.form).then((res) => {
        console.log(res);
        // 关闭对话框
        this.dialogFormVisibleEdit = false;
        // 更新视图
        this.getUserList();
      });
    },
    // 删除用户
    deleteUser(userId) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 发送删除的请求
          this.$http.delete(`users/${userId}`).then((res) => {
            if (res.data.meta.status === 200) {
              // 更新视图
              this.getUserList();
              // 提示成功
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 分配角色 显示对话框
    showRole(user) {
      // 获取当前用户的用户名
      this.currUsername = user.username
      // 给currUserId赋值
      this.currUserId = user.id
      // 获取所有的角色
      this.$http.get(`roles`).then(res=>{
        this.roles = res.data.data
      })
      // 获取当前用户的角色id
      this.$http.get(`users/${user.id}`).then(res=>{
        this.currRoleId = res.data.data.rid
      })
      this.dialogFormVisibleRole = true
    },
    // 分配角色 发送请求
    setRole(){
      this.$http.put(`users/${this.currUserId}/role`,{rid:this.currRoleId}).then(res=>{
        // console.log(res);
        // 关闭对话框
        this.dialogFormVisibleRole = false
      })
    },
    // 获取用户列表的请求
    async getUserList() {
      // 需要授权的API，必须在请求头中使用Authorization字段提供token令牌
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;

      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      // console.log(res);
      // 解构赋值
      const {
        meta: { status, msg },
        data: { users, total },
      } = res.data;
      if (status === 200) {
        // 给表格数据赋值
        this.userList = users;
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
      this.getUserList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getUserList();
    },
  },
};
</script>

<style>
.inputSerach {
  width: 300px;
}
</style>