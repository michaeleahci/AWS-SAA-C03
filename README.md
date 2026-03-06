# AWS-SAA-C03

## Identity
### AWS Directory Service: 
### IAM: IAM策略不能直接附件到EKS Pods
### AD Connector: 可以直接连接到本地的Active Directory；可与AWS IAM Identity Center集成，实现集中化的身份管理和跨账户权限控制
### Amazon Cognito: 主要用于支持Web和移动应用的身份联合，而不是企业级的集中身份管理和控制访问；可以与Active Directory集成但需要额外开发来实现身份联合
### RBAC: RBAC是K8S内部的权限控制机制，无法直接控制AWS资源的访问权限
### IRSA: 

## EC2
### On-Demand Instance: 
### Standard Reserved Instance: 适用于长期稳定的工作负载
### Convertible Reserved Instance: 允许实例类型灵活转换
### Scheduled Reserved Instance: 适用于定期运行的工作负载
### Spot Instance: 价格低但可能会中断
### EC2 Spot Instance: 需要管理实例的生命周期
### EC2 Auto Scaling: 计划扩展 - 使用于固定的高峰时间；目标跟踪 - 可以动态调整
### CPU Utilization: 可以反应实例负载，但无法反应SQS队列积压情况
### 

## S3
### Amazon S3: 对象存储，不支持标准文件系统结构
### S3 Interface Endpoint: 允许私有网络的资源通过AWS私有网络访问S3，会产生额外费用，需要安全组控制流量
### S3 Gateway Endpoint: 允许私有网络的资源通过AWS私有网络访问S3，免费，控制流量不需要安全组直接通过路由表配置
### S3 Translate Acceleration: 使用Amazon的全球边缘网络来优化上传速度，尤其是跨区域上传


## Amazon
### Amazon Kinesis Data Firehose: 实时数据流收集和传输
### Amazon Simple Email Service(SES): send email
### AWS Glue: ETL(提取 转换 加载)，适合处理大规模数据
### AWS Event Bridge: 触发Lambda函数
### Amazon Simple Notification Service(SNS): 
### Amazon Elastic Container Service(ECS): 容器编排服务适合容器化应用
### Amazon Elastic kubernetes Service(EKS): 托管的Kubernetes服务，适合容器化应用
### Amazon SQS: 用于队列管理，但不具备复杂工作流编排能力；ApproximateNumberOfMessages属性 - 动态调整合适扩展
### AWS Step Function: 提供强大的工作流编排能力，适合复杂任务管理
### AWS Batch: 处理批量任务，完全托管

## Store
### Amazon Elastic Block Store(EBS): 块存储，不能直接满足标准文件系统结构的需求，不能跨多个实例共享
### Amazon EFS: 是一个完全托管的文件存储服务，支持标准文件系统结构，能够自动扩展并支持跨多个实例共享；对于大规模数据存储选择S3
### Amazon FSx: 适合特定文件系统需求


## Network
### ACL: 网络ACL用于控制子网级别流量，但无法直接应用于API Gateway
### NAT Gateway: 流量仍会通过互联网，会产生额外费用
### Amazon CloudFront: 全球内容分发网络（CDN），可以显著减少用户下载静态内容的延迟
### Global Accelerator: 可以优化全球网络性能，但不直接解决S3的上传下载

## API
### Amazon API Gateway: 私有集成用于连接到VPC资源（例如私有EC2实例或私有负载均衡器），私有集成的主要目的是实现VPC内部访问但不能直接限制访问IP地址；支持资源策略，可以通过定义策略来限制访问特定的IP地址；API Gateway是一个托管服务，不能直接部署在私有子网中；API Gateway不使用安全组进行流量控制，安全组主要用于EC2实例或其他VPC资源
