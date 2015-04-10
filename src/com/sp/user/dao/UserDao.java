package com.sp.user.dao;

import java.util.List;

import com.sp.common.page.Pagination;
import com.sp.core.CoreDao;
import com.sp.user.entity.User;

public interface UserDao extends CoreDao<User>{
	User authenticate(String loginName, String password);
	Pagination list(int pageNo,int pageSize,Integer roleId);
	Pagination list(int pageNo,int pageSize,Integer roleId,String company);
	List<String> findDeliverors();
	List<User> findByRealname(String name);
}
