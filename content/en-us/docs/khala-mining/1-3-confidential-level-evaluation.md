---
title: "1.3 Check the SGX Capability and Confidence Level"
menu:
  docs:
    parent: "khala-mining"
---

## Double Check the SGX Capability

After the installation of your driver, please use the following utility to double check if everything goes well.

- You can run the SGX test by the Phala scripts

  ```bash
  sudo phala sgx-test
  ```

Please pay attention to the following checks:

1. SGX system software → Able to launch enclaves → `Production Mode`
2. Flexible launch control → `Able to launch production mode enclave`
3. `isvEnclaveQuoteStatus` and `advisoryIDs` (explained in the next section)

Among them, **the first one is a must to run Phala Network pRuntime**. If it's not supported (tagged as ✘ in the report example below), we are afraid you can't mine PHA with this setup. You may want to replace the motherboard and/or the CPU.

The latter two are not a must, though it is suggested to be checked as it would be essential to install the DCAP driver.

The report below would be a positive result:

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

If your got a report like below, please screenshot it, and send it to [Phala Discord Server](https://discord.gg/zjdJ7d844d) or [Telegram Miner Group](https://t.me/phalaminer) for help.

```txt
Detecting SGX, this may take a minute...
✔  SGX instruction set
  ✔  CPU support // if tagged with ❌: it does not suppoort SGX function, you would need to use other types of CPU.
  ✔  CPU configuration // if tagged with ❌: you would need to check BIOS updates.
  ✔  Enclave attributes // if tagged with ❌: probably caused by [CPU support issue] and [CPU configuration]
  ✔  Enclave Page Cache // if tagged with ❌: probably caused by [CPU support issue] and [CPU configuration]
  SGX features
    ✘  SGX2  ✘  EXINFO  ✘  ENCLV  ✘  OVERSUB  ✘  KSS // It's OK if SGX2 was tagged with ❌. Phala has not integrated with SGX2 technology in the current stage.
    Total EPC size: 94.0MiB
✘  Flexible launch control
  ✔  CPU support
  ✘  CPU configuration // if tagged with ❌: you can give it a try but your miner might be affected when the SGX driver upgrades in the future.
✔  SGX system software
  ✔  SGX kernel device (/dev/isgx)
  ✔  libsgx_enclave_common
  ✔  AESM service
  ✔  Able to launch enclaves
    ✔  Debug mode
    ✘  Production mode // if tagged with ❌: you would need to check BIOS updates.
    ✔  Production mode (Intel whitelisted)

🕮  Flexible launch control > CPU configuration
Your hardware supports Flexible Launch Control, but it's not enabled in the BIOS. Reboot your machine and try to enable FLC in your BIOS. Alternatively, try updating your BIOS to the latest version or contact your BIOS vendor.

debug: MSR 3Ah IA32_FEATURE_CONTROL.SGX_LC = 0

More information: https://edp.fortanix.com/docs/installation/help/#flc-cpu-configuration

🕮  SGX system software > Able to launch enclaves > Production mode
The enclave could not be launched. This might indicate a problem with FLC.

debug: failed to load report enclave
debug: cause: failed to load report enclave
debug: cause: The EINITTOKEN provider didn't provide a token
debug: cause: aesm error code GetLicensetokenError_6
```

If you can't run Phala pRuntime with both of them tagged as ✔, you may have to check whether your BIOS is the latest version with latest security patches. If you still can't run Phala pRuntime docker with the latest BIOS of your motherboard manufacturer, we are afraid you can't mine PHA for now with this motherboard.

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
