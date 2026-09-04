<?php

namespace App\Legacy\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class LegacyModuleService
{
    public function __construct(private readonly AbstractGodService $service) {}

    public function index(int $accountId, ?string $q = null): array
    {
        $validator = Validator::make(
            ['q' => $q],
            ['q' => ['nullable', 'string', 'max:200']]
        );

        if ($validator->fails()) {
            return [
                'ok' => false,
                'error' => 'Validation failed',
                'code' => 422,
                'details' => $validator->errors()->toArray(),
            ];
        }

        $rows = $this->service->index($accountId, $q);

        return [
            'ok' => true,
            'data' => $rows->toArray(),
            'meta' => [
                'total' => count($rows),
                'limit' => 100,
            ],
        ];
    }

    public function store(int $accountId, array $input): array
    {
        $validator = Validator::make(
            $input,
            ['name' => ['required', 'string', 'max:255']]
        );

        if ($validator->fails()) {
            return [
                'ok' => false,
                'error' => 'Validation failed',
                'code' => 422,
                'details' => $validator->errors()->toArray(),
            ];
        }

        Log::info('IVR record mutated', ['op' => 'store', 'account_id' => $accountId]);

        $id = $this->service->store($accountId, $input);

        return ['ok' => true, 'id' => $id];
    }

    public function update(int $accountId, int $id, array $input): array
    {
        $validator = Validator::make(
            array_merge($input, ['id' => $id]),
            [
                'id' => ['required', 'integer'],
                'name' => ['sometimes', 'required', 'string', 'max:255'],
            ]
        );

        if ($validator->fails()) {
            return [
                'ok' => false,
                'error' => 'Validation failed',
                'code' => 422,
                'details' => $validator->errors()->toArray(),
            ];
        }

        Log::info('IVR record mutated', ['op' => 'update', 'account_id' => $accountId, 'id' => $id]);

        $this->service->update($accountId, $id, $input);

        return ['ok' => true, 'id' => $id];
    }

    public function destroy(int $accountId, int $id): array
    {
        $validator = Validator::make(
            ['id' => $id],
            ['id' => ['required', 'integer']]
        );

        if ($validator->fails()) {
            return [
                'ok' => false,
                'error' => 'Validation failed',
                'code' => 422,
                'details' => $validator->errors()->toArray(),
            ];
        }

        Log::info('IVR record mutated', ['op' => 'destroy', 'account_id' => $accountId, 'id' => $id]);

        $this->service->destroy($accountId, $id);

        return ['ok' => true];
    }

    public function sync(int $accountId, array $input): array
    {
        $result = $this->service->sync($accountId, $input);

        return [
            'ok' => true,
            'jobId' => $result['jobId'],
            'status' => $result['status'],
            'implemented' => $result['implemented'],
        ];
    }
}
