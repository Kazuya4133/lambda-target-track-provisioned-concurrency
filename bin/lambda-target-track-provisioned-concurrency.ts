#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { LambdaTargetTrackProvisionedConcurrencyStack } from '../lib/lambda-target-track-provisioned-concurrency-stack';
import * as dotenv from 'dotenv';

dotenv.config();

const app = new cdk.App();

const account = process.env.CDK_DEFAULT_ACCOUNT;
const region = process.env.CDK_DEFAULT_REGION;

new LambdaTargetTrackProvisionedConcurrencyStack(app, 'LambdaTargetTrackProvisionedConcurrencyStack', {
  env: {
    account: account,
    region: region
  }
});