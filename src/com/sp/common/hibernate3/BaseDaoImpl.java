package com.sp.common.hibernate3;

import static org.hibernate.EntityMode.POJO;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.lang.StringUtils;
import org.hibernate.Criteria;
import org.hibernate.LockMode;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.criterion.Conjunction;
import org.hibernate.criterion.CriteriaSpecification;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Disjunction;
import org.hibernate.criterion.Example;
import org.hibernate.criterion.Expression;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projection;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.criterion.Example.PropertySelector;
import org.hibernate.impl.CriteriaImpl;
import org.hibernate.metadata.ClassMetadata;
import org.hibernate.transform.ResultTransformer;
import org.hibernate.type.Type;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

import com.sp.common.page.Pagination;
import com.sp.common.util.MyBeanUtils;

/**
 * DAO基类。
 * 
 * 提供hql分页查询，example分页查询，拷贝更新等功能。
 * 
 * @author liufang
 * 
 * @param <T>
 */
@Repository
public abstract class BaseDaoImpl<T extends Serializable> implements BaseDao<T> {
	protected Logger log = LoggerFactory.getLogger(getClass());

	protected SessionFactory sessionFactory;
	private static ThreadLocal<org.hibernate.Session> threadBoundSessions = new ThreadLocal<org.hibernate.Session>();
	@Autowired
	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	public Session getSession() {
		try {
			return sessionFactory.getCurrentSession();
		} catch (org.hibernate.HibernateException e) {
			if(threadBoundSessions.get()==null){
				Session se = sessionFactory.openSession();
				threadBoundSessions.set(se);
//				System.out.println("open a new session == "+se);
			}
			return threadBoundSessions.get();
		}
	}

	public void closeSession(){
		if(threadBoundSessions.get() != null){
//			System.out.println("close session=="+threadBoundSessions.get());
			threadBoundSessions.get().close();
			threadBoundSessions.remove();
		}
	}
	
	public T save(T entity) {
		Assert.notNull(entity);
		//Transaction tran=getSession().beginTransaction();
		getSession().save(entity);
		//tran.commit();
		return entity;
	}
	
	public T merge(T entity) {
		Assert.notNull(entity);
		return (T)getSession().merge(entity);
	}
	//paulwang 201208011 save batch
	public void saveBatch(List<T> entities,int batch) {
		Assert.notNull(entities);
		//Session session=getSession();
		//Transaction tran=session.beginTransaction();
		for(int i=0;i<entities.size();i++)
		{
			T entity=entities.get(i);
			this.saveOrUpdate(entity);
//			getSession().saveOrUpdate(entity);
//			if(i%batch==0){
//				session.flush(); 
//				session.clear();
//			}
		}
		
		//tran.commit();
		
	}
	public T update(T entity) {
		Assert.notNull(entity);
		//Transaction tran=getSession().beginTransaction();
		getSession().update(entity);
		//tran.commit();
		return entity;
	}

	public T saveOrUpdate(T entity) {
		Assert.notNull(entity);
		//Transaction tran=getSession().beginTransaction();
		getSession().saveOrUpdate(entity);
		//tran.commit();
		return entity;
	}

	public Object merge(Object entity) {
		Assert.notNull(entity);
		return getSession().merge(entity);
	}

	public void delete(Object entity) {
		Assert.notNull(entity);
		getSession().delete(entity);
	}

	public T deleteById(Serializable id) {
		Assert.notNull(id);
		T entity = load(id);
		getSession().delete(entity);
		return entity;
	}

	public T load(Serializable id) {
		Assert.notNull(id);
		return load(id, false);
	}

	@SuppressWarnings("unchecked")
	public T get(Serializable id) {
		Assert.notNull(id);
		return (T) getSession().get(getPersistentClass(), id);
	}

	@SuppressWarnings("unchecked")
	public T load(Serializable id, boolean lock) {
		Assert.notNull(id);
		T entity = null;
		if (lock) {
			entity = (T) getSession().load(getPersistentClass(), id,
					LockMode.UPGRADE);
		} else {
			entity = (T) getSession().load(getPersistentClass(), id);
		}
		return entity;
	}

