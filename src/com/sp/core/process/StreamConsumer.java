package com.sp.core.process;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

public class StreamConsumer extends Thread {
    private InputStream is;
    private File file;
    private String returnValue;
    
    public static int IO_CHUNK_SIZE = 102400;
    public StreamConsumer(InputStream is) {
        this.is = is;
        returnValue = "";
    }

    public StreamConsumer(InputStream is, File file) {
        this(is);
        this.file = file;
    }

    public String getReturnValue() {
        return returnValue;
    }

    public void run() {
        BufferedOutputStream outStream = null;
        FileOutputStream fileOutputStream = null;
        try {
            BufferedInputStream inStream = new BufferedInputStream(is);
            if (file != null) {
                fileOutputStream = new FileOutputStream(file);
				outStream = new BufferedOutputStream(fileOutputStream);
            }
            byte[] bytes = new byte[IO_CHUNK_SIZE];
            int bytesRead;
            while ((bytesRead = inStream.read(bytes)) > 0) {
                returnValue += new String(bytes, 0, bytesRead);
                if (outStream != null) {
                    outStream.write(bytes, 0, bytesRead);
                }
            }
        } catch (IOException ex) {
            ex.printStackTrace();
        } finally {
            if (outStream != null) {
                try {
            		is.close();
					outStream.close();
	                fileOutputStream.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
            }
        }
    }
}
