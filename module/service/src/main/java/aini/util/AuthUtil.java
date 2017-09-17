package aini.util;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

public class AuthUtil
{
    private static final ObjectMapper mapper = new ObjectMapper();

    private static final String FILE_PATH = AuthUtil.class.getResource("/").getPath() + "../auth.json";

    @SuppressWarnings("unchecked")
    public synchronized static Map<String, List<String>> read() throws JsonParseException, JsonMappingException, IOException
    {
        return mapper.readValue(new File(FILE_PATH), Map.class);
    }

    public synchronized static Boolean checkAuth(String phoneNumber, String authNumber) throws JsonParseException, JsonMappingException, IOException
    {
        Boolean auth = false;

        Map<String, List<String>> mapAuth = read();

        if (mapAuth.containsKey(phoneNumber))
        {
            for (String authNum : mapAuth.get(phoneNumber))
            {
                if (authNumber.equals(authNum))
                {
                    auth = true;

                    break;
                }
            }
        }

        return auth;
    }

    public synchronized static String write(String phoneNumber) throws JsonParseException, JsonMappingException, IOException
    {
        phoneNumber = phoneNumber.replaceAll("-", "");
        
        Map<String, List<String>> mapAuth = read();

        Random random = new Random();

        Integer authNumber = random.nextInt(10000) + 1000;

        if (authNumber > 10000)
        {
            authNumber = authNumber - 1000;
        }

        if (!mapAuth.containsKey(phoneNumber))
        {
            mapAuth.put(phoneNumber, new ArrayList<String>());
        }

        mapAuth.get(phoneNumber).add(authNumber.toString());

        mapper.writeValue(new File(FILE_PATH), mapAuth);

        return authNumber.toString();
    }
}
