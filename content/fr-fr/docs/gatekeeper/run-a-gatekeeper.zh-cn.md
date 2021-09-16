---
title: "运行 Gatekeeper"
date: 2020-07-10T01:16:05+08:00
draft: true
---

## 配置要求

### 硬件
- **CPU**：英特尔6代（最好8代）双核及以上奔腾/赛扬/酷睿芯片
- **内存**：2G（最好8G）
- **磁盘空间**：40-80 GB（越大越好，建议采用 NVMe 固态硬盘，每六个月需要重新评估节点磁盘占用大小）

### 软件
- **系统**：Ubuntu 18.04 / 20.04
- **[安装 Docker-CE](https://www.yuque.com/fagephalanetwork/miner/hyrrwa)**
- **[安装并启动 SGX 驱动](https://www.yuque.com/fagephalanetwork/miner/yylp17)**
- **网络环境**：建议使用一级运营商的网络，有公网更好。

<br>

##  同步链上数据

1. 下载 Phala Gatekeeper [资源包](https://www.yuque.com/fagephalanetwork/vendettatutorial/bt1f8q)。
2. 将该文件放到 /home（家） 文件夹内。
3. 输入以下指令。vim 指令过后，会进入Vim，在其中将 YOUR NAME 替换成节点名字（确认当前输入法为英文输入法，按下 `a` ，进入可编辑的状态）。

```bash
cd ~/phala
sudo cp ./poc3_validator.service /etc/systemd/system
sudo systemctl enable poc3_validator.service
sudo systemctl start poc3_validator.service
sudo vim validator.sh
```

4. 再次确认当前输入法为英文输入法。按下 `ESC` 再按 `Shift` + `;` ，底部出现光标，输入 `wq` ，回车保存退出；
5. 打开 [https://telemetry.polkadot.io/#list/Phala%20PoC-3](https://telemetry.polkadot.io/#list/Phala%2520PoC-3) ，点击 `BEST BLOCK` 下面的长条形的标题位置，即可按首字母顺序或倒序显示节点名字。点击一个节点，即可选中它，在默认排序中置顶。等待区块高度完成同步。根据网速不同，这一步可能需要1-2小时。等待期间，可以同时做 第2步 和 第3步。但第4步必须要等到区块高度完成同步。

> 也可以直接从 [Phala-Network/phala-blockchain](https://github.com/Phala-Network/phala-blockchain) 代码库的 **master分支** 上直接编译 `phala-node`。如果你倾向于用SSH链接Github，也可以把以下第一条命令替换为
> `git clone git@github.com/Phala-Network/phala-blockchain.git`.

```sh
  git clone https://github.com/Phala-Network/phala-blockchain
  cd phala-blockchain
  ./scripts/init.sh
  git submodule update --init
  cargo build --release
```

这一步会比较消耗时间（大约 10 - 40 分钟，取决于硬件配置和网速）。

> 如果你在编译的时候遇到编译错误，就可能需要切换到一个稍旧一点的 Nightly Rust 版本，可以通过以下命令实现：
>
> ```sh
> rustup install nightly-2020-11-10
> rustup override set nightly-2020-11-10
> rustup target add wasm32-unknown-unknown --toolchain nightly-2020-05-15
> ```
> 如果你希望在本地生成密钥，也可以在同一目录下安装 `subkey`。如果想进一步提高安全性，则可以把编译好的 `subkey` 程序发送到一台全新且断网的电脑上进行操作。
> ```sh
> cargo install --force --git https://github.com/paritytech/substrate > subkey
> ```

默认情况下，Gatekeeper节点处于归档模式(Archive)。 如果你以非归档模式同步了链上数据，需要先使用 `phala-node purge-chain` 删除数据库，然后启用 `--pruning=archive` 命令行选项。
>
> 你可以使用以下指令在非归档模式下运行 Gatekeeper 节点：`-unsafe-pruning --pruning <块数>`。但是请注意，归档节点和非归档节点的数据库彼此不兼容。要进行切换，需要清除链上数据。

如果你不想立即以守门人模式启动节点，可以运行以下指令同步节点：

```bash
./phala-node --pruning=archive
```

> `--validator` 和 `--sentry` 选项中已经包含了 `--pruning=archive` 选项。所以，只有在没有启用上述选项的情况下，才需要特殊指定该选项。如果你没有运行存档节点，或未以守门人、哨兵身份运行节点，当你切换的时候，需要重新同步数据库。
>
> *守门人需要用 RocksDb 后端进行同步。RocksDb 是一个默认设置，但可以用 `--database RocksDb` 选项来明确声明。将来，我们建议使用更快和更高效的 ParityDb。在不同数据库后端之间切换，同样也需要重新同步。
>
> 如果你现在就想测试 ParityDB，可以开启 `--database paritydb` 参数。
>
> 在主网“软启动”的过程中（测试网络不受此影响），如果你没有 PHA 代币，基本上就只能跟着教程做到这一步了。你可以运行一个节点，但接下来的操作必须有一定的 PHA 才可以继续。由于在“软启动”过程中，PHA 的转账还是禁用状态，你无法接受别人的转账从而得到 PHA 代币。此时，即使拥有 PHA 且参与守门人抵押，也只是表明了自己成为守门人的 _意愿_，直到 NPoS 阶段启用才会真正开始选举。

<br>

## 抵押PHA和设置 Session Key

### 抵押 PHA

1. 注册两个账号，并在两个账号上都留有一定资金用以支付交易手续费。而后将大部分资金存入 Stash 账号。Stash 账号将负责保管保证金，而controller账号则类似一个负责开启或关闭身份的开关。
2. 点击  `网络` — `质押` — `账户操作` — `存储账户`
3. 第一排选 Stash 账号，第二排选 Controller 账号。下方输入你想抵押的金额。然后点 `Bond`。
4. 稍等片刻，就可以看见页面出现了刚刚操作的账号对。

![](/images/docs/gatekeeper/1.png)
![](/images/docs/gatekeeper/2.png)
![](/images/docs/gatekeeper/3.png)

### 获取 Session 密钥

> 注意：Session 密钥对于共识至关重要。如果不确定节点是否有密钥的话，可以使用两种方法来检查：
> - [hasKey](https://polkadot.js.org/api/substrate/rpc.html#haskey-publickey-bytes-keytype-text-bool) 来检查是否有某一个 Session 密钥，或者
> - [hasSessionKeys](https://polkadot.js.org/api/substrate/rpc.html#hassessionkeys-sessionkeys-bytes-bool) 来查看所有的 Session 公钥

#### 方法1: PolkadotJS-APPS

1. 点击左上角的 `logo` — `DEVELOPMENT`，在 `custom endpoint` 里把端口替换为 `ws://127.0.0.1:9944` ，然后点 `Switch`。
2. 点 `开发者` — `RPC Calls` ，下面的模块选 `author` — `rotateKeys()`，点提交 `RPC 调用`，就会获得一串数字。


![](/images/docs/gatekeeper/4.png)
![](/images/docs/gatekeeper/5.png)

#### 方法2: CLI

如果你在远端服务器上运行守门人节点，可能运行这个指令会更简单（假设你没有修改默认 HTTP PRC 端口号）：

```bash
curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "author_rotateKeys", "params":[]}' http://localhost:9933
```

它会返回一个十六进制编码的 “result” 字段，由4个公钥串联而成。记下即可。
现在，你可以重启节点并且去掉 `--unsafe-rpc-expose` 选项，此后就不再需要这个选项。

### 提交Session Key

1. 返回 `网络` — `质押` — `账户操作`，在刚刚生成的账户对旁边点击 Session 密钥 ，把刚刚生成的数字填进来。
2. 点击 `开发者` — `交易` ，第一排选择你的 stash 账号，第二排选择 `phalaModule` — `setStash(controller)`，第三排选择你的 controller ，最后点 `submit Transaction`（两个按钮中右边的那一个）。

![](/images/docs/gatekeeper/6.png)

![](/images/docs/gatekeeper/7.png)

<br>

## 启动 pRuntime
1. 输入以下指令拉取 pRuntime 镜像。根据网速不同，这一步可能需要 30~60 分钟。
	```bash
	sudo docker pull phalanetwork/phala-poc3-pruntime
	```
2. 根据你的驱动型号，输入对应的指令启动 pRuntime 容器。

#### DCAP 驱动：

	```bash
	sudo docker run -d -ti --rm --name phala-pruntime -p 8000:8000 -v $HOME/phala-pruntime-data:/root/data --device /dev/sgx/enclave --device /dev/sgx/provision phalanetwork/phala-poc3-pruntime
	```

#### SGX 驱动：

	```bash
	sudo docker run -d -ti --rm --name phala-pruntime -p 8000:8000 -v $HOME/phala-pruntime-data:/root/data --device /dev/isgx phalanetwork/phala-poc3-pruntime
	```
#### 不知道自己的驱动是什么：

-   输入 ls /dev/isgx 有返回：**SGX 驱动**
-   输入 ls /dev/sgx 有返回：**DCAP 驱动**
-   如果两个驱动都有，则运行 DCAP 驱动的命令。
-   如果两个驱动都没有，请参考[这个教程](https://www.yuque.com/fagephalanetwork/miner/yylp17)安装驱动。

<br>

## 启动 pHost

1. 输入vim runphost.sh 进入一个子页面。
2. 确认当前输入法为英文输入法，按下 `a` ，看到底部出现 `INSERT` 字样，即可进入编辑状态。
3. 把所有 Key Key Key 的字符替换成自己的 controller 助记词。

![](/images/docs/gatekeeper/8.png)

4. 再次确认当前输入法为英文输入法，按下 `ESC` 再按 `Shift` + `;` ，底部出现光标，输入 `wq` ，回车保存退出；
5. 输入 `./runphost.sh` （句号前面没有空格），稍等一下，直到末尾显示 `OK(())`。

![](/images/docs/gatekeeper/9.png)
![](/images/docs/gatekeeper/10.png)

**如果这里报错如下：**
`FailedToCallRegisterWorker: Err(Rpc(Request(Error { code: ServerError(1010), message: "Invalid Transaction", data: Some(String("Inability to pay some fees (e.g. account balance too low)")) }))) bridge() exited with result: Err(FailedToCallRegisterWorker)`

**说明是助记词不对，或者你第三步没有做完（需要在** **staking** **界面和** **extrinsics** **界面都操作完成）。**

**如果助记词不对，可以****直接** **vim runphost.sh** **进去按照刚刚步骤修改助记词。**

<br>

## **启动守门人身份**

1. 去到`质押`—`账户操作`板块，传送门：[https://poc4.phala.network/?rpc=wss%3A%2F%2Fpoc4a.phala.network%2Fws#/staking/actions](https://poc4.phala.network/?rpc=wss%3A%2F%2Fpoc4a.phala.network%2Fws#/staking/actions)
2. 点击你绑定好的账号旁边的 `Validate`。之后按照引导提交 validate 请求。
3. 等进入下一个 Epoch 的时候，就可以看到你的守门人在 Waiting 列表里了。

![](/images/docs/gatekeeper/11.png)
![](/images/docs/gatekeeper/12.png)
![](/images/docs/gatekeeper/13.png)

<br>

### 技术支持
 [![](https://img.shields.io/badge/Join-%E5%BE%AE%E4%BF%A1%E7%BE%A4-brightgreen)](https://mp.weixin.qq.com/s/j0ggxgvwqCeNO6v0mgHkzw)
