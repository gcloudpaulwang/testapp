package com.sp.core.manager.impl;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.sp.common.hibernate3.Condition;
import com.sp.common.hibernate3.OrderBy;
import com.sp.common.hibernate3.Updater;
import com.sp.common.page.Pagination;
import com.sp.common.struts2.ContextPvd;
import com.sp.core.entity.Admin;
import com.sp.core.entity.User;
import com.sp.core.manager.AdminMng;

@Service
@Transactional
public class AdminMngImpl implements AdminMng {

	@Override
	public Pagination getAll(Long webId, int page, int countPerPage) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Admin getByLoginName(Long webId, String loginName) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Admin getByUserId(Long webId, Long userId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Admin> getListByUserId(Long userId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Admin getLoginAdmin(Long webId, Long adminId, Long userId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Admin getLoginAdmin(String domain, Long adminId, Long userId,
			HttpSession session) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Admin register(Long webId, User user, Admin admin, boolean isExist)
			throws Exception {
		// TODO Auto-generated method stub
		return null;
	}

	
}
