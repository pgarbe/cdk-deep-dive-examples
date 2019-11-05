import cdk = require('@aws-cdk/core');
import s3 = require('@aws-cdk/aws-s3');
import lambda = require('@aws-cdk/aws-lambda');
import iam = require('@aws-cdk/aws-iam');
import fs = require("fs");
import yaml = require("js-yaml");
import { CfnCondition, Tag, IAspect, IConstruct, Tokenization } from '@aws-cdk/core';
import { Runtime, Code } from '@aws-cdk/aws-lambda';
import wf = require('cdk-watchful');
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { BlockPublicAccess } from '@aws-cdk/aws-s3';

export class SuperSecureBucket extends s3.Bucket {
  constructor(scope: cdk.Construct, id: string, props?: s3.BucketProps) {
    super(scope, id, { 
      ...props, 
      versioned: true,
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL
    });
  }
}

export class EvenLessCodeStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1) Inheritance
    // new SuperSecureBucket(this, 'securedBucket', {
    //   // versioned: false // Bad idea
    // });

    // 2) Composition
    // see https://github.com/taimos/cdk-constructs/blob/master/lib/web/single-page-app.ts#L42

    // 3) Aspects
    // new lambda.Function(this, "someFunction", {
    //   code: Code.inline('#some comment'),
    //   handler: 'index.handler',
    //   runtime: Runtime.PYTHON_3_7
    // });

    // const role = new iam.Role(this, 'MyRole', {
    //   assumedBy: new iam.ServicePrincipal('sns.amazonaws.com')
    // });

    // role.addToPolicy(new PolicyStatement({
    //   resources: ['some resource', '*'],
    //   actions: ['lambda:InvokeFunction'] 
    // }));

    // Add a tag to all constructs in the stack
    // Tag.add(this, 'StackType', 'TheBest');

    // Remove the tag from all resources except subnet resources
    // Tag.remove(this, 'StackType', {
    //   excludeResourceTypes: ['AWS::S3::Bucket']
    // });

    // Tag.add(this, 'StackType', 'TheBest', { includeResourceTypes: ['AWS::S3::Bucket']});

    // this.node.applyAspect(new BucketVersioningChecker());
    // this.node.applyAspect(new PolicyChecker());

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

export class PolicyChecker implements cdk.IAspect {

  public visit(node: cdk.IConstruct): void {

    if (node instanceof iam.CfnPolicy) {
      let statements: PolicyStatement[] = node.policyDocument.statements;

      statements.forEach(statement => {
        let statementJson = statement.toJSON();
        console.log(statementJson);

        // // TODO: Check if `Resource` is just a single value
        statementJson.Resource.forEach((resource: string) => {
          if (resource === '*') {
            node.node.addError("Asteriks are not allowed");
          }
        });
      });
    }
    // TODO: Also iam.CfnRole can have PolicyDocuments
  }
}


