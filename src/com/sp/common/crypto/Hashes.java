package com.sp.common.crypto;

import java.security.SecureRandom;

import org.bouncycastle.util.encoders.UrlBase64;

/**
 * @Date        2013-04-25
 * 
 * @Author      chenhz@g-cloud.com.cn
 * 
 * @Copyright   2013 www.g-cloud.com.cn Inc. All rights reserved.
 *
 * @Description
 * 
 */
public class Hashes 
{
	
	public static String getRandom( int size )
	{
		SecureRandom random = new SecureRandom( );
	    byte[] randomBytes = new byte[size];
	    random.nextBytes( randomBytes );
	    return new String( UrlBase64.encode( randomBytes ) );
	}
	
}
