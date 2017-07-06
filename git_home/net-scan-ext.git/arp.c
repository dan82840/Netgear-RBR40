#include "netscan.h"

#define NEIGH_HASHMASK	0x1F

#define INTERFACENUM 7

enum interface_num {
        BR0,
        ATH0,
        ATH01,
        ATH1,
        ATH2,
        ATH02,
        ATH21
};

struct interface_element{
        char *name;
        char mac[18];
        int port;
};

enum device_type{
	NONETYPE,
	WIRELESS_2G,
	WIRELESS_5G,
	WIRED
};

struct arp_struct
{
	struct arp_struct *next;

	struct in_addr ip;

	uint16 active;
	uint8 mac[ETH_ALEN];

	char host[MAX_HOSTNAME_LEN + 1];
};

struct arp_struct *arp_tbl[NEIGH_HASHMASK + 1];

struct mac_host
{
	struct mac_host *next;
	uint8 mac[ETH_ALEN];
	char host[MAX_HOSTNAME_LEN + 1];
};

struct mac_host *host_tbl[NEIGH_HASHMASK + 1];

static struct arpmsg arpreq;

int init_arp_request(char *ifname)
{
	int s;
	struct ifreq ifr;
	struct arpmsg *arp;
	
	s = socket(AF_INET, SOCK_RAW, IPPROTO_RAW);
	if (s < 0)
		return 0;
	
	arp = &arpreq;
	memset(arp, 0, sizeof(struct arpmsg));

	ifr.ifr_addr.sa_family = AF_INET;
	strncpy(ifr.ifr_name, ifname, IFNAMSIZ);
	if (ioctl(s, SIOCGIFADDR, &ifr) != 0)
		return 0;
	memcpy(arp->ar_sip, &((struct sockaddr_in *)&ifr.ifr_addr)->sin_addr, 4);
	
	if (ioctl(s, SIOCGIFHWADDR, &ifr) != 0)
		return 0;
	memset(arp->h_dest, 0xFF, 6);
	memcpy(arp->h_source, ifr.ifr_hwaddr.sa_data, 6);
	arp->h_proto = htons(ETH_P_ARP);
	arp->ar_hrd = htons(ARPHRD_ETHER);
	arp->ar_pro = htons(ETH_P_IP);
	arp->ar_hln = 6;
	arp->ar_pln = 4;
	arp->ar_op = htons(ARPOP_REQUEST);
	memcpy(arp->ar_sha, ifr.ifr_hwaddr.sa_data, 6);
	
	close(s);
	return 1;
}

/* modified from "linux-2.4.18/net/ipv4/arp.c" */
static uint32 arp_hash(uint8 *pkey)
{
#define GET_UINT32(p)	((p[0]) |(p[1] << 8) |(p[2] << 16) |(p[3] << 24))
	uint32 hash_val;

	hash_val = GET_UINT32(pkey);
	hash_val ^= hash_val >> 16;
	hash_val ^= hash_val >> 8;
	hash_val ^= hash_val >> 3;

	return hash_val & NEIGH_HASHMASK;
}

static struct in_addr get_pa(char *ifname, unsigned int cmd)
{
	int fd;
	struct ifreq ifr;
	struct in_addr pa;

	pa.s_addr = 0;
	fd = socket(AF_INET, SOCK_DGRAM, 0);
	if (fd < 0)
		return pa;

	memset(&ifr, 0, sizeof(ifr));
	ifr.ifr_addr.sa_family = AF_INET;
	strcpy(ifr.ifr_name, ifname);
	if (ioctl(fd, cmd, &ifr) == 0) /* 'cmd' is 'SIOCGIFADDR' & 'SIOCGIFNETMASK' */
		pa = ((struct sockaddr_in *)&ifr.ifr_addr)->sin_addr;
	close(fd);

	return pa;
}

struct in_addr get_ipaddr(char *ifname)
{
	return get_pa(ifname, SIOCGIFADDR);
}

struct in_addr get_netmask(char *ifname)
{
	return get_pa(ifname, SIOCGIFNETMASK);
}

