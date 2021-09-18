---
title: "4.1 How to get better peers connectivity"
weight: 6041
menu:
  docs:
    parent: "khala-mining"
---

## The problem

Some of our friends that running our nodes may found their nodes are struggling to connect to any peer which causes nodes being dropped from the whole wonderful network. In this KB you may find why and what to do.

## Stateful firewall

As IPv4 is exhausting, also as there are some security concerns or some design considerations. There’s a lot of stateful firewalls between you and peers that run NAT, policy-based filter, or both. This increases the complexity of the connectivity a lot and causing tons of issues.

### What these stateful firewalls do

#### Source NAT

Source NAT is being used to allow a lot of devices to use the same public-routable address by tracing the connection your host opens to the Internet outside the firewall. Any datagram sent outside the firewall has the source address changed to an address that holds by the firewall. As the remote host replies to your datagram which destination is the firewall, the firewall knows which the true target and just sends it.

But if there are some remote hosts outside the firewall that want to start a new connection to any host behind the firewall, there’s no way. As the datagram reaches the firewall. the firewall checks its connection table, and in most cases, it finds nothing. so the datagram is dropped.

The firewall may trace the connection using different information and this will cause different results, you can check <https://en.wikipedia.org/wiki/Network_address_translation#Methods_of_translation> for the idea.

Please note that the source NAT can be run by both you and your network provider. and you may be behind many layers of source NAT.

#### Policy-based filter

Some of the network providers and hosting providers may apply some policy-based filter that drops any datagrams sent from or to you for security or abuse prevention as P2P connections are often being used for the distribution of illegal content. This may drop some of your connections between peers.

## What to do

### Get rid of NAT or filter at all

The first thing to do is to check your network provider if they are running source NAT or policy-based filters for you. If so, try asking them to not applying that for you.

### Configure your own device to get better connectivity

If you have to set up source NAT for yourself, you can still do something to get your node for better connectivity.

#### Destination NAT, DMZ, or UPnP

You can configure destination NAT to expose the ports that your nodes listening. Some of the network devices designed for home use may let you config a DMZ host which will receive all incoming datagrams that not being known to any connection.

Some of the network devices designed for home use may also be able to listen to UPnP which can help the configuration of destination nat. But the use of UPnP is often problematic and not safe. So the UPnP should be only considered as the last resort.
