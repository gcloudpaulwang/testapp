﻿package com.sp.common.hibernate3;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import org.hibernate.Criteria;
import org.hibernate.criterion.Criterion;


import com.sp.common.page.Pagination;


public interface BaseDao<T extends Serializable> {
	
	/**
	 * 通过ID查找对象
	 * 
	 * @param id
	 *            记录的ID
	 * @param lock
	 *            是否锁定对象
	 * @return 实体对象
	 */
	public T load(Serializable id, boolean lock);

	public T get(Serializable id);

	/**
	 * 通过ID查找对象,不锁定对象
	 * 
	 * @param id
	 *            记录的ID
	 * @return 实体对象
	 */
	public T load(Serializable id);

	/**
	 * 查找所有对象
	 * 
	 * @return 对象列表
	 */
	public List<T> findAll();
	/**
	 * 
	 * @param property   属性名称
	 * @param array   多项匹配值的字符串数组
	 * @return
	 */
	public List<T> findByArrayValue(String property, String[] array);

	public List<T> findAll(OrderBy... orders);

	public Pagination findAll(int pageNo, int pageSize, OrderBy... orders);

	/**
	 * 通过示例对象查找对象列表
	 * 
	 * @param eg
	 *            示例对象
	 * @param anyWhere
	 *            是否模糊查询，默认false。
	 * @param conds
	 *            排序和is null的字段。分别为OrderBy和String。
	 * @param exclude
	 *            需要排除的属性
	 * @return 对象列表
	 */
	public List<T> findByEgList(T eg, boolean anyWhere, Condition[] conds,
			String... exclude);

	public List<T> findByEgList(T eg, boolean anyWhere, Condition[] conds,
			int firstResult, int maxResult, String... exclude);

	public Pagination findByEg(T exampleInstance, boolean anyWhere,
			Condition[] conds, int pageNo, int pageSize, String... exclude);
	/*
	 * bean的字段之间为or连接
	 */
	public Pagination findByEgOr(T exampleInstance, boolean anyWhere,
			Condition[] conds, int pageNo, int pageSize);
	/**
	 * 按属性查找对象列表.
	 */
	public List<T> findByProperty(String property, Object value);

	/**
	 * 按属性查找唯一对象.
	 */
	public T findUniqueByProperty(String property, Object value);

	Pagination findByLike(Criteria crit,Map<String, String> condition,boolean anyWhere,
			int pageNo, int pageSize,OrderBy... orders);
	
	/**
	 * 按属性查找对象的数量
	 * 
	 * @param property
	 * @param value
	 * @return
	 */
	public int countByProperty(String property, Object value);

	/**
	 * 根据Updater更新对象
	 * 
	 * @param updater
	 * @return 持久化对象
	 */
	public Object updateByUpdater(Updater updater);

	public Object updateDefault(Object entity);

	/**
	 * 保存对象
	 * 
	 * @param entity
	 *            实体对象
	 * @return 实体对象
	 */
	public T save(T entity);
	public T merge(T entity);

	public void saveBatch(List<T> entities,int batch);
	/**
	 * 更新对象
	 * 
	 * @param entity
	 *            实体对象
	 * @return 实体对象
	 */
	public T update(T entity);

	/**
	 * 保存或更新对象
	 * 
	 * @param entity
	 *            实体对象
	 * @return 实体对象
	 */
	public T saveOrUpdate(T entity);

	/**
	 * 保存或更新对象拷贝
	 * 
	 * @param entity
	 * @return 已更新的持久化对象
	 */
	public Object merge(Object entity);

	/**
	 * 删除对象
	 * 
	 * @param entity
	 *            实体对象
	 */
	public void delete(Object entity);

	/**
	 * 根据ID删除记录
	 * 
	 * @param id
	 *            记录ID
	 */
	public T deleteById(Serializable id);

	/**
	 * 刷新对象
	 * 
	 * @param entity
	 */
	public void refresh(Object entity);

	/**
	 * 获得实体Class
	 * 
	 * @return
	 */
	public Class<T> getPersistentClass();

	/**
	 * 创建实体类的对象
	 * 
	 * @return
	 */
	public T createNewEntiey();
	
	public Criteria createCriteria(Criterion... criterions);
}
