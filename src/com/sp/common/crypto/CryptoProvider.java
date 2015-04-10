package com.sp.common.crypto;
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
public interface CryptoProvider extends BaseSecurityProvider
{
	
	String generateId( String seed, String prefix );
	String generateQueryId();
    String generateSecretKey();
//  String generateHashedPassword( String password );
//  String generateSessionToken();


//	String getDigestBase64( String input, Digest hash );
//	String getFingerPrint( byte[] data );
//	String generateLinuxSaltedPassword( String password );
//	boolean verifyLinuxSaltedPassword( String clear, String hashed );
	  
}