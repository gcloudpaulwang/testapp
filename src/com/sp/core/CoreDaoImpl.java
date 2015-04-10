package com.sp.core;

import java.io.Serializable;

import com.sp.common.hibernate3.BaseDaoImpl;

public class CoreDaoImpl<T extends Serializable> extends BaseDaoImpl<T>
		implements CoreDao<T> {
	
}