	public List<T> findAll() {
		return findByCriteria();
	}
	@SuppressWarnings("unchecked")
	public List<T> findByArrayValue(String property, String[] array) {
		return getSession().createCriteria(persistentClass).add(Restrictions.in(property, array)).list();
	}
	@SuppressWarnings("unchecked")
	public List<T> findAll(OrderBy... orders) {
		Criteria crit = createCriteria();
		if (orders != null) {
			for (OrderBy order : orders) {
				crit.addOrder(order.getOrder());
			}
		}
		return crit.list();
	}

	public Pagination findAll(int pageNo, int pageSize, OrderBy... orders) {
		Criteria crit = createCriteria();
		return findByCriteria(crit, pageNo, pageSize, null, OrderBy
				.asOrders(orders));
	}

	/**
	 * 按HQL查询对象列表.
	 * 
	 * @param hql
	 *            hql语句
	 * @param values
	 *            数量可变的参数
	 */
	@SuppressWarnings("unchecked")
	protected List find(String hql, Object... values) {
		return createQuery(hql, values).list();
	}

	/**
	 * 按HQL查询唯一对象.
	 */
	protected T findUnique(String hql, Object... values) {
		return (T)createQuery(hql, values).uniqueResult();
	}

	/**
	 * 按属性查找对象列表.
	 */
	@SuppressWarnings("unchecked")
	public List<T> findByProperty(String property, Object value) {
		Assert.hasText(property);
		return createCriteria(Restrictions.eq(property, value)).list();
	}

	/**
	 * 按属性查找唯一对象.
	 */
	@SuppressWarnings("unchecked")
	public T findUniqueByProperty(String property, Object value) {
		Assert.hasText(property);
		Assert.notNull(value);
		return (T) createCriteria(Restrictions.eq(property, value))
				.uniqueResult();
	}

	public int countByProperty(String property, Object value) {
		Assert.hasText(property);
		Assert.notNull(value);
		return ((Number) (createCriteria(Restrictions.eq(property, value))
				.setProjection(Projections.rowCount()).uniqueResult()))
				.intValue();
	}

	@SuppressWarnings("unchecked")
	protected Pagination find(Finder finder, int pageNo, int pageSize) {
		int totalCount = countQueryResult(finder);
		Pagination p = new Pagination(pageNo, pageSize, totalCount);
		if (totalCount < 1) {
			p.setList(new ArrayList());
			return p;
		}
		Query query = getSession().createQuery(finder.getOrigHql());
		finder.setParamsToQuery(query);
		query.setFirstResult(p.getFirstResult());
		query.setMaxResults(p.getPageSize());
		List list = query.list();
		p.setList(list);
		return p;
	}

	@SuppressWarnings("unchecked")
	protected List find(Finder finder) {
		Query query = getSession().createQuery(finder.getOrigHql());
		finder.setParamsToQuery(query);
		query.setFirstResult(finder.getFirstResult());
		if (finder.getMaxResults() > 0) {
			query.setMaxResults(finder.getMaxResults());
		}
		List list = query.list();
		return list;
	}

	@SuppressWarnings("unchecked")
	public List<T> findByEgList(T eg, boolean anyWhere, Condition[] conds,
			String... exclude) {
		Criteria crit = getCritByEg(eg, anyWhere, conds, exclude);
		return crit.list();
	}

	@SuppressWarnings("unchecked")
	public List<T> findByEgList(T eg, boolean anyWhere, Condition[] conds,
			int firstResult, int maxResult, String... exclude) {
		Criteria crit = getCritByEg(eg, anyWhere, conds, exclude);
		crit.setFirstResult(firstResult);
		crit.setMaxResults(maxResult);
		return crit.list();
	}
	
