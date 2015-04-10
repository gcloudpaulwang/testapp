package com.aok.entity;
// default package

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import org.jaxen.function.StringFunction;

import com.googlecode.jsonplugin.annotations.JSON;
import com.sp.common.util.StringUtils;


/**
 * CakeOrder entity. @author MyEclipse Persistence Tools
 */

public class CakeOrder  implements java.io.Serializable {


    // Fields    

     private String id;
     private int seq;
     private Date createDate;
     private Store placeStore;
     private String placeStoreName;
     private String placeStoreTel;
     private Store takeStore;
     private String takeStoreName;
     private String ownerStoreName;
     private Store ownerStore;
     private Date placeDate;
     private Date takeDate;
     private String takeTime;
     private Product cake;
     private String cakeSize;
     private String cakeName;
     private String greeting;
     private String customerName;
     private String customerTel;
     private String operator;
     private Boolean hasPaid;
     private Long deposit;
     private Boolean plain;
     private Boolean group;
     private String bfCode;
     private String request;
     private String zone;
     //private Boolean hasSend;
     private Integer nhasSend=0;
     private Date sendDate;
     private String sendMan;
     private String sendRemark;
     private String orglNo;
     private Boolean editable=true;
     private Boolean printed;
     private Set<CakeOrderChange> changes=new HashSet<CakeOrderChange>();
     
     
    // Constructors

    /** default constructor */
    public CakeOrder() {
    }

	/** minimal constructor */
    public CakeOrder(String id) {
        this.id = id;
    }
    
    public String getSsendDate(){
    	if(sendDate!=null)
    		return StringUtils.formatDate(sendDate, "yyyy-MM-dd HH:mm");
    	return "";
    }
   
    // Property accessors

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public Date getCreateDate() {
        return this.createDate;
    }
    
    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }


    public String getPlaceStoreName() {
        return this.placeStoreName;
    }
    
    public void setPlaceStoreName(String placeStoreName) {
        this.placeStoreName = placeStoreName;
    }

    public String getTakeStoreName() {
        return this.takeStoreName;
    }
    
    public void setTakeStoreName(String takeStoreName) {
        this.takeStoreName = takeStoreName;
    }

    public Date getPlaceDate() {
        return this.placeDate;
    }
    
    public void setPlaceDate(Date placeDate) {
        this.placeDate = placeDate;
    }

    public Date getTakeDate() {
        return this.takeDate;
    }
    
    public void setTakeDate(Date takeDate) {
        this.takeDate = takeDate;
    }


    public String getGreeting() {
        return this.greeting;
    }
    
    public void setGreeting(String greeting) {
        this.greeting = greeting;
    }

    public String getCustomerName() {
        return this.customerName;
    }
    
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerTel() {
        return this.customerTel;
    }
    
    public void setCustomerTel(String customerTel) {
        this.customerTel = customerTel;
    }

    public String getOperator() {
        return this.operator;
    }
    
    public void setOperator(String operator) {
        this.operator = operator;
    }

    public Boolean getHasPaid() {
        return this.hasPaid;
    }
    
    public void setHasPaid(Boolean hasPaid) {
        this.hasPaid = hasPaid;
    }

    public Long getDeposit() {
        return this.deposit;
    }
    
    public void setDeposit(Long deposit) {
        this.deposit = deposit;
    }

    public Boolean getPlain() {
        return this.plain;
    }
    
    public void setPlain(Boolean plain) {
        this.plain = plain;
    }

    public Boolean getGroup() {
        return this.group;
    }
    
    public void setGroup(Boolean group) {
        this.group = group;
    }

    public String getBfCode() {
        return this.bfCode;
    }
    
    public void setBfCode(String bfCode) {
        this.bfCode = bfCode;
    }

    public String getRequest() {
        return this.request;
    }
    
    public void setRequest(String request) {
        this.request = request;
    }

	@JSON(serialize=false)
	public Set<CakeOrderChange> getChanges() {
		return changes;
	}

	public void setChanges(Set<CakeOrderChange> changes) {
		this.changes = changes;
	}

	public Store getPlaceStore() {
		return placeStore;
	}

	public Store getTakeStore() {
		return takeStore;
	}

	public void setPlaceStore(Store placeStore) {
		this.placeStore = placeStore;
	}

	public void setTakeStore(Store takeStore) {
		this.takeStore = takeStore;
	}

	public Product getCake() {
		return cake;
	}

	public void setCake(Product cake) {
		this.cake = cake;
	}

	public int getSeq() {
		return seq;
	}

	public void setSeq(int seq) {
		this.seq = seq;
	}

	public String getPlaceStoreTel() {
		return placeStoreTel;
	}

	public void setPlaceStoreTel(String placeStoreTel) {
		this.placeStoreTel = placeStoreTel;
	}

	public String getZone() {
		return zone;
	}

	public void setZone(String zone) {
		this.zone = zone;
	}

	public Boolean getHasSend() {
		if(nhasSend==null)
			return false;
		else{
			return nhasSend>0?true:false;
		}
	}

	public Date getSendDate() {
		return sendDate;
	}

	public void setHasSend(Boolean hasSend) {
		if(hasSend==null)
			this.nhasSend =0;
		else{
			this.nhasSend=hasSend?1:0;
		}
	}

	public void setSendDate(Date sendDate) {
		this.sendDate = sendDate;
	}

	public Integer getNhasSend() {
		return nhasSend;
	}

	public void setNhasSend(Integer nhasSend) {
		this.nhasSend = nhasSend;
	}

	public String getTakeTime() {
		return takeTime;
	}

	public void setTakeTime(String takeTime) {
		this.takeTime = takeTime;
	}

	public String getCakeSize() {
		return cakeSize;
	}

	public void setCakeSize(String cakeSize) {
		this.cakeSize = cakeSize;
	}

	public String getCakeName() {
		return cakeName;
	}

	public void setCakeName(String cakeName) {
		this.cakeName = cakeName;
	}

	public String getSendMan() {
		return sendMan;
	}

	public String getSendRemark() {
		return sendRemark;
	}

	public void setSendMan(String sendMan) {
		this.sendMan = sendMan;
	}

	public void setSendRemark(String sendRemark) {
		this.sendRemark = sendRemark;
	}

	public Boolean getEditable() {
		return editable;
	}

	public void setEditable(Boolean editable) {
		this.editable = editable;
	}

	public String getOrglNo() {
		return orglNo;
	}

	public void setOrglNo(String orglNo) {
		this.orglNo = orglNo;
	}
	@JSON(serialize=false)
	public String getOwnerStoreName() {
		return ownerStoreName;
	}
	@JSON(serialize=false)
	public Store getOwnerStore() {
		return ownerStore;
	}

	public void setOwnerStoreName(String ownerStoreName) {
		this.ownerStoreName = ownerStoreName;
	}

	public void setOwnerStore(Store ownerStore) {
		this.ownerStore = ownerStore;
	}

	public Boolean getPrinted() {
		return printed;
	}

	public void setPrinted(Boolean printed) {
		this.printed = printed;
	}
   








}