package aini.web.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import aini.mapper.ReportMapper;
import aini.util.CommonUtil;

@Service
public class ReportService
{
    private static final Logger logger = LoggerFactory.getLogger(ReportService.class);

    @Autowired
    private SqlSession sqlSession;

    @Autowired
    private ClassService classService;

    /**
     * 월간보고서 입력 할 수강생 목록 조회
     *
     * @param param
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 9. 19.
     */
    public List<Map<String, Object>> getReportStudentList(Map<String, Object> param)
    {
        return sqlSession.getMapper(ReportMapper.class).getReportStudentList(param);
    }

    /**
     * 월간 보고서를 저장한다.
     * 
     * @param param
     * @return
     * 
     * @author KangBongHoon
     * @create-date : 2017. 8. 25.
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> updateReportStudent(Map<String, Object> param)
    {
        Map<String, Object> student = (Map<String, Object>) param.get("student");

        Integer totalScore = calcTotalScore(student);

        student.put("totalScore", totalScore);
        student.put("changeDatetime", Calendar.getInstance().getTime());
        student.put("stepScore", calcStepScore(student));
        student.put("step", calcStep(student));

        sqlSession.getMapper(ReportMapper.class).updateReportStudent(student);

        return student;
    }

    /**
     * 종합점수를 계산한다.
     * 
     * @param student
     * @return
     * 
     * @author KangBongHoon
     * @create-date : 2017. 8. 25.
     */
    private Integer calcTotalScore(Map<String, Object> student)
    {
        Integer pronunciation = (Integer) student.get("pronunciation");
        Integer grammar = (Integer) student.get("grammar");
        Integer vocabulary = (Integer) student.get("vocabulary");
        Integer intelligibility = (Integer) student.get("intelligibility");

        Integer totalScore = 0;

        if (pronunciation != null)
        {
            totalScore += pronunciation;
        }
        if (grammar != null)
        {
            totalScore += grammar;
        }
        if (vocabulary != null)
        {
            totalScore += vocabulary;
        }
        if (intelligibility != null)
        {
            totalScore += intelligibility;
        }

        return totalScore;
    }

    /**
     * 이전 스텝 점수에 가산점을 계산한다.
     * 
     * @param student
     * @return
     * 
     * @author KangBongHoon
     * @create-date : 2017. 8. 25.
     */
    private Double calcStepScore(Map<String, Object> student)
    {
        Double stepScore = 0d;
        Integer totalScore;
        Double applyScore;

        try
        {
            stepScore = getStepScore(student);

            totalScore = (Integer) student.get("totalScore");

            applyScore = CommonUtil.getApplyScoreOfTotalScore(totalScore);

            stepScore += applyScore;
        }
        catch (Exception e)
        {
            logger.error(e.getMessage(), e);
        }

        return stepScore;
    }

    /**
     * 마지막으로 평가한 스탭 점수를 반환한다.
     *
     * @param student
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 9. 19.
     */
    private Double getStepScore(Map<String, Object> student)
    {
        Double stepScore = null;

        Map<String, Object> param = new HashMap<String, Object>();
        param.put("userId", student.get("userId"));
        param.put("classId", student.get("classId"));

        List<Map<String, Object>> monthlyReportList = sqlSession.getMapper(ReportMapper.class).getMonthlyReport(param);

        if (monthlyReportList != null && !monthlyReportList.isEmpty())
        {
            for (Map<String, Object> monthlyReport : monthlyReportList)
            {
                String compareValue1 = String.valueOf(monthlyReport.get("year")) + String.format("%02d", Integer.valueOf(String.valueOf(monthlyReport.get("month"))));
                String compareValue2 = String.valueOf(student.get("year")) + String.format("%02d", Integer.valueOf(String.valueOf(student.get("month"))));

                if (compareValue1.compareTo(compareValue2) < 0)
                {
                    if (monthlyReport.get("stepScore") != null)
                    {
                        stepScore = Double.valueOf(String.valueOf(monthlyReport.get("stepScore")));

                        break;
                    }
                }
            }

            if (stepScore == null && student.get("firstStepScore") != null)
            {
                stepScore = Double.valueOf(String.valueOf(student.get("firstStepScore")));
            }
        }
        else
        {
            if (student.get("firstStepScore") != null)
            {
                stepScore = Double.valueOf(String.valueOf(student.get("firstStepScore")));
            }
        }

        if (stepScore == null)
        {
            stepScore = 0d;
        }

        return stepScore;
    }

