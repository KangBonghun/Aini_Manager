package aini.web.service;

import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.stereotype.Service;

import aini.mapper.ReportMapper;

@Service
public class ReportService
{
    private static final Logger logger = LoggerFactory.getLogger(ReportService.class);

    @Autowired
    private SqlSession sqlSession;

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

            applyScore = getStepApplyScore(totalScore);

            stepScore += applyScore;
        }
        catch (Exception e)
        {
            logger.error(e.getMessage(), e);
        }

        return stepScore;
    }

    private Double getStepScore(Map<String, Object> student)
    {
        Double stepScore = null;

        Map<String, Object> param = new HashMap<String, Object>();
        param.put("userId", student.get("userId"));
        param.put("classId", student.get("classId"));

        List<Map<String, Object>> monthlyReportList = sqlSession.getMapper(ReportMapper.class).getMonthlyReport(param);
        
        if (monthlyReportList != null && !monthlyReportList.isEmpty())
        {
            for(Map<String, Object> monthlyReport : monthlyReportList)
            {
                String compareValue1 = String.valueOf(monthlyReport.get("year")) + String.valueOf(monthlyReport.get("month"));
                String compareValue2 = String.valueOf(student.get("year")) + String.valueOf(student.get("month"));
                
                if(compareValue1.compareTo(compareValue2) < 0)
                {
                    if (monthlyReport.get("stepScore") != null)
                    {
                        stepScore = Double.valueOf(String.valueOf(monthlyReport.get("stepScore")));
                        
                        break;
                    }
                }
            }
            
            if(stepScore == null && student.get("firstStepScore") != null)
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
        
        if(stepScore == null)
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

        return getStep(stepScore);
    }

    /**
     * 스텝 점수에 해당하는 스텝을 반환한다.
     * 
     * @param stepScore
     * @return
     * 
     * @author KangBongHoon
     * @create-date : 2017. 8. 25.
     */
    private Integer getStep(Double stepScore)
    {
        Integer step = 1;

        ExpressionParser parser = new SpelExpressionParser();

        List<Map<String, Object>> languageStepList = sqlSession.getMapper(ReportMapper.class).getLanguageStep();

        for (Map<String, Object> languageStep : languageStepList)
        {
            String condition = (String) languageStep.get("stepCondition");

            condition = condition.replaceAll("\\$VALUE\\$", String.valueOf(stepScore));

            if (parser.parseExpression(condition).getValue(Boolean.class))
            {
                step = (Integer) languageStep.get("step");

                break;
            }
        }

        return step;
    }

    /**
     * 종합 점수에 따른 가점을 반환한다.
     * 
     * @param totalScore
     * @return
     * 
     * @author KangBongHoon
     * @create-date : 2017. 8. 25.
     */
    private Double getStepApplyScore(Integer totalScore)
    {
        Double applyScore = 0d;

        ExpressionParser parser = new SpelExpressionParser();

        List<Map<String, Object>> stepApplyScoreList = sqlSession.getMapper(ReportMapper.class).getStepApplyScore();

        for (Map<String, Object> stepApplyScore : stepApplyScoreList)
        {
            String condition = (String) stepApplyScore.get("applyCondition");

            condition = condition.replaceAll("\\$VALUE\\$", String.valueOf(totalScore));

            if (parser.parseExpression(condition).getValue(Boolean.class))
            {
                applyScore = Double.valueOf(String.valueOf(stepApplyScore.get("applyScore")));
                break;
            }
        }

        return applyScore;
    }
}