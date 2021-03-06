/*
 **************************************************************************
 * Copyright (c) 2014-2016, The Linux Foundation.  All rights reserved.
 * Permission to use, copy, modify, and/or distribute this software for
 * any purpose with or without fee is hereby granted, provided that the
 * above copyright notice and this permission notice appear in all copies.
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT
 * OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 **************************************************************************
 */

#include <linux/version.h>
#include <linux/module.h>
#include <linux/of.h>
#include <linux/debugfs.h>
#include <linux/inet.h>
#include <linux/etherdevice.h>
#include <net/netfilter/nf_conntrack.h>
#include <net/ip.h>
#include <net/ipv6.h>
#include <net/ip6_route.h>
#include <net/route.h>

/*
 * Debug output levels
 * 0 = OFF
 * 1 = ASSERTS / ERRORS
 * 2 = 1 + WARN
 * 3 = 2 + INFO
 * 4 = 3 + TRACE
 */
#define DEBUG_LEVEL ECM_FRONT_END_IPV6_DEBUG_LEVEL

#include "ecm_types.h"
#include "ecm_db_types.h"
#include "ecm_state.h"
#include "ecm_tracker.h"
#include "ecm_classifier.h"
#include "ecm_front_end_types.h"
#include "ecm_tracker_datagram.h"
#include "ecm_tracker_udp.h"
#include "ecm_tracker_tcp.h"
#include "ecm_db.h"
#include "ecm_front_end_ipv6.h"

/*
 * ecm_front_end_ipv6_interface_construct_ip_addr_set()
 *	Sets the IP addresses.
 *
 * Sets the ip address fields of the ecm_front_end_interface_construct_instance
 * with the given ip addresses.
 */
static void ecm_front_end_ipv6_interface_construct_ip_addr_set(struct ecm_front_end_interface_construct_instance *efeici,
							ip_addr_t from_mac_lookup, ip_addr_t to_mac_lookup)
{
	ECM_IP_ADDR_COPY(efeici->from_mac_lookup_ip_addr, from_mac_lookup);
	ECM_IP_ADDR_COPY(efeici->to_mac_lookup_ip_addr, to_mac_lookup);
}

/*
 * ecm_front_end_ipv6_interface_construct_netdev_set()
 *	Sets the net devices.
 *
 * Sets the net device fields of the ecm_front_end_interface_construct_instance
 * with the given net devices.
 */
static void ecm_fron_end_ipv6_interface_construct_netdev_set(struct ecm_front_end_interface_construct_instance *efeici,
							struct net_device *from, struct net_device *from_other,
							struct net_device *to, struct net_device *to_other)
{
	efeici->from_dev = from;
	efeici->from_other_dev = from_other;
	efeici->to_dev = to;
	efeici->to_other_dev = to_other;
}

/*
 * ecm_front_end_ipv6_interface_construct_netdev_put()
 *	Release the references of the net devices.
 */
void ecm_front_end_ipv6_interface_construct_netdev_put(struct ecm_front_end_interface_construct_instance *efeici)
{
	dev_put(efeici->from_dev);
	dev_put(efeici->from_other_dev);
	dev_put(efeici->to_dev);
	dev_put(efeici->to_other_dev);
}

/*
 * ecm_front_end_ipv6_interface_construct_netdev_hold()
 *	Holds the references of the netdevices.
 */
void ecm_front_end_ipv6_interface_construct_netdev_hold(struct ecm_front_end_interface_construct_instance *efeici)
{
	dev_hold(efeici->from_dev);
	dev_hold(efeici->from_other_dev);
	dev_hold(efeici->to_dev);
	dev_hold(efeici->to_other_dev);
}

/*
 * ecm_front_end_ipv6_interface_construct_set()
 *	Sets the IPv6 ECM front end interface construct instance,
 *	and holds the net devices.
 */
bool ecm_front_end_ipv6_interface_construct_set_and_hold(struct sk_buff *skb, ecm_tracker_sender_type_t sender, ecm_db_direction_t ecm_dir, bool is_routed,
							struct net_device *in_dev, struct net_device *out_dev,
							ip_addr_t ip_src_addr, ip_addr_t ip_dest_addr,
							struct ecm_front_end_interface_construct_instance *efeici)
{
	struct dst_entry *dst = skb_dst(skb);
	struct rt6_info *rt = (struct rt6_info *)dst;
	ip_addr_t rt_dst_addr;
	struct net_device *from = NULL;
	struct net_device *from_other = NULL;
	struct net_device *to = NULL;
	struct net_device *to_other = NULL;
	ip_addr_t from_mac_lookup;
	ip_addr_t to_mac_lookup;

	/*
	 * Set the rt_dst_addr with the destination IP address by default.
	 */
	ECM_IP_ADDR_COPY(rt_dst_addr, ip_dest_addr);