static void get_dhcp_host(char host[], struct in_addr ip, int *isrepl)
{
	FILE *tfp;
	char *ipaddr;
	char *hostname;
	char *ipstr;
	char buff[512];

	host[0] = '\0';
	ipstr = inet_ntoa(ip);
	if ((tfp = fopen(DHCP_LIST_FILE,"r")) == 0)
		return;

	while (fgets(buff, sizeof(buff), tfp)) {
		ipaddr = strtok(buff, " \t\n");
		hostname = strtok(NULL, " \t\n");
		if (ipaddr == NULL || hostname == NULL)
			continue;

		if (strcmp(ipaddr, ipstr) == 0) {
			strncpy(host, hostname, MAX_HOSTNAME_LEN);
			*isrepl = 0;
			break;
		}
	}

	fclose(tfp);
}

char *get_mac(char *ifname, char *eabuf)
{
        int s;
        struct ifreq ifr;

        eabuf[0] = '\0';
        s = socket(AF_INET, SOCK_RAW, IPPROTO_RAW);
        if (s < 0)
                return eabuf;

        strncpy(ifr.ifr_name, ifname, IFNAMSIZ);
        if (ioctl(s, SIOCGIFHWADDR, &ifr) == 0)
                ether_etoa((uint8 *)ifr.ifr_hwaddr.sa_data, eabuf);
        close(s);

        return eabuf;
}


static int get_device_type(uint8 *mac, int guest_enable)
{
	FILE *fd;
	int found = NONETYPE, i = 0, num;
	char buff[512], arpmac[32], *port, *bmac, *other;


	struct interface_element if_ele[INTERFACENUM] = {
		{"br0", "00:00:00:00:00:00", 1},
		{"ath0", "00:00:00:00:00:00", 0},
		{"ath01", "00:00:00:00:00:00", 0},
		{"ath1", "00:00:00:00:00:00", 0},
		{"ath2", "00:00:00:00:00:00", 0},
		{"ath02", "00:00:00:00:00:00", 0},
		{"ath21", "00:00:00:00:00:00", 0},
		{NULL, "00:00:00:00:00:00", 0}
	};


	system("brctl showmacs br0 > /tmp/brctl_showmacs_br0");
	if((fd = fopen("/tmp/brctl_showmacs_br0", "r+")) == NULL)
		return NONETYPE;
	
	//get mac addresses to compare
	for (i = 0; i < INTERFACENUM; i++){
		if(if_ele[i].name == NULL) break;
		get_mac(if_ele[i].name, if_ele[i].mac);
	}

	/*
	 * #brctl showmacs br0
	 * port no		mac addr			is local?		ageing time
	 * 1			20:14:07:11:2A:20	yes				1.01
	 * ......
	 */
	fgets(buff, sizeof(buff), fd);		//skip first line
	while(fgets(buff, sizeof(buff), fd)){
		port = strtok(buff, " \t\n");
		bmac = strtok(NULL, " \t\n");
		other = strtok(NULL, " \t\n");
	
		strupr(bmac);
		for (i = 0; i < INTERFACENUM; i++){
			if(if_ele[i].name == NULL) break;
			if(!strncmp(bmac, if_ele[i].mac, 17)){
				if_ele[i].port = atoi(port);
				DEBUGP("Found %s interface port id %d\n", if_ele[i].name, if_ele[i].port);
				break;
			}
		}
	}
	
	fseek(fd, 0, SEEK_SET);
	fgets(buff, sizeof(buff), fd);		//skip first line
	ether_etoa(mac, arpmac);
	while(fgets(buff, sizeof(buff), fd)){
		int portnum=0;

		port = strtok(buff, " \t\n");
		bmac = strtok(NULL, " \t\n");
		other = strtok(NULL, " \t\n");
		
		strupr(bmac);
		if(strncmp(arpmac, bmac, strlen(arpmac)))
			continue;
		
		portnum = atoi(port);
		DEBUGP("ONE client from %d interface.\n", portnum);
		for (i = 0; i < INTERFACENUM; i++)
		{
			if(if_ele[i].name == NULL) break;
			// For Orbi projects 2.4G is ath0, ath02. 5G is ath1,ath11
			if (if_ele[i].port == portnum) {
				switch(i) {
					case BR0:
						found = WIRED;
						goto ret;
					case ATH0:
					case ATH02:
						found = WIRELESS_2G;
						goto ret;
					case ATH2:
					case ATH21:
						found = WIRELESS_5G;
						goto ret;
				}
			}
		}
	}

ret:
	fclose(fd);
	unlink("/tmp/brctl_showmacs_br0");
	return found;
}

