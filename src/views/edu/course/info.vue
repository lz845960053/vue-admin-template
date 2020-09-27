// 课程基本信息
<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>

    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写" />
      </el-form-item>
      <!-- 所属分类 TODO -->
      <!-- 所属分类：级联下拉列表 -->

      <el-form-item label="课程类别">
        <!-- 一级分类 -->
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="请选择"
          @change="subjectLevelOneChanged"
        >
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
        <!-- 一级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="请选择">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>

      <!-- 课程讲师 TODO -->
      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <!-- 课程简介 TODO -->

      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description" />
      </el-form-item>

      <!-- 课程封面 TODO -->
      <!-- <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
					list-type="picture-card"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/eduoss/fileoss'"
          class="avatar-uploader"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="courseInfo.cover" alt />
        </el-dialog>
      </el-form-item>-->
      <el-form-item label="课程封面">
        <el-upload
				:show-file-list="false"
          :action="BASE_API+'/eduoss/fileoss'"
          list-type="picture-card"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
					field="file"
					class="avatar-uploader"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="courseInfo.cover" alt />
        </el-dialog>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import courseApi from "@/api/edu/course";
import subjectApi from "@/api/edu/subject";
import Tinymce from "@/components/Tinymce";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: { Tinymce },
  data() {
    //这里存放数据
    return {
      saveBtnDisabled: false,
      courseId: "",
      courseInfo: {
        title: "",
        subjectId: "", //二级分类id
        subjectParentId: "", //一级分类id
        teacherId: "",
        lessonNum: 0,
        description: "",
        cover: "",
        price: 0
      },
      dialogVisible: false,
      BASE_API: process.env.BASE_API, // 接口API地址
      teacherList: [], //封装所有的讲师
      subjectOneList: [], //一级分类
      subjectTwoList: [] //二级分类
    };
  },
  //计算属性 类似于data概念f
  computed: {},
  //监控data中的数据变化
  watch: {},
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    if (this.$route.params && this.$route.params.id) {
			this.courseId = this.$route.params.id;
      this.getCourseInfoById();
    } else {
      this.initSubjectList();
      this.initTeacherList();
    }
  },

  //方法集合
  methods: {
    //根据课程ID获取课程信息
    getCourseInfoById() {
      courseApi.getCourseInfoById(this.courseId).then(response => {
				this.courseInfo = response.data.courseInfo;
				//1 查询所有的分类，包含一级和二级
				subjectApi.getAllSubject()
					.then(response=>{
						//2 获取所有一级分类
						this.subjectOneList = response.data.list;
						//3 把所有的一级分类数组进行遍历，
						for(var i=0;i<this.subjectOneList.length;i++){
							//获取每个一级分类
							let oneSubject = this.subjectOneList[i];
							//比较当前courseInfo里面一级分类id和所有的一级分类id
							if(this.courseInfo.subjectParentId === oneSubject.id){
									//获取一级分类所有的二级分类
                  this.subjectTwoList = oneSubject.children
							}

						}
					})
					this.initTeacherList();
      });
    },
    //上传之前调用的方法
    beforeAvatarUpload(file) {

      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //上传成功掉的方法
    handleAvatarSuccess(res,file) {
      this.courseInfo.cover = res.data.url;
    },
    //获取所有讲师
    initTeacherList() {
      courseApi.getTeacherList().then(response => {
        this.teacherList = response.data.items;
      });
    },
    //一级分类选择后的触发时间
    subjectLevelOneChanged(value) {
      //value 回调的参数为选中的值
      //遍历所有的分类，包含一级和二级
      for (var i = 0; i < this.subjectOneList.length; i++) {
        //获取每一个一级分类
        let oneSubject = this.subjectOneList[i];
        //判断一级分类的id和value是否相等
        if (oneSubject.id === value) {
          //如果相等,获取值，赋值给二级分类
          this.subjectTwoList = oneSubject.children;
          this.courseInfo.subjectId = "";
        }
      }
    },
    //获取所有分类
    initSubjectList() {
      subjectApi.getAllSubject().then(response => {
        this.subjectOneList = response.data.list;
      });
    },
    addCourseInfo() {
      courseApi.addCourseInfo(this.courseInfo).then(response => {
        //提示
        this.$message({
          type: "success",
          message: "添加课程信息成功！"
        });
        //跳转至第二步
        this.$router.push({
          path: "/course/chapter/" + response.data.courseId
        });
      });
    },
    updateCourseInfo() {
      courseApi.updateCourseInfoById(this.courseInfo).then(response => {
        //提示
        this.$message({
          type: "success",
          message: "修改课程信息成功！"
        });
        //跳转至第二步
        this.$router.push({
          path: "/course/chapter/" + this.courseId
        });
      });
    },
    saveOrUpdate() {
      if (this.courseInfo.id) {
        this.updateCourseInfo();
      } else {
        this.addCourseInfo();
      }
    }
  },

  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang='scss' scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
//@import url(); 引入公共css类
</style>