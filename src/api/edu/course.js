import request from '@/utils/request'
export default{
	//获取课程分类
	addCourseInfo(courseInfo){
		return request({
			url: `/eduservice/course/addCourseInfo`,
			method: 'post',
			data:courseInfo,
		})
	},
	//获取所有讲师
	getTeacherList(){
		return request({
			url: `/eduservice/teacher/findAll`,
			method: 'get',
		})
	},
	//根据id查询课程信息
	getCourseInfoById(courseId){
		return request({
			url: `/eduservice/course/getCourseInfoById/${courseId}`,
			method: 'get'
		})
	},
	//根据id课程
	updateCourseInfoById(courseInfo){
		return request({
			url: `/eduservice/course/updateCourseInfo`,
			method: 'put',
			data:courseInfo,
		})
	},
  //根据课程id 获取最终发布课程信息
  getPublishCourseInfo(courseId){
    return request({
      url: `/eduservice/course/getPublishCourseInfo/${courseId}`,
      method: 'get'
    })
  },
  //课程最终发布
  publishCourse(courseId){
	  return request({
      url:`/eduservice/course/publishCourse/${courseId}`,
      method:'put',
    })
  },
  //获取课程列表
  getListCourse(){
	  return request({
      url:`/eduservice/course/getCourseList`,
      method:'get'
    })
  },
  //分页获取课程列表
  getPageListCourse(page,limit,courseQuery){
    return request({
      url:`/eduservice/course/getCoursePageList/${page}/${limit}`,
      method:'post',
      data:courseQuery,
    })
  },
  //删除课程
  removeCourseById(courseId){
	  return request({
      url:`/eduservice/course/deleteCourseById/${courseId}`,
      method:'delete'
    })
  }


}
