import cdk = require('@aws-cdk/core');
import s3 = require('@aws-cdk/aws-s3');
import fs = require("fs");
import yaml = require("js-yaml");
import { CfnCondition } from '@aws-cdk/core';

export class MigrationStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Option 1: Migrate existing stack
    // https://github.com/aws/aws-cdk/tree/master/packages/cdk-dasm

    // Option 2: Use existing template
    // new cdk.CfnInclude(this, "ExistingInfrastructure", {
    //   template: yaml.safeLoad(fs.readFileSync("./my-bucket.yaml").toString())
    // });

    // const bucketArn = cdk.Fn.getAtt("S3Bucket", "Arn");

    // new cdk.CfnOutput(this, 'BucketArn', { value: .resolve(this) });

    // Option 3: Re-write manually and adopt
    const bucket = new s3.Bucket(this, "MyS3Bucket", { versioned: true, removalPolicy: cdk.RemovalPolicy.DESTROY });
    // DeletionPolicy: Delete is default in Cfn, Retain is default in CDK

    // const cfnBucket = bucket.node.defaultChild as s3.CfnBucket;
    // cfnBucket.overrideLogicalId("MyS3Bucket");
  }
}
