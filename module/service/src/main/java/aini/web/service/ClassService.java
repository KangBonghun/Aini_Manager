package aini.web.service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import aini.mapper.ClassMapper;
import aini.util.CommonUtil;
import aini.util.UserDetailsHelper;
import aini.vo.UserVO;

@Service
public class ClassService
{
    private static final Logger logger = LoggerFactory.getLogger(ClassService.class);

    @Autowired
    private SqlSession sqlSession;
    
    @Autowired
    private UserService userService;

    public List<Map<String, Object>> getClassList(Map<String, Object> param)
    {
        UserVO user = userService.getUserById(UserDetailsHelper.getInstance().getUserId());
        
        param.put("userId", user.getUserId());
        param.put("userType", user.getUserType());
        
        return sqlSession.getMapper(ClassMapper.class).getClassList(param);
    }

    public List<Map<String, Object>> getClassDateList(Map<String, Object> param)
    {
        return sqlSession.getMapper(ClassMapper.class).getClassDateList(param);
    }
    
    public Map<String, Object> getClassDetailInfo(Map<String, Object> param)
    {
        Integer classId = Integer.valueOf(String.valueOf(param.get("classId")));
        
        Map<String, Object> classParam = new HashMap<String, Object>();
        classParam.put("classId", classId);
        
        Map<String, Object> classInfo = sqlSession.getMapper(ClassMapper.class).getClassInfo(classId);
        
        List<Map<String, Object>> classDateList = getClassDateList(classParam);
        
        classParam.put("userType", "STUDENT");
        List<Map<String, Object>> studentClass = getUserClass(classParam);
        
        classParam.put("userType", "TEACHER");
        List<Map<String, Object>> teacherClass = getUserClass(classParam);
        
        classParam.put("userType", "MANAGER");
        List<Map<String, Object>> managerClass = getUserClass(classParam);
        
        classInfo.put("dateCount", classDateList == null ? 0 : classDateList.size());
        classInfo.put("studentList", studentClass);
        classInfo.put("studentCount", studentClass == null ? 0 : studentClass.size());
        classInfo.put("teacherId", teacherClass == null || teacherClass.isEmpty() ? "" : teacherClass.get(0).get("userId"));
        classInfo.put("teacherName", teacherClass == null || teacherClass.isEmpty() ? "" : teacherClass.get(0).get("userName"));
        classInfo.put("teacherEmail", teacherClass == null || teacherClass.isEmpty() ? "" : teacherClass.get(0).get("userId"));
        classInfo.put("managerId", managerClass == null || managerClass.isEmpty() ? "" : managerClass.get(0).get("userId"));
        classInfo.put("managerName", managerClass == null || managerClass.isEmpty() ? "" : managerClass.get(0).get("userName"));
        
        return classInfo;
    }

    public List<Map<String, Object>> getUserClass(Map<String, Object> param)
    {
        return sqlSession.getMapper(ClassMapper.class).getUserClass(param);
    }

