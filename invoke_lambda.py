import boto3
import json
from concurrent.futures import ThreadPoolExecutor, as_completed

# boto3クライアントの作成
lambda_client = boto3.client('lambda', region_name='ap-northeast-1')

def invoke_lambda(payload):
    response = lambda_client.invoke(
        FunctionName='TargetTrackingProvisionedConcurrencyTestLambda:Load-Test',  # Lambda関数の名前を指定
        InvocationType='RequestResponse',
        Payload=json.dumps(payload)
    )
    return json.loads(response['Payload'].read())

# Lambda関数へのリクエストペイロード
payload = {'key': 'value'}

# 並列でLambdaを30回呼び出す
def parallel_invoke_lambda(payload, count=30):
    results = []
    with ThreadPoolExecutor(max_workers=count) as executor:
        futures = [executor.submit(invoke_lambda, payload) for _ in range(count)]
        for future in as_completed(futures):
            results.append(future.result())
    return results

# 30回同時にLambdaを呼び出す
results = parallel_invoke_lambda(payload, count=30)
for result in results:
    print(result)