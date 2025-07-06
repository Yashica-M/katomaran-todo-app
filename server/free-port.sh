#!/bin/bash

# Kill process on port 5000 (Unix/Linux/Mac script)
# This is useful when the port is already in use

# ANSI color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Checking for processes using port 5000...${NC}"

if command -v lsof &> /dev/null; then
    # If lsof is available (most Unix systems)
    PROCESS_INFO=$(lsof -i :5000 -sTCP:LISTEN -P)
    
    if [ -z "$PROCESS_INFO" ]; then
        echo -e "${YELLOW}No processes found using port 5000.${NC}"
    else
        echo -e "${CYAN}Result:${NC}"
        echo "$PROCESS_INFO"
        
        # Extract PIDs
        PIDS=$(echo "$PROCESS_INFO" | tail -n +2 | awk '{print $2}' | sort -u)
        
        echo -e "\n${GREEN}Found the following process(es) using port 5000:${NC}"
        for PID in $PIDS; do
            PROCESS_NAME=$(ps -p $PID -o comm=)
            echo -e "${CYAN}PID: $PID - Process Name: $PROCESS_NAME${NC}"
        done
        
        read -p $'\nDo you want to kill these processes? (y/n) ' CONFIRMATION
        if [ "$CONFIRMATION" = "y" ]; then
            for PID in $PIDS; do
                kill -9 $PID 2> /dev/null
                if [ $? -eq 0 ]; then
                    echo -e "${GREEN}Process with PID $PID has been terminated.${NC}"
                else
                    echo -e "${RED}Failed to terminate process with PID $PID. Try running with sudo.${NC}"
                fi
            done
        else
            echo -e "${YELLOW}No processes were terminated.${NC}"
        fi
    fi
else
    # If lsof is not available, try with netstat
    if command -v netstat &> /dev/null; then
        PROCESS_INFO=$(netstat -tulpn 2>/dev/null | grep ':5000')
        
        if [ -z "$PROCESS_INFO" ]; then
            echo -e "${YELLOW}No processes found using port 5000.${NC}"
        else
            echo -e "${CYAN}Result:${NC}"
            echo "$PROCESS_INFO"
            
            echo -e "${RED}To kill the process, you need to identify the PID and use: kill -9 [PID]${NC}"
            echo -e "${RED}You may need to run with sudo privileges.${NC}"
        fi
    else
        echo -e "${RED}Neither lsof nor netstat commands are available. Cannot check for processes using port 5000.${NC}"
    fi
fi

echo -e "\n${CYAN}Alternatively, you can change the default port in server/index.js or set a different PORT in your .env file.${NC}"