    public Integer updateClassInfo(Map<String, Object> param)
    {
        Integer updateCount = 0;
        
        Integer classId = param.get("classId") == null ? null : Integer.valueOf(String.valueOf(param.get("classId")));
        
        Map<String, Object> classInfo = sqlSession.getMapper(ClassMapper.class).getClassInfo(classId);
        
        // 클래스 정보 업데이트
        if(classInfo == null)
        {
            param.put("registDatetime", Calendar.getInstance().getTime());  //등록시각 설정
            
            updateCount = sqlSession.getMapper(ClassMapper.class).insertClassInfo(param);
            
            if(param.containsKey("class_id") && param.get("class_id") != null)
            {
                classId = Integer.valueOf(String.valueOf(param.get("class_id")));
            }
        }
        else
        {
        	
        	param.put("registDatetime", null);
            param.put("changeDatetime", Calendar.getInstance().getTime());  //수정시각 설정
            
            updateCount = sqlSession.getMapper(ClassMapper.class).updateClassInfo(param);
        }
        
        // 클래스 수강일 업데이트
        if(classId != null)
        {
            List<String> classDateList = new ArrayList<String>();
            
            try
            {
                Set<Integer> days = getDays(param);
                
                SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
                
                Calendar startDate = Calendar.getInstance();
                startDate.setTime(sdf.parse(String.valueOf(param.get("startDate"))));
                
                Calendar endDate = Calendar.getInstance();
                endDate.setTime(sdf.parse(String.valueOf(param.get("endDate"))));
                
                while(endDate.compareTo(startDate) > 0)
                {
                    if(days.contains(startDate.get(Calendar.DAY_OF_WEEK)))
                    {
                        classDateList.add(sdf.format(startDate.getTime()));
                    }
                    
                    startDate.add(Calendar.DATE, 1);
                }
                
                
                Map<String, Object> classDateParam = new HashMap<String, Object>();
                classDateParam.put("classId", classId);
                
                sqlSession.getMapper(ClassMapper.class).deleteClassDate(classDateParam);
                
                for(String classDate : classDateList)
                {
                    classDateParam.put("classDate", classDate);
                    sqlSession.getMapper(ClassMapper.class).insertClassDate(classDateParam);    
                }
            }
            catch (Exception e)
            {
                logger.error(e.getMessage(), e);
            }
        }
        
        
        if(classId != null)
        {
            //담당 강사 업데이트
            if(param.containsKey("teacherId") && param.get("teacherId") != null && !param.get("teacherId").toString().isEmpty())
            {
                Map<String, Object> teacherClass = new HashMap<String, Object>();
                teacherClass.put("classId", classId);
                teacherClass.put("userType", "TEACHER");
                sqlSession.getMapper(ClassMapper.class).deleteUserClass(teacherClass);
                
                String teacherId = param.get("teacherId").toString();
                teacherClass.put("userId", teacherId);
                sqlSession.getMapper(ClassMapper.class).insertUserClass(teacherClass);
            }
            
            //담당 매니저 업데이트
            if(param.containsKey("managerId") && param.get("managerId") != null && !param.get("managerId").toString().isEmpty())
            {
                Map<String, Object> managerClass = new HashMap<String, Object>();
                managerClass.put("classId", classId);
                managerClass.put("userType", "MANAGER");
                sqlSession.getMapper(ClassMapper.class).deleteUserClass(managerClass);
                
                String managerId = param.get("managerId").toString();
                managerClass.put("userId", managerId);
                sqlSession.getMapper(ClassMapper.class).insertUserClass(managerClass);
            }
        }
        
        //강의 수강생 목록 업데이트
        if(param.containsKey("studentList") && param.get("studentList") != null)
        {
            Map<String, Object> studentClass = new HashMap<String, Object>();
            studentClass.put("classId", classId);
            studentClass.put("userType", "STUDENT");
            
            List<Map<String, Object>> prvStudentList = getUserClass(studentClass);
            
            Map<String, Object> prvStudentMap = new HashMap<String, Object>();
            for(Map<String, Object> prvStudent : prvStudentList)
            {
            	prvStudentMap.put((String) prvStudent.get("userId"), prvStudent);
            }
            
            List<Map<String, Object>> studentList = (List<Map<String, Object>>) param.get("studentList");
            
            for(Map<String, Object> student : studentList)
            {
            	String userId = (String) student.get("userId");
            	
            	studentClass.put("userId", userId);
            	
            	List<Map<String, Object>> existStudent = getUserClass(studentClass);
            	
            	if(existStudent == null || existStudent.size() == 0)
            	{
            		sqlSession.getMapper(ClassMapper.class).insertUserClass(studentClass);
            	}
            	
            	prvStudentMap.remove(userId);
            }
            
            for(String userId : prvStudentMap.keySet())
            {
            	studentClass.put("userId", userId);
            	
            	sqlSession.getMapper(ClassMapper.class).deleteUserClass(studentClass);
            }
        }
        
        return updateCount;
    }
    
    private Set<Integer> getDays(Map<String, Object> classInfo)
    {
        Set<Integer> days = new HashSet<Integer>();
        
        if(classInfo.containsKey("monday") && classInfo.get("monday") != null && "Y".equals(classInfo.get("monday")))
        {
            days.add(Calendar.MONDAY);
        }
        
        if(classInfo.containsKey("tuesday") && classInfo.get("tuesday") != null && "Y".equals(classInfo.get("tuesday")))
        {
            days.add(Calendar.TUESDAY);
        }
        
        if(classInfo.containsKey("wednesday") && classInfo.get("wednesday") != null && "Y".equals(classInfo.get("wednesday")))
        {
            days.add(Calendar.WEDNESDAY);
        }
        
        if(classInfo.containsKey("thursday") && classInfo.get("thursday") != null && "Y".equals(classInfo.get("thursday")))
        {
            days.add(Calendar.THURSDAY);
        }
        
        if(classInfo.containsKey("friday") && classInfo.get("friday") != null && "Y".equals(classInfo.get("friday")))
        {
            days.add(Calendar.FRIDAY);
        }
        
        if(classInfo.containsKey("saturday") && classInfo.get("saturday") != null && "Y".equals(classInfo.get("saturday")))
        {
            days.add(Calendar.SATURDAY);
        }
        
        if(classInfo.containsKey("sunday") && classInfo.get("sunday") != null && "Y".equals(classInfo.get("sunday")))
        {
            days.add(Calendar.SUNDAY);
        }
        
        return days;
    }

    public Integer updateClassDate(Map<String, Object> param)
    {
        sqlSession.getMapper(ClassMapper.class).updateAttendanceDate(param);
        
        return sqlSession.getMapper(ClassMapper.class).updateClassDate(param);
        
        
    }

	public Map<String, Object> updateUserClass(Map<String, Object> param)
	{
		Map<String, Object> student = (Map<String, Object>) param.get("student");
		
		student.put("firstEvaluationDate", new SimpleDateFormat("yyyyMMdd").format(Calendar.getInstance().getTime()));
		student.put("firstStepScore", student.get("firstStepScore") == null ? 0 : student.get("firstStepScore"));
		student.put("firstStep", CommonUtil.getStopOfStepScore(student.get("firstStepScore")));
		
		sqlSession.getMapper(ClassMapper.class).updateUserClass(student);
		
		return student;
	}
}