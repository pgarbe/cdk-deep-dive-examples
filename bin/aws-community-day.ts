#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { AwsCommunityDayStack } from '../lib/aws-community-day-stack';

const app = new cdk.App();
new AwsCommunityDayStack(app, 'AwsCommunityDayStack');