	public Pagination findByEg(T eg, boolean anyWhere, Condition[] conds,
			int page, int pageSize, String... exclude) {
		Order[] orderArr = null;
		Condition[] condArr = null;
		if (conds != null && conds.length > 0) {
			List<Order> orderList = new ArrayList<Order>();
			List<Condition> condList = new ArrayList<Condition>();
			for (Condition c : conds) {
				if (c instanceof OrderBy) {
					orderList.add(((OrderBy) c).getOrder());
				} else {
					condList.add(c);
				}
			}
			orderArr = new Order[orderList.size()];
			condArr = new Condition[condList.size()];
			orderArr = orderList.toArray(orderArr);
			condArr = condList.toArray(condArr);
		}
		Criteria crit = getCritByEg(eg, anyWhere, condArr, exclude);
		return findByCriteria(crit, page, pageSize, null, orderArr);
	}
	public Pagination findByEgOr(T eg, boolean anyWhere,
			Condition[] conds, int page, int pageSize)
	{
		Order[] orderArr = null;
		Condition[] condArr = null;
		if (conds != null && conds.length > 0) {
			List<Order> orderList = new ArrayList<Order>();
			List<Condition> condList = new ArrayList<Condition>();
			for (Condition c : conds) {
				if (c instanceof OrderBy) {
					orderList.add(((OrderBy) c).getOrder());
				} else {
					condList.add(c);
				}
			}
			orderArr = new Order[orderList.size()];
			condArr = new Condition[condList.size()];
			orderArr = orderList.toArray(orderArr);
			condArr = condList.toArray(condArr);
		}
		Criteria crit = getCritByEgOr(eg, anyWhere, condArr);
		return findByCriteria(crit, page, pageSize, null, orderArr);
	}
	/**
	 * 根据查询函数与参数列表创建Query对象,后续可进行更多处理,辅助函数.
	 */
	protected Query createQuery(String queryString, Object... values) {
		Assert.hasText(queryString);
		Query queryObject = getSession().createQuery(queryString);
		if (values != null) {
			for (int i = 0; i < values.length; i++) {
				queryObject.setParameter(i, values[i]);
			}
		}
		return queryObject;
	}

	/**
	 * 按Criterion查询对象列表.
	 * 
	 * @param criterion
	 *            数量可变的Criterion.
	 */
	@SuppressWarnings("unchecked")
	protected List<T> findByCriteria(Criterion... criterion) {
		return createCriteria(criterion).list();
	}

	@SuppressWarnings("unchecked")
	protected Pagination findByCriteria(Criteria crit, int pageNo,
			int pageSize, Projection projection, Order... orders) {
		int totalCount = ((Number) crit.setProjection(Projections.rowCount())
				.uniqueResult()).intValue();
		Pagination p = new Pagination(pageNo, pageSize, totalCount);
		if (totalCount < 1) {
			p.setList(new ArrayList());
			return p;
		}
		crit.setProjection(projection);
		if (projection == null) {
			crit.setResultTransformer(Criteria.ROOT_ENTITY);
		}
		if (orders != null) {
			for (Order order : orders) {
				crit.addOrder(order);
			}
		}
		crit.setFirstResult(p.getFirstResult());
		crit.setMaxResults(p.getPageSize());
		p.setList(crit.list());
		return p;
	}

	public Pagination findByLike(Criteria crit,Map<String, String> condition,boolean anyWhere,
			int pageNo, int pageSize,OrderBy... orders){
		if(crit==null){
			crit = getSession().createCriteria(getPersistentClass());
		}
		Disjunction dj = Restrictions.disjunction();
		List<String> oFields=new ArrayList<String>();
		for(String key : condition.keySet()){
				if(StringUtils.isBlank(condition.get(key)))
					continue;
				String k = key.replaceFirst(".[0-9]$", "");
				String[] fields= k.split("\\.");
				if(fields.length==1){
					Field f;
					try{
						f= MyBeanUtils.getDeclaredField(getPersistentClass(), fields[0]);
					}catch(Exception e){
						continue;
					}
					
					Object o=convet(f, condition.get(key));
					if(o!=null){
						if(o.getClass()==String.class)
							dj.add(Restrictions.like(k,o.toString(),anyWhere?MatchMode.ANYWHERE:MatchMode.EXACT));
						else
							dj.add(Restrictions.like(k,o));
					}
				}else if(fields.length==2){
					Field f;
					try{
						f= MyBeanUtils.getDeclaredField(getPersistentClass(), fields[0]);
					}catch(Exception e){
						continue;
					}
					try{
						f= MyBeanUtils.getDeclaredField(f.getType(),fields[1]);
					}catch(Exception e){
						continue;
					}
					
					Object o=convet(f, condition.get(key));
					if(o!=null){
						if(o.getClass()==String.class)
							dj.add(Restrictions.like(k,o.toString(),anyWhere?MatchMode.ANYWHERE:MatchMode.EXACT));
						else
							dj.add(Restrictions.like(k,o));
						if(!oFields.contains(fields[0])){
							crit.createCriteria(fields[0],fields[0]);
						}
					}
				}
		}
		return findByCriteria(crit.add(dj), pageNo, pageSize, null, OrderBy.asOrders(orders));
	}
	
