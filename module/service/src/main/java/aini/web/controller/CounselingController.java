package aini.web.controller;

import java.util.Arrays;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import aini.web.service.SendService;

//@RequestMapping(value = "/counseling")
@Controller
public class CounselingController
{
    private static final Logger logger = LoggerFactory.getLogger(CounselingController.class);
    
    @Autowired
    private SendService sendService;

    @RequestMapping(value = "/counseling", method = RequestMethod.GET)
    public String viewIndex()
    {
        return "/counseling/index";
    }
    
    @RequestMapping(value = "/m/counseling", method = RequestMethod.GET)
    public String mobileViewIndex()
    {
        return "/counseling/m_index";
    }

    @RequestMapping(value = "/m/counseling/request", method = RequestMethod.POST)
    public String requestMobile(HttpServletRequest request, RedirectAttributes redirectAttributes)
    {
        String name = request.getParameter("fi_name");
        String tel = request.getParameter("fi_tel");
        String age = request.getParameter("fi_age");
        String level = request.getParameter("fi_level");
        String date = request.getParameter("fi_date");
        
        String emailSubject = "중국어 교육 상담 신청";
        String emailContent = ""
            + "이름 : " + name + "\n"
            + "전화번호 : " + tel + "\n"
            + "강의 대상 연령 : " + age + "\n"
            + "강의과정 : " + level + "\n"
            + "희망 강의 시작일 : " + date;
        
        String smsContent = ""
            + "[중국어 교육 상담 신청]\n"
            + name + "\n"
            + tel + "\n"
            + age + "\n"
            + level + "\n"
            + date;
        
        boolean smsResult = sendService.sendSms(smsContent, "01082993012");
        boolean emailResult = sendService.sendEmail("tonight1323@gmail.com", emailSubject, emailContent, null);
        
        if(smsResult || emailResult)
        {
            redirectAttributes.addFlashAttribute("msg", "success");
        }
        else
        {
            redirectAttributes.addFlashAttribute("msg", "fail");
        }
        
        return "redirect:/m/counseling";
    }
    
    @RequestMapping(value = "/counseling/request", method = RequestMethod.POST)
    public String requestWeb(HttpServletRequest request, RedirectAttributes redirectAttributes)
    {
        String fi_company_name = request.getParameter("fi_company_name");
        String fi_company_addr = request.getParameter("fi_company_addr");
        String fi_manager_name = request.getParameter("fi_manager_name");
        String fi_email_addr = request.getParameter("fi_email_addr");
        String fi_email_domain = request.getParameter("fi_email_domain");
        String fi_tel1 = request.getParameter("fi_tel1");
        String fi_tel2 = request.getParameter("fi_tel2");
        String fi_tel3 = request.getParameter("fi_tel3");
        String fi_program_type = request.getParameter("fi_program_type");
        String fi_program_s = request.getParameter("fi_program_s");
        String fi_program_g = request.getParameter("fi_program_g");
        String fi_language = request.getParameter("fi_language");
        String fi_teacher = request.getParameter("fi_teacher");
        String fi_hope_date = request.getParameter("fi_hope_date");
        String fi_start_date = request.getParameter("fi_start_date");
        String fi_end_date = request.getParameter("fi_end_date");
        String[] fi_days = request.getParameterValues("fi_days");
        String fi_start_meridiem = request.getParameter("fi_start_meridiem");
        String fi_start_hour = request.getParameter("fi_start_hour");
        String fi_end_meridiem = request.getParameter("fi_end_meridiem");
        String fi_end_hour = request.getParameter("fi_end_hour");
        String fi_detail = request.getParameter("fi_detail");
        
        String emailSubject = "상담 신청";
        String emailContent = ""
            + "<div style=\"color:#333\">"
            + "<b>회사명 : </b>" + fi_company_name + "<br/><br/>"
            + "<b>회사주소 : </b>" + fi_company_addr + "<br/><br/>"
            + "<b>담당자명 : </b>" + fi_manager_name + "<br/><br/>"
            + "<b>E-mail : </b>" + fi_email_addr + "@" + fi_email_domain + "<br/><br/>"
            + "<b>연락처 : </b>" + fi_tel1 + "-" + fi_tel2 + "-" + fi_tel3 + "<br/><br/>"
            + "<b>강의과정 : </b>" + fi_program_type + " - " + (fi_program_type.indexOf("특화") > 0 ? fi_program_s : fi_program_g) + "<br/><br/>"
            + "<b>강의과목 : </b>" + fi_language + "<br/><br/>"
            + "<b>희망강사 : </b>" + fi_teacher + "<br/><br/>"
            + "<b>교육 시작 희망일 : </b>" + fi_hope_date + "<br/><br/>"
            + "<b>예상 교육 기간 : </b>" + fi_start_date + " ~ " + fi_end_date + "<br/><br/>"
            + "<b>예상 교육 스케줄 : </b>" + Arrays.toString(fi_days) + " " + fi_start_meridiem + " " + fi_start_hour + "시" + " ~ " + fi_end_meridiem + " " + fi_end_hour + "시" + "<br/><br/>"
            + "<b>상세 문의 내용 : </b>" + fi_detail + "<br/><br/>"
            + "</div>";
        
        String smsContent = ""
            + "[상담 신청이 도착했습니다.]\n"
            + "회사명 : " + fi_company_name + "\n"
            + "담당자명 : " + fi_manager_name;
        
        boolean smsResult = sendService.sendSms(smsContent, "01082993012");
        boolean emailResult = sendService.sendEmail("tonight1323@gmail.com", emailSubject, emailContent, null);
        
        if(smsResult || emailResult)
        {
            redirectAttributes.addFlashAttribute("msg", "success");
        }
        else
        {
            redirectAttributes.addFlashAttribute("msg", "fail");
        }
        
        
        
        
        return "redirect:/counseling";
    }
}
