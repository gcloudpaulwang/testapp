package com.sp.core.web;

import javax.servlet.ServletContextEvent;

import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

public class AppContext {
	public static ApplicationContext ctx;
	private static ServletContextEvent event;
	
	public static void initAppContext()
	{
		if(ctx == null) 
			ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(event.getServletContext());
	}

	public static ApplicationContext getCtx() {
		if(ctx == null) 
			ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(event.getServletContext());
		return ctx;
	}

	public static void setCtx(ApplicationContext ctx) {
		AppContext.ctx = ctx;
	}

	public static ServletContextEvent getEvent() {
		return event;
	}

	public static void setEvent(ServletContextEvent event) {
		AppContext.event = event;
	}
}

