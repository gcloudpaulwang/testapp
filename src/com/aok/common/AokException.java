package com.aok.common;

public class AokException extends Exception {
	public AokException( ) {
	    super( "Aok Internal Error");
	  }

	  public AokException( String message ) {
	    super( message );
	  }

	  public AokException( Throwable ex ) {
	    super( ex.getMessage() != null ? ex.getMessage() : "Aok Internal Error." , ex );
	  }

	  public AokException( String message, Throwable ex ) {
	    super( message, ex );
	  }
}
