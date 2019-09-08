import cdk = require('@aws-cdk/core');
import s3 = require('@aws-cdk/aws-s3');
import lambda = require('@aws-cdk/aws-lambda');
import fs = require("fs");
import yaml = require("js-yaml");
import { CfnCondition, Tag, IAspect, IConstruct, Tokenization } from '@aws-cdk/core';
import { Runtime, Code } from '@aws-cdk/aws-lambda';
import wf = require('cdk-watchful');

export class AspectsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new s3.Bucket(this, "someBucket", { });
    new lambda.Function(this, "someFunction", {
      code: Code.inline('#some comment'),
      handler: 'index.handler',
      runtime: Runtime.PYTHON_3_7
    })

    // Add a tag to all constructs in the stack
    // Tag.add(this, 'StackType', 'TheBest');

    // Remove the tag from all resources except subnet resources
    // Tag.remove(this, 'StackType', {
    //   excludeResourceTypes: ['AWS::S3::Bucket']
    // });

    // Tag.add(this, 'StackType', 'TheBest', { includeResourceTypes: ['AWS::S3::Bucket']});

    // this.node.applyAspect(new BucketVersioningChecker());

    // const watchful = new wf.Watchful(this, 'watchful', {
    //   alarmEmail: 'your@email.com'
    // });
    // watchful.watchScope(this);
  }
}

class BucketVersioningChecker implements IAspect {
  public visit(node: IConstruct): void {
    // See that we're dealing with a CfnBucket
    if (node instanceof s3.CfnBucket) {

      // Check for versioning property, exclude the case where the property
      // can be a token (IResolvable).
      if (!node.versioningConfiguration
        || (!Tokenization.isResolvable(node.versioningConfiguration)
            && node.versioningConfiguration.status !== 'Enabled')) {
        node.node.addError('Bucket versioning is not enabled');
      }
    }
  }
}

