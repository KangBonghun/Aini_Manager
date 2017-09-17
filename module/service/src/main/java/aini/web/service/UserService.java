package aini.web.service;

import java.util.Calendar;
import java.util.Date;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import aini.mapper.UserMapper;
import aini.vo.UserVO;

@Service
public class UserService
{
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private SqlSession sqlSession;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public boolean createUser(UserVO user)
    {
        Integer result = 0;

        try
        {
            user.setRegistDatetime(Calendar.getInstance().getTime());

            result = sqlSession.getMapper(UserMapper.class).createUser(user);
        }
        catch (Exception e)
        {
            logger.error(e.getMessage(), e);
        }

        if (result > 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    public boolean createUser(Map<String, Object> user)
    {
        return createUser(convertMapToUserVO(user));
    }

    public boolean deleteUser(UserVO user)
    {
        Integer result = 0;

        try
        {
            result = sqlSession.getMapper(UserMapper.class).deleteUser(user);
        }
        catch (Exception e)
        {
            logger.error(e.getMessage(), e);
        }

        if (result > 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    public boolean deleteUser(Map<String, Object> user)
    {
        return deleteUser(convertMapToUserVO(user));
    }

    public boolean deleteUserById(String userId)
    {
        UserVO user = new UserVO();
        user.setUserId(userId);

        return deleteUser(user);
    }

    public boolean modifyUser(UserVO user)
    {
        Integer result = 0;

        try
        {
            result = sqlSession.getMapper(UserMapper.class).modifyUser(user);
        }
        catch (Exception e)
        {
            logger.error(e.getMessage(), e);
        }

        if (result > 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    public boolean modifyUser(Map<String, Object> user)
    {
        return modifyUser(convertMapToUserVO(user));
    }

    public UserVO getUser(UserVO user)
    {
        UserVO userVo = null;

        try
        {
            userVo = sqlSession.getMapper(UserMapper.class).getUser(user);
        }
        catch (Exception e)
        {
            logger.error(e.getMessage(), e);
        }

        return userVo;
    }

    public UserVO getUser(Map<String, Object> user)
    {
        return getUser(convertMapToUserVO(user));
    }

    public UserVO getUserById(String userId)
    {
        UserVO user = new UserVO();
        user.setUserId(userId);

        return getUser(user);
    }

    public UserVO convertMapToUserVO(Map<String, Object> map)
    {
        UserVO user = new UserVO();

        try
        {
            if (map.containsKey("userId"))
            {
                user.setUserId((String) map.get("userId"));
            }

            if (map.containsKey("userName"))
            {
                user.setUserName((String) map.get("userName"));
            }

            if (map.containsKey("password"))
            {
                user.setPassword(encodePassword((String) map.get("password")));
            }

            if (map.containsKey("userType"))
            {
                user.setUserType((String) map.get("userType"));
            }

            if (map.containsKey("sex"))
            {
                user.setSex((String) map.get("sex"));
            }

            if (map.containsKey("birthday"))
            {
                user.setBirthday((Date) map.get("birthday"));
            }

            if (map.containsKey("mobileNumber"))
            {
                user.setMobileNumber((String) map.get("mobileNumber"));
            }

            if (map.containsKey("address"))
            {
                user.setAddress((String) map.get("address"));
            }
        }
        catch (Exception e)
        {
            user = new UserVO();
        }

        return user;
    }
    
    public String encodePassword(String password)
    {
        return passwordEncoder.encode(password);
    }
}