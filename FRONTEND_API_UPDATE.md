# 前端API对接更新说明 v2.1

## 更新时间
2026-02-09

## 后端API变更
根据 `docs/量子引擎后端API说明文档.md` v2.1版本更新

## 前端代码变更

### 1. 更新类型定义 (`src/types/backend.ts`)

**新增类型**：
```typescript
// 领域信息（v2.1新增）
export interface BackendDomain {
  id: number;
  name: string;
  level: 'domain' | 'direction' | 'technology';
}

// 统计信息（v2.1新增）
export interface BackendStatistics {
  by_domain: Record<string, number>;
  by_year: Record<string, number>;
  top_authors: Array<{ name: string; count: number }>;
  top_institutions: Array<{ name: string; count: number }>;
}
```

**更新类型**：
```typescript
export interface BackendPaper {
  // ... 原有字段
  domains?: BackendDomain[]; // v2.1新增：直接包含领域名称
}

export interface BackendPapersResponse {
  // ... 原有字段
  statistics?: BackendStatistics; // v2.1新增：可选的统计信息
}
```

### 2. 简化 `useDomainPapers` Hook (`src/hooks/useDomainPapers.ts`)

**优化前**（需要循环查询每个ID）：
```typescript
// 分别查询每个domain ID，然后合并去重
for (const domainId of domainIds) {
  const response = await apiClient.get('/papers', {
    domain_ids: String(domainId),
    page_size: 100
  });
  // 手动合并去重...
}
```

**优化后**（一次请求搞定）：
```typescript
// API v2.1: domain_ids 使用 OR 逻辑，一次请求即可
const response = await apiClient.get('/papers', {
  domain_ids: domainIds.join(','), // OR逻辑：包含任一领域即可
  page: 1,
  page_size: 200, // API上限已提升到200
  sort_by: 'publish_date',
  sort_order: 'desc'
});
```

**新增返回值**：
```typescript
return { 
  papers,      // 论文列表
  loading,     // 加载状态
  error,       // 错误信息
  total        // 总数（新增）
};
```

### 3. 更新 KnowledgeMap 页面 (`src/pages/KnowledgeMap.tsx`)

**使用新的total字段**：
```typescript
const { papers, loading: papersLoading, total: papersTotal } = useDomainPapers(currentDomainIds);

// 显示准确的论文总数
<span className="text-xs text-neutral-400">
  (共 {papersTotal} 篇
  {papers.length < papersTotal ? `，显示前 ${papers.length} 篇` : ''}
  {selectedYear !== 'all' ? `，筛选后 ${filteredPapers.length} 篇` : ''})
</span>
```

## API调用示例

### 基础查询
```typescript
// 查询量子测量/传感及其子领域的所有论文
const response = await apiClient.get('/papers', {
  domain_ids: '4,31,32,33,35,36,34,30', // OR逻辑
  page_size: 200,
  sort_by: 'publish_date',
  sort_order: 'desc'
});

console.log(response.total);  // 210篇（准确总数）
console.log(response.papers.length);  // 200篇（当前页）
```

### 带统计信息的查询
```typescript
const response = await apiClient.get('/papers', {
  domain_ids: '2,10,12,13',
  page_size: 100,
  include_stats: true  // 获取统计信息
});

// 使用统计信息
console.log(response.statistics.by_domain);  // 各领域论文数
console.log(response.statistics.by_year);    // 各年份论文数
console.log(response.statistics.top_authors); // 高产作者
```

### 使用论文的domains字段
```typescript
// 论文现在直接包含领域名称，无需额外查询
response.papers.forEach(paper => {
  paper.domains.forEach(domain => {
    console.log(`${domain.name} (${domain.level})`);
    // 输出: "量子测量/传感 (direction)"
    //      "NV色心传感 (technology)"
  });
});
```

## 性能提升

### 请求次数对比

**优化前**：
- 查询8个domain需要 **8个HTTP请求**
- 需要额外查询 `/gold/domains` 获取领域名称（**+1个请求**）
- 总计：**9个请求**

**优化后**：
- 查询8个domain只需 **1个HTTP请求**
- 论文自动包含领域名称，无需额外查询
- 总计：**1个请求**

**性能提升**：请求次数减少 **89%**

### 数据量对比

**优化前**：
- 每个请求最多100篇论文
- 查询210篇论文需要至少3次请求（分页）
- 总计：**至少11个请求**（8个domain查询 + 3次分页 + 1次领域查询）

**优化后**：
- 单次请求最多200篇论文
- 查询210篇论文需要2次请求（分页）
- 总计：**2个请求**

**性能提升**：请求次数减少 **82%**

## 数据准确性提升

### 查询结果对比

| 领域 | 优化前（AND逻辑） | 优化后（OR逻辑） | 提升 |
|------|------------------|-----------------|------|
| 量子测量/传感 | 4篇 | 210篇 | +5150% |
| 量子计算 | 5篇 | 205篇 | +4000% |
| 量子基础设施 | 3篇 | 338篇 | +11167% |
| 超导量子计算 | 1篇 | 19篇 | +1800% |

## 待后端部署完成后测试

后端API可能正在部署中（当前返回502），部署完成后请测试：

1. **OR逻辑验证**：
   ```bash
   curl -H "X-API-Key: xK7mP9nQ2wR5tY8uI1oL4aS6dF3gH0jK" \
     "http://120.26.144.61:8080/papers?domain_ids=4,31,32,33&page_size=200"
   ```
   预期：返回约200篇论文

2. **domains字段验证**：
   检查返回的论文是否包含 `domains` 字段

3. **统计信息验证**：
   ```bash
   curl -H "X-API-Key: xK7mP9nQ2wR5tY8uI1oL4aS6dF3gH0jK" \
     "http://120.26.144.61:8080/papers?domain_ids=2&include_stats=true"
   ```
   预期：返回包含 `statistics` 字段

4. **page_size=200验证**：
   ```bash
   curl -H "X-API-Key: xK7mP9nQ2wR5tY8uI1oL4aS6dF3gH0jK" \
     "http://120.26.144.61:8080/papers?domain_ids=5&page_size=200"
   ```
   预期：可以返回超过100篇论文

## 前端刷新测试

后端部署完成后，刷新前端页面，应该能看到：

1. ✅ 知识地图自动选中第一个技术节点
2. ✅ 右侧显示大量论文（不再是零星几篇）
3. ✅ 时间线标题显示准确的论文总数
4. ✅ 控制台日志显示正确的API调用和返回数据
5. ✅ 论文卡片可以点击查看详情

## 回滚方案

如果后端API有问题，可以临时回滚到之前的循环查询方案：

```typescript
// 在 useDomainPapers.ts 中恢复循环查询逻辑
for (const domainId of domainIds) {
  const response = await apiClient.get('/papers', {
    domain_ids: String(domainId),
    page_size: 100
  });
  // 合并去重...
}
```

但这只是临时方案，强烈建议后端完成API优化。
