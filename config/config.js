module.exports = {
  //数据库连接
  MONGODB_STR: 'mongodb://localhost:27017/sendmail',
  //定时任务 每隔四秒触发一次
  CRON: '*/30 * * * * *'
};