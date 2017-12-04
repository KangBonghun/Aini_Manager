package aini.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class UserDetailsHelper
{
    private static final Logger logger = LoggerFactory.getLogger(UserDetailsHelper.class);
    
    private static UserDetailsHelper instance = new UserDetailsHelper();

    public static UserDetailsHelper getInstance()
    {
        return instance;
    }

    public String getUserId()
    {
        String userId = null;
        
        try
        {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            userId = authentication.getName();
        }
        catch (Exception e)
        {
            logger.error(e.getMessage(), e);
        }

        return userId;
    }

}
