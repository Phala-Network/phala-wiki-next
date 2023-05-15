---
title: "Using PRBv3 UI"
weight: 1030
menu:
  mine:
    parent: "phala-worker"
---

You can configure StakePool, Pool operator, and worker information by using the PRBv3 UI, and can also check the running status of workers, and perform related error diagnosis there.

## Login

Access the PRB UI by going to http://localhost:3000/. Replace localhost with the IP of the PRB Server.

> If you are accessing this page from an external network, please note to check the firewall configuration of the PRB server.

## Data configuration on PRBv3 UI

### StakePool Configuration

Click `Pools` in `Inventory` to jump to the StakePool configuration interface.

* Click `Add` button
* Enter `PID` of the StakePool and your custom name for it
* Click `confirm`

This completes the input of StakePool information.

### Pool Operator Configuration

Click `Pool Operators` in `Inventory` to jump to the Operator configuration interface.

* Click `Set` button.
* Enter `PID` of the StakePool.
* Select `seed` for `Account Type`.
* If your operator account does not use the proxy method, enter the mnemonic of the operator in the `Account` section; leave `Proxied Account (SS58)` empty.
* If your operator account uses the proxy method, enter the mnemonic of the authorized gas fee account in the `Account` section; enter the real pool operator’s account address in `Proxied Account (SS58)`.
* Click `confirm`.

This completes the input of Pool operator information.

### Worker Configuration

Click `Workers` in `Inventory` to jump to the Worker configuration interface.

* Click `Add` button
* Enter your custom name for the Worker and the desired `PID` for the worker
* Enter the worker’s endpoint in the format http://{pRuntime-ip}:8000/. Replace {pRuntime-ip} with the IP of the worker.
* Enter the desired worker staking amount and add 12 zeros after the number. For example, `5000000000000000` means a staking value of `5000`.
* Click `confirm`

This completes the input of Worker information.

> Similar to PRBv2, PRBv3 supports multi-mode worker synchronization.

If you choose the `SyncOnly` mode, the worker will only participate in synchronization and will not register worker's information on chain after reaching the maximum height. There is a similar option in StakePool configuration page, and they are the same functions.

> Additionally, PRBv3 has added `GateKeeper` mode, allowing you to deploy GateKeeper with PRBv3.

• The GateKeeper reward function as originally planned in the tokenomics is not yet enabled; Therefore, if you deploy GateKeeper, you will not receive any rewards.
• GateKeeper cannot be added to StakePool for computation contributing.
• After GateKeeper synchronization is completed, the operator needs to initiate an on-chain proposal and complete GK registration through community referendum before it can start running. The specific registration transaction is:phalaRegistry.registerGatekeeper(gatekeeper)

## Start running

After all information is configured, click the `reload` button in the upper left corner of the page. The new configuration information will be loaded, and PRBv3 will start working.

## Status check

Click `Workers` in `Status` to check the synchronization status of all workers and manage workers using the `restart` and `re-register` buttons.

Click `Transactions` in `Status` to check the transaction records sent by the PRB and confirm the details.
