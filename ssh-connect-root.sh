#!/bin/bash

# SSH连接信息
HOST="118.196.69.229"
USER="root"
PASSWORD="Lz050201"

# 使用sshpass连接并执行简单命令验证连接
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$USER@$HOST" 'echo Connected successfully; hostname; whoami; exit'
