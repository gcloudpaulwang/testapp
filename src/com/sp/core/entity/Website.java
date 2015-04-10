package com.sp.core.entity;

import static com.sp.core.Constants.CMD_BASE;
import static com.sp.core.Constants.RES_BASE;
import static com.sp.core.Constants.RES_SYS;
import static com.sp.core.Constants.SPT;
import static com.sp.core.Constants.TEMPLATE;
import static com.sp.core.Constants.UPLOAD_PATH;
import static com.sp.core.Constants.USER_BASE;
import static com.sp.core.Constants.WEBINF;


public class Website  {
	
	public Website(){
		
	}
	/**
	 * 用户相对根路径。/WEB-INF/user_base/
	 */
	public static final String USER_ROOT = SPT + WEBINF + SPT + USER_BASE + SPT;
	
	public static final String CMD_ROOT=SPT+WEBINF+SPT+CMD_BASE+SPT;
	/**
	 * 页面访问默认的后缀
	 */
	public static final String DEF_SUFFIX = "htm";

	/**
	 * 获得站点的URL。如：http://www.nc138.com 或 http://www.nc138.com:8080/CmsSys
	 * 
	 * @return
	 */
	/*
	public StringBuilder getWebUrlBuf() {
		StringBuilder sb = new StringBuilder();
		//sb.append("http://").append(getDomain());
		//if (getPort() != null && !getPort().equals(80)) {
			//sb.append(":").append(getPort());
		//}
		if (getContextPath() != null) {
			sb.append(getContextPath());
		}
		return sb;
	}
	*/
	/**
	 * 获得站点的URL。如：http://www.nc138.com 或 http://www.nc138.com:8080/CmsSys
	 * 
	 * @return
	 */
	/*
	public String getWebUrl() {
		return getWebUrlBuf().toString();
	}
	*/
	/**
	 * 获得资源站点的URL。如：http://res.nc138.com 或 http://res.nc138.com:8080/CmsSys
	 * 
	 * 如没有指定资源域名，则和网站访问地址一样。为远程附件做准备。
	 * 
	 * @return
	 */
	/*
	public StringBuilder getResUrlBuf() {
		if (StringUtils.isBlank(getResDomain())) {
			return getWebUrlBuf();
		} else {
			return new StringBuilder(getResDomain());
		}
	}
	*/
	/**
	 * 获得资源站点的URL。如：http://res.nc138.com 或 http://res.nc138.com:8080/CmsSys
	 * 
	 * 如没有指定资源域名，则和网站访问地址一样。为远程附件做准备。
	 * 
	 * @return
	 */
	/*
	public String getResUrl() {
		return getResUrlBuf().toString();
	}
*/
	/**
	 * 获得站点的资源URL。如：http://www.sina.com/res_base/sina_com_www
	 * 
	 * @return
	 */
	/*
	public StringBuilder getUserResUrlBuf() {
		return getResUrlBuf().append(SPT).append(RES_BASE).append(SPT).append(
				getResPath());
	}
*/
	/**
	 * 获得站点的资源URL。如：http://www.sina.com/res_base/sina_com_www
	 * 
	 * @return
	 */
	/*
	public String getUserResUrl() {
		return getUserResUrlBuf().toString();
	}*/

	/**
	 * 获得系统资源URL。如：http://www.sian.com/front_res
	 * 
	 * 主要供前台模板使用的一些样式表、图片。
	 * 
	 * @return
	 */
	/*
	public String getSysResUrl() {
		return getResUrlBuf().append(SPT).append(RES_SYS).toString();
	}
*/
	/**
	 * 获得上传根路径。如：http://www.sina.com/res_base/sina_com_www/upload
	 * 
	 * @return
	 */
	/*
	public StringBuilder getUploadUrlBuf() {
		return getUserResUrlBuf().append(SPT).append(UPLOAD_PATH);
	}
*/
	/**
	 * 获得上传根路径。如：http://www.sina.com/res_base/sina_com_www/upload
	 * 
	 * @return
	 */
	/*
	public String getUploadUrl() {
		return getUploadUrlBuf().toString();
	}
*/
	
	public String getResPath(){
		return "aok";
	}
	/**
	 * 获得用户相对根路径。如：/WEB-INF/user_base/ponyjava_com_www
	 * 
	 * @return
	 */
	
	public StringBuilder getUserRoot() {
		StringBuilder sb = new StringBuilder(USER_ROOT);
		sb.append(getResPath());
		return sb;
	}

	/**
	 * 获得模板相对路径。如：/WEB-INF/user_base/ponyjava_com_www/template
	 * 
	 * @return
	 */
	public StringBuilder getTplRoot() {
		return getUserRoot().append(SPT).append(TEMPLATE);
	}

	/**
	 * 获得模板绝对路径。如：f:/wangzhan/sina/WEB-INF/user_base/ponyjava_com_www/template
	 * 
	 * @param realRoot
	 * @return
	 */
	public StringBuilder getTplRootReal(String realRoot) {
		StringBuilder sb = new StringBuilder(realRoot);
		sb.append(getTplRoot());
		return sb;
	}
	
	public StringBuilder getCmdRoot(){
		StringBuilder sb = new StringBuilder(CMD_ROOT);
		return sb;
	}

	/**
	 * 获得资源根路径。如：/res_base/sina_com_www
	 * 
	 * @return
	 */
	public StringBuilder getResRootBuf() {
		StringBuilder sb = new StringBuilder();
		sb.append(SPT).append(RES_BASE).append(SPT).append(getResPath());
		return sb;
	}

	/**
	 * 获得资源根路径。如：/res_base/sina_com_www
	 * 
	 * @return
	 */
	public String getResRoot() {
		return getResRootBuf().toString();
	}

	/**
	 * 获得上传根路径。如：/res_base/sina_com_www/upload
	 * 
	 * @return
	 */
	public StringBuilder getUploadRoot() {
		return getResRootBuf().append(SPT).append(UPLOAD_PATH);
	}

	/* [CONSTRUCTOR MARKER END] */
}