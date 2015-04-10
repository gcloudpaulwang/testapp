package com.sp.tool.office.excel.export;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;

import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;

 /**
 * @Date 2013-10-25
 *
 * @Author dengxm@g-cloud.com.cn
 *
 * @Copyright 2013 www.g-cloud.com.cn Inc. All rights reserved.
 *
 * @Description 
 */

public class ReportUtil {
	 public static void downLocalFile(File f,String filename){
	        HttpServletResponse response =ServletActionContext.getResponse();
	        String dn=null;
	        try {
				dn=new String(filename.getBytes(), "ISO8859-1");
			} catch (UnsupportedEncodingException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			} 
	        response.addHeader("Content-Disposition",
	                "attachment;filename=" + (dn==null?filename:dn));
	        OutputStream outp = null;
	        FileInputStream in = null;
	        try {
	            outp =response.getOutputStream();
	            in = new FileInputStream(f);

	            byte[] b = new byte[1024];
	            int i = 0;

	            while ((i = in.read(b)) > 0) {
	                outp.write(b, 0, i);
	            }
	            outp.flush();
	        } catch (Exception e) {
	            e.printStackTrace();
	        } finally {
	            if (in != null) {
	                try {
	                    in.close();
	                    in = null;
	                } catch (IOException e) {
	                    e.printStackTrace();
	                }
	            }
	            if (outp != null) {
	                try {
	                    outp.close();
	                    outp = null;
	                } catch (IOException e) {
	                    e.printStackTrace();
	                }
	            }
	            f.delete();
	        }
	    } 
}
