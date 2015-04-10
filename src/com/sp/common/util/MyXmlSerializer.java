package com.sp.common.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.lang.reflect.ParameterizedType;
import java.nio.charset.Charset;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

import org.apache.log4j.Logger;

import com.sp.core.MyException;

public class MyXmlSerializer<TYPE> {
	private JAXBContext context;
	 private Class<TYPE> request;
	 private Logger logger=Logger.getLogger(MyXmlSerializer.class);
	 //private Class<RTYPE> responseClass;
	
	public MyXmlSerializer() {
		request =(Class<TYPE>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[0];
		//responseClass=(Class<RTYPE>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[1];
		// TODO Auto-generated constructor stub
	}
	public TYPE Xml2Object(String xml) throws MyException {
		// TODO Auto-generated method stub
		ByteArrayInputStream bis=new ByteArrayInputStream(xml.getBytes(Charset.forName("UTF-8")));
		//
		try {
			context=JAXBContext.newInstance(request);
			Unmarshaller u=context.createUnmarshaller();
			TYPE obj=(TYPE)u.unmarshal(bis);
			return obj;
		} catch (JAXBException e) {
			// TODO Auto-generated catch block
			logger.error(e);
			throw new MyException(e);
			//Log.error(e.getMessage());
		}
	}

	public String Object2Xml(TYPE response) throws MyException {
		// TODO Auto-generated method stub
		try {
			context=JAXBContext.newInstance(request);
			ByteArrayOutputStream bos=new ByteArrayOutputStream();
			Marshaller u1=context.createMarshaller();
			u1.setProperty(u1.JAXB_ENCODING, "GB2312");
			u1.marshal(response, bos);
			String xmlOut=new String(bos.toByteArray());
			int index=xmlOut.indexOf(">")+1;
			return xmlOut.substring(index);
		} catch (JAXBException e) {
			// TODO Auto-generated catch block
			logger.error(e);
			throw new MyException(e);
		}

	}
}
