package aini.web.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import aini.util.UserDetailsHelper;
import aini.vo.UserVO;
import aini.web.service.CheckService;
import aini.web.service.ClassService;
import aini.web.service.ReportService;
import aini.web.service.SendService;
import aini.web.service.UserService;

/**
 * 이 클래스는 XXXX 이다.
 * 
 * @author "KangBongHoon"
 * @version 1.0
 */
@RequestMapping(value = "/manage")
@Controller
public class ManageController
{
    private static final Logger logger = LoggerFactory.getLogger(ManageController.class);

    @Autowired
    private CheckService checkService;

    @Autowired
    private ClassService classService;

    @Autowired
    private UserService userService;

    @Autowired
    private ReportService reportService;

    @Autowired
    private SendService sendService;

    /**
     * 메인 화면
     * 
     * @param model
     * @param request
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 9. 6.
     */
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String mainPage(Model model, HttpServletRequest request)
    {
        return "/manage/manage";
    }

    /**
     * 회원가입 화면
     * 
     * @param model
     * @param request
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 9. 6.
     */
    @RequestMapping(value = "/sign-up", method = RequestMethod.GET)
    public String signUp(Model model, HttpServletRequest request)
    {
        return "/manage/views/signUp";
    }

    /**
     * 비밀번호 찾기 화면
     * 
     * @param model
     * @param request
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 9. 6.
     */
    @RequestMapping(value = "/find-pw", method = RequestMethod.GET)
    public String findPassword(Model model, HttpServletRequest request)
    {
        return "/manage/views/findPassword";
    }

    /**
     * 로그인 수행
     * 
     * @param error
     * @param logout
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 9. 6.
     */
    @RequestMapping(value = "/sign/sign-in", method = RequestMethod.GET)
    public ModelAndView signIn(@RequestParam(value = "error", required = false) String error, @RequestParam(value = "logout", required = false) String logout)
    {
        ModelAndView model = new ModelAndView();

        if (error != null)
        {
            // model.addObject("error", "Invalid username and password!");
        }

        if (logout != null)
        {
            // model.addObject("msg", "You've been logged out successfully.");
        }

        model.setViewName("/manage/views/signIn");

        return model;
    }

    /**
     * 회원가입 수행
     * 
     * @param request
     * @param redirectAttributes
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 9. 6.
     */
    @RequestMapping(value = "/sign/sign-up", method = RequestMethod.POST)
    public String signUp(HttpServletRequest request, RedirectAttributes redirectAttributes)
    {
        String id = request.getParameter("id");
        String pw = request.getParameter("pswd1");
        String name = request.getParameter("nm");
        String email = request.getParameter("id");
        String phone = request.getParameter("phone");
        String userType = request.getParameter("userType");

        Map<String, Object> param = new HashMap<String, Object>();
        param.put("userId", id);
        param.put("userName", name);
        param.put("password", pw);
        param.put("userType", userType);
        param.put("email", email);
        param.put("mobileNumber", phone);

        boolean result = userService.createUser(param);

        if (result)
        {
            redirectAttributes.addFlashAttribute("msg", "회원가입이 완료되었습니다.");
        }
        else
        {
            redirectAttributes.addFlashAttribute("msg", "회원가입에 실패하였습니다.\n문의 010-4908-2626 / 02-722-2627");
        }

        return "redirect:/manage/sign/sign-in";
    }

    /**
     * 비밀번호 찾기 수행
     * 
     * @param request
     * @param redirectAttributes
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 9. 6.
     */
    @RequestMapping(value = "/sign/find-pw", method = RequestMethod.POST)
    public String findPw(HttpServletRequest request, RedirectAttributes redirectAttributes)
    {
        String id = request.getParameter("id");
        String name = request.getParameter("nm");
        String phone = request.getParameter("phone");

        UserVO user = userService.getUserById(id);
        
        String message = "";

        if (user != null && name.equals(user.getUserName()) && phone.equals(user.getMobileNumber()))
        {
            boolean result = false;
            
            try
            {
                String newPw = newPassword(8);
                UserVO chgPwUser = new UserVO();
                chgPwUser.setUserId(user.getUserId());
                chgPwUser.setPassword(userService.encodePassword(newPw));
                
                result = userService.modifyUser(chgPwUser) && sendService.sendEmail(id, "[아이니에듀] 비밀번호 임시발급", "임시발급 비밀번호 : " + newPw, null);
            }
            catch (Exception e)
            {
                result = false;
            }
            
            if(result)
            {
                message = "이메일로 임시발급 된 비밀번호를 전송하였습니다.";
            }
            else
            {
                message = "비밀번호 임시발급에 실패하였습니다.\\n문의 010-4908-2626 / 02-722-2627"; 
            }
        }
        else
        {
            message = "입력하신 내용에 해당하는 계정이 없습니다.";
        }
        
        redirectAttributes.addFlashAttribute("msg", message);

        return "redirect:/manage/find-pw";
    }

