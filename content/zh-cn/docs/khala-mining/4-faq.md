---
title: "3 Frequently Asked Questions"
---

{{< tip "warning" >}}
Para-2 is the Parachain testnet of Phala Network (and Khala Network). The purpose of running a testnet is to capture the chaos and collect feedback before the launch of the functionalities on Khala Network. So the system is subject to change. In this tutorial, we always refer to the testnet unless explicitly mentioned.
{{< /tip >}}

> To be updated.

## I. Increase Confidence Level

Currently Tier 1, 2, 3 are treated in the same way. No operation is needed if you are at these tier. However if you are at Tier 4 or 5, you can try the following tips. You can also join the Discord or Telegram miner group to discuss.

### Got CONFIGURATION_NEEDED and CONFIGURATION_AND_SW_HARDENING_NEEDED

> The EPID signature of the ISV enclave QUOTE has been verified correctly, but additional configuration of SGX platform may be needed (for further details see Advisory IDs). The platform has not been identified as compromised and thus it is not revoked. It is up to the Service Provider to decide whether or not to trust the content of the QUOTE, and whether or not to trust the platform performing the attestation to protect specific sensitive information.
>
> -- from [Intel IAS API Sepc](https://api.trustedservices.intel.com/documents/IAS-API-Spec-rev-4.0.pdf)

It means either the BIOS is misconfigured or the BIOS firmware is misbuilt. You can try:

- Upgrade to the latest BIOS firmware (you may want to write to the motherboard manufacturers asking for a fix, too)
- Disable Hyper Threading in the BIOS
- Disable the integral graphics in the BIOS
- Disable advanced power management (disable the power-saving mode)
- Check the exact `adversoryIds` and their description pages for the detailed fixes

{{< tip >}}
Linux provides the option to override the microcode. However it doesn't help the SGX setup, because SGX measures the microcode carried by the BIOS only.
{{< /tip >}}

### Got GROUP_OUT_OF_DATE

> The EPID signature of the ISV enclave QUOTE has been verified correctly, but the TCB level of SGX platform is outdated (for further details see Advisory IDs). The platform has not been identified as compromised and thus it is not revoked. It is up to the Service Provider to decide whether or not to trust the content of the QUOTE, and whether or not to trust the platform performing the attestation to protect specific sensitive information.

It means the BIOS firmware (specifically, the CPU microcode it carries) is out-of-date, and must be upgraded. You can try:

- Upgrade to the latest BIOS firmware (you may want to write to the motherboard manufacturers asking for a fix, too)

{{< tip >}}
Linux provides the option to override the microcode. However it doesn't help the SGX setup, because SGX measures the microcode carried by the BIOS only.
{{< /tip >}}
