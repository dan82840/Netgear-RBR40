#!/bin/sh

local BOARD=""

#lbd configs
#
lbd_updateDNI_config () {
    #Orbi DNI setting
    if [ "$BOARD" = "RBR50" -o "$BOARD" = "RBS50" -o "$BOARD" = "RBR30" -o "$BOARD" = "RBS30" -o "$BOARD" = "RBR40" -o "$BOARD" = "RBS40" ]; then
        #config

        local lbd_enable
        lbd_enable=$(config get lbd_enable)

        case $lbd_enable in
        1)
            uci set lbd.config.Enable=1
        ;;
        0)
            uci set lbd.config.Enable=0
        ;;
        "")
            lbd_enable=$(uci get lbd.config.Enable)
            config set lbd_enable=$lbd_enable
            config commit
        ;;
        esac

        local lbd_PHYBasedPrioritization
        lbd_PHYBasedPrioritization=$(config get lbd_PHYBasedPrioritization)

        case $lbd_PHYBasedPrioritization in
        1)
            uci set lbd.config.PHYBasedPrioritization=1
        ;;
        0)
            uci set lbd.config.PHYBasedPrioritization=0
        ;;
        "")
            lbd_PHYBasedPrioritization=$(uci get lbd.config.PHYBasedPrioritization)
            config set lbd_PHYBasedPrioritization=$lbd_PHYBasedPrioritization
            config commit
        ;;
        esac

        local lbd_MatchingSSID

        local guest_enable
        guest_enable="$(config get wlg1_endis_guestNet)"

        if [ "$guest_enable" -eq '1' ]; then 
            uci set lbd.config.MatchingSSID="$(config get wl_ssid)"
        else
            uci set lbd.config.MatchingSSID=""
        fi

        # Idle Steering
        local lbd_RSSISteeringPoint_DG
        local lbd_NormalInactTimeout
        local lbd_OverloadInactTimeout
        local lbd_InactCheckInterval
        local lbd_RSSISteeringPoint_UG

        lbd_RSSISteeringPoint_DG=$(config get lbd_RSSISteeringPoint_DG)
        if [ -n "$lbd_RSSISteeringPoint_DG" ]; then
            uci set lbd.IdleSteer.RSSISteeringPoint_DG=$lbd_RSSISteeringPoint_DG
        else
            config set lbd_RSSISteeringPoint_DG=$(uci get lbd.IdleSteer.RSSISteeringPoint_DG)
        fi

        lbd_NormalInactTimeout=$(config get lbd_NormalInactTimeout)
        if [ -n "$lbd_NormalInactTimeout" ]; then
            uci set lbd.IdleSteer.NormalInactTimeout=$lbd_NormalInactTimeout
        else
            config set lbd_NormalInactTimeout=$(uci get lbd.IdleSteer.NormalInactTimeout)
        fi

        lbd_OverloadInactTimeout=$(config get lbd_OverloadInactTimeout)
        if [ -n "$lbd_OverloadInactTimeout" ]; then
            uci set lbd.IdleSteer.OverloadInactTimeout=$lbd_OverloadInactTimeout
        else
            config set lbd_OverloadInactTimeout=$(uci get lbd.IdleSteer.OverloadInactTimeout)
        fi

        lbd_InactCheckInterval=$(config get lbd_InactCheckInterval)
        if [ -n "$lbd_InactCheckInterval" ]; then
            uci set lbd.IdleSteer.InactCheckInterval=$lbd_InactCheckInterval
        else
            config set lbd_InactCheckInterval=$(uci get lbd.IdleSteer.InactCheckInterval)
        fi

        lbd_RSSISteeringPoint_UG=$(config get lbd_RSSISteeringPoint_UG)
        if [ -n "$lbd_RSSISteeringPoint_UG" ]; then
            uci set lbd.IdleSteer.RSSISteeringPoint_UG=$lbd_RSSISteeringPoint_UG
        else
            config set lbd_RSSISteeringPoint_UG=$(uci get lbd.IdleSteer.RSSISteeringPoint_UG)
        fi

        # Active Steering
        local lbd_TxRateXingThreshold_UG
        local lbd_RateRSSIXingThreshold_UG
        local lbd_TxRateXingThreshold_DG
        local lbd_RateRSSIXingThreshold_DG

        lbd_TxRateXingThreshold_UG=$(config get lbd_TxRateXingThreshold_UG)
        if [ -n "$lbd_TxRateXingThreshold_UG" ]; then
            uci set lbd.ActiveSteer.TxRateXingThreshold_UG=$lbd_TxRateXingThreshold_UG
        else
            config set lbd_TxRateXingThreshold_UG=$(uci get lbd.ActiveSteer.TxRateXingThreshold_UG)
        fi

        lbd_RateRSSIXingThreshold_UG=$(config get lbd_RateRSSIXingThreshold_UG)
        if [ -n "$lbd_RateRSSIXingThreshold_UG" ]; then
            uci set lbd.ActiveSteer.RateRSSIXingThreshold_UG=$lbd_RateRSSIXingThreshold_UG
        else
            config set lbd_RateRSSIXingThreshold_UG=$(uci get lbd.ActiveSteer.RateRSSIXingThreshold_UG)
        fi

        lbd_TxRateXingThreshold_DG=$(config get lbd_TxRateXingThreshold_DG)
        if [ -n "$lbd_TxRateXingThreshold_DG" ]; then
            uci set lbd.ActiveSteer.TxRateXingThreshold_DG=$lbd_TxRateXingThreshold_DG
        else
            config set lbd_TxRateXingThreshold_DG=$(uci get lbd.ActiveSteer.TxRateXingThreshold_DG)
        fi

        lbd_RateRSSIXingThreshold_DG=$(config get lbd_RateRSSIXingThreshold_DG)
        if [ -n "$lbd_RateRSSIXingThreshold_DG" ]; then
            uci set lbd.ActiveSteer.RateRSSIXingThreshold_DG=$lbd_RateRSSIXingThreshold_DG
        else
            config set lbd_RateRSSIXingThreshold_DG=$(uci get lbd.ActiveSteer.RateRSSIXingThreshold_DG)
        fi

        # Offload
        local lbd_MUAvgPeriod
        local lbd_MUOverloadThreshold_W5
        local lbd_MUOverloadThreshold_W2
        local lbd_MUSafetyThreshold_W5
        local lbd_MUSafetyThreshold_W2
        local lbd_OffloadingMinRSSI

        lbd_MUAvgPeriod=$(config get lbd_MUAvgPeriod)
        if [ -n "$lbd_MUAvgPeriod" ]; then
            uci set lbd.Offload.MUAvgPeriod=$lbd_MUAvgPeriod
        else
            config set lbd_MUAvgPeriod=$(uci get lbd.Offload.MUAvgPeriod)
        fi

        lbd_MUOverloadThreshold_W5=$(config get lbd_MUOverloadThreshold_W5)
        if [ -n "$lbd_MUOverloadThreshold_W5" ]; then
            uci set lbd.Offload.MUOverloadThreshold_W5=$lbd_MUOverloadThreshold_W5
        else
            config set lbd_MUOverloadThreshold_W5=$(uci get lbd.Offload.MUOverloadThreshold_W5)
        fi

        lbd_MUOverloadThreshold_W2=$(config get lbd_MUOverloadThreshold_W2)
        if [ -n "$lbd_MUOverloadThreshold_W2" ]; then
            uci set lbd.Offload.MUOverloadThreshold_W2=$lbd_MUOverloadThreshold_W2
        else
            config set lbd_MUOverloadThreshold_W2=$(uci get lbd.Offload.MUOverloadThreshold_W2)
        fi

        lbd_MUSafetyThreshold_W5=$(config get lbd_MUSafetyThreshold_W5)
        if [ -n "$lbd_MUSafetyThreshold_W5" ]; then
            uci set lbd.Offload.MUSafetyThreshold_W5=$lbd_MUSafetyThreshold_W5
        else
            config set lbd_MUSafetyThreshold_W5=$(uci get lbd.Offload.MUSafetyThreshold_W5)
        fi

        lbd_MUSafetyThreshold_W2=$(config get lbd_MUSafetyThreshold_W2)
        if [ -n "$lbd_MUSafetyThreshold_W2" ]; then
            uci set lbd.Offload.MUSafetyThreshold_W2=$lbd_MUSafetyThreshold_W2
        else
            config set lbd_MUSafetyThreshold_W2=$(uci get lbd.Offload.MUSafetyThreshold_W2)
        fi

        lbd_OffloadingMinRSSI=$(config get lbd_OffloadingMinRSSI)
        if [ -n "$lbd_OffloadingMinRSSI" ]; then
            uci set lbd.Offload.OffloadingMinRSSI=$lbd_OffloadingMinRSSI
        else
            config set lbd_OffloadingMinRSSI=$(uci get lbd.Offload.OffloadingMinRSSI)
        fi

        #StaDB
        local lbd_IncludeOutOfNetwork

        lbd_IncludeOutOfNetwork=$(config get lbd_IncludeOutOfNetwork)
        if [ -n "$lbd_IncludeOutOfNetwork" ]; then
            uci set lbd.StaDB.IncludeOutOfNetwork=$lbd_IncludeOutOfNetwork
        else
            config set lbd_IncludeOutOfNetwork=$(uci get lbd.StaDB.IncludeOutOfNetwork)
        fi

        #SteerExec
        local lbd_SteeringProhibitTime
        local lbd_BTMSteeringProhibitShortTime

        lbd_SteeringProhibitTime=$(config get lbd_SteeringProhibitTime)
        if [ -n "$lbd_SteeringProhibitTime" ]; then
            uci set lbd.SteerExec.SteeringProhibitTime=$lbd_SteeringProhibitTime
        else
            config set lbd_SteeringProhibitTime=$(uci get lbd.SteerExec.SteeringProhibitTime)
        fi

        lbd_BTMSteeringProhibitShortTime=$(config get lbd_BTMSteeringProhibitShortTime)
        if [ -n "$lbd_BTMSteeringProhibitShortTime" ]; then
            uci set lbd.SteerExec.BTMSteeringProhibitShortTime=$lbd_BTMSteeringProhibitShortTime
        else
            config set lbd_BTMSteeringProhibitShortTime=$(uci get lbd.SteerExec.BTMSteeringProhibitShortTime)
        fi

        #AP_Steer
        local lbd_LowRSSIAPSteerThreshold_CAP_W5
        local lbd_LowRSSIAPSteerThreshold_RE_W5
        local lbd_LowRSSIAPSteerThreshold_CAP_w2
        local lbd_LowRSSIAPSteerThreshold_RE_w2
        local lbd_APSteerToRootMinRSSIIncThreshold
        local lbd_APSteerToLeafMinRSSIIncThreshold
        local lbd_APSteerToPeerMinRSSIIncThreshold
        local lbd_DownlinkRSSIThreshold_W5

        lbd_LowRSSIAPSteerThreshold_CAP_W5=$(config get lbd_LowRSSIAPSteerThreshold_CAP_W5)
        if [ -n "$lbd_LowRSSIAPSteerThreshold_CAP_W5" ]; then
            uci set lbd.APSteer.LowRSSIAPSteerThreshold_CAP_W5=$lbd_LowRSSIAPSteerThreshold_CAP_W5
        else
            config set lbd_LowRSSIAPSteerThreshold_CAP_W5=$(uci get lbd.APSteer.LowRSSIAPSteerThreshold_CAP_W5)
        fi

        lbd_LowRSSIAPSteerThreshold_RE_W5=$(config get lbd_LowRSSIAPSteerThreshold_RE_W5)
        if [ -n "$lbd_LowRSSIAPSteerThreshold_RE_W5" ]; then
            uci set lbd.APSteer.LowRSSIAPSteerThreshold_RE_W5=$lbd_LowRSSIAPSteerThreshold_RE_W5
        else
            config set lbd_LowRSSIAPSteerThreshold_RE_W5=$(uci get lbd.APSteer.LowRSSIAPSteerThreshold_RE_W5)
        fi

        lbd_LowRSSIAPSteerThreshold_CAP_W2=$(config get lbd_LowRSSIAPSteerThreshold_CAP_W2)
        if [ -n "$lbd_LowRSSIAPSteerThreshold_CAP_W2" ]; then
            uci set lbd.APSteer.LowRSSIAPSteerThreshold_CAP_W2=$lbd_LowRSSIAPSteerThreshold_CAP_W2
        else
            config set lbd_LowRSSIAPSteerThreshold_CAP_W2=$(uci get lbd.APSteer.LowRSSIAPSteerThreshold_CAP_W2)
        fi

        lbd_LowRSSIAPSteerThreshold_RE_W2=$(config get lbd_LowRSSIAPSteerThreshold_RE_W2)
        if [ -n "$lbd_LowRSSIAPSteerThreshold_RE_W2" ]; then
            uci set lbd.APSteer.LowRSSIAPSteerThreshold_RE_W2=$lbd_LowRSSIAPSteerThreshold_RE_W2
        else
            config set lbd_LowRSSIAPSteerThreshold_RE_W2=$(uci get lbd.APSteer.LowRSSIAPSteerThreshold_RE_W2)
        fi

        lbd_APSteerToRootMinRSSIIncThreshold=$(config get lbd_APSteerToRootMinRSSIIncThreshold)
        if [ -n "$lbd_APSteerToRootMinRSSIIncThreshold" ]; then
            uci set lbd.APSteer.APSteerToRootMinRSSIIncThreshold=$lbd_APSteerToRootMinRSSIIncThreshold
        else
            config set lbd_APSteerToRootMinRSSIIncThreshold=$(uci get lbd.APSteer.APSteerToRootMinRSSIIncThreshold)
        fi

        lbd_APSteerToLeafMinRSSIIncThreshold=$(config get lbd_APSteerToLeafMinRSSIIncThreshold)
        if [ -n "$lbd_APSteerToLeafMinRSSIIncThreshold" ]; then
            uci set lbd.APSteer.APSteerToLeafMinRSSIIncThreshold=$lbd_APSteerToLeafMinRSSIIncThreshold
        else
            config set lbd_APSteerToLeafMinRSSIIncThreshold=$(uci get lbd.APSteer.APSteerToLeafMinRSSIIncThreshold)
        fi

        lbd_APSteerToPeerMinRSSIIncThreshold=$(config get lbd_APSteerToPeerMinRSSIIncThreshold)
        if [ -n "$lbd_APSteerToPeerMinRSSIIncThreshold" ]; then
            uci set lbd.APSteer.APSteerToPeerMinRSSIIncThreshold=$lbd_APSteerToPeerMinRSSIIncThreshold
        else
            config set lbd_APSteerToPeerMinRSSIIncThreshold=$(uci get lbd.APSteer.APSteerToPeerMinRSSIIncThreshold)
        fi

        lbd_DownlinkRSSIThreshold_W5=$(config get lbd_DownlinkRSSIThreshold_W5)
        if [ -n "$lbd_DownlinkRSSIThreshold_W5" ]; then
            uci set lbd.APSteer.DownlinkRSSIThreshold_W5=$lbd_DownlinkRSSIThreshold_W5
        else
            config set lbd_DownlinkRSSIThreshold_W5=$(uci get lbd.APSteer.DownlinkRSSIThreshold_W5)
        fi

        #config_Adv
        local lbd_AgeLimit

        lbd_AgeLimit=$(config get lbd_AgeLimit)
        if [ -n "$lbd_AgeLimit" ]; then
            uci set lbd.config_Adv.AgeLimit=$lbd_AgeLimit
        else
            config set lbd_AgeLimit=$(uci get lbd.config_Adv.AgeLimit)
        fi

        #StaDB_Adv
        local lbd_AgingSizeThreshold
        local lbd_AgingFrequency
        local lbd_OutOfNetworkMaxAge
        local lbd_InNetworkMaxAge
        local lbd_NumRemoteBSSes

        lbd_AgingSizeThreshold=$(config get lbd_AgingSizeThreshold)
        if [ -n "$lbd_AgingSizeThreshold" ]; then
            uci set lbd.StaDB_Adv.AgingSizeThreshold=$lbd_AgingSizeThreshold
        else
            config set lbd_AgingSizeThreshold=$(uci get lbd.StaDB_Adv.AgingSizeThreshold)
        fi

        lbd_AgingFrequency=$(config get lbd_AgingFrequency)
        if [ -n "$lbd_AgingFrequency" ]; then
            uci set lbd.StaDB_Adv.AgingFrequency=$lbd_AgingFrequency
        else
            config set lbd_AgingFrequency=$(uci get lbd.StaDB_Adv.AgingFrequency)
        fi

        lbd_OutOfNetworkMaxAge=$(config get lbd_OutOfNetworkMaxAge)
        if [ -n "$lbd_OutOfNetworkMaxAge" ]; then
            uci set lbd.StaDB_Adv.OutOfNetworkMaxAge=$lbd_OutOfNetworkMaxAge
        else
            config set lbd_OutOfNetworkMaxAge=$(uci get lbd.StaDB_Adv.OutOfNetworkMaxAge)
        fi

        lbd_InNetworkMaxAge=$(config get lbd_InNetworkMaxAge)
        if [ -n "$lbd_InNetworkMaxAge" ]; then
            uci set lbd.StaDB_Adv.InNetworkMaxAge=$lbd_InNetworkMaxAge
        else
            config set lbd_InNetworkMaxAge=$(uci get lbd.StaDB_Adv.InNetworkMaxAge)
        fi

        lbd_NumRemoteBSSes=$(config get lbd_NumRemoteBSSes)
        if [ -n "$lbd_NumRemoteBSSes" ]; then
            uci set lbd.StaDB_Adv.NumRemoteBSSes=$lbd_NumRemoteBSSes
        else
            config set lbd_NumRemoteBSSes=$(uci get lbd.StaDB_Adv.NumRemoteBSSes)
        fi

        #StaMonitor_Adv
        local lbd_RSSIMeasureSamples_W2
        local lbd_RSSIMeasureSamples_W5

        lbd_RSSIMeasureSamples_W2=$(config get lbd_RSSIMeasureSamples_W2)
        if [ -n "$lbd_RSSIMeasureSamples_W2" ]; then
            uci set lbd.StaMonitor_Adv.RSSIMeasureSamples_W2=$lbd_RSSIMeasureSamples_W2
        else
            config set lbd_RSSIMeasureSamples_W2=$(uci get lbd.StaMonitor_Adv.RSSIMeasureSamples_W2)
        fi

        lbd_RSSIMeasureSamples_W5=$(config get lbd_RSSIMeasureSamples_W5)
        if [ -n "$lbd_RSSIMeasureSamples_W5" ]; then
            uci set lbd.StaMonitor_Adv.RSSIMeasureSamples_W5=$lbd_RSSIMeasureSamples_W5
        else
            config set lbd_RSSIMeasureSamples_W5=$(uci get lbd.StaMonitor_Adv.RSSIMeasureSamples_W5)
        fi

        #BandMonitor_Adv
        local lbd_ProbeCountThreshold
        local lbd_MUCheckInterval_W2
        local lbd_MUCheckInterval_W5
        local lbd_MUReportPeriod
        local lbd_LoadBalancingAllowedMaxPeriod
        local lbd_NumRemoteChannels

        lbd_ProbeCountThreshold=$(config get lbd_ProbeCountThreshold)
        if [ -n "$lbd_ProbeCountThreshold" ]; then
            uci set lbd.BandMonitor_Adv.ProbeCountThreshold=$lbd_ProbeCountThreshold
        else
            config set lbd_ProbeCountThreshold=$(uci get lbd.BandMonitor_Adv.ProbeCountThreshold)
        fi

        lbd_MUCheckInterval_W2=$(config get lbd_MUCheckInterval_W2)
        if [ -n "$lbd_MUCheckInterval_W2" ]; then
            uci set lbd.BandMonitor_Adv.MUCheckInterval_W2=$lbd_MUCheckInterval_W2
        else
            config set lbd_MUCheckInterval_W2=$(uci get lbd.BandMonitor_Adv.MUCheckInterval_W2)
        fi

        lbd_MUCheckInterval_W5=$(config get lbd_MUCheckInterval_W5)
        if [ -n "$lbd_MUCheckInterval_W5" ]; then
            uci set lbd.BandMonitor_Adv.MUCheckInterval_W5=$lbd_MUCheckInterval_W5
        else
            config set lbd_MUCheckInterval_W5=$(uci get lbd.BandMonitor_Adv.MUCheckInterval_W5)
        fi

        lbd_MUReportPeriod=$(config get lbd_MUReportPeriod)
        if [ -n "$lbd_MUReportPeriod" ]; then
            uci set lbd.BandMonitor_Adv.MUReportPeriod=$lbd_MUReportPeriod
        else
            config set lbd_MUReportPeriod=$(uci get lbd.BandMonitor_Adv.MUReportPeriod)
        fi

        lbd_LoadBalancingAllowedMaxPeriod=$(config get lbd_LoadBalancingAllowedMaxPeriod)
        if [ -n "$lbd_LoadBalancingAllowedMaxPeriod" ]; then
            uci set lbd.BandMonitor_Adv.LoadBalancingAllowedMaxPeriod=$lbd_LoadBalancingAllowedMaxPeriod
        else
            config set lbd_LoadBalancingAllowedMaxPeriod=$(uci get lbd.BandMonitor_Adv.LoadBalancingAllowedMaxPeriod)
        fi

        lbd_NumRemoteChannels=$(config get lbd_NumRemoteChannels)
        if [ -n "$lbd_NumRemoteChannels" ]; then
            uci set lbd.BandMonitor_Adv.NumRemoteChannels=$lbd_NumRemoteChannels
        else
            config set lbd_NumRemoteChannels=$(uci get lbd.BandMonitor_Adv.NumRemoteChannels)
        fi

        #Estimator_Adv
        local lbd_RSSIDiff_EstW5FromW2
        local lbd_RSSIDiff_EstW2FromW5
        local lbd_Est_ProbeCountThreshold
        local lbd_StatsSampleInterval
        local lbd_11kProhibitTimeShort
        local lbd_11kProhibitTimeLong
        local lbd_PhyRateScalingForAirtime
        local lbd_EnableContinuousThroughput
        local lbd_BcnrptActiveDuration
        local lbd_BcnrptPassiveDuration

        lbd_RSSIDiff_EstW5FromW2=$(config get lbd_RSSIDiff_EstW5FromW2)
        if [ -n "$lbd_RSSIDiff_EstW5FromW2" ]; then
            uci set lbd.Estimator_Adv.RSSIDiff_EstW5FromW2=$lbd_RSSIDiff_EstW5FromW2
        else
            config set lbd_RSSIDiff_EstW5FromW2=$(uci get lbd.Estimator_Adv.RSSIDiff_EstW5FromW2)
        fi

        lbd_RSSIDiff_EstW2FromW5=$(config get lbd_RSSIDiff_EstW2FromW5)
        if [ -n "$lbd_RSSIDiff_EstW2FromW5" ]; then
            uci set lbd.Estimator_Adv.RSSIDiff_EstW2FromW5=$lbd_RSSIDiff_EstW2FromW5
        else
            config set lbd_RSSIDiff_EstW2FromW5=$(uci get lbd.Estimator_Adv.RSSIDiff_EstW2FromW5)
        fi

        lbd_Est_ProbeCountThreshold=$(config get lbd_Est_ProbeCountThreshold)
        if [ -n "$lbd_Est_ProbeCountThreshold" ]; then
            uci set lbd.Estimator_Adv.ProbeCountThreshold=$lbd_Est_ProbeCountThreshold
        else
            config set lbd_Est_ProbeCountThreshold=$(uci get lbd.Estimator_Adv.ProbeCountThreshold)
        fi

        lbd_StatsSampleInterval=$(config get lbd_StatsSampleInterval)
        if [ -n "$lbd_StatsSampleInterval" ]; then
            uci set lbd.Estimator_Adv.StatsSampleInterval=$lbd_StatsSampleInterval
        else
            config set lbd_StatsSampleInterval=$(uci get lbd.Estimator_Adv.StatsSampleInterval)
        fi

        lbd_11kProhibitTimeShort=$(config get lbd_11kProhibitTimeShort)
        if [ -n "$lbd_11kProhibitTimeShort" ]; then
            uci set lbd.Estimator_Adv.11kProhibitTimeShort=$lbd_11kProhibitTimeShort
        else
            config set lbd_11kProhibitTimeShort=$(uci get lbd.Estimator_Adv.11kProhibitTimeShort)
        fi

        lbd_11kProhibitTimeLong=$(config get lbd_11kProhibitTimeLong)
        if [ -n "$lbd_11kProhibitTimeLong" ]; then
            uci set lbd.Estimator_Adv.11kProhibitTimeLong=$lbd_11kProhibitTimeLong
        else
            config set lbd_11kProhibitTimeLong=$(uci get lbd.Estimator_Adv.11kProhibitTimeLong)
        fi

        lbd_PhyRateScalingForAirtime=$(config get lbd_PhyRateScalingForAirtime)
        if [ -n "$lbd_PhyRateScalingForAirtime" ]; then
            uci set lbd.Estimator_Adv.PhyRateScalingForAirtime=$lbd_PhyRateScalingForAirtime
        else
            config set lbd_PhyRateScalingForAirtime=$(uci get lbd.Estimator_Adv.PhyRateScalingForAirtime)
        fi

        lbd_EnableContinuousThroughput=$(config get lbd_EnableContinuousThroughput)
        if [ -n "$lbd_EnableContinuousThroughput" ]; then
            uci set lbd.Estimator_Adv.EnableContinuousThroughput=$lbd_EnableContinuousThroughput
        else
            config set lbd_EnableContinuousThroughput=$(uci get lbd.Estimator_Adv.EnableContinuousThroughput)
        fi

        lbd_BcnrptActiveDuration=$(config get lbd_BcnrptActiveDuration)
        if [ -n "$lbd_BcnrptActiveDuration" ]; then
            uci set lbd.Estimator_Adv.BcnrptActiveDuration=$lbd_BcnrptActiveDuration
        else
            config set lbd_BcnrptActiveDuration=$(uci get lbd.Estimator_Adv.BcnrptActiveDuration)
        fi

        lbd_BcnrptPassiveDuration=$(config get lbd_BcnrptPassiveDuration)
        if [ -n "$lbd_BcnrptPassiveDuration" ]; then
            uci set lbd.Estimator_Adv.BcnrptPassiveDuration=$lbd_BcnrptPassiveDuration
        else
            config set lbd_BcnrptPassiveDuration=$(uci get lbd.Estimator_Adv.BcnrptPassiveDuration)
        fi

        #SteerExec_Adv
        local lbd_TSteering
        local lbd_InitialAuthRejCoalesceTime
        local lbd_AuthRejMax
        local lbd_SteeringUnfriendlyTime
        local lbd_MaxSteeringUnfriendly
        local lbd_TargetLowRSSIThreshold_W2
        local lbd_TargetLowRSSIThreshold_W5
        local lbd_BlacklistTime
        local lbd_BTMResponseTime
        local lbd_BTMAssociationTime
        local lbd_BTMAlsoBlacklist
        local lbd_BTMUnfriendlyTime
        local lbd_MaxBTMUnfriendly
        local lbd_MaxBTMActiveUnfriendly
        local lbd_MinRSSIBestEffort
        local lbd_LowRSSIXingThreshold


        lbd_TSteering=$(config get lbd_TSteering)
        if [ -n "$lbd_TSteering" ]; then
            uci set lbd.SteerExec_Adv.TSteering=$lbd_TSteering
        else
            config set lbd_TSteering=$(uci get lbd.SteerExec_Adv.TSteering)
        fi

        lbd_InitialAuthRejCoalesceTime=$(config get lbd_InitialAuthRejCoalesceTime)
        if [ -n "$lbd_InitialAuthRejCoalesceTime" ]; then
            uci set lbd.SteerExec_Adv.InitialAuthRejCoalesceTime=$lbd_InitialAuthRejCoalesceTime
        else
            config set lbd_InitialAuthRejCoalesceTime=$(uci get lbd.SteerExec_Adv.InitialAuthRejCoalesceTime)
        fi

        lbd_AuthRejMax=$(config get lbd_AuthRejMax)
        if [ -n "$lbd_AuthRejMax" ]; then
            uci set lbd.SteerExec_Adv.AuthRejMax=$lbd_AuthRejMax
        else
            config set lbd_AuthRejMax=$(uci get lbd.SteerExec_Adv.AuthRejMax)
        fi

        lbd_SteeringUnfriendlyTime=$(config get lbd_SteeringUnfriendlyTime)
        if [ -n "$lbd_SteeringUnfriendlyTime" ]; then
            uci set lbd.SteerExec_Adv.SteeringUnfriendlyTime=$lbd_SteeringUnfriendlyTime
        else
            config set lbd_SteeringUnfriendlyTime=$(uci get lbd.SteerExec_Adv.SteeringUnfriendlyTime)
        fi

        lbd_MaxSteeringUnfriendly=$(config get lbd_MaxSteeringUnfriendly)
        if [ -n "$lbd_MaxSteeringUnfriendly" ]; then
            uci set lbd.SteerExec_Adv.MaxSteeringUnfriendly=$lbd_MaxSteeringUnfriendly
        else
            config set lbd_MaxSteeringUnfriendly=$(uci get lbd.SteerExec_Adv.MaxSteeringUnfriendly)
        fi

        lbd_TargetLowRSSIThreshold_W2=$(config get lbd_TargetLowRSSIThreshold_W2)
        if [ -n "$lbd_TargetLowRSSIThreshold_W2" ]; then
            uci set lbd.SteerExec_Adv.TargetLowRSSIThreshold_W2=$lbd_TargetLowRSSIThreshold_W2
        else
            config set lbd_TargetLowRSSIThreshold_W2=$(uci get lbd.SteerExec_Adv.TargetLowRSSIThreshold_W2)
        fi

        lbd_TargetLowRSSIThreshold_W5=$(config get lbd_TargetLowRSSIThreshold_W5)
        if [ -n "$lbd_TargetLowRSSIThreshold_W5" ]; then
            uci set lbd.SteerExec_Adv.TargetLowRSSIThreshold_W5=$lbd_TargetLowRSSIThreshold_W5
        else
            config set lbd_TargetLowRSSIThreshold_W5=$(uci get lbd.SteerExec_Adv.TargetLowRSSIThreshold_W5)
        fi

        lbd_BlacklistTime=$(config get lbd_BlacklistTime)
        if [ -n "$lbd_BlacklistTime" ]; then
            uci set lbd.SteerExec_Adv.BlacklistTime=$lbd_BlacklistTime
        else
            config set lbd_BlacklistTime=$(uci get lbd.SteerExec_Adv.BlacklistTime)
        fi

        lbd_BTMResponseTime=$(config get lbd_BTMResponseTime)
        if [ -n "$lbd_BTMResponseTime" ]; then
            uci set lbd.SteerExec_Adv.BTMResponseTime=$lbd_BTMResponseTime
        else
            config set lbd_BTMResponseTime=$(uci get lbd.SteerExec_Adv.BTMResponseTime)
        fi

        lbd_BTMAssociationTime=$(config get lbd_BTMAssociationTime)
        if [ -n "$lbd_BTMAssociationTime" ]; then
            uci set lbd.SteerExec_Adv.BTMAssociationTime=$lbd_BTMAssociationTime
        else
            config set lbd_BTMAssociationTime=$(uci get lbd.SteerExec_Adv.BTMAssociationTime)
        fi

        lbd_BTMAlsoBlacklist=$(config get lbd_BTMAlsoBlacklist)
        if [ -n "$lbd_BTMAlsoBlacklist" ]; then
            uci set lbd.SteerExec_Adv.BTMAlsoBlacklist=$lbd_BTMAlsoBlacklist
        else
            config set lbd_BTMAlsoBlacklist=$(uci get lbd.SteerExec_Adv.BTMAlsoBlacklist)
        fi

        lbd_BTMUnfriendlyTime=$(config get lbd_BTMUnfriendlyTime)
        if [ -n "$lbd_BTMUnfriendlyTime" ]; then
            uci set lbd.SteerExec_Adv.BTMUnfriendlyTime=$lbd_BTMUnfriendlyTime
        else
            config set lbd_BTMUnfriendlyTime=$(uci get lbd.SteerExec_Adv.BTMUnfriendlyTime)
        fi

        lbd_MaxBTMUnfriendly=$(config get lbd_MaxBTMUnfriendly)
        if [ -n "$lbd_MaxBTMUnfriendly" ]; then
            uci set lbd.SteerExec_Adv.MaxBTMUnfriendly=$lbd_MaxBTMUnfriendly
        else
            config set lbd_MaxBTMUnfriendly=$(uci get lbd.SteerExec_Adv.MaxBTMUnfriendly)
        fi

        lbd_MaxBTMActiveUnfriendly=$(config get lbd_MaxBTMActiveUnfriendly)
        if [ -n "$lbd_MaxBTMActiveUnfriendly" ]; then
            uci set lbd.SteerExec_Adv.MaxBTMActiveUnfriendly=$lbd_MaxBTMActiveUnfriendly
        else
            config set lbd_MaxBTMActiveUnfriendly=$(uci get lbd.SteerExec_Adv.MaxBTMActiveUnfriendly)
        fi

        lbd_MinRSSIBestEffort=$(config get lbd_MinRSSIBestEffort)
        if [ -n "$lbd_MinRSSIBestEffort" ]; then
            uci set lbd.SteerExec_Adv.MinRSSIBestEffort=$lbd_MinRSSIBestEffort
        else
            config set lbd_MinRSSIBestEffort=$(uci get lbd.SteerExec_Adv.MinRSSIBestEffort)
        fi

        lbd_LowRSSIXingThreshold=$(config get lbd_LowRSSIXingThreshold)
        if [ -n "$lbd_LowRSSIXingThreshold" ]; then
            uci set lbd.SteerExec_Adv.LowRSSIXingThreshold=$lbd_LowRSSIXingThreshold
        else
            config set lbd_LowRSSIXingThreshold=$(uci get lbd.SteerExec_Adv.LowRSSIXingThreshold)
        fi

        #SteerAlg_Adv
        local lbd_MinTxRateIncreaseThreshold
        local lbd_MaxSteeringTargetCount

        lbd_MinTxRateIncreaseThreshold=$(config get lbd_MinTxRateIncreaseThreshold)
        if [ -n "$lbd_MinTxRateIncreaseThreshold" ]; then
            uci set lbd.SteerAlg_Adv.MinTxRateIncreaseThreshold=$lbd_MinTxRateIncreaseThreshold
        else
            config set lbd_MinTxRateIncreaseThreshold=$(uci get lbd.SteerAlg_Adv.MinTxRateIncreaseThreshold)
        fi

        lbd_MaxSteeringTargetCount=$(config get lbd_MaxSteeringTargetCount)
        if [ -n "$lbd_MaxSteeringTargetCount" ]; then
            uci set lbd.SteerAlg_Adv.MaxSteeringTargetCount=$lbd_MaxSteeringTargetCount
        else
            config set lbd_MaxSteeringTargetCount=$(uci get lbd.SteerAlg_Adv.MaxSteeringTargetCount)
        fi

        #Enable lbd diaglog
        local enable_lbd_diaglog
        enable_lbd_diaglog=$(config get enable_lbd_diaglog)
        case $enable_lbd_diaglog in
        1)
            uci set lbd.DiagLog.EnableLog=1
            uci set lbd.DiagLog.LogServerIP=192.168.1.170
            uci set lbd.DiagLog.LogLevelWlanIF=0
            uci set lbd.DiagLog.LogLevelBandMon=0
            uci set lbd.DiagLog.LogLevelStaDB=0
            uci set lbd.DiagLog.LogLevelSteerExec=0
            uci set lbd.DiagLog.LogLevelStaMon=0
            uci set lbd.DiagLog.LogLevelEstimator=0
            uci set lbd.DiagLog.LogLevelDiagLog=0
        ;;
        0)
            uci set lbd.config.Enable=0
        ;;
        "")
            config set enable_lbd_diaglog=0
            config commit
        ;;
	esac


        local enable_band_steering
        local multi_ap_disablesteering

        enable_band_steering=$(config get enable_band_steering)
        multi_ap_disablesteering=$(config get multi_ap_disablesteering)


        case $enable_band_steering in
        1)
            uci set hyd.config.DisableSteering=0
            uci set repacd.repacd.EnableSteering=1
            uci commit hyd
            uci commit repacd

        ;;
        0)
            uci set hyd.config.DisableSteering=1
            uci set repacd.repacd.EnableSteering=0
            uci commit hyd
            uci commit repacd

        ;;
        "")
            enable_band_steering=$(uci get repacd.repacd.EnableSteering)

            case $enable_band_steering in
            1)
                uci set hyd.config.DisableSteering=0
                config set enable_band_steering=$enable_band_steering
                uci commit hyd
            ;;
            *)
                uci set hyd.config.DisableSteering=1
                config set enable_band_steering=$enable_band_steering
                uci commit hyd
            ;;
            esac

        ;;
        esac


        case $multi_ap_disablesteering in
        1)
            uci set lbd.APSteer.LowRSSIAPSteerThreshold_RE=100
            uci set lbd.APSteer.APSteerToRootMinRSSIIncThreshold=50
            uci set lbd.APSteer.APSteerToLeafMinRSSIIncThreshold=50
            uci set lbd.APSteer.APSteerToPeerMinRSSIIncThreshold=50
            uci set lbd.APSteer.DownlinkRSSIThreshold_W5=-10
        ;;
        0)
            uci set hyd.config.DisableSteering=0
            uci set repacd.repacd.EnableSteering=1
            uci commit hyd
            uci commit repacd

            #Multi-AP Treshold parameters has updated from DNI config above
            #

        ;;
        "")
            multi_ap_disablesteering=$(uci get hyd.config.DisableSteering)

            case $multi_ap_disablesteering in
            0)
                uci set repacd.repacd.EnableSteering=1
                config set multi_ap_disablesteering=$multi_ap_disablesteering
                uci commit repacd
            ;;
            *)
                uci set repacd.repacd.EnableSteering=0
                config set multi_ap_disablesteering=$multi_ap_disablesteering
                uci commit repacd
            ;;
            esac

        ;;
        esac

        config commit
    fi
}