    /**
     * 스텝 점수에 해당하는 스텝을 계산한다.
     * 
     * @param student
     * @return
     * 
     * @author KangBongHoon
     * @create-date : 2017. 8. 25.
     */
    private Integer calcStep(Map<String, Object> student)
    {
        Double stepScore = Double.valueOf(String.valueOf(student.get("stepScore")));

        return CommonUtil.getStopOfStepScore(stepScore);
    }

    /**
     * 월간보고서 상세정보 조회
     * 
     * @param param
     * @return
     */
    public Map<String, Object> getReportDetailInfo(Map<String, Object> param)
    {
        Map<String, Object> reportInfo = getReportStudent(param);

        if (reportInfo == null)
        {
            return null;
        }

        Map<String, Object> reportDetailInfo = new HashMap<String, Object>();
        reportDetailInfo.put("classInfo", classService.getClassDetailInfo(param));	// classId
        reportDetailInfo.put("reportInfo", reportInfo);
        reportDetailInfo.put("monthlyStep", getMonthlyStep(param));
        reportDetailInfo.put("monthlyScore", getMonthlyScore(param));
        reportDetailInfo.put("monthlyAttendance", getMonthlyAttendance(param));

        return reportDetailInfo;
    }

    /**
     * 월간보고서 조회
     * 
     * @param param
     * @return
     */
    public Map<String, Object> getReportStudent(Map<String, Object> param)
    {
        return sqlSession.getMapper(ReportMapper.class).getReportStudent(param);
    }
    
    /**
     * 월간보고서 조회
     * 
     * @param param
     * @return
     */
    public List<Map<String, Object>> getAllReportStudent(Map<String, Object> param)
    {
        return sqlSession.getMapper(ReportMapper.class).getAllReportStudent(param);
    }

    /**
     * 최근 6개월 스텝 이력
     * 
     * @param param
     * @return
     */
    public List<Integer> getMonthlyStep(Map<String, Object> param)
    {
        List<Integer> monthlyStep = new ArrayList<Integer>();

        try
        {
            List<Map<String, Object>> hist = sqlSession.getMapper(ReportMapper.class).getMonthlyHist(param);

            Map<String, Object> histMap = new HashMap<String, Object>();

            for (Map<String, Object> histItem : hist)
            {
                String key = "" + histItem.get("year") + histItem.get("month");
                Integer step = histItem.get("step") == null ? 0 : (Integer) histItem.get("step");

                histMap.put(key, step);
            }

            Calendar cal = Calendar.getInstance();
            cal.set(Integer.valueOf(String.valueOf(param.get("year"))), Integer.valueOf(String.valueOf(param.get("month"))) - 1, 1);
            cal.add(Calendar.MONTH, -5);

            for (int i = 0; i < 6; i++)
            {
                String key = cal.get(Calendar.YEAR) + String.format("%02d", cal.get(Calendar.MONTH) + 1);

                if (histMap.containsKey(key))
                {
                    monthlyStep.add((Integer) histMap.get(key));
                }
                else
                {
                    monthlyStep.add(0);
                }

                cal.add(Calendar.MONTH, 1);
            }
        }
        catch (Exception e)
        {
            logger.error(e.getMessage(), e);
        }

        return monthlyStep;
    }

