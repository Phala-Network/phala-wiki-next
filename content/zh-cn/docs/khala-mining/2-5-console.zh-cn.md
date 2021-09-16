---
title: "2.5 使用控制台"
---

{{< tip "warning" >}}
Para-2 是 Phala Network (以及 Khala Network) 的第一版平行链测试网。测试网的目的是在 Khala Network 上线挖矿子系统前及早发现并解决问题，同时收集来自社区的反馈。因此在测试网络中，频繁的修改与升级是正常的。除非特殊提及，本教程中所有的区块链都指 Para-2 测试网。
{{< /tip >}}

[控制台链接入口](https://app-test.phala.network/console)

## 简介

控制台面向的用户主要是矿工及矿池主，囊括了对 Worker 及抵押池的链上操作及数据展示

## 名词解释

1. WorkerPublicKey：Worker 在注册完成后获得的唯一 ID，以 0x 开头
1. pid：即抵押池 ID，抵押池的唯一 ID

## 操作指南

### 准备

1. 有 PHA 的账户,作为抵押池所有者/Worker 操作者
1. Worker 的 WorkerPublicKey，并且该 Worker 已绑定上述账户

### 主流程

1. 连接账户（[创建和导入账户教程]({{< relref "docs/khala-user" >}})）
1. 创建抵押池
   - 点击 Create Pool!
      ![](/images/docs/khala-mining/2-5-1.png)
   - 在弹窗中点击 Confirm
   - 在插件中点击签名此交易，之后等待二十几秒
   - 创建成功的抵押池会出现在 Stakepool 列表中

3. 设置抵押池（可选）
   - 手续费
      - 点击相应抵押池的 Set Payout Pref
      - 在弹窗中输入手续费，默认是 0，可设范围是 0-100%
      - 点击 Confirm 提交交易
      - 可在 Stakepool 列表中看到该值更新

   - 最大抵押额
      - 点击相应抵押池的 Set Cap
      - 在弹窗中输入最大抵押额，默认是无限，可设范围是当前池中总抵押额（Total Stake Now）- 无限
      - 提交交易
      - 可在 Stakepool 列表中看到该值更新

4. 绑定 Worker
   - 点击相应抵押池的 Add Worker!
      ![](/images/docs/khala-mining/2-5-2.png)
   - 在弹窗中输入你想添加到该池中的 WorkerPublicKey
   - 提交交易
   - 绑定成功的 Worker 会出现在 Worker 列表中

5. 抵押
   - 在创建抵押池之后，你可以等待他人为抵押池抵押，当然你也可以自己抵押
   - 自己抵押
      - 点击相应抵押池的 Stake
      - 在弹窗中再点击 Contribute
      - 输入你想给该池抵押的抵押额，应该不大于你的 Transferrable Balance 和 Pool Cap Gap 中较小的数
      - 提交交易
      - 可点击相应抵押池的 Stake，在 Your Stake Info 下看到抵押额（Locked）变化

6. 开始挖矿
   - 点击状态（State）为 Ready Worke r的 Start
   - 在弹窗中输入你想为该 Worker 抵押的金额，请注意，开始挖矿后不能更改抵押额，除非停机；抵押额应该不小于 Smin，不大于 Smax 和 Pool Free Balance 中较小的数
   - 提交交易
   - 相应 Worker 的状态会由 Ready 变为 Mining

7. 领取奖励
   - 点击相应抵押池的 Claim
   - 查看你当前可从该池中获得的奖励，包括 Owner Reward 和 Staker Reward，该奖励会持续累积，不提取并不会减少
   - 选择或输入奖励接收账户
   - 提交交易
   - 可从账户模块中看到余额增长
### 其他操作

1. 提取抵押
   - 点击相应抵押池的 Stake
   - 在弹窗中再点击 Withdraw
   - 输入你想提取的抵押额
   - 提交交易
   - 在提交交易之后，最快你的抵押可立即全部解锁，最慢你需要等待 14 天，详细说明请见 Stakepool Wiki；你的抵押未立即解锁的部分，你可在 Stake 弹窗中的 Withdraw Queue 中查看

2. 停止挖矿
   - 点击状态为 Mining、Unresponsive 的 Worker 的 Stop
   - 提交交易
   - 相应 Worker 的状态会变为 CoolingDown

3. 移除 Worker
   - 点击状态为 Ready 的 Worker 的 Remove
   - 提交交易
   - 该 Worker 会从你的 Worker 列表中移除
## 信息介绍
### 抵押池列表（Stakepool）

1. 如果列表为空，可点击 Create Pool 来创建抵押池
1. 字段说明
   - Owner Reward：指抵押池所有者通过手续费获得的、并且当前可领取的奖励
   - Total Shares：该池总抵押份额
   - Free Stake：该池没有用于抵押的闲置资金
   - Releasing Stake：该池中处于 CoolingDown 状态的 Worker 的抵押额总和

3. Show this only 说明：点击该按钮后，Worker 列表中会只显示该抵押池的 Worker
### Worker列表（Worker）

1. 如果列表为空，可点击抵押池中的 Add Worker 来添加Worker
1. 字段说明
   - Mining Core：计算机使用核心
   - State 包括 Ready（未挖矿）、Mining（挖矿中）、Unresponsive（未响应）、CoolingDown（冷却中，计时7天变为“未挖矿”）
   - Total Reward：该 Worker 历史奖励之和
### 抵押详情（Stake Info）

1. Withdraw Queue
   - 说明：进入 Queue 的都是等待提取的资金，按照发起提取的时间排列。未及时完成的提取会导致所有Worker停机，请抵押池所有者保持关注
   - Staker：发起提取的抵押者
   - Shares：该笔提取当前未提取的 Shares，当有新的闲置资金，会按时间顺序释放未提取的 Shares
   - Countdown：倒计时结束时，如果该笔 Shares 还未释放为 0，则该抵押池下所有 Worker 会强制进入 7 天冷却期，之后停机

2. Your Stake Info
   - Locked：抵押进该池的金额
   - Shares：你的抵押用于计算的份额
