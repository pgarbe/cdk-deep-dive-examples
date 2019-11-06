import cdk = require('@aws-cdk/core');
import elb = require('@aws-cdk/aws-elasticloadbalancingv2');
import { Vpc, SecurityGroup } from '@aws-cdk/aws-ec2';
import { Fn } from '@aws-cdk/core';
import { CfnAccessKey } from '@aws-cdk/aws-iam';
import { ImagePullPrincipalType } from '@aws-cdk/aws-codebuild';
import { CompanyStack } from './company-stack';

export class ExistingStack extends CompanyStack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1) VPC from scratch
    const vpc = new Vpc(this, 'MyVPC');

    // 2) Queries AWS account during synth and saves information in  cdk.context.json
    // const vpc = Vpc.fromLookup(this, 'MyExistingVPC', { isDefault: true });

    // 3) Create VPC from existing export
		// const vpc = Vpc.fromVpcAttributes(this, 'ImportVPC', {
    //   vpcId: Fn.importValue('VPC'),
    //   availabilityZones: ['eu-west-1a', 'eu-west-1b', 'eu-west-1c'],
    //   publicSubnetIds: [
    //       Fn.importValue('Public-SubnetA'),
    //       Fn.importValue('Public-SubnetB'),
    //       Fn.importValue('Public-SubnetC'),
    //   ],
    //   publicSubnetRouteTableIds: [
    //     Fn.importValue('Public-RouteTableIdA'),
    //     Fn.importValue('Public-RouteTableIdB'),
    //     Fn.importValue('Public-RouteTableIdC'),
    // ]
    // });

    // 3a) VPC from company's base stack
    // const vpc = this.companyVpc; // https://github.com/aws-samples/aws-cdk-examples/blob/master/python/url-shortener/waltersco_common/__init__.py

    new cdk.CfnOutput(this, "vpcoutput", {value: vpc.vpcId });

    // 1) ALB from scratch
    // const alb = new elb.ApplicationLoadBalancer(this, "MyAlb", { 
    //   vpc: vpc, 
    //   internetFacing: true
    // });

    // const defaultTargetGroup = new elb.ApplicationTargetGroup(this, "DefaultTargetGroup", { port: 80, vpc: vpc, targetType: elb.TargetType.INSTANCE });
    // const listener = alb.addListener("Listener", { 
    //   port: 80,
    //   defaultTargetGroups: [defaultTargetGroup]
    // });

    // new cdk.CfnOutput(this, "albArn", {value: alb.loadBalancerArn });
    // new cdk.CfnOutput(this, "listenerArn", {value: listener.listenerArn });

    // 2) ALB from existing arns
    // const existingAlb = elb.ApplicationLoadBalancer.fromApplicationLoadBalancerAttributes(this, "ImportedALB", {
    //   loadBalancerArn: "TODO",
    //   securityGroupId: "TODO"
    // });

    // 3) Listener from existing arns
    // const existingListener = elb.ApplicationListener.fromApplicationListenerAttributes(this, "SharedListener", {
    //   listenerArn: Fn.importValue('ALB-ListenerArn'),
    //   securityGroupId: Fn.importValue('ALB-SecGroupId')
    // });

    // 4) Add new TargetGroup for your own service
    // const targetGroup = new elb.ApplicationTargetGroup(this, "myService", {
    //   vpc: vpc,
    //   port: 80,
    //   // targets: [] 
    // });

    // existingListener.addTargetGroups("MyService", {
    //   hostHeader: "myservice.local",
    //   priority: 1,
    //   targetGroups: [targetGroup]
    // });
  }
}
