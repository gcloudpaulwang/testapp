package com.sp.user.entity;
// default package

import java.util.HashSet;
import java.util.Set;


/**
 * Permission entity. @author MyEclipse Persistence Tools
 */

public class Permission  implements java.io.Serializable {


    // Fields    

     private Integer id;
     private Integer parentId;
     private String uri;
     private Set children;



    // Property accessors

    public Integer getId() {
        return this.id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }

    public String getUri() {
        return this.uri;
    }
    
    public void setUri(String uri) {
        this.uri = uri;
    }

	public Set getChildren() {
		return children;
	}

	public void setChildren(Set children) {
		this.children = children;
	}

	public Integer getParentId() {
		return parentId;
	}

	public void setParentId(Integer parentId) {
		this.parentId = parentId;
	}
   








}