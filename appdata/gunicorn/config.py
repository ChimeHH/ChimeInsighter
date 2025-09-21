import os
import multiprocessing

# 绑定地址和端口
bind = "0.0.0.0:30080"

# 工作进程数（可以设置为 CPU 核心数的 2 倍 + 1）
# workers = multiprocessing.cpu_count() * 2 + 1
workers = 2

# 每个工作进程的线程数
threads = 5

# 日志配置
accesslog = "-"  # 访问日志输出到标准输出
errorlog = "-"   # 错误日志输出到标准输出

# 超时时间（秒）
timeout = 1800

# 保持活动连接的时间（秒）
keepalive = 600

# 启用 HTTPS（如果配置了 SSL 上下文）
keyfile = "/usr/local/share/appdata/ssl/digitaltwins.key"
certfile = "/usr/local/share/appdata/ssl/digitaltwins.crt"


config_path = os.getenv("GUNICORN_CONFIG", "/usr/local/share/appdata/gunicorn/config.py")