#!/usr/bin/env python3
"""
分析论文的domain_ids分布
"""
import requests
import json
from collections import Counter, defaultdict

API_BASE = "http://120.26.144.61:8080"
API_KEY = "xK7mP9nQ2wR5tY8uI1oL4aS6dF3gH0jK"

headers = {
    "accept": "application/json",
    "X-API-Key": API_KEY
}

def get_all_papers():
    """获取所有论文"""
    papers = []
    page = 1
    page_size = 100
    
    while True:
        print(f"Fetching page {page}...")
        response = requests.get(
            f"{API_BASE}/papers",
            params={"page": page, "page_size": page_size},
            headers=headers
        )
        data = response.json()
        papers.extend(data["papers"])
        
        if len(papers) >= data["total"]:
            break
        page += 1
    
    return papers

def get_domains():
    """获取领域树"""
    response = requests.get(
        f"{API_BASE}/gold/domains",
        params={"min_paper_count": 0},
        headers=headers
    )
    return response.json()

def flatten_domains(domains, parent_name=""):
    """扁平化领域树"""
    result = {}
    for domain in domains:
        full_name = f"{parent_name} > {domain['name']}" if parent_name else domain['name']
        result[domain['id']] = {
            'name': domain['name'],
            'full_name': full_name,
            'level': domain['level'],
            'parent_id': domain['parent_id']
        }
        if domain.get('children'):
            result.update(flatten_domains(domain['children'], full_name))
    return result

def analyze_papers():
    """分析论文分布"""
    print("=" * 80)
    print("论文Domain分布分析")
    print("=" * 80)
    
    # 获取数据
    print("\n1. 获取所有论文...")
    papers = get_all_papers()
    print(f"   总共 {len(papers)} 篇论文")
    
    print("\n2. 获取领域树...")
    domains_tree = get_domains()
    domains_map = flatten_domains(domains_tree)
    print(f"   总共 {len(domains_map)} 个领域节点")
    
    # 统计domain_ids
    print("\n3. 统计论文的domain_ids分布...")
    domain_counter = Counter()
    papers_without_domains = []
    papers_with_multiple_domains = []
    
    for paper in papers:
        domain_ids = paper.get('domain_ids', [])
        if not domain_ids:
            papers_without_domains.append(paper['id'])
        elif len(domain_ids) > 1:
            papers_with_multiple_domains.append({
                'id': paper['id'],
                'title': paper['title'][:60],
                'domain_ids': domain_ids
            })
        
        for domain_id in domain_ids:
            domain_counter[domain_id] += 1
    
    # 按层级分组统计
    print("\n" + "=" * 80)
    print("按层级统计")
    print("=" * 80)
    
    by_level = defaultdict(list)
    for domain_id, count in domain_counter.items():
        if domain_id in domains_map:
            level = domains_map[domain_id]['level']
            by_level[level].append((domain_id, count))
    
    for level in ['domain', 'direction', 'technology']:
        print(f"\n【{level.upper()}层】")
        items = sorted(by_level[level], key=lambda x: x[1], reverse=True)
        for domain_id, count in items:
            domain_info = domains_map[domain_id]
            print(f"  {domain_info['full_name']:<60} {count:>4} 篇")
    
    # 详细的technology层统计
    print("\n" + "=" * 80)
    print("Technology层详细统计（按direction分组）")
    print("=" * 80)
    
    # 找出所有direction
    directions = {did: info for did, info in domains_map.items() if info['level'] == 'direction'}
    
    for dir_id, dir_info in sorted(directions.items(), key=lambda x: x[1]['name']):
        print(f"\n【{dir_info['full_name']}】")
        
        # 找出该direction下的所有technology
        technologies = [
            (did, info, domain_counter.get(did, 0))
            for did, info in domains_map.items()
            if info['level'] == 'technology' and info['parent_id'] == dir_id
        ]
        
        technologies.sort(key=lambda x: x[2], reverse=True)
        
        total_papers = sum(count for _, _, count in technologies)
        print(f"  总计: {total_papers} 篇论文")
        
        for tech_id, tech_info, count in technologies:
            print(f"    - {tech_info['name']:<40} {count:>4} 篇")
    
    # 问题统计
    print("\n" + "=" * 80)
    print("数据质量分析")
    print("=" * 80)
    
    print(f"\n没有domain_ids的论文: {len(papers_without_domains)} 篇")
    if papers_without_domains:
        print(f"  论文ID: {papers_without_domains[:10]}")
        if len(papers_without_domains) > 10:
            print(f"  ... 还有 {len(papers_without_domains) - 10} 篇")
    
    print(f"\n有多个domain_ids的论文: {len(papers_with_multiple_domains)} 篇")
    if papers_with_multiple_domains:
        print("  示例:")
        for item in papers_with_multiple_domains[:5]:
            domain_names = [domains_map.get(did, {}).get('name', f'ID:{did}') for did in item['domain_ids']]
            print(f"    [{item['id']}] {item['title']}")
            print(f"         领域: {', '.join(domain_names)}")
    
    # 统计每个direction的论文数（包括其下所有technology）
    print("\n" + "=" * 80)
    print("Direction层论文总数（含子technology）")
    print("=" * 80)
    
    for dir_id, dir_info in sorted(directions.items(), key=lambda x: x[1]['name']):
        # direction自己的论文
        dir_papers = domain_counter.get(dir_id, 0)
        
        # 所有子technology的论文
        tech_papers = sum(
            domain_counter.get(did, 0)
            for did, info in domains_map.items()
            if info['level'] == 'technology' and info['parent_id'] == dir_id
        )
        
        total = dir_papers + tech_papers
        print(f"  {dir_info['name']:<30} direction: {dir_papers:>3} + technology: {tech_papers:>3} = {total:>3} 篇")

if __name__ == "__main__":
    analyze_papers()
