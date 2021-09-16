---
title: "1.4 测试Worker性能分"
---


### 如果你没有运行过SGX测试首先需要先按照简易安装模式安装Phala脚本
```bash
sudo phala install
```

**重要提示：如果你曾经已经安装了Phala脚本只需要升级脚本即可。升级方法如下：**

```bash
sudo phala update script
```

### 性能分数测试方法：

```bash
sudo phala score-test [要使用的核心数量，核心数量根据CPU情况而定]
例如：sudo phala score-test X
```

> 一定要记得替换核心数，使用你的CPU最大核心数跑分测试，否则跑分将不准确！

跑分用的Docker不会自动结束关闭，结束跑分的方法：

```bash
sudo phala stop bench
```

在跑分结束后，程序会自动上传你的配置和跑分，如果你不希望上传，请手动输入N以结束上传。

另外，受各种环境因素影响，性能评分有可能产生一定程度的波动。此评分为预览版本，预备主网上线有变化的可能！
