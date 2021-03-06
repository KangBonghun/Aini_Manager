package aini.web.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import aini.mapper.CheckMapper;
import aini.mapper.ReportMapper;
import aini.util.UserDetailsHelper;

@Service
public class CheckService
{
    private static final Logger logger = LoggerFactory.getLogger(CheckService.class);

    @Autowired
    private SqlSession sqlSession;
    
    /**
     * 출석 체크 할 수강생 목록 조회
     *
     * @param param
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 9. 19.
     */
    public List<Map<String, Object>> getCheckStudentList(Map<String, Object> param)
    {
        return sqlSession.getMapper(CheckMapper.class).getCheckStudentList(param);
    }

    /**
     * 수강생의 출석 상태 업데이트
     *
     * @param param
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 9. 19.
     */
    @SuppressWarnings("unchecked")
    public int updateCheckStudent(Map<String, Object> param)
    {
        int updateCount = 0;
        
        List<Map<String, Object>> students = (List<Map<String, Object>>) param.get("students");
        
        for(Map<String, Object> student : students)
        {
            if(student.get("status") != null)
            {
                updateCount += sqlSession.getMapper(CheckMapper.class).updateCheckStudent(student);
            }
        }
        
        return updateCount;
    }

    /**
     * 클래스, 월의 수강일 조회
     *
     * @param param
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 9. 24.
     */
    public List<Map<String, Object>> getCheckDates(Map<String, Object> param)
    {
        return sqlSession.getMapper(ReportMapper.class).getClassDateList(param);
    }

    /**
     * 특정 월의 수강생 출석 현황 조회
     *
     * @param param
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 9. 24.
     */
    public List<Map<String, Object>> getCheckStatusList(Map<String, Object> param)
    {
        List<Map<String, Object>> checkStatusList = sqlSession.getMapper(CheckMapper.class).getCheckStatusList(param);
        
        Map<String, Map<String, Object>> checkStatusMap = new LinkedHashMap<String, Map<String,Object>>();
        
        for(Map<String, Object> checkStatus : checkStatusList)
        {
            String userId = (String) checkStatus.get("userId");
            String userName = (String) checkStatus.get("userName");
            
            if(!checkStatusMap.containsKey(userId))
            {
                Map<String, Object> item = new HashMap<String, Object>();
                item.put("userId", userId);
                item.put("userName", userName);
                
                checkStatusMap.put(userId, item);
            }
            
            String classDate = (String) checkStatus.get("classDate");
            String status = (String) checkStatus.get("status");
            
            checkStatusMap.get(userId).put(classDate, status);
        }
        
        return new ArrayList<Map<String,Object>>(checkStatusMap.values());
    }
}