int get_host_cache(uint8 *mac, char *host)
{
	uint32 i;
//	if(*host == '\0' || strcmp(host, "<unknown>") == 0)
	struct mac_host *p;
	i = arp_hash(mac);
	for(p = host_tbl[i]; p && memcmp(p->mac, mac, 6); p = p->next);
	if(p)
	{
		int len = strlen(p->host);
		len = len>NEIGH_HASHMASK ? NEIGH_HASHMASK : len;
		strncpy(host, p->host, len);
		host[len] = '\0';
	}
}

int update_arp_table(uint8 *mac, struct in_addr ip, int isrepl)
{
	uint32 i;
	char host[MAX_HOSTNAME_LEN + 1];
	struct arp_struct *u;
	
	/* check dhcp host */
	get_dhcp_host(host, ip, &isrepl);
	get_host_cache(mac, host);
	i = arp_hash(mac);

	/* for fix the bug-29548 */
	//for (u = arp_tbl[i]; u && memcmp(u->mac, mac, ETH_ALEN); u = u->next);
	for (u = arp_tbl[i]; u && (u->ip).s_addr != ip.s_addr; u = u->next);
	if (u) {
		if (*host)
			strncpy(u->host, host, MAX_HOSTNAME_LEN);
		u->ip = ip;              /* The IP may be changed for DHCP      */
		u->active = 1;
		return isrepl;	/* Do BIOS Name Query only ARP reply */
	}

	u = malloc(sizeof(struct arp_struct));
	if (u == 0)
		return 0;
	u->ip = ip;
	u->active = 1;
	strncpy(u->host, host, MAX_HOSTNAME_LEN);
	memcpy(u->mac, mac, ETH_ALEN);
	u->next = arp_tbl[i];
	arp_tbl[i] = u;

	return isrepl;
}

static void update_name(struct in_addr ip, char *host)
{
	int i;
	struct arp_struct *u;

	for (i = 0; i < (NEIGH_HASHMASK + 1); i++) {
		for (u = arp_tbl[i]; u; u = u->next)
			if (u->ip.s_addr == ip.s_addr) {
				strncpy(u->host, host, MAX_HOSTNAME_LEN);
				return;
			}
	}
}

void update_bios_name(uint8 *mac, char *host, struct in_addr ip)
{
	uint32 i;
	struct arp_struct *u;
	
	i = arp_hash(mac);
	for (u = arp_tbl[i]; u && memcmp(u->mac, mac, ETH_ALEN); u = u->next);

	if (u == 0) {
		update_name(ip, host); /* try it by IP address */
		return;
	}
	
	strncpy(u->host, host, MAX_HOSTNAME_LEN);
}

void recv_bios_pack(char *buf, int len, struct in_addr from)
{
#define HDR_SIZE		sizeof(struct nb_response_header)
	uint16 num;
	uint8 *p, *e;
	struct nb_response_header *resp;

	if (len < HDR_SIZE)
		return;
	
	resp = (struct nb_response_header *)buf;
	num = resp->num_names;
	p = (uint8*)&buf[HDR_SIZE];
	e = p + (num * 18);
	/* unique name, workstation service - this is computer name */
	for (; p < e; p += 18)
		if ((p[15] == 0 || p[15] == 0x20) && (p[16] & 0x80) == 0)
			break;
	if (p == e)
		return;
	if (p[15] == 0x20)
		p[15] = 0;
	update_bios_name(e, (char *)p, from);
}

char *ether_etoa(uint8 *e, char *a)
{
	static char hexbuf[] = "0123456789ABCDEF";
	
	int i, k;

	for (k = 0, i = 0; i < 6; i++) {
		a[k++] = hexbuf[(e[i] >> 4) & 0xF];
		a[k++] = hexbuf[(e[i]) & 0xF];
		a[k++]=':';
	}
	
	a[--k] = 0;
	
	return a;
}

/*
 * xss Protection 
 * < -> &lt;
 * > -> &gt;
 * ( -> &#40;
 * ) -> &#41;
 * " -> &#34;
 * ' -> &#39;
 * # -> &#35;
 * & -> &#38;
 */
