package com.sp.user.mng;

import java.util.List;

import com.sp.common.page.Pagination;
import com.sp.core.CoreManager;
import com.sp.user.entity.User;
public interface UserMng extends CoreManager<User>{
	User authenticate(String loginName, String password);
	Pagination list(int pageNo,int pageSize,Integer roleId);
	Pagination list(int pageNo,int pageSize,Integer roleId,String company);
	boolean isUserExist(String name);
	List<String> findDeliverors();
	List<User> findByRealname(String name);
}	
