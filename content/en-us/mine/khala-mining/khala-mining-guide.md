---
title: "Khala Mining Guide"
weight: 1000
menu:
  mine:
    parent: "khala-mining"
---

Khala Network is Phala's canary network on Kusama Parachain featuring decentralized mining. We provide an overview to setup the mining environment, followed by a detailed explanation of each step.

We highly recommend workers to first read about Phala's [tokenomics](https://wiki.phala.network/en-us/general/phala-network/tokenomics/) and [staking mechanism](https://wiki.phala.network/en-us/mine/khala-mining/staking/) to understand the calculation of incomings and how the mining proceeds.

## Introduction

Workers provide computing power to the Phala Network. Anyone with the appropriate hardware can participate.

> More information about hardware requirements: :point_right: [here](/en-us/mine/khala-mining/hardware-requirements/#general-khala-hardware-requirements)

This section provides some theory about the mining concepts of Phala and additional background information.

> To get directly started, feel free to check the quick start guide: :point_right: [here](/en-us/mine/khala-mining/quick-start/)

## Worker Registration

Registration is required before a worker or gatekeeper can join the network. After that, any parties with secure-enclave-supported devices can serve as workers. To register as a validated worker in the blockchain, Secure Enclave runners need to run `pRuntime` and let it send a signed attestation report to gatekeepers.

`pRuntime` requests a Remote Attestation with a hash of the `WorkerInfo` committed in the attestation report. `WorkerInfo` includes the public key of `IdentityKey` and `EcdhKey` and other data collected from the enclave. By verifying the report, gatekeepers can know the hardware information of workers and ensure that they are running unmodified `pRuntime`.

## Remote Attestation

The attestation report is relayed to the blockchain by `register_worker()` call. The blockchain has the trusted certificates to validate the attestation report. It validates:

1. The signature of the report is correct;
2. The embedded hash in the report matches the hash of the submitted `WorkerInfo`;

`register_worker()` is called by workers, and a worker can only be assigned contracts when it has certain amounts of staking PHA tokens. On the blockchain there is a `WorkerState` map from the worker to the `WorkerInfo` entry. Gatekeepers will update the `WorkerState` map after they receive and verify the submitted `WorkerInfo`.

## Offline Worker Detection

The `pRuntime` of a worker is regularly required to answer the online challenge as a heartbeat event on chain. The blockchain detects the liveness of workers by monitoring the interval of their heartbeat events. A worker is punished with the penalty of his staking tokens if it goes offline during a contract execution.

## Community

If you have any questions, you can always reach out to the Phala community for help:

<div class="mediaList">
  <div class="item">
     <a href="https://t.me/phalanetwork" target="_blank">
        <svg width="25" height="21" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M9.35464 19.5529L9.73964 13.7367L20.2996 4.22167C20.7671 3.79542 20.2034 3.58917 19.5846 3.96042L6.54964 12.1967L0.912142 10.4092C-0.297858 10.0654 -0.311608 9.22667 1.18714 8.62167L23.1459 0.151666C24.1496 -0.302084 25.1121 0.399166 24.7271 1.93917L20.9871 19.5529C20.7259 20.8042 19.9696 21.1067 18.9246 20.5292L13.2321 16.3217L10.4959 18.9754C10.1796 19.2917 9.91839 19.5529 9.35464 19.5529Z" fill="#8c8c8c"></path>
        </svg>
     </a>
  </div>
  <div class="item">
     <a href="https://forum.phala.network/" target="_blank">
        <svg width="27" height="24" viewBox="0 0 27 24" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path fill-rule="evenodd" clip-rule="evenodd" d="M25.7165 18.488C25.1981 18.488 24.779 18.0689 24.779 17.5505C24.779 16.8202 23.4328 15.2574 20.9662 14.9967C20.489 14.947 20.1262 14.5449 20.1262 14.0649V11.9611C20.1262 11.6405 20.2903 11.3424 20.5603 11.1699C22.4915 9.94079 22.8965 7.66454 22.8965 5.97235C22.8965 2.84485 19.9575 2.6011 19.0565 2.6011C18.5381 2.6011 18.119 2.1811 18.119 1.6636C18.119 1.1461 18.5381 0.726105 19.0565 0.726105C21.6928 0.726105 24.7715 2.09954 24.7715 5.97235C24.7715 8.85142 23.8153 11.078 22.0012 12.4505V13.2652C24.8175 13.8642 26.654 15.8583 26.654 17.5495C26.654 18.0689 26.235 18.488 25.7165 18.488ZM13.3275 23.2739C11.2818 23.2739 5.0587 23.2739 5.0587 19.2024C5.0587 17.3058 7.7437 16.057 10.5215 15.5902C8.51245 13.9402 8.23964 11.1277 8.23964 8.80642C8.23964 5.52142 10.1746 3.55923 13.4156 3.55923H13.5778C16.8187 3.55923 18.7537 5.52048 18.7537 8.80642C18.7537 11.1277 18.4809 13.9411 16.4718 15.5902C19.2487 16.0561 21.9328 17.3049 21.9328 19.2024C21.9337 21.9042 19.0378 23.2739 13.3275 23.2739ZM0.426514 17.5505C0.426514 18.0689 0.846514 18.488 1.36401 18.488C1.88151 18.488 2.30151 18.0689 2.30151 17.5514C2.30151 16.8202 3.64683 15.2574 6.11433 14.9977C6.59245 14.948 6.95433 14.5458 6.95433 14.0658V11.962C6.95433 11.6414 6.79026 11.3433 6.52026 11.1708C4.58901 9.94173 4.18401 7.66548 4.18401 5.97329C4.18401 2.84485 7.12308 2.60204 8.02401 2.60204C8.54151 2.60204 8.96151 2.18204 8.96151 1.66454C8.96151 1.14704 8.54151 0.727042 8.02401 0.727042C5.38776 0.727042 2.30901 2.10142 2.30901 5.97329C2.30901 8.85236 3.26433 11.0789 5.07933 12.4514V13.2661C2.26308 13.8642 0.426514 15.8583 0.426514 17.5505Z" fill="#8c8c8c"></path>
        </svg>
     </a>
  </div>
  <div class="item">
     <a href="https://github.com/Phala-Network" target="_blank">
        <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M23.43 11.88C23.4521 14.3236 22.6757 16.7077 21.219 18.6698C19.8159 20.6299 17.8249 22.092 15.5347 22.8443C15.3307 22.9011 15.1119 22.8616 14.9407 22.737C14.817 22.6194 14.7507 22.4537 14.7592 22.2833V19.1153C14.8259 18.3223 14.5391 17.5403 13.9755 16.9785C14.4927 16.9278 15.0056 16.8396 15.51 16.7145C16.0051 16.5817 16.4797 16.3818 16.9207 16.1205C17.3828 15.8685 17.794 15.5328 18.1335 15.1305C18.5063 14.6595 18.7862 14.122 18.9585 13.5465C19.1774 12.8105 19.2831 12.0455 19.272 11.2778C19.2977 10.1289 18.8676 9.01665 18.0757 8.184C18.4479 7.18651 18.4063 6.08169 17.9602 5.115C17.5487 5.03997 17.124 5.09775 16.7475 5.28C16.2648 5.45357 15.8005 5.67466 15.3615 5.94L14.7922 6.29475C12.9034 5.76673 10.906 5.76673 9.01723 6.29475C8.85223 6.17925 8.64598 6.0555 8.38198 5.8905C7.97102 5.65096 7.54048 5.44672 7.09498 5.28C6.69553 5.07717 6.24242 5.00502 5.79973 5.07375C5.35491 6.04992 5.31632 7.16287 5.69248 8.1675C4.91161 9.01313 4.4862 10.1269 4.50448 11.2778C4.49272 12.0401 4.59846 12.7998 4.81798 13.53C4.99699 14.1027 5.27634 14.639 5.64298 15.114C5.9749 15.5282 6.38749 15.8706 6.85573 16.1205C7.30251 16.3702 7.77567 16.5694 8.26648 16.7145C8.77358 16.8401 9.28921 16.9284 9.80923 16.9785C9.37742 17.3851 9.11269 17.9381 9.06673 18.5295C8.84969 18.6328 8.61917 18.705 8.38198 18.744C8.11 18.7952 7.83372 18.82 7.55698 18.8183C7.17796 18.8207 6.80805 18.7022 6.50098 18.48C6.15906 18.2322 5.87713 17.9108 5.67598 17.5395C5.49392 17.2285 5.24615 16.961 4.94998 16.7558C4.72927 16.5863 4.47678 16.4628 4.20748 16.3928H3.91048C3.76173 16.3841 3.61281 16.4066 3.47323 16.4588C3.39073 16.5083 3.36598 16.566 3.39898 16.632C3.43803 16.7057 3.48507 16.7748 3.53923 16.8383C3.59899 16.9077 3.66529 16.9713 3.73723 17.028L3.84448 17.094C4.10341 17.2333 4.32869 17.4276 4.50448 17.6633C4.68861 17.8982 4.84631 18.1528 4.97473 18.4223L5.12323 18.7688C5.24028 19.1409 5.47112 19.467 5.78323 19.701C6.0801 19.9162 6.42106 20.0627 6.78148 20.13C7.12335 20.2016 7.47171 20.2375 7.82098 20.2373C8.09714 20.2423 8.37321 20.223 8.64598 20.1795L8.99248 20.1218V22.2833C8.99566 22.4561 8.92337 22.6218 8.79448 22.737C8.61978 22.8608 8.39893 22.9001 8.19223 22.8443C5.90917 22.0824 3.92918 20.6111 2.54098 18.645C1.07673 16.6962 0.299242 14.3174 0.329979 11.88C0.317931 9.85051 0.853767 7.85538 1.88098 6.105C2.88982 4.34759 4.34757 2.88985 6.10498 1.881C7.85535 0.85379 9.85049 0.317954 11.88 0.330002C13.9095 0.317954 15.9046 0.85379 17.655 1.881C19.4124 2.88985 20.8701 4.34759 21.879 6.105C22.907 7.85506 23.4428 9.85041 23.43 11.88Z" fill="#8c8c8c"></path>
        </svg>
     </a>
  </div>
  <div class="item">
     <a href="https://discord.gg/phala" target="_blank">
        <svg width="27" height="22" viewBox="0 0 27 22" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M9.8 1.3l.3.3C5.9 2.8 4 4.6 4 4.6l1.3-.7c2.5-1 4.5-1.4 5.3-1.4h.4a19.5 19.5 0 0111.6 2.1s-1.8-1.7-5.7-3l.3-.3s3.1 0 6.5 2.4c0 0 3.3 6 3.3 13.5 0 0-2 3.3-7 3.5 0 0-1-1-1.6-1.9 3-.8 4.2-2.7 4.2-2.7-1 .6-1.9 1-2.7 1.3a16.2 16.2 0 01-12.7 0 13.5 13.5 0 01-1.8-.8h-.1l-.1-.1-.6-.4s1 1.8 4 2.7l-1.5 2C1.9 20.4 0 17.1 0 17.1 0 9.8 3.3 3.7 3.3 3.7c3.2-2.4 6.2-2.4 6.5-2.4zm-.6 8.6c-1.3 0-2.4 1.2-2.4 2.6 0 1.4 1 2.5 2.4 2.5 1.3 0 2.3-1.1 2.3-2.5s-1-2.6-2.3-2.6zm8.4 0c-1.3 0-2.3 1.2-2.3 2.6 0 1.4 1 2.5 2.3 2.5C19 15 20 14 20 12.5s-1-2.6-2.4-2.6z" fill="#8c8c8c"></path>
        </svg>
     </a>
  </div>
</div>

## Khala Components

Khala requires the following components:

<div class="mediaList">
  <div class="item" style="text-align:center">
     <a href="https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkhala.api.onfinality.io%2Fpublic-ws#/explorer" target="_blank">
        <svg width="0" height="0" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg">
           <img src="/images/docs/khala-mining/polkadot-js.svg" alt="Khala Polkadot.js UI" width="60" class="center"/>
           <p>Khala Polkadot.js</p>
        </svg>
     </a>
  </div>
  <div class="item" style="text-align:center">
     <a href="https://khala.subscan.io/" target="_blank">
        <svg svg width="0" height="0" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg">
           <img src="/images/docs/khala-mining/khala.png" alt="Khala Blockchain Explorer" width="60" class="center"/>
           <p>Khala Explorer</p>
        </svg>
     </a>
  </div>
  <div class="item" style="text-align:center">
     <a href="https://app.phala.network/mining/" target="_blank" rel="noopener noreferrer">
        <svg svg width="0" height="0" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg">
           <img src="/images/docs/khala-mining/phala_logo.png" alt="Khala App" width="60" class="center"/>
           <p>Khala App</p>
        </svg>
     </a>
  </div>
</div>

- Khala RPC Endpoint: `wss://khala.api.onfinality.io/public-ws`
- Khala Console: <a href="https://app.phala.network/mining/" target="_blank">Mining Console</a>
