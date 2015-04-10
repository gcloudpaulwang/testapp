package com.aok.common.mng;

import java.util.Date;

import com.sp.common.util.SPException;

public interface CommonMng {
	void checkTakeDate(Date takeDate,String time) throws SPException;
}
