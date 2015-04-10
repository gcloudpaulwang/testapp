package com.aok.order.mng.impl;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.Criteria;
import org.hibernate.criterion.Disjunction;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import sun.security.mscapi.PRNG;

import com.aok.base.mng.StoreMng;
import com.aok.common.AokProperties;
import com.aok.entity.CakeOrder;
import com.aok.entity.Store;
import com.aok.order.dao.CakeOrderDao;
import com.aok.order.mng.CakeOrderMng;
import com.aok.order.model.OrderQueryParam;
import com.aok.production.model.CakeStatistics;
import com.aok.shipment.model.ShipmentSummary;
import com.aok.user.entity.ERole;
import com.sp.common.hibernate3.BaseManagerImpl;
import com.sp.common.hibernate3.OrderBy;
import com.sp.common.page.Pagination;
import com.sp.common.util.StringUtils;
import com.sp.core.web.AppContext;
import com.sp.user.entity.User;
@Transactional
@Service("CakeOrder")
public class CakeOrderMngImpl extends BaseManagerImpl<CakeOrder> implements CakeOrderMng{
	@Autowired
	private StoreMng storeMng;
	private AokProperties aokProperties;
	@Override
	public Pagination query(OrderQueryParam qaram,int pageNo,int pageSize,OrderBy... orders) {
		// TODO Auto-generated method stub
		Criteria crit =getDao().createCriteria();
		switch (qaram.getUser().getERole()) {
			case factroy:
				String fId=qaram.getUser().getAokUser().getFactory().getId();
				List<String> sIds=storeMng.listStoreIdByFactory(fId);
				if(sIds.size()>0){
					Disjunction dj = Restrictions.disjunction();
					dj.add(Restrictions.in("placeStore.id",sIds));
					dj.add(Restrictions.in("takeStore.id",sIds));
					crit.add(dj);
				}
				break;
			case store:
				Disjunction dj = Restrictions.disjunction();
				dj.add(Restrictions.eq("placeStore.id",qaram.getUser().getAokUser().getStore().getId()));
				dj.add(Restrictions.eq("takeStore.id",qaram.getUser().getAokUser().getStore().getId()));
				crit.add(dj);
				break;
		}
		if(!StringUtils.isBlank(qaram.getPlaceStoreId())){
			crit.add(Restrictions.eq("placeStore.id", qaram.getPlaceStoreId()));
		}
		if(!StringUtils.isBlank(qaram.getTakeStoreId())){
			crit.add(Restrictions.eq("takeStore.id", qaram.getTakeStoreId()));
		}
		if(!StringUtils.isBlank(qaram.getCakeId())){
			crit.add(Restrictions.eq("cake.id", qaram.getCakeId()));
		}
		if(!StringUtils.isBlank(qaram.getZone())){
			crit.add(Restrictions.eq("zone", qaram.getZone()));
		}
		if(!StringUtils.isBlank(qaram.getTakeTime())){
			crit.add(Restrictions.eq("takeTime",qaram.getTakeTime()));
		}
		if(qaram.getHasSend()!=null){
			if(qaram.getHasSend()==true)
				crit.add(Restrictions.eq("nhasSend", 1));
			else
				crit.add(Restrictions.ne("nhasSend", 1));
		}
		if(qaram.getTakeDate()!=null){
			crit.add(Restrictions.eq("takeDate",qaram.getTakeDate()));
		}
		Map<String,String> condition=new HashMap<String, String>();
		condition.put("id",qaram.getOid());
		return getDao().findByLike(crit, condition, true, pageNo, pageSize, orders);
	}
	@Override
	public Pagination listShipmentSummary(User u,Date takeDate,int pageNo,int pageSize) {
		// TODO Auto-generated method stub
		//return getDao().listShipmentSummary(takeDate,pageNo,pageSize);
		if(u.getERole()==ERole.admin)
			return getDao().listShipmentSummary( takeDate, pageNo, pageSize);
		else if(u.getERole()==ERole.factroy)
			return getDao().listShipmentSummary(u.getAokUser().getFactory().getId(), takeDate, pageNo, pageSize);
		return null;
	}
	
	public int countOrglNo(String orglNo){
		return this.getDao().countByProperty("orglNo", orglNo);
	}
	@Override
	public List<CakeStatistics> statistics(List<String> storeList,Date starttime,Date endtime)
	{
		return getDao().statistics(storeList,starttime,endtime);
	}
	
	@Override
	public Pagination statistics(List<String> storeList,Date starttime,Date endtime,int pageNo,int pageSize)
	{
		return getDao().statistics(storeList, starttime,endtime,pageNo, pageSize);
	}
	
	@Override
	public List<CakeStatistics> finance(List<String> storeList , String zone,Date startTime,Date endTime)
	{
		return getDao().finance(storeList, zone, startTime, endTime);
	}
	
	@Override
	public Pagination finance(List<String> storeList , String zone,Date startTime,Date endTime,int pageNo,int pageSize)
	{
		return getDao().finance(storeList, zone, startTime, endTime, pageNo, pageSize);
	}
	
	public AokProperties getAokProperties() {
		return aokProperties;
	}

	@Autowired
	public void setPortalProperties(AokProperties aokProperties) {
		this.aokProperties = aokProperties;
	}
	public CakeOrderDao getDao(){
		return (CakeOrderDao)super.getDao();
	}
	@Autowired
	public void setDao(CakeOrderDao dao){
		super.setDao(dao);
	}
	public int getMaxSeq(){
		return getDao().getMaxSeq();
	}
	@Override
	public List<CakeOrder> findByIds(List<String> ids) {
		// TODO Auto-generated method stub
		return getDao().findByIds(ids);
	}
	@Override
	public List<CakeOrder> findEditble(String flag) {
		// TODO Auto-generated method stub
		Date now =new Date();
		Date today=StringUtils.str2Date(StringUtils.formatDate(now),"yyyy-MM-dd");
		if(flag.equals("first")){
			return getDao().findEditble(today,null);
		}else if(flag.equals("deadline")){
			return getDao().findEditble(today,aokProperties.getFirst());
		}
		return null;
		
	}
	
	public void print(List<CakeOrder> orders){
		Thread t=new PrintThread(orders);
		t.start();
	}
	class PrintThread extends Thread{
		private List<CakeOrder> orders;
		public PrintThread(List<CakeOrder> orders) {
			// TODO Auto-generated constructor stub
			this.orders=orders;
		}
		private CakeOrderMng orderMng=(CakeOrderMng) AppContext.getCtx().getBean("CakeOrder");
		@Override
		public void run() {
			// TODO Auto-generated method stub
			for(CakeOrder order:orders){
				try{
					order.setPrinted(true);
					orderMng.update(order);
				}catch(Exception e){
					
				}
			}
		}
	}
	
}
