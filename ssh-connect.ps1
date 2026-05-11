$password = 'Lz050201'
$username = 'root'
$hostname = '118.196.69.229'

# 创建一个临时的SSH配置文件，禁用主机密钥检查
$sshConfig = @"
Host $hostname
    User $username
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null
"@

$tempConfig = New-TemporaryFile
$sshConfig | Out-File -FilePath $tempConfig.FullName -Encoding ASCII

# 使用plink（如果可用）或尝试其他方法
if (Get-Command 'plink' -ErrorAction SilentlyContinue) {
    Write-Host "Using plink to connect..."
    echo $password | plink -ssh -C $username@$hostname -batch "echo Connected successfully && hostname && exit"
} else {
    Write-Host "plink not found, trying alternative method..."
    # 尝试使用sshpass（如果可用）
    if (Get-Command 'sshpass' -ErrorAction SilentlyContinue) {
        Write-Host "Using sshpass to connect..."
        sshpass -p $password ssh -F $tempConfig.FullName $username@$hostname "echo Connected successfully && hostname && exit"
    } else {
        Write-Host "Neither plink nor sshpass found. Using PowerShell process start..."
        # 使用PowerShell进程启动
        $psi = New-Object System.Diagnostics.ProcessStartInfo
        $psi.FileName = 'ssh'
        $psi.Arguments = "-F $($tempConfig.FullName) $username@$hostname 'echo Connected successfully && hostname && exit'"
        $psi.RedirectStandardInput = $true
        $psi.RedirectStandardOutput = $true
        $psi.RedirectStandardError = $true
        $psi.UseShellExecute = $false
        $psi.CreateNoWindow = $true
        
        $process = New-Object System.Diagnostics.Process
        $process.StartInfo = $psi
        $process.Start() | Out-Null
        
        # 等待进程启动并发送密码
        Start-Sleep -Seconds 1
        $process.StandardInput.WriteLine($password)
        $process.StandardInput.Flush()
        $process.StandardInput.Close()
        
        # 读取输出
        $output = $process.StandardOutput.ReadToEnd()
        $errorOutput = $process.StandardError.ReadToEnd()
        $process.WaitForExit()
        
        Write-Host "Output:"
        Write-Host $output
        if ($errorOutput) {
            Write-Host "Error:"
            Write-Host $errorOutput
        }
    }
}

# 清理临时文件
Remove-Item -Path $tempConfig.FullName -Force -ErrorAction SilentlyContinue
