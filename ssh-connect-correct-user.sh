#!/bin/bash

# SSH连接信息
HOST="118.196.69.229"
USER="iv-yeffheyku8ay8n7511ma"
PASSWORD="Lz050201"

# 使用sshpass连接并执行简单命令验证连接（详细模式）
sshpass -p "$PASSWORD" ssh -v -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$USER@$HOST" 'echo Connected successfully; hostname; whoami; exit'
