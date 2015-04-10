package com.aok.job;

import java.util.Calendar;
import java.util.List;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import com.aok.entity.AccessoryOrder;
import com.aok.order.mng.AccessoryOrderMng;
import com.sp.common.util.StringUtils;
import com.sp.core.web.AppContext;

public class AccessoryOrderJob implements Job{
	private AccessoryOrderMng orderMng=(AccessoryOrderMng) AppContext.getCtx().getBean("AccessoryOrder");
	@Override
	public void execute(JobExecutionContext arg0) throws JobExecutionException {
		// TODO Auto-generated method stub
		Calendar  calendar = Calendar.getInstance();
		calendar.add(Calendar.DAY_OF_MONTH, 1); 
		
		/*List<AccessoryOrder> orders=orderMng.findEditble(StringUtils.str2Date(StringUtils.formatDate(calendar.getTime()),"yyyy-MM-dd") );
		for(AccessoryOrder order : orders){
			order.setEditable(false);
			try{
				orderMng.update(order);
			}catch (Exception e) {
				// TODO: handle exception
				e.printStackTrace();
			}
		}*/
	}

}
