package com.aok.job;

import java.util.List;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import com.aok.entity.AccessoryOrder;
import com.aok.order.mng.AccessoryOrderMng;
import com.sp.core.web.AppContext;

public class AccessoryOrderDeadlineJob implements Job{
	private AccessoryOrderMng orderMng=(AccessoryOrderMng) AppContext.getCtx().getBean("AccessoryOrder");
	@Override
	public void execute(JobExecutionContext arg0) throws JobExecutionException {
		// TODO Auto-generated method stub
		List<AccessoryOrder> orders=orderMng.findEditble("deadline");
		for(AccessoryOrder order : orders){
			order.setEditable(false);
			try{
				orderMng.update(order);
			}catch (Exception e) {
				// TODO: handle exception
				e.printStackTrace();
			}
		}
	}

}
