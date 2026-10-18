# 字体

站点使用三套开源字体，均以自托管 woff2 提供，不依赖第三方字体 CDN。

| 字体 | 文件 | 用途 | 版权 / 许可 |
| --- | --- | --- | --- |
| Noto Serif SC（Noto Serif CJK SC） | `noto-serif-sc-subset.woff2` | 中文标题、正文衬线、引文 | © 2017–2024 Adobe，SIL OFL 1.1 |
| Instrument Serif | `instrument-serif.woff2` / `instrument-serif-italic.woff2` | 拉丁文标题与数字 | © 2022 The Instrument Serif Project Authors，SIL OFL 1.1 |
| IBM Plex Mono | `ibm-plex-mono.woff2` | 期号、标签、元信息 | © 2017 IBM Corp.，SIL OFL 1.1 |

- 完整许可文本：[OFL.txt](OFL.txt)
- Noto Serif SC 是按站内实际用字生成的子集，字符表在 [`font-build/chars.txt`](../../../font-build/chars.txt)，
  生成脚本为 [`font-build/build-subset.sh`](../../../font-build/build-subset.sh)。
- 上游项目：
  - <https://github.com/notofonts/noto-cjk>
  - <https://github.com/Instrument/instrument-serif>
  - <https://github.com/IBM/plex>

修改站内文案后，如果出现子集里没有的字，请运行构建脚本重新生成字体，否则浏览器会回退到系统字体。
