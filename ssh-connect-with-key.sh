#!/bin/bash

# SSH连接信息
HOST="118.196.69.229"
USER="root"

# 使用本地生成的SSH密钥连接
ssh -i /mnt/c/Users/ADMIN/.ssh/id_rsa -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$USER@$HOST" 'echo Connected successfully; hostname; whoami; exit'
