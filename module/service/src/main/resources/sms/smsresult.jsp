<%@ page language="java" import="java.util.*, java.security.*, java.io.*, java.net.*" %>
<%@ page contentType="text/html;charset=utf-8"%>
<%!
/**====================================================================================
  Description        :  사용 함수 선언
====================================================================================**/
 /**
 * nullcheck
 * @param str, Defaultvalue
 * @return
 */

 public static String nullcheck(String str,  String Defaultvalue ) throws Exception
 {
      String ReturnDefault = "" ;
      if (str == null)
      {
          ReturnDefault =  Defaultvalue ;
      }
      else if (str == "" )
     {
          ReturnDefault =  Defaultvalue ;
      }
      else
      {
                  ReturnDefault = str ;
      }
       return ReturnDefault ;
 }
%>
<%
/**====================================================================================
  Description        :  사용자 샘플코드
====================================================================================**/
request.setCharacterEncoding("UTF-8");
response.setCharacterEncoding("UTF-8");

String sms_url = "https://sslsms.cafe24.com/sms_list.php"; // 전송요청 URL
String user_id = ""; // SMS 아이디
String secure = ""; //인증키
String date = ""; //조회 기준일
String day = "1"; //조회 범위
String startNo = "0"; //조회 시작번호
String displayNo = "10"; //출력 갯수
String sendType = ""; //발송형태
String sendStatus = ""; //발송상태
String receivePhone = ""; //검색할 수신번호
String sendPhone = ""; //검색할 발신번호
String smsType = ""; // lms와 mms인경우만 'lms'

String[] host_info = sms_url.split("/");
String host = host_info[2];
String path = "/" + host_info[3];
int port = 80;

// 데이터 맵핑 변수 정의
String arrKey[]
    = new String[] {"user_id" ,"secure","date","day","startNo","displayNo","sendType","sendStatus","receivePhone","sendPhone", "smsType"};
String valKey[]= new String[arrKey.length] ;
valKey[0] = user_id;
valKey[1] = secure;
valKey[2] = date;
valKey[3] = day;
valKey[4] = startNo;
valKey[5] = displayNo;
valKey[6] = sendType;
valKey[7] = sendStatus;
valKey[8] = receivePhone;
valKey[9] = sendPhone;
valKey[10] = smsType;

String boundary = "";
Random rnd = new Random();
String rndKey = Integer.toString(rnd.nextInt(32000));
MessageDigest md = MessageDigest.getInstance("MD5");
byte[] bytData = rndKey.getBytes();
md.update(bytData);
byte[] digest = md.digest();
for(int i =0;i<digest.length;i++)
{
    boundary = boundary + Integer.toHexString(digest[i] & 0xFF);
}
boundary = "---------------------"+boundary.substring(0,11);

// 본문 생성
String data = "";
String index = "";
String value = "";
for (int i=0;i<arrKey.length; i++)
{
    index =  arrKey[i];
    value = valKey[i];
    data +="--"+boundary+"\r\n";
    data += "Content-Disposition: form-data; name=\""+index+"\"\r\n";
    data += "\r\n"+value+"\r\n";
    data +="--"+boundary+"\r\n";
}

out.println(data);

InetAddress addr = InetAddress.getByName(host);
Socket socket = new Socket(host, port);
// 헤더 전송
BufferedWriter wr = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream(), "UTF-8"));
wr.write("POST "+path+" HTTP/1.0\r\n");
wr.write("Content-Length: "+data.length()+"\r\n");
wr.write("Content-type: multipart/form-data, charset=utf-8, boundary="+boundary+"\r\n");
wr.write("\r\n");

// 데이터 전송
wr.write(data);
wr.flush();

// 결과값 얻기n
BufferedReader rd = new BufferedReader(new InputStreamReader(socket.getInputStream(),"UTF-8"));
String line;
String alert = "";
int i = 0;
ArrayList tmpArr = new ArrayList();
while ((line = rd.readLine()) != null) {
	if (i < 8) {
		i++;
		continue;
	}
	else {
		out.println(line);
	}
}
wr.close();
rd.close();
%>