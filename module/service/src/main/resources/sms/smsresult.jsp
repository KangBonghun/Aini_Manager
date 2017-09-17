<%@ page language="java" import="java.util.*, java.security.*, java.io.*, java.net.*" %>
<%@ page contentType="text/html;charset=utf-8"%>
<%!
/**====================================================================================
  Description        :  ��� �Լ� ����
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
  Description        :  ����� �����ڵ�
====================================================================================**/
request.setCharacterEncoding("UTF-8");
response.setCharacterEncoding("UTF-8");

String sms_url = "https://sslsms.cafe24.com/sms_list.php"; // ���ۿ�û URL
String user_id = ""; // SMS ���̵�
String secure = ""; //����Ű
String date = ""; //��ȸ ������
String day = "1"; //��ȸ ����
String startNo = "0"; //��ȸ ���۹�ȣ
String displayNo = "10"; //��� ����
String sendType = ""; //�߼�����
String sendStatus = ""; //�߼ۻ���
String receivePhone = ""; //�˻��� ���Ź�ȣ
String sendPhone = ""; //�˻��� �߽Ź�ȣ
String smsType = ""; // lms�� mms�ΰ�츸 'lms'

String[] host_info = sms_url.split("/");
String host = host_info[2];
String path = "/" + host_info[3];
int port = 80;

// ������ ���� ���� ����
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

// ���� ����
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
// ��� ����
BufferedWriter wr = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream(), "UTF-8"));
wr.write("POST "+path+" HTTP/1.0\r\n");
wr.write("Content-Length: "+data.length()+"\r\n");
wr.write("Content-type: multipart/form-data, charset=utf-8, boundary="+boundary+"\r\n");
wr.write("\r\n");

// ������ ����
wr.write(data);
wr.flush();

// ����� ���n
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