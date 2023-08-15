# Mongodb 常用指令

```js

show databases// 查看数据库

use 数据库名 // 切换/创建数据库

db.dropDatabase() // 删除当前使用的数据库

db.cloneDatabase("127.0.0.1") // 从指定主机克隆数据库

show collections // 查看所有集合

db.集合名.drop() // 删除集合

// 插入文档
db.集合名.insert({
  "name": "2141"
})

// 更新文档
db.集合名.update({
  "name": "2141"
}, {
  $set : {
    "title": "test"
  }
})

// 查找文档
db.集合名.find({
  "name": "2141"
})

// 删除文档
db.集合名.remove({
  "name": "2141"
})

// 将 schedules 数组中的所有 interviewerId 和 interviewerName 放置到数组中
db.集合名.find().forEach(function (item) {
  item.schedules.forEach(function (schedule) {
    schedule.interviewers = [
      {
        interviewerId: schedule.interviewerId,
        interviewerName: schedule.interviewerName
      }
    ];

    db.集合名.save(item);
  });
});

// 删除 schedules 属性数组中的所有 interviewerName 属性
db.集合名.update(
  { "schedules.interviewerName": { $exists: true } },
  { $unset: { "schedules.$[].interviewerName": "" } },
  (multi = true),
  (upsert = true)
);


// 批量删除
db.集合名.deleteMany({ billId: "2222" })
```