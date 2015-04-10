package com.sp.user.mng.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sp.core.CoreManagerImpl;
import com.sp.user.mng.RoleMng;
import com.sp.user.dao.RoleDao;
import com.sp.user.entity.Role;
@Service
@Transactional
public class RoleMngImpl extends CoreManagerImpl<Role> implements RoleMng {
	public RoleDao getDao(){
		return (RoleDao)super.getDao();
	}
	@Autowired
	public void setDao(RoleDao dao){
		super.setDao(dao);
	}
}
