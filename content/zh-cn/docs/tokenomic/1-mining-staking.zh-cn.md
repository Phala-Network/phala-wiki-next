---
title: "1 Phala挖矿抵押设计"
---


# 简介

Phala Network为了实现计算节点的安全性，除了给计算节点设置安全等级之外，还在挖矿行为中引入了staking概念。每个计算节点通过抵押与自己CPU得分匹配的PHA代币数量，才能获得V值，从而进入挖矿系统开始挖矿。

如果计算节点表现与系统要求不符，则会被惩罚V值，从而引导计算节点网络状态符合规则。


## 角色介绍

| 角色 | 介绍 | 识别符 |
|----|----|----|
| Worker | 计算节点，以cpu为单位。在Phala网络负责链下计算（隐私环境内） | worker Key |
| Operator | 由worker授权的管理员，负责管理该worker的挖矿行为 | operator key |
| Owner | 创建StakePool的地址，负责对pool和pool绑定的worker进行管理 | owner key |
| StakePool | 抵押池，作为矿机与抵押者之间资金流动的中间层，服务于挖矿抵押场景的链上操作 | pid （系统自动生成） |
| Staker | 持有PHA币的地址，可以通过stake参与Phala挖矿行为中 | staker key |

## 角色关系

|    | Operator | Owner | Staker |
|----|----|----|----|
| Worker | 每个worker只能授权给一个operator；一个operator可以拥有多个worker | 当某个worker的operator是某个pool的owner的时候，这个pool可以抵押币给该worker | / |
| StakePool | 当某个pool的owner是某个worker的operator的时候，这个pool可以抵押币给该worker | 一个owner可以创建多个pool；每个pool只能绑定一个owner | 一个staker可以给多个pool抵押；每个pool也可以拥有多个staker |


### 计算节点与抵押池的关系

![](/images/docs/tokenomic/worker-stakepool.png)
<center>Figure 1 Worker-StakePool</center>

如图1，

* 当计算节点worker（如 a,b,c）被创建后，worker需要先授权给某个operator地址 (如A) 去管理计算节点
* Owner （如Owner-A）创建了 StakePool （如pool-1）
* 因为A既是**pool-1**的owner，又是worker {a,b,c} 的operator，因此worker {a,b} 与pool-1产生了绑定关系，因此worker {c} 与pool-2产生了绑定关系。pool-1中的已抵押PHA可以分配给worker{a,b}进行抵押操作，pool-2中的已抵押PHA可以分配给worker{c}进行抵押操作
* 同理，B是pool-3的所有者，因此B管理的worker {d,e} 可以绑定在pool-3上


不可成立的关系

> worker-c先授权给了A，因此它无法同时授权给B。如果worker-c想要转移控制权给B，则它必须中止挖矿
>
> pool-2已经被A所创建和绑定，B无法与pool-2发生关系，B只能自己创建pool-3


### 抵押者与机器的关系


![](/images/docs/tokenomic/staker-worker-1.png)
<center>图 2.1 Original Staking</center>


如图2.1，我们依然假设owner-A管理pool-1，pool-1绑定了worker{a,b,c}；owner-B管理pool-3，pool-3绑定了worker{d,e}。并且：

* A给pool-1设置了50%的分佣率 (commission=50%)，并且给pool-1抵押了20k个PHA
* B给pool-3设置了40%的分佣率 (commission=40%)，并且给pool-3抵押了10k个PHA


我们假设**a,b,c,d,e的最小抵押额分别为：10k, 12.3k, 10k, 5k和5k**

此时我们可以看到，pool-1不足以给绑定的全部worker进行最小值抵押：pool-3可以给绑定的全部worker进行抵押

| StakePool | Pool总额 | Worker | Worker所需抵押额 |
|----|----|----|----|
| No.1 | 20k | a,b,c | 32.3k |
| No.3 | 10k | d,e | 10k |


则他们的最佳策略为：

* pool-1给b抵押12.3k，让b开始工作
* pool-3给d和e分别抵押5k，让d和e开始工作


**为了避免worker大规模发生因最小抵押额不足而无法工作的情况，我们创造了stakepool协议，允许第三方staker将代币质押到stakepool中。**


假设Staker ①和Staker④ 给pool-1分别抵押了0.3k和13k， Staker②和Staker③ 给pool-3分别抵押了0.5k和20k：

![](/images/docs/tokenomic/staker-worker-1.png)
<center>图 2.2 Original Staking</center>


如图2.2，此时我们可以看到，pool-1和pool-3均可以给绑定的全部worker进行最小额抵押，他们此时甚至可以对worker进行超额抵押：

| StakePool | Pool总额 | Worker | Worker最小抵押额 | 实际抵押额 |
|----|----|----|----|----|
| No.1 | 33.3k | a | 10k | 10k |
| No.1 | 33.3k | b | 12.3k | 13.3k |
| No.1 | 33.3k | c | 10k | 10k |
| No.3 | 30.5k | d | 5k | 15k |
| No.3 | 30.5k | e | 5k | 15k |


此时，Stakepool的币将会分为两种状态：deposit（已抵押）和free（未抵押）

| StakePool | Deposit金额 | Free金额 |
|----|----|----|
| No.1 | 33.3k | 0 |
| No.3 | 30k | 0.5k |