	private Object convet(Field f,String source){
		if(com.sp.common.util.StringUtils.isBlank(source))
			return null;
		source=source.replace("\\", "\\\\").replace("'", "\\\'")
        .replaceAll("_", "\\\\_").replaceAll("%", "\\\\%");
		try{
			if(f==null){
				return null;
			}else if(f.getType()== String.class){
				return source;
			}else if(f.getType()==Integer.class){
				return Integer.valueOf(source);
			}else if(f.getType() == Long.class){
				return Long.valueOf(source);
			}else if(f.getType() ==Double.class){
				return Double.valueOf(source);
			}else if(f.getType()==Boolean.class){
				return Boolean.valueOf(source);
			}else if(f.getType()==Float.class){
				return Float.valueOf(source);
			}else{
				return null;
			}
		}catch(Exception e){
			return null;
		}
	}
	
	/**
	 * 通过count查询获得本次查询所能获得的对象总数.
	 * 
	 * @param finder
	 * @return
	 */
	protected int countQueryResult(Finder finder) {
		Query query = getSession().createQuery(finder.getRowCountHql());
		finder.setParamsToQuery(query);
		return ((Number) query.iterate().next()).intValue();
	}

	/**
	 * 通过count查询获得本次查询所能获得的对象总数.
	 * 
	 * @return page对象中的totalCount属性将赋值.
	 */
	@SuppressWarnings("unchecked")
	protected int countQueryResult(Criteria c) {
		CriteriaImpl impl = (CriteriaImpl) c;
		// 先把Projection、ResultTransformer、OrderBy取出来,清空三者后再执行Count操作
		Projection projection = impl.getProjection();
		ResultTransformer transformer = impl.getResultTransformer();
		List<CriteriaImpl.OrderEntry> orderEntries = null;
		try {
			orderEntries = (List) MyBeanUtils.getFieldValue(impl,
					"orderEntries");
			MyBeanUtils.setFieldValue(impl, "orderEntries", new ArrayList());
		} catch (Exception e) {
			log.error("不可能抛出的异常:{}", e.getMessage());
		}
		// 执行Count查询
		int totalCount = (Integer) c.setProjection(Projections.rowCount())
				.uniqueResult();
		if (totalCount < 1) {
			return 0;
		}
		// 将之前的Projection和OrderBy条件重新设回去
		c.setProjection(projection);
		if (projection == null) {
			c.setResultTransformer(CriteriaSpecification.ROOT_ENTITY);
		}
		if (transformer != null) {
			c.setResultTransformer(transformer);
		}
		try {
			MyBeanUtils.setFieldValue(impl, "orderEntries", orderEntries);
		} catch (Exception e) {
			log.error("不可能抛出的异常:{}", e.getMessage());
		}
		return totalCount;
	}

