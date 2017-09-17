package aini.web.controller;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import aini.web.service.SendService;

@RequestMapping(value = "/counseling")
@Controller
public class CounselingController
{
    private static final Logger logger = LoggerFactory.getLogger(CounselingController.class);
    
    @Autowired
    private SendService sendService;

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String viewIndex()
    {
        return "/counseling/index";
    }

    @RequestMapping(value = "/request", method = RequestMethod.POST)
    public String request(HttpServletRequest request, RedirectAttributes redirectAttributes)
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
        
        return "redirect:/counseling";
    }
}
