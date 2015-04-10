package com.sp.user.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.sp.common.hibernate3.Finder;
import com.sp.common.page.Pagination;
import com.sp.core.CoreDaoImpl;
import com.sp.user.entity.User;
import com.sp.user.dao.UserDao;
@Repository
public class UserDaoImpl extends CoreDaoImpl<User> implements UserDao{

	@Override
	public User authenticate(String loginName, String password) {
		// TODO Auto-generated method stub
		String hql = "from User u where u.loginName=? and u.pwd=?";
		return (User) findUnique(hql, loginName,password);
	}
	
	public Pagination list(int pageNo,int pageSize,Integer roleId){
		StringBuilder sb=new StringBuilder();
		sb.append("from User u where 1=1");
		if(roleId!=null)
			sb.append(" and u.role.id=").append(roleId);
		Finder f=new Finder(sb.toString());
		return find(f, pageNo, pageSize);
	}
	@Override
	public Pagination list(int pageNo, int pageSize, Integer roleId,String company) {
		// TODO Auto-generated method stub
		StringBuilder sb=new StringBuilder();
		sb.append("from User u where 1=1");
		if(roleId!=null)
			sb.append(" and u.role.id=").append(roleId);
		if(company!=null)
			sb.append(" and u.expressUser.scompany='").append(company).append("'");
		Finder f=new Finder(sb.toString());
		return find(f, pageNo, pageSize);
	}

	@Override
	public List<String> findDeliverors() {
		// TODO Auto-generated method stub
		String hql="select distinct u.expressUser.realName from User u where u.role.id=2";
		return find(hql);
	}

	@Override
	public List<User> findByRealname(String name) {
		// TODO Auto-generated method stub
		String hql="from User u where u.expressUser.realName=?";
		return find(hql,name);
	}

	
}
