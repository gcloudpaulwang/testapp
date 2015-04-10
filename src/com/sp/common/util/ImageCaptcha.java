package com.sp.common.util;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Random;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpSession;

/**
 * @ClassName ImageCaptcha
 * @Description 验证码图片生成
 * @author chenjw@gdeii.com.cn
 * @date 2012-6-14
 */
public class ImageCaptcha{
	private int width=120;//宽
	private int height=30;//高
	private int codeCount=5;//验证码位数
	private int lineCount=150;//干扰线数量
	private boolean cased=true;//是否随机字母大小写,默认为否
	private String code=null;//随机验证码
	private BufferedImage buffImg=null;//验证码图片buffer
	private boolean randDraw=true;//验证码字符随机出现在画布
	
	//去掉0与o,l与1等相似的字符
	private char[] codeSequence={'2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','m','n','p','q','r','s','t','u','v','w','x','y','z'};//验证码字符集合
	
	public ImageCaptcha(){
		createImg();
	}
	
	public ImageCaptcha(int width,int height){
		this.width=width;
		this.height=height;
		createImg();
	}
	
	public ImageCaptcha(int width,int height,int codeCount,int lineCount,boolean cased){
		this.width=width;
		this.height=height;
		this.codeCount=codeCount;
		this.lineCount=lineCount;
		this.cased=cased;
		createImg();
	}
	
	private void createImg(){
		int cw=0,ch=0,fontSize=(int)(height*0.9),
			red=0,green=0,blue=0;
		
		//生成随机画布
		buffImg = new BufferedImage(width, height,BufferedImage.TYPE_INT_RGB);
		Graphics g = buffImg.getGraphics();
		g.setColor(Color.BLACK);
		g.fillRect(0, 0, width, height);
		g.setFont(new Font("Consolas", Font.ITALIC, fontSize));
		
		Random r=new Random();
		for (int i = 0; i < lineCount; i++) {//干扰线
			int xs = r.nextInt(width);
			int ys = r.nextInt(height);
			int xe = xs+r.nextInt(width/8);
			int ye = ys+r.nextInt(height/8);
			red=r.nextInt(255);
			green=r.nextInt(255);
			blue=r.nextInt(255);
			g.setColor(new Color(red, green, blue));
			g.drawLine(xs, ys, xe, ye);
		}
		
		//生成随机字串
		createCode();
		
		//将随机字串写入画布
		if(!randDraw){//均匀排列
			cw = width/(codeCount+2);//每个字符宽度
			ch = (int)(height * 0.8);//fontSize;//高度
			g.setColor(new Color(255,255,255));
			g.drawString(code, cw, ch);//在画布上写字
		} else {//随机排列
			int len = code.length();
			cw = width/(len + 2);//每个字符宽度
			ch = (int)(height * 0.8); //fontSize;//高度
			for(int i=0; i<len; i++){
				int chh = (int)( r.nextDouble() * (height - ch) );
				chh = r.nextBoolean() ? ch + chh : ch - chh;
				int chw = cw * (i+1);
				chw += ((int)(r.nextDouble() * cw/2) - 2) * (r.nextBoolean() ? 1 : -1);
				g.setColor(new Color(255,255,255));
				g.drawString(code.substring(i, i+1), chw, chh);//在画布上写字
			}
		}
	}
	
	private void createCode(){
		int codeNum=codeSequence.length;
		StringBuffer sb=new StringBuffer();
		for(int i=0;i<codeCount;i++){
			Random r=new Random();
			boolean tag[]={false,true};
			int index=r.nextInt(codeNum);
			if(Character.isLetter(codeSequence[index]) && cased){
				int b=r.nextInt(2);
				if(tag[b]){
					sb.append(Character.toUpperCase(codeSequence[index]));
				}else{
					sb.append(codeSequence[index]);
				}
			}else{
				sb.append(codeSequence[index]);
			}
		}
		code=sb.toString();
	}
	
	public void saveCode(HttpSession session){
		//session.putValue("checkCode", this.getCode());
		session.setAttribute("checkCode", this.getCode());
	}
	
	public boolean validateCode(String sessionCode,String checkCode){
		if(sessionCode.equals(checkCode))
			return true;
		return false;
	}
	
	public void write(String path) throws IOException {
		OutputStream sos = new FileOutputStream(path);
			this.write(sos);
	}
	
	public void write(OutputStream sos) throws IOException {
			ImageIO.write(buffImg, "jpg", sos);
	}

	public String getCode() {
		return code;
	}

	public BufferedImage getBuffImg() {
		return buffImg;
	}
}
