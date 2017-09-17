package aini.web.controller;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import aini.util.AuthUtil;
import aini.vo.StudentVO;
import aini.web.service.ConvertService;
import aini.web.service.SendService;
import aini.web.service.UploadService;

import com.fasterxml.jackson.core.JsonProcessingException;

@RequestMapping(value = "/report")
@Controller
public class ReportController
{
    private static final Logger logger = LoggerFactory.getLogger(ReportController.class);

    @Autowired
    private UploadService uploadService;

    @Autowired
    private SendService sendService;
    
    /**
     * 보고서 전송 관리 페이지(report/sendReport.jsp)로 리다이렉트한다.
     * 
     * @param model
     * @param request
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 2. 26.
     */
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String viewSendReport(Model model, HttpServletRequest request)
    {
        return "/report/sendReport";
    }

    /**
     * 보고서 페이지(report/viewReport.jsp)로 리다이렉트한다.
     * 
     * @param phoneNumber
     * @param model
     * @param request
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 2. 26.
     */
    @RequestMapping(value = "/{phoneNumber}", method = RequestMethod.GET)
    public String viewReport(@PathVariable("phoneNumber") String phoneNumber, Model model, HttpServletRequest request)
    {
        model.addAttribute("phoneNumber", phoneNumber);

        return "/report/viewReport";
    }

    /**
     * 보고서 엑셀 파일을 파싱해서 수강생 정보를 View 로 반환한다.
     * 파싱할 때 수강생 별로 별도의 엑셀 파일로 분리 저장한다.
     * 
     * @param multi
     * @param response
     * 
     * @author KangBongHoon
     * @create-date : 2017. 2. 16.
     */
    @RequestMapping(value = "/upload", method = RequestMethod.POST, headers = "content-type=multipart/*")
    public void upload(MultipartHttpServletRequest multi, HttpServletResponse response)
    {
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html; charset=UTF-8");

        try
        {
            String result = uploadService.upload(multi);

            PrintWriter writer = response.getWriter();
            writer.println(result);
        }
        catch (IOException e)
        {
            logger.error(e.getMessage(), e);
        }
    }

    /**
     * 전송 버튼을 눌렀을 때 실행된다.
     * 수강생의 PDF 파일을 생성하고 PDF를 열람 할 수 있는 URL을 문자/이메일로 전송한다.
     * 
     * @param students
     * @return 전송 결과 (F=실패, S=성공, W=일부실패)
     * @throws JsonProcessingException
     * 
     * @author KangBongHoon
     * @create-date : 2017. 2. 16.
     */
    @RequestMapping(value = "/send", method = RequestMethod.POST)
    @ResponseBody
    public StudentVO send(@RequestBody StudentVO student) throws Exception
    {
        Boolean emailResult = false;
        Boolean smsResult = false;

        try
        {
            if (student.isSend())
            {
                student.setAuth(AuthUtil.write(student.getPhoneNumber()));

                String pdfFile = new ConvertService(student).xlsxToPdf();

                student.setPdfFilePath(pdfFile);

                emailResult = sendService.sendEmail(student);
                smsResult = sendService.sendSms(student);

                String status = "F";

                if (emailResult && smsResult)
                {
                    status = "S";
                }
                else if (emailResult || smsResult)
                {
                    status = "PF";
                }

                student.setStatus(status);
            }
            else
            {
                student.setStatus("S");
            }
        }
        catch (Exception e)
        {
            logger.error(e.getMessage(), e);

            student.setStatus("F");
        }

        // logger.info("");
        // logger.info("############### SMS or Email send result ###############");
        // logger.info("Name : " + student.getName());
        // logger.info("Phone : " + "(" + student.getPhoneFlag() + ")" + " " + student.getPhoneNumber());
        // logger.info("Email : " + "(" + student.getEmailFlag() + ")" + " " + student.getEmailAddress());
        // logger.info("Phone result : " + smsResult);
        // logger.info("Email result : " + emailResult);
        // logger.info("");

        return student;
    }

    /**
     * 휴대 전화번호를 인자로 받아서 보고서(PDF) 존재 여부를 확인한다.
     * 
     * @param phoneNumber
     * @param authNumber
     * @param request
     * @param response
     * @return 존재 여부. 존재하지 않으면 공백, 존재하면 파일 이름
     * @throws IOException
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 2. 26.
     */
    @RequestMapping(value = "/check/{phoneNumber}/{authNumber}", method = RequestMethod.GET)
    @ResponseBody
    public String reportCheck(@PathVariable("phoneNumber") String phoneNumber, @PathVariable("authNumber") String authNumber, HttpServletRequest request, HttpServletResponse response) throws IOException
    {
        String fileName = "";

        if (AuthUtil.checkAuth(phoneNumber, authNumber))
        {
            File dir = new File(request.getSession().getServletContext().getRealPath("/") + "/report/upload/pdf/");

            if (dir.listFiles() != null && dir.listFiles().length > 0)
            {
                for (File file : dir.listFiles())
                {
                    if (file.getName().indexOf(phoneNumber) > -1)
                    {
                        fileName = file.getName();

                        break;
                    }
                }
            }
        }

        return fileName;
    }

    /**
     * 보고서 PDF 반환
     * 
     * @return
     * @author KangBongHoon
     * @throws InterruptedException
     * @throws IOException
     * @create-date : 2017. 2. 16.
     */
    @RequestMapping(value = "/get/{fileName}", method = RequestMethod.GET)
    public void report(@PathVariable("fileName") String fileName, HttpServletRequest request, HttpServletResponse response) throws IOException
    {
        String ref = request.getHeader("REFERER");

        // URL로 직접 접근할 경우에는 보고서 메인 화면으로 리다이렉트 한다.
        if (ref == null)
        {
            response.sendRedirect("/report/viewReport.jsp");

            return;
        }

        FileInputStream ifo = null;
        ByteArrayOutputStream baos = null;
        OutputStream out = null;

        try
        {
            // PDF 파일 조회
            File pdfFile = new File(request.getSession().getServletContext().getRealPath("/") + "/report/upload/pdf/" + fileName + ".pdf");

            ifo = new FileInputStream(pdfFile);
            baos = new ByteArrayOutputStream();

            byte[] buf = new byte[1024];

            int readlength = 0;

            while ((readlength = ifo.read(buf)) != -1)
            {
                baos.write(buf, 0, readlength);
            }

            byte[] pdfBuf = null;

            pdfBuf = baos.toByteArray();

            int length = pdfBuf.length;

            out = response.getOutputStream();

            out.write(pdfBuf, 0, length);

        }
        catch (Exception e)
        {
            response.setCharacterEncoding("UTF-8");
            response.setContentType("text/html; charset=UTF-8");

            response.getWriter().println("보고서를 가져오는 도중 에러가 발생했습니다.");

            logger.error(e.getMessage(), e);
        }
        finally
        {
            try
            {
                if (baos != null)
                {
                    baos.close();
                }
            }
            catch (IOException e)
            {
                logger.error(e.getMessage(), e);
            }

            try
            {
                if (ifo != null)
                {
                    ifo.close();
                }
            }
            catch (IOException e)
            {
                logger.error(e.getMessage(), e);
            }

            try
            {
                if (out != null)
                {
                    out.close();
                }
            }
            catch (IOException e)
            {
                logger.error(e.getMessage(), e);
            }
        }
    }
}