#hyd configs
#
hyd_updateDNI_config () {
    #Orbi DNI setting
    if [ "$BOARD" = "RBR50" -o "$BOARD" = "RBS50" -o "$BOARD" = "RBR30" -o "$BOARD" = "RBS30" -o "$BOARD" = "RBR40" -o "$BOARD" = "RBS40" ]; then

        local hyd_enable
        hyd_enable=$(config get hyd_enable)

        case $hyd_enable in
        1)
            uci set hyd.config.Enable=1
        ;;
        0)
            uci set hyd.config.Enable=0
        ;;
        "")
            hyd_enable=$(uci get hyd.config.Enable)
            config set hyd_enable=$hyd_enable
            config commit
        ;;
        esac


        local hyd_LoadBalancingSeamless
        hyd_LoadBalancingSeamless=$(config get hyd_LoadBalancingSeamless)

        case $hyd_LoadBalancingSeamless in
        1)
            uci set hyd.hy.LoadBalancingSeamless=1
        ;;
        0)
            uci set hyd.hy.LoadBalancingSeamless=0
        ;;
        "")
            hyd_LoadBalancingSeamless=$(uci get hyd.hy.LoadBalancingSeamless)
            config set hyd_LoadBalancingSeamless=$hyd_LoadBalancingSeamless
            config commit
        ;;
        esac


        local hyd_PathTransitionMethod
        hyd_PathTransitionMethod=$(config get hyd_PathTransitionMethod)

        case $hyd_PathTransitionMethod in
        1)
            uci set hyd.hy.PathTransitionMethod=1
        ;;
        0)
            uci set hyd.hy.PathTransitionMethod=0
        ;;
        "")
            hyd_PathTransitionMethod=$(uci get hyd.hy.PathTransitionMethod)
            config set hyd_PathTransitionMethod=$hyd_PathTransitionMethod
            config commit
        ;;
        esac

    fi

}


