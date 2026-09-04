<?php

namespace Tests\Unit\Legacy;

use App\Legacy\Services\AgentDeskGodService;
use ReflectionClass;
use Tests\TestCase;

class AgentDeskGodServiceTest extends TestCase
{
    private AgentDeskGodService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new AgentDeskGodService();
    }

    public function test_class_has_correct_table(): void
    {
        $reflection = new ReflectionClass($this->service);
        $property = $reflection->getProperty('table');
        $property->setAccessible(true);

        $this->assertEquals('ivr_agent_desks', $property->getValue($this->service));
    }

    public function test_class_has_required_allowed_fields(): void
    {
        $reflection = new ReflectionClass($this->service);
        $property = $reflection->getProperty('allowedFields');
        $property->setAccessible(true);

        $allowedFields = $property->getValue($this->service);

        $this->assertContains('name', $allowedFields);
        $this->assertContains('payload', $allowedFields);
        $this->assertContains('status', $allowedFields);
    }
}
