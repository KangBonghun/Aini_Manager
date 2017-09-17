package aini.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class UserDetailsHelper
{
    private static UserDetailsHelper instance = new UserDetailsHelper();

    public static UserDetailsHelper getInstance()
    {
        return instance;
    }

    public String getUserId()
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        return authentication.getName();
    }

}
