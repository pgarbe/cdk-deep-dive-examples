import cdk = require('@aws-cdk/core');
import elb = require('@aws-cdk/aws-elasticloadbalancingv2');
import { Vpc, SecurityGroup } from '@aws-cdk/aws-ec2';
import { Fn } from '@aws-cdk/core';
import { CfnAccessKey } from '@aws-cdk/aws-iam';

export class ExistingStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1) VPC from scratch
    // const vpc = new Vpc(this, 'MyVPC');

    // 2) Queries AWS account during synth and saves information in  cdk.context.json
    const vpc = Vpc.fromLookup(this, 'MyExistingVPC', { isDefault: true });
    // BUT: VPC fromLookup fails with asymmetric subnets (https://github.com/aws/aws-cdk/issues/3407)

    // 3) Create VPC from existing export
		// const vpc = Vpc.fromVpcAttributes(this, 'VPC', {
    //   vpcId: Fn.importValue('VPC'),
    //   availabilityZones: ['eu-central-1a', 'eu-central-1b', 'eu-central-1c'],
    //   publicSubnetIds: [
    //       Fn.importValue('Public-SubnetA'),
    //       Fn.importValue('Public-SubnetB'),
    //       Fn.importValue('Public-SubnetC'),
    //   ],
    // });

    // new cdk.CfnOutput(this, "vpcoutput", {value: vpc.vpcId });

    // 1) ALB from scratch
    const alb = new elb.ApplicationLoadBalancer(this, "MyAlb", { 
      vpc: vpc, 
      internetFacing: true
    });

    const defaultTargetGroup = new elb.ApplicationTargetGroup(this, "DefaultTargetGroup", { port: 80, vpc: vpc });
    const listener = alb.addListener("Listener", { 
      port: 80,
      defaultTargetGroups: [defaultTargetGroup]
    });

    new cdk.CfnOutput(this, "albArn", {value: alb.loadBalancerArn });
    new cdk.CfnOutput(this, "listenerArn", {value: listener.listenerArn });

    // 2) ALB from existing arns
    const existingAlb = elb.ApplicationLoadBalancer.fromApplicationLoadBalancerAttributes(this, "ImportedALB", {
      loadBalancerArn: "TODO",
      securityGroupId: "TODO"
    });

    // 3) Listener from existing arns
    const existingListener = elb.ApplicationListener.fromApplicationListenerAttributes(this, "SharedListener", {
      listenerArn: "arn:aws:elasticloadbalancing:eu-west-1:424144556073:listener/app/Exist-MyAlb-IEWVPV7ABEK1/ea9117d0d69c3ca0/be723bf4817b3291",
      securityGroup: SecurityGroup.fromSecurityGroupId(this, "MyAlbSecGroup", "MyAlbSecurityGroupC60015CB:")
    });

    // 4) Add new TargetGroup for your own service
    const targetGroup = new elb.ApplicationTargetGroup(this, "myService", {
      vpc: vpc,
      port: 80,
      // targets: [] 
    });

    existingListener.addTargetGroups("MyService", {
      hostHeader: "myservice.local",
      priority: 1,
      targetGroups: [targetGroup]
    });
  }
}
