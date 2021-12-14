---
title: "Miner Confidence Level"
weight: 6013
menu:
  docs:
    parent: "khala-mining"
---

## Test your Intel® SGX Capability

The confidence level impacts your miner's score. Before configuring your miner, the necessary drivers are required, and the `sgx-test` option determines your Intel® SGX Capability alongside the confidence level.

  ```bash
  sudo phala sgx-test
  ```

> This command will install :whale: Docker, the required Intel® SGX drivers, and pull all the necessary Docker images for your Phala miner :rock::pick:.
> - Please follow the instruction during installation.

Information about the checks conducted during execution of the command:

1. SGX system software → Able to launch enclaves → `Production Mode`
2. Flexible launch control → `Able to launch production mode enclave`
3. `isvEnclaveQuoteStatus` and `advisoryIDs` (explained in the next section)

Among them, **the first one is a must to run Phala Network pRuntime**. If it's not supported (tagged as ✘ in the report example below), we are afraid you can't mine PHA with this setup. You may want to replace the motherboard and/or the CPU.

The latter two are not a must, though it is suggested to be checked as it would be essential to install the DCAP driver.

The example below shows a positive result:

```txt
Detecting SGX, this may take a minute...
✔  SGX instruction set
  ✔  CPU support
  ✔  CPU configuration
  ✔  Enclave attributes
  ✔  Enclave Page Cache
  SGX features
    ✔  SGX2  ✔  EXINFO  ✘  ENCLV  ✘  OVERSUB  ✘  KSS
    Total EPC size: 94.0MiB
✔  Flexible launch control
  ✔  CPU support
  ？ CPU configuration
  ✔  Able to launch production mode enclave
✔  SGX system software
  ✔  SGX kernel device (/dev/sgx/enclave)
  ✔  libsgx_enclave_common
  ✔  AESM service
  ✔  Able to launch enclaves
    ✔  Debug mode
    ✔  Production mode
    ✔  Production mode (Intel whitelisted)

You are all set to start running SGX programs!
Generated machine id:
[162, 154, 220, 15, 163, 137, 184, 233, 251, 203, 145, 36, 214, 55, 32, 54]

Testing RA...
aesm_service[15]: [ADMIN]EPID Provisioning initiated
aesm_service[15]: The Request ID is 09a2bed647d24f909d4a3990f8e28b4a
aesm_service[15]: The Request ID is 8d1aa4104b304e12b7312fce06881260
aesm_service[15]: [ADMIN]EPID Provisioning successful
isvEnclaveQuoteStatus = GROUP_OUT_OF_DATE
platform_info_blob { sgx_epid_group_flags: 4, sgx_tcb_evaluation_flags: 2304, pse_evaluation_flags: 0, latest_equivalent_tcb_psvn: [15, 15, 2, 4, 1, 128, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0], latest_pse_isvsvn: [0, 11], latest_psda_svn: [0, 0, 0, 2], xeid: 0, gid: 2919956480, signature: sgx_ec256_signature_t { gx: [99, 239, 225, 171, 96, 219, 216, 210, 246, 211, 20, 101, 254, 193, 246, 66, 170, 40, 255, 197, 80, 203, 17, 34, 164, 2, 127, 95, 41, 79, 233, 58], gy: [141, 126, 227, 92, 128, 3, 10, 32, 239, 92, 240, 58, 94, 167, 203, 150, 166, 168, 180, 191, 126, 196, 107, 132, 19, 84, 217, 14, 124, 14, 245, 179] } }
advisoryURL = https://security-center.intel.com
advisoryIDs = "INTEL-SA-00219", "INTEL-SA-00289", "INTEL-SA-00320", "INTEL-SA-00329"
confidenceLevel = 5
```

If you can not run Phala pRuntime with both of them tagged as ✔, you may have to check whether your BIOS is the latest version with latest security patches. If you still can't run Phala pRuntime docker with the latest BIOS of your motherboard manufacturer, we are afraid you can't mine PHA for now with this motherboard.

Your confidence level, referred to as the "Tier" in the table below, will appear in the last line of the report after executing `sudo phala sgx-test`.

## Confidence Level of a Miner

| Level  | isvEnclaveQuoteStatus                                       | advisoryIDs               |
| ------ | ----------------------------------------------------------- | ------------------------- |
| Tier 1 | OK                                                          | None                      |
| Tier 2 | SW_HARDENING_NEEDED                                         | None                      |
| Tier 3 | CONFIGURATION_NEEDED, CONFIGURATION_AND_SW_HARDENING_NEEDED | Whitelisted\*             |
| Tier 4 | CONFIGURATION_NEEDED, CONFIGURATION_AND_SW_HARDENING_NEEDED | Some beyond the whitelist |
| Tier 5 | GROUP_OUT_OF_DATE                                           | Any value                 |

The confidence level measures how secure the SGX Enclave execution environment is. It's determined by the Remote Attestation report from Intel. Among them, `isvEnclaveQuoteStatus` indicates if the platform is vulnerable to some known problems, and `advisoryIDs` indicates the actual affected problems.

{{< tip >}}
Not all the `advisoryIDs` are problematic. Some advisories doesn't affect Phala's security assumption, and therefore are whitelisted:

- INTEL-SA-00219
- INTEL-SA-00334
- INTEL-SA-00381
- INTEL-SA-00389
  {{< /tip >}}

Tier 1, 2, 3 are considered with the best security level because they are either not affected by any known vulnerability, or the adversary is known trivial. It's good to run highest valuable apps on these workers, for instance:

- Financial apps: privacy-preserving DEX, DeFi ,etc
- Secret key management: wallet, node KMS, password manager
- Phala Gatekeeper

Tier 4, 5 are considered with reduced security, because these machines requires some configuration fix in the BIOS or BIOS firmware (CONFIGURATION_NEEDED, CONFIGURATION_AND_SW_HARDENING_NEEDED), or their microcode or the corresponding BIOS firmware are out-of-date (GROUP_OUT_OF_DATE). Therefore we cannot assume the platform is suitable for highest security scenarios. However it's still good to run batch processing jobs, apps dealing with ephemeral privacy data, and traditional blockchain apps:

- Data analysis jobs (e.g. Web3 Analytics)
- On-chain PvP games
- VPN
- Web2.0 apps
- Blockchain Oracle
- DApps

Once Phala is open for developers to deploy their apps, there will be an option for them to choose which tiers they will accept. Since Tier 1, 2, 3 have better security, they can potentially get higher chance to win the confidential contract assignment. However, Tier 4, 5 are useful in other use cases, and therefore can be a more economic choice for the developers.

If your miner is in tier 4 or 5, please check the FAQ page for potential fixes.
