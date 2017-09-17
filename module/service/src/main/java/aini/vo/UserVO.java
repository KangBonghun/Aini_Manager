package aini.vo;

import java.util.Date;

public class UserVO
{
    private String userId;
    private String userName;
    private String password;
    private String userType;
    private String sex;
    private Date birthday;
    private String mobileNumber;
    private String email;
    private String address;
    private String associationId;
    private Date registDatetime;
    private Date changeDatetime;
    private Date lastLoginDatetime;
    public String getUserId()
    {
        return userId;
    }
    public void setUserId(String userId)
    {
        this.userId = userId;
    }
    public String getUserName()
    {
        return userName;
    }
    public void setUserName(String userName)
    {
        this.userName = userName;
    }
    public String getPassword()
    {
        return password;
    }
    public void setPassword(String password)
    {
        this.password = password;
    }
    public String getUserType()
    {
        return userType;
    }
    public void setUserType(String userType)
    {
        this.userType = userType;
    }
    public String getSex()
    {
        return sex;
    }
    public void setSex(String sex)
    {
        this.sex = sex;
    }
    public Date getBirthday()
    {
        return birthday;
    }
    public void setBirthday(Date birthday)
    {
        this.birthday = birthday;
    }
    public String getMobileNumber()
    {
        return mobileNumber;
    }
    public void setMobileNumber(String mobileNumber)
    {
        this.mobileNumber = mobileNumber;
    }
    public String getEmail()
    {
        return email;
    }
    public void setEmail(String email)
    {
        this.email = email;
    }
    public String getAddress()
    {
        return address;
    }
    public void setAddress(String address)
    {
        this.address = address;
    }
    public String getAssociationId()
    {
        return associationId;
    }
    public void setAssociationId(String associationId)
    {
        this.associationId = associationId;
    }
    public Date getRegistDatetime()
    {
        return registDatetime;
    }
    public void setRegistDatetime(Date registDatetime)
    {
        this.registDatetime = registDatetime;
    }
    public Date getChangeDatetime()
    {
        return changeDatetime;
    }
    public void setChangeDatetime(Date changeDatetime)
    {
        this.changeDatetime = changeDatetime;
    }
    public Date getLastLoginDatetime()
    {
        return lastLoginDatetime;
    }
    public void setLastLoginDatetime(Date lastLoginDatetime)
    {
        this.lastLoginDatetime = lastLoginDatetime;
    }
    
    

}
