import cdk = require('@aws-cdk/core');
import ecs = require('@aws-cdk/aws-ecs');
import ecs_patterns = require('@aws-cdk/aws-ecs-patterns');
import path = require('path');
import { Vpc } from '@aws-cdk/aws-ec2';
import { Duration } from '@aws-cdk/core';

export class DockerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = Vpc.fromLookup(this, 'MyExistingVPC', { isDefault: true });

    const fargateService = new ecs_patterns.LoadBalancedFargateService(this, "FargateService", {
      vpc: vpc,
      image: ecs.ContainerImage.fromAsset(path.join(__dirname, '../docker')),
      publicLoadBalancer: true,
      publicTasks: true
    });

    const scaling = fargateService.service.autoScaleTaskCount({ maxCapacity: 2 });
    scaling.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 50,
      scaleInCooldown: Duration.seconds(60),
      scaleOutCooldown: Duration.seconds(60)
    });    
  }
}
