package aini.vo;

public class StudentVO
{
    private String name;
    private String phoneNumber;
    private String emailAddress;
    private Boolean smsFlag;
    private Boolean emailFlag;
    private String excelFilePath;
    private String pdfFilePath;
    private String status;    // S = 성공, F = 실패, PF = 일부실패, P = 진행중
    private String auth;

    public String getAuth()
    {
        return auth;
    }

    public void setAuth(String auth)
    {
        this.auth = auth;
    }

    public Boolean getSmsFlag()
    {
        return smsFlag;
    }

    public void setSmsFlag(Boolean smsFlag)
    {
        this.smsFlag = smsFlag;
    }

    public String getExcelFilePath()
    {
        return excelFilePath;
    }

    public void setExcelFilePath(String excelFilePath)
    {
        this.excelFilePath = excelFilePath;
    }

    public String getPdfFilePath()
    {
        return pdfFilePath;
    }

    public void setPdfFilePath(String pdfFilePath)
    {
        this.pdfFilePath = pdfFilePath;
    }

    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public String getPhoneNumber()
    {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber)
    {
        this.phoneNumber = phoneNumber;
    }

    public String getEmailAddress()
    {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress)
    {
        this.emailAddress = emailAddress;
    }

    public Boolean getEmailFlag()
    {
        return emailFlag;
    }

    public void setEmailFlag(Boolean emailFlag)
    {
        this.emailFlag = emailFlag;
    }

    public Boolean isSend()
    {
        if (emailFlag || smsFlag)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}
