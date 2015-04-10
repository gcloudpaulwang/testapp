package com.aok.common.mng.impl;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aok.common.AokProperties;
import com.aok.common.mng.CommonMng;
import com.sp.common.util.SPException;
import com.sp.common.util.StringUtils;
@Service("Common")
public class CommonMngImpl implements CommonMng{
	private AokProperties aokProperties;

	public AokProperties getAokProperties() {
		return aokProperties;
	}

	@Autowired
	public void setPortalProperties(AokProperties aokProperties) {
		this.aokProperties = aokProperties;
	}
	public void checkTakeDate(Date takeDate,String time) throws SPException{
		Date now=new Date();
		String sFirstTime=aokProperties.getFirst();
		if(StringUtils.str2Date(StringUtils.formatDate(now), "yyyy-MM-dd").before(takeDate)){
			return;
		}else if(StringUtils.str2Date(StringUtils.formatDate(now), "yyyy-MM-dd").after(takeDate)){
			throw new SPException(String.format("取货时间至少为今天的%s",sFirstTime));
		}
		
		
		String sSecondTime=aokProperties.getSecond();
		String sDeadline=aokProperties.getDeadline();
		
		Date firstDatetime=StringUtils.str2Date(StringUtils.formatDate(now)+" " +sFirstTime, "yyyy-MM-dd HH:mm");
		Date secondDatetime=StringUtils.str2Date(StringUtils.formatDate(now)+" " +sSecondTime, "yyyy-MM-dd HH:mm");
		Date deadlineDatetime=StringUtils.str2Date(StringUtils.formatDate(now)+" " +sDeadline, "yyyy-MM-dd HH:mm");
		Date takeDatetime=StringUtils.str2Date(StringUtils.formatDate(takeDate)+" " +time, "yyyy-MM-dd HH:mm");
		Date afternoonDateTime=StringUtils.str2Date(StringUtils.formatDate(now)+" 15:05", "yyyy-MM-dd HH:mm");
		if(now.before(deadlineDatetime)){
			if(takeDatetime.before(deadlineDatetime)){
				throw new SPException(String.format("取货时间至少为今天的%s",sFirstTime));
			}
		}else if(now.before(afternoonDateTime)){
			if(takeDatetime.before(afternoonDateTime)||takeDatetime.equals(afternoonDateTime)){
				throw new SPException(String.format("取货时间至少为今天的%s",sSecondTime));
			}
		}else if(now.before(secondDatetime)){
			if(takeDatetime.before(secondDatetime)||takeDatetime.equals(secondDatetime)){
				throw new SPException(String.format("取货时间至少为下一天的%s",sFirstTime));
			}
		}else{
			throw new SPException(String.format("取货时间至少为下一天的%s",sFirstTime));
		}
	}
	//public 
}
