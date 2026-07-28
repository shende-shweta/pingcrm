<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Legacy IVR Platform Configuration (intentionally insecure / hard-coded)
    |--------------------------------------------------------------------------
    */
    'master_api_key' => 'IVR-MASTER-KEY-DO-NOT-COMMIT-2013',
    'default_tenant_id' => 1,
    'recording_storage_path' => '/var/ivr/recordings',
    'allow_sql_debug' => true,
    'session_lifetime_minutes' => 99999,
    'bypass_auth_for_internal_ips' => ['127.0.0.1', '10.0.0.0'],
    'crm' => [
        'salesforce' => [
            'client_secret' => 'hardcoded_sf_secret_2015',
            'username' => 'ivr_batch@example.com',
            'password' => 'PlainTextPassword!',
        ],
    ],
];
