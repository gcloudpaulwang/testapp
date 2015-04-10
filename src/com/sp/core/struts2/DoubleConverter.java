package com.sp.core.struts2;

import java.util.Map;

import org.apache.struts2.util.StrutsTypeConverter;

public class DoubleConverter extends StrutsTypeConverter {  
	  
    @Override  
    public Object convertFromString(Map context, String[] values, Class toClass) {  
        if (Double.class == toClass) {  
            String doubleStr = values[0];  
            Double d = Double.parseDouble(doubleStr);  
            return d;  
        }  
        return 0;  
    }  
  
    @Override  
    public String convertToString(Map context, Object o) {  
        return o.toString();  
    }

  
}  
