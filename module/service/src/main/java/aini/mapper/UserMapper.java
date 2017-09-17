package aini.mapper;

import aini.vo.UserVO;

public interface UserMapper
{
    Integer createUser(UserVO userVO);

    Integer deleteUser(UserVO userVo);

    Integer modifyUser(UserVO userVo);

    UserVO getUser(UserVO user);
}
