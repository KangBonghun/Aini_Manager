package aini.service;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

/**
 * 인증 실패 핸들러
 * 
 */
public class CustomAuthenticationFailureHandler implements AuthenticationFailureHandler
{
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException
    {
        // Request 객체의 Attribute에 사용자가 실패시 입력했던 로그인 ID와 비밀번호를 저장해두어 로그인 페이지에서 이를 접근하도록 한다
        String loginid = request.getParameter("userid");
        String loginpasswd = request.getParameter("password");

        request.setAttribute("userid", loginid);
//        request.setAttribute("password", loginpasswd);

        if(loginid != null && loginpasswd != null)
        {
            // Request 객체의 Attribute에 예외 메시지 저장
            request.setAttribute("error", "아이디 또는 비밀번호를 확인하세요.");    
        }

        request.getRequestDispatcher("manage/views/signIn.jsp").forward(request, response);
    }

}