char *host_stod(char *s)
{//change special character to ordinary string
	static char str[MAX_HOSTNAME_LEN*5 + 1 ];
	char c, *p;

	p = str;
        while((c = *s++) != '\0') {
                if(c == '"'){
                        *p++ = '&'; *p++ = '#'; *p++ = '3'; *p++ = '4'; *p++ = ';';
                } else if( c == '(' ){
                        *p++ = '&'; *p++ = '#'; *p++ = '4'; *p++ = '0'; *p++ = ';';
                } else if( c == ')' ){
                        *p++ = '&'; *p++ = '#'; *p++ = '4'; *p++ = '1'; *p++ = ';';
                } else if( c == '#' ){
                        *p++ = '&'; *p++ = '#'; *p++ = '3'; *p++ = '5'; *p++ = ';';
                } else if( c == '&' ){
                        *p++ = '&'; *p++ = '#'; *p++ = '3'; *p++ = '8'; *p++ = ';';
                } else if( c == '<' ){
                        *p++ = '&'; *p++ = 'l'; *p++ = 't'; *p++ = ';';
                } else if( c == '>' ){
                        *p++ = '&'; *p++ = 'g'; *p++ = 't'; *p++ = ';';
                } else if (c == '\'') {
                        *p++ = '&'; *p++ = '#'; *p++ = '3'; *p++ = '9'; *p++ = ';';
                }
                else {
                        *p++ = c;
                }
        }
        *p = '\0';

	return str;	
}

int open_arp_socket(struct sockaddr *me)
{
	int s;
	int buffersize = 200 * 1024;
	
	//s = socket(PF_PACKET, SOCK_PACKET, htons(ETH_P_ARP));
	s = socket(PF_PACKET, SOCK_PACKET, htons(ETH_P_ALL));
	if (s < 0)
		return -1;

	/* We're trying to override buffer size  to set a bigger buffer. */
	if (setsockopt(s, SOL_SOCKET, SO_RCVBUF, &buffersize, sizeof(buffersize)))
		fprintf(stderr, "setsocketopt error!\n");

	me->sa_family = PF_PACKET;
	strncpy(me->sa_data, ARP_IFNAME, 14);
	if (bind(s, me, sizeof(*me)) < 0)
		return -1;
	if (init_arp_request(ARP_IFNAME) == 0)
		return -1;
	
	return s;
}

int is_same_subnet(uint8 *sip)
{
	in_addr_t lan_ipaddr_i, lan_netmask_i, sip_i;
	char *lan_ipaddr, *lan_netmask;

	if(config_match("i_opmode", "apmode"))
		lan_ipaddr	= config_get("ap_dhcp_ipaddr");
	else
		lan_ipaddr	= config_get("lan_ipaddr");
	lan_ipaddr_i = inet_addr(lan_ipaddr);

	if(config_match("i_opmode", "apmode"))
		lan_netmask	= config_get("ap_dhcp_netmask");
	else
		lan_netmask	= config_get("lan_netmask");
	lan_netmask_i = inet_addr(lan_netmask);

	memcpy(&sip_i, sip, sizeof(sip_i));

	if((lan_ipaddr_i & lan_netmask_i) == (sip_i & lan_netmask_i))
		return 1;

	return 0;
}

int recv_arp_pack(struct arpmsg *arpkt, struct in_addr *send_ip)
{
	static uint8 zero[6] = { 0, 0, 0, 0, 0, 0 };
	
	struct in_addr src_ip;

	if (arpkt->ar_op != htons(ARPOP_REQUEST) && arpkt->ar_op != htons(ARPOP_REPLY))
		return 0;
	if (arpkt->ar_hrd != htons(ARPHRD_ETHER) ||arpkt->ar_pro != htons(ETH_P_IP))
		return 0;
	if (arpkt->ar_pln != 4 ||arpkt->ar_hln != ETH_ALEN)
		return 0;
	if(!is_same_subnet(arpkt->ar_sip))
		return 0;

	/*
	  * If It is Gratuitous ARP message, ignore it for Home Router passing Xbox test,
	  * else we need change the `udhcpd` code about `checking IP used` too much
	  * to pass `XBox DHCP Lease Test`. The normal ARP message ==MAY BE== all
	  * right for Attached Devices function.... &_&.
	  */
	if (memcmp(arpkt->ar_sip, arpkt->ar_tip, 4) == 0)
		return 0;

	memcpy(&src_ip, arpkt->ar_sip, 4);
	if (src_ip.s_addr == 0 ||memcmp(arpkt->ar_sha, zero, 6) == 0)
		return 0;

	*send_ip = src_ip;
	return update_arp_table(arpkt->ar_sha, src_ip, arpkt->ar_op == htons(ARPOP_REPLY));
}

