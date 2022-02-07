---
title: "Mine Khala"
weight: 1002
menu:
  gettingstarted:
    parent: "mining"
---

### Hardware

<ul class="nav nav-tabs" id="myTab" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Rent Hardware</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Own Hardware</button>
  </li>
</ul>

<div class="tab-content">
  <div class="tab-pane active" id="home" role="tabpanel" aria-labelledby="home-tab">
  <br>

> We currently recommend using <a href="https://www.vultr.com/products/bare-metal/"><img alt="VULTR Bare Metal" src="/images/docs/quick-start/mine-phala/signet__on-dark-blue-bg.png" width="30">
>    <b class="heading">[VULTR](https://www.vultr.com/products/bare-metal/).</b> <sub> Miner on VULTR [documentation](/en-us/getting-started/mining/paas-miner/).</sub>
>  </a>
> </p>

Support is not limited to VULTR, as long as the provider allows you to set the required [BIOS settings](/en-us/maintain/khala-mining/1-0-hardware-requirements/#check-your-bios) and offers an Intel® SGX [supported CPU](/en-us/maintain/khala-mining/1-0-hardware-requirements/#2-confirm-the-cpu-supports-intel-sgx).

</p>
</details>

  </div>
  <div class="tab-pane" id="profile" role="tabpanel" aria-labelledby="profile-tab">
  <br>

> Ensure your BIOS and operating system is ready according to our [hardware and setup documentation](/en-us/maintain/khala-mining/1-0-hardware-requirements).

  </div>
</div>

<script>
  var firstTabEl = document.querySelector('#myTab li:last-child a')
  var firstTab = new bootstrap.Tab(firstTabEl)

  firstTab.show()
</script>

### Wallet

If you do not have a wallet yet, [create one](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkhala-api.phala.network%2Fws#/accounts) (+ Add account) and install the [Polkadot{.js} extension](https://polkadot.js.org/extension) for your browser.

<div class="mediaList">

  <div class="item" style="text-align:center">
     <a href="https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkhala-api.phala.network%2Fws#/accounts" target="_blank" rel="noopener noreferrer">
        <svg svg width="0" height="0" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg">
           <img src="https://polkadot.js.org/apps/static/khala.3558f6d9.svg" alt="Khala App" width="60" class="center"/>
           <p>Khala Wallet</p>
        </svg>
     </a>
  </div>
  <div class="item" style="text-align:center">
     <a href="https://polkadot.js.org/extension/" target="_blank" rel="noopener noreferrer">
        <svg svg width="0" height="0" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg">
           <img src="/images/docs/khala-mining/polkadot-js.svg" alt="Khala App" width="60" class="center"/>
           <p>Polkadot{.js} Extension</p>
        </svg>
     </a>
  </div>
</div>

> Have the details of your Wallet (address, seed) ready when installing the miner.

## Quick Start

<p align="left">
    <img alt="Phala Network" src="https://user-images.githubusercontent.com/37558304/145892648-bc3562f8-47e0-4cc9-a8a1-05b1ee8baab1.png" width="30">
    <b class="heading">Ubuntu 21.10</b> <sub> GUI miner setup script [v0.01]</sub>
  </a>
</p>

```bash
wget -O - https://raw.githubusercontent.com/Phala-Network/solo-mining-scripts/improvement-test/gui.sh | bash
```

If you experience an issues with the installation script, you can always install the miner manually from our [GitHub repository](https://github.com/Phala-Network/solo-mining-scripts#manual-installation).

## Manage Miners

Create a pool if you do not have one yet. Once the miner is registered, you can add them to your pool.

<div class="mediaList">
  <div class="item" style="text-align:center">
     <a href="https://app.phala.network/mining/" target="_blank" rel="noopener noreferrer">
        <svg svg width="0" height="0" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg">
           <img src="/images/docs/khala-mining/phala_logo.png" alt="Khala App" width="60" class="center"/>
           <p>Khala App</p>
        </svg>
     </a>
  </div>
</div>

> We have a detailed guide on how to use the Khala App [here](/en-us/maintain/khala-mining/3-0-console/).

## Troubleshoot

{{< button "https://github.com/Phala-Network/solo-mining-scripts#navigate" "General" >}}

{{< button "https://github.com/Phala-Network/solo-mining-scripts#investigating-the-issue" "Investigate" >}}

{{< button "/en-us/maintain/khala-mining/4-0-faq/#confidence-level" "Confidence Level" >}}

{{< button "https://github.com/Phala-Network/solo-mining-scripts/tree/main#khala-node-stops-synching" "Stuck Miner" >}}

{{< button "https://forum.phala.network/c/mai/42-category/42" "Forum" >}}
