// Decompiled by Jad v1.5.8e2. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://kpdus.tripod.com/jad.html
// Decompiler options: packimports(3) fieldsfirst ansi space 
// Source File Name:   FileUploadInterceptor.java

package org.apache.struts2.interceptor;

import com.opensymphony.xwork2.*;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;
import com.opensymphony.xwork2.util.LocalizedTextUtil;
import com.opensymphony.xwork2.util.TextParseUtil;
import com.opensymphony.xwork2.util.logging.Logger;
import com.opensymphony.xwork2.util.logging.LoggerFactory;
import com.sp.core.IndeBaseAction;

import java.io.File;
import java.util.*;
import javax.servlet.http.HttpServletRequest;
import org.apache.struts2.dispatcher.multipart.MultiPartRequestWrapper;

public class FileUploadInterceptor extends AbstractInterceptor
{

	private static final long serialVersionUID = 0xbde0a48d516698d2L;
	protected static final Logger LOG = LoggerFactory.getLogger("org/apache/struts2/interceptor/FileUploadInterceptor");
	private static final String DEFAULT_MESSAGE = "no.message.found";
	protected boolean useActionMessageBundle;
	protected Long maximumSize;
	protected Set allowedTypesSet;
	protected Set allowedExtensionsSet;

	public FileUploadInterceptor()
	{
		allowedTypesSet = Collections.emptySet();
		allowedExtensionsSet = Collections.emptySet();
	}

	public void setUseActionMessageBundle(String value)
	{
		useActionMessageBundle = Boolean.valueOf(value).booleanValue();
	}

	public void setAllowedExtensions(String allowedExtensions)
	{
		allowedExtensionsSet = TextParseUtil.commaDelimitedStringToSet(allowedExtensions);
	}

	public void setAllowedTypes(String allowedTypes)
	{
		allowedTypesSet = TextParseUtil.commaDelimitedStringToSet(allowedTypes);
	}

	public void setMaximumSize(Long maximumSize)
	{
		this.maximumSize = maximumSize;
	}

	public String intercept(ActionInvocation invocation)
		throws Exception
	{
		ActionContext ac = invocation.getInvocationContext();
		HttpServletRequest request = (HttpServletRequest)ac.get("com.opensymphony.xwork2.dispatcher.HttpServletRequest");
		if (!(request instanceof MultiPartRequestWrapper))
		{
			if (LOG.isDebugEnabled())
			{
				ActionProxy proxy = invocation.getProxy();
				LOG.debug(getTextMessage("struts.messages.bypass.request", new Object[] {
					proxy.getNamespace(), proxy.getActionName()
				}, ac.getLocale()), new String[0]);
			}
			return invocation.invoke();
		}
		ValidationAware validation = null;
		Object action = invocation.getAction();
		IndeBaseAction baseAction =(IndeBaseAction)action;
		if (action instanceof ValidationAware)
			validation = (ValidationAware)action;
		MultiPartRequestWrapper multiWrapper=null;
		try{
			multiWrapper = (MultiPartRequestWrapper)request;
		}catch(Exception e){
			baseAction.getJsonRoot().put("success", false);
			baseAction.getJsonRoot().put("exception", "上传超时");
			return Action.SUCCESS;
		}
		if (multiWrapper.hasErrors())
		{
			String error;
			for (Iterator i$ = multiWrapper.getErrors().iterator(); i$.hasNext(); LOG.error(error, new String[0]))
			{
				error = (String)i$.next();
				if (validation != null)
					validation.addActionError(error);
			}

		}
		Enumeration fileParameterNames = multiWrapper.getFileParameterNames();
		do
		{
			if (fileParameterNames == null || !fileParameterNames.hasMoreElements())
				break;
			String inputName = (String)fileParameterNames.nextElement();
			String contentType[] = multiWrapper.getContentTypes(inputName);
			if (isNonEmpty(contentType))
			{
				String fileName[] = multiWrapper.getFileNames(inputName);
				if (isNonEmpty(fileName))
				{
					File files[] = multiWrapper.getFiles(inputName);
					if (files != null && files.length > 0)
					{
						List acceptedFiles = new ArrayList(files.length);
						List acceptedContentTypes = new ArrayList(files.length);
						List acceptedFileNames = new ArrayList(files.length);
						String contentTypeName = (new StringBuilder()).append(inputName).append("ContentType").toString();
						String fileNameName = (new StringBuilder()).append(inputName).append("FileName").toString();
						for (int index = 0; index < files.length; index++)
							if (acceptFile(action, files[index], fileName[index], contentType[index], inputName, validation, ac.getLocale()))
							{
								acceptedFiles.add(files[index]);
								acceptedContentTypes.add(contentType[index]);
								acceptedFileNames.add(fileName[index]);
							}

						if (!acceptedFiles.isEmpty())
						{
							Map params = ac.getParameters();
							params.put(inputName, ((Object) (acceptedFiles.toArray(new File[acceptedFiles.size()]))));
							params.put(contentTypeName, ((Object) (acceptedContentTypes.toArray(new String[acceptedContentTypes.size()]))));
							params.put(fileNameName, ((Object) (acceptedFileNames.toArray(new String[acceptedFileNames.size()]))));
						}
					}
				} else
				{
					LOG.error(getTextMessage(action, "struts.messages.invalid.file", new Object[] {
						inputName
					}, ac.getLocale()), new String[0]);
				}
			} else
			{
				LOG.error(getTextMessage(action, "struts.messages.invalid.content.type", new Object[] {
					inputName
				}, ac.getLocale()), new String[0]);
			}
		} while (true);
		String result = invocation.invoke();
		try{
			for (fileParameterNames = multiWrapper.getFileParameterNames(); fileParameterNames != null && fileParameterNames.hasMoreElements();)
			{
				String inputValue = (String)fileParameterNames.nextElement();
				File files[] = multiWrapper.getFiles(inputValue);
				File arr$[] = files;
				int len$ = arr$.length;
				int i$ = 0;
				while (i$ < len$) 
				{
					File currentFile = arr$[i$];
					if (LOG.isInfoEnabled())
						LOG.info(getTextMessage(action, "struts.messages.removing.file", new Object[] {
							inputValue, currentFile
						}, ac.getLocale()), new String[0]);
					if (currentFile != null && currentFile.isFile())
						currentFile.delete();
					i$++;
				}
			}
		}catch(Exception e){
			baseAction.getJsonRoot().put("success", false);
			baseAction.getJsonRoot().put("exception", "上传超时");
			return Action.SUCCESS;
		}

		return result;
	}