	if (!is_routed) {
		/*
		 * Bridged
		 */
		from = in_dev;
		from_other = in_dev;
		to = out_dev;
		to_other = out_dev;

		ECM_IP_ADDR_COPY(from_mac_lookup, ip_src_addr);
		ECM_IP_ADDR_COPY(to_mac_lookup, ip_dest_addr);
	} else {
		/*
		 * Routed
		 */
		if (!rt) {
			DEBUG_WARN("rt6_info is NULL\n");
			return false;
		}

		DEBUG_TRACE("in_dev: %s\n", in_dev->name);
		DEBUG_TRACE("out_dev: %s\n", out_dev->name);
		DEBUG_TRACE("dst->dev: %s\n", dst->dev->name);
		DEBUG_TRACE("%p: rt6i_dst.addr: %pi6\n", rt, &rt->rt6i_dst.addr);
		DEBUG_TRACE("%p: rt6i_src.addr: %pi6\n", rt, &rt->rt6i_src.addr);
		DEBUG_TRACE("%p: rt6i_gateway: %pi6\n", rt, &rt->rt6i_gateway);
		DEBUG_TRACE("%p: rt6i_idev: %s\n", rt, rt->rt6i_idev->dev->name);
		DEBUG_TRACE("%p: skb->dev: %s\n", rt, skb->dev->name);

		DEBUG_INFO("ip_src_addr: " ECM_IP_ADDR_OCTAL_FMT "\n", ECM_IP_ADDR_TO_OCTAL(ip_src_addr));
		DEBUG_INFO("ip_dest_addr: " ECM_IP_ADDR_OCTAL_FMT "\n", ECM_IP_ADDR_TO_OCTAL(ip_dest_addr));

		if (dst->dev == skb->dev) {
			DEBUG_TRACE("input dev and output dev are equal\n");
			return false;
		}

		/*
		 * If the destination host is behind a gateway, use the gateway address as destination
		 * for routed connections.
		 */
		if (!ECM_IP_ADDR_MATCH(rt->rt6i_dst.addr.in6_u.u6_addr32, rt->rt6i_gateway.in6_u.u6_addr32) || (rt->rt6i_flags & RTF_GATEWAY)) {
			ECM_NIN6_ADDR_TO_IP_ADDR(rt_dst_addr, rt->rt6i_gateway);
		}

		from = skb->dev;
		from_other = dst->dev;
		to = dst->dev;
		to_other = skb->dev;

		ECM_IP_ADDR_COPY(from_mac_lookup, ip_src_addr);
		ECM_IP_ADDR_COPY(to_mac_lookup, rt_dst_addr);
	}

	ecm_fron_end_ipv6_interface_construct_netdev_set(efeici, from, from_other,
								to, to_other);

	ecm_front_end_ipv6_interface_construct_netdev_hold(efeici);

	ecm_front_end_ipv6_interface_construct_ip_addr_set(efeici, from_mac_lookup, to_mac_lookup);

	return true;
}

/*
 * ecm_front_end_ipv6_stop()
 */
void ecm_front_end_ipv6_stop(int num)
{
	/*
	 * If the device tree is used, check which accel engine will be stopped.
	 * For ipq8064 platforms, we will stop NSS.
	 */
#ifdef CONFIG_OF
	/*
	 * Check the other platforms and use the correct APIs for those platforms.
	 */
	if (!of_machine_is_compatible("qcom,ipq8064") &&
		!of_machine_is_compatible("qcom,ipq8062")) {
		ecm_sfe_ipv6_stop(num);
	} else {
		ecm_nss_ipv6_stop(num);
	}
#else
	ecm_nss_ipv6_stop(num);
#endif
}

/*
 * ecm_front_end_ipv6_init()
 */
int ecm_front_end_ipv6_init(struct dentry *dentry)
{
	/*
	 * If the device tree is used, check which accel engine can be used.
	 * For ipq8064 platform, we will use NSS.
	 */
#ifdef CONFIG_OF
	/*
	 * Check the other platforms and use the correct APIs for those platforms.
	 */
	if (!of_machine_is_compatible("qcom,ipq8064") &&
		!of_machine_is_compatible("qcom,ipq8062")) {
		return ecm_sfe_ipv6_init(dentry);
	} else {
		return ecm_nss_ipv6_init(dentry);
	}
#else
	return ecm_nss_ipv6_init(dentry);
#endif
}

/*
 * ecm_front_end_ipv6_exit()
 */
void ecm_front_end_ipv6_exit(void)
{
	/*
	 * If the device tree is used, check which accel engine will be exited.
	 * For ipq8064 platforms, we will exit NSS.
	 */
#ifdef CONFIG_OF
	/*
	 * Check the other platforms and use the correct APIs for those platforms.
	 */
	if (!of_machine_is_compatible("qcom,ipq8064") &&
		!of_machine_is_compatible("qcom,ipq8062")) {
		ecm_sfe_ipv6_exit();
	} else {
		ecm_nss_ipv6_exit();
	}
#else
	ecm_nss_ipv6_exit();
#endif
}

