import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { BackendPapersResponse } from '../types/backend';
import { adaptPapersResponse } from '../adapters/paperAdapter';
import { Signal } from '../types';

export const useDomainPapers = (domainIds?: number[]) => {
  const [papers, setPapers] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!domainIds || domainIds.length === 0) {
      setPapers([]);
      setTotal(0);
      return;
    }

    const fetchPapers = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('🔍 Fetching papers for domain IDs:', domainIds);
        
        // API v2.1: domain_ids 使用 OR 逻辑，一次请求即可
        const response = await apiClient.get<BackendPapersResponse>('/papers', {
          domain_ids: domainIds.join(','), // OR逻辑：包含任一领域即可
          page: 1,
          page_size: 200, // API上限已提升到200
          sort_by: 'publish_date', // 按发表日期排序
          sort_order: 'desc', // 降序（最新的在前）
        });
        
        console.log('📚 Papers fetched:', {
          domainIds,
          returned: response.papers.length,
          total: response.total,
          page: response.page,
          pageSize: response.page_size
        });
        
        // 转换为前端Signal格式
        const paperSignals = adaptPapersResponse(response.papers);
        
        setPapers(paperSignals);
        setTotal(response.total);
      } catch (err) {
        console.error('❌ Failed to fetch domain papers:', err);
        setError(err as Error);
        setPapers([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [domainIds?.join(',')]);

  return { papers, loading, error, total };
};
