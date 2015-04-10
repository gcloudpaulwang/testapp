package com.aok.user.action;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.aok.action.AokAction;
import com.aok.base.mng.FactoryMng;
import com.aok.base.mng.StoreMng;
import com.aok.entity.Factory;
import com.aok.entity.Store;
import com.aok.user.entity.AokUser;
import com.google.common.base.Predicate;
import com.google.common.collect.Iterables;
import com.sp.common.page.Pagination;
import com.sp.common.util.MD5Util;
import com.sp.common.util.StringUtils;
import com.sp.user.entity.User;
import com.sp.user.mng.UserMng;

public class UserAction extends AokAction {
	private Integer roleId;
	private User u;
	private String orgin_pwd;
	private String new_pwd;
	
	@Autowired
	private UserMng userMng;
	@Autowired
	private FactoryMng fmng;
	@Autowired
	private StoreMng smng;
	
	public String info(){
		u=userMng.findUnique("loginName",getUserId());
		jsonRoot.put("data",u);
		jsonRoot.put("success", true);
		return SUCCESS;
	}
	
	public String infoWithPermissions(){
		u=userMng.findUnique("loginName",getUserId());
		List<String> permissionsUris=(List<String>)contextPvd.getSessionAttr(User.RIGHTS_KEY);
		jsonRoot.put("data",u);
		jsonRoot.put("permissions",permissionsUris);
		jsonRoot.put("success", true);
		return SUCCESS;
	}
	
	public String update(){
		User orgin_u=userMng.findUnique("loginName",getUserId());
		orgin_u.setEmail(u.getEmail());
		AokUser orgin_express_user=orgin_u.getAokUser();
		orgin_express_user.setGender(u.getAokUser().isGender());
		orgin_express_user.setMobile(u.getAokUser().getMobile());
		orgin_express_user.setRealName(u.getAokUser().getRealName());
		orgin_u.setAokUser(orgin_express_user);
		try{
			userMng.saveOrUpdate(orgin_u);
			jsonRoot.put("success", true);
		}catch(Exception e){
			jsonRoot.put("exception","更新失败");
			jsonRoot.put("success", false);
		}
		return SUCCESS;
	}
	
	public String updatePwd(){
		u=getUser();
		if(u.getPwd().equals(MD5Util.MD5(orgin_pwd))){
			u.setPwd(MD5Util.MD5(new_pwd));
			userMng.saveOrUpdate(u);
			jsonRoot.put("success", true);
		}else{
			jsonRoot.put("success", false);
			jsonRoot.put("exception","原密码不正确");
		}
		return SUCCESS;
	}
	
	public String list(){
		u=getUser();
		Pagination pagin=null;
		switch(u.getRole().getId()){
			case 1:
				pagin= userMng.list(getStart()/getLimit()+1,(getLimit()!=null&&getLimit()!=0)?getLimit():12, roleId);
				break;
			default:
				//pagin= userMng.list(getStart()/getLimit()+1,(getLimit()!=null&&getLimit()!=0)?getLimit():12, roleId,u.getExpressUser().getScompany());
				break;
		}
		
		Iterables.all(pagin.getList(), new Predicate<User>(){

			@Override
			public boolean apply(User arg0) {
				// TODO Auto-generated method stub
				arg0.setRealName(arg0.getAokUser().getRealName());
				return true;
			}
			
		});
		jsonRoot.put("data", pagin.getList());
		jsonRoot.put("totalCount", pagin.getTotalCount());
		jsonRoot.put("success", true);
		return SUCCESS;
	}
	public String add(){
		if(userMng.isUserExist(u.getLoginName())){
			jsonRoot.put("exception","登录名已存在");
			jsonRoot.put("success", false);
			return SUCCESS;
		}
		u.setPwd(MD5Util.MD5(u.getPwd()));
		u.setCreateTime(new Date());
		if(u.getAokUser().getFactory()==null||StringUtils.isBlank(u.getAokUser().getFactory().getId())){
			u.getAokUser().setFactory(null);
		}
		else{
			Factory factory = fmng.findById(u.getAokUser().getFactory().getId());
			if(factory==null){
				jsonRoot.put("success", false);
				jsonRoot.put("exception","工厂信息有误");
				return SUCCESS;
			}
			u.getAokUser().setFactory(factory);
			u.getAokUser().setFactoryName(factory.getName());
		}
		if(u.getAokUser().getStore()==null||StringUtils.isBlank(u.getAokUser().getStore().getId())){
			u.getAokUser().setStore(null);
		}
		else{
			Store store = smng.findById(u.getAokUser().getStore().getId());
			if(store==null){
				jsonRoot.put("success", false);
				jsonRoot.put("exception","门店信息有误");
				return SUCCESS;
			}
			u.getAokUser().setStore(store);
			u.getAokUser().setStoreName(store.getName());
		}
		u.getAokUser().setUser(u);
		try{
			userMng.save(u);
			jsonRoot.put("success", true);
		}catch(Exception e){
			jsonRoot.put("exception","添加用户失败");
			jsonRoot.put("success", false);
		}
		return SUCCESS;
	}
	