repacd_updateDNI_config() {
    #Orbi DNI setting
    if [ "$BOARD" = "RBR50" -o "$BOARD" = "RBR30" -o "$BOARD" = "RBR40" ]; then
        uci set repacd.repacd.Enable=0
        config set repacd_enable=0
        config commit
    elif [ "$BOARD" = "RBS50" -o "$BOARD" = "RBS30" -o "$BOARD" = "RBS40" ]; then
        uci set repacd.repacd.ConfigREMode=son

        local repacd_enable
        repacd_enable=$(config get repacd_enable)

        case $repacd_enable in
        1)
            uci set repacd.repacd.Enable=1
        ;;
        0)
            uci set repacd.repacd.Enable=0
        ;;
        "")
            repacd_enable=$(uci get repacd.repacd.Enable)
            config set repacd_enable=$repacd_enable
            config commit
        ;;
        esac

        local rssi_prefer_2g_bh
        rssi_prefer_2g_bh=$(config get rssi_prefer_2g_bh)

        if [ "$rssi_prefer_2g_bh" -gt -95 -a  "$rssi_prefer_2g_bh" -lt 0 ]; then
            uci set repacd.WiFiLink.RSSIThresholdPrefer2GBackhaul=$rssi_prefer_2g_bh
        elif [ -z "$rssi_prefer_2g_bh" ]; then
            rssi_prefer_2g_bh=$(uci get repacd.WiFiLink.RSSIThresholdPrefer2GBackhaul)
            config set rssi_prefer_2g_bh=$rssi_prefer_2g_bh
            config commit
        fi

        local rssi_move_far5g
        rssi_move_far5g=$(config get rssi_move_far5g)

        if [ "$rssi_move_far5g" -gt -95 -a  "$rssi_move_far5g" -lt 0 ]; then
            uci set repacd.WiFiLink.RSSIThresholdFar5g=$rssi_move_far5g
        elif [ -z "$rssi_move_far5g" ]; then
            rssi_move_far5g=$(uci get repacd.WiFiLink.RSSIThresholdFar5g)
            config set rssi_move_far5g=$rssi_move_far5g
            config commit
        fi

        local rssi_move_far2g
        rssi_move_far2g=$(config get rssi_move_far2g)

        if [ "$rssi_move_far2g" -gt -95 -a  "$rssi_move_far2g" -lt 0 ]; then
            uci set repacd.WiFiLink.RSSIThresholdFar24g=$rssi_move_far2g
        elif [ -z "$rssi_move_far2g" ]; then
            rssi_move_far2g=$(uci get repacd.WiFiLink.RSSIThresholdFar24g)
            config set rssi_move_far2g=$rssi_move_far2g
            config commit
        fi

        local MaxMeasuringStateAttempts
        MaxMeasuringStateAttempts=$(config get repacd_MaxMeasuringStateAttempts)

        if [ "$MaxMeasuringStateAttempts" -gt 0 ]; then
            uci set repacd.WiFiLink.MaxMeasuringStateAttempts=$MaxMeasuringStateAttempts
        elif [ -z "$MaxMeasuringStateAttempts" ]; then
            MaxMeasuringStateAttempts=$(uci get repacd.WiFiLink.MaxMeasuringStateAttempts)
            config set repacd_MaxMeasuringStateAttempts=$MaxMeasuringStateAttempts
            config commit
        fi

    fi
}


