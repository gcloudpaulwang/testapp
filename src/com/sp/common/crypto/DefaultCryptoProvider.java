package com.sp.common.crypto;

import java.util.zip.Adler32;

import com.google.common.primitives.Longs;
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
public class DefaultCryptoProvider implements CryptoProvider
{
	
	public static String  KEY_ALGORITHM         = "RSA";
	public static String  KEY_SIGNING_ALGORITHM = "SHA512WithRSA";
	public static int     KEY_SIZE              = 2048;//TODO:GRZE:RELEASE: configurable
	public static String  PROVIDER              = "BC";
	
	public DefaultCryptoProvider( )
	{
		
	}
	
	
	
	private String generateRandomAlphanumeric()
	{
		// length from generateRandomAlphanumeric is not constant due to
		// removal of punctuation characters
		return Hashes.getRandom( 64 ).replaceAll("\\p{Punct}", "");
	}
	
	private String generateRandomAlphanumeric(int length)
	{
		final StringBuilder randomBuilder = new StringBuilder( length + 90 );
		while( randomBuilder.length() < length ) {
			randomBuilder.append(generateRandomAlphanumeric() );
		}
		return randomBuilder.toString().substring( 0, length );
	}
	
	@Override
	public String generateQueryId()
	{
		return generateRandomAlphanumeric(21).toUpperCase();//NOTE: this MUST be 21-alnums upper case.
	}
	
	@Override
	public String generateSecretKey() {
		// TODO Auto-generated method stub
		return generateRandomAlphanumeric(40);//NOTE: this MUST be 40-chars from base64.
	}
	
	@Override
	public String generateId( final String seed, final String prefix )
	{
		Adler32 hash = new Adler32( );
		String key = seed;
		hash.update( key.getBytes( ) );
		
	    /**
	     * @see http://tools.ietf.org/html/rfc3309
	     */
		for ( int i = key.length( ); i < 128; i += 8 ) {
			hash.update( Longs.toByteArray( Double.doubleToRawLongBits( Math.random( ) ) ) );
		}
		String id = String.format( "%s-%08X", prefix, hash.getValue( ) );
		return id;
	}

}



