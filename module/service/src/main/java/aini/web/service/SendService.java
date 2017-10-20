package aini.web.service;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Properties;
import java.util.Random;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.annotation.PostConstruct;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.internet.MimeUtility;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import aini.vo.StudentVO;

/**
 * 
 * @author KangBongHoon
 * @version 1.0
 */
@Service
public class SendService
{
    private static final Logger logger = LoggerFactory.getLogger(SendService.class);

    /**
     * Mail 계정 아이디
     */
    @Value("${MAIL_USER_NAME}")
    private String mailUserName;

    /**
     * Mail 계정 패스워드
     */
    @Value("${MAIL_PASSWORD}")
    private String mailPassword;

    /**
     * Mail 발송 주소
     */
    @Value("${MAIL_SENDER}")
    private String mailSender;

    /**
     * Mail 제목
     */
    @Value("${MAIL_SUBJECT}")
    private String mailSubject;

    /**
     * Mail 내용
     */
    @Value("${MAIL_CONTENT}")
    private String mailContent;

    /**
     * SMS 발송 번호
     */
    @Value("${SMS_SENDER}")
    private String smsSender;

    /**
     * SMS 인증키
     */
    @Value("${SMS_KEY}")
    private String smsKey;

    /**
     * SMS 사용자 아이디
     */
    @Value("${SMS_USER}")
    private String smsUser;

    /**
     * SMS 테스트 여부
     */
    @Value("${SMS_TEST}")
    private String smsTest;

    /**
     * SMS 발송 타입
     */
    @Value("${SMS_TYPE}")
    private String smsType;

    /**
     * SMS 메시지 내용
     */
    @Value("${SMS_CONTENT}")
    private String smsContent;

    /**
     * SMS 캐릭터셋
     * 
     * EUC-KR: @ page contentType="text/html;charset=EUC-KR
     * UTF-8: @ page contentType="text/html;charset=UTF-8
     */
    @Value("${SMS_CHARSET}")
    private String smsCharset;

    /**
     * SMS 전송요청 URL
     */
    private final String smsUrl = "https://sslsms.cafe24.com/sms_sender.php";

    /**
     * Mail 프로퍼티
     */
    private Properties props = new Properties();

    @PostConstruct
    private void init()
    {
//        props.put("mail.smtp.host", "smtp.naver.com");
//        props.put("mail.smtp.port", 587);
//        props.put("mail.smtp.auth", "true");
//        props.put("mail.smtp.ssl.enable", "true");
//        props.put("mail.smtp.ssl.trust", "smtp.naver.com");
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.host", "smtp.naver.com");
        props.put("mail.smtp.port", "587");
        props.put("mail.smtp.starttls.enable","true");
        props.put("mail.smtp.ssl.trust", "smtp.naver.com");
        props.put("mail.smtp.auth", "true");        
    }

    private String getContent(String message, StudentVO student)
    {
        return message.replace("{name}", student.getName()).replace("{phoneNumber}", student.getPhoneNumber().replaceAll("-", "")).replace("{authNumber}", student.getAuth());
    }
    
