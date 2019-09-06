import cdk = require('@aws-cdk/core');
import { Vpc } from '@aws-cdk/aws-ec2';
import { Fn } from '@aws-cdk/core';

export class ExistingStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1) VPC from scratch
    const vpc = new Vpc(this, 'MyVPC');

    // 2) Queries AWS account during synth and saves information in 
    // Vpc.fromLookup(this, 'MyExistingVPC', {});

    // // Create VPC from existing export
		// const vpc = Vpc.fromVpcAttributes(this, 'VPC', {
    //   vpcId: Fn.importValue('VPC'),
    //   availabilityZones: ['eu-central-1a', 'eu-central-1b', 'eu-central-1c'],
    //   publicSubnetIds: [
    //       Fn.importValue('Public-SubnetA'),
    //       Fn.importValue('Public-SubnetB'),
    //       Fn.importValue('Public-SubnetC'),
    //   ],
    // });

  }
}
