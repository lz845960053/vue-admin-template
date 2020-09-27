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
			method: 'post',
			data:courseInfo,
		})

	}
}