wsplcd_updateDNI_config() {
    #Orbi DNI setting
    if [ "$BOARD" = "RBR50" -o "$BOARD" = "RBS50" -o "$BOARD" = "RBR30" -o "$BOARD" = "RBS30" -o "$BOARD" = "RBR40" -o "$BOARD" = "RBS40" ]; then
        local wsplcd_enable
        wsplcd_enable=$(config get wsplcd_enable)

        case $wsplcd_enable in
        1)
            uci set wsplcd.config.HyFiSecurity=1
        ;;
        0)
            uci set wsplcd.config.HyFiSecurity=0
        ;;
        "")
            wsplcd_enable=$(uci get wsplcd.config.HyFiSecurity)
            config set wsplcd_enable=$wsplcd_enable
            config commit
        ;;
        esac
    fi
}

wifison_updateconf() {
    case "$1" in
        all)
            lbd_updateDNI_config
            hyd_updateDNI_config
            repacd_updateDNI_config
            wsplcd_updateDNI_config

            uci commit lbd
            uci commit hyd
            uci commit repacd
            uci commit wsplcd
        ;;

        lbd)
            lbd_updateDNI_config

            uci commit lbd
        ;;

        hyd)
            hyd_updateDNI_config

            uci commit hyd
        ;;

        repacd)
            repacd_updateDNI_config

            uci commit repacd
        ;;

        wsplcd)
            wsplcd_updateDNI_config

            uci commit wsplcd
        ;;

    esac

}


