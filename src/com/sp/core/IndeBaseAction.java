package com.sp.core;

import static com.sp.core.CoreAction.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.opensymphony.xwork2.Validateable;
import com.sp.common.SpProperties;
import com.sp.common.page.Pagination;
import com.sp.common.struts2.interceptor.DomainNameAware;
import com.sp.common.struts2.interceptor.UrlAware;
import com.sp.user.entity.User;
import com.sp.user.mng.UserMng;

/**
 * 独立模板基类
 * <p>
 * 提供选择模板功能。获得翻页基本信息。
 * </p>
 * 
 * @author liufang
 */
@SuppressWarnings("unchecked")
public abstract class IndeBaseAction extends IntegrityAction implements
		DomainNameAware, UrlAware, Validateable {
	private static final Logger log = LoggerFactory
			.getLogger(IndeBaseAction.class);
	
	public static final String REDIRECT_LOGIN = "public/loginInput.jspx";
	public static final String JSON = "json";
	//每页数量
	protected int pageSize=10;
	protected int start=0;
	private SpProperties spProperties;

	public SpProperties getSpProperties() {
		return spProperties;
	}

	@Autowired
	public void setSpProperties(SpProperties spProperties) {
		this.spProperties = spProperties;
	}
	@Autowired
	protected  UserMng userMng;
	protected Pagination pagination;
	public void validate() {
	}

	/**
	 * 绕过Template,直接输出内容的简便函数.
	 */
	protected String render(String text, String contentType) {
		try {
			HttpServletResponse response = ServletActionContext.getResponse();
			response.setContentType(contentType);
			response.getWriter().write(text);
		} catch (IOException e) {
			log.error(e.getMessage(), e);
		}
		return null;
	}

	/**
	 * 直接输出字符串.
	 */
	protected String renderText(String text) {
		return render(text, "text/plain;charset=UTF-8");
	}

	/**
	 * 获得页面cookie指定的每页显示记录数
	 * 
	 * @return
	 */
	protected int getCookieCount() {
		Cookie c = contextPvd.getCookie(COOKIE_COUNT);
		int count = 0;
		if (c != null) {
			try {
				count = Integer.parseInt(c.getValue());
			} catch (Exception e) {
			}
		}
		if (count <= 0) {
			count = DEFAULT_COUNT;
		} else if (count > 200) {
			count = COOKIE_MAX_COUNT;
		}
		return count;
	}

	
	protected String checkLoginAndError() {
		if (hasErrors()) {
			return showError();
		}
		User user = getUser();
		// 没有登录
		if (user == null) {
			if (contextPvd.isMethodPost()) {
				addActionError("对不起，您还没有登录，无法进行此操作");
				return showMessage();
			} else {
				//return REDIRECT_LOGIN;//redirectLogin();
				return redirectLogin();
			}
		}	
		return null;
	}
	
	
	protected String redirectLogin() {
		return handleResult("login", "public");
	}
	/**
	 * 返回信息提示页面，无返回按钮，用于已经登录但是没有权限等提示。
	 * 
	 * @return
	 */
	protected String showMessage() {
		return handleResult(SHOW_MESSAGE);
	}

	/**
	 * 显示错误信息，有返回按钮，但不自动跳转，如验证码错误等提示。
	 * 
	 * @return
	 */
	protected String showError() {
		return handleResult(SHOW_ERROR);
	}

	/**
	 * 显示出成功信息，有返回按钮，2秒后自动跳转，如修改密码成功。需要提供返回链接地址。
	 * 
	 * @return
	 */
	protected String showSuccess() {
		return handleResult(SHOW_SUCCESS);
	}
	
	/*
	public boolean getAllowSchedule(){
		List<String> funUris=(List<String>)contextPvd.getSessionAttr(User.RIGHTS_KEY);
		if(funUris.contains("schedule/schedule!show.do"))
			return true;
		return false;
	}*/
	public boolean getAllowPreparation(){
		List<String> funUris=(List<String>)contextPvd.getSessionAttr(User.RIGHTS_KEY);
		if(funUris.contains("preparation/list.do")||funUris.contains("ebook/list.do"))
			return true;
		return false;
	}
	
	public void setDomainName(String domainName) {
		// empty is OK!
	}

	public void setPageLink(String pageLink) {
		this.pageLink = pageLink;
	}

	public void setPageNo(int pageNo) {
		this.pageNo = pageNo;
	}

	public void setPageSuffix(String pageSuffix) {
		this.pageSuffix = pageSuffix;
	}

	public void setPathParams(String[] pathParams) {
		// empty is OK!
	}

	public void setOtherParams(String[] otherParams) {
		this.otherParams = otherParams;
	}

	public void setWholeUrl(String wholeUrl) {
		this.wholeUrl = wholeUrl;
	}

	protected String backUrl;

	public String getBackUrl() {
		return backUrl;
	}

	public void setBackUrl(String backUrl) {
		this.backUrl = backUrl;
	}
	
	public Map<String, Object> jsonRoot = new HashMap<String, Object>();
	public Map<String, Object> getJsonRoot() {
		return jsonRoot;
	}

	public void setJsonRoot(Map<String, Object> jsonRoot) {
		this.jsonRoot = jsonRoot;
	}
	public int getPageSize() {
		return pageSize;
	}
	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}
	public int getStart() {
		return start;
	}
	public void setStart(int start) {
		this.start = start;
	}
	

	public Pagination getPagination() {
		return pagination;
	}

	public void setPagination(Pagination pagination) {
		this.pagination = pagination;
	}
}