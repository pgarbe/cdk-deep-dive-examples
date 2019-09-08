import cdk = require('@aws-cdk/core');
import acr = require('@aws-cdk/custom-resources');
import route53 = require('@aws-cdk/aws-route53');

export class CustomResourceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const zone = new route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: 'fully.qualified.domain.com'
    });

    // https://docs.aws.amazon.com/ses/latest/APIReference/API_VerifyDomainIdentity.html
    const verifyDomainIdentity = new acr.AwsCustomResource(this, 'VerifyDomainIdentity', {
      onCreate: {
        service: 'SES',
        action: 'verifyDomainIdentity',
        parameters: {
          Domain: 'example.com'
        },
        physicalResourceIdPath: 'VerificationToken' // Use the token returned by the call as physical id
      }
    });

    new route53.TxtRecord(this, 'SESVerificationRecord', {
      recordName: `_amazonses.example.com`,
      zone: zone,
      values: [ verifyDomainIdentity.getData('VerificationToken').toString() ]
    });

  }
}