wifison_restart() {

    case "$1" in
        all)
            /etc/init.d/lbd stop
            /etc/init.d/lbd start

            /etc/init.d/hyd stop
            /etc/init.d/hyd start

            /etc/init.d/repacd stop
            /etc/init.d/repacd start
        ;;

        lbd)
            /etc/init.d/lbd stop
            /etc/init.d/lbd start
        ;;

        hyd)
            /etc/init.d/hyd stop
            /etc/init.d/hyd start
        ;;

        repacd)
            /etc/init.d/repacd stop
            /etc/init.d/repacd start
        ;;

        wsplcd)
            /etc/init.d/wsplcd stop
            /etc/init.d/wsplcd start
        ;;

    esac

}

wifison_boot () {
    if [ "$BOARD" = "RBR50" -o "$BOARD" = "RBS50" -o "$BOARD" = "RBR30" -o "$BOARD" = "RBS30" -o "$BOARD" = "RBR40" -o "$BOARD" = "RBS40" ]; then

        lbd_updateDNI_config
        hyd_updateDNI_config
        repacd_updateDNI_config
        wsplcd_updateDNI_config

        uci commit lbd
        uci commit hyd
        uci commit repacd
        uci commit wsplcd
    fi

}


show_usage() {
    cat <<EOF
Usage: wifison <command> [<arguments>]

Commands:
    updateconf         <arguments>
            all
            lbd
            repacd
            hyd
            wsplcd

    restart         <arguments>
            all
            lbd
            repacd
            hyd
            wsplcd

    boot
EOF
}


BOARD=$(artmtd -r board_model_id | awk -F: '{print $2}')

case "$1" in
        updateconf) wifison_updateconf "$2";;
        restart) wifison_restart "$2";;
        boot) wifison_boot;;
        *) show_usage ;;
esac

