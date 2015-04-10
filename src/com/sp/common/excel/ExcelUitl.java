package com.sp.common.excel;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import net.sf.excelutils.ExcelException;
import net.sf.excelutils.ExcelUtils;
import org.apache.struts2.ServletActionContext;

import com.sp.common.util.StringUtils;



public class ExcelUitl {
	 public static String handleExportExcel(Map<String , Object> val ,String xls) {	
		 	  for(String key:val.keySet())
		 	  {
		 		 ExcelUtils.addValue(key, val.get(key));
		 	  }
			  
//			  ExcelUtils.addValue("list", list);
			  HttpServletResponse response =ServletActionContext.getResponse();
			  HttpServletRequest request = ServletActionContext.getRequest();
//			  try {
//				response.getOutputStream().write(1);
//			} catch (IOException e1) {
//				// TODO Auto-generated catch block
//				e1.printStackTrace();
//			}
//			  String config = "\\WEB-INF\\xls\\example1.xls";
//			  String path = "E:\\example1.xls";
			  response.reset();
			  response.setContentType("application/vnd.ms-excel");
			  Date now = new Date();			  
			  response.setHeader("Content-Disposition", "attachment; filename=\"" + StringUtils.formatDate(now) + ".xls\"");
			  try {
//				  ExcelUtils.export( path,
//						     response.getOutputStream());
			   ExcelUtils.export(request.getSession().getServletContext(), xls,
			     response.getOutputStream());
			  } catch (ExcelException e) {
			   e.printStackTrace();
			  } catch (IOException e) {
			   e.printStackTrace();
			  }
			  catch(IllegalStateException e){
				  e.printStackTrace();
			  }

			  return null;
			 
	   }
	 
	 public static String handleExportExcel(Map<String , Object> val ,String xls, String fileName) {
		 Date now = new Date();			
		 String afileName = StringUtils.formatDate(now);
			try {
//				afileName = URLEncoder.encode(fileName, "utf-8");
				afileName = new String( fileName.getBytes("gb2312"), "ISO8859-1" );
			} catch (UnsupportedEncodingException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
	 	  for(String key:val.keySet())
	 	  {
	 		 ExcelUtils.addValue(key, val.get(key));
	 	  }
		  
//		  ExcelUtils.addValue("list", list);
		  HttpServletResponse response =ServletActionContext.getResponse();
		  HttpServletRequest request = ServletActionContext.getRequest();
//		  try {
//			response.getOutputStream().write(1);
//		} catch (IOException e1) {
//			// TODO Auto-generated catch block
//			e1.printStackTrace();
//		}
//		  String config = "\\WEB-INF\\xls\\example1.xls";
//		  String path = "E:\\example1.xls";
		  response.reset();
		  response.setContentType("application/vnd.ms-excel");			  
		  response.setHeader("Content-Disposition", "attachment; filename=\"" + afileName + ".xls\"");
		  try {
//			  ExcelUtils.export( path,
//					     response.getOutputStream());
		   ExcelUtils.export(request.getSession().getServletContext(), xls,
		     response.getOutputStream());
		  } catch (ExcelException e) {
		   e.printStackTrace();
		  } catch (IOException e) {
		   e.printStackTrace();
		  }
		  catch(IllegalStateException e){
			  e.printStackTrace();
		  }

		  return null;
		 
  }
	 
}