	protected boolean acceptFile(Object action, File file, String filename, String contentType, String inputName, ValidationAware validation, Locale locale)
	{
		boolean fileIsAcceptable = false;
		if (file == null)
		{
			String errMsg = getTextMessage(action, "struts.messages.error.uploading", new Object[] {
				inputName
			}, locale);
			if (validation != null)
				validation.addFieldError(inputName, errMsg);
			LOG.error(errMsg, new String[0]);
		} else
		if (maximumSize != null && maximumSize.longValue() < file.length())
		{
			String errMsg = getTextMessage(action, "struts.messages.error.file.too.large", new Object[] {
				inputName, filename, file.getName(), (new StringBuilder()).append("").append(file.length()).toString()
			}, locale);
			if (validation != null)
				validation.addFieldError(inputName, errMsg);
			LOG.error(errMsg, new String[0]);
		} else
		if (!allowedTypesSet.isEmpty() && !containsItem(allowedTypesSet, contentType))
		{
			String errMsg = getTextMessage(action, "struts.messages.error.content.type.not.allowed", new Object[] {
				inputName, filename, file.getName(), contentType
			}, locale);
			if (validation != null)
				validation.addFieldError(inputName, errMsg);
			LOG.error(errMsg, new String[0]);
		} else
		if (!allowedExtensionsSet.isEmpty() && !hasAllowedExtension(allowedExtensionsSet, filename))
		{
			String errMsg = getTextMessage(action, "struts.messages.error.file.extension.not.allowed", new Object[] {
				inputName, filename, file.getName(), contentType
			}, locale);
			if (validation != null)
				validation.addFieldError(inputName, errMsg);
			LOG.error(errMsg, new String[0]);
		} else
		{
			fileIsAcceptable = true;
		}
		return fileIsAcceptable;
	}

	private static boolean hasAllowedExtension(Collection extensionCollection, String filename)
	{
		if (filename == null)
			return false;
		String lowercaseFilename = filename.toLowerCase();
		for (Iterator i$ = extensionCollection.iterator(); i$.hasNext();)
		{
			String extension = (String)i$.next();
			if (lowercaseFilename.endsWith(extension))
				return true;
		}

		return false;
	}

	private static boolean containsItem(Collection itemCollection, String item)
	{
		return itemCollection.contains(item.toLowerCase());
	}

	private static boolean isNonEmpty(Object objArray[])
	{
		boolean result = false;
		for (int index = 0; index < objArray.length && !result; index++)
			if (objArray[index] != null)
				result = true;

		return result;
	}

	private String getTextMessage(String messageKey, Object args[], Locale locale)
	{
		return getTextMessage(null, messageKey, args, locale);
	}

	private String getTextMessage(Object action, String messageKey, Object args[], Locale locale)
	{
		if (args == null || args.length == 0)
			if (action != null && useActionMessageBundle)
				return LocalizedTextUtil.findText(action.getClass(), messageKey, locale);
			else
				return LocalizedTextUtil.findText(getClass(), messageKey, locale);
		if (action != null && useActionMessageBundle)
			return LocalizedTextUtil.findText(action.getClass(), messageKey, locale, "no.message.found", args);
		else
			return LocalizedTextUtil.findText(getClass(), messageKey, locale, "no.message.found", args);
	}

}