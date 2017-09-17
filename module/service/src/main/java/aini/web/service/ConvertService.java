package aini.web.service;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import org.apache.http.HttpEntity;
import org.apache.http.HttpRequest;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import aini.util.ApplicationContextUtils;
import aini.vo.StudentVO;

/**
 * Convert Excel to PDF
 * 
 * @author KangBongHoon
 * @version 1.0
 */
public class ConvertService
{
    private static final Logger logger = LoggerFactory.getLogger(ConvertService.class);

    /**
     * ZAMZAR JOB END POINT
     */
    public static final String END_POINT_JOB = "https://sandbox.zamzar.com/v1/jobs/";

    /**
     * ZAMZAR FILE END POINT
     */
    public static final String END_POINT_FILE = "https://sandbox.zamzar.com/v1/files/";

    /**
     * 
     */
    public static final String PDF = "pdf";

    /**
     * ZAMZAR API KEY
     */
    private String apiKey;

    /**
     * 보고서 생성 수강생 정보
     */
    private StudentVO student;

    /**
     * API KEY 와 수강생 정보를 초기화한다.
     * 
     * @param student
     * 
     * @create-date : 2017. 2. 16.
     * @author : KangBongHoon
     */
    public ConvertService(StudentVO student)
    {
        this.apiKey = getApiKey();
        this.student = student;
    }

    /**
     * API KEY 를 반환한다.
     * 
     * @return
     * 
     * @author KangBongHoon
     * @create-date : 2017. 2. 16.
     */
    private String getApiKey()
    {
        return ApplicationContextUtils.getApplicationContext().getBean(ConvertApi.class).getApiKey();
    }

    /**
     * 엑셀 파일을 PDF 로 변환한다.
     * 
     * @return 변환 된 PDF 파일 경로
     * 
     * @throws Exception
     * 
     * @author KangBongHoon
     * @create-date : 2017. 2. 16.
     */
    public String xlsxToPdf() throws Exception
    {
        checkValidation();

        String orgFile = student.getExcelFilePath();

        String convertedFile = orgFile.substring(0, orgFile.lastIndexOf(".")).replace("upload", "upload/pdf") + "." + PDF;

        Integer jobId = startJob(orgFile);

        Integer fileId = checkCompleteJob(jobId);

        convertedFile = downloadFile(fileId, convertedFile);

        return convertedFile;
    }

    /**
     * PDF 변환 요청
     * 
     * @param sourceFile
     * @return
     * @throws Exception
     * 
     * @author KangBongHoon
     * @create-date : 2017. 2. 16.
     */
    private Integer startJob(String sourceFile) throws Exception
    {
        Integer jobId = null;

        try
        {
            HttpPost request = new HttpPost(END_POINT_JOB);
            HttpEntity requestContent = MultipartEntityBuilder.create().addPart("source_file", new FileBody(new File(sourceFile))).addPart("target_format", new StringBody(PDF, ContentType.TEXT_PLAIN)).build();
            request.setEntity(requestContent);

            HttpEntity responseContent = requestApi(request);

            String result = EntityUtils.toString(responseContent, "EUC-KR");

            JSONObject json = new JSONObject(result);

            jobId = (Integer) json.get("id");

            logger.info("");
            logger.info("############### Excel -> PDF Start ###############");
            logger.info(json.toString());
            logger.info("");
        }
        catch (Exception e)
        {
            throw new Exception(e.getMessage());
        }

        return jobId;
    }

    /**
     * 변환 작업 완료 여부 확인
     * 
     * @param jobId
     * @return
     * @throws Exception
     * 
     * @author KangBongHoon
     * @create-date : 2017. 2. 16.
     */
    public Integer checkCompleteJob(Integer jobId) throws Exception
    {
        Integer fileId = null;

        Integer retry = 0;

        do
        {
            try
            {
                Thread.sleep(1000);

                HttpGet request = new HttpGet(END_POINT_JOB + jobId);

                HttpEntity responseContent = requestApi(request);

                String result = EntityUtils.toString(responseContent, "UTF-8");

                JSONObject json = new JSONObject(result);

                if ("successful".equals(json.get("status")))
                {
                    fileId = (Integer) json.getJSONArray("target_files").getJSONObject(0).get("id");
                }

                logger.info("");
                logger.info("############### Excel -> PDF Check ###############");
                logger.info(json.toString());
                logger.info("");
            }
            catch (Exception e)
            {
                throw new Exception(e.getMessage());
            }
        }
        while (fileId == null && ++retry <= 3);

        return fileId;
    }

