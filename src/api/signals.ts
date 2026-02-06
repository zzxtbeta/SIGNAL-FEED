// 信号相关API

import { apiClient, useMock } from './client';
import { SignalDetail, SignalFilters, SignalListResponse } from '../types';
import { mockSignals } from '../mock/signals';

export const signalApi = {
  /**
   * 获取信号列表
   */
  getSignals: async (filters?: SignalFilters): Promise<SignalListResponse> => {
    if (useMock) {
      // Mock实现
      await new Promise(resolve => setTimeout(resolve, 300)); // 模拟网络延迟
      
      let filteredSignals = [...mockSignals];
      
      // 类型筛选
      if (filters?.type && filters.type !== '全部') {
        filteredSignals = filteredSignals.filter(s => s.type === filters.type);
      }
      
      // 优先级筛选
      if (filters?.priority && filters.priority !== 'all') {
        filteredSignals = filteredSignals.filter(s => s.priority === filters.priority);
      }
      
      return {
        total: filteredSignals.length,
        page: filters?.page || 1,
        pageSize: filters?.pageSize || 20,
        signals: filteredSignals,
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
      const signal = mockSignals.find(s => s.id === id);
      if (!signal) {
        throw new Error(`Signal not found: ${id}`);
      }
      return {
        ...signal,
        whyImportant: [
          '融资金额显著高于同类企业',
          '团队来自已关注的核心研究机构',
          '与近期政策导向高度相关',
        ],
      };
    }

    return apiClient.get<SignalDetail>(`/signals/${id}`);
  },
};
