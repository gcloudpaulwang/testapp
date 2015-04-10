package com.sp.tool.office.excel;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.ParameterizedType;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

//import org.apache.poi.hssf.model.Sheet;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
//import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

//import com.edu.core.EduException;
//import com.edu.schedule.tool.ExcelFormat;

public class BaseExcelReader<T> {
	private String path;
	private File file;
	private int sheetNum;
	private String[] sheetNames;
	private int rows=0;//行数
	private short cols=0;//列数
	private HSSFWorkbook wb;
	private InputStream in;
	private List<T> list=new ArrayList<T>();
	Class<T> request;
	public BaseExcelReader() {
		super();
	}

	public BaseExcelReader(String path) throws ExcelException{
		super();
		request=(Class<T>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[0];
		this.path=path;
		try{
		this.file=new File(this.path);
		in=new FileInputStream(this.file);
		//POIFSFileSystem fs=new POIFSFileSystem(in);
		this.wb=new HSSFWorkbook(in);
		}
		catch(Exception e)
		{
			throw new ExcelException(e);
		}
		this.sheetNum=wb.getNumberOfSheets();
		this.sheetNames=new String[this.sheetNum];
		for(short i=0;i<sheetNum;i++){
			this.sheetNames[i]=this.wb.getSheetName(i);
		}
	}
	
	/**
	 * 检查行标题重复
	 * @param sheetName
	 * @param value
	 * @param data
	 * @throws ExcelException 
	 */
	private void isRowRepeat(String sheetName,String value,String[] col) throws ExcelException{
		List<String> list=Arrays.asList(col);
		int start=list.indexOf(value);
		int end=list.lastIndexOf(value);
		if(start!=end){
			throw new ExcelException("表:"+sheetName+",第"+(start+1)+"行与第"+(end+1)+"行行标题重复了");
		}		
	}
	
	/**
	 * 第一行列命名:数字+班
	 * @param sheetName
	 * @param i
	 * @param value
	 * @throws ExcelException
	 */
	private void colIsNumber(String sheetName,short i,String value) throws ExcelException{
		if(!value.matches("^\\d{1,2}班$") &&!value.matches("^\\(\\d{1,2}\\)班$")&&!value.matches("^（\\d{1,2}）班$")){
			throw new ExcelException("表:"+sheetName+",第"+(i+1)+"列标题含有非法字符,格式:阿拉伯数字+班");
		}
	}
	
	/**
	 * 行标题:数字+班
	 * @param sheetName
	 * @param i
	 * @param value
	 * @throws ExcelException
	 */
	private void rowIsNumber2(String sheetName,int i,String value) throws ExcelException{
		if(!value.matches("^\\d{1,2}班$")){
			throw new ExcelException("表:"+sheetName+",第"+(i+1)+"行行标题含有非法字符,格式:阿拉伯数字+班");
		}
	}
	
	/**
	 * 行标题:第+数字+节
	 * @param sheetName
	 * @param i
	 * @param value
	 * @throws ExcelException
	 */
	private void rowIsNumber1(String sheetName,int i,String value) throws ExcelException{
		if(!value.matches("^第\\d{1,2}节$")){
			throw new ExcelException("表:"+sheetName+",第"+(i+1)+"行行标题含有非法字符,格式:第+阿拉伯数字+节");
		}
	}	
	
	/**
	 * 第一行列标题是否按数字升序排列
	 * @param sheetName
	 * @param row
	 * @throws ExcelException
	 */
	private void isColumnAsc1(String sheetName,String[] row) throws ExcelException{
		int len=row.length-2;
		for(int x=1;x<len;x++){
			short x1=Short.parseShort(getNumbers(row[x]));
			short x2=Short.parseShort(getNumbers(row[x+1]));
			if(x1>x2){
				throw new ExcelException("表:"+sheetName+",第一行未按数字升序排列");
			}
		}
	}
	
	/**
	 * 第一列行标题是否按数字升序排列
	 * @param sheetName
	 * @param row
	 * @throws ExcelException
	 */
	private void isColumnAsc2(String sheetName,String[] col) throws ExcelException{
		int len=col.length-1;
		for(int x=1;x<len;x++){
			short x1=Short.parseShort(getNumbers(col[x]));
			short x2=Short.parseShort(getNumbers(col[x+1]));
			if(x1>x2){
				throw new ExcelException("表:"+sheetName+",第一列未按数字升序排列");
			}
		}
	}
	
    public String getNumbers(String content){
        Pattern pattern = Pattern.compile("\\d+");
        Matcher matcher = pattern.matcher(content);
        while(matcher.find()){
            return matcher.group(0);
        }
        return "";
    }
	
	private void isRowAsc(String sheetName,String[] row) throws ExcelException{
		int len=row.length-1;
		for(int x=1;x<len;x++){
			short x1=Short.parseShort(getNumbers(row[x]));
			short x2=Short.parseShort(getNumbers(row[x+1]));
			if(x1>x2){
				throw new ExcelException("表:"+sheetName+",第一行未按数字升序排列");
			}
		}
	}
	
	/**
	 * 科目是否在存在course_subject表
	 * @param sheetName
	 * @param subjectName
	 * @throws ExcelException 
	 */
//	private void hasSubject(String sheetName,short i,String subjectName) throws ExcelException{
//		if(StringUtils.isBlank(subjectName)){
//			throw new ExcelException("表:"+sheetName+",第"+(i+1)+"列科目为空");
//		}
//		if(subjects.indexOf(subjectName)==-1){
//			throw new ExcelException("表:"+sheetName+",第"+(i+1)+"列科目不存在");
//		}
//	}
	
//	private boolean isRowNameFormative(String sheetName,String name){
//		if(isCourseSchedule(sheetName)){
//			return name.matches("^第\\d{1,2}节$");
//		}
//		return subjects.indexOf(name)>-1?true:false;
//	}
	
	/**
	 * 是否为课程安排表
	 * @param name
	 * @return
	 */
	private boolean isCourseSchedule(String name){
		return name.indexOf("星期")>-1?true:false;
	}
	/**
	 * 是否为任科表
	 * @param name
	 * @return
	 */
	private boolean isTeachingSchedule(String name){
		return name.indexOf("任科")>-1?true:false;
	}
	
	public String getSheetName(short i){
		return sheetNames[i];
	}
	public List<T> getSheetData(short i) throws ExcelException{
		List<T> res = new ArrayList<T>();
		HSSFSheet sheet=this.wb.getSheetAt(i);
		rows=sheet.getLastRowNum();
		//去掉空行 去掉空列
		HSSFRow row1=sheet.getRow(0);
		for(int x2=sheet.getLastRowNum();x2>0;x2--){
			HSSFRow rowTmp=sheet.getRow(x2);
			if(rowTmp==null){
				rows--;
				continue;
			}
			HSSFCell cell=rowTmp.getCell((short)0);
			if(cell==null){
				rows--;
				continue;
			}
			if(cell.getCellType()==HSSFCell.CELL_TYPE_NUMERIC)
			{
				if(cell.getNumericCellValue()==0)
				rows--;
				continue;
			}
			String value=cell.getStringCellValue();
			if(value==null || value.trim().equals(""))
				rows--;
		}
			
		short cols1=row1.getLastCellNum();
		short cols2=cols1;
//		for(short x1=(short)(cols2-1);x1>0;x1--)
//		{
//			HSSFCell cell=row1.getCell(x1);
//			if(cell==null){
//				cols1--;
//				continue;
//			}
//			String value=cell.getStringCellValue();
//			if(value==null || value.trim().equals(""))
//				cols1--;
//		}
		HSSFRow firstRow=sheet.getRow(0);
		for(int y=1;y<=rows;y++){//循环行
			HSSFRow row=sheet.getRow(y);
			if(row==null)
				continue;
			int columns=cols1+1;//列数
			String[] values=new String[columns-1];//行值数组
			Arrays.fill(values,"");
			boolean hasValue=false;
			cols=cols1;//row.getLastCellNum();

			HSSFCell cell = null;
			
			T item=this.newTemplateInst();
			
			for(short x=0;x<cols;x++){//循环列
				//if(y==0 && x==0) continue;//忽略第一行第一列
				String value="";
				if(row1.getCell(x)==null)
					continue;
				String colName=row1.getCell(x).getStringCellValue();
				cell=row.getCell(x);//单元
				try
				{
				if(cell!=null){
					//cell.setEncoding(HSSFCell.ENCODING_UTF_16);
					switch(cell.getCellType()){
					case HSSFCell.CELL_TYPE_STRING:
						value=cell.getStringCellValue();						
						break;
					case HSSFCell.CELL_TYPE_NUMERIC:
						if (HSSFDateUtil.isCellDateFormatted(cell)) {
							Date date=cell.getDateCellValue();
							if(date!=null) {
								value=new SimpleDateFormat("yyyy-MM-dd").format(date);
							}else{
								value = "";
							}
						}else{
							HSSFCell title=firstRow.getCell(x);
							String titleName=title.getStringCellValue();
							if(titleName.equals("收费合计")||titleName.equals("保费金额")
									||titleName.equals("保费")||titleName.equals("总保费"))
							{
								value=new DecimalFormat("###0.00").format(cell.getNumericCellValue());
							}
							else
							{
								value=new DecimalFormat("0").format(cell.getNumericCellValue());
							}
							//value=cell.getNumericCellValue()+"";
						}
						break;
					case HSSFCell.CELL_TYPE_FORMULA:
						if (!cell.getStringCellValue().equals("")){
							value=cell.getStringCellValue();
						}else{
							value=cell.getNumericCellValue()+"";
						}
						break;
					case HSSFCell.CELL_TYPE_BLANK:
						break;
					case HSSFCell.CELL_TYPE_ERROR:
						value="";
						break;
					case HSSFCell.CELL_TYPE_BOOLEAN:
						value=(cell.getBooleanCellValue()==true?"Y":"N");
						break;
					default:
						value="";
					}
				}
				}
				catch(Exception ex)
				{
					
				}				
//				values[x]=rightTrim(value);
				
				//ExcelMappingHelper.setValue(item, row1.getCell(x).getStringCellValue(), value);
				FieldReflection reflection= ReflectionManager.getReflection(item.getClass()).get(colName);
				if(reflection!=null){
					Map<String,String> mapVal=new HashMap<String, String>();
					mapVal.put(BaseTypeConverter.COLUMN_NAME_KEY,colName);
					mapVal.put(BaseTypeConverter.VALUE_NAME_KEY, value);
					reflection.getConverter().setValue(item, mapVal, reflection.getSMethod());
				}
				hasValue=true;
			}
			if(hasValue){
				res.add(item);
			}
		}
//		String[][] data=new String[res.size()][cols];
//		res.toArray(data);
		return res;
	}
	
	

	/**
	 * 
	 * 读取Excel的内容，第一维数组存储的是一行中格列的值，二维数组存储的是多少个行
	 * @param file 读取数据的源Excel
	 * @param ignoreRows 读取数据忽略的行数，比喻行头不需要读入 忽略的行数为1
	 * @return 读出的Excel中数据的内容
	 * @throws FileNotFoundException
	 * @throws IOException
	 */
//	public static String[][] getData(File file, int ignoreRows)
//			throws FileNotFoundException,IOException{
//		List<String[]> result = new ArrayList<String[]>();
//		int rowSize = 0;
//		BufferedInputStream in=new BufferedInputStream(new FileInputStream(file));
//		// 打开HSSFWorkbook
//		POIFSFileSystem fs=new POIFSFileSystem(in);
//		HSSFWorkbook wb = new HSSFWorkbook(fs);
//		HSSFCell cell = null;
//		int sheetNum=wb.getNumberOfSheets();
//		for(int i=0;i<sheetNum;i++){//循环表
//			String sheetName=wb.getSheetName(i);
//			HSSFSheet st=wb.getSheetAt(i);
//			System.out.println(sheetName);
//			//去掉空列
//			HSSFRow row1=st.getRow(0);
//			short cols1=row1.getLastCellNum();
//			short cols2=cols1;
//			for(short x1=(short)(cols2-1);x1>0;x1--)
//			{
//				HSSFCell cell1=row1.getCell(x1);
//				if(cell==null){
//					cols1--;
//					continue;
//				}
//				String value=cell1.getStringCellValue();
//				if(value==null || value.trim().equals(""))
//					cols1--;
//			}
//			// 第一行为标题，不取
//			for(int rowIndex=ignoreRows;rowIndex<=st.getLastRowNum();rowIndex++){//循环行
//				HSSFRow row=st.getRow(rowIndex);
//				if(row==null){
//					continue;
//				}
//				int tempRowSize=cols1;//row.getLastCellNum()+1;//列数
//				if(tempRowSize>rowSize){//取最大的列数
//					rowSize=tempRowSize;
//				}
//				String[] values=new String[rowSize];//行值数组
//				Arrays.fill(values,"");
//				boolean hasValue=false;
//				for(short columnIndex=0;columnIndex<=cols1;columnIndex++){//循环列
//					if(rowIndex==0 && columnIndex==0) continue;//忽略第一行第一列
//					String value="";
//					cell=row.getCell(columnIndex);//单元
//					if(cell!=null){
//						// 注意：一定要设成这个，否则可能会出现乱码
//						//cell.setEncoding(HSSFCell.ENCODING_UTF_16);
//						switch(cell.getCellType()){
//						case HSSFCell.CELL_TYPE_STRING:
//							value=cell.getStringCellValue();
//							break;
//						case HSSFCell.CELL_TYPE_NUMERIC:
//							if (HSSFDateUtil.isCellDateFormatted(cell)) {
//								Date date=cell.getDateCellValue();
//								if(date!=null) {
//									value=new SimpleDateFormat("yyyy-MM-dd").format(date);
//								}else{
//									value = "";
//								}
//							}else{
//								value=new DecimalFormat("0").format(cell.getNumericCellValue());
//							}
//							break;
//						case HSSFCell.CELL_TYPE_FORMULA:
//							// 导入时如果为公式生成的数据则无值
//							if (!cell.getStringCellValue().equals("")){
//								value=cell.getStringCellValue();
//							}else{
//								value=cell.getNumericCellValue()+"";
//							}
//							break;
//						case HSSFCell.CELL_TYPE_BLANK:
//							break;
//						case HSSFCell.CELL_TYPE_ERROR:
//							value="";
//							break;
//						case HSSFCell.CELL_TYPE_BOOLEAN:
//							value=(cell.getBooleanCellValue()==true?"Y":"N");
//							break;
//						default:
//							value="";
//						}
//					}
//					if(columnIndex==0 && value.trim().equals("")) {
//						break;
//					}
//					values[columnIndex]=rightTrim(value);
//					hasValue=true;
//				}
//				if(hasValue){
//					result.add(values);
//				}
//			}
//		}
//		in.close();
//		String[][] returnArray=new String[result.size()][rowSize];
//		for(int i=0;i<returnArray.length;i++){
//			returnArray[i]=(String[]) result.get(i);
//		}
//		return returnArray;
//	}

	/**
	 * 
	 * 去掉字符串右边的空格
	 * @param str 要处理的字符串
	 * @return 处理后的字符串
	 * 
	 */
	public static String rightTrim(String str){
		if(str==null) {
			return "";
		}
		int length=str.length();
		for(int i=length - 1;i >= 0;i--){
			if(str.charAt(i)!=0x20){
				break;
			}
			length--;
		}
		return str.substring(0,length);
	}

	public int getSheetNum() {
		return sheetNum;
	}

	public String[] getSheetNames() {
		return sheetNames;
	}
	public void close()
	{
		this.wb=null;
		try {
			this.in.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	@SuppressWarnings("unchecked")
	private T newTemplateInst()
	{
//		Class<T> request=(Class<T>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[0];
		try {
			return request.newInstance();
		} catch (InstantiationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		} catch (IllegalAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}
	}
}
