#!/bin/bash

# 指定目录路径
target_directory=$1

# 进入目标目录
cd "$target_directory" || exit

for file in *.js; do
  if [ -f "$file" ]; then
    mv "$file" "${file%.js}.ts"
    echo "File $file renamed to ${file%.js}.ts"
  fi
done
