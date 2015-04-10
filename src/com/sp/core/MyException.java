package com.sp.core;

public class MyException extends Exception {
	  public MyException( ) {
		    super( "Order System Internal Error");
		  }

		  public MyException( String message ) {
		    super( message );
		  }

		  public MyException( Throwable ex ) {
		    super( ex.getMessage() != null ? ex.getMessage() : "Order System Internal Error." , ex );
		  }

		  public MyException( String message, Throwable ex ) {
		    super( message, ex );
		  }

}
