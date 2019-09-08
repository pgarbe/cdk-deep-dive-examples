import cdk = require('@aws-cdk/core');
import { Function, Code, Runtime } from '@aws-cdk/aws-lambda';
import { Duration, CfnOutput } from '@aws-cdk/core';

export class LambdaStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const func = new Function(this, 'Function', {
            code: Code.fromAsset('./lambda'),
            handler: 'index.lambda_handler',
            runtime: Runtime.PYTHON_3_7,
            timeout: Duration.minutes(5),
        });

        new CfnOutput(this, 'FunctionOutput', { value: func.functionArn });

    }
}
