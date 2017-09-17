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
    
    public List<Map<String, Object>> getCheckStudentList(Map<String, Object> param)
    {
        return sqlSession.getMapper(CheckMapper.class).getCheckStudentList(param);
    }

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