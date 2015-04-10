package com.sp.common.util;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.io.FilenameUtils;

public class FileUtil {
	//转移文件
	public static void moveFile(String path,File file,int maxSize) throws Exception{
		
			File desDir=new File(FilenameUtils.getPath(path));
			if(!desDir.exists())
				desDir.mkdir();
	        FileOutputStream fos = new FileOutputStream(path);
	        FileInputStream fis = new FileInputStream(file);
	    try{
	        byte[] buffer = new byte[1024];
	        int len = 0,sum=0;
	        while((len = fis.read(buffer)) > 0){
	            fos.write(buffer, 0, len);
	            ++sum;
	            //if(sum>maxSize)
	            //	throw new EduException("上传文件不能超过"+(maxSize/1024)+"M");
	        }
		}catch(Exception e){
			throw e;
		}finally{
			fos.close();
			fis.close();
		}
	}
	
	public static boolean hasType(String [] types,String type){
		List<String> list=Arrays.asList(types);
		return list.contains(type.toLowerCase());
	}
	
	public static byte[] getBytes(File file)throws Exception{  
        byte[] buffer = null;  
        try {  
            FileInputStream fis = new FileInputStream(file);  
            ByteArrayOutputStream bos = new ByteArrayOutputStream(1000);  
            byte[] b = new byte[1000];  
            int n;  
            while ((n = fis.read(b)) != -1) {  
                bos.write(b, 0, n);  
            }  
            fis.close();  
            bos.close();  
            buffer = bos.toByteArray();  
        } catch (IOException e) {  
            throw e;
        }  
        return buffer;  
    }  
	
	public static List<File> listFiles(File dir,List<String> extensions){
		List<File> files=new ArrayList<File>();
		for(File file:dir.listFiles()){
			if(file.isDirectory()){
				files.addAll(listFiles(file,extensions));
			}else{
				if(extensions.contains(FilenameUtils.getExtension(file.getName()).toLowerCase()))
					files.add(file);
			}
		}
		return files;
	}
	public static List<File> listFiles(File dir){
		List<File> files=new ArrayList<File>();
		for(File file:dir.listFiles()){
			if(file.isDirectory()){
				files.addAll(listFiles(file));
			}else{
				files.add(file);
			}
		}
		return files;
	}
}
