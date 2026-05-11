#!/bin/bash

# SSH连接信息
HOST="118.196.69.229"
USER="root"
PASSWORD="Lz050201"

# 禁用主机密钥检查并连接
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$USER@$HOST" 'echo Connected successfully; hostname; exit'
