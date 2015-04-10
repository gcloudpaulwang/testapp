package com.sp.common.util;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

public class HttpUtil {
	public static void post(String urlStr){
		URL url;
		try {
			url = new URL(urlStr);
			url.openConnection();
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			System.out.println(e.getMessage());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			System.out.println(e.getMessage());
		}
	}
}
