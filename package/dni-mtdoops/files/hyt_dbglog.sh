#!/bin/sh

# save the hyt dbg here log in memory. Reboot will lost console log data

# File size limitation: There will be 2 files, HYT-dbg-log1.txt and HYT-dbg-log2.txt
file_num=1

while [ 1 ]
do
	(echo "dbg here"; sleep 60) | hyt >> /tmp/HYT-dbg-log$file_num.txt


	filesize=`ls -l /tmp/HYT-dbg-log$file_num.txt | awk '{print $5}'`
	# The maximum of each file is 5MB
	if [ $filesize -ge 5242880 ]; then
		echo "filesize if over, change to another HYT-dbg file"
		if [ $file_num -eq 1 ]; then
			file_num=2;
		else
			file_num=1;
		fi
		# Once 1 file has reached the maximum(5MB), start write to another file
		[ -f /tmp/HYT-dbg-log$file_num.txt ] && rm -rf /tmp/HYT-dbg-log$file_num.txt
	fi
done

