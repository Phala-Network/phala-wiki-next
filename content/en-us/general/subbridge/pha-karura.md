---
title: 'Transfer PHA: Khala <-> Karura'
weight: 1002
menu:
  general:
    parent: "general-bridge"
---

This tutorial takes the transfer of PHA from Khala to Karura as an example, and vice versa for transferring from Karura to Khala. You can also refer to this tutorial for other bridge transfers.

<p align="center">
  <img src="/images/general/subbridge-transfer.png" width="400"/>
</p>

1. Open [SubBridge](https://app.phala.network/bridge/), switch *From* chain to Khala, *To* chain to Karura, and choose `PHA` as the currency;
2. Connect the Source Chain (Khala)’s account, enter the transfer amount;
    > Note: Do not transfer all the token, you need to keep a certain fee in the account to ensure that it is not deleted.
3. Enter the receiving account on destination chain (Karura), note that it should be the Karura address;
4. Click *Submit*;

<p align="center">
  <img src="/images/general/subbridge-confirm.png" width="400"/>
</p>

5. Confirm pop-up window;
    > Note: A transfer fee of 0.0512 PHA will be charged for transferring from Khala to Karura. The bridge itself is completely free. This fee is used to pay the XCM fee of the Karura chain. It does not include the transaction fee of the Khala chain.
6. Click *Submit* again to sign;
7. The transaction is sent from Khala, wait for the transaction to be confirmed;
8. Then you can go to destination chain’s wallet (in this case, [Karura Apps](https://apps.karura.network/portfolio)) to check whether you have received the token (PHA). If it is not received within 1 minute, you can go to the Khala chain explorer ([Subscan](https://khala.subscan.io/)) to check whether you have sent a transaction; if you have any questions, you can consult our [Discord](https://discord.com/invite/phala).
