package aini.common.filter;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import aini.util.AuthUtil;

public class PdfFilter implements Filter
{
    private static final Logger logger = LoggerFactory.getLogger(PdfFilter.class);

    /**
     * Default constructor.
     */
    public PdfFilter()
    {
    }

    @Override
    public void destroy()
    {
        logger.info("PdfFilter is destroyed.");
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException
    {
        HttpSession session = ((HttpServletRequest) request).getSession();
        if (session.isNew())
        {
            logger.info("[" + ((HttpServletRequest) request).getServletPath() + "] Session Created : " + session.getId());
        }

        String param = ((HttpServletRequest) request).getParameter("param");
        
        if(logger.isDebugEnabled())
        {
            logger.debug("[param] : " + param);
        }
        
        //if (AuthUtil.checkAuth(phoneNumber, authNumber))
        if (param != null && param.split("\\.").length == 2 && AuthUtil.checkAuth(param.split("\\.")[0], param.split("\\.")[1]))
        {
            try
            {
                chain.doFilter(request, response);
            }
            catch (Exception e)
            {
                logger.error(e.toString());
            }
        }
        else
        {
            response.setCharacterEncoding("UTF-8");
            response.setContentType("text/html");
            
            PrintWriter out = response.getWriter();
            
            //out.println("<link href='/css/sweetalert.css' rel='stylesheet' type='text/css' />");
            //out.println("<script src='/js/sweetalert.min.js' type='text/javascript'></script>");
            
//            out.println("<html><head></head><body>");
//            out.println("<script type=\"text/javascript\">");  
//            out.println("swal('접근거부', '잘못 된 접근입니다.', 'error')");  
//            out.println("</script>");
//            out.print("</body></html>");
            
            out.println("잘못 된 접근입니다.");
        }
    }

    @Override
    public void init(FilterConfig fConfig) throws ServletException
    {
        logger.info("PdfFilter is created.");
    }
}
