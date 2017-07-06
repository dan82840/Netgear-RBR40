#This target is to ensure accidental execution of Makefile as a bash script will not execute commands like rm in unexpected directories and exit gracefully.
.prevent_execution:
	exit 0

CC = gcc

#remove @ for no make command prints

SRC_FILES := aws-iot.c
SRC_FILES1 := data_collector.c 

CFLAGS += -Wall -Wunused -g -O2

LDFLAGS += -lconfig

all : data_collector aws-iot  

data_collector:
	$(CC) $(CFLAGS) $(LDFLAGS) $(SRC_FILES1) -o  $@	
	@echo "make $@ finished on `date`"
aws-iot:
	$(CC) $(CFLAGS) $(LDFLAGS) $(SRC_FILES)  -o  $@
	@echo "make $@ finished on `date`"

%.o: %.c
	$(CC) $(CFLAGS) -c $<


clean:
	rm -f *.o
	rm -f data_collector aws-iot 
