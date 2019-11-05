import cdk = require('@aws-cdk/core');
import { Vpc, IVpc } from '@aws-cdk/aws-ec2';
import { Fn } from '@aws-cdk/core';

export class CompanyStack extends cdk.Stack {
  companyVpc: IVpc;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

      this.companyVpc = Vpc.fromVpcAttributes(this, 'VPC', {
        vpcId: Fn.importValue('VPC'),
        availabilityZones: ['eu-west-1a', 'eu-west-1b', 'eu-west-1c'],
        publicSubnetIds: [
            Fn.importValue('Public-SubnetA'),
            Fn.importValue('Public-SubnetB'),
            Fn.importValue('Public-SubnetC'),
        ],
        publicSubnetRouteTableIds: [
          Fn.importValue('Public-RouteTableIdA'),
          Fn.importValue('Public-RouteTableIdB'),
          Fn.importValue('Public-RouteTableIdC'),
        ]
      });
  }
}
