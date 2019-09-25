const Users = [];
Users.push({
  id: 1,
  username: 'admin', //用户名
  name: "朱元璋", //姓名
  password: '123456', //密码
  email: '604295621@qq.com', //邮箱
  nickname: '超级管理员', //昵称
  sex: 1, //性别
  addr: '南京城一号大街'
});

Users.push({
  id: 2,
  username: 'staff',
  name: "朱棣",
  password: '654321',
  email: '604295621@qq.com',
  nickname: '普通管理员',
  sex: 1,
  addr: '北京城一号大街'
});

module.exports = Users;
