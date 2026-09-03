<?php

namespace Tests\Unit\Ivr;

use App\Http\Controllers\Ivr\IvrHubController;
use Illuminate\Database\Query\Expression;
use Illuminate\Support\Facades\DB;
use ReflectionClass;
use Tests\TestCase;

class IvrHubControllerHourExpressionTest extends TestCase
{
    private function callHourExpression(string $driver, string $column): Expression
    {
        $controller = new IvrHubController();

        $reflection = new ReflectionClass($controller);
        $method = $reflection->getMethod('hourExpression');
        $method->setAccessible(true);

        // Mock the DB connection driver
        $connectionMock = $this->createMock(\Illuminate\Database\Connection::class);
        $connectionMock->method('getDriverName')->willReturn($driver);

        DB::shouldReceive('connection')->andReturn($connectionMock);
        DB::shouldReceive('raw')->andReturnUsing(fn ($sql) => new Expression($sql));

        return $method->invoke($controller, $column);
    }

    public function test_sqlite_returns_strftime_expression(): void
    {
        $controller = new IvrHubController();
        $reflection = new ReflectionClass($controller);
        $method = $reflection->getMethod('hourExpression');
        $method->setAccessible(true);

        // Test that for sqlite (default), the strftime format is used
        $connectionMock = $this->createMock(\Illuminate\Database\Connection::class);
        $connectionMock->method('getDriverName')->willReturn('sqlite');

        DB::shouldReceive('connection')->once()->andReturn($connectionMock);
        DB::shouldReceive('raw')->once()->with("CAST(strftime('%H', started_at) AS INTEGER)")->andReturn(new Expression("CAST(strftime('%H', started_at) AS INTEGER)"));

        $expr = $method->invoke($controller, 'started_at');

        $this->assertInstanceOf(Expression::class, $expr);
        $this->assertStringContainsString('strftime', (string) $expr->getValue(DB::getQueryGrammar()));
    }

    public function test_mysql_returns_hour_expression(): void
    {
        $controller = new IvrHubController();
        $reflection = new ReflectionClass($controller);
        $method = $reflection->getMethod('hourExpression');
        $method->setAccessible(true);

        $connectionMock = $this->createMock(\Illuminate\Database\Connection::class);
        $connectionMock->method('getDriverName')->willReturn('mysql');

        DB::shouldReceive('connection')->once()->andReturn($connectionMock);
        DB::shouldReceive('raw')->once()->with('HOUR(started_at)')->andReturn(new Expression('HOUR(started_at)'));

        $expr = $method->invoke($controller, 'started_at');

        $this->assertInstanceOf(Expression::class, $expr);
    }

    public function test_pgsql_returns_extract_expression(): void
    {
        $controller = new IvrHubController();
        $reflection = new ReflectionClass($controller);
        $method = $reflection->getMethod('hourExpression');
        $method->setAccessible(true);

        $connectionMock = $this->createMock(\Illuminate\Database\Connection::class);
        $connectionMock->method('getDriverName')->willReturn('pgsql');

        DB::shouldReceive('connection')->once()->andReturn($connectionMock);
        DB::shouldReceive('raw')->once()->with('EXTRACT(hour FROM started_at)')->andReturn(new Expression('EXTRACT(hour FROM started_at)'));

        $expr = $method->invoke($controller, 'started_at');

        $this->assertInstanceOf(Expression::class, $expr);
    }
}
