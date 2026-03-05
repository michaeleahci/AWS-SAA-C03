# AWS-SAA-C03

## Identity
### AWS Directory Service: 

## S3
### Amazon S3: 对象存储，不支持标准文件系统结构
## Amazon
### Amazon Kinesis Data Firehose: 实时数据流收集和传输
### Amazon Simple Email Service(SES): send email
### AWS Glue: ETL(提取 转换 加载)，适合处理大规模数据
### AWS Event Bridge: 触发Lambda函数
### Amazon Simple Notification Service(SNS): 
### Amazon Elastic Container Service(ECS): 容器编排服务适合容器化应用
### Amazon Elastic kubernetes Service(EKS): 托管的Kubernetes服务，适合容器化应用
### Amazon Elastic Block Store(EBS): 块存储，不能直接满足标准文件系统结构的需求，不能跨多个实例共享
### Amazon EFS: 是一个完全托管的文件存储服务，支持标准文件系统结构，能够自动扩展并支持跨多个实例共享


## Network
### ACL: 网络ACL用于控制子网级别流量，但无法直接应用于API Gateway


## API
### Amazon API Gateway: 私有集成用于连接到VPC资源（例如私有EC2实例或私有负载均衡器），私有集成的主要目的是实现VPC内部访问但不能直接限制访问IP地址；支持资源策略，可以通过定义策略来限制访问特定的IP地址；API Gateway是一个托管服务，不能直接部署在私有子网中；API Gateway不使用安全组进行流量控制，安全组主要用于EC2实例或其他VPC资源
