#!/usr/bin/env python3
"""
将 Parquet 研究人员数据转换为前端可用的 JSON 格式
"""
import json
import pandas as pd
from pathlib import Path

# 数据文件映射
INSTITUTIONS = {
    'baqis': '北京量子信息科学研究院',
    'qscgba': '粤港澳大湾区量子科学中心',
    'tsinghua': '清华大学',
    'ustc': '中国科学技术大学',
    'zju': '浙江大学',
}

def normalize_title(title: str) -> str:
    """标准化职称"""
    t = str(title).lower()
    if any(k in t for k in ['首席', '院士', '院长', 'pi']) or 'director' in t:
        return 'pi'
    if any(k in t for k in ['教授', '研究员', '博导']) or 'professor' in t:
        return 'professor'
    if any(k in t for k in ['副教授', '副研究员']) or 'associate' in t:
        return 'associate'
    if any(k in t for k in ['博士后', '助理研究员']) or 'postdoc' in t:
        return 'postdoc'
    if '博士' in t or 'phd' in t:
        return 'phd'
    return 'other'

def normalize_institution(name: str) -> str:
    """标准化机构代码"""
    n = str(name).lower()
    if '北京量子' in n or 'baqis' in n:
        return 'baqis'
    if '粤港澳' in n or '大湾区' in n or 'qscgba' in n:
        return 'qscgba'
    if '清华' in n or 'tsinghua' in n:
        return 'tsinghua'
    if '中科大' in n or 'ustc' in n or '科学技术大学' in n:
        return 'ustc'
    if '浙大' in n or 'zju' in n:
        return 'zju'
    return 'other'

def extract_name_en(name: str) -> str | None:
    """从姓名中提取英文名"""
    if '(' in name and ')' in name:
        return name[name.find('(')+1:name.find(')')].strip()
    return None

def extract_research_tags(direction: str, biography: str) -> list:
    """提取研究标签"""
    tags = []
    text = f"{direction} {biography}".lower()

    # 量子领域关键词映射
    keywords = {
        '量子计算': ['量子计算', 'quantum computing', 'quantum computation'],
        '超导量子': ['超导', 'superconducting'],
        '离子阱': ['离子阱', 'ion trap', 'trapped ion'],
        '光量子': ['光量子', '光子', 'photonic', 'photon'],
        '量子通信': ['量子通信', 'quantum communication'],
        '量子纠错': ['量子纠错', 'quantum error correction'],
        '量子算法': ['量子算法', 'quantum algorithm'],
        '量子模拟': ['量子模拟', 'quantum simulation'],
        '量子网络': ['量子网络', 'quantum network'],
        '量子密码': ['量子密码', 'quantum cryptography'],
        '量子传感': ['量子传感', '量子测量', 'quantum sensing'],
        '拓扑量子': ['拓扑量子', 'topological'],
        'NV色心': ['nv', 'nv center', '色心'],
    }

    for tag, keywords_list in keywords.items():
        if any(kw in text for kw in keywords_list):
            tags.append(tag)

    return tags[:5]  # 最多返回5个标签

def parse_education(biography: str) -> list:
    """从简介中解析教育背景"""
    education = []
    if not biography:
        return education

    lines = str(biography).split('\n')
    in_education = False

    for line in lines:
        line = line.strip()
        if '教育背景' in line or 'education' in line.lower():
            in_education = True
            continue
        if in_education:
            if line.startswith('【') or line.startswith('['):
                break
            if line and len(line) > 5:
                # 简单提取年份和学校
                edu = {}
                if '年' in line:
                    for i, char in enumerate(line):
                        if char == '年':
                            year_str = line[max(0, i-4):i]
                            if year_str.isdigit():
                                edu['year'] = year_str
                                break
                education.append(edu)

    return education

def parse_career(biography: str) -> list:
    """从简介中解析工作经历"""
    career = []
    if not biography:
        return career

    lines = str(biography).split('\n')
    in_career = False

    for line in lines:
        line = line.strip()
        if '工作经历' in line or 'work experience' in line.lower():
            in_career = True
            continue
        if in_career:
            if line.startswith('【') or line.startswith('['):
                break
            if line and len(line) > 5:
                career.append({'text': line[:200]})

    return career

def convert_single_file(parquet_path: Path) -> list:
    """转换单个 Parquet 文件"""
    df = pd.read_parquet(parquet_path)
    records = []

    for idx, row in df.iterrows():
        raw = row.to_dict()

        institution = normalize_institution(raw.get('institution', ''))
        name = str(raw.get('name', ''))
        name_en = extract_name_en(name)
        name_clean = name.split('（')[0].strip() if '（' in name else name.strip()

        record = {
            'id': f"{institution}_{name_clean}",
            'name': name_clean,
            'nameEn': name_en,
            'url': str(raw.get('url', '')),
            'title': str(raw.get('title', '')),
            'titleNormalized': normalize_title(raw.get('title', '')),
            'email': str(raw.get('email', '')),
            'institution': institution,
            'institutionRaw': str(raw.get('institution', '')),
            'department': str(raw.get('department', '')) if raw.get('department') else None,
            'researchDirection': str(raw.get('research_direction', '')) if raw.get('research_direction') else None,
            'researchTags': extract_research_tags(
                str(raw.get('research_direction', '')),
                str(raw.get('biography', ''))
            ),
            'biography': str(raw.get('biography', '')),
            'education': parse_education(raw.get('biography', '')),
            'career': parse_career(raw.get('biography', '')),
        }

        records.append(record)

    return records

def main():
    # 从脚本所在目录计算路径
    script_dir = Path(__file__).parent
    # 数据目录在: 信息-认知-知识库/data/people
    data_dir = script_dir.parent.parent / 'data' / 'people'
    # 输出到: quantum-engine/public/data/people.json
    output_path = script_dir.parent / 'public' / 'data' / 'people.json'

    all_records = []

    for code in INSTITUTIONS.keys():
        parquet_file = data_dir / f"{code}_result.parquet"
        if parquet_file.exists():
            print(f"Processing {parquet_file.name}...")
            records = convert_single_file(parquet_file)
            all_records.extend(records)
            print(f"  -> {len(records)} records")
        else:
            print(f"Warning: {parquet_file} not found")

    # 确保输出目录存在
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # 写入 JSON（使用 ensure_ascii=False 保持中文，严格转义特殊字符）
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(all_records, f, ensure_ascii=False, indent=2, default=str)

    print(f"\n[OK] Converted {len(all_records)} records to {output_path}")

    # 统计信息
    from collections import Counter
    inst_counts = Counter(r['institution'] for r in all_records)
    title_counts = Counter(r['titleNormalized'] for r in all_records)

    print("\nInstitution distribution:")
    for inst, count in inst_counts.most_common():
        print(f"  {inst}: {count}")

    print("\nTitle distribution:")
    for title, count in title_counts.most_common():
        print(f"  {title}: {count}")

if __name__ == '__main__':
    main()
