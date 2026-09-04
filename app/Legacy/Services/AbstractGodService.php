<?php

namespace App\Legacy\Services;

use App\Jobs\IvrSyncJob;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

abstract class AbstractGodService
{
    protected string $table;

    protected array $allowedFields = [];

    public function index(int $accountId, ?string $search = null, int $limit = 100): Collection
    {
        $query = DB::table($this->table)->where('account_id', $accountId);

        if ($search !== null && $search !== '') {
            $query->where('name', 'like', '%'.$search.'%');
        }

        return $query->limit(min($limit, 100))->get();
    }

    public function store(int $accountId, array $data): int
    {
        $row = Arr::only($data, $this->allowedFields);
        $row['account_id'] = $accountId;
        $row['created_at'] = now();

        return DB::table($this->table)->insertGetId($row);
    }

    public function update(int $accountId, int $id, array $data): bool
    {
        $row = Arr::only($data, $this->allowedFields);
        $row['updated_at'] = now();

        return (bool) DB::table($this->table)
            ->where('account_id', $accountId)
            ->where('id', $id)
            ->update($row);
    }

    public function destroy(int $accountId, int $id): bool
    {
        return (bool) DB::table($this->table)
            ->where('account_id', $accountId)
            ->where('id', $id)
            ->delete();
    }

    public function sync(int $accountId, array $payload): array
    {
        IvrSyncJob::dispatch($this->table, $accountId, Arr::only($payload, $this->allowedFields));

        return [
            'jobId' => uniqid('sync_', true),
            'status' => 'queued',
            'implemented' => false,
        ];
    }
}
