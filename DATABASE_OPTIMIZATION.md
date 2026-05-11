# 数据库优化指南

## 索引建议

为提升数据库查询性能，建议为以下集合和字段创建索引：

### users 集合

```javascript
// 1. openid 索引（必需 - 用于用户登录查询）
{
  "collection": "users",
  "indexes": [
    {
      "name": "openid_index",
      "fields": { "openid": 1 },
      "unique": true
    }
  ]
}
```

### images 集合

```javascript
// 1. userId + createdAt 复合索引（用于用户图片列表查询）
{
  "collection": "images",
  "indexes": [
    {
      "name": "userId_createdAt_index",
      "fields": { "userId": 1, "createdAt": -1 }
    },
    {
      "name": "type_index",
      "fields": { "type": 1 }
    }
  ]
}
```

### orders 集合

```javascript
// 1. userId + createdAt 复合索引（用于订单列表查询）
{
  "collection": "orders",
  "indexes": [
    {
      "name": "userId_createdAt_index",
      "fields": { "userId": 1, "createdAt": -1 }
    },
    {
      "name": "status_index",
      "fields": { "status": 1 }
    }
  ]
}
```

### history 集合

```javascript
// 1. userId + createdAt 复合索引（用于历史记录列表查询）
{
  "collection": "history",
  "indexes": [
    {
      "name": "userId_createdAt_index",
      "fields": { "userId": 1, "createdAt": -1 }
    }
  ]
}
```

### errors 集合

```javascript
// 1. createdAt 索引（用于错误日志查询）
{
  "collection": "errors",
  "indexes": [
    {
      "name": "createdAt_index",
      "fields": { "createdAt": -1 }
    },
    {
      "name": "openid_createdAt_index",
      "fields": { "openid": 1, "createdAt": -1 }
    }
  ]
}
```

## 创建索引的 SQL 语句（如果在 MySQL 中）

```sql
-- users 表
CREATE UNIQUE INDEX idx_openid ON users(openid);
CREATE INDEX idx_createdAt ON users(createdAt);

-- images 表
CREATE INDEX idx_userId_createdAt ON images(userId, createdAt);
CREATE INDEX idx_type ON images(type);
CREATE INDEX idx_userId ON images(userId);

-- orders 表
CREATE INDEX idx_userId_createdAt ON orders(userId, createdAt);
CREATE INDEX idx_status ON orders(status);
CREATE INDEX idx_userId ON orders(userId);

-- history 表
CREATE INDEX idx_userId_createdAt ON history(userId, createdAt);
CREATE INDEX idx_userId ON history(userId);

-- errors 表
CREATE INDEX idx_createdAt ON errors(createdAt);
CREATE INDEX idx_openid_createdAt ON errors(openid, createdAt);
```

## 查询优化建议

### 1. 分页查询

使用 `skip()` 和 `limit()` 进行分页：

```javascript
const { page = 1, limit = 20 } = event;
const skip = (page - 1) * limit;

const result = await db.collection('orders')
  .where({ userId: openid })
  .orderBy('createdAt', 'desc')
  .skip(skip)
  .limit(limit)
  .get();
```

### 2. 字段投影

只查询需要的字段，减少数据传输量：

```javascript
const result = await db.collection('users')
  .where({ openid })
  .field({
    nickName: true,
    avatarUrl: true,
    totalHistory: true
  })
  .get();
```

### 3. 避免全表扫描

始终在查询中使用索引字段作为条件：

```javascript
// ❌ 不好 - 会导致全表扫描
const result = await db.collection('images').get();

// ✅ 好 - 使用索引字段
const result = await db.collection('images')
  .where({ userId: openid })
  .get();
```

### 4. 使用 count() 获取总数

```javascript
const countResult = await db.collection('orders')
  .where({ userId: openid })
  .count();

console.log('订单总数:', countResult.total);
```

## 性能监控

通过日志监控数据库查询性能：

```javascript
const { dbHelper } = require('./utils/databaseHelper');

// 分页查询
const result = await dbHelper.paginate('orders', { userId: openid }, {
  page: 1,
  limit: 20,
  orderBy: 'createdAt',
  order: 'desc'
});

console.log(result.pagination);
// {
//   total: 100,
//   page: 1,
//   limit: 20,
//   totalPages: 5,
//   hasNext: true,
//   hasPrev: false
// }
```

## 缓存策略

使用 `dbHelper` 的缓存功能：

```javascript
// 启用缓存的查询
const result = await dbHelper.query('users', { openid }, {
  useCache: true
});

// 更新数据后清除缓存
await db.collection('users').doc(id).update({ data });
dbHelper.clearCache('db_users');
```

## 数据清理策略

### 定期清理过期数据

```javascript
// 删除 30 天前的错误日志
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

await db.collection('errors')
  .where({
    createdAt: db.command.lt(thirtyDaysAgo)
  })
  .remove();
```

### 定期清理临时文件

```javascript
// 删除 7 天前的临时图片
const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

await db.collection('images')
  .where({
    type: 'temp',
    createdAt: db.command.lt(sevenDaysAgo)
  })
  .remove();
```
