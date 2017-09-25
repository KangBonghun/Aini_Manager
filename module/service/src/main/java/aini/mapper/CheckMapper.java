package aini.mapper;

import java.util.List;
import java.util.Map;

public interface CheckMapper
{
    public List<Map<String, Object>> getCheckStudentList(Map<String, Object> param);

    public int updateCheckStudent(Map<String, Object> param);

    public List<Map<String, Object>> getCheckStatusList(Map<String, Object> param);
}
