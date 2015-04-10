package com.sp.core.web;
import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.MethodFilterInterceptor;

/**
 * cookie识别码拦截器
 * 
 * 使用cookie标识浏览器，可用于投票、流量统计等功能。
 * 
 * @author liufang
 * 
 */
@SuppressWarnings("serial")
public class CookieIdentityInterceptor extends MethodFilterInterceptor {

	@Override
	protected String doIntercept(ActionInvocation invocation) throws Exception {

		return invocation.invoke();
	}
}