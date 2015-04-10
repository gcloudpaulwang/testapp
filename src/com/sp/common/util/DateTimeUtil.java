package com.sp.common.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.hibernate.criterion.Restrictions;

public class DateTimeUtil {
	public static Date getBegin(Date original)
	{
		SimpleDateFormat sdf1=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	    String today=sdf1.format(original);
	    String tDate=today.split(" ")[0];
	    try {
			Date d1=sdf1.parse(tDate+" "+"00:00:00");
			return d1;
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return original;
	}
	public static Date getEnd(Date original)
	{
		SimpleDateFormat sdf1=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	    String today=sdf1.format(original);
	    String tDate=today.split(" ")[0];
	    try {
			Date d1=sdf1.parse(tDate+" "+"23:59:59");
			return d1;
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return original;
	}
}
