# VERSION 0.0.1
# Ĭ��ubuntu server����֧�ְ汾����ǰ��12.04
FROM consol/tomcat-7.0
# ǩ����
MAINTAINER paulwang "165413958@qq.com"

# ����Դ����װssh server
RUN echo "deb http://archive.ubuntu.com/ubuntu precise main universe"> /etc/apt/sources.list
RUN apt-get update
RUN apt-get install -y openssh-server
RUN mkdir -p /var/run/sshd

# ����root sshԶ�̵�¼����Ϊ123456
RUN echo "root:123456" | chpasswd 

# ������Ҫ����SSH 22�˿�
EXPOSE 22

# ������Ҫ����Tomcat 8080�˿�
EXPOSE 8080

# ����Tomcat7��ʼ�����У�SSH�ն˷�������Ϊ��̨����
ENTRYPOINT service tomcat7 start && /usr/sbin/sshd -D