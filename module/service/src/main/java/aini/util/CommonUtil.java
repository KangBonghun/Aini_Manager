package aini.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CommonUtil
{
	private static final Logger logger = LoggerFactory.getLogger(CommonUtil.class);
	
	public static Integer getStopOfStepScore(Object paramStepScore)
	{
		Integer step = 1;
		
		try
		{
			Double stepScore = 0.0d;
			
			if(paramStepScore == null)
			{
				stepScore = 0.0;
			}
			if (paramStepScore instanceof Integer)
			{
				stepScore = (double)((Integer) paramStepScore);
			}
			if (paramStepScore instanceof String)
			{
				stepScore = Double.valueOf((String) paramStepScore);
			}
			if (paramStepScore instanceof Double)
			{
				stepScore = (Double) paramStepScore;
			}
			
			if(stepScore >= 0)
			{
				step = 1;
			}
			
			if(stepScore >= 15)
			{
				step = 2;
			}
			
			if(stepScore >= 30)
			{
				step = 3;
			}
			
			if(stepScore >= 45)
			{
				step = 4;
			}
			
			if(stepScore >= 60)
			{
				step = 5;
			}
			
			if(stepScore >= 75)
			{
				step = 6;
			}
			
			if(stepScore >= 90)
			{
				step = 7;
			}
			
			if(stepScore >= 105)
			{
				step = 8;	
			}
		}
		catch (Exception e)
		{
			logger.error(e.getMessage(), e);
		}
		
		return step;
	}
	
	public static Double getApplyScoreOfTotalScore(Integer totalScore)
	{
		Double applyScore = 0.0d;
		
		try
		{
			if(totalScore >= 80)
			{
				applyScore = 0.5;
			}
			
			if(totalScore >= 85)
			{
				applyScore = 1.0;
			}
			
			if(totalScore >= 90)
			{
				applyScore = 1.5;
			}
			
			if(totalScore >= 95)
			{
				applyScore = 2.0;
			}
		}
		catch (Exception e)
		{
			logger.error(e.getMessage(), e);
		}
		
		return applyScore;
	}
}
