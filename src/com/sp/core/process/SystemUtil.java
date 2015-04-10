package com.sp.core.process;

import com.sp.core.MyException;




public class SystemUtil {
	public static String run(String[] command) throws MyException {
		try
		{
			String commandString = "";
			for(String part : command) {
				commandString += part + " ";
			}
			System.out.println("Running command: " + commandString);
			Runtime rt = Runtime.getRuntime();
			Process proc = rt.exec(command);
			StreamConsumer error = new StreamConsumer(proc.getErrorStream());
			StreamConsumer output = new StreamConsumer(proc.getInputStream());
			error.start();
			output.start();
			int returnValue = proc.waitFor();
			output.join();
			if(returnValue != 0)
				return commandString + " error: " + error.getReturnValue();
				//throw new ConfigException(commandString + " error: " + error.getReturnValue());
			return output.getReturnValue();
		} catch (Throwable t) {
			t.printStackTrace();
		}
		return "";
	}
	//运行两条指令
	public static String run(String[]command1,String[] command2) throws MyException {
		try{
			Runtime rt = Runtime.getRuntime();
			Process proc1 = rt.exec(command1);
			Process proc2 = rt.exec(command2);
			java.io.InputStream in = Piper.pipe(proc1,proc2);
			java.io.BufferedReader r = new java.io.BufferedReader(new java.io.InputStreamReader(in));
			StringBuffer sb=new StringBuffer();
			String s="";
			while ((s = r.readLine()) != null) {
				 sb.append(s).append("\r\n");
		        }
			return sb.toString();
		} catch (Throwable t) {
			t.printStackTrace();
		}
		return "";
	}
	
	public static String runWithoutWait(String[] command)throws MyException{
		try
		{
			String commandString = "";
			for(String part : command) {
				commandString += part + " ";
			}
			System.out.println("Running command: " + commandString);
			Runtime rt = Runtime.getRuntime();
			Process proc = rt.exec(command);
			StreamConsumer error = new StreamConsumer(proc.getErrorStream());
			StreamConsumer output = new StreamConsumer(proc.getInputStream());
			error.start();
			output.start();
			output.join();
			return output.getReturnValue();
		} catch (Throwable t) {
			t.printStackTrace();
		}
		return "";
	}

	public static int runAndGetCode(String[] command) throws MyException {
		try
		{
			String commandString = "";
			for(String part : command) {
				commandString += part + " ";
			}
			System.out.println("Running command: " + commandString);
			Runtime rt = Runtime.getRuntime();
			Process proc = rt.exec(command);
			StreamConsumer error = new StreamConsumer(proc.getErrorStream());
			StreamConsumer output = new StreamConsumer(proc.getInputStream());
			error.start();
			output.start();
			int returnValue = proc.waitFor();
			return returnValue;
		} catch (Throwable t) {
			System.out.println(t.getMessage());
			return 0;
		}
	}

	public static void shutdownWithError(String errorMessage) {
		//LOG.fatal(errorMessage);
		System.exit(0xEC2);
	}        
}
