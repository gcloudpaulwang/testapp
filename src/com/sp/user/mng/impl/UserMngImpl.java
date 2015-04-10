package com.sp.user.mng.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sp.common.page.Pagination;
import com.sp.core.CoreManagerImpl;
import com.sp.user.entity.User;
import com.sp.user.mng.UserMng;
import com.sp.user.dao.UserDao;
@Service("UserMngImpl")
@Transactional
public class UserMngImpl extends CoreManagerImpl<User> implements UserMng{

	public UserDao getDao(){
		return (UserDao)super.getDao();
	}
	@Autowired
	public void setDao(UserDao dao){
		super.setDao(dao);
	}
	@Override
	public User authenticate(String loginName, String password) {
		// TODO Auto-generated method stub
		return getDao().authenticate(loginName, password);
	}
	
	
	public Pagination list(int pageNo,int pageSize,Integer roleId){
		return getDao().list(pageNo, pageSize, roleId);
	}
	
	public boolean isUserExist(String name){
		int count=getDao().countByProperty("loginName",name);
		return count>0?true:false;
	}
	public List<String> findDeliverors(){
		return getDao().findDeliverors();
	}
	@Override
	public List<User> findByRealname(String name) {
		// TODO Auto-generated method stub
		return getDao().findByRealname(name);
	}
	@Override
	public Pagination list(int pageNo, int pageSize, Integer roleId,
			String company) {
		// TODO Auto-generated method stub
		return getDao().list(pageNo, pageSize, roleId, company);
	}
}
