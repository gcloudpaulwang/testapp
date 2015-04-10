package com.aok.entity;
// default package



/**
 * AokStore entity. @author MyEclipse Persistence Tools
 */

public class Store  implements java.io.Serializable {


    // Fields    

     private String id;
     private String name;
     private String zone;
     private Factory factory;
     private String tel;


    // Constructors

    /** default constructor */
    public Store() {
    }
    
    public Store(String name){
    	this.name=name;
    }
    public Store(String id,String name){
    	this.id=id;
    	this.name=name;
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

    public String getZone() {
        return this.zone;
    }
    
    public void setZone(String zone) {
        this.zone = zone;
    }


	public String getTel() {
		return tel;
	}


	public void setTel(String tel) {
		this.tel = tel;
	}

	public Factory getFactory() {
		return factory;
	}

	public void setFactory(Factory factory) {
		this.factory = factory;
	}
   








}