void remove_disconn_dhcp(struct in_addr ip)
{
	int i, k, result;
	int target = 0;
	int target_num = 0;
	FILE *fp;
	fpos_t pos_w,pos_r,pos;
	char ipaddr[32];
	char line[512];
	char list_str[512];

	if ( !(fp = fopen (DHCP_LIST_FILE,"r")))
		return;
	
	while(fgets(line, sizeof(line), fp) != NULL) {
		result = sscanf(line, "%s%s", ipaddr,list_str);
		if (result == 2){
			if(memcmp(inet_ntoa(ip), ipaddr, strlen(ipaddr)) == 0) {
				target = 1;
				break;
			}
		}
		target_num ++;
	}
	fclose(fp);

	if (target != 1)
		return;

	if ( !(fp = fopen (DHCP_LIST_FILE,"r+")))
		return;
	for (i = 0; i < target_num; i++)
		fgets(line,sizeof(line),fp);
	
	/* save the file pointer position */
	fgetpos (fp,&pos_w);
	/* position the delete line */
	fgets(line,sizeof(line),fp);
	fgetpos (fp,&pos_r);
	pos = pos_r;

	while (1)
	{
		/* set a new file position */ 
		fsetpos (fp,&pos);
		if (fgets(line,sizeof(line),fp) ==NULL) 
			break;
		fgetpos (fp,&pos_r);
		pos = pos_w;
		fsetpos (fp,&pos);
		fprintf(fp,"%s",line);
		fgetpos (fp,&pos_w);
		pos = pos_r;
	}
	pos = pos_w;
	fsetpos (fp,&pos);
	k = strlen(line);
	for (i=0;i<k;i++) 
		fputc(0x20,fp);
	
	fclose(fp);
}

void remove_disconn_host(uint8 *mac)
{
	uint32 i;
	struct mac_host *p, *prev;
	i = arp_hash(mac);
	prev = host_tbl[i];
	for( p = host_tbl[i]; p && memcmp(p->mac, mac, 6); p = p->next)
		prev = p;
	if(prev && memcmp(prev->mac, mac, 6) == 0)
	{
		if(prev == host_tbl[i])
			host_tbl[i] = NULL;
		else
			prev->next = p->next;
		free(p);
	}
}

void strupr(char *str)
{
	for(;*str != '\0'; str++)
	{
		if(*str >= 97 && *str <= 122)
			*str = (*str)-32;
	}
}

