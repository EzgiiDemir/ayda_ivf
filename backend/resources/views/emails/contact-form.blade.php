<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="utf-8">
    <title>Yeni İletişim Formu Mesajı</title>
    <style>
        body {
            font-family: "Segoe UI", Arial, sans-serif;
            line-height: 1.6;
            color: #2c2c2c;
            max-width: 640px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f2f4f7;
        }
        .container {
            background: #ffffff;
            border-radius: 6px;
            overflow: hidden;
            box-shadow: 0 2px 12px rgba(0,0,0,0.05);
            border: 1px solid #e0e0e0;
        }
        .header {
            background: linear-gradient(135deg, #004c97 0%, #0073c6 100%);
            color: #ffffff;
            padding: 25px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 22px;
            font-weight: 600;
            letter-spacing: 0.3px;
        }
        .content {
            padding: 30px;
        }
        .field {
            margin-bottom: 20px;
            padding: 12px 15px;
            background: #fafafa;
            border-left: 4px solid #0073c6;
            border-radius: 4px;
        }
        .field-label {
            font-weight: 600;
            color: #004c97;
            margin-bottom: 5px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .field-value {
            color: #2c2c2c;
            font-size: 15px;
            word-break: break-word;
        }
        .field-value a {
            color: #0073c6;
            text-decoration: none;
        }
        .field-value a:hover {
            text-decoration: underline;
        }
        .message-box {
            background: #ffffff;
            padding: 18px;
            border-radius: 4px;
            border: 1px solid #e0e0e0;
            margin-top: 8px;
            white-space: pre-wrap;
            line-height: 1.7;
            font-size: 15px;
        }
        .footer {
            text-align: center;
            margin-top: 25px;
            padding: 20px;
            background: #f9f9f9;
            border-top: 1px solid #e0e0e0;
            color: #666;
            font-size: 13px;
        }
        .footer a {
            color: #0073c6;
            text-decoration: none;
        }
        .reply-button {
            display: inline-block;
            margin-top: 25px;
            padding: 12px 28px;
            background: #0073c6;
            color: #ffffff;
            text-decoration: none;
            border-radius: 25px;
            font-weight: 600;
            font-size: 14px;
            letter-spacing: 0.3px;
        }
        .reply-button:hover {
            background: #005fa3;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>Yeni İletişim Formu Mesajı</h1>
    </div>

    <div class="content">
        <div class="field">
            <div class="field-label">Ad Soyad</div>
            <div class="field-value">{{ $submission->name }}</div>
        </div>

        <div class="field">
            <div class="field-label">E-posta</div>
            <div class="field-value">
                <a href="mailto:{{ $submission->email }}">{{ $submission->email }}</a>
            </div>
        </div>

        <div class="field">
            <div class="field-label">Konu</div>
            <div class="field-value">{{ $submission->subject }}</div>
        </div>

        <div class="field">
            <div class="field-label">Mesaj</div>
            <div class="message-box">{{ $submission->message }}</div>
        </div>

        <div class="field">
            <div class="field-label">Dil</div>
            <div class="field-value">{{ strtoupper($submission->locale) }}</div>
        </div>

        <div class="field">
            <div class="field-label">Gönderim Zamanı</div>
            <div class="field-value">{{ $submission->created_at->format('d.m.Y H:i:s') }}</div>
        </div>

        <div class="field">
            <div class="field-label">IP Adresi</div>
            <div class="field-value">{{ $submission->ip_address }}</div>
        </div>

        <div style="text-align: center;">
            <a href="mailto:{{ $submission->email }}" class="reply-button">
                Yanıtla
            </a>
        </div>
    </div>

    <div class="footer">
        <p><strong>{{ config('app.name') }}</strong></p>
        <p>Bu e-posta, iletişim formu üzerinden otomatik olarak oluşturulmuştur.</p>
        <p>Mesajı yanıtlamak için <a href="mailto:{{ $submission->email }}">{{ $submission->email }}</a> adresini kullanabilirsiniz.</p>
    </div>
</div>
</body>
</html>