    /**
     * 변환 된 PDF 파일을 서버로 다운로드한다.
     * 
     * @param fileId
     * @param downloadFile
     * @return
     * 
     * @author KangBongHoon
     * @throws Exception
     * @create-date : 2017. 2. 16.
     */
    public String downloadFile(Integer fileId, String downloadFile)
    {
        CloseableHttpClient httpClient = null;
        CloseableHttpResponse response = null;

        BufferedInputStream bis = null;
        BufferedOutputStream bos = null;

        try
        {
            HttpGet request = new HttpGet(END_POINT_FILE + fileId + "/content");

            httpClient = getHttpClient();
            response = httpClient.execute(request);

            HttpEntity responseContent = response.getEntity();

            /* 업로드 할 폴더 존재 여부 체크 */
            File dir = new File(downloadFile.substring(0, downloadFile.lastIndexOf("/")));

            if (!dir.isDirectory())
            {
                dir.mkdir();
            }

            bis = new BufferedInputStream(responseContent.getContent());
            bos = new BufferedOutputStream(new FileOutputStream(downloadFile));

            int inByte;

            while ((inByte = bis.read()) != -1)
            {
                bos.write(inByte);
            }

            logger.info("");
            logger.info("############### Excel -> PDF Download ###############");
            logger.info(downloadFile);
            logger.info("");
        }
        catch (Exception e)
        {
            logger.error(e.getMessage(), e);
        }
        finally
        {
            try
            {
                if (response != null)
                {
                    response.close();
                }
            }
            catch (IOException e)
            {
                logger.error(e.getMessage(), e);
            }

            try
            {
                if (httpClient != null)
                {
                    httpClient.close();
                }
            }
            catch (IOException e)
            {
                logger.error(e.getMessage(), e);
            }

            try
            {
                if (bos != null)
                {
                    bos.close();
                }
            }
            catch (IOException e)
            {
                logger.error(e.getMessage(), e);
            }

            try
            {
                if (bis != null)
                {
                    bis.close();
                }
            }
            catch (IOException e)
            {
                logger.error(e.getMessage(), e);
            }
        }

        return downloadFile;
    }

    /**
     * 이러저러한 기능을 처리한다.
     * 
     * @return
     * 
     * @author KangBongHoon
     * @create-date : 2017. 2. 16.
     */
    private CloseableHttpClient getHttpClient()
    {
        CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
        credentialsProvider.setCredentials(AuthScope.ANY, new UsernamePasswordCredentials(apiKey, ""));

        CloseableHttpClient httpClient = HttpClientBuilder.create().setDefaultCredentialsProvider(credentialsProvider).build();

        return httpClient;
    }

    /**
     * PDF 변환 요청에 사용되는 공통 API
     * 
     * @param request
     * @return
     * 
     * @author KangBongHoon
     * @throws Exception
     * @create-date : 2017. 2. 16.
     */
    @SuppressWarnings("resource")
    private HttpEntity requestApi(HttpRequest request) throws Exception
    {
        CloseableHttpClient httpClient = null;
        CloseableHttpResponse response = null;

        HttpEntity responseContent = null;

        try
        {
            httpClient = getHttpClient();

            if (request instanceof HttpGet)
            {
                response = httpClient.execute((HttpGet) request);
            }
            if (request instanceof HttpPost)
            {
                response = httpClient.execute((HttpPost) request);
            }

            responseContent = response.getEntity();
        }
        catch (Exception e)
        {
            throw new Exception(e.getMessage());
        }
        finally
        {
            if (response != null)
            {
                try
                {
                    response.close();
                }
                catch (IOException e)
                {
                    logger.error(e.getMessage(), e);
                }
            }

            if (httpClient != null)
            {
                try
                {
                    httpClient.close();
                }
                catch (IOException e)
                {
                    logger.error(e.getMessage(), e);
                }
            }
        }

        return responseContent;
    }

    /**
     * 변환에 필요한 정보를 확인한다.
     * 
     * @throws Exception
     * 
     * @author KangBongHoon
     * @create-date : 2017. 2. 16.
     */
    private void checkValidation() throws Exception
    {
        if (apiKey == null || apiKey.isEmpty())
        {
            throw new Exception("##### API key is null or empty #####");
        }

        if (student == null)
        {
            throw new Exception("##### Student Info is null #####");
        }

        if (student.getExcelFilePath() == null)
        {
            throw new Exception("##### Source file is null #####");
        }
    }
}