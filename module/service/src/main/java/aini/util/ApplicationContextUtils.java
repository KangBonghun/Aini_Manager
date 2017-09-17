package aini.util;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApplicationContextUtils implements ApplicationContextAware
{
    private static ApplicationContext ctx;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException
    {

        ctx = applicationContext;
    }

    public static ApplicationContext getApplicationContext()
    {
        return ctx;
    }
}