    /**
     * 임시발급 패스워드 생성
     *
     * @param len
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 9. 9.
     */
    private String newPassword(int len)
    {
        char[] charSet = new char[] { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' };

        int idx = 0;

        StringBuffer sb = new StringBuffer();

        System.out.println("charSet.length :::: " + charSet.length);

        for (int i = 0; i < len; i++)
        {
            idx = (int) (charSet.length * Math.random()); // 36 * 생성된 난수를 Int로 추출 (소숫점제거)

            System.out.println("idx :::: " + idx);

            sb.append(charSet[idx]);
        }

        return sb.toString();
    }

    /**
     * 강의 목록 조회
     * 
     * @param param
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 9. 6.
     */
    @RequestMapping(value = "/get-class-list", method = RequestMethod.POST)
    @ResponseBody
    public List<Map<String, Object>> getClassList(@RequestBody Map<String, Object> param)
    {
        List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();

        try
        {
            result = classService.getClassList(param);
        }
        catch (Exception e)
        {
            logger.error(e.getMessage(), e);
        }

        return result;
    }

    /**
     * 출석 수강생 목록 조회
     * 
     * @param param
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 9. 6.
     */
    @RequestMapping(value = "/get-check-student-list", method = RequestMethod.POST)
    @ResponseBody
    public List<Map<String, Object>> getCheckStudentList(@RequestBody Map<String, Object> param)
    {
        List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();

        try
        {
            result = checkService.getCheckStudentList(param);
        }
        catch (Exception e)
        {
            logger.error(e.getMessage(), e);
        }

        return result;
    }

    /**
     * 수강일 조회
     * 
     * @param param
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 9. 6.
     */
    @RequestMapping(value = "/get-class-date-list", method = RequestMethod.POST)
    @ResponseBody
    public List<Map<String, Object>> getClassDateList(@RequestBody Map<String, Object> param)
    {
        List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();

        try
        {
            result = classService.getClassDateList(param);
        }
        catch (Exception e)
        {
            logger.error(e.getMessage(), e);
        }

        return result;
    }

    /**
     * 출석 업데이트
     * 
     * @param param
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 9. 6.
     */
    @RequestMapping(value = "/update-check-student", method = RequestMethod.POST)
    @ResponseBody
    public int updateCheckStudent(@RequestBody Map<String, Object> param)
    {
        int updateCount = 0;

        try
        {
            updateCount = checkService.updateCheckStudent(param);
        }
        catch (Exception e)
        {
            logger.error(e.getMessage(), e);
        }

        return updateCount;
    }

    /**
     * 월간 보고서 목록 조회
     * 
     * @param param
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 9. 6.
     */
    @RequestMapping(value = "/get-report-student-list", method = RequestMethod.POST)
    @ResponseBody
    public List<Map<String, Object>> getReportStudentList(@RequestBody Map<String, Object> param)
    {
        List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();

        try
        {
            result = reportService.getReportStudentList(param);
        }
        catch (Exception e)
        {
            logger.error(e.getMessage(), e);
        }

        return result;
    }
    
    /**
     * 월간 보고서 업데이트
     * 
     * @param param
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 9. 6.
     */
    @RequestMapping(value = "/update-report-student", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> updateReportStudent(@RequestBody Map<String, Object> param)
    {
        Map<String, Object> student = null;

        try
        {
            student = reportService.updateReportStudent(param);
        }
        catch (Exception e)
        {
            logger.error(e.getMessage(), e);
        }

        return student;
    }
    
    /**
     * 회원 정보 조회
     * 
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 9. 6.
     */
    @RequestMapping(value = "/get-user-info", method = RequestMethod.GET)
    @ResponseBody
    public UserVO getUserInfo()
    {
        String userId = UserDetailsHelper.getInstance().getUserId();
        
        UserVO user = userService.getUserById(userId);
        
        if(user != null)
        {
            user.setPassword(null);
        }

        return user;
    }
    
    /**
     * 회원 정보 조회2
     * 
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 9. 6.
     */
    @RequestMapping(value = "/get-user-info2", method = RequestMethod.POST)
    @ResponseBody
    public UserVO getUserInfo2(@RequestBody Map<String, Object> param)
    {
        String userId = param.get("userId").toString();
        
        UserVO user = userService.getUserById(userId);
        
        if(user != null)
        {
            user.setPassword(null);
        }

        return user;
    }

    /**
     * 회원 존재 여부 확인
     * 
     * @param id
     * @return
     * 
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 9. 6.
     */
    @RequestMapping(value = "/check-user-exist", method = RequestMethod.GET)
    @ResponseBody
    public boolean checkUserExist(@RequestParam(value = "id") String id)
    {
        String userId = id;

        UserVO user = userService.getUserById(userId);

        return user == null ? false : true;
    }
    
    /**
     * 강의 상세 정보 조회
     * 
     * @param param
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 9. 6.
     */
    @RequestMapping(value = "/get-clsas-info-detail", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> getClassInfoDetail(@RequestBody Map<String, Object> param)
    {
        Map<String, Object> result = new HashMap<String, Object>();

        try
        {
            result = classService.getClassDetailInfo(param);
            
        }
        catch (Exception e)
        {
            logger.error(e.getMessage(), e);
        }

        return result;
    }   
    
    /**
     * 강의 상세 정보 목록 조회
     * 
     * @param param
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 9. 6.
     */
    @RequestMapping(value = "/get-clsas-info-detail-list", method = RequestMethod.POST)
    @ResponseBody
    public List<Map<String, Object>> getClsasInfoDetailList(@RequestBody Map<String, Object> param)
    {
        List<Map<String, Object>> classInfoList = new ArrayList<Map<String,Object>>();
        
        try
        {
            List<Map<String, Object>> classList = getClassList(param);
            
            for(Map<String, Object> cls : classList)
            {
                Map<String, Object> classInfoParam = new HashMap<String, Object>();
                classInfoParam.put("classId", cls.get("classId"));
                
                classInfoList.add(getClassInfoDetail(classInfoParam));
            }
        }
        catch (Exception e)
        {
            logger.error(e.getMessage(), e);
        }

        return classInfoList;
    }   
    
    /**
     * 강의 정보 저장/수정
     * 
     * @param param
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 9. 6.
     */
    @RequestMapping(value = "/update-class-info", method = RequestMethod.POST)
    @ResponseBody
    public Integer updateClassInfo(@RequestBody Map<String, Object> param)
    {
        Integer updateCount = 0;

        try
        {
            updateCount = classService.updateClassInfo(param);
        }
        catch (Exception e)
        {
            logger.error(e.getMessage(), e);
        }

        return updateCount;
    }
 
    /**
     * 강의 정보 저장/수정
     * 
     * @param param
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 9. 6.
     */
    @RequestMapping(value = "/update-class-date", method = RequestMethod.POST)
    @ResponseBody
    public Integer updateClassDate(@RequestBody Map<String, Object> param)
    {
        Integer updateCount = 0;

        try
        {
            updateCount = classService.updateClassDate(param);
        }
        catch (Exception e)
        {
            logger.error(e.getMessage(), e);
        }

        return updateCount;
    }
    
    /**
     * 최초평가 수강생 목록 조회
     * 
     * @param param
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 9. 6.
     */
    @RequestMapping(value = "/get-initial-student-list", method = RequestMethod.POST)
    @ResponseBody
    public List<Map<String, Object>> getInitialStudentList(@RequestBody Map<String, Object> param)
    {
        List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();

        try
        {
            result = classService.getUserClass(param);
        }
        catch (Exception e)
        {
            logger.error(e.getMessage(), e);
        }

        return result;
    }
    
    /**
     * 최초평가 업데이트
     * 
     * @param param
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 9. 6.
     */
    @RequestMapping(value = "/update-initial-student", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> updateInitialStudent(@RequestBody Map<String, Object> param)
    {
        Map<String, Object> student = null;

        try
        {
            student = classService.updateUserClass(param);
        }
        catch (Exception e)
        {
            logger.error(e.getMessage(), e);
        }

        return student;
    }
    
    /**
     * 보고서 상세정보 조회
     * 
     * @param param
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 9. 6.
     */
    @RequestMapping(value = "/get-report-detail-info", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> getReportDetailInfo(@RequestBody Map<String, Object> param)
    {
        Map<String, Object> reportInfo = null;

        try
        {
        	reportInfo = reportService.getReportDetailInfo(param);
        }
        catch (Exception e)
        {
            logger.error(e.getMessage(), e);
        }

        return reportInfo;
    }
}