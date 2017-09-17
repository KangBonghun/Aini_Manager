package aini.web.service;

import java.io.IOException;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

import javax.annotation.PostConstruct;

import org.apache.http.HttpEntity;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * PDF API KEY 를 관리하는 클래스이다.
 * 
 * @author KangBongHoon
 * @version 1.0
 */
@Service
public class ConvertApi
{
    private static final Logger logger = LoggerFactory.getLogger(ConvertApi.class);

    /**
     * ZAMZAR JOB ACCOUNT POINT
     */
    public static final String END_POINT_ACCOUNT = "https://api.zamzar.com/v1/account/";

    private BlockingQueue<String> apiKeyQueue = new LinkedBlockingQueue<String>(1000);

    @Value("${API_KEYS}")
    private String apiKeys;

    private Object lock = new Object();

    /**
     * 큐에 API KEY 를 담는다.
     * 
     * 
     * @author KangBongHoon
     * @create-date : 2017. 2. 22.
     */
//    @PostConstruct
    public void init()
    {
        String[] splitedApiKey = apiKeys.split(",");

        for (String apiKey : splitedApiKey)
        {
            apiKey = apiKey.trim();

            Integer remaining = getRemaining(apiKey);

            for (int i = 0; i < remaining; i++)
            {
                try
                {
                    apiKeyQueue.add(apiKey);
                }
                catch (Exception e)
                {
                    logger.error(e.getMessage(), e);
                }
            }
        }

        logger.info("");
        logger.info("############### Convert API initialize ###############");
        logger.info("Queue size : " + apiKeyQueue.size());
        logger.info("");
    }

    /**
     * API 별로 잔여 개수를 확인한다.
     * 
     * @param apiKey
     * @return
     * 
     * @author KangBongHoon
     * @create-date : 2017. 2. 22.
     */
    private Integer getRemaining(String apiKey)
    {
        Integer remaining = 0;

        CloseableHttpClient httpClient = null;
        CloseableHttpResponse response = null;

        try
        {
            HttpGet request = new HttpGet(END_POINT_ACCOUNT);

            httpClient = getHttpClient(apiKey);
            response = httpClient.execute(request);

            HttpEntity responseContent = response.getEntity();
            String result = EntityUtils.toString(responseContent, "UTF-8");

            JSONObject json = new JSONObject(result);

            remaining = (Integer) json.get("test_credits_remaining");
        }
        catch (Exception e)
        {
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
        }

        logger.info("");
        logger.info("############### Convert API status ###############");
        logger.info("API Key : " + apiKey);
        logger.info("Remaining : " + remaining);
        logger.info("");

        return remaining;
    }

    private CloseableHttpClient getHttpClient(String apiKey)
    {
        CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
        credentialsProvider.setCredentials(AuthScope.ANY, new UsernamePasswordCredentials(apiKey, ""));

        CloseableHttpClient httpClient = HttpClientBuilder.create().setDefaultCredentialsProvider(credentialsProvider).build();

        return httpClient;
    }

    public String getApiKey()
    {
        synchronized (lock)
        {
            String apiKey = apiKeyQueue.poll();

            logger.info("");
            logger.info("############### Convert API Get ###############");
            logger.info("Queue size : " + apiKeyQueue.size());
            logger.info("");

            return apiKey;
        }
    }
}