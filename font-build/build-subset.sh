#!/usr/bin/env sh
# 重新生成网页用的 Noto Serif SC 子集。
#
# 依赖：python -m pip install fonttools brotli
# 源字体（约 55 MB，未入库）：
#   https://github.com/notofonts/noto-cjk
#   文件：NotoSerifCJKsc-VF.otf
#
# 用法：
#   sh build-subset.sh /path/to/NotoSerifCJKsc-VF.otf
#   sh build-subset.sh /path/to/NotoSerifCJKsc-VF.otf /tmp/test.woff2
set -eu
cd "$(dirname "$0")"

SOURCE="${1:-NotoSerifCJKsc-VF.otf}"
OUT="${2:-../web/assets/fonts/noto-serif-sc-subset.woff2}"

if [ ! -f "$SOURCE" ]; then
  echo "找不到源字体：$SOURCE" >&2
  echo "请从 https://github.com/notofonts/noto-cjk 下载 NotoSerifCJKsc-VF.otf 后重试。" >&2
  exit 1
fi

python -m fontTools.subset "$SOURCE" \
  --text-file=chars.txt \
  --flavor=woff2 \
  --output-file="$OUT" \
  --layout-features='*' \
  --no-hinting \
  --name-IDs='*' \
  --name-legacy \
  --name-languages='*' \
  --notdef-glyph \
  --notdef-outline \
  --recommended-glyphs

echo "已生成：$OUT"
