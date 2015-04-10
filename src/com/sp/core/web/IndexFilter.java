package com.sp.core.web;

import java.io.IOException;

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


public class IndexFilter implements Filter{

	@Override
	public void destroy() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void doFilter(ServletRequest servletRequest,
			ServletResponse servletResponse, FilterChain chain) throws IOException, ServletException {
		// TODO Auto-generated method stub
		HttpServletRequest req = (HttpServletRequest) servletRequest;
		HttpServletResponse resp = (HttpServletResponse) servletResponse;
		HttpSession session = req.getSession(false);
		if(session==null){
			resp.sendRedirect(req.getContextPath()
					+ "/public/loginInput.jspx");
			return;
		}else{
			if(session.getAttribute(User.USER_KEY)==null){
				resp.sendRedirect(req.getContextPath()
						+ "/public/loginInput.jspx");
				return;
			}else{
				resp.sendRedirect(req.getContextPath()
						+ "/manage/main.jspx");
				return;
			}
		}
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
		// TODO Auto-generated method stub
		
	}

}