在实际操作中，每个Pool owner可以为该pool设置一个最大接受抵押额，以避免pool的抵押额份额被恶意稀释：

* 当pool未达到最大抵押额时，任何staker都可以加入抵押
* 当pool已达到最大抵押额时，staker无法继续为其抵押

### 奖励结算关系

当挖矿奖励产生时，挖矿模块会根据当前网络的计算节点统计和结算，并将每个计算节点对应的奖励发放至对应的Stakepool。Stakepool入账的奖励会根据pool的commission自动分成两部分，一部分是存入pool的owner地址，一部分是存入staker的地址，这部份奖励token将会由所有者自行领取。


我们假设在42号区块时，Phala网络为计算节点生产了64个PHA奖励。假设此时上文中的worker{a,b,c,d,e}均在线且只有这五个计算节点在线且他们的V值与上小节中的**实际抵押额**等比，则挖矿模块将会把worker{a,b,c,d,e}的应得奖励记录至pool-1和pool-3中，并根据commission分别结算给Owner和Staker。


![](/images/docs/tokenomic/reward-pool.png)
<center>图 3 Reward distribution</center>

Owner和Staker的实际结算公式是：


* Owner= 奖励数量（pool）*  commission比例
* Staker= 奖励数量（pool） **（1-commission比例）**  Staker抵押额/ Pool全部抵押额


> 当owner自己也抵押的时候，owner的抵押部分视同staker
>
> Pool全部抵押额包含 deposit（已抵押）和free（未抵押）的总和


如图4所示，在我们的案例中：


pool-1的owner-A和pool-3的owner-B分别收入：

* A的owner收入=34×50%=17 PHA
* B的owner收入=30×40%=12 PHA


Staker收入：

| Staker | StakePool | Pool总收益 | 抵押额/Pool抵押总额 | Pool占比 | 获得奖励 |
|----|----|----|----|----|----|
| Owner-A | No.1 | 34*50% | 20k / 33.4k | 59.9% | 10.18 PHA |
| Owner-B | No.3 | 30*60% | 10k / 30.5k | 32.8% | 5.9 PHA |
| Staker-① | No.1 | 34*50% | 0.3k / 33.4k | 0.9% | 0.15 PHA |
| Staker-② | No.3 | 30*60% | 0.5k / 30.5k | 1.6% | 0.29 PHA |
| Staker-③ | No.3 | 30*60% | 20k / 30.5k | 65.6% | 11.81 PHA |
| Staker-④ | No.1 | 34*50% | 13k / 33.4k | 38.9% | 6.61 PHA |


### 退出抵押结算

如果owner希望取消挖矿或者提取全部抵押（不能提取staker的存款），他可以通过中止挖矿操作实现。如图在发起该类交易后，StakePool内的存款将会进行7天的解冻期，解冻期后该余额可以被解冻。


 ![](/images/docs/tokenomic/withdraw-1.png)
<center>图 4.1 Withdraw example</center>


如图4.1所示，Owner取消了挖矿之后，stakepool会中止所有worker的计算行为，并且立即进入“冷冻期”。7天之后，Owner-A，Staker-①和Staker-④之前的抵押额会被全额退回。


但是如果Staker的提取金额大于StakePool中闲置资金（Free状态余额），则Staker可以立即获得该Free状态资金，剩余待提取金额需要排队等待：


![](/images/docs/tokenomic/withdraw-2.png)
<center>图 4.2 Withdraw when there is not enough Free PHA</center>

如图4.2，Staker-③在之前抵押了20k在pool-3，当他申请取消抵押10k PHA时，pool-3立刻将free状态的0.5k余额打给了Staker-③。剩余的9.5k抵押需要等待：


* 如果有未成功提款资金，则Staker需要先等待一个7天的缓冲期，在此期间StakePool中如果加入了新的闲置资金或有worker停止挖矿，那此部份闲置资金立即解锁给Staker发起的退出交易，以此类推直到完成全部提款；
* 如果7天过后仍未完成该退出申请，则该抵押池所有worker都会进入7天的冷却期，此过程不能被任何人中止，7天过后该提款交易就可全部完成
* 也就说任意Staker发起退出交易后，最多 14 天就可以成功退出抵押


![](/images/docs/tokenomic/withdraw-3.png)
<center>Figure 4.3 Withdraw after more staking</center>

* 如图4.3，在Staker-②给pool-3又抵押了5k PHA之后，因为pool-3的free状态资金增加了5k，因此Staker-③立即获得了另外5k退款
* 在等待7天但4.5k资金仍然没有成功补充进pool-3后，系统被迫终止了pool-3的所有挖矿行为，并且在7天解冻期后自动退款4.5k至Staker-③


综上，实际worker的控制者——StakePool Owner发起中止挖矿或取消全部抵押时，将触发全部抵押取消并有7天的解冻期。解冻期后该StakePool全部抵押金额将会被退回；

当Staker发起取消抵押时，系统将判断该pool是否有free状态资金，如果有，则自动退回给Staker；如果没有闲置资金则该Pool的Owner有7天时间去补充Staker需要退回的资金，如果补充资金成功则该Pool不必强行另worker下线；如果没有成功补充资金，则系统将被迫中止该pool的全部挖矿行为以便给Staker退款（7天后成功）。
