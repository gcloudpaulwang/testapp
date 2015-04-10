package com.aok.job;

import java.util.List;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import com.aok.entity.CakeOrder;
import com.aok.order.mng.CakeOrderMng;
import com.sp.core.web.AppContext;

public class CakeOrderFirstJob implements Job{
	private CakeOrderMng orderMng=(CakeOrderMng) AppContext.getCtx().getBean("CakeOrder");
	@Override
	public void execute(JobExecutionContext arg0) throws JobExecutionException {
		// TODO Auto-generated method stub
		List<CakeOrder> orders=orderMng.findEditble("first");
		for(CakeOrder order : orders){
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
