#!/usr/bin/env python3
"""
读取people目录下的parquet文件并分析字段结构
"""
import pandas as pd
import os
from pathlib import Path

# 目标目录
people_dir = Path(r"D:\code\信息-认知-知识库\data\people")

print("="*80)
print("People数据字段分析")
print("="*80)

# 列出所有parquet文件
parquet_files = list(people_dir.glob("*.parquet"))
print(f"\n找到 {len(parquet_files)} 个parquet文件:")
for f in parquet_files:
    print(f"  - {f.name}")

# 分析每个文件
for parquet_file in parquet_files:
    print(f"\n{'='*80}")
    print(f"文件: {parquet_file.name}")
    print(f"{'='*80}")
    
    try:
        # 读取parquet文件
        df = pd.read_parquet(parquet_file)
        
        print(f"\n基本信息:")
        print(f"  行数: {len(df)}")
        print(f"  列数: {len(df.columns)}")
        
        print(f"\n字段列表:")
        for i, col in enumerate(df.columns, 1):
            dtype = df[col].dtype
            non_null = df[col].notna().sum()
            null_count = df[col].isna().sum()
            null_pct = (null_count / len(df) * 100) if len(df) > 0 else 0
            
            print(f"  {i}. {col}")
            print(f"     类型: {dtype}")
            print(f"     非空: {non_null} ({100-null_pct:.1f}%)")
            print(f"     为空: {null_count} ({null_pct:.1f}%)")
            
            # 显示示例值
            sample_values = df[col].dropna().head(3).tolist()
            if sample_values:
                print(f"     示例: {sample_values}")
        
        # 显示前几行数据
        print(f"\n前3行数据预览:")
        print(df.head(3).to_string())
        
    except Exception as e:
        print(f"  ❌ 读取失败: {e}")

print(f"\n{'='*80}")
print("分析完成")
print(f"{'='*80}")
