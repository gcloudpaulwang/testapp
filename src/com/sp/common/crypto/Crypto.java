package com.sp.common.crypto;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/**
 * @Date        2013-04-25
 * 
 * @Author      chenhz@g-cloud.com.cn
 * 
 * @Copyright   2013 www.g-cloud.com.cn Inc. All rights reserved.
 *
 * @Description Facade for helpers and a set of generator methods providing non-trivial random tokens.
 *             
 */
public class Crypto
{
	
	private static BaseSecurityProvider DUMMY = new BaseSecurityProvider( ) {};
	private static ConcurrentMap<Class, BaseSecurityProvider> providers = new ConcurrentHashMap<Class, BaseSecurityProvider>( );
	
//	static {
//		BaseSecurityProvider provider;
//		try {
//			Class provClass = ClassLoader.getSystemClassLoader().loadClass( "com.gcloud.gtc.common.DefaultCryptoProvider" );
//			provider = ( BaseSecurityProvider ) provClass.newInstance( );
//		} catch ( Exception t ) {
//			provider = DUMMY;
//		}
//		providers.put( CryptoProvider.class, provider );
//	}
	
	
	public static String generateQueryId()
	{
		return Crypto.getCryptoProvider().generateQueryId();
	}
	
	/*
	 *  generate id with resource prefix
	 *  using queryId as a seed
	 */
	public static String generateResourceId( final String prefix )
	{
		String seed = generateQueryId();
		return generateId( seed, prefix ).toLowerCase();
	}
	
	public static String generateInstanceId( final String prefix )
	{
		String seed = generateQueryId();
		String result = generateId( seed, prefix ).toUpperCase();
		return result.replaceFirst(prefix.toUpperCase(), prefix);
	}
	
	public static String generateMacAddress()
	{
		String prefix = "";
		String seed = generateQueryId();
		String tmp = generateId( seed, prefix );
		String res = tmp.substring(1, tmp.length());
		seed = generateQueryId();
		tmp = generateId( seed, prefix );
		res += tmp.substring(1, tmp.length() - 4);
		res = res.toLowerCase();
		String result = "";
		for( int i = 0; i < res.length(); i += 2 ) {
			if( i != 0 ) {
				result += ":";
			}
			if( i == 0 ) {
				result += "d0";
			}
			else if( i == 1 ) {
				result += "0d";
			}
			else {
				result += res.substring(i, i+2);
			}
		}
		return result;
	}
	
	public static String generateId( final String seed, final String prefix )
	{
		return Crypto.getCryptoProvider( ).generateId( seed, prefix );
	}
	
	public static CryptoProvider getCryptoProvider( )
	{
//		return (CryptoProvider) providers.get( CryptoProvider.class );
		return new DefaultCryptoProvider();
	}
	
	public static void main(String[] args){
		System.out.println(generateInstanceId("D"));
	}

}




