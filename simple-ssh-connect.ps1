# SSH连接信息
$hostname = "118.196.69.229"
$username = "root"
$password = "Lz050201"

# 显示连接信息
Write-Host "尝试连接到SSH服务器..."
Write-Host "主机: $hostname"
Write-Host "用户: $username"
Write-Host ""

# 直接调用ssh命令，让用户手动输入密码
Write-Host "请在弹出的密码提示中输入密码: $password"
Write-Host ""

# 执行ssh命令
$sshCommand = "ssh $username@$hostname"
Write-Host "执行命令: $sshCommand"
Write-Host ""

# 运行ssh命令
& ssh $username@$hostname
