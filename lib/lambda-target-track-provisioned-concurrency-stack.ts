import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as applicationautoscaling from 'aws-cdk-lib/aws-applicationautoscaling'

export class LambdaTargetTrackProvisionedConcurrencyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaFunction = new lambda.Function(this, 'LambdaFunction', {
      functionName: "TargetTrackingProvisionedConcurrencyTestLambda",
      description: "ターゲット追跡型のプロビジョニング済み同時実行の検証用Lambda",
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'lambda_function.lambda_handler',
      code: lambda.Code.fromAsset(`../target_tracking_provisioned_concurrency/lib`),
      timeout: cdk.Duration.seconds(600),
      memorySize: 256,
    });

    // バージョンの設定
    const lambdaVersion = new lambda.Version(this, 'LambdaVersion', {
      lambda: lambdaFunction,
      description: 'Version for Target Tracking Provisioned Concurrency',
    });

    // エイリアスの設定
    const alias = new lambda.Alias(this, 'LambdaAlias', {
      aliasName: 'Load-Test',
      version: lambdaVersion,
    });

    // オートスケーリングのターゲットの設定
    const scalingTarget = new applicationautoscaling.ScalableTarget(this, 'ScalableTarget', {
      serviceNamespace: applicationautoscaling.ServiceNamespace.LAMBDA,
      minCapacity: 1,
      maxCapacity: 50,
      resourceId: `function:${lambdaFunction.functionName}:${alias.aliasName}`,
      scalableDimension: 'lambda:function:ProvisionedConcurrency',
    });

    // デプロイ順序の依存関係を追加
    scalingTarget.node.addDependency(alias);

    // ターゲット追跡スケーリングの追加
    scalingTarget.scaleToTrackMetric('TargetTracking', {
      targetValue: 0.6,
      predefinedMetric: applicationautoscaling.PredefinedMetric.LAMBDA_PROVISIONED_CONCURRENCY_UTILIZATION,
      scaleInCooldown: cdk.Duration.seconds(10),
      scaleOutCooldown: cdk.Duration.seconds(10),
    });
  }
}
