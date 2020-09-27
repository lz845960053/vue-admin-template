import request from '@/utils/request'

export default{
	//1,讲师类表
	getTeacherListPage(page,limit,teacherQuery){
		return request({
			url: `/eduservice/teacher/pageTeacherCondition/${page}/${limit}`,
			method: 'post',
			data: teacherQuery
		})
	},
	//删除讲师
	deleteTeacherById(id){
		return request({
			url:`/eduservice/teacher/${id}`,
			method:'delete'
		})
	},
	//添加讲师
	addTeacher(teacher){
		return request({
			url:`/eduservice/teacher/addTeacher`,
			method:'post',
			data:teacher
		})
	},
	//根据id查询讲师详情
	getTeacher(id){
		return request({
			url:`/eduservice/teacher/getTeacher/${id}`,
			method:'get'
		})
	},
	//根据id修改讲师
	updateTeacher(teacher){
		return request({
			url:`/eduservice/teacher/updateTeacher`,
			method:'post',
			data:teacher,
		})
	}

}