    /**
     * 보고서 문자를 발송한다.
     * 
     * @param student
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 2. 23.
     */
    public Boolean sendSms(StudentVO student)
    {
        if (!student.getSmsFlag())
        {
            return true;
        }
        
        boolean result = false;
        
        try
        {
            String message = getContent(this.smsContent, student);
            String receivePhoneNumber = student.getPhoneNumber();
            
            result = sendSms(message, receivePhoneNumber);
        }
        catch (Exception e)
        {
            logger.error(e.getMessage(), e);
        }
        
        return result;
        
    }

    
    /**
     * 문자를 발송한다.
     *
     * @param message 문자 메시지
     * @param receivePhoneNumber 받는사람 전화번호
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 8. 18.
     */
    public Boolean sendSms(String message, String receivePhoneNumber)
    {
        Boolean result = false;

        Socket socket = null;
        BufferedWriter wr = null;
        BufferedReader rd = null;

        String sendResult = "";
        String sendResultMessage = "";

        try
        {
            String user_id = base64Encode(this.smsUser);                                // SMS 사용자
            String secure = base64Encode(this.smsKey);                                  // 인증키
            String msg = base64Encode(nullcheck(message, ""));                  // 메시지
            String rphone = base64Encode(nullcheck(receivePhoneNumber, ""));      // 받는번호
            String sphone1 = base64Encode(nullcheck(this.smsSender.split("-")[0], "")); // 보내는 번호 1
            String sphone2 = base64Encode(nullcheck(this.smsSender.split("-")[1], "")); // 보내는 번호 2
            String sphone3 = base64Encode(nullcheck(this.smsSender.split("-")[2], "")); // 보내는 번호 3
            String rdate = base64Encode(nullcheck("", ""));                             // 예약 날짜
            String rtime = base64Encode(nullcheck("", ""));                             // 예약 시간
            String mode = base64Encode("1");                                            //
            String subject = "";                                                        // 제목
            String testflag = base64Encode(nullcheck(this.smsTest, ""));                // 테스트 여부
            String destination = base64Encode(nullcheck("", ""));                       // 이름삽입번호
            String repeatFlag = base64Encode(nullcheck("", ""));                        // 반복 여부
            String repeatNum = base64Encode(nullcheck("", ""));                         // 반복 횟수
            String repeatTime = base64Encode(nullcheck("", ""));                        // 반복 시간
            String smsType = base64Encode(nullcheck(this.smsType, ""));                 //

            // 데이터 맵핑 변수 정의
            String arrKey[] = new String[] { "user_id", "secure", "msg", "rphone", "sphone1", "sphone2", "sphone3", "rdate", "rtime", "mode", "testflag", "destination", "repeatFlag", "repeatNum", "repeatTime", "smsType", "subject" };
            String valKey[] = new String[arrKey.length];
            valKey[0] = user_id;
            valKey[1] = secure;
            valKey[2] = msg;
            valKey[3] = rphone;
            valKey[4] = sphone1;
            valKey[5] = sphone2;
            valKey[6] = sphone3;
            valKey[7] = rdate;
            valKey[8] = rtime;
            valKey[9] = mode;
            valKey[10] = testflag;
            valKey[11] = destination;
            valKey[12] = repeatFlag;
            valKey[13] = repeatNum;
            valKey[14] = repeatTime;
            valKey[15] = smsType;
            valKey[16] = subject;

            String boundary = "";
            Random rnd = new Random();
            String rndKey = Integer.toString(rnd.nextInt(32000));
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] bytData = rndKey.getBytes();
            md.update(bytData);
            byte[] digest = md.digest();
            for (int i = 0; i < digest.length; i++)
            {
                boundary = boundary + Integer.toHexString(digest[i] & 0xFF);
            }
            boundary = "---------------------" + boundary.substring(0, 11);

            // 본문 생성
            String data = "";
            String index = "";
            String value = "";
            for (int i = 0; i < arrKey.length; i++)
            {
                index = arrKey[i];
                value = valKey[i];
                data += "--" + boundary + "\r\n";
                data += "Content-Disposition: form-data; name=\"" + index + "\"\r\n";
                data += "\r\n" + value + "\r\n";
                data += "--" + boundary + "\r\n";
            }

            // 소켓 생성
            String[] host_info = smsUrl.split("/");
            String host = host_info[2];
            String path = "/" + host_info[3];
            int port = 80;

            socket = new Socket(host, port);

            // 헤더 전송
            wr = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream(), smsCharset));
            wr.write("POST " + path + " HTTP/1.0\r\n");
            wr.write("Content-Length: " + data.length() + "\r\n");
            wr.write("Content-type: multipart/form-data, boundary=" + boundary + "\r\n");
            wr.write("\r\n");

            // 데이터 전송
            wr.write(data);
            wr.flush();

            // 결과값 얻기
            rd = new BufferedReader(new InputStreamReader(socket.getInputStream(), smsCharset));
            String line;
            List<String> tmpArr = new ArrayList<String>();

            while ((line = rd.readLine()) != null)
            {
                tmpArr.add(line);
            }

            String tmpMsg = (String) tmpArr.get(tmpArr.size() - 1);
            String[] rMsg = tmpMsg.split(",");
            sendResult = rMsg[0]; // 발송결과
            String remainingCount = ""; // 잔여건수

            if (rMsg.length > 1)
            {
                remainingCount = rMsg[1];
            }

            // 발송결과 알림
            if (sendResult.toLowerCase().indexOf("success") > -1)
            {
                sendResultMessage = "Remaining : " + remainingCount;

                result = true;
            }
            else
            {
                sendResultMessage = "Cause : " + sendResult;
            }
        }
        catch (Exception e)
        {
            logger.error(e.getMessage(), e);
        }
        finally
        {
            if (socket != null)
            {
                try
                {
                    socket.close();
                }
                catch (IOException e)
                {
                    logger.error(e.getMessage(), e);
                }
            }
            if (wr != null)
            {
                try
                {
                    wr.close();
                }
                catch (IOException e)
                {
                    logger.error(e.getMessage(), e);
                }
            }

            if (rd != null)
            {
                try
                {
                    rd.close();
                }
                catch (IOException e)
                {
                    logger.error(e.getMessage(), e);
                }
            }
        }
        
        logger.info("");
        logger.info("############### SMS Send result ###############");
        logger.info(sendResult);
        logger.info(sendResultMessage);
        logger.info("Phone : " + receivePhoneNumber);
        logger.info("");

        return result;
    }
    
    /**
     * 보고서 메일을 발송한다.
     * 
     * @param student
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 2. 23.
     */
    public Boolean sendEmail(StudentVO student)
    {
        if (!student.getEmailFlag())
        {
            return true;
        }
        
        boolean result = false;
        
        try
        {
            String receiveEmail = student.getEmailAddress();
            String subject = getContent(this.mailSubject, student);
            String contentText = getContent(this.mailContent, student);
            String fileName = student.getPdfFilePath();
            
            result = sendEmail(receiveEmail, subject, contentText, fileName);
        }
        catch (Exception e)
        {
            logger.error(e.getMessage(), e);
        }
        
        return result;
        
    }

    /**
     * 메일을 발송한다.
     *
     * @param receiveEmail 받는사람 이메일 주소
     * @param subject 제목
     * @param contentText 내용
     * @param fileName 첨부파일 Path
     * @return
     * 
     * @author "KangBongHoon"
     * @create-date : 2017. 8. 18.
     */
    public Boolean sendEmail(String receiveEmail, String subject, String contentText, String fileName)
    {
        Boolean result = false;
        String errorMessage = "";

        Session session = Session.getDefaultInstance(props, new javax.mail.Authenticator()
        {
            String un = mailUserName;
            String pw = mailPassword;

            protected PasswordAuthentication getPasswordAuthentication()
            {
                return new PasswordAuthentication(un, pw);
            }
        });

        session.setDebug(false); // for debug

        try
        {
            Message msg = new MimeMessage(session);
            msg.setFrom(new InternetAddress(mailSender));
            msg.setRecipient(Message.RecipientType.TO, new InternetAddress(receiveEmail));
            msg.setSubject(subject);
            msg.setSentDate(new Date());

            if(fileName != null)
            {
                // 내용
                BodyPart bp1 = new MimeBodyPart();
                bp1.setText(contentText);
                
                // 첨부파일
                DataSource source = new FileDataSource(fileName);

                BodyPart bp2 = new MimeBodyPart();
                bp2.setDataHandler(new DataHandler(source));
                bp2.setFileName(MimeUtility.encodeText(fileName.substring(fileName.lastIndexOf("/") + 1)));

                Multipart multipart = new MimeMultipart();
                multipart.addBodyPart(bp1);
                multipart.addBodyPart(bp2);

                msg.setContent(multipart);
            }
            else
            {
                msg.setContent(contentText, "text/html; charset=utf-8");
//                msg.setText(contentText);
            }
            
            Transport.send(msg);

            result = true;
        }
        catch (Exception e)
        {
            logger.error(e.getMessage(), e);

            errorMessage = e.getMessage();
        }

        logger.info("");
        logger.info("############### Email Send result ###############");
        if (result)
        {
            logger.info("Success");
        }
        else
        {
            logger.info("Fail");
            logger.info("Cause : " + errorMessage);
        }
        logger.info("Email : " + receiveEmail);
        logger.info("");

        return result;
    }

    /**
     * nullcheck
     * 
     * @param str, Defaultvalue
     * @return
     */
    public static String nullcheck(String str, String Defaultvalue) throws Exception
    {
        String ReturnDefault = "";
        if (str == null)
        {
            ReturnDefault = Defaultvalue;
        }
        else if (str == "")
        {
            ReturnDefault = Defaultvalue;
        }
        else
        {
            ReturnDefault = str;
        }
        return ReturnDefault;
    }

    /**
     * BASE64 Encoder
     * 
     * @param str
     * @return
     */
    @SuppressWarnings("restriction")
    public static String base64Encode(String str) throws java.io.IOException
    {
        sun.misc.BASE64Encoder encoder = new sun.misc.BASE64Encoder();
        byte[] strByte = str.getBytes();
        String result = encoder.encode(strByte);
        return result;
    }

    /**
     * BASE64 Decoder
     * 
     * @param str
     * @return
     */
    @SuppressWarnings("restriction")
    public static String base64Decode(String str) throws java.io.IOException
    {
        sun.misc.BASE64Decoder decoder = new sun.misc.BASE64Decoder();
        byte[] strByte = decoder.decodeBuffer(str);
        String result = new String(strByte);
        return result;
    }
}