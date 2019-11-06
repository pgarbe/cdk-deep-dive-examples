#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { MigrationStack } from '../lib/migration-stack';
import { ExistingStack } from '../lib/existing-stack';
import { ContextStack } from '../lib/context';
import { LambdaStack } from '../lib/lambda';
import { S3DeployStack } from '../lib/s3deploy';
import { EvenLessCodeStack } from '../lib/even-less-code-stack';
import { CustomResourceStack } from '../lib/custom-resource-stack';
import { DockerStack } from '../lib/docker-stack';

const pgarbe = { account: '424144556073', region: 'eu-west-1' };
const hoegertn = { account: '659154734889', region: 'eu-central-1' };
const current = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION };

const app = new cdk.App();

new MigrationStack(app, 'MigrationStack');
new ExistingStack(app, 'ExistingStack', { env: pgarbe });

new ContextStack(app, 'ContextStack', { env: hoegertn });
// new ContextStack(app, 'ContextStack', { env: current });

new LambdaStack(app, 'LambdaStack', { env: current });
new S3DeployStack(app, 'S3DeployStack', { env: current });

new EvenLessCodeStack(app, 'EvenLessCodeStack', { env: pgarbe });
new CustomResourceStack(app, 'CustomResourceStack');
new DockerStack(app, 'DockerStack', { env: current });