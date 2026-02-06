// 领域/知识地图相关API

import { apiClient, useMock } from './client';
import { TechNode, DomainTreeResponse } from '../types';
import { mockTechNodes } from '../mock/domains';

export const domainApi = {
  /**
   * 获取领域树结构
   */
  getDomainTree: async (): Promise<DomainTreeResponse> => {
    if (useMock) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { domains: mockTechNodes };
    }

    return apiClient.get<DomainTreeResponse>('/gold/domains');
  },

  /**
   * 获取领域详情
   */
  getDomainDetail: async (domainId: string): Promise<TechNode> => {
    if (useMock) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const node = mockTechNodes.find(n => n.id === domainId);
      if (!node) {
        throw new Error(`Domain not found: ${domainId}`);
      }
      return node;
    }

    return apiClient.get<TechNode>(`/gold/domains/${domainId}`);
  },
};
