<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="讲师排序">
        <!-- <el-input-number v-model="teacher.sort" controls-position="right" min="0" /> -->
				<el-input-number v-model="teacher.sort" controls-position="right" :min="0" ></el-input-number>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career" />
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea" />
      </el-form-item>
			<!-- 讲师头像 -->
<el-form-item label="讲师头像">

    <!-- 头衔缩略图 -->
    <pan-thumb :image="teacher.avatar"/>
    <!-- 文件上传按钮 -->
    <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
    </el-button>

    <!--
v-show：是否显示上传组件
:key：类似于id，如果一个页面多个图片上传控件，可以做区分
:url：后台上传的url地址
@close：关闭上传组件
@crop-upload-success：上传成功后的回调 -->
    <image-cropper
                   v-show="imagecropperShow"
                   :width="300"
                   :height="300"
                   :key="imagecropperKey"
                   :url="BASE_API+'/eduoss/fileoss'"
                   field="file"
                   @close="close"
                   @crop-upload-success="cropSuccess"/>

</el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacherApi from "@/api/edu/teacher";
import ImageCropper from '@/components/ImageCropper';
import PanThumb from '@/components/PanThumb';

export default {
	components:{ImageCropper,PanThumb},
  data() {
    return {
      teacher: {
        name: "",
        sort: "",
        level: "",
        career: "",
				intro: "",
				avatar: ''
			},
			saveBtnDisabled:false,
			imagecropperShow:false,
			imagecropperKey:0,
			BASE_API: process.env.BASE_API, // 接口API地址
    };
  },
  created() {
		this.init()
  },
	watch:{
		$route(to,from){//路由变化方式，路由发生变化，方法就会执行
			this.init();
		}
	},
	
  methods: {
		cropSuccess(data){
			this.teacher.avatar=data.url;
			this.imagecropperShow=false;
			// 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1

		},
		close(){
			this.imagecropperShow = false;
			// 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
			this.imagecropperKey = this.imagecropperKey + 1
		},
		init(){
			//判断路径有id值,做修改
			if(this.$route.params && this.$route.params.id){
				//从路径中获取id
				const teacherId = this.$route.params.id;
				this.getInfo(teacherId)
			}else{
				this.teacher = {};
			}

		},
		//判断是保存还是修改
		saveOrUpdate(){
			if(!this.teacher.id){
				this.addTeacher();
			}else{
				this.updateTeacher();
			}
		},
		//更新讲师
		updateTeacher(){
			teacherApi.updateTeacher(this.teacher)
				.then(response=>{
					this.$message({
						type: "success",
              message: "修改成功!"
					});
					//返回列表页面
						this.$router.push({path:'/teacher/table'})
				})
		},
		addTeacher(){
			teacherApi.addTeacher(this.teacher)
				.then(response=>{
					this.$message({
              type: "success",
              message: "添加成功!"
						});
						//返回列表页面
						this.$router.push({path:'/teacher/table'})
				})
		},
		//根据id查询teacher
		getInfo(id){
			teacherApi.getTeacher(id)
				.then(response=>{
					this.teacher=response.data.eduTeacher
				})
		}
	}
};
</script>
