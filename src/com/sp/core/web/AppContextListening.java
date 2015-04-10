package com.sp.core.web;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.aok.job.AccessoryOrderDeadlineJob;
import com.aok.job.AccessoryOrderFirstJob;
import com.aok.job.AccessoryOrderJob;
import com.aok.job.CakeOrderDeadlineJob;
import com.aok.job.CakeOrderFirstJob;
import com.aok.job.CakeOrderJob;
import com.sp.core.manager.QuartzManager;

public class AppContextListening  implements ServletContextListener {
	@Override
	public void contextDestroyed(ServletContextEvent arg0) {

	}

	@Override
	public void contextInitialized(ServletContextEvent eve) {
		// TODO Auto-generated method stub
		WebApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(eve.getServletContext());
		AppContext.setCtx(ctx);
		AppContext.setEvent(eve);
		
		//QuartzManager.addJob(CakeOrderJob.class, "0 22 2 * * ?");
		QuartzManager.addJob(CakeOrderDeadlineJob.class, "0 22 2 * * ?");
		QuartzManager.addJob(CakeOrderFirstJob.class, "0 00 12 * * ?");
		//QuartzManager.addJob(AccessoryOrderJob.class,"0 22 2 * * ?");
		QuartzManager.addJob(AccessoryOrderDeadlineJob.class, "0 22 2 * * ?");
		QuartzManager.addJob(AccessoryOrderFirstJob.class, "0 00 12 * * ?");
		QuartzManager.startJobs();
	}

}