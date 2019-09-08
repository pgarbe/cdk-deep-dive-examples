import cdk = require('@aws-cdk/core');
import { Bucket } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';


export class S3DeployStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const bucket = new Bucket(this, 'Bucket', {
            blockPublicAccess: {
                blockPublicAcls: true,
                blockPublicPolicy: true,
                ignorePublicAcls: true,
                restrictPublicBuckets: true,
            }
        });
        
        new BucketDeployment(this, 'DeployWebsite', {
            source: Source.asset('./lambda'),
            destinationBucket: bucket,
        });

    }
}