void show_arp_table(void)
{
	int i,j=0, fd_flag;
	FILE *fp, *fw, *fp_wired, *fp_2g, *fp_5g;
	char mac[32];
	struct arp_struct *u;
	struct arp_struct **pprev;
	struct in_addr dhcp_host[256];
	char buffer[512];
	char *ipaddr;
	struct in_addr lan_ipaddr,lan_netmask;
	int guest_enable = 0;

	lan_ipaddr = get_ipaddr(ARP_IFNAME);
	lan_netmask = get_netmask(ARP_IFNAME);

	if (strcmp(config_get("wla1_endis_guestNet"), "1") == 0) 
		guest_enable = 1;
	
	fp = fopen(ARP_FILE, "w");
	if (fp == 0) return;
	fp_2g = fopen(ARP_FILE_2G, "w");
	if (fp_2g == 0) return;
	fp_5g = fopen(ARP_FILE_5G, "w");
	if (fp_5g == 0) return;
	fp_wired = fopen(ARP_FILE_WIRED, "w");
	if (fp_wired == 0) return;
	
	if (fw = fopen(WLAN_STA_FILE, "r")) {
		while (fgets(buffer, sizeof(buffer), fw)) {
			fd_flag = 0;
			for (i = 0; i < (NEIGH_HASHMASK + 1); i++) {
				for (pprev = &arp_tbl[i], u = *pprev; u; ) {
					ether_etoa(u->mac, mac);
					strupr(buffer);
					if(!strncmp(mac, buffer, strlen(mac))) {
						fd_flag = 1;
						u->active = 1;
						break;
					}
//					pprev = &u->next;
//					u = *pprev;
					u = u->next;
				}
			}
			/*if(!fd_flag) {
				strncpy(mac, buffer, 17);
				mac[17]='\0';
				strupr(mac);
				fprintf(fp, "%s %s %s @#$&*!\n",
					"&lt;unknown&gt", mac , "&lt;unknown&gt;");
			}
			*/
		}
		fclose(fw);
	}	

	for (i = 0; i < (NEIGH_HASHMASK + 1); i++) {
		for (pprev = &arp_tbl[i], u = *pprev; u; ) {
			if (u->active == 0) {
				remove_disconn_dhcp(u->ip);
				remove_disconn_host(u->mac);
				*pprev = u->next;
				free(u);
				u = *pprev;
				continue;
			}
#if 0
    // for dual-band, we should not remove the device whose ip network segment is not the same as br0.
			/*Remove the device whose ip network segment is not the same as br0*/
			if ((lan_ipaddr.s_addr & lan_netmask.s_addr) != (u->ip.s_addr & lan_netmask.s_addr))
			{
				*pprev = u->next;
				free(u);
				u = *pprev;
				continue;
			}
#endif
			/* for GUI dealing easily:  &lt;unknown&gt;   <----> <unknown>*/
			if(memcmp(u->mac, arpreq.h_source, 6) != 0) {
				get_host_cache(u->mac, u->host);
				//strupr(u->host);
				switch (get_device_type(u->mac, guest_enable))
				{
					case WIRELESS_2G:
						fprintf(fp_2g, "%s %s %s @#$&*!\n",
							inet_ntoa(u->ip), ether_etoa(u->mac, mac),
							u->host[0] == '\0' ? "&lt;unknown&gt;" : host_stod(u->host));
						fprintf(fp, "%s %s %s @#$&*!\n",
							inet_ntoa(u->ip), ether_etoa(u->mac, mac),
							u->host[0] == '\0' ? "&lt;unknown&gt;" : host_stod(u->host));
						break;
					case WIRELESS_5G:
						fprintf(fp_5g, "%s %s %s @#$&*!\n",
							inet_ntoa(u->ip), ether_etoa(u->mac, mac),
							u->host[0] == '\0' ? "&lt;unknown&gt;" : host_stod(u->host));
						fprintf(fp, "%s %s %s @#$&*!\n",
							inet_ntoa(u->ip), ether_etoa(u->mac, mac),
							u->host[0] == '\0' ? "&lt;unknown&gt;" : host_stod(u->host));
						break;
					case WIRED:
						fprintf(fp_wired, "%s %s %s @#$&*!\n",
							inet_ntoa(u->ip), ether_etoa(u->mac, mac),
							u->host[0] == '\0' ? "&lt;unknown&gt;" : host_stod(u->host));
						fprintf(fp, "%s %s %s @#$&*!\n",
							inet_ntoa(u->ip), ether_etoa(u->mac, mac),
							u->host[0] == '\0' ? "&lt;unknown&gt;" : host_stod(u->host));
						break;
				}
			}
			
			pprev = &u->next;
			u = *pprev;
		}
	}

	fclose(fp);
	fclose(fp_2g);
	fclose(fp_5g);
	fclose(fp_wired);
	
	/* for fix bug 31698,remove hosts which can't be found in the arp_tbl[] from dhcpd_hostlist*/
	if (fp = fopen(DHCP_LIST_FILE,"r")) {
		while (fgets(buffer, sizeof(buffer), fp)) {
			ipaddr = strtok(buffer, " \t\n");
			if (ipaddr && inet_aton(ipaddr, &dhcp_host[j]) != 0)
				j++;
		}
		fclose(fp);
	}
	for(j--;j >= 0; j--) {
		for (i = 0; i < (NEIGH_HASHMASK + 1); i++) {
			for (u = arp_tbl[i]; u && memcmp(&u->ip, &dhcp_host[j], sizeof(&u->ip)); u = u->next);
			if (u) break;
		}
		if (!u) remove_disconn_dhcp(dhcp_host[j]);
	}
}

