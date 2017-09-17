package aini.web.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Iterator;
import java.util.List;

import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import aini.vo.StudentVO;

import com.aspose.cells.FileFormatType;
import com.aspose.cells.LoadOptions;
import com.aspose.cells.Workbook;
import com.aspose.cells.Worksheet;

/**
 * 엑셀 파일을 서버로 업로드하는 클래스이다.
 *
 * @author KangBongHoon
 * @version 1.0
 */
@Service
public class UploadService
{
    private static final Logger logger = LoggerFactory.getLogger(UploadService.class);
    
    @Value("${ALLOWED_FILE_NAME}")
    private String allowedFileName;

    /**
     * 엑셀 파일을 서버로 업로드한다.
     *
     * @param multi
     * @return
     * 
     * @author KangBongHoon
     * @create-date : 2017. 2. 16.
     */
    @SuppressWarnings("unchecked")
    public String upload(MultipartHttpServletRequest multi)
    {
        List<StudentVO> resultData = new ArrayList<StudentVO>();


        String contextPath = multi.getSession().getServletContext().getRealPath("/");
        String uploadPath = contextPath + "report/upload/";

        /* 업로드 할 폴더 존재 여부 체크 */
        File dir = new File(uploadPath);

        if (!dir.isDirectory())
        {
            dir.mkdir();
        }

        /* 업로드 파일 목록 */
        List<MultipartFile> multipartFileList = multi.getFiles("inputficons1[]");

        for (MultipartFile multipartFile : multipartFileList)
        {
            String fileName = multipartFile.getOriginalFilename().substring(0, multipartFile.getOriginalFilename().lastIndexOf("."));
            String extension = multipartFile.getOriginalFilename().substring(multipartFile.getOriginalFilename().lastIndexOf("."));
            
            //파일 이름 체크
            if(allowedFileName != null && !allowedFileName.isEmpty())
            {
                if(fileName.indexOf(allowedFileName) < 0)
                {
                    logger.info("");
                    logger.info("############### File is not allow  ###############");
                    logger.info("File Name : " + fileName);
                    logger.info("");
                    
                    continue;
                }
            }

            String uploadFileName = fileName + "_" + new SimpleDateFormat("yyyyMMddHHmmss").format(Calendar.getInstance().getTime()) + "." + extension;

            InputStream uploadFileInputStream = null;

            try
            {
                /* 업로드한 파일을 로컬에 저장 */
                File uploadedFile = new File(uploadPath + uploadFileName);
                multipartFile.transferTo(uploadedFile);

                /* 업로드한 파일을 엑셀로 읽기 */
                uploadFileInputStream = new FileInputStream(uploadedFile);
                Workbook orgExcelWorkbook = new Workbook(uploadFileInputStream, new LoadOptions(FileFormatType.XLSX));

                Iterator<Worksheet> itr = orgExcelWorkbook.getWorksheets().iterator();

                while (itr.hasNext())
                {
                    InputStream excelFileInputStream = null;
                    OutputStream excelFileOutputStream = null;

                    try
                    {
                        Worksheet workSheet = itr.next();

                        String name = (String) workSheet.getCells().get(6, 5).getValue();
                        String emailAddress = (String) workSheet.getCells().get(6, 17).getValue();
                        String phoneNumber = (String) workSheet.getCells().get(7, 5).getValue();

                        /* 워크시트를 별도 엑셀 파일로 저장 */
                        String newWorkbookFileName = uploadPath + getStudentFileName(phoneNumber, workSheet.getName());
                        Workbook newWorkbook = new Workbook();
                        newWorkbook.getWorksheets().get(0).copy(workSheet);
                        newWorkbook.save(newWorkbookFileName, FileFormatType.XLSX);

                        /* 별도 저장 된 엑셀 파일에서 라이센스 시트 삭제 */
                        excelFileInputStream = new FileInputStream(new File(newWorkbookFileName));
                        XSSFWorkbook workBook = new XSSFWorkbook(excelFileInputStream);
                        workBook.removeSheetAt(1);
                        excelFileOutputStream = new FileOutputStream(new File(newWorkbookFileName));
                        workBook.write(excelFileOutputStream);

                        /* 결과 데이터 저장 */
                        StudentVO student = new StudentVO();
                        student.setName(name);
                        student.setPhoneNumber(phoneNumber);
                        student.setEmailAddress(emailAddress);
                        student.setSmsFlag(true);
                        student.setEmailFlag(true);
                        student.setExcelFilePath(newWorkbookFileName);
                        resultData.add(student);
                        
                        logger.info("");
                        logger.info("############### Student file save ###############");
                        logger.info("Name : " + name);
                        logger.info("File : " + newWorkbookFileName);
                        logger.info("");

                    }
                    catch (Exception e)
                    {
                        logger.error(e.getMessage(), e);
                    }
                    finally
                    {
                        if (excelFileInputStream != null)
                        {
                            try
                            {
                                excelFileInputStream.close();
                            }
                            catch (IOException e)
                            {
                                logger.error(e.getMessage(), e);
                            }
                        }

                        if (excelFileOutputStream != null)
                        {
                            try
                            {
                                excelFileOutputStream.close();
                            }
                            catch (IOException e)
                            {
                                logger.error(e.getMessage(), e);
                            }
                        }
                    }
                }
            }
            catch (Exception e)
            {
                logger.error(e.getMessage(), e);
            }
            finally
            {
                if (uploadFileInputStream != null)
                {
                    try
                    {
                        uploadFileInputStream.close();
                    }
                    catch (IOException e)
                    {
                        logger.error(e.getMessage(), e);
                    }
                }
            }
        }

        String result = "";

        /* 웹으로 응답 */
        try
        {
            ObjectMapper mapper = new ObjectMapper();

            result = mapper.writeValueAsString(resultData);
        }
        catch (Exception e)
        {
            logger.error(e.getMessage(), e);
        }

        return result;
    }

    /**
     * 수강생 엑셀 파일 이름을 반환한다.
     *
     * @param phoneNumber
     * @param name
     * @return
     * 
     * @author KangBongHoon
     * @create-date : 2017. 2. 16.
     */
    private String getStudentFileName(String phoneNumber, String name)
    {
        return name + "_" + phoneNumber.replaceAll("-", "") + "." + "xlsx";
    }
}