package aini.mapper;

import java.util.List;
import java.util.Map;

public interface ReportMapper
{
    List<Map<String, Object>> getReportStudentList(Map<String, Object> param);

    int updateReportStudent(Map<String, Object> param);

    List<Map<String, Object>> getStepApplyScore();

    List<Map<String, Object>> getLanguageStep();

    void updateStudentClassStep(Map<String, Object> student);

    List<Map<String, Object>> getMonthlyReport(Map<String, Object> student);

	Map<String, Object> getReportStudent(Map<String, Object> param);
	
	List<Map<String, Object>> getAllReportStudent(Map<String, Object> param);
	
	List<Map<String, Object>> getMonthlyHist(Map<String, Object> param);

    List<Map<String, Object>> getClassDateList(Map<String, Object> param);

    List<Map<String, Object>> getAttendanceStudent(Map<String, Object> param);
}
