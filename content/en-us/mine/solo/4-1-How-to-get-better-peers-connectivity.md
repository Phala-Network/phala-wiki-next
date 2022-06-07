---
title: "4.1 Improve Peer Connectivity"
weight: 1041
draft: true
menu:
  mine:
    parent: "mine-solo"
# Moved to the GitHub README to improve readability and minimize overall verbosity.
---

Some users running nodes may find their nodes are struggling to connect to peers, which causes nodes to be dropped from the network. Here you will learn more about the root causes and solve them.

You can check your node connections through executing:

```bash
sudo docker logs -f phala-node
```

For an optimal setup you should have between 40 and 50 peers.

## Stateful Firewall

As IPv4 is exhausting, with its security concerns and design considerations. Many stateful firewalls between you and your peers run using the [NAT](https://en.wikipedia.org/wiki/Network_address_translation) (Network address translation) and policy-based filters. This increases the complexity of the connectivity tremendously and can cause issues.

### Source NAT

Source NAT is being used to allow many devices to use the same public-routable address by tracing the connection your host opens to the Internet outside of the firewall. Any datagram sent outside the firewall has the source address changed to an address that holds by the firewall. As the remote host replies to your datagram, which destination the firewall is, the firewall knows the actual target and sends it.

But if remote hosts outside the firewall want to start a new connection to any host behind the firewall, the datagram reaches the firewall. The firewall checks its connection table, and in most cases, it does not find the target. As a result, the datagram is dropped.

The firewall may trace the connection using different information, which will cause different results; you can check the details on [methods of transaltion](<https://en.wikipedia.org/wiki/Network_address_translation#Methods_of_translation>) for more details.

> :information: Note that you and your network provider may run the source NAT. Therefore, you may be behind many layers of the source NAT.

### Policy-Based Filters

Some network and hosting providers may apply policy-based filter dropping datagrams sent from or to you for security or abuse prevention as peer-to-peer (P2P) connections are often used to distribute illegal content. This may drop some of your connections between peers.

## Solutions

### Remove NAT or Disable Filters

The first thing to do is to check your network provider if they are running source NAT or policy-based filters for you. If so, try asking them not to apply that for you.

### Configuring your Device for better connectivity

If you have to set up source NAT yourself, you can still get your node for better connectivity.

#### Destination NAT, DMZ, or UPnP

You can configure destination NAT to expose the ports that your nodes are listening to. Some of the network devices designed for home use may let you configure a DMZ host that will receive all incoming datagrams that are unknown to any connection.

Some of the network devices designed for home use may also be able to listen to UPnP, which can help the configuration of destination nat. But the use of UPnP is often problematic and not safe. So the UPnP should only be considered as the last resource.
