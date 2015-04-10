package com.aok.common;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CommonUtils {
	public static String[] splitCakeName(String cake){
		Pattern pattern = Pattern.compile("([\u4E00-\u9FA5]+)(\\d{1,2}吋)");
		Matcher matcher = pattern.matcher(cake);
		String[] strs=new String[2];
		if(matcher.find()){
			strs[0]=matcher.group(1);
			strs[1]=matcher.group(2);
			return strs;
		}
		strs[0]=cake;
		strs[1]="";
		return strs;
	}
	public static void main(String[] args){
		System.out.println("dd");
		splitCakeName("芒千9吋");
	}
}
