import cdk = require('@aws-cdk/core');
import { Instance, InstanceType, InstanceClass, InstanceSize, AmazonLinuxImage, GenericLinuxImage, Vpc, SubnetType } from '@aws-cdk/aws-ec2';

export class ContextStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const vpc = Vpc.fromLookup(this, 'MyExistingVPC', { isDefault: true });

        // new Instance(this, 'Instance', {
        //     instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.NANO),
        //     machineImage: new GenericLinuxImage({ 'eu-central-1': this.node.tryGetContext('imageId') }),
        //     vpc,
        //     vpcSubnets: {subnetType: SubnetType.PUBLIC},
        // });

        // new Instance(this, 'Instance', {
        //     instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.NANO),
        //     machineImage: new GenericLinuxImage({ 'eu-central-1': this.node.tryGetContext('ami') }),
        //     vpc,
        //     vpcSubnets: {subnetType: SubnetType.PUBLIC},
        // });

        // new Instance(this, 'Instance', {
        //     instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.NANO),
        //     machineImage: new GenericLinuxImage({ 'eu-central-1': this.node.tryGetContext(this.account).ami }),
        //     vpc,
        //     vpcSubnets: { subnetType: SubnetType.PUBLIC },
        // });

    }
}
