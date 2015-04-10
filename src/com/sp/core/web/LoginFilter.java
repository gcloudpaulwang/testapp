package com.sp.core.web;

import java.io.IOException;
import java.util.List;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.sp.user.entity.User;



public class LoginFilter implements Filter {
	private boolean isControl;

	@Override
	public void destroy() {
		// TODO Auto-generated method stub

	}

	@Override
	public void doFilter(ServletRequest servletRequest,
			ServletResponse servletResponse, FilterChain chain)
			throws IOException, ServletException {
		HttpServletRequest req = (HttpServletRequest) servletRequest;
		HttpServletResponse resp = (HttpServletResponse) servletResponse;
		HttpSession session = req.getSession(false);
		String postfix = getPostfix(req);
		if(postfix==null)
			return;
		boolean isDoPostfix=false,isJspxPostix=false;
		if(postfix.equals("do"))
			isDoPostfix=true;
		if(postfix.equals("jspx"))
			isJspxPostix=true;
		if (session == null||session.getAttribute(User.USER_KEY)==null) {
			if(isJspxPostix)
				resp.sendRedirect(req.getContextPath()
					+ "/public/loginInput.jspx");
			if(isDoPostfix){
				resp.setCharacterEncoding("utf-8");
				resp.getWriter().write("{success:false,logined:false}");
			}
			return;
		}
		chain.doFilter(servletRequest, servletResponse);
	}

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		String control = filterConfig.getInitParameter("isControl");
		if ("false".equals(control)) {
			isControl = false;
		} else {
			isControl = true;
		}

	}

	private String getUrl(HttpServletRequest req) {
		String url = req.getRequestURI();
		String context = req.getContextPath();
		if (url.indexOf(".") != -1) {
			return url.substring(context.length(), url.indexOf("."));
		} else if (url.indexOf("?") != -1) {
			return url.substring(context.length(), url.indexOf("?"));
		} else {
			return url.substring(context.length());
		}
	}
	
	private String getPostfix(HttpServletRequest req){
		String uri=req.getRequestURI();
		if (uri.indexOf(".") != -1) {
			if(uri.indexOf("?")!=-1){
				return uri.substring(uri.indexOf(".")+1,uri.indexOf("?"));
			}else
				return uri.substring(uri.indexOf(".")+1);
		}
		return null;
	}

}