	public String edit(){
		try{
			User orgin_u=userMng.findById(u.getId());
			AokUser orgin_express_user=orgin_u.getAokUser();
			orgin_express_user.setGender(u.getAokUser().isGender());
			orgin_express_user.setMobile(u.getAokUser().getMobile());
			orgin_express_user.setRealName(u.getAokUser().getRealName());
			if(u.getAokUser().getStore()!=null&&!StringUtils.isBlank(u.getAokUser().getStore().getId())){
				Store store = smng.findById(u.getAokUser().getStore().getId());
				if(store==null){
					jsonRoot.put("success", false);
					jsonRoot.put("exception","门店信息有误");
					return SUCCESS;
				}
				orgin_express_user.setStore(store);
				orgin_express_user.setStoreName(store.getName());
			}
			if(u.getAokUser().getFactory()!=null&&!StringUtils.isBlank(u.getAokUser().getFactory().getId())){
				Factory factory = fmng.findById(u.getAokUser().getFactory().getId());
				if(factory==null){
					jsonRoot.put("success", false);
					jsonRoot.put("exception","工厂信息有误");
					return SUCCESS;
				}
				orgin_express_user.setFactory(factory);
				orgin_express_user.setFactoryName(factory.getName());
			}
			
			orgin_u.setEmail(u.getEmail());
			if(!StringUtils.isBlank(u.getPwd()))
				orgin_u.setPwd(MD5Util.MD5(u.getPwd()));
			orgin_u.setAokUser(orgin_express_user);
			userMng.saveOrUpdate(orgin_u);
			jsonRoot.put("success", true);
		}catch(Exception e){
			jsonRoot.put("exception","编辑用户失败");
			jsonRoot.put("success", false);
		}
		return SUCCESS;
	}
	
	public String del(){
		if(u.getId()==1){
			jsonRoot.put("exception","admin用户不能删除");
			jsonRoot.put("success", false);
			return SUCCESS;
		}
		try{
			userMng.deleteById(u.getId());
			jsonRoot.put("success", true);
		}catch(Exception e){
			jsonRoot.put("exception","删除用户失败");
			jsonRoot.put("success", false);
		}
		return SUCCESS;
	}
	
	@Override
	protected String getSolution() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	protected String getSysType() {
		// TODO Auto-generated method stub
		return null;
	}
	public Integer getRoleId() {
		return roleId;
	}
	public void setRoleId(Integer roleId) {
		this.roleId = roleId;
	}
	public User getU() {
		return u;
	}
	public void setU(User u) {
		this.u = u;
	}

	public String getOrgin_pwd() {
		return orgin_pwd;
	}

	public String getNew_pwd() {
		return new_pwd;
	}

	public void setOrgin_pwd(String orgin_pwd) {
		this.orgin_pwd = orgin_pwd;
	}

	public void setNew_pwd(String new_pwd) {
		this.new_pwd = new_pwd;
	}
}
