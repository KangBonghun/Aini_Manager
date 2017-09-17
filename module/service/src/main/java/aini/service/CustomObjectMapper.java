package aini.service;

import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

public class CustomObjectMapper extends ObjectMapper
{
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public CustomObjectMapper()
    {
        this.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        this.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
        this.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        this.setVisibility(PropertyAccessor.ALL, Visibility.NONE);
        this.setVisibility(PropertyAccessor.FIELD, Visibility.ANY);
    }
}
