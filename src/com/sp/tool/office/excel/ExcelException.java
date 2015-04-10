package com.sp.tool.office.excel;

public class ExcelException extends Exception {
	  public ExcelException( ) {
		    super( "Edu Internal Error");
		  }

		  public ExcelException( String message ) {
		    super( message );
		  }

		  public ExcelException( Throwable ex ) {
		    super( ex.getMessage() != null ? ex.getMessage() : "Edu Internal Error." , ex );
		  }

		  public ExcelException( String message, Throwable ex ) {
		    super( message, ex );
		  }

}
