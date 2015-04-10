package com.sp.core.struts2;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import org.apache.struts2.util.StrutsTypeConverter;

public class SimpleDateConverter extends StrutsTypeConverter {
	private static final DateFormat[] dfs = {
		new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"),
		new SimpleDateFormat("yyyy-MM-dd")
	};

	@Override
	@SuppressWarnings("unchecked")
	public Object convertFromString(Map context, String[] values, Class toClass) {
		String s = values[0];
		Date date = null;
		ParseException e = null;
		for (DateFormat df : dfs) {
			try {
				date = df.parse(s);
				if (date != null) {
					break;
				}
			} catch (ParseException ignore) {
				e = ignore;
			}
		}
		if (date == null) {
			new RuntimeException("Could not parse date", e);
		}
		return date;
	}

	@Override
	@SuppressWarnings("unchecked")
	public String convertToString(Map context, Object o) {
		Date date = (Date) o;
		String s = null;
		for (DateFormat df : dfs) {
			s = df.format(date);
			if (s != null) {
				break;
			}
		}
		return s;
	}

}
