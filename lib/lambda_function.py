import json
from datetime import datetime

def lambda_handler(event, context):
    # 現在の日時を取得
    current_time = datetime.now().isoformat()

    # レスポンスに現在の日時とカスタムメッセージを含める
    response_body = {
        'message': 'Hello from Lambda!',
        'timestamp': current_time
    }

    return {
        'statusCode': 200,
        'body': json.dumps(response_body)
    }