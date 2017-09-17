package aini.service;

import java.io.IOException;
import java.util.Calendar;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import aini.vo.UserVO;
import aini.web.service.UserService;

public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler
{
    private Logger logger = LoggerFactory.getLogger(CustomAuthenticationSuccessHandler.class);
    
    @Autowired
    UserService userService;

    public CustomAuthenticationSuccessHandler()
    {
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException
    {
        clearAuthenticationAttributes(request);
        
        String loginid = request.getParameter("userid");
        String loginpasswd = request.getParameter("password");

        request.setAttribute("userid", loginid);
        request.setAttribute("password", loginpasswd);
        
        updateLastLoginDatetime(loginid);
        
        request.getRequestDispatcher("manage/manage.jsp").forward(request, response);
    }
    
    /**
     * 마지막 접속 시각을 업데이트한다.
     *
     * @param userId
     * 
     * @author KangBongHoon
     * @create-date : 2017. 8. 25.
     */
    private void updateLastLoginDatetime(String userId)
    {
        UserVO user = new UserVO();
        user.setUserId(userId);
        user.setLastLoginDatetime(Calendar.getInstance().getTime());
        
        userService.modifyUser(user);
    }

    private void clearAuthenticationAttributes(HttpServletRequest request)
    {
        HttpSession session = request.getSession(false);

        if (session == null)
        {
            return;
        }

        session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
    }
}