package com.sp.common.util;

public class SPException extends Exception {
	public SPException( ) {
	    super( "Edu Internal Error");
	  }

	  public SPException( String message ) {
	    super( message );
	  }

	  public SPException( Throwable ex ) {
	    super( ex.getMessage() != null ? ex.getMessage() : "Express Internal Error." , ex );
	  }

	  public SPException( String message, Throwable ex ) {
	    super( message, ex );
	  }
}
