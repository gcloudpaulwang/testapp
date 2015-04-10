# VERSION 0.0.1
# 默认ubuntu server长期支持版本，当前是12.04
FROM consol/tomcat-7.0
# 签名啦
MAINTAINER paulwang "165413958@qq.com"

# 更新源，安装ssh server
RUN echo "deb http://archive.ubuntu.com/ubuntu precise main universe"> /etc/apt/sources.list
RUN apt-get update
RUN apt-get install -y openssh-server
RUN mkdir -p /var/run/sshd

# 设置root ssh远程登录密码为123456
RUN echo "root:123456" | chpasswd 

# 容器需要开放SSH 22端口
EXPOSE 22

# 容器需要开放Tomcat 8080端口
EXPOSE 8080

# 设置Tomcat7初始化运行，SSH终端服务器作为后台运行
ENTRYPOINT service tomcat7 start && /usr/sbin/sshd -D