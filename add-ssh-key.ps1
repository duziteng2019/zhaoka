# 读取本地公钥
$publicKey = Get-Content -Path "C:\Users\ADMIN\.ssh\id_rsa.pub" -Raw

# SSH连接信息
$username = "root"
$hostname = "118.196.69.229"
$password = "Lz050201"

# 构建要执行的远程命令
$remoteCommand = "mkdir -p ~/.ssh && echo '$publicKey' >> ~/.ssh/authorized_keys && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys && echo 'Public key added successfully'"

# 使用进程启动方式连接SSH并执行命令
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = 'ssh'
$psi.Arguments = "$username@$hostname"
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

# 等待密码验证完成并发送命令
Start-Sleep -Seconds 1
$process.StandardInput.WriteLine($remoteCommand)
$process.StandardInput.Flush()

# 发送退出命令
$process.StandardInput.WriteLine('exit')
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

# 尝试使用密钥连接
Write-Host "\nTesting SSH connection with key..."
$testProcess = New-Object System.Diagnostics.Process
$testProcess.StartInfo.FileName = 'ssh'
$testProcess.StartInfo.Arguments = "$username@$hostname 'echo Connected with key && hostname && exit'"
$testProcess.StartInfo.RedirectStandardOutput = $true
$testProcess.StartInfo.RedirectStandardError = $true
$testProcess.StartInfo.UseShellExecute = $false
$testProcess.StartInfo.CreateNoWindow = $true
$testProcess.Start() | Out-Null

$testOutput = $testProcess.StandardOutput.ReadToEnd()
$testError = $testProcess.StandardError.ReadToEnd()
$testProcess.WaitForExit()

Write-Host "Test Output:"
Write-Host $testOutput
if ($testError) {
    Write-Host "Test Error:"
    Write-Host $testError
}