    /**
     * 최근 6개월간 점수 이력 반환
     *
     * @param param
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 9. 19.
     */
    public Map<String, List<Integer>> getMonthlyScore(Map<String, Object> param)
    {
        String[] scoreTypes = { "pronunciation", "vocabulary", "grammar", "intelligibility" };

        Map<String, List<Integer>> monthlyScore = new HashMap<String, List<Integer>>();

        try
        {
            List<Map<String, Object>> hist = sqlSession.getMapper(ReportMapper.class).getMonthlyHist(param);

            Map<String, Object> histMap = new HashMap<String, Object>();

            for (Map<String, Object> histItem : hist)
            {
                String key = "" + histItem.get("year") + histItem.get("month");

                histMap.put(key, histItem);
            }

            Calendar cal = Calendar.getInstance();
            cal.set(Integer.valueOf(String.valueOf(param.get("year"))), Integer.valueOf(String.valueOf(param.get("month"))) - 1, 1);
            cal.add(Calendar.MONTH, -5);

            for (int i = 0; i < 6; i++)
            {
                String key = cal.get(Calendar.YEAR) + String.format("%02d", cal.get(Calendar.MONTH) + 1);

                for (String scoreType : scoreTypes)
                {
                    if (!monthlyScore.containsKey(scoreType) || monthlyScore.get(scoreType) == null)
                    {
                        monthlyScore.put(scoreType, new ArrayList<Integer>());
                    }

                    if (histMap.containsKey(key))
                    {
                        Map<String, Object> item = (Map<String, Object>) histMap.get(key);

                        if (item.get(scoreType) != null)
                        {
                            Integer score = Integer.valueOf(String.valueOf(item.get(scoreType)));

                            monthlyScore.get(scoreType).add(score);
                        }
                        else
                        {
                            monthlyScore.get(scoreType).add(null);
                        }
                    }
                    else
                    {
                        monthlyScore.get(scoreType).add(null);
                    }
                }

                cal.add(Calendar.MONTH, 1);
            }
        }
        catch (Exception e)
        {
            logger.error(e.getMessage(), e);
        }

        return monthlyScore;
    }

    /**
     * 최근 6개월간 출석율 반환
     *
     * @param param
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 9. 19.
     */
    public List<Double> getMonthlyAttendance(Map<String, Object> param)
    {
        List<Double> monthlyAttendance = new ArrayList<Double>();

        try
        {
            Calendar cal = Calendar.getInstance();
            cal.set(Integer.valueOf(String.valueOf(param.get("year"))), Integer.valueOf(String.valueOf(param.get("month"))) - 1, 1);
            cal.add(Calendar.MONTH, -5);

            for (int i = 0; i < 6; i++)
            {
                Map<String, Object> attendanceParam = new HashMap<String, Object>();
                attendanceParam.put("classId", param.get("classId"));
                attendanceParam.put("userId", param.get("userId"));
                attendanceParam.put("year", cal.get(Calendar.YEAR));
                attendanceParam.put("month", String.format("%02d", cal.get(Calendar.MONTH) + 1));
                
                //해당 월의 수강일 조회
                List<Map<String, Object>> classDateList = sqlSession.getMapper(ReportMapper.class).getClassDateList(attendanceParam);
                
                //해당 월의 출석 상태 조회
                List<Map<String, Object>> attendanceStudentList = sqlSession.getMapper(ReportMapper.class).getAttendanceStudent(attendanceParam);
                
                if(classDateList == null || classDateList.size() == 0)
                {
                    monthlyAttendance.add(0.0);
                }
                else
                {
                    Integer classDateCnt = classDateList.size();
                    
                    Integer attendanceCnt = 0;
                    
                    double attendance = 0.0;
                    
                    for(Map<String, Object> attendanceStudent : attendanceStudentList)
                    {
                        String status = (String) attendanceStudent.get("status");
                        
                        if(status != null && !"X".equals(status))
                        {
                            attendanceCnt++;
                        }
                    }
                    
                    attendance = (attendanceCnt * 100) / classDateCnt;
                    
                    monthlyAttendance.add(attendance);
                }

                cal.add(Calendar.MONTH, 1);
            }
        }
        catch (Exception e)
        {
            logger.error(e.getMessage(), e);
        }

        return monthlyAttendance;
    }
}