	protected Criteria getCritByEg(T bean, boolean anyWhere, Condition[] conds,
			String... exclude) {
		Criteria crit = getSession().createCriteria(getPersistentClass());
		Example example = Example.create(bean);
		example.setPropertySelector(NOT_BLANK);
		if (anyWhere) {
			example.enableLike(MatchMode.ANYWHERE);
			example.ignoreCase();
		}
		if(exclude!=null){
		for (String p : exclude) {
			example.excludeProperty(p);
		}
		}
		crit.add(example);
		// 处理排序和is null字段
		if (conds != null) {
			for (Condition o : conds) {
				if (o instanceof OrderBy) {
					OrderBy order = (OrderBy) o;
					crit.addOrder(order.getOrder());
				} else if (o instanceof Nullable) {
					Nullable isNull = (Nullable) o;
					if (isNull.isNull()) {
						crit.add(Restrictions.isNull(isNull.getField()));
					} else {
						crit.add(Restrictions.isNotNull(isNull.getField()));
					}
				} else {
					// never
				}
			}
		}
		// 处理many to one查询
		ClassMetadata cm = getCmd(bean.getClass());
		String[] fieldNames = cm.getPropertyNames();
		for (String field : fieldNames) {
			Object o = cm.getPropertyValue(bean, field, POJO);
			if (o == null) {
				continue;
			}
			ClassMetadata subCm = getCmd(o.getClass());
			if (subCm == null) {
				continue;
			}
			Serializable id = subCm.getIdentifier(o, POJO);
			if (id != null) {
				Serializable idName = subCm.getIdentifierPropertyName();
				crit.add(Restrictions.eq(field + "." + idName, id));
			} else {
				crit.createCriteria(field).add(Example.create(o));
			}
		}
		return crit;
	}
	protected Criteria getCritByEgOr(T bean, boolean anyWhere, Condition[] conds) {
		Criteria crit = getSession().createCriteria(getPersistentClass());
//		Example example = Example.create(bean);
//		example.setPropertySelector(NOT_BLANK);
//		if (anyWhere) {
//			example.enableLike(MatchMode.ANYWHERE);
//			example.ignoreCase();
//		}
//		crit.add(example);
		Class c=bean.getClass();
		Disjunction ors=Restrictions.disjunction();
		Conjunction ands=Restrictions.conjunction();
		String andFields="";
		try {
			Method andM=c.getMethod("getAndFields");//查询类必须有这个方法，多个字段以分号分隔
			Object val=andM.invoke(bean);
			andFields=val!=null?val.toString():"";
		} catch (Exception e1) {
			// TODO Auto-generated catch block
			//e1.printStackTrace();
		}
		for(Field item:c.getDeclaredFields())
		{
			if(item.getName().equals("andFields")) continue;
			String getStr="get"+item.getName().substring(0,1).toUpperCase()+item.getName().substring(1,item.getName().length());
			try {
				Method GetM=c.getDeclaredMethod(getStr);
				Object obj=GetM.invoke(bean);
				if(obj!=null)
				{
					if(item.getType().equals(String.class))
					{
						String str=obj.toString();
						if(andFields.indexOf(item.getName())>-1)
						{
							ands.add(Restrictions.like(item.getName(), "%"+str+"%"));
						}
						else if(!str.trim().equals(""))
						{
							if(str.indexOf("||")>-1)
							{
								String[] tmp=str.split("\\|\\|");
								for(String t:tmp)
									ors.add(Restrictions.like(item.getName(), "%"+t+"%"));
							}
							else
								ors.add(Restrictions.like(item.getName(), "%"+str+"%"));
						}
					}
					else if(item.getType().equals(Date.class))
					{
						Date d=(Date) obj;
						Date bt=new Date(d.getYear(),d.getMonth(),d.getDate());
						Date et=new Date(d.getYear(),d.getMonth(),d.getDate(),23,59,59);
						if(andFields.indexOf(item.getName())>-1)
						{
							ands.add(Restrictions.between(item.getName(), bt, et));
						}
						else
							ors.add(Restrictions.between(item.getName(), bt, et));
					}
				}
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		}
		crit.add(ands.add(ors));
		// 处理排序和is null字段
		if (conds != null) {
			for (Condition o : conds) {
				if (o instanceof OrderBy) {
					OrderBy order = (OrderBy) o;
					crit.addOrder(order.getOrder());
				} else if (o instanceof Nullable) {
					Nullable isNull = (Nullable) o;
					if (isNull.isNull()) {
						crit.add(Restrictions.isNull(isNull.getField()));
					} else {
						crit.add(Restrictions.isNotNull(isNull.getField()));
					}
				} else {
					// never
				}
			}
		}
		// 处理many to one查询
		ClassMetadata cm = getCmd(bean.getClass());
		String[] fieldNames = cm.getPropertyNames();
		for (String field : fieldNames) {
			Object o = cm.getPropertyValue(bean, field, POJO);
			if (o == null) {
				continue;
			}
			ClassMetadata subCm = getCmd(o.getClass());
			if (subCm == null) {
				continue;
			}
			Serializable id = subCm.getIdentifier(o, POJO);
			if (id != null) {
				Serializable idName = subCm.getIdentifierPropertyName();
				crit.add(Restrictions.eq(field + "." + idName, id));
			} else {
				crit.createCriteria(field).add(Example.create(o));
			}
		}
		return crit;
	}
	public void refresh(Object entity) {
		getSession().refresh(entity);
	}

	public Object updateDefault(Object entity) {
		return updateByUpdater(Updater.create(entity));
	}

	public Object updateByUpdater(Updater updater) {
		ClassMetadata cm = getCmd(updater.getBean().getClass());
		if (cm == null) {
			throw new RuntimeException("所更新的对象没有映射或不是实体对象");
		}
		Object bean = updater.getBean();
		Object po = getSession().load(bean.getClass(),
				cm.getIdentifier(bean, POJO));
		updaterCopyToPersistentObject(updater, po);
		return po;
	}

	/**
	 * 将更新对象拷贝至实体对象，并处理many-to-one的更新。
	 * 
	 * @param updater
	 * @param po
	 */
	@SuppressWarnings("unchecked")
	private void updaterCopyToPersistentObject(Updater updater, Object po) {
		Map map = MyBeanUtils.describe(updater.getBean());
		Set<Map.Entry<String, Object>> set = map.entrySet();
		for (Map.Entry<String, Object> entry : set) {
			String name = entry.getKey();
			Object value = entry.getValue();
			if (!updater.isUpdate(name, value)) {
				continue;
			}
			if (value != null) {
				Class valueClass = value.getClass();
				ClassMetadata cm = getCmd(valueClass);
				if (cm != null) {
					Serializable vid = cm.getIdentifier(value, POJO);
					// 如果更新的many to one的对象的id为空，则将many to one设置为null。
					if (vid != null) {
						value = getSession().load(valueClass, vid);
					} else {
						value = null;
					}
				}
			}
			try {
				PropertyUtils.setProperty(po, name, value);
			} catch (Exception e) {
				// never
				log.warn("更新对象时，拷贝属性异常", e);
			}
		}
	}

	/**
	 * 根据Criterion条件创建Criteria,后续可进行更多处理,辅助函数.
	 */
	public Criteria createCriteria(Criterion... criterions) {
		Criteria criteria = getSession().createCriteria(getPersistentClass());
		for (Criterion c : criterions) {
			criteria.add(c);
		}
		return criteria;
	}

	private Class<T> persistentClass;

	@SuppressWarnings("unchecked")
	public BaseDaoImpl() {
		this.persistentClass = (Class<T>) ((ParameterizedType) getClass()
				.getGenericSuperclass()).getActualTypeArguments()[0];
	}

	public Class<T> getPersistentClass() {
		return persistentClass;
	}

	public T createNewEntiey() {
		try {
			return getPersistentClass().newInstance();
		} catch (Exception e) {
			throw new RuntimeException("不能创建实体对象："
					+ getPersistentClass().getName());
		}
	}

	@SuppressWarnings("unchecked")
	private ClassMetadata getCmd(Class clazz) {
		return (ClassMetadata) sessionFactory.getClassMetadata(clazz);
	}

	public static final NotBlankPropertySelector NOT_BLANK = new NotBlankPropertySelector();

	/**
	 * 不为空的EXAMPLE属性选择方式
	 * 
	 * @author liufang
	 * 
	 */
	static final class NotBlankPropertySelector implements PropertySelector {
		private static final long serialVersionUID = 1L;

		public boolean include(Object object, String property, Type type) {
			return object != null
					&& !(object instanceof String && StringUtils
							.isBlank((String) object));
		}
	}
	
	
	public SQLQuery createSqlQuery(String queryString, Object... values) {
		Assert.hasText(queryString);
		SQLQuery queryObject = getSession().createSQLQuery(queryString);
		if (values != null) {
			for (int i = 0; i < values.length; i++) {
				queryObject.setParameter(i, values[i]);
			}
		}
		return queryObject;
	}
}
