package com.sp.user.entity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.aok.user.entity.AokUser;
import com.aok.user.entity.ERole;
import com.googlecode.jsonplugin.annotations.JSON;


/**
 * User entity. @author MyEclipse Persistence Tools
 */

public class User  implements java.io.Serializable {
	private static final long serialVersionUID = 1L;
	public static final String USER_INFO="_user_info";
    // Fields    
	private Integer id;
     private String loginName;
     private String pwd;
     private String email;
     private Date createTime;
     private Date lastLoginTime;
     private String lastLoginIp;
     private Long loginCount;
     private Boolean disabled;
     private Role role;
     private AokUser aokUser;
     private String realName;

 	/**
 	 * 在session的保存的key。
 	 */
 	public static final String USER_KEY = "_user_key";
 	public static final String RIGHTS_KEY = "_user_rights_key";
 	
 	@JSON(serialize=false)
 	public List<String> getPermissionsUris(){
 		if(role!=null)
 			return role.getPermissionUris();
 		return new ArrayList<String>();
 	}


	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getLoginName() {
		return loginName;
	}

	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}

	
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public Date getLastLoginTime() {
		return lastLoginTime;
	}

	public void setLastLoginTime(Date lastLoginTime) {
		this.lastLoginTime = lastLoginTime;
	}

	public String getLastLoginIp() {
		return lastLoginIp;
	}

	public void setLastLoginIp(String lastLoginIp) {
		this.lastLoginIp = lastLoginIp;
	}

	public Long getLoginCount() {
		if(loginCount==null) return 0L;
		return loginCount;
	}

	public void setLoginCount(Long loginCount) {
		this.loginCount = loginCount;
	}
	
	public Boolean getDisabled() {
		if(disabled==null) return false;
		return disabled;
	}

	public void setDisabled(Boolean disabled) {
		this.disabled = disabled;
	}
	
	@JSON(serialize=false)
	public String getPwd() {
		return pwd;
	}

	public void setPwd(String pwd) {
		this.pwd = pwd;
	}


	public AokUser getAokUser() {
		return aokUser;
	}


	public void setAokUser(AokUser aokUser) {
		this.aokUser = aokUser;
	}


	public Role getRole() {
		return role;
	}


	public void setRole(Role role) {
		this.role = role;
	}


	public String getRealName() {
		return realName;
	}


	public void setRealName(String realName) {
		this.realName = realName;
	}

	
	public ERole getERole() {
		switch (role.getId()) {
			case 1:
				return ERole.admin;
			case 2:
				return ERole.factroy;
			case 3:
				return ERole.store;
			case 4:
				return ERole.finance;
		}
		return null;
	}
}