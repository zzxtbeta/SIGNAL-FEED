// 信号相关API

import { apiClient, useMock } from './client';
import { SignalDetail, SignalFilters, SignalListResponse } from '../types';
import { realWorldSignals } from '../data/realWorldSignals';

export const signalApi = {
  /**
   * 获取信号列表
   */
  getSignals: async (filters?: SignalFilters): Promise<SignalListResponse> => {
    if (useMock) {
      // Mock实现 - 使用真实量子科技数据
      await new Promise(resolve => setTimeout(resolve, 300)); // 模拟网络延迟
      
      let filteredSignals = [...realWorldSignals];
      
      // 类型筛选
      if (filters?.type && filters.type !== '全部') {
        filteredSignals = filteredSignals.filter(s => s.type === filters.type);
      }
      
      // 优先级筛选
      if (filters?.priority && filters.priority !== 'all') {
        filteredSignals = filteredSignals.filter(s => s.priority === filters.priority);
      }

      // 时间范围筛选
      if (filters?.timeRange && filters.timeRange !== 'all') {
        const days = parseInt(filters.timeRange);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        filteredSignals = filteredSignals.filter(s => new Date(s.timestamp) >= cutoffDate);
      }

      // 分页
      const page = filters?.page || 1;
      const pageSize = filters?.pageSize || 20;
      const start = (page - 1) * pageSize;
      const paginatedSignals = filteredSignals.slice(start, start + pageSize);
      
      return {
        total: filteredSignals.length,
        page,
        pageSize,
        signals: paginatedSignals,
      };
    }

    // 真实API实现
    return apiClient.get<SignalListResponse>('/signals', {
      type: filters?.type !== '全部' ? filters?.type : undefined,
      priority: filters?.priority !== 'all' ? filters?.priority : undefined,
      time_range: filters?.timeRange,
      page: filters?.page,
      page_size: filters?.pageSize,
    });
  },

  /**
   * 获取单个信号详情
   */
  getSignalById: async (id: string): Promise<SignalDetail> => {
    if (useMock) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const signal = realWorldSignals.find(s => s.id === id);
      if (!signal) {
        throw new Error(`Signal not found: ${id}`);
      }
      return {
        ...signal,
        whyImportant: [
          '代表量子科技领域重要进展',
          '涉及核心技术突破或产业化应用',
          '与国家战略规划高度相关',
        ],
      };
    }

    return apiClient.get<SignalDetail>(`/signals/${id}`);
  },
};
