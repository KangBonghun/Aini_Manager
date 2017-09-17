package aini.mapper;

import java.util.List;
import java.util.Map;

public interface ClassMapper
{
    public List<Map<String, Object>> getClassList(Map<String, Object> param);

    public List<Map<String, Object>> getClassDateList(Map<String, Object> param);
    
    public Map<String, Object> getClassInfo(Integer classId);

    public List<Map<String, Object>> getUserClass(Map<String, Object> param);

    public Integer insertClassInfo(Map<String, Object> param);

    public Integer updateClassInfo(Map<String, Object> param);
    
    public Integer insertUserClass(Map<String, Object> param);
    
    public Integer updateUserClass(Map<String, Object> param);
    
    public Integer deleteUserClass(Map<String, Object> param);

    public void deleteClassDate(Map<String, Object> classDateParam);

    public void insertClassDate(Map<String, Object> classDateParam);

    public Integer updateClassDate(Map<String, Object> param);

    public void updateAttendanceDate(Map<String, Object> param);
}
