package com.sp.core;

import javax.servlet.http.Cookie;

import org.apache.struts2.ServletActionContext;
import org.springframework.beans.factory.annotation.Autowired;

import com.sp.common.struts2.ContextPvd;
import com.sp.common.struts2.action.BaseAction;
import com.sp.common.struts2.interceptor.DomainNameAware;
import com.sp.common.struts2.interceptor.ProcessingStartInterceptor;
import com.sp.core.entity.Admin;
import com.sp.core.manager.AdminMng;
import com.sp.user.entity.User;

/**
 * <p>
 * 处理域名、用户登录、访问路径等信息
 * </p>
 * 
 * @author liufang
 * 
 */
@SuppressWarnings("serial")
public class CoreAction extends BaseAction implements DomainNameAware {
	/**
	 * 错误提示页面
	 */
	public static final String SHOW_ERROR = "showError";
	/**
	 * 指定记录数的cookie名称
	 */
	public static final String COOKIE_COUNT = "_countPerPage";
	/**
	 * cookie能指定的最大记录数
	 */
	public static final int COOKIE_MAX_COUNT = 200;
	/**
	 * 默认记录数
	 */
	public static final int DEFAULT_COUNT = 20;
	/**
	 * 域名。如：www.sina.com
	 */
	protected String domainName;


	/**
	 * 获得用户ID
	 * 
	 * @return
	 */
	public Long getUserId() {
		return (Long) contextPvd.getSessionAttr(User.USER_KEY);
	}

	/**
	 * 获得用户对象
	 * 
	 * @return
	 */
	public User getUser() {
		/*Long userId = getUserId();
		if (userId == null) {
			return null;
		} else {
			return userMng.findById(userId);
		}*/
		return null;
	}

	/**
	 * 获得管理员ID
	 * 
	 * @return
	 */
	public Long getAdminId() {
		return (Long) contextPvd.getSessionAttr(Admin.ADMIN_KEY);
	}

	/**
	 * 获得管理员对象
	 * 
	 * @return
	 */
	public Admin getAdmin() {
		/*Long adminId = getAdminId();
		if (adminId == null) {
			return null;
		} else {
			return adminMng.findById(adminId);
		}
		*/
		return null;
	}


	
/*	public UserProfile getUserProfile() {
		Long userProfileId = getUserId();
		if (userProfileId == null) {
			return null;
		} else {
			return userProfileMng.findById(userProfileId);
		}
	}*/

	/**
	 * 获得页面执行时间ms
	 * 
	 * @return 返回页面执行时间(s)。-1代表没有找到页面开始执行时间。
	 */
	public float getProcessedIn() {
		Long time = (Long) contextPvd
				.getRequestAttr(ProcessingStartInterceptor.PROCESSING_START);
		if (time != null) {
			return (System.nanoTime() - time) / 1000 / 1000000F;
		} else {
			return -1;
		}
	}

	/**
	 * 页面重定向
	 * 
	 * @param url
	 * @return
	 */
	protected String redirect(String url) {
		this.redirectUrl = url;
		return Constants.REDIRECT;
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

	@Autowired
	protected ContextPvd contextPvd;
	@Autowired
	protected AdminMng adminMng;
	/**
	 * 页面重定向
	 */
	private String redirectUrl;

	public void setDomainName(String domainName) {
		this.domainName = domainName;
	}

	public String getRedirectUrl() {
		return redirectUrl;
	}

	public void setRedirectUrl(String redirectUrl) {
		this.redirectUrl = redirectUrl;
	}
}
