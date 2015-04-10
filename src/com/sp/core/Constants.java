﻿package com.sp.core;

import java.io.File;
import java.util.LinkedHashMap;
import java.util.Map;

public class Constants {

	public static String getSysName(String sysType) {
		return "edu_sys";
	}

	/**
	 * 资源路径
	 */
	public static final String RES_BASE = "res_base";
	/**
	 * 用户路径
	 */
	public static final String USER_BASE = "user_base";
	/**
	 * 命令行工具路径
	 */
	public static final String CMD_BASE = "cmd";
	/**
	 * 模板路径
	 */
	public static final String TEMPLATE = "template";
	/**
	 * WEB-INF
	 */
	public static final String WEBINF = "WEB-INF";
	/**
	 * 系统资源目录
	 */
	public static final String RES_SYS = "front_res";
	/**
	 * 上传的路径名
	 */
	public static final String UPLOAD_PATH = "upload";
	public static final String UPLOAD_FILE = "/file";
	public static final String UPLOAD_FLASH = "/flash";
	public static final String UPLOAD_IMAGE = "/image";
	public static final String UPLOAD_MEDIA = "/media";
	
	//
	
	public static final String CM_KEYPAIR_PATH="cmKeyPair";
	public static final String SM_VERSION_PATH="SmTool";
	/**
	 * 默认模板方案
	 */
	public static final String TPL_DEF_SOLUTION = "default";
	/**
	 * 模板后缀
	 */
	public static final String TPL_SUFFIX = ".html";
	/**
	 * 路径分隔符
	 */
	public static final char SPT = '/';
	/**
	 * 系统路径分隔符
	 */
	public static final char FILE_SPT = File.separatorChar;
	/**
	 * 重定向result
	 */
	public static final String REDIRECT = "redirect";
	/**
	 * 没有找到和域名相匹配的站点
	 */
	public static final String WEBSITE_NOT_FOUND = "websiteNotFound";

	/**
	 * 每日毫秒数
	 */
	public static final long DAY_MILLIS = 24 * 60 * 60 * 1000;
}
