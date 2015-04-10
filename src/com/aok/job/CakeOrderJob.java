package com.aok.job;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import com.aok.entity.CakeOrder;
import com.aok.order.mng.CakeOrderMng;
import com.sp.common.util.StringUtils;
import com.sp.core.web.AppContext;

public class CakeOrderJob implements Job{
	private CakeOrderMng orderMng=(CakeOrderMng) AppContext.getCtx().getBean("CakeOrder");
	@Override
	public void execute(JobExecutionContext arg0) throws JobExecutionException {
		// TODO Auto-generated method stub
		Calendar  calendar = Calendar.getInstance();
		calendar.add(Calendar.DAY_OF_MONTH, 1); 
		Date date=calendar.getTime();
		
		/*
		List<CakeOrder> orders=orderMng.findEditble(StringUtils.str2Date(StringUtils.formatDate(calendar.getTime()),"yyyy-MM-dd") );
		for(CakeOrder order : orders){
			order.setEditable(false);
			try{
				orderMng.update(order);
			}catch (Exception e) {
				// TODO: handle exception
				e.printStackTrace();
			}
		}
		*/
	}

}
