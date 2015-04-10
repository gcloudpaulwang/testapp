package com.sp.core;

import java.io.Serializable;

import com.sp.common.hibernate3.BaseManagerImpl;

public class CoreManagerImpl<T extends Serializable> extends
		BaseManagerImpl<T> implements CoreManager<T> {
	
}
