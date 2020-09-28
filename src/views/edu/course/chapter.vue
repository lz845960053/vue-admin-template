<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <el-form label-width="120px">
<el-button type="text" @click="openChapterDialog">添加章节</el-button>

<!-- 添加和修改章节表单 弹框 -->
<el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
    <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
            <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
            <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
    </div>
</el-dialog>

    <!-- 添加和修改课时小节表单  弹框 -->
<el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
  <el-form :model="video" label-width="120px">
    <el-form-item label="课时标题">
      <el-input v-model="video.title"/>
    </el-form-item>
    <el-form-item label="课时排序">
      <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
    </el-form-item>
    <el-form-item label="是否免费">
      <el-radio-group v-model="video.isFree">
        <el-radio :label=0>免费</el-radio>
        <el-radio :label=1>默认</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="上传视频">
      <!-- TODO -->
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
    <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
  </div>
</el-dialog>

<!-- 章节 -->
<ul class="chanpterList">
    <li
        v-for="chapter in chapterVideoList"
        :key="chapter.id">
        <p>
            {{ chapter.title }}
            <span class="acts">
                <el-button type="text" @click="openVideo(chapter.id)">添加课时</el-button>
                <el-button style="" type="text" @click="eduChapter(chapter.id)">编辑</el-button>
                <el-button type="text" @click="removeChaper(chapter.id)">删除</el-button>
            </span>
        </p>

        <!-- 视频 -->
        <ul class="chanpterList videoList">
            <li
                v-for="video in chapter.children"
                :key="video.id">
                <p>{{ video.title }}
                    <span class="acts">
                        <el-button type="text" @click="eduVideo(video.id)">编辑</el-button>
                        <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
                    </span>
                </p>
            </li>
        </ul>
    </li>
</ul>
<div>
    <el-button @click="previous">上一步</el-button>
    <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
</div>
    </el-form>
  </div>
</template>

<script>
import chapter from '@/api/edu/chapter'
import video from'@/api/edu/video'

export default {
  data() {
    return {
			saveBtnDisabled: false, // 保存按钮是否禁用
			//添加章节弹框控制
			dialogChapterFormVisible:false,
			//添加课时弹框控制
			dialogVideoFormVisible:false,
			//控制添加小节确认按钮
			saveVideoBtnDisabled:false,
			courseId:'',
			//章节小节列表
			chapterVideoList:[],
			//章节
			chapter:{
				title:'',
				sort:0,
			},
			video:{
				title:'',
				sort:0,
        isFree:0,
        videoSourceId:'',
        chapterId:'',
        courseId:''
			},
    }
  },

  created() {
		if(this.$route.params && this.$route.params.id){
			this.courseId=this.$route.params.id
			console.log(this.courseId)
			this.getChapterVideo()
		}
  },

  methods: {
		//##############################小节相关课程#########################################
		saveOrUpdateVideo(){
		  if(!this.video.id){
        this.addVideo();
      }else{
		    this.updateVideo();
      }
		},
    //编辑小节按钮
    eduVideo(videoId){
		  //打开弹框
      this.dialogVideoFormVisible = true;
      //查询小节，数据回显
      this.getVideoInfo(videoId)
    },
    getVideoInfo(videoId){
		  video.getVideoInfo(videoId)
        .then(response=>{
          this.video = response.data.videoInfo;
        })

    },
    //更新小节
    updateVideo(){
      debugger
		  video.updateVideo(this.video)
        .then(response=>{
          //关弹窗
          this.dialogVideoFormVisible = false;
          this.$message({
            type:'success',
            message:'更新成功！'
          });
          this.getChapterVideo();
        })

    },
    //删除小节
    removeVideo(videoId){
		  //弹框提醒
      this.$confirm("此操作将永久删除该记录 是否继续?","提示",{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        video.deleteVideo(videoId)
          .then(response=>{
              this.$message({
                type:'success',
                message:'删除小节成功!'
              });
            //刷新页面
            this.getChapterVideo();
          })
      }).catch(()=>{
        this.$message({
          type:'info',
          message:'已取消删除'
        })
      })
    },
    //添加课时小节
    addVideo(){
      this.video.courseId=this.courseId;

      video.addVideo(this.video)
        .then(response=>{
          //关弹窗
          this.dialogVideoFormVisible = false;
          this.$message({
            type:'success',
            message:'添加成功！'
          });
          //刷新页面
          this.getChapterVideo();
        })
    },
		openVideo(chapterId){
			this.dialogVideoFormVisible = true;
			this.video={};
			this.video.sort=0;
			this.video.chapterId =chapterId;

		},
//#######################章节相关方法################################################
    //删除章节
    removeChaper(chapterId){
		  //弹框提醒
      this.$confirm("此操作将永久删除该记录 是否继续?","提示",{
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=>{
        chapter.deleteChapter(chapterId)
          .then(response=>{
            this.$message({
              type:'success',
              message:'删除成功!'
            });
            //刷新页面
            this.getChapterVideo();
          })
      }).catch(()=>{
        this.$message({
          type:'info',
          message:'取消删除',
        })
      })
    },
		//编辑章节按钮
		eduChapter(chapterId){
			//打开弹框，数据回显
			this.dialogChapterFormVisible = true;
			this.getChapterInfo(chapterId);
		},
		//添加和修改章节表单确认按钮
		saveOrUpdate(){
			if(!this.chapter.id){
				this.addChapter()
			}else{
				this.updateChapter()
			}


		},
		//添加课程
		addChapter(){
			this.chapter.courseId = this.courseId
			chapter.addChapter(this.chapter)
				.then(response=>{
					this.dialogChapterFormVisible = false;
					this.$message({
						type:'success',
						message:'添加章节成功'
					})
					this.getChapterVideo();
				})
		},
		//根据章节Id查询章节信息
		getChapterInfo(chapterId){
			chapter.getChapterInfo(chapterId)
				.then(response=>{
					this.chapter=response.data.chapter
				})

		},
		//更新课程
		updateChapter(){
			chapter.updateChapter(this.chapter)
				.then(response=>{
					this.dialogChapterFormVisible = false;
					this.$message({
						type:'success',
						message:'更新章节成功'
					})
					this.getChapterVideo();
				})
		},
		//点击添加章节
		openChapterDialog(){
			this.dialogChapterFormVisible = true;
			//清空表格
      this.chapter.title = '';
      this.chapter.sort =0;
		},
//######################################################################
		//根据课程id查询章节和小节
		getChapterVideo(){
			chapter.getAllChapterVideo(this.courseId)
				.then(response=>{
					this.chapterVideoList= response.data.list
				})
		},

    previous() {
      console.log('previous')
      this.$router.push({ path: '/course/info/'+this.courseId })
    },

    next() {
      console.log('next')
      this.$router.push({ path: '/course/publish/'+this.courseId })
    }
  }
}
</script>
<style scoped>
.chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chanpterList li{
  position: relative;
}
.chanpterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chanpterList .acts {
    float: right;
    font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}

</style>
