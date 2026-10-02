# Source audit

The attached `创新育人.zip` was inspected as a project archive. Both binary Word reports were converted locally for text/image extraction. Their private cover-page details, old API keys and account-console images are not published.

| Source | Treatment |
|---|---|
| Jinxiao Wan final report | Main evidence for game, integration, requirements and screenshots |
| Companion final report | Corroborating description of search and recognition tests |
| `垃圾分类小程序2` | Primary complete mini program preserved under `legacy/wechat/` |
| `garbage_sort_mini-master.rar` | Earlier recognition/search variant; archive entries inspected |
| `垃圾分类小程序2.rar` and `.zip` | Companion mini-program variants, not duplicated in the published tree |
| `waste_sorting` variants | Earlier game/service scaffolding with unused shopping/payment pages; omitted |
| `垃圾分类小游戏/main.py` | WXML fragment despite Python extension; not a hardware driver |
| Requirement DOCX files | Used to explain goals and planned features |
| Java coursework and IDE metadata | Unrelated coursework; omitted |

No original training code, trained weights, accuracy benchmark, GPIO program, wiring/CAD file or hardware prototype photograph was located in the supplied evidence.

## Published source changes

Legacy `cloudfunctions/baiduAccessToken/index.js` has its key and secret replaced with placeholders. The old cloud environment identifier and embedded Tencent Maps key in `miniprogram/app.js` are replaced as well. Generated lockfiles are omitted. Source and output hashes are recorded in [source-manifest.json](source-manifest.json); visual extraction locations and hashes are in [visual-sources.json](visual-sources.json).

The report screenshots containing API credentials, spending/account pages, cloud-console details and configuration dialogs are omitted. Original app screens and test screenshots are published as compressed JPEGs. No generated images are presented as historical evidence.

The original README credits an upstream mini-program article. ColorUI, dictionary material and parts of the mini program are recovered third-party dependencies. Their original licence terms were not established by the archive; no blanket MIT licence is applied. New browser code and original recovered material are distinguished by directory and documentation.
