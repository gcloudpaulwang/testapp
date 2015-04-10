package com.sp.core.manager;

import java.util.List;

import javax.servlet.http.HttpSession;

import com.sp.common.page.Pagination;
import com.sp.core.entity.Admin;
import com.sp.core.entity.User;

/**
 * 管理员manager接口
 * 
 * @author liufang
 * 
 */
public interface AdminMng {
	/**
	 * 通过统一用户ID获得管理员
	 * 
	 * @param webId
	 * @param userId
	 * @return
	 */
	public Admin getByUserId(Long webId, Long userId);

	/**
	 * 通过登录名查找管理员
	 * 
	 * @param webId
	 * @param loginName
	 * @return
	 */
	public Admin getByLoginName(Long webId, String loginName);

	/**
	 * 获得某站点管理员
	 * 
	 * @param webId
	 * @return
	 */
	public Pagination getAll(Long webId, int page, int countPerPage);

	/**
	 * 根据统一用户ID获得管理员列表
	 * 
	 * @param unitedId
	 * @return
	 */
	public List<Admin> getListByUserId(Long userId);

	/**
	 * 获得登录状态的管理员
	 * 
	 * @param webId
	 * @param adminId
	 * @param userId
	 * @return
	 */
	public Admin getLoginAdmin(Long webId, Long adminId, Long userId);

	/**
	 * 获得登录状态的管理员
	 * 
	 * @param webId
	 * @param adminId
	 * @param userId
	 * @return
	 */
	public Admin getLoginAdmin(String domain, Long adminId, Long userId,
			HttpSession session);

	/**
	 * 注册管理员
	 * 
	 * @param webId
	 * @param user
	 * @param admin
	 * @param isExist
	 * @return
	 * @throws UserRegisterException
	 */
	public Admin register(Long webId, User user, Admin admin, boolean isExist)
			throws Exception;
}