/* To fix bug 22146, add function reset_arp_table, it can set active status of all nodes in the arp_tbl to 0 */
void reset_arp_table()
{
	int i;
	struct arp_struct *u;
	
	for (i = 0; i < (NEIGH_HASHMASK + 1); i++) {
		for (u = arp_tbl[i]; u; u = u->next) {
			u->active = 0;
		}
	}
}

void scan_arp_table(int sock, struct sockaddr *me)
{
	int i;
	int count = 0;
	struct arpmsg *req;
	struct arp_struct *u;
	char *ipaddr;
	char buffer[512];
	struct in_addr addr;
	FILE *fp;
	
	while (count != 2) {
		count++;
		req = &arpreq;
		for (i = 0; i < (NEIGH_HASHMASK + 1); i++) {
			for (u = arp_tbl[i]; u; u = u->next) {
				memcpy(req->ar_tip, &u->ip, 4);
				sendto(sock, req, sizeof(struct arpmsg), 0, me, sizeof(struct sockaddr));
			}
		}
		/**
		 * For beta issue: TD-23
		 * If use Ixia with some virtual DHCP clients to test "Attached Device" feature,
		 * Ixia could not send arp packet actively, we need request all IPs that DHCP server
		 * assigned while user refresh "Attached Device" table.
		 * We just request all IPs in "/tmp/dhcpd_hostlist" that were not recorded in 'arp_tbl'.
		 */
		if (fp = fopen(DHCP_LIST_FILE,"r")) {
			while (fgets(buffer, sizeof(buffer), fp)) {
				ipaddr = strtok(buffer, " \t\n");
				if (ipaddr && inet_aton(ipaddr, &addr) != 0) {
					for (i = 0; i < (NEIGH_HASHMASK + 1); i++) {
						for (u = arp_tbl[i]; u && memcmp(&u->ip, &addr, sizeof(addr)); u = u->next);
						if (u) break;
					}
					if (u) continue;
					memcpy(req->ar_tip, &addr, 4);
					sendto(sock, req, sizeof(struct arpmsg), 0, me, sizeof(struct sockaddr));
				}
			}
			fclose(fp);
		}
		if(count < 2)
			usleep(500000);
	}
}

void update_host_table(uint8 *mac, char *host)
{
	
	uint32 i;
	struct mac_host *u;
	
	i = arp_hash(mac);
	for (u = host_tbl[i]; u && memcmp(u->mac, mac, 6); u = u->next);
	if (u) {
		if (*host)
			strcpy(u->host, host);
		return ;
	}

	u = malloc(sizeof(struct mac_host));
	if (u == NULL)
		return ;
	u->next = NULL;
	strcpy(u->host, host);
	memcpy(u->mac, mac, ETH_ALEN);
	u->next = host_tbl[i];
	host_tbl[i] = u;
}

void deal_ip_packet(void *buf)
{
	struct iphdr *ip = (struct iphdr *)((char *)buf + 14);
	if(ip->protocol == 17)
	{
		struct udphdr *udph = (struct udphdr *)((char *)ip + (ip->ihl<<2));
		if(udph->dest == htons(67))
		{
			#define DHCP_HOST_NAME 0x0c
			struct dhcpMessage *dhcp = (struct dhcpMessage *)((char *)udph + 8);
			unsigned char *option = dhcp->options;
			int len = 308;//dhcp option length
			int i = 0;
			while(1)
			{
				if(i > len)
					return;	
				if(option[i] == DHCP_HOST_NAME)
				{
					if(i + 1 + option[i+1] >= len)
						return ;
					char host[MAX_HOSTNAME_LEN + 1];
					memcpy(host, option+i+2, option[i+1]);
					host[option[i+1]] = '\0';
					struct ethhdr *eth = (struct ethhdr *)buf;
					uint8 mac[6];
					memcpy(mac, eth->h_source, 6);
					update_host_table(mac, host);
					return ;
				}
				i += option[i+1] + 2;
			}
		}
	}
}

void show_host_table()
{
	struct mac_host *u;
	int i = 0;
	for(i = 0; i < NEIGH_HASHMASK + 1; ++i)
		for(u = host_tbl[i]; u; u =  u->next)
		{
			char tmp_mac[32];	
			printf("mac=%s, host=%s\n", ether_etoa(u->mac, tmp_mac), u->host);
		}
}
