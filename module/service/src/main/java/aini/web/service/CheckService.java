package aini.web.service;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import aini.mapper.CheckMapper;

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
}