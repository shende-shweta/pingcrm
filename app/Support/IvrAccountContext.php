<?php

namespace App\Support;

use App\Models\Organization;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

final class IvrAccountContext
{
    private ?array $memoQueueIds = null;

    public function __construct(
        public readonly int $accountId,
        public readonly ?int $organizationId,
    ) {}

    public static function fromRequest(Request $request): self
    {
        $accountId = (int) $request->user()->account_id;
        $organizationId = null;
        $rawOrg = $request->input('organization_id');
        if ($rawOrg !== null && $rawOrg !== '') {
            $organizationId = Organization::query()
                ->where('account_id', $accountId)
                ->where('id', (int) $rawOrg)
                ->value('id');
            $organizationId = $organizationId ? (int) $organizationId : null;
        }

        return new self($accountId, $organizationId);
    }

    /** @return list<array{id: int, name: string}> */
    public static function organizationOptions(int $accountId): array
    {
        return Organization::query()
            ->where('account_id', $accountId)
            ->orderBy('name')
            ->limit(200)
            ->get(['id', 'name'])
            ->map(fn ($org) => ['id' => $org->id, 'name' => $org->name])
            ->all();
    }

    public function scopeAccount(Builder $query, string $column = 'account_id'): Builder
    {
        return $query->where($column, $this->accountId);
    }

    public function scopeOrganizationOn(Builder $query, string $column = 'organization_id'): Builder
    {
        if ($this->organizationId) {
            $query->where($column, $this->organizationId);
        }

        return $query;
    }

    /** @return list<int> */
    public function queueIdsForScope(): array
    {
        if ($this->memoQueueIds !== null) {
            return $this->memoQueueIds;
        }

        $query = DB::table('ivr_operational_queues')->where('account_id', $this->accountId);
        if ($this->organizationId) {
            $query->where('organization_id', $this->organizationId);
        }

        $result = $query->pluck('id')->map(fn ($id) => (int) $id)->all();

        $this->memoQueueIds = $result;

        return $this->memoQueueIds;
    }

    public function applyCallFilters(Builder $query, string $alias = 'ivr_call_records'): Builder
    {
        $this->scopeAccount($query, $alias.'.account_id');
        $this->scopeOrganizationOn($query, $alias.'.organization_id');

        return $query;
    }
}
