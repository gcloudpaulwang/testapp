package com.sp.user.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
// default package

import com.googlecode.jsonplugin.annotations.JSON;



/**
 * Role entity. @author MyEclipse Persistence Tools
 */

public class Role  implements java.io.Serializable {


    // Fields    

     private Integer id;
     private String name;
     private Byte isSuper;
     private Set<Permission> permissions;


    // Constructors

    /** default constructor */
    public Role() {
    }

    
    /** full constructor */
    public Role(String name, Byte isSuper) {
        this.name = name;
        this.isSuper = isSuper;
    }

   
    // Property accessors

    public Integer getId() {
        return this.id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    @JSON(serialize=false)
    public Byte getIsSuper() {
        return this.isSuper;
    }
    
    public void setIsSuper(Byte isSuper) {
        this.isSuper = isSuper;
    }

    @JSON(serialize=false)
	public Set<Permission> getPermissions() {
		return permissions;
	}


	public void setPermissions(Set<Permission> permissions) {
		this.permissions = permissions;
	}
	@JSON(serialize=false)
	public List<String> getPermissionUris(){
		List<String> res=new ArrayList<String>();
		for(Permission p:permissions){
			String[] uris=p.getUri().split(";");
			for(int i=0;i<uris.length;i++)
				res.add(uris[i]);
		}
		return res;
	}

}