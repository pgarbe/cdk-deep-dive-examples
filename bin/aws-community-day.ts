#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { AwsCommunityDayStack } from '../lib/aws-community-day-stack';
import { MigrationStack } from '../lib/migration-stack';
import { ExistingStack } from '../lib/existing-stack';

const app = new cdk.App();
new AwsCommunityDayStack(app, 'AwsCommunityDayStack');
new MigrationStack(app, 'MigrationStack');
new ExistingStack(app, 'ExistingStack');
