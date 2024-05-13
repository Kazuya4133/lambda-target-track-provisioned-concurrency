#!/usr/bin/env python3
import boto3
import json
import time
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed

# boto3クライアントの作成
lambda_client = boto3.client('lambda', region_name='ap-northeast-1')

def invoke_lambda(payload):
    response = lambda_client.invoke(
        FunctionName='TargetTrackingProvisionedConcurrencyTestLambda:Load-Test',  # Lambda関数の名前を指定
        InvocationType='RequestResponse',
        Payload=json.dumps(payload)
    )
    # タイムスタンプを含むレスポンスを返す
    response_data = json.loads(response['Payload'].read())
    response_data['timestamp'] = datetime.now().isoformat()
    return response_data

# Lambda関数へのリクエストペイロード
payload = {'key': 'value'}

# 並列でLambdaを指定回数呼び出す
def parallel_invoke_lambda(payload, count=5):
    results = []
    with ThreadPoolExecutor(max_workers=count) as executor:
        futures = [executor.submit(invoke_lambda, payload) for _ in range(count)]
        for future in as_completed(futures):
            results.append(future.result())
    return results

# Lambdaを指定回数同時に呼び出す
results = parallel_invoke_lambda(payload, count=5)
for result in results:
    print(result)