import cdk = require('@aws-cdk/core');
import dynamodb = require('@aws-cdk/aws-dynamodb');
import ecs = require('@aws-cdk/aws-ecs');
import ecs_patterns = require('@aws-cdk/aws-ecs-patterns');
import path = require('path');
import { Vpc } from '@aws-cdk/aws-ec2';
import { Duration } from '@aws-cdk/core';
import { AttributeType, BillingMode } from '@aws-cdk/aws-dynamodb';

export class DockerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = Vpc.fromLookup(this, 'MyExistingVPC', { isDefault: true });
    
    const table = new dynamodb.Table(this, "account-config-table", {
      tableName: "account-config",
      partitionKey: { name: "AccountId", type: AttributeType.STRING },
      serverSideEncryption: true,
      billingMode: BillingMode.PAY_PER_REQUEST
    });

    const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "FargateService", {
      vpc: vpc,
      publicLoadBalancer: true,
      assignPublicIp: true,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset(path.join(__dirname, '../docker'))
      }
    });

    // table.grantReadData(fargateService.service.taskDefinition.taskRole);

    const scaling = fargateService.service.autoScaleTaskCount({ maxCapacity: 2 });
    scaling.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 50,
      scaleInCooldown: Duration.seconds(60),
      scaleOutCooldown: Duration.seconds(60)
    });    
  }
}
