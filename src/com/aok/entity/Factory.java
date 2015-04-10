package com.aok.entity;
// default package



/**
 * AokFactory entity. @author MyEclipse Persistence Tools
 */

public class Factory  implements java.io.Serializable {


    // Fields    

     private String id;
     private String name;
     private String zone;


    // Constructors

    public String getZone() {
		return zone;
	}


	public void setZone(String zone) {
		this.zone = zone;
	}


	/** default constructor */
    public Factory() {
    }

    
    /** full constructor */
    public Factory(String name) {
        this.name = name;
    }

   
    // Property accessors

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
   








}